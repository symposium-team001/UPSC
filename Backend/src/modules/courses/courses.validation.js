import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().trim().min(3).max(300),
  description: z.string().trim().max(2000).optional(),
  totalModules: z.number().int().min(0).optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createLessonSchema = z.object({
  title: z.string().trim().min(3).max(300),
  orderIndex: z.number().int().min(0),
  content: z.string().min(1),
  duration: z.number().min(0).optional().default(0),
});

export const updateLessonSchema = createLessonSchema.partial();
