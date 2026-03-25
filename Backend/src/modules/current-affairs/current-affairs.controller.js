import * as articleService from './current-affairs.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const article = await articleService.createArticle(req.body);
  sendSuccess(res, article, 'Article created successfully', 201);
});

export const update = asyncHandler(async (req, res) => {
  const article = await articleService.updateArticle(req.params.id, req.body);
  sendSuccess(res, article, 'Article updated successfully');
});

export const remove = asyncHandler(async (req, res) => {
  await articleService.deleteArticle(req.params.id);
  sendSuccess(res, null, 'Article deleted successfully');
});

export const list = asyncHandler(async (req, res) => {
  const result = await articleService.listArticles(req.query);
  sendSuccess(res, result, 'Articles fetched successfully');
});

export const getById = asyncHandler(async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  sendSuccess(res, article, 'Article fetched successfully');
});

export const markRead = asyncHandler(async (req, res) => {
  const result = await articleService.markArticleRead(req.params.id, req.user._id);
  sendSuccess(res, result, 'Article marked as read');
});
