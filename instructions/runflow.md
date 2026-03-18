## Step 1 — Tell Agent To Follow It

Before doing anything else, send this:

Follow [GEMINI.md](./GEMINI.md) strictly.
Follow [instructions.md](./instructions.md) strictly.
We will execute phases one by one.
Do not skip phases.
Do not generate future phase code.
Do not generate placeholder or mock logic.
Build phase (enter phase number)
Wait for my confirmation before moving to next phase.

This locks the behavior.


## Step 2 — Execute Phase 1 Only

Open your [instructions.md](./instructions.md).

Copy ONLY Phase 1 prompt.

Paste it into the agent.

Wait until:

It completes

No errors

You can run the project

Do NOT paste Phase 2 yet.


## Step 3 — Validate Before Moving Forward

Review the current project structure.
Check:
- Mongoose connection and models
- Express routing setup  
- Env validation with Zod (all required vars)
- ES Modules only — no require() anywhere
- asyncHandler wrapping all async functions
- Centralized error handler returning { success, message, data } shape
- No stack traces exposed
- No syntax or runtime errors

Run npm run dev mentally and tell me if it would boot cleanly.
Fix all issues before confirming Phase 1 complete.


## Very Important: Use “Checkpoint Prompts”

Audit current architecture against GEMINI.md.
Check every file generated so far:

1. Routes — do they contain ANY logic or DB calls?
2. Controllers — do they contain ANY business logic?
3. Services — do they contain req or res objects?
4. Models — do they contain ANY business logic?
5. Every async controller — is it wrapped in asyncHandler?
6. Every response — does it follow { success, message, data }?
7. Any passwordHash or refreshTokenHash visible in responses?
8. Any CommonJS require() calls?
9. Any .find({}) without filter and pagination?

List every violation found, file by file.
Do not proceed until all violations are fixed.

## correct loop

Session start:
  → Load GEMINI.md + instructions.md
  → Send lock prompt

Phase execution:
  → Paste phase prompt
  → Get files one at a time (not all at once)
  → Run npm run dev after each file if it touches app.js or server.js

After phase completes:
  → Send validation prompt (Step 3)
  → Send architecture audit prompt (checkpoint)
  → Fix all violations

Only after both pass → confirm and move to next phase
