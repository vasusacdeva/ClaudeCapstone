---
description: "Stage 04: create the implementation plan from the approved design review."
---
Run stage 04 for Jira story `$ARGUMENTS`.

- Follow `.claude/agents/04-implementation-planner.md` and `.claude/skills/04-implementation-planning/SKILL.md`.
- Proceed only if `docs/<story-id>/03-design-review.md` is approved.
- Write `docs/<story-id>/04-impl-plan.md` with ordered tasks, dependencies, validation strategy, and risks.
- Leave the approval decision `pending` until I reply.

Run this stage through the `implementation-planner` subagent.
