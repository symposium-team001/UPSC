import { Router } from 'express';
import * as chatController from './ai-analyst.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/:articleId', verifyToken, chatController.getSession);
router.post('/:articleId/message', verifyToken, chatController.sendMessage);

export default router;
