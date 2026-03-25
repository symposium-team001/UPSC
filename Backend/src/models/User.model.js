import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'], default: 'STUDENT' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    refreshTokenHash: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
