import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { env as config } from '../../config/env.js';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
  signed: true,
});

export const signup = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.signup(req.body);
  res.cookie('refreshToken', refreshToken, getCookieOptions());
  sendSuccess(res, { accessToken, user }, 'Signup successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body);
  res.cookie('refreshToken', refreshToken, getCookieOptions());
  sendSuccess(res, { accessToken, user }, 'Login successful', 200);
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.signedCookies.refreshToken || req.cookies.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshTokens(incomingRefreshToken);
  
  res.cookie('refreshToken', refreshToken, getCookieOptions());
  sendSuccess(res, { accessToken }, 'Token refreshed successfully', 200);
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await authService.logout(req.user._id);
  }
  
  res.clearCookie('refreshToken', getCookieOptions());
  sendSuccess(res, null, 'Logged out successfully', 200);
});
