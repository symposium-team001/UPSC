import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import articleRoutes from '../modules/current-affairs/current-affairs.routes.js';
import chatRoutes from '../modules/ai-analyst/ai-analyst.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import coursesRoutes from '../modules/courses/courses.routes.js';
import examsRoutes from '../modules/exams/exams.routes.js';
import progressRoutes from '../modules/progress/progress.routes.js';
import subscriptionsRoutes from '../modules/subscriptions/subscriptions.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

const router = Router();

// Auth
router.use('/auth', authRoutes);

// Current Affairs
router.use('/articles', articleRoutes);

// AI Analyst Chat
router.use('/chat', chatRoutes);

// Users / Profile
router.use('/users', usersRoutes);

// Courses + Lessons
router.use('/courses', coursesRoutes);

// Quizzes / Exams
router.use('/quizzes', examsRoutes);

// Progress Tracker
router.use('/progress', progressRoutes);

// Subscriptions
router.use('/subscriptions', subscriptionsRoutes);

// Admin Dashboard
router.use('/admin', adminRoutes);

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
