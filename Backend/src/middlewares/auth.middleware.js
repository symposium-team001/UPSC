import { User } from '../models/User.model.js';
import { AppError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import { asyncHandler } from './asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.userId).select('_id role status emailVerified');
  if (!user) throw new AppError(401, 'User no longer exists');
  if (user.status !== 'ACTIVE') throw new AppError(403, 'Account suspended');

  req.user = user;
  next();
});
