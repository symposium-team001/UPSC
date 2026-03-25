import * as subscriptionsService from './subscriptions.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const subscription = await subscriptionsService.subscribe(req.user._id, req.body);
  sendSuccess(res, subscription, 'Subscription activated successfully', 201);
});

export const getMyPlan = asyncHandler(async (req, res) => {
  const plan = await subscriptionsService.getMyPlan(req.user._id);
  sendSuccess(res, plan, plan ? 'Active subscription found' : 'No active subscription');
});
