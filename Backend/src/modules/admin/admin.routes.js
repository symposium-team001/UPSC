import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.get('/dashboard-stats', verifyToken, checkRole('ADMIN'), adminController.getDashboardStats);

export default router;
