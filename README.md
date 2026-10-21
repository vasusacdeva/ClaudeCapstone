# Claude Code Agentic SDLC Pipeline Capstone

An end-to-end, Jira-driven software delivery pipeline built from Claude Code subagents, instructions,
skills, prompts, hooks, and MCP connections. The pipeline takes **any** Jira issue key at runtime and walks it
through requirements, architecture, design review, implementation planning, implementation, code review,
verification, and PR creation, producing a traceable set of docs along the way.

> **No story is hardcoded in the pipeline.** The Jira key (`<story-id>`) is supplied at runtime. Every agent,
> instruction, skill, prompt, and script is parameterized. `docs/KAN-116/`, `app/`, and `tests/tasks.test.js`
> are the output of running the pipeline for story KAN-116.

## Folder structure

```
.cache/
  (runtime cache for MCP responses and sessions, gitignored)
.claude/
  agents/                       Subagents, one per stage (00-08), with the detailed rules inline
  commands/                     Slash commands that start each stage (/requirements KAN-116)
  skills/<name>/SKILL.md        Reusable capabilities used by agents
  hooks/                        Lifecycle protocols: pre-step, approval, post-step
CLAUDE.md                       Repo-wide standards (CREATE framework, approval gates, MCP usage)
.mcp.json                      MCP server connections (Jira + GitHub)
app/                            To-Do app built for KAN-116 (index.html, app.js, tasks.js, styles.css)
docs/
  <story-id>/                   Created per run: stage artifacts 01-08 and pipeline-state.json
tests/
  tasks.test.js                 Unit tests for the KAN-116 app (node --test)
  validate-story.ps1            Pipeline validation script: -JiraId <KEY>
package.json                    `npm test` runs the unit tests
.token-optimization.md          Notes on keeping the pipeline cheap on tokens
```

`.cache/` is created at runtime, is gitignored, and is safe to delete. The caching rules are in
`.claude/context-caching.md`.

## How the pieces fit together

Each subagent in `.claude/agents/` holds its context, role, tools, expected output, and detailed rules (steps and approval block). A slash command in `.claude/commands/` starts the stage, and a skill in `.claude/skills/` provides the reusable steps.

| # | Subagent | Agent file | Slash command | Skill |
|---|----------|------------|---------------|-------|
| 00 | `sdlc-pipeline` | `.claude/agents/00-sdlc-pipeline.md` | `.claude/commands/00-sdlc-pipeline.md` | `.claude/skills/00-pipeline-orchestration/SKILL.md` |
| 01 | `requirements` | `.claude/agents/01-requirements.md` | `.claude/commands/01-requirements.md` | `.claude/skills/01-jira-retrieval/SKILL.md` |
| 02 | `architecture` | `.claude/agents/02-architecture.md` | `.claude/commands/02-architecture.md` | `.claude/skills/02-architecture-design/SKILL.md` |
| 03 | `design-review` | `.claude/agents/03-design-review.md` | `.claude/commands/03-design-review.md` | `.claude/skills/03-design-review/SKILL.md` |
| 04 | `implementation-planner` | `.claude/agents/04-implementation-planner.md` | `.claude/commands/04-implementation-planner.md` | `.claude/skills/04-implementation-planning/SKILL.md` |
| 05 | `implementation` | `.claude/agents/05-implementation.md` | `.claude/commands/05-implementation.md` | `.claude/skills/05-local-implementation/SKILL.md` |
| 06 | `code-review` | `.claude/agents/06-code-review.md` | `.claude/commands/06-code-review.md` | `.claude/skills/06-code-review/SKILL.md` |
| 07 | `verification` | `.claude/agents/07-verification.md` | `.claude/commands/07-verification.md` | `.claude/skills/07-release-verification/SKILL.md` (includes PR validation) |
| 08 | `pr-creator` | `.claude/agents/08-pr-creator.md` | `.claude/commands/08-pr-creator.md` | `.claude/skills/08-pr-creation/SKILL.md` (re-runs the validation in the 07 skill) |

## Pipeline stages and artifacts

| # | Agent | Reads | Writes |
|---|-------|-------|--------|
| 00 | `sdlc-pipeline` (orchestrator) | | `docs/<story-id>/pipeline-state.json` |
| 01 | `requirements` | Jira issue (via Jira MCP) | `docs/<story-id>/01-requirements.md` |
| 02 | `architecture` | 01 | `docs/<story-id>/02-architecture.md` |
| 03 | `design-review` | 02 (and 01 for coverage) | `docs/<story-id>/03-design-review.md` |
| 04 | `implementation-planner` | 03 | `docs/<story-id>/04-impl-plan.md` |
| 05 | `implementation` | 04 | app code and tests in the workspace, plus `docs/<story-id>/05-implementation-summary.md` |
| 06 | `code-review` | 05 | `docs/<story-id>/06-code-review.md` |
| 07 | `verification` | 06, `tests/validate-story.ps1` | `docs/<story-id>/07-verification-report.md` |
| 08 | `pr-creator` | 07 (via GitHub MCP) | `docs/<story-id>/08-pr-summary.md` and the pull request |

Every stage artifact ends with an approval block: decision, approver, rationale, evidence, timestamp, and next
agent.

## Running the pipeline

1. Start with `claude --agent sdlc-pipeline`, or run a stage's slash command from `.claude/commands/`, and give it the Jira
   key (for example `KAN-116`).
2. The agent confirms the story exists, creates `docs/<story-id>/pipeline-state.json`, and runs stage 01.
3. After each stage it stops. Reply `approved`, `rejected`, or `blocked` (with the approver and reason) to
   continue. Approval is never inferred, as defined in [.claude/hooks/02-approval-hook.md](.claude/hooks/02-approval-hook.md).
4. Stages run strictly in order 01 to 08; a later stage never starts before the preceding one is approved.

Claude Code lists slash commands from `.claude/commands/`.

### Stage 05 runs locally (no GitHub repo required)

Stage 05 never asks for a GitHub repository, owner, or branch. It:

1. Builds the feature from the approved plan (`04-impl-plan.md`) directly in the workspace.
2. Runs the checks locally (for example `npm test`) and records the command, output, and result in
   `docs/<story-id>/05-implementation-summary.md`, including any check it could not run.
3. Stops at the approval gate without any GitHub interaction.

GitHub is only needed at stage 08 (`08-pr-creator`), after verification is approved. Stages 01-07 work without
a repository or the GitHub MCP server.

## Validation and tests

```powershell
npm test                                          # unit tests in tests/tasks.test.js
./tests/validate-story.ps1 -JiraId KAN-116        # checks docs 01-06 exist and code-review is approved
```

`validate-story.ps1` expects these filenames and the state key `code-review` in `pipeline-state.json`:
`01-requirements.md`, `02-architecture.md`, `03-design-review.md`, `04-impl-plan.md`,
`05-implementation-summary.md`, `06-code-review.md`.

## KAN-116 To-Do app

Open `app/index.html` in a browser. It is a static page with no build step: add a task with the button or
Enter, tick the checkbox to mark it complete, and use the trash icon to delete it. Tasks are kept in the
browser's `localStorage`.

## Connecting MCP

[.mcp.json](.mcp.json) declares two servers:

- `jira`: the `mcp-atlassian` server (run via `uvx`), used for Jira retrieval. Needs the
  `JIRA_API_ACCESS_TOKEN` environment variable to be set.
- `github`: the `@modelcontextprotocol/server-github` server, used for PR creation. Needs the
  `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable to be set.

Run `claude mcp list` to check the servers and approve them on first use. Secrets are read from environment variables and
are never stored in this repo.
