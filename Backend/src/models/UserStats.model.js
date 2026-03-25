import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    currentStreak: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
    articlesRead: { type: Number, default: 0 },
    recallRatePercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userStatsSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const UserStats = mongoose.model('UserStats', userStatsSchema);
