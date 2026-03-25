import * as chatService from './ai-analyst.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const getSession = asyncHandler(async (req, res) => {
  const session = await chatService.getChatSession(req.params.articleId, req.user._id);
  sendSuccess(res, session, 'Chat session fetched successfully');
});

export const sendMessage = asyncHandler(async (req, res) => {
  const session = await chatService.sendMessage(req.params.articleId, req.user._id, req.body);
  sendSuccess(res, session, 'Message sent successfully');
});
