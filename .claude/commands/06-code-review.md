---
description: "Stage 06: review the implementation for quality, security, and acceptance coverage."
---
Run stage 06 for Jira story `$ARGUMENTS`.

- Follow `.claude/agents/06-code-review.md` and `.claude/skills/06-code-review/SKILL.md`.
- Proceed only if `docs/<story-id>/05-implementation-summary.md` is approved.
- Run the tests and unsafe-pattern checks, then write `docs/<story-id>/06-code-review.md` with severity-rated findings and acceptance coverage.
- Do not modify application code. Leave the approval decision `pending` until I reply.

Run this stage through the `code-review` subagent.
