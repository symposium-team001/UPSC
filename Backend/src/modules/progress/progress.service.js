import { Progress } from '../../models/Progress.model.js';
import { Course } from '../../models/Course.model.js';
import { Lesson } from '../../models/Lesson.model.js';
import { AppError } from '../../utils/apiError.js';

/**
 * Mark a lesson as complete.
 * Uses $addToSet to prevent duplicates.
 * Recalculates completionPercentage.
 * Awards 20 XP.
 */
export const completeLesson = async (courseId, lessonId, userId) => {
  const course = await Course.findById(courseId).lean();
  if (!course) throw new AppError(404, 'Course not found');

  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new AppError(404, 'Lesson not found');

  // Find or create progress document
  let progress = await Progress.findOne({ student: userId, course: courseId });
  if (!progress) {
    progress = new Progress({ student: userId, course: courseId, completedLessons: [] });
  }

  // $addToSet equivalent — prevent duplicate lesson IDs
  const lessonIdStr = lessonId.toString();
  const alreadyCompleted = progress.completedLessons.some((id) => id.toString() === lessonIdStr);
  if (!alreadyCompleted) {
    progress.completedLessons.push(lessonId);
  }

  // Recalculate completion percentage
  const totalModules = course.totalModules || 1;
  progress.completionPercentage = Math.round((progress.completedLessons.length / totalModules) * 100);
  await progress.save();

  // Award XP only if not already completed
  if (!alreadyCompleted) {
    const { awardXP } = await import('../gamification/gamification.service.js');
    await awardXP(userId, 20, 'LESSON_COMPLETE');
  }

  return progress;
};

/**
 * Get progress summary for all courses the user has started.
 */
export const getProgressSummary = async (userId) => {
  const progressDocs = await Progress.find({ student: userId })
    .populate('course', 'title')
    .lean();

  return progressDocs.map((p) => ({
    courseId: p.course._id,
    courseTitle: p.course.title,
    completionPercentage: p.completionPercentage,
    completedLessons: p.completedLessons.length,
  }));
};
