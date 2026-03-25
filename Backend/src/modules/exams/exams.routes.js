import { Router } from 'express';
import * as examsController from './exams.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Public (authenticated) reads
router.get('/', verifyToken, examsController.listQuizzes);
router.get('/:id', verifyToken, examsController.getQuizById);
router.get('/:id/questions', verifyToken, examsController.getQuestions);

// Student submission
router.post('/:id/submit', verifyToken, examsController.submitQuiz);

// INSTRUCTOR/ADMIN write operations
router.post('/', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), examsController.createQuiz);
router.post('/:id/questions', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), examsController.addQuestion);

export default router;
