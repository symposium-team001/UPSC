# Ethora Backend — Phased Build Instructions

> These phases are designed to be executed sequentially. Each phase builds on the previous one.
> The frontend (React Native / Expo) is **already built**. These instructions guide the **backend** construction only.
> All API routes must align with the screens and data structures present in the frontend.

---

## PHASE 1 — Foundation & Project Scaffolding

Initialize a production-grade backend for the Ethora UPSC educational platform.

**Tech Stack:**
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- Environment variables: dotenv
- Data Validation: Zod
- Package manager: npm

**Create this core folder structure** (inside the `Backend` directory):
```
src/
  config/           (DB connection, env validation, constants)
  controllers/      (Empty files for now — one per module)
  middlewares/       (Global error handling, CORS, async handler, auth guard)
  models/           (Mongoose schemas)
  repositories/     (Database access layer — thin wrappers around Mongoose)
  routes/           (Express routing setup — versioned under /api/v1)
  services/         (Business logic layer)
  utils/            (Helpers: API response formatter, AppError class, catchAsync, pagination helper)
  validators/       (Zod schemas for request validation)
  server.js         (Entry point)
.env.example
```

**Requirements:**
- Set up a centralized global error handling middleware with a custom `AppError` class.
- Configure Morgan for HTTP request logging.
- Set up Mongoose database connection inside `config/db.js` with retry logic.
- Create a standardized API response utility:
  `{ success: boolean, message: string, data: T | null, error?: string }`
- Create a `catchAsync` wrapper for all async route handlers.
- Create a pagination utility (limit, page → skip, limit).
- Set up Helmet.js for secure headers.
- Set up CORS with a configurable whitelist of allowed origins.
- Set up express-rate-limit with sensible defaults.
- Validate all required environment variables at startup (fail-fast pattern).
- Create a health check route: `GET /api/v1/health`.
- Make sure the server runs cleanly on `npm run dev`.

**Do NOT create business logic yet. Only infrastructure setup.**

---

## PHASE 2 — Core Database Schemas (Identity, Gamification & Content)

Using Mongoose ODM, design the core schemas that power the frontend.

**Create the following models inside `src/models` with proper indexing and validations:**

### 1. User
- `email` (string, unique, lowercase, required, indexed)
- `password` (string, required — exclude from queries via `select: false`)
- `role` (enum: `STUDENT`, `INSTRUCTOR`, `ADMIN`, default: `STUDENT`)
- `status` (enum: `ACTIVE`, `INACTIVE`, `SUSPENDED`, default: `ACTIVE`)
- `isEmailVerified` (boolean, default: false)
- `loginAttempts` (number, default: 0)
- `lockUntil` (Date)
- `createdAt` / `updatedAt` (timestamps: true)

### 2. Profile
- `user` (ObjectId, ref: User, required, unique, indexed)
- `fullName` (string, required)
- `targetYear` (string) — frontend shows "2026"
- `optionalSubject` (string) — frontend shows "Optional"
- `bio` (string) — frontend shows "Aiming for LBSNAA"
- `attemptCount` (number, default: 1)
- `dailyGoalHours` (number, default: 8)
- `homeState` (string) — frontend shows "Not Set"
- `avatarUrl` (string)
- `incognitoMode` (boolean, default: false)
- `createdAt` / `updatedAt`

### 3. UserStats (Gamification)
- `user` (ObjectId, ref: User, required, unique, indexed)
- `xp` (number, default: 0)
- `level` (number, default: 1)
- `currentStreak` (number, default: 0)
- `highestStreak` (number, default: 0)
- `articlesRead` (number, default: 0)
- `recallRatePercentage` (number, default: 0)
- `totalQuizzesTaken` (number, default: 0)
- `totalCorrectAnswers` (number, default: 0)
- `lastActiveDate` (Date)

### 4. Article (Current Affairs)
- `title` (string, required) — e.g., "New Bill on Digital Data Protection"
- `content` (string, required) — full article body
- `tag` (string, required) — e.g., "GS II • POLITY", "GS III • ECONOMY"
- `source` (string) — e.g., "The Hindu", "Indian Express"
- `imageColor` (string) — hex color code for card styling
- `publishedDate` (Date, indexed)
- `syllabusPath` (Array of String) — e.g., ["GS II", "Polity", "Judiciary"]
- `readingTimeMinutes` (number)
- `isPublished` (boolean, default: true)

### 5. ChatSession (AI Analyst)
- `user` (ObjectId, ref: User, indexed)
- `article` (ObjectId, ref: Article, indexed)
- `messages` (Array of embedded docs):
  - `role` (enum: `user`, `ai`, `mentor`)
  - `text` (string, required)
  - `label` (string) — e.g., "ANALYSIS • PRELIMS", "AI FOLLOW-UP"
  - `timestamp` (Date, default: Date.now)
- Compound index on `{ user, article }` for fast lookups

**Do NOT create APIs yet.**

---

## PHASE 3 — Authentication System

Implement a production-grade authentication system.

**Requirements:**
- Password hashing using bcrypt (12+ salt rounds)
- JWT access token (15–30 min expiry)
- Refresh token rotation stored in HttpOnly Secure cookies (7-day expiry)
- Route guards for role-based access

**Files to create inside `src/`:**
- `controllers/authController.js`
- `services/authService.js`
- `routes/authRoutes.js`
- `middlewares/authMiddleware.js` (requireAuth, requireRole)
- `validators/authValidator.js` (Zod schemas for signup/login payloads)
- `utils/tokenUtils.js` (generateAccessToken, generateRefreshToken, verifyToken)

**Implement Routes:**
```
POST   /api/v1/auth/signup        — Register new user (email, password, fullName)
POST   /api/v1/auth/login         — Login with email + password
POST   /api/v1/auth/refresh       — Refresh access token via refresh cookie
POST   /api/v1/auth/logout        — Clear refresh token cookie + invalidate
POST   /api/v1/auth/forgot-password  — Send password reset link/OTP
POST   /api/v1/auth/reset-password   — Reset password with token/OTP
```

**Business Rules:**
- During signup, auto-create empty `Profile` and `UserStats` documents (inside a transaction).
- Validate all input with Zod schemas.
- Implement login attempt tracking: lock account after 5 failed attempts for 30 minutes.
- Rate limit auth endpoints: max 10 requests per 15 minutes per IP.
- Social login endpoints are future scope (Google, Apple, Facebook buttons exist in frontend).

---

## PHASE 4 — Current Affairs & Daily News Engine

Implement the Current Affairs system that powers the frontend's "Affairs" tab.

**Implement APIs:**
```
GET    /api/v1/articles                    — List daily current affairs (paginated, filterable by tag/date/source)
GET    /api/v1/articles/:id                — Get full article details
POST   /api/v1/articles/:id/read           — Mark article as read (increment UserStats.articlesRead, check streak)
GET    /api/v1/articles/daily-progress     — Get user's daily reading progress (frontend shows "Read 2 more to hit goal")
```

**Admin/Instructor Routes:**
```
POST   /api/v1/articles                    — Create new article (INSTRUCTOR/ADMIN only)
PATCH  /api/v1/articles/:id                — Update article
DELETE /api/v1/articles/:id                — Soft delete article
```

**Business Rules:**
- Each article must include: title, tag, source, publishedDate, syllabusPath, readingTimeMinutes.
- "Read" tracking must be idempotent — reading the same article twice should not double-count.
- Maintain a `readArticles` set per user (or a separate UserArticleRead collection).
- When a user reads an article, update streak logic:
  - If user hasn't read today, increment `currentStreak`.
  - If gap > 1 day, reset `currentStreak` to 1.
  - Update `highestStreak` if `currentStreak` exceeds it.

---

## PHASE 5 — AI Editorial Analyst (Chat Engine)

Implement the AI-powered editorial analysis chat that powers the "Editorial Analyst" screen.

**Implement APIs:**
```
GET    /api/v1/chat/:articleId             — Fetch existing chat history for user + article
POST   /api/v1/chat/:articleId/message     — Send user message, get AI response, update ChatSession
DELETE /api/v1/chat/:articleId             — Clear chat history for a specific article
```

**Business Rules:**
- Chat is contextual to both the user AND the article.
- The frontend has 3 tabs: PRELIMS, MAINS, INTERVIEW — the AI response should be scoped by the active analysis type (pass as query param or in body).
- Initial implementation: use structured prompt templates for mock AI responses.
- Production implementation: integrate with OpenAI / Gemini / Claude API.
- AI prompt must include:
  - The article content as context.
  - The analysis type (Prelims / Mains / Interview).
  - The user's question.
- Store the `mentorNote` as the first message in every chat session (seeded automatically).
- Rate limit AI chat requests: max 30 per hour per user.

---

## PHASE 6 — Profile Management & User Settings

Implement the Profile Management system powering the frontend's Profile screen and Settings pages.

**Implement APIs:**
```
GET    /api/v1/users/me                    — Fetch User + populated Profile + populated UserStats
PATCH  /api/v1/users/profile               — Update profile fields (bio, targetYear, avatarUrl, attemptCount, dailyGoalHours, homeState, optionalSubject)
PATCH  /api/v1/users/change-name           — Update fullName (separate endpoint for audit)
PATCH  /api/v1/users/change-password       — Change password (requires current password verification)
PATCH  /api/v1/users/incognito             — Toggle incognito mode
POST   /api/v1/users/avatar                — Upload avatar image (with file validation)
DELETE /api/v1/users/avatar                — Remove avatar
```

**Business Rules:**
- Profile editing must merge partial updates securely (only update provided fields).
- Password change requires the current password to be verified first.
- Avatar upload must validate: file type (jpg, png, webp), file size (max 2MB).
- Incognito mode flag stored in Profile — frontend reads this to show/hide the incognito banner.
- All profile changes should be reflected immediately on `GET /api/v1/users/me`.

---

## PHASE 7 — Gamification & Achievement Engine

Implement the Gamification system that powers the Achievements screen and XP/Level/Streak mechanics.

**Create Model — Achievement**
- `title` (string, required) — e.g., "Early Bird", "Polity King", "Streak 10", "Top Scorer"
- `description` (string) — e.g., "Login before 6 AM", "50 Correct Answers"
- `icon` (string) — icon identifier
- `color` (string) — hex color for card background
- `tier` (enum: `COMMON`, `RARE`, `EPIC`, `LEGEND`)
- `criteria` (embedded doc):
  - `type` (enum: `LOGIN_TIME`, `CORRECT_ANSWERS`, `STREAK`, `QUIZ_RANK`)
  - `threshold` (number) — e.g., 5 (days), 50 (answers), 1 (rank)
- `isActive` (boolean, default: true)

**Create Model — UserAchievement**
- `user` (ObjectId, ref: User)
- `achievement` (ObjectId, ref: Achievement)
- `progress` (number) — current count toward threshold
- `isCompleted` (boolean, default: false)
- `completedAt` (Date)

**Implement APIs:**
```
GET    /api/v1/gamification/achievements          — List all achievements with user's progress
POST   /api/v1/gamification/xp                    — Award XP for an action (internal/secured)
GET    /api/v1/gamification/level                  — Get current level, XP, and XP to next level
GET    /api/v1/gamification/leaderboard            — Top users by XP (paginated)
```

**Business Rules:**
- XP thresholds for levels:
  - Level 1: 0 XP, Level 2: 500 XP, Level 3: 1000 XP, Level 4: 1500 XP, Level 5: 2000 XP, etc.
- XP awards:
  - Read an article: +10 XP
  - Complete a quiz: +25 XP
  - Pass a quiz (>70%): +50 XP
  - Daily login: +5 XP
  - Achieve a streak milestone: +100 XP
- Achievement progress must auto-update whenever relevant actions occur (via service hooks).
- Frontend shows: "Aspirant Level 4", "1,250 / 2,000 XP to Level 5", "62%" progress, "750 XP Left".

---

## PHASE 8 — Syllabus, Courses & Lesson Management

Implement the Course/Syllabus system that powers the "Learn" tab.

**Create Models:**

### 1. Course / Subject
- `title` (string, required) — e.g., "History", "Geography", "Polity", "Economy"
- `category` (string) — e.g., "SOCIAL STUDIES", "PHYSICAL & HUMAN", "CONSTITUTION & GOVERNANCE", "INDIAN ECONOMICS"
- `description` (string)
- `totalModules` (number)
- `orderIndex` (number) — for display ordering
- `isPublished` (boolean, default: true)

### 2. Lesson
- `course` (ObjectId, ref: Course, indexed)
- `title` (string, required) — e.g., "Educational Development in India"
- `content` (string) — rich text / structured JSON for the notes content
- `sections` (Array of embedded docs):
  - `heading` (string)
  - `subHeading` (string)
  - `bulletPoints` (Array of String)
  - `infoBox` (string) — "Remember" callout boxes
  - `imagePlaceholder` (string) — image label
- `orderIndex` (number)
- `estimatedReadTimeMinutes` (number)

**Implement APIs:**
```
GET    /api/v1/courses                     — List all courses (with progress % per user)
GET    /api/v1/courses/:id                 — Get course details
GET    /api/v1/courses/:id/lessons         — List lessons for a course
GET    /api/v1/lessons/:id                 — Get full lesson content (notes preview)
```

**Admin/Instructor Routes:**
```
POST   /api/v1/courses                     — Create course
PATCH  /api/v1/courses/:id                 — Update course
POST   /api/v1/courses/:id/lessons         — Add lesson to course
PATCH  /api/v1/lessons/:id                 — Update lesson content
DELETE /api/v1/lessons/:id                 — Soft delete lesson
```

**Business Rules:**
- Frontend displays 4 modules: History (65%), Geography (30%), Polity (85%), Economy (10%) — these percentages come from the Progress model (Phase 10).
- Course listings must include the user's completion percentage for each course.
- Lesson content must support structured sections with bullet points, info boxes, and image placeholders as shown in the course/[id].tsx notes preview screen.

---

## PHASE 9 — Exam & Quiz Engine

Implement the Quiz/Practice system that powers the "Practice" tab and mock test modals.

**Create Models:**

### 1. Quiz
- `course` (ObjectId, ref: Course, indexed)
- `title` (string) — e.g., "Indian Polity Mock Test"
- `totalQuestions` (number)
- `passingScorePercent` (number, default: 70)
- `timeLimitMinutes` (number, optional)
- `isPremium` (boolean, default: false)

### 2. Question
- `quiz` (ObjectId, ref: Quiz, indexed)
- `text` (string, required) — full question text (supports multi-line, see frontend)
- `options` (Array of String, exactly 4)
- `correctOptionIndex` (number, 0–3) — **NEVER exposed to frontend in quiz mode**
- `explanation` (string) — shown after submission
- `difficulty` (enum: `EASY`, `MEDIUM`, `HARD`)
- `orderIndex` (number)

### 3. Submission
- `student` (ObjectId, ref: User, indexed)
- `quiz` (ObjectId, ref: Quiz, indexed)
- `answers` (Array of { questionId: ObjectId, selectedOptionIndex: number })
- `score` (number) — calculated server-side
- `totalQuestions` (number)
- `percentage` (number)
- `passed` (boolean)
- `submittedAt` (Date, default: Date.now)

**Implement APIs:**
```
GET    /api/v1/practice/subjects                  — List all practice subjects with stats (questions count, progress %)
GET    /api/v1/quizzes/:id/questions              — Get quiz questions (HIDE correctOptionIndex and explanation)
POST   /api/v1/quizzes/:id/submit                 — Submit answers, calculate score, award XP, update UserStats
GET    /api/v1/submissions/me                      — Get user's submission history
GET    /api/v1/submissions/:id                     — Get detailed submission result (with correct answers + explanations)
```

**Admin/Instructor Routes:**
```
POST   /api/v1/quizzes                             — Create quiz
POST   /api/v1/quizzes/:id/questions               — Add questions to quiz
PATCH  /api/v1/questions/:id                        — Update question
DELETE /api/v1/questions/:id                        — Delete question
```

**Business Rules:**
- Frontend shows 6 subjects: Indian Polity (1200q, 80%), Geography (950q, 45%), Economics (800q, 10%), History (1100q, 60%), Aptitude (1500q, 25%), Ethics (700q, 0%).
- When a quiz is submitted:
  1. Calculate score server-side (never trust frontend).
  2. If passed (≥70%), award 50 XP.
  3. If not passed, award 25 XP for participation.
  4. Update `UserStats.recallRatePercentage` = rolling average of all submission scores.
  5. Update `UserStats.totalQuizzesTaken` and `totalCorrectAnswers`.
  6. Check and update achievement progress (e.g., "Polity King" — 50 correct answers).
- Frontend stats bar shows: Accuracy (84%), Solved (1.2k), Streak (12) — all from UserStats and aggregated data.

---

## PHASE 10 — Student Progress & Syllabus Tracker

Implement the progress tracking system for the Dashboard tab.

**Create Model — Progress**
- `student` (ObjectId, ref: User, indexed)
- `course` (ObjectId, ref: Course, indexed)
- `completedLessons` (Array of ObjectIds, ref: Lesson)
- `completionPercentage` (number, computed)
- Compound index on `{ student, course }` — unique

**Implement APIs:**
```
POST   /api/v1/progress/:courseId/lesson/:lessonId/complete    — Mark a lesson as completed
GET    /api/v1/progress/summary                                 — Get subject-wise breakdown (Polity 85%, Economy 40%, etc.)
GET    /api/v1/progress/:courseId                                — Get detailed progress for a specific course
GET    /api/v1/dashboard/stats                                  — Aggregated dashboard data (articles read, recall rate, trends)
```

**Business Rules:**
- Automatically recalculate `completionPercentage` when a lesson is completed:
  `completionPercentage = (completedLessons.length / course.totalModules) * 100`
- Completing a lesson should also:
  1. Award 10 XP.
  2. Check achievement progress.
- Frontend Dashboard shows:
  - Articles Read: 124 (↗ +12% from last week)
  - Recall Rate: 92% (● Above average target)
  - Subject-wise Breakdown: Polity 85%, Economy 40%, Environment 15%, History 60%
- The "Continue Learning" section on Home needs: last accessed course + lesson + remaining time.

**Create Model — UserActivity** (for tracking "Continue Learning")
- `user` (ObjectId, ref: User)
- `course` (ObjectId, ref: Course)
- `lesson` (ObjectId, ref: Lesson)
- `lastAccessedAt` (Date)
- `remainingTimeMinutes` (number)

---

## PHASE 11 — Subscription & Payment Engine

Implement the Subscription system that powers the "Subscription" screen.

**Create Model — Subscription**
- `student` (ObjectId, ref: User, unique, indexed)
- `planType` (enum: `MONTHLY`, `QUARTERLY`, `ANNUAL`)
- `status` (enum: `ACTIVE`, `EXPIRED`, `CANCELLED`, `PENDING`)
- `price` (number)
- `startDate` (Date)
- `expiryDate` (Date, indexed)
- `autoRenew` (boolean, default: true)
- `paymentProvider` (string) — e.g., "razorpay", "stripe"
- `paymentReference` (string)

**Implement APIs:**
```
POST   /api/v1/subscriptions/subscribe              — Create/upgrade subscription
GET    /api/v1/subscriptions/my-plan                 — Get current subscription details
POST   /api/v1/subscriptions/cancel                  — Cancel subscription (turn off auto-renew)
POST   /api/v1/subscriptions/webhook                 — Payment webhook handler (Razorpay/Stripe)
```

**Implement Middleware:**
```
requirePremium — Middleware to gate premium content (quizzes, editorials, advanced features)
```

**Business Rules:**
- Frontend tiers:
  - MONTHLY: ₹299/mo — "Basic access to AI tools"
  - QUARTERLY: ₹699/qu — "Serious analysis for students" — POPULAR, SAVE 22%
  - ANNUAL: ₹1999/yr — "Long-term strategic growth" — SAVE 44%
- Premium features listed: Unlimited AI Evaluation, GS Mapping & Analysis, Daily Editorial Insights, Priority Processing.
- Never trust client-side payment success — verify via webhook.
- Auto-expire subscriptions via a scheduled job (cron) or check on each request.
- Footer shows: "Cancel anytime. Auto-renews monthly."

---

## PHASE 12 — Notification System

Implement the Notification system for the Notifications screen.

**Create Model — Notification**
- `user` (ObjectId, ref: User, indexed)
- `type` (enum: `DAILY_MOCK`, `STUDY_REMINDER`, `DOUBT_REPLY`, `MILESTONE`, `SYSTEM`, `PUSH`)
- `title` (string)
- `message` (string)
- `isRead` (boolean, default: false)
- `data` (Mixed) — optional payload (link, quiz ID, etc.)
- `createdAt` (Date, indexed, default: Date.now)

**Create Model — NotificationPreference**
- `user` (ObjectId, ref: User, unique)
- `pushEnabled` (boolean, default: true)
- `dailyMocks` (boolean, default: true)
- `studyReminders` (boolean, default: true)
- `doubtDiscussions` (boolean, default: false)
- `milestones` (boolean, default: true)

**Implement APIs:**
```
GET    /api/v1/notifications                        — Get user's notifications (paginated, filterable by read status)
PATCH  /api/v1/notifications/:id/read               — Mark notification as read
PATCH  /api/v1/notifications/read-all               — Mark all notifications as read
DELETE /api/v1/notifications/:id                     — Delete a notification
GET    /api/v1/notifications/preferences             — Get notification preferences
PATCH  /api/v1/notifications/preferences             — Update notification preferences
GET    /api/v1/notifications/unread-count             — Get count of unread notifications
```

**Business Rules:**
- Frontend notification preferences: Push Notifications toggle, Daily Mock Tests, Study Reminders, Doubt Discussions, Milestones.
- Info note: "Settings are synced across devices. System settings may override these."
- Notifications should be automatically generated when:
  - New daily mock is available.
  - Study reminder time is reached.
  - Achievement milestone is unlocked.
  - Someone replies to a doubt (future scope).

---

## PHASE 13 — Help & Support System

Implement the Help & Support endpoints for the Support screen.

**Create Model — SupportTicket**
- `user` (ObjectId, ref: User, indexed)
- `subject` (string, required)
- `category` (enum: `BUG_REPORT`, `FEATURE_REQUEST`, `ACCOUNT_ISSUE`, `PAYMENT_ISSUE`, `GENERAL`)
- `message` (string, required)
- `status` (enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
- `adminResponse` (string)
- `createdAt` / `updatedAt`

**Implement APIs:**
```
POST   /api/v1/support/tickets                      — Create support ticket
GET    /api/v1/support/tickets/me                    — Get user's support tickets
GET    /api/v1/support/faq                            — Get frequently asked questions (static or DB-driven)
POST   /api/v1/support/feedback                      — Submit general feedback
```

**Admin Routes:**
```
GET    /api/v1/admin/support/tickets                 — List all support tickets (filterable, paginated)
PATCH  /api/v1/admin/support/tickets/:id             — Update ticket status / add admin response
```

---

## PHASE 14 — Admin Dashboard & Analytics

Implement the Admin Dashboard with analytics and management capabilities.

**Implement APIs:**
```
GET    /api/v1/admin/dashboard-stats                 — Aggregated platform stats
GET    /api/v1/admin/users                            — List all users (paginated, searchable, filterable by role/status)
PATCH  /api/v1/admin/users/:id/status                — Change user status (ACTIVE, SUSPENDED, INACTIVE)
PATCH  /api/v1/admin/users/:id/role                  — Change user role
GET    /api/v1/admin/content/stats                    — Content statistics (articles, courses, quizzes)
GET    /api/v1/admin/revenue                          — Subscription revenue analytics
GET    /api/v1/admin/activity-logs                    — Recent platform activity (new users, submissions, etc.)
```

**Dashboard Stats Response:**
```json
{
  "totalUsers": 12500,
  "activeSubscriptions": 3200,
  "totalArticles": 890,
  "totalQuizzes": 150,
  "totalSubmissions": 45000,
  "revenueThisMonth": 125000,
  "newUsersThisWeek": 340,
  "averageRecallRate": 78.5
}
```

**Business Rules:**
- All admin routes require `requireAuth` + `requireRole('ADMIN')`.
- Admin actions on users should be logged for audit trail.
- Revenue calculations must be accurate and based on actual subscription records.

---

## PHASE 15 — Security Hardening, Rate Limiting & Production Polish

Final production hardening pass across the entire application.

**Security Checklist:**
- [ ] All routes have proper auth guards (requireAuth / requireRole).
- [ ] All inputs validated via Zod schemas on every single route.
- [ ] Helmet.js configured with Content Security Policy.
- [ ] CORS whitelist only allows frontend origins.
- [ ] Rate limiting applied per-route (auth: strict, read: relaxed, write: moderate).
- [ ] XSS sanitization on all user-generated text fields.
- [ ] No raw error stack traces in production responses.
- [ ] Password fields never returned in any API response.
- [ ] Refresh tokens properly rotated and invalidated on logout.
- [ ] File upload validation (type, size) on avatar endpoint.

**Rate Limiting Strategy:**
```
Auth endpoints:       10 req / 15 min / IP
AI Chat endpoints:    30 req / hour / user
Article read:         100 req / hour / user
Quiz submission:      10 req / hour / user
General API:          200 req / 15 min / user
```

**Production Readiness:**
- [ ] Structured JSON logging (Winston or Pino).
- [ ] Graceful shutdown handler (close DB connections, drain requests).
- [ ] Database connection pooling configured.
- [ ] Environment variable validation (all required vars checked at startup).
- [ ] Health check endpoint responds with DB status.
- [ ] Process management configuration (PM2 ecosystem file or Dockerfile).
- [ ] API documentation generated (Swagger/OpenAPI spec).
- [ ] All edge cases handled (duplicate entries, concurrent requests, race conditions).
- [ ] MongoDB indexes optimized (run explain() on critical queries).
- [ ] Cron job for subscription expiry checks.

---

## PHASE 16 — Integration Testing & End-to-End Validation

Validate the entire backend against the existing frontend flows.

**Test Flows (Manual or Automated):**

### Auth Flow
1. Signup → auto-create Profile + UserStats
2. Login → receive JWT + refresh cookie
3. Refresh → get new access token
4. Logout → invalidate session
5. Forgot password → reset flow

### Core User Journey
1. Read a current affairs article → increments `articlesRead`, updates streak, awards XP
2. Open AI Analyst → send message → receive contextual AI response
3. Browse courses → open lesson (notes preview)
4. Complete a lesson → update progress → recalculate completion %
5. Take a practice quiz → submit answers → receive score → award XP → update recall rate
6. View Dashboard → verify articles read, recall rate, subject-wise breakdown

### Profile & Settings
1. Edit profile fields → verify changes persist
2. Upload/remove avatar
3. Change password
4. Toggle incognito mode
5. Update notification preferences

### Subscription Flow
1. Subscribe to a plan → verify subscription record
2. Access premium content → verify gating works
3. Cancel subscription → verify auto-renew disabled
4. Expired subscription → verify premium access revoked

### Admin Flow
1. View dashboard stats
2. Manage users (status, role changes)
3. View/respond to support tickets
4. Content management (articles, courses, quizzes)

---

## PHASE 17 — Frontend-Backend Integration & API Contract Documentation

Create comprehensive API documentation and ensure frontend compatibility.

**Deliverables:**
1. Complete Swagger/OpenAPI specification for all endpoints.
2. API contract document mapping each frontend screen to its backend endpoints:
   - Splash → no API (client-side only)
   - Onboarding → no API (client-side only, checks AsyncStorage)
   - Login → `POST /api/v1/auth/login`
   - Create Account → `POST /api/v1/auth/signup`
   - Home → `GET /api/v1/users/me`, `GET /api/v1/progress/continue-learning`, `GET /api/v1/articles?limit=3`
   - Learn → `GET /api/v1/courses`
   - Course/[id] → `GET /api/v1/lessons/:id`
   - Current Affairs → `GET /api/v1/articles`, `GET /api/v1/articles/daily-progress`
   - Editorial Analyst → `GET /api/v1/chat/:articleId`, `POST /api/v1/chat/:articleId/message`
   - Practice → `GET /api/v1/practice/subjects`, `GET /api/v1/quizzes/:id/questions`, `POST /api/v1/quizzes/:id/submit`
   - Dashboard → `GET /api/v1/dashboard/stats`, `GET /api/v1/progress/summary`
   - Profile → `GET /api/v1/users/me`
   - Achievements → `GET /api/v1/gamification/achievements`, `GET /api/v1/gamification/level`
   - Subscription → `GET /api/v1/subscriptions/my-plan`, `POST /api/v1/subscriptions/subscribe`
   - Notifications → `GET /api/v1/notifications`, `GET/PATCH /api/v1/notifications/preferences`
   - Settings → `PATCH /api/v1/users/profile`, `PATCH /api/v1/users/change-name`, `PATCH /api/v1/users/change-password`
   - Support → `POST /api/v1/support/tickets`, `GET /api/v1/support/faq`
3. Environment setup guide for developers.
4. Database seeding script with sample data.

---

## PHASE 18 — Deployment & CI/CD Pipeline

Deploy the backend for production usage.

**Deliverables:**
1. Dockerfile and docker-compose for containerized deployment.
2. PM2 ecosystem configuration for process management.
3. MongoDB Atlas connection and security configuration.
4. Environment variable management (.env.production template).
5. CI/CD pipeline configuration (GitHub Actions):
   - Lint → Test → Build → Deploy
6. Monitoring and alerting setup (health checks, error rate alerts).
7. Backup strategy for MongoDB.
8. SSL/TLS configuration for HTTPS.
9. CDN setup for static assets (avatar images).
10. Domain and DNS configuration.
