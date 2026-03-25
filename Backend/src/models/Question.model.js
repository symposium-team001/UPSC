import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true, select: false },
    explanation: { type: String, trim: true },
  },
  { timestamps: true }
);

questionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Question = mongoose.model('Question', questionSchema);
