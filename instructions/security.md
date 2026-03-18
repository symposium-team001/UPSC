# security.md — Security Architecture & Threat Model
## UPSC Educational Platform — Web + Mobile Backend

> This document covers every attack vector relevant to a Node.js/Express API  
> serving both a React web app and a React Native mobile app.  
> Every section includes: the threat, the implementation, and the code pattern.

---

## Security Layers Overview

```
Internet
  ↓
[Nginx/Caddy]         ← TLS termination, DDoS basic filter
  ↓
[Rate Limiter]        ← express-rate-limit + Redis
  ↓
[Helmet.js]           ← Secure HTTP headers
  ↓
[CORS]                ← Strict origin allowlist
  ↓
[Body parser limits]  ← Payload size cap
  ↓
[Auth Middleware]     ← JWT verification
  ↓
[Role Guard]          ← RBAC check
  ↓
[Zod Validation]      ← Input sanitization
  ↓
[Service Layer]       ← Business logic
  ↓
[MongoDB]             ← Parameterized queries (Mongoose)
```

---

## 1. Transport Security (HTTPS / TLS)

**Threat:** Man-in-the-middle attacks, credential interception on mobile networks.

### Implementation

- All traffic served over HTTPS only. HTTP redirects to HTTPS at the reverse proxy.
- TLS 1.2 minimum. TLS 1.3 preferred.
- HSTS header set with `includeSubDomains` and `preload`.

```nginx
# Nginx config
server {
  listen 80;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
}
```

```js
// Express — trust proxy for Nginx passthrough
app.set('trust proxy', 1);
```

**Mobile note:** React Native app must pin certificate or at minimum enforce HTTPS in network config. Never allow cleartext on Android (`android:usesCleartextTraffic="false"` in AndroidManifest).

---

## 2. Security Headers (Helmet.js)

**Threat:** XSS via injected scripts, clickjacking, MIME sniffing, information disclosure via headers.

```js
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  hidePoweredBy: true,   // removes X-Powered-By: Express
}));
```

---

## 3. CORS — Cross-Origin Resource Sharing

**Threat:** Malicious websites making authenticated requests on behalf of logged-in users.

```js
import cors from 'cors';
import { config } from './config/env.js';

const allowedOrigins = config.CORS_ORIGINS.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (React Native / mobile apps send no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,         // required for cookies
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  maxAge: 86400,             // preflight cache: 24h
}));
```

**Mobile note:** React Native does not send an `Origin` header by default. The `!origin` check above allows the app through. This is correct and safe — mobile apps cannot be driven by malicious websites.

---

## 4. Authentication Security

### 4.1 Password Hashing

**Threat:** Database breach exposing plaintext passwords.

```js
import bcrypt from 'bcrypt';
const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// On signup
const passwordHash = await bcrypt.hash(plainPassword, ROUNDS);

// On login — use constant-time comparison (bcrypt.compare does this)
const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
// Always use a generic message — never reveal which field failed
if (!isMatch) throw new AppError(401, 'Invalid credentials');
```

**Never** use MD5, SHA1, SHA256 for passwords. Only bcrypt/argon2/scrypt.

### 4.2 JWT Security

**Threat:** Token theft, token forgery, long-lived token abuse.

```js
// jwt.utils.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRY,  // '15m'
    algorithm: 'HS256',
    issuer: 'upsc-platform',
    audience: 'upsc-client',
  });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
      issuer: 'upsc-platform',
      audience: 'upsc-client',
    });
  } catch (err) {
    throw new AppError(401, 'Invalid or expired token');
  }
};
```

**Rules:**
- Access token: 15 minutes expiry. Sent in `Authorization: Bearer` header.
- Refresh token: 7 days expiry. Sent and stored in `HttpOnly; Secure; SameSite=Strict` cookie.
- Refresh token hash stored in DB — raw token never stored.
- Token payload contains only: `{ userId, role, sessionId }` — no sensitive data.

### 4.3 Refresh Token Rotation + Reuse Detection

**Threat:** Stolen refresh token being used multiple times.

```js
// authService.js
export const refreshTokens = async (incomingRefreshToken) => {
  const payload = verifyRefreshToken(incomingRefreshToken);
  const user = await User.findById(payload.userId).select('+refreshTokenHash');

  if (!user) throw new AppError(401, 'User not found');

  // Compare incoming token hash to stored hash
  const isValid = await bcrypt.compare(incomingRefreshToken, user.refreshTokenHash);

  if (!isValid) {
    // Reuse detected — token family compromise
    // Revoke all sessions for this user
    await User.findByIdAndUpdate(payload.userId, { refreshTokenHash: null });
    throw new AppError(401, 'Token reuse detected. Please login again.');
  }

  // Rotate: generate new pair, store new hash
  const newAccessToken = signAccessToken({ userId: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user._id });
  const newHash = await bcrypt.hash(newRefreshToken, 10);
  await User.findByIdAndUpdate(user._id, { refreshTokenHash: newHash });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
```

### 4.4 Auth Middleware

```js
// auth.middleware.js
export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    throw new AppError(401, 'Authentication required');

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  // Verify user still exists and is active
  const user = await User.findById(payload.userId).select('_id role status emailVerified');
  if (!user) throw new AppError(401, 'User no longer exists');
  if (user.status !== 'ACTIVE') throw new AppError(403, 'Account suspended');

  req.user = user;
  next();
});
```

---

## 5. Rate Limiting & Brute Force Protection

**Threat:** Credential stuffing, OTP brute force, API abuse, DDoS.

```js
// rateLimiter.middleware.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';

// Global rate limit — all routes
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  message: { success: false, message: 'Too many requests. Try again later.' },
});

// Auth routes — stricter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  message: { success: false, message: 'Too many login attempts. Try in 15 minutes.' },
  skipSuccessfulRequests: true,  // only counts failed attempts
});

// OTP routes — very strict
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  message: { success: false, message: 'OTP limit reached. Wait 15 minutes.' },
});
```

```js
// app.js — apply limiters
app.use(globalLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/signup', authLimiter);
app.use('/api/v1/auth/otp', otpLimiter);
```

---

## 6. Input Validation & Injection Prevention

**Threat:** NoSQL injection, XSS via stored data, prototype pollution, oversized payloads.

### 6.1 Zod Validation (every route, no exceptions)

```js
// auth.validation.js
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email().toLowerCase().trim().max(255),
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .max(72, 'Maximum 72 characters')  // bcrypt max
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
  fullName: z.string().trim().min(2).max(100),
  role: z.enum(['STUDENT', 'INSTRUCTOR']).default('STUDENT'),
  // Never allow client to set role: ADMIN
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});
```

### 6.2 Body parser limits — prevent large payload attacks

```js
app.use(express.json({ limit: '10kb' }));        // JSON body max 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

### 6.3 Mongoose — parameterized queries prevent NoSQL injection

```js
// SAFE — Mongoose escapes these values
const user = await User.findOne({ email: req.body.email });

// DANGEROUS — never do this
const user = await User.findOne(req.body);  // attacker can pass { $gt: '' }
```

Always destructure and validate before passing to Mongoose:
```js
const { email } = loginSchema.parse(req.body);  // Zod ensures string type
const user = await User.findOne({ email });
```

### 6.4 Prototype pollution prevention

```js
// In app.js — before route registration
app.use((req, res, next) => {
  if (req.body) {
    delete req.body.__proto__;
    delete req.body.constructor;
    delete req.body.prototype;
  }
  next();
});
```

Or use `express-mongo-sanitize`:
```js
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());  // strips $ and . from req.body, req.params, req.query
```

---

## 7. Session & Cookie Security

**Threat:** Cookie theft via XSS, CSRF attacks, session fixation.

```js
// Cookie settings for refresh token
const COOKIE_OPTIONS = {
  httpOnly: true,                     // not accessible via JS — blocks XSS theft
  secure: process.env.NODE_ENV === 'production',  // HTTPS only
  sameSite: 'strict',                 // blocks CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/api/v1/auth',              // scope to auth routes only
  signed: true,                      // HMAC signature via COOKIE_SECRET
};

res.cookie('refreshToken', token, COOKIE_OPTIONS);
```

**Why `SameSite=Strict` prevents CSRF:**  
A request from `malicious.com` to your API will not include the cookie.  
Only requests originating from your own domain include it.

**For mobile app:**  
React Native does not use cookies. The mobile client should store the access token in **memory only** (Zustand state) — never in AsyncStorage, which is unencrypted. The refresh token for mobile should be sent in the request body and stored in the device Keychain/Keystore.

---

## 8. CSRF Protection

**Threat:** Forged requests from malicious websites executing actions on behalf of authenticated users.

For **web app:** `SameSite=Strict` on the refresh token cookie is the primary CSRF defense.  
For **state-changing API endpoints** (POST/PATCH/DELETE) that use cookie auth:

```js
import csrf from 'csurf';

// Only apply to web-facing cookie-based routes
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true } });
app.use('/api/v1/auth/refresh', csrfProtection);
```

For **mobile API routes** using Bearer token (no cookies): CSRF does not apply — browsers are the attack surface.

---

## 9. Sensitive Data Exposure Prevention

**Threat:** Leaking password hashes, tokens, internal IDs in API responses.

### 9.1 Model-level toJSON transform

```js
// User.model.js
userSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});
```

### 9.2 Explicit field selection in queries

```js
// Always exclude sensitive fields explicitly
const user = await User.findById(id).select('-passwordHash -refreshTokenHash');

// When you DO need the hash (login), be explicit
const user = await User.findOne({ email }).select('+passwordHash');
```

### 9.3 Error response scrubbing

```js
// error.middleware.js
export const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // AppError = intentional, safe to expose message
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      ...(isDev && { stack: err.stack }),  // stack only in dev
    });
  }

  // Unknown error — never expose internals in production
  logger.error({ message: err.message, stack: err.stack, path: req.path, method: req.method });
  res.status(500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
};
```

---

## 10. MongoDB Security

**Threat:** Injection, over-fetching, unbounded queries crashing the server.

### 10.1 Connection security

```js
// config/db.js
mongoose.connect(config.MONGO_URI, {
  autoIndex: false,          // disable in production — manage indexes explicitly
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

Use a **dedicated MongoDB user** with minimal permissions:
```
db.createUser({
  user: "upsc_app",
  pwd: "<strong-random-password>",
  roles: [{ role: "readWrite", db: "upsc_db" }]
})
```
Never connect with the `root` or `admin` user.

### 10.2 Prevent unbounded queries

```js
// paginate.utils.js
export const paginate = async (model, query, options) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(50, parseInt(options.limit) || 20);  // hard cap at 50
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).lean(),
    model.countDocuments(query),
  ]);

  return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
};
```

### 10.3 Lean queries for read-only operations

```js
// .lean() returns plain JS objects — much faster for read operations
const articles = await Article.find({ isPublished: true }).lean();
```

---

## 11. Dependency Security

**Threat:** Supply chain attacks via malicious or outdated npm packages.

```bash
# Run on every deployment
npm audit
npm audit fix

# Pin dependencies — use exact versions in package.json
npm install <package> --save-exact

# Use lockfile — never delete package-lock.json
```

Packages to audit specifically: `jsonwebtoken`, `bcrypt`, `mongoose`, `express`.

Enable GitHub/GitLab **Dependabot** or **Renovate** for automated security PRs.

---

## 12. Environment Variable Security

**Threat:** Hardcoded secrets in source code, committed `.env` files.

```gitignore
# .gitignore — non-negotiable
.env
.env.*
!.env.example
```

```js
// config/env.js — validated at startup
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  MONGO_URI: z.string().url(),
  REDIS_URL: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  COOKIE_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string(),
});

export const config = envSchema.parse(process.env);
// Throws ZodError at startup if any var is missing or malformed
// Server never starts with a broken configuration
```

---

## 13. Logging Security

**Threat:** Sensitive data appearing in logs, insufficient audit trail.

```js
// logger.js
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({ format: winston.format.simple() })]
      : []),
  ],
});
```

**Never log:** passwords, tokens, full request bodies (only log field names), credit card numbers, OTP values, private keys.

**Do log:** request method + path, user ID (not email), status codes, error messages, IP addresses for auth failures.

---

## 14. File Upload Security

**If the platform adds profile photo / document uploads:**

```js
import multer from 'multer';
import path from 'path';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB

const upload = multer({
  storage: multer.memoryStorage(),       // never write to disk
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new AppError(400, 'Only JPEG, PNG, WebP images allowed'));
    }
    // Verify extension matches mimetype
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return cb(new AppError(400, 'File extension mismatch'));
    }
    cb(null, true);
  },
});
```

Upload to **S3 / Cloudflare R2** with a random UUID filename — never use the original filename from the client.

---

## 15. Mobile App Specific Security

**Threats unique to React Native / Expo:**

| Threat | Mitigation |
|---|---|
| Token stored in AsyncStorage (unencrypted) | Store access token in memory (Zustand). Use `expo-secure-store` for refresh token — backed by Keychain (iOS) / Keystore (Android) |
| Cleartext HTTP on Android | Set `android:usesCleartextTraffic="false"` in `AndroidManifest.xml` |
| Debug builds in production | Ensure `__DEV__` flag is false. Strip console.log in production builds |
| Bundle reverse engineering | Enable Hermes engine. Do not embed API keys in the bundle |
| Certificate pinning bypass | Use `react-native-ssl-pinning` for production — pin the server's TLS certificate |
| Deep link hijacking | Validate deep link origins. Use Universal Links (iOS) / App Links (Android) — not custom URL schemes |

---

## 16. Admin Route Security

```js
// Extra layers for admin routes
router.use('/admin', 
  verifyToken,                    // must be authenticated
  checkRole('ADMIN'),             // must be ADMIN role
  adminActionLogger,              // log every admin action
  // Consider: IP allowlist for admin routes
);
```

Admin action logger:
```js
export const adminActionLogger = (req, res, next) => {
  logger.warn({
    event: 'ADMIN_ACTION',
    userId: req.user._id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
};
```

---

## 17. Payment Security (Razorpay)

**Threat:** Fake payment confirmations — client sends "payment successful" without actual payment.

```js
// subscriptions.service.js
import crypto from 'crypto';

export const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const expectedSignature = crypto
    .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError(400, 'Payment verification failed');
  }
  // Only create subscription AFTER signature is verified
};
```

**Never activate a subscription based on client-side confirmation alone.** Always verify the Razorpay webhook signature or the payment ID signature server-side.

---

## 18. Security Checklist — Pre-Deployment

### Code Review
- [ ] No hardcoded secrets, API keys, or passwords in source
- [ ] `.env` is in `.gitignore`
- [ ] All routes behind auth have `verifyToken`
- [ ] All admin routes have `checkRole('ADMIN')`
- [ ] All premium routes have `requirePremium`
- [ ] Zod validation on every POST/PATCH endpoint
- [ ] No `find({})` without filter + pagination
- [ ] `select('-passwordHash -refreshTokenHash')` on all user queries
- [ ] No stack traces returned in production responses
- [ ] Rate limiters applied on auth and OTP routes

### Infrastructure
- [ ] HTTPS enforced at reverse proxy
- [ ] MongoDB user has minimal permissions (readWrite only)
- [ ] Redis not exposed publicly
- [ ] `NODE_ENV=production` set
- [ ] `npm audit` passes with no high/critical vulnerabilities
- [ ] Logs do not contain passwords or tokens
- [ ] CORS allowlist contains only production origins

### Mobile
- [ ] Cleartext HTTP disabled on Android
- [ ] Access token stored in memory, not AsyncStorage
- [ ] Refresh token stored in Keychain/Keystore
- [ ] No API keys embedded in JS bundle

---

## 19. Incident Response

If a token compromise or data breach is suspected:

1. **Immediate:** Rotate `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in env — this invalidates ALL active sessions.
2. **Immediate:** Set `refreshTokenHash: null` for all users in DB — forces full re-login.
3. **Investigate:** Check logs for anomalous IPs, unusual request patterns, reuse detection alerts.
4. **Notify:** Per applicable data protection regulations (PDPB India) — notify affected users within 72 hours.
5. **Patch:** Identify the vector, patch, redeploy, verify.
