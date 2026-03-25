import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{ type: Number, required: true }],
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

submissionSchema.index({ student: 1, quiz: 1 });

submissionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Submission = mongoose.model('Submission', submissionSchema);
