import { z } from 'zod';

export const subscribeSchema = z.object({
  planType: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
