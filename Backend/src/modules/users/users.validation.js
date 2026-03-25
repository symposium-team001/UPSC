import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  targetYear: z.number().int().min(2020).max(2040).optional(),
  optionalSubject: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  attemptCount: z.number().int().min(0).optional(),
  dailyGoalHours: z.number().min(0).max(24).optional(),
  homeState: z.string().trim().max(100).optional(),
  avatarUrl: z.string().url().optional(),
}).strict();
