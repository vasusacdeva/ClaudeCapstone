---
description: "Stage 05: implement the approved plan locally and document results."
---
Run stage 05 for Jira story `$ARGUMENTS`.

- Follow `.claude/agents/05-implementation.md` and `.claude/skills/05-local-implementation/SKILL.md`.
- Proceed only if `docs/<story-id>/04-impl-plan.md` is approved.
- Implement only planned tasks, run the tests, and record commands and results honestly, including checks not executed.
- Write `docs/<story-id>/05-implementation-summary.md` and leave the approval decision `pending` until I reply.
- Do not use GitHub at this stage.

Run this stage through the `implementation` subagent.
