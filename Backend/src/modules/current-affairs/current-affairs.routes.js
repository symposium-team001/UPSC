import { Router } from 'express';
import * as articleController from './current-affairs.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Public (authenticated) reads
router.get('/', verifyToken, articleController.list);
router.get('/:id', verifyToken, articleController.getById);

// Authenticated user actions
router.post('/:id/read', verifyToken, articleController.markRead);

// INSTRUCTOR/ADMIN write operations
router.post('/', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), articleController.create);
router.patch('/:id', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), articleController.update);
router.delete('/:id', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), articleController.remove);

export default router;
