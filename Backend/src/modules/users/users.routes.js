import { Router } from 'express';
import * as usersController from './users.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', verifyToken, usersController.getMe);
router.patch('/profile', verifyToken, usersController.updateProfile);

export default router;
