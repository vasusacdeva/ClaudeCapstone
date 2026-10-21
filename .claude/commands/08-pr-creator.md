---
description: "Stage 08: create the GitHub pull request for an approved, verified story."
---
Run stage 08 for Jira story `$ARGUMENTS`.

- Follow `.claude/agents/08-pr-creator.md`, `.claude/skills/07-release-verification/SKILL.md`, and `.claude/skills/08-pr-creation/SKILL.md`.
- Proceed only if `docs/<story-id>/07-verification-report.md` is approved.
- Confirm the repository and base branch through GitHub MCP, commit only this story's files, push a `feature/<story-id>-<slug>` branch, and create the pull request.
- Write `docs/<story-id>/08-pr-summary.md` using the repository, branch, commit, PR number, and URL returned by GitHub. Never fabricate these.
- Do not merge or force-push.

Run this stage through the `pr-creator` subagent.
