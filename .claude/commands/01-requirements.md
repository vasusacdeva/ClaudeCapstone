---
description: "Stage 01: retrieve the Jira story and write the requirements artifact."
---
Run stage 01 for Jira story `$ARGUMENTS`.

- Follow `.claude/agents/01-requirements.md` and `.claude/skills/01-jira-retrieval/SKILL.md`.
- Retrieve the story through Jira MCP; stop and report the exact error if it cannot be found.
- Write `docs/<story-id>/01-requirements.md` with requirements, acceptance criteria, assumptions, open questions, and risks.
- Leave the approval decision `pending` until I reply.

Run this stage through the `requirements` subagent.
