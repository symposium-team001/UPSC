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
Build phase (enter phase number)
Wait for my confirmation before moving to next phase.

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

After Phase 1 is done, ask agent:

```
Review the current project structure.
Check:
- Mongoose connection and models
- Express routing setup
- Env validation
- Proper JS (ES Modules) configuration
- React Native / Expo integration configuration (if applicable)
- No syntax or runtime errors

Fix errors first.

Only when stable → move to Phase 2.

---

## Step 4 — Use Checkpoint Prompts After Each Phase

After each phase, ask the agent:

Audit current architecture.
Are we following:
- Layered architecture (Routes -> Controllers -> Services -> Models)?
- Proper middleware usage?
- Data validation?
- Centralized error handling?
- Secure authentication practices?

This prevents silent architectural drift.
