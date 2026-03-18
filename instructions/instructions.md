--------------------------------------------------
PHASE 1 PROMPT
--------------------------------------------------

Initialize a production-grade backend for the UPSC educational platform.

Tech stack:
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- Environment variables: dotenv
- Data Validation: Zod (for request payload validation)
- Package manager: npm (or yarn)

Create this core folder structure (in the current Backend directory):

src/
  config/           (DB connection, env validation)
  controllers/      (Empty files for now)
  middlewares/      (Global error handling, CORS, async handler)
  models/           (Mongoose schemas)
  routes/           (Express routing setup)
  services/         (Business logic layer)
  utils/            (Helper functions, e.g., constants, API response formatter)
  server.js         (Entry point)
.env.example

Requirements:
- Set up proper global error handling middleware.
- Configure Morgan for logging.
- Set up the Mongoose database connection inside `config/db.js`.
- Make sure the server runs cleanly on `npm run dev`.

Do not create business logic yet.
Only infrastructure setup.

--------------------------------------------------
PHASE 2 PROMPT
--------------------------------------------------

Using Mongoose ODM, design the core schemas for Identity, Gamification, and Content.

Database: MongoDB

Create the following models inside `src/models` with proper indexing and validations:

1. User
   - email (string, unique, lowercase, required)
   - password (string, required - exclude from queries)
   - role (enum: STUDENT, INSTRUCTOR, ADMIN)
   - status (ACTIVE, INACTIVE, SUSPENDED)
   - createdAt / updatedAt

2. Profile
   - user (ObjectId, ref: User, required, unique)
   - fullName (string, required)
   - targetYear (string)
   - optionalSubject (string)
   - bio (string)
   - attemptCount (number)
   - dailyGoalHours (number)
   - homeState (string)
   - avatarUrl (string)
   - createdAt / updatedAt

3. UserStats (Gamification)
   - user (ObjectId, ref: User, required, unique)
   - xp (number, default: 0)
   - level (number, default: 1)
   - currentStreak (number, default: 0)
   - highestStreak (number, default: 0)
   - articlesRead (number, default: 0)
   - recallRatePercentage (number, default: 0)

4. Article (Current Affairs)
   - title (string, required)
   - content (string, required)
   - tag (string, e.g., 'GS II • POLITY')
   - source (string)
   - imageColor (string)
   - publishedDate (date)

5. ChatSession (AI Analyst)
   - user (ObjectId, ref: User)
   - article (ObjectId, ref: Article)
   - messages (Array of { role: 'user'|'ai'|'mentor', text: string, timestamp: Date })

Do not create APIs yet.

--------------------------------------------------
PHASE 3 PROMPT
--------------------------------------------------

Implement a production-grade authentication system in Express.

Requirements:
- Password hashing using bcrypt
- JWT access token (short expiry, e.g., 15-30 min)
- Refresh token rotation stored in the DB/Cookies (long expiry)
- HttpOnly Secure cookies to store refresh token
- Route guards for specific roles

Inside `src/`:
- controllers/authController.js
- services/authService.js
- routes/authRoutes.js
- middlewares/authMiddleware.js

Implement routes:
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout

Rules:
- Auto-create empty `Profile` and `UserStats` documents during signup.
- Validate input securely.

--------------------------------------------------
PHASE 4 PROMPT
--------------------------------------------------

Implement Current Affairs & AI Analyst engine.

Implement APIs:

GET /api/v1/articles (List daily news / current affairs with pagination)
GET /api/v1/articles/:id (Get article details)
POST /api/v1/articles/:id/read (Marks an article as read, increments UserStats `articlesRead`)

AI Chat Endpoints:
GET /api/v1/chat/:articleId (Fetch existing chat history for the AI Analyst / Editorial)
POST /api/v1/chat/:articleId/message (Send a user message, mock an AI response, update ChatSession array)

Rules:
- Log read articles accurately so the dashboard can reflect progress.
- Store the AI chat threads based on the user + article context.

--------------------------------------------------
PHASE 5 PROMPT
--------------------------------------------------

Implement Gamification Engine & Profile Management.

Implement routines for checking and updating levels based on XP thresholds.

Profile routes:
GET /api/v1/users/me (Fetch User, populated Profile, and populated UserStats)
PATCH /api/v1/users/profile (Update bio, targetYear, avatarUrl, attemptCount, etc.)

Gamification endpoints:
GET /api/v1/gamification/achievements (Return mock/static list of badges: Early Bird, Polity King, Top Scorer)
POST /api/v1/gamification/xp (Internal or secured endpoint to award XP for actions)

Rules:
- Whenever a user reads an article or passes a quiz, they should earn XP.
- Profile editing must merge partial updates securely.

--------------------------------------------------
PHASE 6 PROMPT
--------------------------------------------------

Implement Syllabus, Courses & Quiz Engine.

Create models:
1. Course / Subject (e.g., 'Polity', 'Economy')
   - title
   - description
   - totalModules
2. Lesson
   - course (ObjectId)
   - title
   - orderIndex
3. Quiz
   - lesson or course (ObjectId)
   - passingScore
4. Question
   - quiz (ObjectId)
   - text
   - options
   - correctOptionIndex
5. Submission
   - student (ObjectId)
   - quiz (ObjectId)
   - score

Implement APIs:
GET /api/v1/courses (List all courses)
GET /api/v1/courses/:id/lessons
GET /api/v1/quizzes/:id/questions (Hide correctOptionIndex)
POST /api/v1/quizzes/:id/submit (Returns score, awards XP if passed, updates UserStats recallRate)

--------------------------------------------------
PHASE 7 PROMPT
--------------------------------------------------

Implement Student Progress & Syllabus Tracker.

Create model:
1. Progress
   - student (ObjectId, ref: User)
   - course (ObjectId, ref: Course)
   - completedLessons (Array of ObjectIds)
   - completionPercentage (number)

Implement APIs:
POST /api/v1/progress/:courseId/lesson/:lessonId/complete
GET /api/v1/progress/summary (Returns the subject-wise breakdown for the dashboard: Polity 85%, Economy 40%)

Rules:
- Automatically recalculate syllabus tracking percentages whenever a lesson is completed.
- Ensure the overall 'Recall Rate' in UserStats reflects their quiz performances.

--------------------------------------------------
PHASE 8 PROMPT
--------------------------------------------------

Implement Payment & Subscription Engine.

Subscription tiers:
- MONTHLY (₹299)
- QUARTERLY (₹699)
- YEARLY (₹1999)

Create models:
1. Subscription
   - student (ObjectId, ref: User)
   - planType (MONTHLY, QUARTERLY, ANNUAL)
   - status (ACTIVE, EXPIRED)
   - expiryDate (date)

Implement APIs:
POST /api/v1/subscriptions/subscribe
GET /api/v1/subscriptions/my-plan

Add middleware `requirePremium` to lock certain quizzes/editorials if the user does not have an active subscription.
Ensure Admin APIs are also available: GET /api/v1/admin/dashboard-stats.
