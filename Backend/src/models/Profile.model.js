import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    targetYear: { type: Number, required: true },
    optionalSubject: { type: String, trim: true },
    bio: { type: String, trim: true },
    attemptCount: { type: Number, default: 0 },
    dailyGoalHours: { type: Number, default: 4 },
    homeState: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

profileSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Profile = mongoose.model('Profile', profileSchema);
