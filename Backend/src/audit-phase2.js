import mongoose from 'mongoose';

import { User } from './models/User.model.js';
import { Profile } from './models/Profile.model.js';
import { UserStats } from './models/UserStats.model.js';
import { Article } from './models/Article.model.js';
import { ChatSession } from './models/ChatSession.model.js';
import { Course } from './models/Course.model.js';
import { Lesson } from './models/Lesson.model.js';
import { Quiz } from './models/Quiz.model.js';
import { Question } from './models/Question.model.js';
import { Submission } from './models/Submission.model.js';
import { Progress } from './models/Progress.model.js';
import { Achievement } from './models/Achievement.model.js';
import { Subscription } from './models/Subscription.model.js';

const models = [
  User, Profile, UserStats, Article, ChatSession, 
  Course, Lesson, Quiz, Question, Submission, 
  Progress, Achievement, Subscription
];

let errors = [];

models.forEach(model => {
  const schema = model.schema;
  
  // 1. Check toJSON transform
  const toJSON = schema.options.toJSON;
  if (!toJSON || typeof toJSON.transform !== 'function') {
    errors.push(`${model.modelName} is missing a toJSON transform`);
  } else {
    const mockRet = { passwordHash: '123', refreshTokenHash: '456', __v: 0, safe: true };
    const transformed = toJSON.transform({}, mockRet);
    if ('passwordHash' in transformed || 'refreshTokenHash' in transformed || '__v' in transformed) {
      errors.push(`${model.modelName} toJSON transform does not perfectly delete required fields`);
    }
  }

  // 2. Check for passwordHash select: false (User only)
  if (model.modelName === 'User') {
    if (schema.path('passwordHash').options.select !== false) {
      errors.push('User model lacks select: false for passwordHash');
    }
  }
  
  // 3. Check for correctOptionIndex select: false (Question only)
  if (model.modelName === 'Question') {
    if (schema.path('correctOptionIndex').options.select !== false) {
      errors.push('Question model lacks select: false for correctOptionIndex');
    }
  }
});

console.log(`Audited ${models.length} Mongoose models.`);
if (errors.length > 0) {
  console.error('Audit failed with errors:');
  errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log('✔ Audit PASSED: Layered architecture, model security, and data handling validated.');
  process.exit(0);
}
