import { z } from 'zod';

export const completeLessonSchema = z.object({
  // No body needed — courseId and lessonId come from params
});
