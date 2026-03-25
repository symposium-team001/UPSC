import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email().toLowerCase().trim().max(255),
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .max(72, 'Maximum 72 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
  fullName: z.string().trim().min(2).max(100),
  role: z.enum(['STUDENT', 'INSTRUCTOR']).default('STUDENT'),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});
