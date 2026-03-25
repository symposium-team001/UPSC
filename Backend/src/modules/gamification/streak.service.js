import { UserStats } from '../../models/UserStats.model.js';

/**
 * Update streak on login.
 * - lastActivityDate === yesterday → increment currentStreak
 * - lastActivityDate === today → skip (already counted)
 * - else → reset currentStreak to 1
 *
 * @param {string} userId - The user's MongoDB ObjectId
 */
export const updateStreak = async (userId) => {
  const stats = await UserStats.findOne({ user: userId });
  if (!stats) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
  if (lastActive) lastActive.setHours(0, 0, 0, 0);

  if (lastActive && lastActive.getTime() === today.getTime()) {
    // Already counted today — skip
    return stats;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive && lastActive.getTime() === yesterday.getTime()) {
    stats.currentStreak += 1;
  } else {
    stats.currentStreak = 1;
  }

  if (stats.currentStreak > stats.highestStreak) {
    stats.highestStreak = stats.currentStreak;
  }

  stats.lastActivityDate = today;
  await stats.save();

  return stats;
};
