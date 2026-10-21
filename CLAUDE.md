# CLAUDE.md

Jira-driven Agentic SDLC pipeline (Claude Code subagents). The Jira key (`<story-id>`) is supplied at runtime; nothing is hardcoded.

## Commands
- Test: `npm test` (runs `node --test` on `tests/tasks.test.js`)
- Validate a story run: `pwsh tests/validate-story.ps1 -JiraId <KEY>`
- App: static files in `app/` (open `app/index.html`)

## Layout
- `.claude/agents/` stage subagents (sdlc-pipeline, requirements ... pr-creator)
- `.claude/commands/` slash commands per stage; `.claude/skills/` reusable steps; `.claude/hooks/` pre-step, approval, post-step protocols. Detailed per-stage rules live in each agent file.
- `.claude/rules/` path-scoped rules: `docs-artifacts.md` (docs/**), `code-security.md` (app/**, tests/**), `framework-files.md` (.claude/**)
- `docs/<story-id>/` all story artifacts (01-requirements ... 08-pr-summary, `pipeline-state.json`)
- `.mcp.json` Jira and GitHub MCP servers (needs `JIRA_API_ACCESS_TOKEN`, `GITHUB_PERSONAL_ACCESS_TOKEN` env vars)

## Pipeline rules (CREATE framework)
Context, Role, Execution, Approval, Tools, Expected Output for every stage.
- Run stages strictly in order: 00 pipeline, 01 requirements, 02 architecture, 03 design review, 04 implementation planner, 05 implementation, 06 code review, 07 verification, 08 PR creator.
- Never skip, reorder, or parallelize stages. Do not start a stage until the previous one has an explicit `approved` decision.
- `rejected` and `blocked` are terminal for the stage; document reason and required action.
- Never infer approval from tool success, silence, doc creation, or passing tests.
- Each artifact ends with an approval block: decision, approver, rationale, evidence, timestamp, next agent.
- Release-readiness approval required before PR creation; confirm PR on GitHub before reporting completion.

## MCP
- Jira MCP: story intake and metadata only. GitHub MCP: repo/branch checks and PR creation only.
- Never fabricate repo, branch, commit, PR number, or PR URL.
- Pass only the minimum approved context to the next stage.

## Session memory
- When a story key is given, read `docs/<story-id>/session-memory.md` if it exists before acting; the orchestrator updates it at each stage transition (format: `.claude/templates/session-memory.md`).
- A `SessionStart` hook (`.claude/settings.json`, `.claude/hooks/session-memory.ps1`) loads the most recently updated memory file automatically.
- A `Stop` hook (`.claude/hooks/save-session-memory.ps1`) asks for a memory update when `session-memory.md` is older than `pipeline-state.json`; it fires once per stop.
- Memory never replaces `pipeline-state.json` or counts as approval.

## Conventions
- Outputs go under `docs/<story-id>/`, created only after the pipeline accepts the story; keep the Jira key in every artifact.
- Keep artifacts concise: status, decision, evidence, risks, next action.
- Do not create or edit hook definitions unless asked. If a required hook fails, record it and stop where a gate requires.
- Keep each agent definition to one responsibility; do not add unrequested agents or workflow files.
- Search narrowly, summarize large MCP responses, avoid repeating context.
