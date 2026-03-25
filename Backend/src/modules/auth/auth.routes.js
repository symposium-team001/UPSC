import { Router } from 'express';
import * as authController from './auth.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', verifyToken, authController.logout);

export default router;
