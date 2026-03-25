import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import router from './routes/index.js';

const app = express();

// 1. Helmet for security headers
app.use(helmet());

// 2. CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = env.CORS_ORIGINS;
    if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};
app.use(cors(corsOptions));

// 3. Morgan logging in development
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 4. Body parsers with limits
app.use(express.json({ limit: '10kb' }));

// 5. URL encoded parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 7. Cookie parser with secret
app.use(cookieParser(env.COOKIE_SECRET));

// 8. API Routes
app.use('/api/v1', router);

// 9. Error Handler (Must be last)
app.use(errorHandler);

export default app;
