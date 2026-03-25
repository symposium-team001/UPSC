# UPSC Platform Backend — User Manual & Testing Guide

**Version:** 1.0
**Covers:** Phase 1 (Infrastructure) through Phase 8 (Subscriptions + Admin)

> [!NOTE]
> This manual assumes you have Node.js ≥ 18, MongoDB running locally, and Redis running. If not, install them first.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Setup Environment
Copy `.env_example` to `.env` and fill in all values:
```bash
cp .env_example .env
```

### 3. Start the Server
```bash
npm run dev
```
You should see:
```
✅ MongoDB connected
✅ Redis connected
🚀 Server running on port 5000
```

---

## Phase 1 — Infrastructure

### Test: Health Check
```bash
curl http://localhost:5000/api/v1/health
```
**Expected:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "uptime": 12.34, "timestamp": "2026-03-24T..." }
}
```

---

## Phase 2 — Database Models

All 13 models are auto-registered when the server starts. Verify by checking server logs — no Mongoose errors should appear.

---

## Phase 3 — Authentication

### Test 1: Signup
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "SecurePass123!",
    "fullName": "Test Student"
  }'
```
**Expected:** `201` with `accessToken` in `data` and a `Set-Cookie` header for `refreshToken`.

### Test 2: Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "SecurePass123!"
  }'
```
**Expected:** `200` with `accessToken` in the response body.

### Test 3: Refresh Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -b "refreshToken=<token_from_cookie>"
```
**Expected:** `200` with new `accessToken`.

### Test 4: Logout
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <your_access_token>"
```
**Expected:** `200` with `"message": "Logged out successfully"`.

### Test 5: Invalid Credentials
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "student@test.com", "password": "wrongpassword" }'
```
**Expected:** `401` with `"message": "Invalid credentials"`.

---

## Phase 4 — Current Affairs

> Save your access token from Login as `$TOKEN` for the rest of the tests.

### Test 1: Create Article (requires INSTRUCTOR/ADMIN role)

First, create an admin user directly in MongoDB or modify the signup to accept roles:
```bash
curl -X POST http://localhost:5000/api/v1/articles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Union Budget 2026 Analysis",
    "content": "The Union Budget 2026 focused on...",
    "tag": "Economy",
    "isPublished": true
  }'
```
**Expected:** `201` with the created article object.

### Test 2: List Articles
```bash
curl http://localhost:5000/api/v1/articles \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with paginated list: `{ data: [...], page, limit, total, totalPages }`.

### Test 3: Get Single Article
```bash
curl http://localhost:5000/api/v1/articles/<articleId> \
  -H "Authorization: Bearer $TOKEN"
```

### Test 4: Mark Article as Read (awards 10 XP)
```bash
curl -X POST http://localhost:5000/api/v1/articles/<articleId>/read \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with `"Article marked as read"`. Check UserStats — XP should increase by 10.

### Test 5: Student Cannot Create Article
```bash
curl -X POST http://localhost:5000/api/v1/articles \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Test", "content": "Test", "tag": "GS" }'
```
**Expected:** `403` — access denied.

---

## Phase 4 — AI Analyst Chat

### Test 1: Get Chat Session
```bash
curl http://localhost:5000/api/v1/chat/<articleId> \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with an empty messages array (first-time session).

### Test 2: Send Message
```bash
curl -X POST http://localhost:5000/api/v1/chat/<articleId>/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "message": "Explain the key highlights of this article" }'
```
**Expected:** `200` with the session containing user + assistant messages.

> [!NOTE]
> The AI response is a placeholder in V1. Replace with a real AI API (Gemini/OpenAI) in production.

---

## Phase 5 — User Profile & Gamification

### Test 1: Get My Profile
```bash
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with `{ user, profile, stats }`.

### Test 2: Update Profile
```bash
curl -X PATCH http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "optionalSubject": "Geography",
    "dailyGoalHours": 6
  }'
```
**Expected:** `200` with updated profile.

### Test 3: Verify XP (via mark-read or quiz pass)
After marking articles as read, check `GET /users/me` — `stats.xp` should reflect the earned XP and `stats.level` should be recalculated.

---

## Phase 6 — Courses & Lessons

### Test 1: Create a Course (INSTRUCTOR/ADMIN)
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Indian Polity",
    "description": "Complete polity preparation for UPSC",
    "isPublished": true
  }'
```

### Test 2: Add a Lesson to a Course
```bash
curl -X POST http://localhost:5000/api/v1/courses/<courseId>/lessons \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fundamental Rights",
    "orderIndex": 0,
    "content": "Article 14 to 32 of the Indian Constitution..."
  }'
```

### Test 3: List Courses
```bash
curl http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer $TOKEN"
```

### Test 4: List Lessons (sorted by orderIndex)
```bash
curl http://localhost:5000/api/v1/courses/<courseId>/lessons \
  -H "Authorization: Bearer $TOKEN"
```

---

## Phase 6 — Quiz Engine

### Test 1: Create Quiz (INSTRUCTOR/ADMIN)
```bash
curl -X POST http://localhost:5000/api/v1/quizzes \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Polity Quiz 1",
    "passingScore": 50,
    "totalQuestions": 2
  }'
```

### Test 2: Add Questions
```bash
curl -X POST http://localhost:5000/api/v1/quizzes/<quizId>/questions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Which Article deals with Right to Equality?",
    "options": ["Article 12", "Article 14", "Article 19", "Article 21"],
    "correctOptionIndex": 1,
    "explanation": "Article 14 provides equality before law."
  }'
```

### Test 3: Get Questions (correctOptionIndex is hidden)
```bash
curl http://localhost:5000/api/v1/quizzes/<quizId>/questions \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Options visible, `correctOptionIndex` NOT in the response.

### Test 4: Submit Quiz
```bash
curl -X POST http://localhost:5000/api/v1/quizzes/<quizId>/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "answers": [1, 0] }'
```
**Expected:** `200` with `{ submission, correct, total }`. If passed, 50 XP is awarded.

---

## Phase 7 — Progress Tracker

### Test 1: Complete a Lesson
```bash
curl -X POST http://localhost:5000/api/v1/progress/<courseId>/lesson/<lessonId>/complete \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** `200` with progress object showing `completionPercentage` and 20 XP awarded.

### Test 2: Check Progress Summary
```bash
curl http://localhost:5000/api/v1/progress/summary \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Array of courses with completion stats.

### Test 3: Double-complete (idempotent)
Call the same complete endpoint again — XP should NOT be double-awarded.

---

## Phase 8 — Subscriptions

### Test 1: Subscribe (Razorpay)
```bash
curl -X POST http://localhost:5000/api/v1/subscriptions/subscribe \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planType": "MONTHLY",
    "razorpayOrderId": "order_test123",
    "razorpayPaymentId": "pay_test123",
    "razorpaySignature": "<valid_hmac_sha256>"
  }'
```
**Expected:** `201` on valid signature, `400` on invalid signature.

> [!IMPORTANT]
> Generate the correct signature using: `HMAC_SHA256("order_test123|pay_test123", RAZORPAY_KEY_SECRET)`

### Test 2: Get My Plan
```bash
curl http://localhost:5000/api/v1/subscriptions/my-plan \
  -H "Authorization: Bearer $TOKEN"
```

---

## Phase 8 — Admin Dashboard

### Test 1: Dashboard Stats (ADMIN only)
```bash
curl http://localhost:5000/api/v1/admin/dashboard-stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**Expected:** `200` with `{ totalUsers, activeSubscribers, totalArticles, totalSubmissions }`.

### Test 2: Non-Admin Denied
```bash
curl http://localhost:5000/api/v1/admin/dashboard-stats \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```
**Expected:** `403` — access denied.

---

## Quick Reference: All Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/v1/health` | ❌ | — |
| POST | `/api/v1/auth/signup` | ❌ | — |
| POST | `/api/v1/auth/login` | ❌ | — |
| POST | `/api/v1/auth/refresh` | Cookie | — |
| POST | `/api/v1/auth/logout` | ✅ | — |
| GET | `/api/v1/articles` | ✅ | — |
| GET | `/api/v1/articles/:id` | ✅ | — |
| POST | `/api/v1/articles/:id/read` | ✅ | — |
| POST | `/api/v1/articles` | ✅ | INSTRUCTOR/ADMIN |
| PATCH | `/api/v1/articles/:id` | ✅ | INSTRUCTOR/ADMIN |
| DELETE | `/api/v1/articles/:id` | ✅ | INSTRUCTOR/ADMIN |
| GET | `/api/v1/chat/:articleId` | ✅ | — |
| POST | `/api/v1/chat/:articleId/message` | ✅ | — |
| GET | `/api/v1/users/me` | ✅ | — |
| PATCH | `/api/v1/users/profile` | ✅ | — |
| GET | `/api/v1/courses` | ✅ | — |
| GET | `/api/v1/courses/:id` | ✅ | — |
| GET | `/api/v1/courses/:id/lessons` | ✅ | — |
| POST | `/api/v1/courses` | ✅ | INSTRUCTOR/ADMIN |
| PATCH | `/api/v1/courses/:id` | ✅ | INSTRUCTOR/ADMIN |
| DELETE | `/api/v1/courses/:id` | ✅ | INSTRUCTOR/ADMIN |
| POST | `/api/v1/courses/:id/lessons` | ✅ | INSTRUCTOR/ADMIN |
| PATCH | `/api/v1/courses/:id/lessons/:lessonId` | ✅ | INSTRUCTOR/ADMIN |
| DELETE | `/api/v1/courses/:id/lessons/:lessonId` | ✅ | INSTRUCTOR/ADMIN |
| GET | `/api/v1/quizzes` | ✅ | — |
| GET | `/api/v1/quizzes/:id` | ✅ | — |
| GET | `/api/v1/quizzes/:id/questions` | ✅ | — |
| POST | `/api/v1/quizzes/:id/submit` | ✅ | — |
| POST | `/api/v1/quizzes` | ✅ | INSTRUCTOR/ADMIN |
| POST | `/api/v1/quizzes/:id/questions` | ✅ | INSTRUCTOR/ADMIN |
| POST | `/api/v1/progress/:courseId/lesson/:lessonId/complete` | ✅ | — |
| GET | `/api/v1/progress/summary` | ✅ | — |
| POST | `/api/v1/subscriptions/subscribe` | ✅ | — |
| GET | `/api/v1/subscriptions/my-plan` | ✅ | — |
| GET | `/api/v1/admin/dashboard-stats` | ✅ | ADMIN |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Zod validation error at startup` | Check `.env` — a required variable is missing or malformed |
| `401 Unauthorized` | Token expired or missing — login again to get a fresh token |
| `403 Forbidden` | Your user role doesn't match the required role for that endpoint |
| `Cannot find module` | Run `npm install` — a dependency may be missing |
| `MongoDB connection failed` | Ensure `mongod` is running and `MONGO_URI` is correct |
| `Redis connection failed` | Ensure `redis-server` is running and `REDIS_URL` is correct |
