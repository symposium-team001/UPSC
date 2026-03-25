import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    completionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

progressSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Progress = mongoose.model('Progress', progressSchema);
