import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    orderIndex: { type: Number, required: true },
    content: { type: String, required: true },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

lessonSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Lesson = mongoose.model('Lesson', lessonSchema);
