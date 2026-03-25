import * as examsService from './exams.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await examsService.createQuiz(req.body);
  sendSuccess(res, quiz, 'Quiz created successfully', 201);
});

export const listQuizzes = asyncHandler(async (req, res) => {
  const result = await examsService.listQuizzes(req.query);
  sendSuccess(res, result, 'Quizzes fetched successfully');
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await examsService.getQuizById(req.params.id);
  sendSuccess(res, quiz, 'Quiz fetched successfully');
});

export const addQuestion = asyncHandler(async (req, res) => {
  const question = await examsService.addQuestion(req.params.id, req.body);
  sendSuccess(res, question, 'Question added successfully', 201);
});

export const getQuestions = asyncHandler(async (req, res) => {
  const questions = await examsService.getQuestions(req.params.id);
  sendSuccess(res, questions, 'Questions fetched successfully');
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const result = await examsService.submitQuiz(req.params.id, req.user._id, req.body);
  sendSuccess(res, result, 'Quiz submitted successfully');
});
