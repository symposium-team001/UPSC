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

Using Mongoose ODM, design the core authentication and identity schema for the platform.

Database: MongoDB

Create the following models inside `src/models` with proper indexing and validations:

1. User
   - email (string, unique, lowercase, required)
   - password (string, required - exclude from queries by default)
   - role (enum: STUDENT, INSTRUCTOR, ADMIN)
   - status (enum: ACTIVE, INACTIVE, SUSPENDED)
   - emailVerified (boolean, default false)
   - createdAt / updatedAt (timestamps: true)

2. Profile
   - user (ObjectId, ref: User, required, unique)
   - fullName (string, required)
   - phoneNumber (string)
   - dateOfBirth (date)
   - createdAt / updatedAt (timestamps: true)

3. Session / RefreshToken (Optional, depending on refresh token strategy)
   - user (ObjectId, ref: User, required)
   - token (string, required)
   - expiresAt (date, required)
   - createdAt (date, defaults to now, expires index based on expiresAt)

4. AuditLog
   - actor (ObjectId, ref: User, nullable)
   - action (string, required)
   - targetResource (string)
   - targetId (ObjectId, nullable)
   - metadata (Mixed data type)
   - ipAddress (string)
   - createdAt (date, default: Date.now)

All sensitive fields must be indexed properly.
Use proper Mongoose ref types for relations.

Do not create APIs yet.

--------------------------------------------------
PHASE 3 PROMPT
--------------------------------------------------

Implement a production-grade authentication system in Express.

Requirements:

- Password hashing using bcrypt
- JWT access token (short expiry, e.g., 15-30 min)
- Refresh token rotation stored in the DB (long expiry, e.g., 7 days)
- HttpOnly Secure cookies to store refresh token (and optionally access token depending on approach)
- Role-based authorization middleware
- Global API Response formatter

Inside `src/`:

- controllers/authController.js
- services/authService.js
- routes/authRoutes.js
- middlewares/authMiddleware.js

Implement routes:

POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/refresh (Extracts HttpOnly cookie to issue new access token)
POST /api/v1/auth/logout

All routes must:
- Validate input payloads securely (using Zod or Joi logic inside a validateRequest middleware)
- Log critical auth events to AuditLog
- Never expose internal error stack traces

--------------------------------------------------
PHASE 4 PROMPT
--------------------------------------------------

Extend the database schema and implement the Course & Content Management engine.

Create models:

1. Course
   - instructor (ObjectId, ref: User, required)
   - title (string, required)
   - description (string)
   - category (string)
   - price (number, default: 0)
   - status (enum: DRAFT, PUBLISHED, ARCHIVED)
   - syllabus (Array of objects)

2. Lesson
   - course (ObjectId, ref: Course, required)
   - title (string, required)
   - videoUrl (string)
   - content (string)
   - orderIndex (number, required)
   - isFreePreview (boolean, default: false)

Implement APIs:

Instructor specific routes (require INSTRUCTOR role):
POST /api/v1/courses
PATCH /api/v1/courses/:id
DELETE /api/v1/courses/:id
POST /api/v1/courses/:courseId/lessons

Public / Student routes:
GET /api/v1/courses (List all published courses with pagination and filtering)
GET /api/v1/courses/:id (Get course details)

Rules:
- Instructors can only modify their own courses.
- Course status changes should be logged in AuditLog.

--------------------------------------------------
PHASE 5 PROMPT
--------------------------------------------------

Implement the Exam & Quiz Engine.

Create models:

1. Quiz
   - course (ObjectId, ref: Course, required)
   - title (string, required)
   - passingScore (number, default: 40)
   - timeLimitMinutes (number)
   - status (enum: DRAFT, PUBLISHED)

2. Question
   - quiz (ObjectId, ref: Quiz, required)
   - text (string, required)
   - options (Array of strings, min length: 2)
   - correctOptionIndex (number, required)

3. Submission
   - student (ObjectId, ref: User, required)
   - quiz (ObjectId, ref: Quiz, required)
   - score (number)
   - answers (Array of objects recording selected options)
   - passed (boolean)

Implement APIs:

Instructor routes:
POST /api/v1/quizzes
POST /api/v1/quizzes/:quizId/questions

Student routes:
GET /api/v1/quizzes/:quizId/questions (Do NOT expose correctOptionIndex)
POST /api/v1/quizzes/:quizId/submit (Returns score and true/false for pass)

--------------------------------------------------
PHASE 6 PROMPT
--------------------------------------------------

Implement Student Progress & Tracking System.

Create model:

1. Progress
   - student (ObjectId, ref: User, required)
   - course (ObjectId, ref: Course, required)
   - completedLessons (Array of ObjectIds ref: Lesson)
   - courseCompletionPercentage (number, default: 0)
   - lastAccessedAt (date)
   - isCompleted (boolean, default: false)

Implement APIs:

POST /api/v1/progress/:courseId/lesson/:lessonId/complete
GET /api/v1/progress/:courseId

Rules:
- Updating completion requires the user to be enrolled/subscribed (enforced by middleware).
- Re-calculates course completion percentage on every lesson marked complete.

--------------------------------------------------
PHASE 7 PROMPT
--------------------------------------------------

Implement Payment & Subscription (Enrollment) System.
*Note: This phase does not require heavy logic depending on the gateway used, but focuses on the DB schema for tracking enrollment limits / subscriptions.*

Create models:

1. Subscription
   - student (ObjectId, ref: User, required)
   - course (ObjectId, ref: Course, required)
   - status (enum: ACTIVE, EXPIRED, CANCELLED)
   - paymentId (string, external reference to Stripe/Razorpay etc.)
   - amountPaid (number)

Implement APIs:

POST /api/v1/enroll (Creates a subscription record after verifying payment intent/webhook status)
GET /api/v1/subscriptions (List student's enrolled courses)

Add generic global middleware `requireSubscription(courseId)` which validates that `req.user` has an active `Subscription` record for the requested course before allowing access to locked lessons/quizzes.

--------------------------------------------------
PHASE 8 PROMPT
--------------------------------------------------

Implement Web & Mobile Integration Support routes.

Add generic notification engines, admin dashboards, and generic user endpoints.

Implement APIs:

GET /api/v1/users/me (Fetch full profile info)
PATCH /api/v1/users/me (Update basic settings)

Admin features:
GET /api/v1/admin/dashboard-stats
GET /api/v1/admin/audit-logs
PATCH /api/v1/users/:id/status (Suspend accounts)

Add generic pagination parameters securely across all GET endpoints that return lists. Validate input query limits so database is not overloaded.
