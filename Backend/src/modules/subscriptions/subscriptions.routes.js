import { Router } from 'express';
import * as subscriptionsController from './subscriptions.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/subscribe', verifyToken, subscriptionsController.subscribe);
router.get('/my-plan', verifyToken, subscriptionsController.getMyPlan);

export default router;
