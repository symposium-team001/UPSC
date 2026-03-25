import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/apiError.js';

/**
 * Global Error Handling Middleware
 * Handles AppError, ZodError, and unknown errors
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Log full error for internal tracking
  logger.error(err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle MongoDB CastErrors (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle MongoDB Duplicate Key Errors
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field}`;
  }

  // Production vs Development response contract: { success, message, data }
  const data = {
    errors,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  const response = {
    success: false,
    message,
    data: (env.NODE_ENV === 'production' && !err.isOperational && !(err instanceof ZodError)) ? [] : data,
  };

  res.status(statusCode).json(response);
};
