import { Quiz } from '../../models/Quiz.model.js';
import { Question } from '../../models/Question.model.js';
import { Submission } from '../../models/Submission.model.js';
import { UserStats } from '../../models/UserStats.model.js';
import { AppError } from '../../utils/apiError.js';
import { paginate } from '../../utils/paginate.utils.js';
import { createQuizSchema, createQuestionSchema, submitQuizSchema } from './exams.validation.js';

// ---- QUIZ CRUD ----

export const createQuiz = async (body) => {
  const { courseId, lessonId, ...rest } = createQuizSchema.parse(body);
  const quiz = await Quiz.create({ ...rest, course: courseId || null, lesson: lessonId || null });
  return quiz;
};

export const listQuizzes = async (query) => {
  return paginate(Quiz, {}, { page: query.page, limit: query.limit });
};

export const getQuizById = async (quizId) => {
  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) throw new AppError(404, 'Quiz not found');
  return quiz;
};

// ---- QUESTION CRUD ----

export const addQuestion = async (quizId, body) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new AppError(404, 'Quiz not found');

  const data = createQuestionSchema.parse(body);
  if (data.correctOptionIndex >= data.options.length) {
    throw new AppError(400, 'correctOptionIndex is out of bounds for the provided options');
  }

  const question = await Question.create({ ...data, quiz: quizId });
  return question;
};

/**
 * Get questions for a quiz — strips correctOptionIndex from response
 */
export const getQuestions = async (quizId) => {
  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) throw new AppError(404, 'Quiz not found');

  // correctOptionIndex has select: false on the model, so it's automatically excluded
  const questions = await Question.find({ quiz: quizId }).lean();
  return questions;
};

// ---- SUBMISSION ----

export const submitQuiz = async (quizId, userId, body) => {
  const { answers } = submitQuizSchema.parse(body);

  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) throw new AppError(404, 'Quiz not found');

  // Fetch questions WITH correctOptionIndex for scoring
  const questions = await Question.find({ quiz: quizId }).select('+correctOptionIndex').lean();

  if (answers.length !== questions.length) {
    throw new AppError(400, `Expected ${questions.length} answers, received ${answers.length}`);
  }

  // Calculate score
  let correct = 0;
  questions.forEach((q, index) => {
    if (q.correctOptionIndex === answers[index]) correct++;
  });
  const scorePercent = Math.round((correct / questions.length) * 100);
  const passed = scorePercent >= quiz.passingScore;

  // Create submission
  const submission = await Submission.create({
    student: userId,
    quiz: quizId,
    answers,
    score: scorePercent,
    passed,
  });

  // Award XP if passed
  if (passed) {
    const { awardXP } = await import('../gamification/gamification.service.js');
    await awardXP(userId, 50, 'QUIZ_PASS');
  }

  // Recalculate recall rate as rolling average of all submissions
  const allSubmissions = await Submission.find({ student: userId }).lean();
  const avgScore = Math.round(allSubmissions.reduce((sum, s) => sum + s.score, 0) / allSubmissions.length);
  await UserStats.findOneAndUpdate({ user: userId }, { recallRatePercentage: avgScore });

  return { submission, correct, total: questions.length };
};
