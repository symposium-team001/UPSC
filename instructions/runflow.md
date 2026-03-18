# Ethora Backend — Developer Runflow Guide

> This document describes the **exact workflow** to follow when building the backend using the AI coding agent.
> It ensures architectural discipline, prevents drift, and guarantees each phase is stable before moving forward.

---

## Step 1 — Lock the Agent's Behavior

Before doing anything else, send this **exact prompt** to the agent:

```
Follow GEMINI.md strictly.
Follow instructions.md strictly.
We will execute phases one by one.
Do not skip phases.
Do not generate future phase code.
Build Phase [ENTER PHASE NUMBER].
Wait for my confirmation before moving to the next phase.
```

This locks the agent to the current phase only.

---

## Step 2 — Execute One Phase at a Time

1. Open [instructions.md](./instructions.md).
2. Copy **ONLY** the current phase prompt (e.g., Phase 1).
3. Paste it into the agent.
4. Wait until:
   - It completes all files for that phase.
   - No errors.
   - You can run the project: `npm run dev`.
5. **Do NOT paste the next phase until the current one is fully verified.**

---

## Step 3 — Validate Before Moving Forward

After every phase is complete, ask the agent to review:

```
Review the current project structure.
Check:
- Mongoose connection and models (if applicable)
- Express routing setup
- Zod validation on all new routes
- Proper JS (ES Modules) configuration
- Layered architecture (Routes → Controllers → Services → Repositories → Models)
- Middleware usage (auth, error handling, rate limiting)
- Centralized error handling
- No syntax or runtime errors

Fix all errors first.
```

Only when the project is stable and error-free → move to the next phase.

---

## Step 4 — Use Checkpoint Prompts After Each Phase

After each phase is validated, run this audit prompt:

```
Audit current architecture.
Are we following:
- Layered architecture (Routes → Controllers → Services → Repositories → Models)?
- Proper middleware pipeline (CORS → Rate Limit → Auth → Validation → Controller)?
- Zod-based request validation on every route?
- Centralized error handling with AppError class?
- Secure authentication practices (bcrypt, JWT, HttpOnly cookies)?
- Consistent API response format: { success, message, data, error }?
- Proper DB indexing on frequently queried fields?
- No business logic in routes or controllers?
- No raw SQL/NoSQL queries outside repository layer?
```

This prevents **silent architectural drift** across phases.

---

## Step 5 — Phase Dependency Map

Use this to understand what depends on what:

| Phase | Name | Depends On |
|-------|------|------------|
| 1 | Foundation & Scaffolding | — |
| 2 | Core Database Schemas | Phase 1 |
| 3 | Authentication System | Phase 1, 2 |
| 4 | Current Affairs Engine | Phase 2, 3 |
| 5 | AI Editorial Analyst | Phase 2, 3, 4 |
| 6 | Profile Management | Phase 2, 3 |
| 7 | Gamification & Achievements | Phase 2, 3, 6 |
| 8 | Courses & Lessons | Phase 2, 3 |
| 9 | Quiz & Practice Engine | Phase 2, 3, 7, 8 |
| 10 | Progress & Dashboard | Phase 2, 3, 8, 9 |
| 11 | Subscription & Payments | Phase 2, 3 |
| 12 | Notification System | Phase 2, 3, 7 |
| 13 | Help & Support | Phase 2, 3 |
| 14 | Admin Dashboard | Phase 3, 4, 8, 9, 11 |
| 15 | Security Hardening | All previous phases |
| 16 | Integration Testing | All previous phases |
| 17 | API Documentation | All previous phases |
| 18 | Deployment & CI/CD | All previous phases |

---

## Step 6 — Testing Each Phase

After each phase, test the new endpoints:

### Quick Test Commands
```bash
# Health check
curl http://localhost:5000/api/v1/health

# Signup
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ethora.com","password":"Str0ng!P@ss","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ethora.com","password":"Str0ng!P@ss"}'
```

Use **Postman** or **Thunder Client** for more complex testing with authorization headers.

---

## Step 7 — When Things Go Wrong

If a phase introduces errors:

1. **Do NOT move to the next phase.**
2. Ask the agent:
   ```
   There are errors in Phase [X].
   Review the error and fix it.
   Do not modify any other phase's code.
   Only fix what is broken in Phase [X].
   ```
3. Re-validate after the fix.
4. Only then proceed.

---

## Step 8 — Phase Completion Checklist

Before marking any phase as complete, verify:

- [ ] All routes from the phase instructions are implemented
- [ ] All models from the phase instructions are created
- [ ] All Zod validators are in place
- [ ] All services have proper error handling
- [ ] Server starts without errors (`npm run dev`)
- [ ] Basic API calls work via curl/Postman
- [ ] No console warnings or deprecation notices
- [ ] Code follows the project's folder structure conventions

---

## Step 9 — Summary of All Phases

| # | Phase | Key Deliverables |
|---|-------|-----------------|
| 1 | Foundation | Server, folder structure, error handling, health check |
| 2 | Schemas | User, Profile, UserStats, Article, ChatSession models |
| 3 | Auth | Signup, login, JWT, refresh tokens, route guards |
| 4 | Current Affairs | Article CRUD, read tracking, streak logic |
| 5 | AI Analyst | Chat per article, AI response generation |
| 6 | Profile | User profile CRUD, avatar, settings |
| 7 | Gamification | XP, levels, streaks, achievements, leaderboard |
| 8 | Courses | Course/Lesson CRUD, structured content |
| 9 | Quiz Engine | Quiz/Question/Submission, scoring, XP awards |
| 10 | Progress | Lesson completion, syllabus tracking, dashboard stats |
| 11 | Subscription | Plans, payment webhooks, premium gating |
| 12 | Notifications | Notification CRUD, preferences, triggers |
| 13 | Support | Tickets, FAQ, feedback |
| 14 | Admin | Dashboard stats, user management, content stats |
| 15 | Security | Rate limiting, hardening, production polish |
| 16 | Testing | End-to-end validation of all flows |
| 17 | API Docs | Swagger/OpenAPI, screen-to-endpoint mapping |
| 18 | Deployment | Docker, CI/CD, monitoring, backup |

---

## Golden Rules

1. **Never skip phases.** Each phase depends on the ones before it.
2. **Never let the agent generate code for future phases.** It will introduce inconsistencies.
3. **Always validate before moving forward.** One broken phase cascades into everything after it.
4. **Use checkpoint prompts after every phase.** Architectural drift is the #1 killer of large projects.
5. **Test every endpoint as soon as it's built.** Don't batch testing to the end.
