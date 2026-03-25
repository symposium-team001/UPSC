import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tag: { type: String, required: true, index: true },
    source: { type: String, trim: true },
    imageColor: { type: String, trim: true },
    publishedDate: { type: Date, default: Date.now, index: -1 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

articleSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const Article = mongoose.model('Article', articleSchema);
