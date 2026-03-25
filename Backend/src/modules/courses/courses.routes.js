import { Router } from 'express';
import * as coursesController from './courses.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Public (authenticated) reads
router.get('/', verifyToken, coursesController.listCourses);
router.get('/:id', verifyToken, coursesController.getCourseById);
router.get('/:id/lessons', verifyToken, coursesController.listLessons);

// INSTRUCTOR/ADMIN write operations — Courses
router.post('/', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), coursesController.createCourse);
router.patch('/:id', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), coursesController.updateCourse);
router.delete('/:id', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), coursesController.deleteCourse);

// INSTRUCTOR/ADMIN write operations — Lessons
router.post('/:id/lessons', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), coursesController.createLesson);
router.patch('/:id/lessons/:lessonId', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), coursesController.updateLesson);
router.delete('/:id/lessons/:lessonId', verifyToken, checkRole('INSTRUCTOR', 'ADMIN'), coursesController.deleteLesson);

export default router;
