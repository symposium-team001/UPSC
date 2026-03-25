import { Article } from '../../models/Article.model.js';
import { UserStats } from '../../models/UserStats.model.js';
import { AppError } from '../../utils/apiError.js';
import { paginate } from '../../utils/paginate.utils.js';
import { createArticleSchema, updateArticleSchema, listArticlesSchema } from './current-affairs.validation.js';

/**
 * Create a new article (INSTRUCTOR/ADMIN only)
 */
export const createArticle = async (body) => {
  const data = createArticleSchema.parse(body);
  const article = await Article.create(data);
  return article;
};

/**
 * Update an existing article (INSTRUCTOR/ADMIN only)
 */
export const updateArticle = async (articleId, body) => {
  const data = updateArticleSchema.parse(body);
  const article = await Article.findByIdAndUpdate(articleId, { $set: data }, { new: true, runValidators: true });
  if (!article) throw new AppError(404, 'Article not found');
  return article;
};

/**
 * Delete an article (INSTRUCTOR/ADMIN only)
 */
export const deleteArticle = async (articleId) => {
  const article = await Article.findByIdAndDelete(articleId);
  if (!article) throw new AppError(404, 'Article not found');
  return true;
};

/**
 * List articles with pagination and optional tag/date filters
 */
export const listArticles = async (query) => {
  const { page, limit, tag, date } = listArticlesSchema.parse(query);

  const filter = { isPublished: true };
  if (tag) filter.tag = tag;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    filter.publishedDate = { $gte: start, $lt: end };
  }

  return paginate(Article, filter, { page, limit, sort: { publishedDate: -1 } });
};

/**
 * Get a single article by ID
 */
export const getArticleById = async (articleId) => {
  const article = await Article.findById(articleId).lean();
  if (!article) throw new AppError(404, 'Article not found');
  return article;
};

/**
 * Mark an article as read, award XP, increment articlesRead
 */
export const markArticleRead = async (articleId, userId) => {
  const article = await Article.findById(articleId).lean();
  if (!article) throw new AppError(404, 'Article not found');

  // Lazy import to avoid circular dependency
  const { awardXP } = await import('../gamification/gamification.service.js');

  await awardXP(userId, 10, 'ARTICLE_READ');
  await UserStats.findOneAndUpdate({ user: userId }, { $inc: { articlesRead: 1 } });

  return { message: 'Article marked as read' };
};
