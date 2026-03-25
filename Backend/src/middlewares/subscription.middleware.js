import { Subscription } from '../models/Subscription.model.js';
import { AppError } from '../utils/apiError.js';
import { asyncHandler } from './asyncHandler.js';

export const requirePremium = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  // Admin bypass
  if (req.user.role === 'ADMIN') {
    return next();
  }

  const activeSub = await Subscription.findOne({
    student: req.user._id,
    status: 'ACTIVE',
    expiryDate: { $gt: new Date() }
  }).lean();

  if (!activeSub) {
    throw new AppError(403, 'Premium subscription required to access this resource');
  }

  next();
});
