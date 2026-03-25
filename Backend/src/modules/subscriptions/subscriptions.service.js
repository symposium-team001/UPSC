import crypto from 'crypto';
import { Subscription } from '../../models/Subscription.model.js';
import { AppError } from '../../utils/apiError.js';
import { env as config } from '../../config/env.js';
import { subscribeSchema } from './subscriptions.validation.js';

const PLAN_DURATIONS = {
  MONTHLY: 30,
  QUARTERLY: 90,
  YEARLY: 365,
};

/**
 * Verify Razorpay payment signature and create subscription.
 * NEVER activate a subscription based on client-side confirmation alone.
 */
export const subscribe = async (userId, body) => {
  const { planType, razorpayOrderId, razorpayPaymentId, razorpaySignature } = subscribeSchema.parse(body);

  // Verify HMAC signature server-side
  const expectedSignature = crypto
    .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError(400, 'Payment verification failed — invalid signature');
  }

  // Create subscription only after verification passes
  const durationDays = PLAN_DURATIONS[planType];
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + durationDays);

  const subscription = await Subscription.create({
    student: userId,
    planType,
    status: 'ACTIVE',
    startDate: new Date(),
    expiryDate,
    paymentRef: razorpayPaymentId,
  });

  return subscription;
};

/**
 * Get the current user's active subscription, or null.
 */
export const getMyPlan = async (userId) => {
  const subscription = await Subscription.findOne({
    student: userId,
    status: 'ACTIVE',
    expiryDate: { $gt: new Date() },
  }).lean();

  return subscription || null;
};
