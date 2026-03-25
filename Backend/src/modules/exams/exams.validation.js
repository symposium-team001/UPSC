import { z } from 'zod';

export const createQuizSchema = z.object({
  title: z.string().trim().min(3).max(300),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  passingScore: z.number().int().min(0).max(100),
  totalQuestions: z.number().int().min(1),
});

export const createQuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().trim().optional(),
});

export const submitQuizSchema = z.object({
  answers: z.array(z.number().int().min(0)),
});
