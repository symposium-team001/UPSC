import * as coursesService from './courses.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

// ---- COURSE CONTROLLERS ----

export const createCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.createCourse(req.body, req.user._id);
  sendSuccess(res, course, 'Course created successfully', 201);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.updateCourse(req.params.id, req.body);
  sendSuccess(res, course, 'Course updated successfully');
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await coursesService.deleteCourse(req.params.id);
  sendSuccess(res, null, 'Course deleted successfully');
});

export const listCourses = asyncHandler(async (req, res) => {
  const result = await coursesService.listCourses(req.query);
  sendSuccess(res, result, 'Courses fetched successfully');
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await coursesService.getCourseById(req.params.id);
  sendSuccess(res, course, 'Course fetched successfully');
});

// ---- LESSON CONTROLLERS ----

export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await coursesService.createLesson(req.params.id, req.body);
  sendSuccess(res, lesson, 'Lesson created successfully', 201);
});

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await coursesService.updateLesson(req.params.lessonId, req.body);
  sendSuccess(res, lesson, 'Lesson updated successfully');
});

export const deleteLesson = asyncHandler(async (req, res) => {
  await coursesService.deleteLesson(req.params.lessonId);
  sendSuccess(res, null, 'Lesson deleted successfully');
});

export const listLessons = asyncHandler(async (req, res) => {
  const lessons = await coursesService.listLessons(req.params.id);
  sendSuccess(res, lessons, 'Lessons fetched successfully');
});
