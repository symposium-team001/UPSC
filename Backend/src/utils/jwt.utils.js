import jwt from 'jsonwebtoken';
import { env as config } from '../config/env.js';
import { AppError } from './apiError.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRY, 
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

export const signRefreshToken = (payload) =>
  jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRY,
    algorithm: 'HS256',
    issuer: 'upsc-platform',
    audience: 'upsc-client',
  });

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
      issuer: 'upsc-platform',
      audience: 'upsc-client',
    });
  } catch (err) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }
};
