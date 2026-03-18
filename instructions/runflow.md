## Step 1 — Tell Agent To Follow It

Before doing anything else, send this:

Follow [GEMINI.md](./GEMINI.md) strictly.
Follow [instructions.md](./instructions.md) strictly.
We will execute phases one by one.
Do not skip phases.
Do not generate future phase code.
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

After Phase 1 is done, ask agent:

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


## Very Important: Use “Checkpoint Prompts”

After each phase, ask the agent:

Audit current architecture.
Are we following:
- Layered architecture (Routes -> Controllers -> Services -> Models)?
- Proper middleware usage?
- Data validation?
- Centralized error handling?
- Secure authentication practices?

This prevents silent architectural drift.
