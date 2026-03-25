import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    badgeId: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

achievementSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Achievement = mongoose.model('Achievement', achievementSchema);
