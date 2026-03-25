import { User } from '../../models/User.model.js';
import { Profile } from '../../models/Profile.model.js';
import { UserStats } from '../../models/UserStats.model.js';
import { AppError } from '../../utils/apiError.js';
import { updateProfileSchema } from './users.validation.js';

/**
 * Get current user with populated Profile + UserStats
 */
export const getMe = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new AppError(404, 'User not found');

  const profile = await Profile.findOne({ user: userId }).lean();
  const stats = await UserStats.findOne({ user: userId }).lean();

  return { user, profile, stats };
};

/**
 * Update user profile — blocks role, status, email, passwordHash
 */
export const updateProfile = async (userId, body) => {
  const data = updateProfileSchema.parse(body);

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!profile) throw new AppError(404, 'Profile not found');
  return profile;
};
