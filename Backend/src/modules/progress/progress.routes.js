import { Router } from 'express';
import * as progressController from './progress.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/:courseId/lesson/:lessonId/complete', verifyToken, progressController.completeLesson);
router.get('/summary', verifyToken, progressController.getSummary);

export default router;
