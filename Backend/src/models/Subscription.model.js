import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planType: { type: String, enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'], required: true },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    paymentRef: { type: String, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ student: 1, status: 1, expiryDate: 1 });

subscriptionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
