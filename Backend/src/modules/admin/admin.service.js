import { User } from '../../models/User.model.js';
import { Subscription } from '../../models/Subscription.model.js';
import { Article } from '../../models/Article.model.js';
import { Submission } from '../../models/Submission.model.js';

/**
 * Aggregate dashboard stats for admin.
 */
export const getDashboardStats = async () => {
  const [totalUsers, activeSubscribers, totalArticles, totalSubmissions] = await Promise.all([
    User.countDocuments({}),
    Subscription.countDocuments({ status: 'ACTIVE', expiryDate: { $gt: new Date() } }),
    Article.countDocuments({ isPublished: true }),
    Submission.countDocuments({}),
  ]);

  return {
    totalUsers,
    activeSubscribers,
    totalArticles,
    totalSubmissions,
  };
};
