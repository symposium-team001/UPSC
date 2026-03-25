import bcrypt from 'bcrypt';
import { User } from '../../models/User.model.js';
import { Profile } from '../../models/Profile.model.js';
import { UserStats } from '../../models/UserStats.model.js';
import { AppError } from '../../utils/apiError.js';
import { signupSchema, loginSchema } from './auth.validation.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils.js';
import { env as config } from '../../config/env.js';
import mongoose from 'mongoose';

const ROUNDS = parseInt(config.BCRYPT_ROUNDS) || 12;

export const signup = async (body) => {
  const { email, password, fullName, role } = signupSchema.parse(body);

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    throw new AppError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, ROUNDS);

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const [user] = await User.create([{ email, passwordHash, role }], { session });
    
    await Profile.create([{ user: user._id, fullName, targetYear: new Date().getFullYear() + 1 }], { session });
    await UserStats.create([{ user: user._id }], { session });

    const accessToken = signAccessToken({ userId: user._id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    user.refreshTokenHash = refreshTokenHash;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { accessToken, refreshToken, user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const login = async (body) => {
  const { email, password } = loginSchema.parse(body);
  
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new AppError(401, 'Invalid credentials');
  
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new AppError(401, 'Invalid credentials');
  
  if (user.status !== 'ACTIVE') throw new AppError(403, 'Account suspended or inactive');

  user.lastLoginAt = new Date();
  
  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id });
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  
  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  return { accessToken, refreshToken, user };
};

export const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new AppError(401, 'Refresh token required');

  const payload = verifyRefreshToken(incomingRefreshToken);
  const user = await User.findById(payload.userId).select('+refreshTokenHash');

  if (!user) throw new AppError(401, 'User not found');

  if (!user.refreshTokenHash) throw new AppError(401, 'Invalid session. Please login again.');

  const isValid = await bcrypt.compare(incomingRefreshToken, user.refreshTokenHash);

  if (!isValid) {
    // Reuse detected — token family compromise
    await User.findByIdAndUpdate(payload.userId, { refreshTokenHash: null });
    throw new AppError(401, 'Token reuse detected. Please login again.');
  }

  const newAccessToken = signAccessToken({ userId: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user._id });
  const newHash = await bcrypt.hash(newRefreshToken, 10);
  
  await User.findByIdAndUpdate(user._id, { refreshTokenHash: newHash });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
  return true;
};
