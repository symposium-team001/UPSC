import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.preprocess((val) => parseInt(val, 10), z.number().positive().default(5000)),

  // Database & Redis
  MONGO_URI: z.string().url({ message: 'MONGO_URI must be a valid MongoDB connection string' }),
  REDIS_URL: z.string().url({ message: 'REDIS_URL must be a valid Redis connection string' }),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, { message: 'JWT_ACCESS_SECRET must be at least 32 characters' }),
  JWT_REFRESH_SECRET: z.string().min(32, { message: 'JWT_REFRESH_SECRET must be at least 32 characters' }),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Auth & Security
  BCRYPT_ROUNDS: z.preprocess((val) => parseInt(val, 10), z.number().int().positive().default(10)),
  COOKIE_SECRET: z.string().min(32, { message: 'COOKIE_SECRET must be at least 32 characters' }),
  CORS_ORIGINS: z.string().transform((val) => val.split(',').map((s) => s.trim())),

  // OTP Configuration
  OTP_EXPIRY_MINUTES: z.preprocess((val) => parseInt(val, 10), z.number().int().positive().default(10)),
  OTP_MAX_ATTEMPTS: z.preprocess((val) => parseInt(val, 10), z.number().int().positive().default(5)),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.preprocess((val) => parseInt(val, 10), z.number().int().positive().default(900000)), // 15 mins
  RATE_LIMIT_MAX: z.preprocess((val) => parseInt(val, 10), z.number().int().positive().default(100)),
  OTP_RATE_LIMIT_MAX: z.preprocess((val) => parseInt(val, 10), z.number().int().positive().default(5)),

  // Third Party Services
  RESEND_API_KEY: z.string().min(1, { message: 'RESEND_API_KEY is required' }),
  FCM_SERVER_KEY: z.string().min(1, { message: 'FCM_SERVER_KEY is required' }),
  RAZORPAY_KEY_ID: z.string().min(1, { message: 'RAZORPAY_KEY_ID is required' }),
  RAZORPAY_KEY_SECRET: z.string().min(1, { message: 'RAZORPAY_KEY_SECRET is required' }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const errors = _env.error.flatten().fieldErrors;
  console.error('❌ FATAL: Invalid environment variables:');
  Object.entries(errors).forEach(([field, messages]) => {
    console.error(`- ${field}: ${messages.join(', ')}`);
  });
  process.exit(1);
}

/**
 * Validated configuration object
 * @type {z.infer<typeof envSchema>}
 */
export const env = _env.data;
