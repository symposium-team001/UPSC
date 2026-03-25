import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    title: { type: String, required: true, trim: true },
    passingScore: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

quizSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Quiz = mongoose.model('Quiz', quizSchema);
