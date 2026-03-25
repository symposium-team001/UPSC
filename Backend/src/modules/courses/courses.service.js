import { Course } from '../../models/Course.model.js';
import { Lesson } from '../../models/Lesson.model.js';
import { AppError } from '../../utils/apiError.js';
import { paginate } from '../../utils/paginate.utils.js';
import { createCourseSchema, updateCourseSchema, createLessonSchema, updateLessonSchema } from './courses.validation.js';

// ---- COURSE CRUD ----

export const createCourse = async (body, userId) => {
  const data = createCourseSchema.parse(body);
  const course = await Course.create({ ...data, createdBy: userId });
  return course;
};

export const updateCourse = async (courseId, body) => {
  const data = updateCourseSchema.parse(body);
  const course = await Course.findByIdAndUpdate(courseId, { $set: data }, { new: true, runValidators: true });
  if (!course) throw new AppError(404, 'Course not found');
  return course;
};

export const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) throw new AppError(404, 'Course not found');
  return true;
};

export const listCourses = async (query) => {
  const filter = { isPublished: true };
  return paginate(Course, filter, { page: query.page, limit: query.limit });
};

export const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).lean();
  if (!course) throw new AppError(404, 'Course not found');
  return course;
};

// ---- LESSON CRUD ----

export const createLesson = async (courseId, body) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError(404, 'Course not found');

  const data = createLessonSchema.parse(body);
  const lesson = await Lesson.create({ ...data, course: courseId });

  // Update totalModules count
  const lessonCount = await Lesson.countDocuments({ course: courseId });
  course.totalModules = lessonCount;
  await course.save();

  return lesson;
};

export const updateLesson = async (lessonId, body) => {
  const data = updateLessonSchema.parse(body);
  const lesson = await Lesson.findByIdAndUpdate(lessonId, { $set: data }, { new: true, runValidators: true });
  if (!lesson) throw new AppError(404, 'Lesson not found');
  return lesson;
};

export const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);
  if (!lesson) throw new AppError(404, 'Lesson not found');

  // Update totalModules count
  const lessonCount = await Lesson.countDocuments({ course: lesson.course });
  await Course.findByIdAndUpdate(lesson.course, { totalModules: lessonCount });

  return true;
};

export const listLessons = async (courseId) => {
  const course = await Course.findById(courseId).lean();
  if (!course) throw new AppError(404, 'Course not found');

  const lessons = await Lesson.find({ course: courseId }).sort({ orderIndex: 1 }).lean();
  return lessons;
};
