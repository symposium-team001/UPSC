import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

/**
 * Redactor to prevent logging sensitive information
 */
const redactSensitive = winston.format((info) => {
  const SENSITIVE_FIELDS = ['password', 'token', 'otp', 'secret', 'key', 'authorization', 'cookie'];
  
  const redactObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    // Handle arrays or objects
    const newObj = Array.isArray(obj) ? [] : {};
    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field))) {
        newObj[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        newObj[key] = redactObject(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  };

  return redactObject(info);
});

/**
 * Custom format for readable console output
 */
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${stack || message}`;
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }
  return log;
});

/**
 * Create the winston logger instance
 */
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    redactSensitive(),
    json()
  ),
  transports: [],
});

// Configure transports based on environment
if (env.NODE_ENV === 'production') {
  // File transport for production
  logger.add(new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
  logger.add(new winston.transports.File({ 
    filename: 'logs/combined.log',
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }));
} else {
  // Console transport for development
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      consoleFormat
    ),
  }));
}

// Named export for consistency with internal config files, and default export as requested
export { logger };
export default logger;
