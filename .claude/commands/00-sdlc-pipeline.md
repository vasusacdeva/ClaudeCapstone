---
description: "Run the full Agentic SDLC pipeline for one Jira story."
---
Run the SDLC pipeline for Jira story `$ARGUMENTS`.

- Follow `.claude/agents/00-sdlc-pipeline.md` and `.claude/skills/00-pipeline-orchestration/SKILL.md`.
- Create `docs/<story-id>/pipeline-state.json` after confirming the story exists.
- Execute stages 01 to 08 in order, stopping after each stage for my explicit `approved`, `rejected`, or `blocked` decision.
- Report the current stage, artifact, evidence, risks, and the exact reply needed to continue.

Run this stage through the `sdlc-pipeline` subagent.
