# TUTOR.md — End-to-End Build Guide
## UPSC Backend — Gemini CLI + Antigravity Flash

> This file maps every phase and every file in instructions.md to the exact
> tool to use, the exact prompt to send, and the exact verification to run.
> Follow it line by line. Never skip a step.

---

## Your Two Tools — When to Use Each

| Situation | Use |
|---|---|
| Writing files directly to disk | **Gemini CLI** |
| Reading existing project files for context | **Gemini CLI** |
| Auditing the whole codebase for violations | **Gemini CLI** |
| Fixing broken files with error messages | **Gemini CLI** |
| Generating first draft of complex logic | **Antigravity Flash** |
| Generating Zod validation schemas | **Antigravity Flash** |
| Generating self-contained service logic | **Antigravity Flash** |
| Second-opinion review of a single file | **Antigravity Flash** |

**Simple rule:** CLI has eyes on your disk. Flash is faster but blind to your files.
Use Flash to think, CLI to write and verify.

---

## Before You Touch Any Phase — Do This Once

### 1. Create your .env file

```bash
cd Backend
cp .env.example .env
```

Fill every value in `.env` before running any phase. The server refuses to start
without all vars. See Section 3 of instructions.md for the full list.

Generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run twice — one for JWT_ACCESS_SECRET, one for JWT_REFRESH_SECRET.

### 2. Set package.json to ES Modules

```json
{
  "type": "module"
}
```

Do this manually before asking any AI to generate code. Every import in this
project uses ES Module syntax. If this is missing, every generated file breaks.

### 3. Lock Gemini CLI at the start of every session

Open terminal, navigate to Backend/, start CLI, then type this as your
very first message — every single session:

```
@GEMINI.md @instructions.md

You are locked to these rules for this entire session:
- Senior engineer mode — production SaaS, not a demo
- Layer separation: Routes → Controllers → Services → Models → Middlewares
- Response contract frozen: { success, message, data } — never change this
- ES Modules only — no require() anywhere
- asyncHandler on every async controller — no exceptions
- No mock logic, no placeholder data, no hardcoded values
- No business logic in routes or controllers
- No req/res objects in services
- No passwordHash or refreshTokenHash in any response
- No .find({}) without filter and pagination
- Do not generate future phase code
- One file at a time — wait for my confirmation after each file
- Wait for my confirmation before moving to the next phase

Current phase: [TYPE PHASE NUMBER]

Confirm you have read GEMINI.md and instructions.md and understood all rules.
```

Do not type anything else until the agent confirms.

### 4. Lock Antigravity Flash at the start of every session

Open Antigravity, paste GEMINI.md content first, then send:

```
Read the above project context. Do not generate any code yet.

Confirm you understand:
1. Layer separation — Routes/Controllers/Services/Models/Middlewares
2. Response contract: { success, message, data } — frozen, never change
3. ES Modules only — no require()
4. asyncHandler on every async controller
5. Zod validation in every service that accepts input
6. No mock logic, no placeholder data
7. One file per prompt — I will tell you what to generate

Confirm all rules understood.
```

---

## PHASE 0 — Manual Scaffold (You Do This, No AI)

**Tool: You (terminal only)**

Do not ask any AI to create the folder structure. Do it yourself so you know
exactly what exists before the AI starts writing files.

```bash
cd Backend
npm init -y

# Set "type": "module" in package.json manually

npm install express mongoose ioredis dotenv zod bcrypt jsonwebtoken \
  helmet cors morgan express-rate-limit rate-limit-redis \
  express-mongo-sanitize cookie-parser winston bull

npm install -D nodemon

# Create folder structure
mkdir src\config
mkdir src\middlewares
mkdir src\models
mkdir src\utils
mkdir src\jobs
mkdir src\routes
mkdir src\modules\auth
mkdir src\modules\users
mkdir src\modules\courses
mkdir src\modules\exams
mkdir src\modules\current-affairs
mkdir src\modules\gamification
mkdir src\modules\subscriptions
mkdir src\modules\notifications
mkdir src\modules\ai-analyst
mkdir src\modules\admin

# Create empty files
type nul > server.js
type nul > src\app.js
type nul > src\routes\index.js
type nul > src\config\env.js
type nul > src\config\db.js
type nul > src\config\redis.js
type nul > src\utils\apiResponse.js
type nul > src\utils\apiError.js
type nul > src\utils\logger.js
type nul > src\utils\jwt.utils.js
type nul > src\utils\otp.utils.js
type nul > src\utils\paginate.utils.js
type nul > src\middlewares\asyncHandler.js
type nul > src\middlewares\error.middleware.js
type nul > src\middlewares\auth.middleware.js
type nul > src\middlewares\role.middleware.js
type nul > src\middlewares\subscription.middleware.js
type nul > src\middlewares\rateLimiter.middleware.js
```

Add to package.json scripts:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "lint": "eslint src/",
    "test": "node --experimental-vm-modules node_modules/.bin/jest"
  }
}
```

✅ Phase 0 done when: folder structure matches Section 4 of instructions.md exactly.

---

## PHASE 1 — Infrastructure

**Primary tool: Gemini CLI**
**Why CLI:** These files wire together (env → db → app → server). CLI can read
each file after writing it and check the imports chain is consistent.

Files to generate in this exact order:

---

### File 1 of 10: src/config/env.js

**In CLI:**
```
@GEMINI.md

Generate ONLY: src/config/env.js

Requirements:
- Use Zod to parse process.env
- Validate every variable listed in the env section of instructions.md:
  NODE_ENV, PORT, MONGO_URI, REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY, BCRYPT_ROUNDS, COOKIE_SECRET,
  CORS_ORIGINS, OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX, OTP_RATE_LIMIT_MAX, RESEND_API_KEY, FCM_SERVER_KEY,
  RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- Export a single typed config object
- If any required var is missing, throw immediately with a clear message
- Server must never start with broken config
- ES Modules only
```

✅ Done when: file exists, exports config object, throws on missing vars.

---

### File 2 of 10: src/config/db.js

**In CLI:**
```
@GEMINI.md @src/config/env.js @src/utils/logger.js

Generate ONLY: src/config/db.js

Requirements:
- Import config from env.js — use config.MONGO_URI
- mongoose.connect() with these options: serverSelectionTimeoutMS 5000, socketTimeoutMS 45000
- Retry logic: if connection fails, wait 5 seconds and retry up to 5 times
- Log connection events: connected, error, disconnected — use logger
- Export connectDB function
- ES Modules only
```

✅ Done when: exports connectDB, has retry logic, logs events.

---

### File 3 of 10: src/config/redis.js

**In CLI:**
```
@GEMINI.md @src/config/env.js @src/utils/logger.js

Generate ONLY: src/config/redis.js

Requirements:
- Import config from env.js — use config.REDIS_URL
- Create ioredis client singleton
- Log connect and error events
- Export the client
- ES Modules only
```

✅ Done when: exports single ioredis client instance.

---

### File 4 of 10: src/utils/apiError.js

**In CLI:**
```
@GEMINI.md

Generate ONLY: src/utils/apiError.js

Requirements:
- class AppError extends Error
- constructor(statusCode, message, errors = [])
- Set this.statusCode, this.message, this.errors, this.isOperational = true
- isOperational flag is used by error middleware to identify safe-to-expose errors
- ES Modules only
- Export as named export: AppError
```

✅ Done when: AppError class exported, has isOperational = true.

---

### File 5 of 10: src/utils/apiResponse.js

**In CLI:**
```
@GEMINI.md

Generate ONLY: src/utils/apiResponse.js

Requirements:
- sendSuccess(res, data, message = 'Success', statusCode = 200)
  → res.status(statusCode).json({ success: true, message, data })
- sendError(res, message = 'Error', statusCode = 500, errors = [])
  → res.status(statusCode).json({ success: false, message, errors })
- These two functions are the ONLY way responses are sent in this project
- Shape is frozen — never add top-level keys, never rename fields
- ES Modules only
- Export both as named exports
```

✅ Done when: both functions exported, shape exactly matches contract.

---

### File 6 of 10: src/utils/logger.js

**In CLI:**
```
@GEMINI.md @src/config/env.js

Generate ONLY: src/utils/logger.js

Requirements:
- Winston logger
- Console transport in development, file transport in production
- Two log files: logs/error.log (errors only) and logs/combined.log (all)
- Never log passwords, tokens, or sensitive values
- Format: timestamp + level + message + JSON metadata
- Export logger as default export
- ES Modules only
```

✅ Done when: logger exported, two transports configured.

---

### File 7 of 10: src/utils/paginate.utils.js

**In CLI:**
```
@GEMINI.md

Generate ONLY: src/utils/paginate.utils.js

Requirements:
- paginate(model, query, options) async function
- options: { page, limit, sort, populate }
- page defaults to 1, minimum 1
- limit defaults to 20, HARD CAP at 50 — never trust client limit
- Returns: { data, page, limit, total, totalPages }
- Use .lean() for read performance
- ES Modules only
- Export as named export: paginate
```

✅ Done when: limit is hard-capped at 50, returns full pagination object.

---

### File 8 of 10: src/middlewares/asyncHandler.js

**In CLI:**
```
@GEMINI.md

Generate ONLY: src/middlewares/asyncHandler.js

Requirements:
- export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)
- This wraps every async controller in this project
- No try/catch in controllers — this handles it
- ES Modules only
```

✅ Done when: single function exported, catches and forwards to next.

---

### File 9 of 10: src/middlewares/error.middleware.js

**In CLI:**
```
@GEMINI.md @src/utils/apiError.js @src/utils/logger.js

Generate ONLY: src/middlewares/error.middleware.js

Requirements from instructions.md Section 8 Error Handling Flow:
- Catches AppError (isOperational = true): return err.statusCode + err.message
- Catches ZodError: return 422 + formatted field-level errors
- Catches unknown errors: return 500 + "Internal server error" (no details in prod)
- Always: log full error + stack via logger (Winston)
- Never expose stack trace when NODE_ENV = production
- Dev mode: include stack in response for debugging
- Response shape must match contract: { success, message, errors }
- ES Modules only
- Export as named export: errorHandler
```

✅ Done when: handles all three error types, never leaks stack in prod.

---

### File 10 of 10: src/app.js + server.js

**In CLI — generate app.js first:**
```
@GEMINI.md @src/config/env.js @src/middlewares/error.middleware.js @src/routes/index.js

Generate ONLY: src/app.js

Requirements:
- Import and apply in this exact order:
  1. helmet() with full config
  2. cors() — use config.CORS_ORIGINS split by comma, credentials: true
     mobile apps send no Origin header — allow requests with no origin
  3. morgan('dev') in development
  4. express.json({ limit: '10kb' })
  5. express.urlencoded({ extended: true, limit: '10kb' })
  6. express-mongo-sanitize (strips $ and . from inputs)
  7. cookieParser(config.COOKIE_SECRET) for signed cookies
  8. Routes mounted at /api/v1 from src/routes/index.js
  9. errorHandler middleware LAST
- Export app as default export
- ES Modules only
```

**Then generate server.js:**
```
@GEMINI.md @src/config/env.js @src/config/db.js @src/config/redis.js @src/app.js

Generate ONLY: server.js

Requirements:
- Import env.js FIRST — Zod validates on import, throws before anything else
- Import and call connectDB()
- Import redis client (triggers connection)
- Import app
- Only call app.listen() after DB is connected
- Handle process.on('unhandledRejection') — log and graceful shutdown
- Handle process.on('uncaughtException') — log and exit
- Log startup sequence with checkmarks matching instructions.md expected output
- ES Modules only
```

---

### Phase 1 Verification — Run This in CLI

```
@GEMINI.md
@src/config/env.js @src/config/db.js @src/config/redis.js
@src/utils/apiError.js @src/utils/apiResponse.js @src/utils/logger.js
@src/utils/paginate.utils.js @src/middlewares/asyncHandler.js
@src/middlewares/error.middleware.js @src/app.js @server.js

Audit ALL Phase 1 files. Check:

1. Does env.js throw if any required var is missing?
2. Does db.js import from env.js using config.MONGO_URI?
3. Does apiResponse.js produce exactly { success, message, data } and nothing else?
4. Does paginate.utils.js cap limit at 50?
5. Does asyncHandler.js use Promise.resolve().catch(next)?
6. Does error.middleware.js handle AppError, ZodError, and unknown separately?
7. Does error.middleware.js hide stack trace in production?
8. Does app.js apply mongo-sanitize and cookie-parser?
9. Does server.js handle unhandledRejection and uncaughtException?
10. Any require() calls anywhere? (must be zero)
11. Any var declarations? (must be zero)

List every violation with file name and line number.
```

Then run:
```bash
npm run dev
```

Expected output:
```
[env]    ✓ Environment validated
[db]     ✓ MongoDB connected
[redis]  ✓ Redis connected
[server] ✓ Listening on port 5000
```

✅ Phase 1 complete only when: npm run dev boots cleanly with all four lines.

---

## PHASE 2 — Models

**Primary tool: Antigravity Flash (draft) + Gemini CLI (write + verify)**
**Why Flash:** Models are self-contained schemas with no cross-file logic.
Flash is fast here. CLI then cross-checks all refs are consistent.

Generate models in this order — dependencies first:

### Batch 1 (no dependencies on other models)

**In Flash — one prompt per model:**

```
[Paste GEMINI.md content]

Generate ONLY: src/models/User.model.js

Requirements from instructions.md Phase 2:
- email: String, unique index, lowercase, required
- passwordHash: String, required, select: false (never returned by default)
- role: enum ['STUDENT', 'INSTRUCTOR', 'ADMIN'], default 'STUDENT'
- status: enum ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default 'ACTIVE'
- refreshTokenHash: String, select: false
- emailVerified: Boolean, default false
- lastLoginAt: Date
- timestamps: true (createdAt/updatedAt)
- toJSON transform: delete passwordHash, refreshTokenHash, __v
- Index: email (unique), role, status
- ES Modules only
- Export: export default mongoose.model('User', userSchema)
```

Copy Flash output → paste into CLI:
```
Write this content to src/models/User.model.js:
[paste Flash output]
```

Repeat for each model below using the same pattern.

---

**User.model.js** — fields above ↑

**Profile.model.js:**
```
- user: ObjectId, ref 'User', required, unique index
- fullName: String, required, trim
- targetYear: String
- optionalSubject: String
- bio: String, maxLength 500
- attemptCount: Number, default 0
- dailyGoalHours: Number, default 2
- homeState: String
- avatarUrl: String
- timestamps: true
```

**UserStats.model.js:**
```
- user: ObjectId, ref 'User', required, unique index
- xp: Number, default 0
- level: Number, default 1
- currentStreak: Number, default 0
- highestStreak: Number, default 0
- lastActivityDate: Date
- articlesRead: Number, default 0
- recallRatePercentage: Number, default 0, min 0, max 100
- timestamps: true
```

**Article.model.js:**
```
- title: String, required, trim
- content: String, required
- tag: String, index (e.g. 'GS II • POLITY')
- source: String
- imageColor: String
- publishedDate: Date, index (descending for latest-first queries)
- isPublished: Boolean, default false, index
- createdBy: ObjectId, ref 'User'
- timestamps: true
```

**ChatSession.model.js:**
```
- user: ObjectId, ref 'User', required
- article: ObjectId, ref 'Article', required
- messages: Array of { role: enum['user','ai','mentor'], text: String required, timestamp: Date default Date.now }
- Compound index on: user + article (unique — one session per user per article)
- timestamps: true
```

### Batch 2 (depend on User/Article)

**Course.model.js:**
```
- title: String, required, trim, index
- description: String
- totalModules: Number, default 0
- createdBy: ObjectId, ref 'User'
- isPublished: Boolean, default false
- timestamps: true
```

**Lesson.model.js:**
```
- course: ObjectId, ref 'Course', required, index
- title: String, required
- orderIndex: Number, required
- content: String
- duration: Number (minutes)
- timestamps: true
- Compound index on: course + orderIndex
```

**Quiz.model.js:**
```
- course: ObjectId, ref 'Course'
- lesson: ObjectId, ref 'Lesson'
- title: String, required
- passingScore: Number, required, min 0, max 100
- totalQuestions: Number, default 0
- timestamps: true
- Validate: at least one of course or lesson must be provided
```

**Question.model.js:**
```
- quiz: ObjectId, ref 'Quiz', required, index
- text: String, required
- options: Array of String, required, minlength 2
- correctOptionIndex: Number, required, select: false
- explanation: String
- timestamps: true
```

**Submission.model.js:**
```
- student: ObjectId, ref 'User', required
- quiz: ObjectId, ref 'Quiz', required
- answers: Array of Number (selected option indexes)
- score: Number, required
- passed: Boolean, required
- attemptedAt: Date, default Date.now
- Compound index on: student + quiz
```

**Progress.model.js:**
```
- student: ObjectId, ref 'User', required
- course: ObjectId, ref 'Course', required
- completedLessons: Array of ObjectId ref 'Lesson'
- completionPercentage: Number, default 0, min 0, max 100
- Compound unique index on: student + course
- timestamps: true
```

**Achievement.model.js:**
```
- user: ObjectId, ref 'User', required, index
- badgeId: String, required (e.g. 'EARLY_BIRD', 'POLITY_KING')
- earnedAt: Date, default Date.now
- Compound unique index on: user + badgeId (can't earn same badge twice)
```

**Subscription.model.js:**
```
- student: ObjectId, ref 'User', required, index
- planType: enum ['MONTHLY', 'QUARTERLY', 'YEARLY'], required
- status: enum ['ACTIVE', 'EXPIRED'], default 'ACTIVE', index
- startDate: Date, default Date.now
- expiryDate: Date, required, index
- paymentRef: String (Razorpay payment ID)
- timestamps: true
- Compound index on: student + status
```

---

### Phase 2 Verification — Run This in CLI

```
@GEMINI.md
@src/models/User.model.js @src/models/Profile.model.js
@src/models/UserStats.model.js @src/models/ChatSession.model.js
@src/models/Course.model.js @src/models/Lesson.model.js
@src/models/Quiz.model.js @src/models/Question.model.js
@src/models/Submission.model.js @src/models/Progress.model.js
@src/models/Achievement.model.js @src/models/Subscription.model.js

Audit ALL Phase 2 models. Check every file:

1. passwordHash and correctOptionIndex have select: false?
2. User.model.js has toJSON transform removing passwordHash, refreshTokenHash, __v?
3. All ObjectId refs use the correct model name strings?
4. ChatSession has compound unique index on user + article?
5. Submission has compound index on student + quiz?
6. Progress has compound UNIQUE index on student + course?
7. Achievement has compound unique index on user + badgeId?
8. Subscription has index on student, status, and expiryDate?
9. Article.publishedDate has descending index?
10. Any business logic inside any model? (must be zero)
11. Any require() calls? (must be zero)

List every violation.
```

✅ Phase 2 complete only when: npm run dev still boots cleanly, zero violations.

---

## PHASE 3 — Authentication

**Primary tool: Antigravity Flash (service logic) + Gemini CLI (middleware + wiring)**
**Why this split:** auth.service.js has complex logic (bcrypt, JWT, token rotation)
where Flash excels at drafting. The middleware chain must be verified by CLI
against the actual model fields.

Files in order:

---

### File 1: src/modules/auth/auth.validation.js

**In Flash:**
```
[Paste GEMINI.md]

Generate ONLY: src/modules/auth/auth.validation.js

Requirements:
- signupSchema: email (string, email, lowercase, trim), password (min 8, max 72,
  must contain uppercase and number), fullName (string, min 2, max 100),
  role (enum STUDENT/INSTRUCTOR only — never ADMIN from client)
- loginSchema: email (string, email, lowercase, trim), password (string, min 1)
- refreshSchema: no body needed (token comes from cookie)
- Export all as named exports
- ES Modules only
```

---

### File 2: src/utils/jwt.utils.js

**In Flash:**
```
[Paste GEMINI.md]
[Paste src/config/env.js]

Generate ONLY: src/utils/jwt.utils.js

Requirements:
- signAccessToken(payload): signs with config.JWT_ACCESS_SECRET,
  expiry config.JWT_ACCESS_EXPIRY (15m), algorithm HS256,
  issuer 'upsc-platform', audience 'upsc-client'
- signRefreshToken(payload): signs with config.JWT_REFRESH_SECRET,
  expiry config.JWT_REFRESH_EXPIRY (7d)
- verifyAccessToken(token): verifies with algorithm HS256, issuer, audience.
  On failure throw new AppError(401, 'Invalid or expired token')
- verifyRefreshToken(token): verifies refresh token.
  On failure throw new AppError(401, 'Invalid or expired refresh token')
- Export all four as named exports
- ES Modules only
```

---

### File 3: src/modules/auth/auth.service.js

**In Flash — this is the most complex file, give it maximum context:**
```
[Paste GEMINI.md]
[Paste src/models/User.model.js]
[Paste src/models/Profile.model.js]
[Paste src/models/UserStats.model.js]
[Paste src/utils/apiError.js]
[Paste src/utils/jwt.utils.js]
[Paste src/modules/auth/auth.validation.js]

Generate ONLY: src/modules/auth/auth.service.js

Requirements from instructions.md Phase 3:

signup(body):
- Parse body with signupSchema (throws ZodError on invalid)
- Check if email already exists → throw AppError(409, 'Email already registered')
- Hash password with bcrypt (config.BCRYPT_ROUNDS)
- Create User document
- Create empty Profile document linked to user
- Create empty UserStats document linked to user
- Sign accessToken and refreshToken
- Hash refreshToken with bcrypt(10) → store hash in user.refreshTokenHash
- Return { accessToken, refreshToken, user }

login(body):
- Parse body with loginSchema
- Find user by email with select('+passwordHash')
- If not found → throw AppError(401, 'Invalid credentials') — generic, no hint
- If status !== ACTIVE → throw AppError(403, 'Account suspended')
- bcrypt.compare(password, user.passwordHash)
- If no match → throw AppError(401, 'Invalid credentials')
- Sign new accessToken + refreshToken
- Hash refreshToken → update user.refreshTokenHash + lastLoginAt
- Return { accessToken, refreshToken, user }

refreshTokens(incomingToken):
- verifyRefreshToken(incomingToken)
- Find user by payload.userId with select('+refreshTokenHash')
- If not found → throw AppError(401, 'User not found')
- bcrypt.compare(incomingToken, user.refreshTokenHash)
- If no match → TOKEN REUSE DETECTED:
  set user.refreshTokenHash = null (revokes all sessions)
  throw AppError(401, 'Token reuse detected. Please login again.')
- Issue new accessToken + refreshToken pair
- Store new hash, return both tokens

logout(userId):
- Set user.refreshTokenHash = null
- Return { message: 'Logged out' }

- ES Modules only
- No req or res objects anywhere in this file
```

---

### File 4: src/modules/auth/auth.controller.js

**In CLI (has access to the service file just written):**
```
@GEMINI.md @src/modules/auth/auth.service.js
@src/utils/apiResponse.js @src/middlewares/asyncHandler.js

Generate ONLY: src/modules/auth/auth.controller.js

Requirements:
- signup: calls authService.signup(req.body), sets refreshToken cookie,
  calls sendSuccess(res, { accessToken, user }, 'Account created', 201)
- login: calls authService.login(req.body), sets refreshToken cookie,
  calls sendSuccess(res, { accessToken, user }, 'Login successful')
- refresh: reads req.signedCookies.refreshToken, calls authService.refreshTokens(),
  sets new cookie, calls sendSuccess(res, { accessToken }, 'Token refreshed')
- logout: calls authService.logout(req.user._id), clears cookie,
  calls sendSuccess(res, null, 'Logged out')
- Cookie settings: httpOnly true, secure in production, sameSite strict,
  maxAge 7 days, path '/api/v1/auth', signed true
- All functions wrapped in asyncHandler
- No business logic — only req/res handling
- ES Modules only
```

---

### File 5: src/middlewares/auth.middleware.js

**In CLI:**
```
@GEMINI.md @src/utils/jwt.utils.js @src/utils/apiError.js
@src/models/User.model.js @src/middlewares/asyncHandler.js

Generate ONLY: src/middlewares/auth.middleware.js

Requirements:
- verifyToken middleware:
  1. Read Authorization header → extract Bearer token
  2. If missing → throw AppError(401, 'Authentication required')
  3. verifyAccessToken(token)
  4. Find user by payload.userId — select only _id, role, status, emailVerified
  5. If user not found → throw AppError(401, 'User no longer exists')
  6. If user.status !== 'ACTIVE' → throw AppError(403, 'Account suspended')
  7. Attach user to req.user
  8. Call next()
- Wrapped in asyncHandler
- ES Modules only
```

---

### File 6: src/middlewares/role.middleware.js

**In CLI:**
```
@GEMINI.md @src/utils/apiError.js

Generate ONLY: src/middlewares/role.middleware.js

Requirements:
- checkRole(...roles) returns a middleware function
- Middleware checks req.user.role against the allowed roles array
- If req.user not set → throw AppError(401, 'Authentication required')
- If role not in allowed list → throw AppError(403, 'Insufficient permissions')
- Usage: checkRole('ADMIN') or checkRole('INSTRUCTOR', 'ADMIN')
- ES Modules only
```

---

### File 7: src/middlewares/subscription.middleware.js

**In CLI:**
```
@GEMINI.md @src/models/Subscription.model.js
@src/utils/apiError.js @src/middlewares/asyncHandler.js

Generate ONLY: src/middlewares/subscription.middleware.js

Requirements:
- requirePremium middleware:
  1. Find Subscription where student = req.user._id
     AND status = 'ACTIVE'
     AND expiryDate > new Date()
  2. If not found → throw AppError(403, 'Active subscription required')
  3. If found → attach to req.subscription and call next()
- Wrapped in asyncHandler
- ES Modules only
```

---

### File 8: src/middlewares/rateLimiter.middleware.js

**In CLI:**
```
@GEMINI.md @src/config/env.js @src/config/redis.js

Generate ONLY: src/middlewares/rateLimiter.middleware.js

Requirements:
- globalLimiter: windowMs config.RATE_LIMIT_WINDOW_MS,
  max config.RATE_LIMIT_MAX, Redis store via rate-limit-redis
- authLimiter: windowMs 15 minutes, max 10,
  skipSuccessfulRequests true (only counts failed attempts), Redis store
- otpLimiter: windowMs 15 minutes, max config.OTP_RATE_LIMIT_MAX, Redis store
- All use standard headers, no legacy headers
- Error message shape: { success: false, message: 'Too many requests...' }
- Export all three as named exports
- ES Modules only
```

---

### File 9: src/modules/auth/auth.routes.js

**In CLI:**
```
@GEMINI.md @src/modules/auth/auth.controller.js
@src/middlewares/auth.middleware.js @src/middlewares/rateLimiter.middleware.js

Generate ONLY: src/modules/auth/auth.routes.js

Requirements:
- POST /signup — authLimiter, signup controller
- POST /login — authLimiter, login controller
- POST /refresh — refresh controller (no auth needed, uses cookie)
- POST /logout — verifyToken, logout controller
- No logic in this file — only route declarations
- ES Modules only
```

---

### File 10: src/routes/index.js

**In CLI:**
```
@GEMINI.md @src/modules/auth/auth.routes.js

Generate ONLY: src/routes/index.js

Requirements:
- Mount authRouter at /auth
- All routes mounted under /api/v1 prefix (set in app.js)
- This file will grow as phases are added — structure for extension
- ES Modules only
```

---

### Phase 3 Verification — Run in CLI

```
@GEMINI.md
@src/modules/auth/auth.service.js @src/modules/auth/auth.controller.js
@src/modules/auth/auth.routes.js @src/modules/auth/auth.validation.js
@src/middlewares/auth.middleware.js @src/middlewares/role.middleware.js
@src/middlewares/subscription.middleware.js @src/middlewares/rateLimiter.middleware.js

Audit ALL Phase 3 files. Check:

1. auth.service.js — any req or res objects? (must be zero)
2. auth.controller.js — any business logic or DB calls? (must be zero)
3. auth.routes.js — any logic? (must be zero — only middleware chain)
4. signup: does it create Profile AND UserStats atomically with User?
5. login: does it return the same error for wrong email AND wrong password?
6. refreshTokens: does reuse detection set refreshTokenHash to null?
7. auth.middleware.js: does it check user.status === 'ACTIVE'?
8. requirePremium: does it check BOTH status AND expiryDate > now?
9. rateLimiter: is Redis store used for all three limiters?
10. cookie: httpOnly, secure (prod only), sameSite strict, signed?
11. Any require() calls? (must be zero)
12. Every async controller wrapped in asyncHandler? (must be yes)
```

Then test with Bruno or Postman:
```
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json
{ "email": "test@test.com", "password": "Test1234", "fullName": "Test User" }

Expected: 201, { success: true, message: "Account created", data: { accessToken, user } }
```

✅ Phase 3 complete only when: signup, login, refresh, logout all work via HTTP.
DO NOT start Phase 4 until this passes real HTTP tests.

---

## PHASE 4 — Current Affairs + AI Analyst

**Primary tool: Antigravity Flash (ai-analyst service) + Gemini CLI (article CRUD)**
**Why:** AI analyst service is isolated logic. Article CRUD must cross-check
Article model and paginate.utils.js — CLI handles this.

Files to generate:

```
src/modules/current-affairs/current-affairs.validation.js
src/modules/current-affairs/current-affairs.service.js
src/modules/current-affairs/current-affairs.controller.js
src/modules/current-affairs/current-affairs.routes.js
src/modules/ai-analyst/ai-analyst.service.js
src/modules/ai-analyst/ai-analyst.controller.js
src/modules/ai-analyst/ai-analyst.routes.js
```

### Article CRUD — In CLI (reads models + paginate)

```
@GEMINI.md @src/models/Article.model.js @src/utils/paginate.utils.js
@src/utils/apiError.js @src/utils/apiResponse.js @src/middlewares/asyncHandler.js

Generate: src/modules/current-affairs/current-affairs.service.js

Routes needed per instructions.md Phase 4:
- getArticles(query): paginated, filter by tag and date, isPublished: true
  Use paginate.utils.js — never raw .find({})
- getArticleById(id): single article, throw 404 if not found or not published
- markArticleRead(userId, articleId):
  Check not already read (track in UserStats.articlesRead)
  Call awardXP(userId, 10, 'ARTICLE_READ') — import from gamification service
  Increment UserStats.articlesRead via $inc
  Return updated stats
- createArticle(body, userId): INSTRUCTOR/ADMIN only — validate with Zod
- updateArticle(id, body): INSTRUCTOR/ADMIN only
- deleteArticle(id): ADMIN only

No req/res in this file. ES Modules only.
```

### AI Analyst — In Flash

```
[Paste GEMINI.md]
[Paste src/models/ChatSession.model.js]
[Paste src/models/Article.model.js]
[Paste src/utils/apiError.js]

Generate ONLY: src/modules/ai-analyst/ai-analyst.service.js

Requirements:
- getChatHistory(userId, articleId):
  Find ChatSession where user=userId AND article=articleId
  If not found, return empty session (not a 404)
- sendMessage(userId, articleId, userMessageText):
  Find or create ChatSession for user+article
  Append { role: 'user', text: userMessageText, timestamp: now }
  Call external AI API (use fetch to call Claude or Gemini API)
  The AI system prompt should include the article content for context
  Append { role: 'ai', text: aiResponse, timestamp: now }
  Save and return full updated session
- Use environment variable AI_API_KEY and AI_API_URL from config
- No req/res. ES Modules only.
```

### Update src/routes/index.js after Phase 4

**In CLI:**
```
@src/routes/index.js @src/modules/current-affairs/current-affairs.routes.js
@src/modules/ai-analyst/ai-analyst.routes.js

Update src/routes/index.js to mount:
- currentAffairsRouter at /articles
- aiAnalystRouter at /chat
Keep existing auth routes. Only add new mounts.
```

---

### Phase 4 Verification

```
@GEMINI.md
@src/modules/current-affairs/current-affairs.service.js
@src/modules/ai-analyst/ai-analyst.service.js

Check:
1. getArticles uses paginate.utils.js (not raw .find({}))?
2. markArticleRead calls awardXP correctly?
3. getChatHistory returns empty session (not 404) when no history?
4. AI service appends both user message and ai response to messages array?
5. All write routes (POST/PATCH/DELETE articles) have role guards?
6. No req/res in any service?
```

---

## PHASE 5 — Gamification + Profile

**Primary tool: Antigravity Flash**
**Why:** XP and streak logic is self-contained math. Flash handles this well.

```
src/modules/gamification/gamification.service.js
src/modules/gamification/streak.service.js
src/modules/gamification/gamification.controller.js
src/modules/gamification/gamification.routes.js
src/modules/users/users.service.js
src/modules/users/users.controller.js
src/modules/users/users.routes.js
```

### gamification.service.js — In Flash

```
[Paste GEMINI.md]
[Paste src/models/UserStats.model.js]
[Paste src/utils/apiError.js]

Generate ONLY: src/modules/gamification/gamification.service.js

Requirements from instructions.md Phase 5:
- awardXP(userId, amount, reason):
  $inc xp by amount
  Recalculate: level = Math.floor((xp + amount) / 500) + 1
  $set level if changed
  Return updated UserStats
- getAchievements(): return static list of badge definitions:
  [{ id: 'EARLY_BIRD', name: 'Early Bird', description: '...' },
   { id: 'POLITY_KING', name: 'Polity King', description: '...' },
   { id: 'TOP_SCORER', name: 'Top Scorer', description: '...' }]
- awardAchievement(userId, badgeId): upsert Achievement doc, ignore duplicate
- No req/res. ES Modules only.
```

### streak.service.js — In Flash

```
[Paste GEMINI.md]
[Paste src/models/UserStats.model.js]

Generate ONLY: src/modules/gamification/streak.service.js

Requirements from instructions.md Phase 5:
- updateStreak(userId):
  Get today's date (date only, no time)
  Get lastActivityDate from UserStats
  If lastActivityDate === yesterday:
    $inc currentStreak by 1
    If currentStreak > highestStreak: $set highestStreak
    Call awardXP(userId, 5, 'STREAK_DAY')
  If lastActivityDate === today: do nothing (already counted)
  Else (missed days): $set currentStreak = 1
  Always: $set lastActivityDate = today
- This is called by auth.service.js login() after successful login
- No req/res. ES Modules only.
```

**Important:** After generating streak.service.js, update auth.service.js login()
to call updateStreak(user._id) after successful authentication.

```
@src/modules/auth/auth.service.js @src/modules/gamification/streak.service.js

Update auth.service.js login() function to call updateStreak(user._id)
after successful bcrypt.compare and before returning tokens.
Only change this one thing — do not modify anything else.
```

### users.service.js — In CLI

```
@GEMINI.md @src/models/User.model.js @src/models/Profile.model.js
@src/models/UserStats.model.js @src/utils/apiError.js

Generate ONLY: src/modules/users/users.service.js

Requirements:
- getMe(userId): find User, populate Profile and UserStats in single query
  select('-passwordHash -refreshTokenHash') on User
  Return combined object
- updateProfile(userId, body):
  Allowed fields only: fullName, bio, targetYear, optionalSubject,
  attemptCount, dailyGoalHours, homeState, avatarUrl
  Block: role, status, email, passwordHash, refreshTokenHash (throw 400 if attempted)
  Use $set for partial update — never replace entire document
  Return updated Profile
- No req/res. ES Modules only.
```

---

### Phase 5 Verification

```
@GEMINI.md
@src/modules/gamification/gamification.service.js
@src/modules/gamification/streak.service.js
@src/modules/users/users.service.js

Check:
1. awardXP recalculates level correctly using Math.floor(xp/500)+1?
2. streak.service.js handles all three cases: yesterday, today, missed?
3. auth.service.js login now calls updateStreak?
4. updateProfile blocks role/status/email changes?
5. getMe uses single populate query (not two separate queries)?
6. No req/res in any service?
```

---

## PHASE 6 — Courses + Quiz Engine

**Primary tool: Gemini CLI**
**Why:** Quiz submit logic references multiple models (Quiz, Question, Submission,
UserStats). CLI keeps all these cross-references consistent.

```
src/modules/courses/courses.service.js
src/modules/courses/courses.controller.js
src/modules/courses/courses.routes.js
src/modules/exams/exams.service.js
src/modules/exams/exams.controller.js
src/modules/exams/exams.routes.js
```

### exams.service.js (quiz submit) — In CLI

```
@GEMINI.md
@src/models/Quiz.model.js @src/models/Question.model.js
@src/models/Submission.model.js @src/models/UserStats.model.js
@src/modules/gamification/gamification.service.js @src/utils/apiError.js
@src/utils/paginate.utils.js

Generate ONLY: src/modules/exams/exams.service.js

Requirements from instructions.md Phase 6:
- getQuizQuestions(quizId):
  Find Questions for quiz
  NEVER return correctOptionIndex — use .select('-correctOptionIndex')
  Return questions array
- submitQuiz(userId, quizId, answers):
  Validate: answers.length must equal quiz.totalQuestions
  Fetch questions WITH select('+correctOptionIndex') for scoring only
  Calculate score: count correct answers, express as percentage
  Create Submission document
  If score >= quiz.passingScore:
    passed = true
    awardXP(userId, 50, 'QUIZ_PASS')
  Recalculate recallRatePercentage:
    Get ALL submissions for this user
    Average their scores
    $set UserStats.recallRatePercentage
  Return { score, passed, submission }
- No req/res. ES Modules only.
```

---

### Phase 6 Verification

```
@GEMINI.md
@src/modules/exams/exams.service.js @src/models/Question.model.js

Check:
1. getQuizQuestions uses .select('-correctOptionIndex')?
2. submitQuiz fetches questions WITH +correctOptionIndex for scoring?
3. recallRatePercentage is a rolling average of ALL submissions?
4. awardXP is only called when score >= passingScore?
5. Submission document is always created regardless of pass/fail?
6. Answer array length is validated before scoring?
```

---

## PHASE 7 — Progress Tracker

**Primary tool: Gemini CLI**
**Why:** $addToSet and aggregation pipeline must be verified against actual
Course and Progress model field names.

```
src/modules/courses/progress.service.js
src/modules/courses/progress.controller.js
(add routes to courses.routes.js)
```

### In CLI:

```
@GEMINI.md @src/models/Progress.model.js @src/models/Course.model.js
@src/models/Lesson.model.js @src/modules/gamification/gamification.service.js
@src/utils/apiError.js

Generate ONLY: src/modules/courses/progress.service.js

Requirements from instructions.md Phase 7:
- completeLesson(userId, courseId, lessonId):
  Verify lesson belongs to course (prevents spoofing)
  $addToSet completedLessons: lessonId (prevents duplicates automatically)
  Fetch course.totalModules
  Recalculate: completionPercentage = (completedLessons.length / totalModules) * 100
  $set completionPercentage
  awardXP(userId, 20, 'LESSON_COMPLETE')
  Return updated Progress doc
- getProgressSummary(userId):
  Find all Progress docs where student = userId
  Populate course with title field only
  Return [{ courseId, courseTitle, completionPercentage }]
- No req/res. ES Modules only.
```

---

## PHASE 8 — Subscriptions + Admin

**Primary tool: Gemini CLI**
**Why:** Payment verification is security-critical. CLI reads the actual
Subscription model and can verify the HMAC logic is correct.

```
src/modules/subscriptions/subscriptions.service.js
src/modules/subscriptions/subscriptions.controller.js
src/modules/subscriptions/subscriptions.routes.js
src/modules/admin/admin.service.js
src/modules/admin/admin.controller.js
src/modules/admin/admin.routes.js
```

### subscriptions.service.js — In CLI

```
@GEMINI.md @src/models/Subscription.model.js @src/config/env.js
@src/utils/apiError.js

Generate ONLY: src/modules/subscriptions/subscriptions.service.js

Requirements from instructions.md Phase 8:
- subscribe(userId, { planType, razorpayOrderId, razorpayPaymentId, razorpaySignature }):
  1. FIRST: verify Razorpay HMAC signature using crypto:
     expectedSig = HMAC-SHA256(razorpayOrderId + '|' + razorpayPaymentId, RAZORPAY_KEY_SECRET)
     if expectedSig !== razorpaySignature → throw AppError(400, 'Payment verification failed')
  2. ONLY after verification passes: create Subscription document
  3. Calculate expiryDate based on planType:
     MONTHLY: +30 days, QUARTERLY: +90 days, YEARLY: +365 days
  4. If existing active subscription, extend from expiryDate (not from now)
  5. Return created subscription
- getMyPlan(userId):
  Find active non-expired subscription for user
  Return subscription or null (never throw 404 — null is valid)
- No req/res. ES Modules only.
```

### admin.service.js — In CLI

```
@GEMINI.md @src/models/User.model.js @src/models/Subscription.model.js
@src/models/Article.model.js @src/models/Submission.model.js

Generate ONLY: src/modules/admin/admin.service.js

Requirements from instructions.md Phase 8:
- getDashboardStats():
  Run these aggregations in parallel with Promise.all:
  - Total users: User.countDocuments()
  - Active subscribers: Subscription.countDocuments({ status: 'ACTIVE', expiryDate: { $gt: now } })
  - Published articles: Article.countDocuments({ isPublished: true })
  - Total submissions: Submission.countDocuments()
  Return { totalUsers, activeSubscribers, publishedArticles, totalSubmissions }
- No req/res. ES Modules only.
```

### admin.routes.js — guard with checkRole

```
@GEMINI.md @src/middlewares/auth.middleware.js @src/middlewares/role.middleware.js
@src/modules/admin/admin.controller.js

Generate ONLY: src/modules/admin/admin.routes.js

Requirements:
- All routes: verifyToken + checkRole('ADMIN')
- GET /dashboard-stats → getDashboardStats controller
- No logic in this file
```

---

### Phase 8 Verification

```
@GEMINI.md @src/modules/subscriptions/subscriptions.service.js

Check:
1. HMAC verification happens BEFORE any DB write?
2. getMyPlan returns null (not throws) when no subscription found?
3. Expiry calculation is correct for all three plan types?
4. Admin routes ALL have both verifyToken AND checkRole('ADMIN')?
5. getDashboardStats uses Promise.all (parallel, not sequential)?
```

---

## FINAL — Full Architecture Audit

Run this in CLI when ALL 8 phases are complete:

```
@GEMINI.md @instructions.md
@src/app.js @server.js
@src/modules/auth/auth.service.js
@src/modules/auth/auth.controller.js
@src/modules/current-affairs/current-affairs.service.js
@src/modules/gamification/gamification.service.js
@src/modules/exams/exams.service.js
@src/modules/subscriptions/subscriptions.service.js
@src/middlewares/auth.middleware.js
@src/middlewares/error.middleware.js

Final production readiness audit. Check ALL sections from instructions.md:

Section 6 (Coding Conventions):
- All imports use .js extension?
- All async controllers use asyncHandler?
- All controllers are thin (no logic)?

Section 7 (Route Naming):
- All routes follow /api/v1/resource pattern?
- Action routes use POST /resource/:id/action pattern?

Section 8 (Error Handling):
- All three error types handled in error.middleware?
- Stack trace hidden in production?

Section 9 (PR Checklist — run every item):
- Zod validation in every service that accepts input?
- Role guards on every write route?
- No .find({}) without filter + pagination?
- No passwordHash in any response?
- Rate limiters on auth routes?
- Indexes on all queried fields?
- Response shape { success, message, data } everywhere?

List every violation found across all files.
```

---

## The 10 Rules You Cannot Break

```
1.  One phase per session — never mix phases
2.  One file per prompt — never ask for multiple files at once
3.  Lock agent with GEMINI.md at the start of EVERY session
4.  npm run dev must boot cleanly after EVERY phase
5.  Phase 3 (auth) must pass real HTTP tests before Phase 4 starts
6.  CLI for verification, Flash for first drafts of complex logic
7.  Never accept require() — reject and re-prompt immediately
8.  Response shape { success, message, data } is frozen — never negotiate
9.  HMAC payment verification before any DB write — non-negotiable
10. Run the phase verification prompt after every phase, zero violations to proceed
```
