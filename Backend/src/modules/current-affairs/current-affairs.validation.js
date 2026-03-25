import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(500),
  content: z.string().min(10),
  tag: z.string().trim().min(1).max(100),
  source: z.string().trim().max(500).optional(),
  imageColor: z.string().trim().max(20).optional(),
  isPublished: z.boolean().optional().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

export const listArticlesSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  tag: z.string().trim().optional(),
  date: z.string().optional(),
});
