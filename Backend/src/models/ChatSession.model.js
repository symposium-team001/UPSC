import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatSessionSchema.index({ user: 1, article: 1 }, { unique: true });

chatSessionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
