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

console.log('Registered Models:', mongoose.modelNames());
process.exit(0);
