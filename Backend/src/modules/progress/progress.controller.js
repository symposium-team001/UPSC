import * as progressService from './progress.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const completeLesson = asyncHandler(async (req, res) => {
  const progress = await progressService.completeLesson(req.params.courseId, req.params.lessonId, req.user._id);
  sendSuccess(res, progress, 'Lesson marked as complete');
});

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await progressService.getProgressSummary(req.user._id);
  sendSuccess(res, summary, 'Progress summary fetched successfully');
});
