import { UserStats } from '../../models/UserStats.model.js';
import { AppError } from '../../utils/apiError.js';

/**
 * Award XP to a user and recalculate their level.
 * Level formula: level = Math.floor(xp / 500) + 1
 *
 * @param {string} userId - The user's MongoDB ObjectId
 * @param {number} amount - XP points to award
 * @param {string} reason - Why XP is being awarded (e.g., 'ARTICLE_READ')
 */
export const awardXP = async (userId, amount, reason) => {
  const stats = await UserStats.findOne({ user: userId });
  if (!stats) throw new AppError(404, 'User stats not found');

  stats.xp += amount;
  stats.level = Math.floor(stats.xp / 500) + 1;
  await stats.save();

  return stats;
};
