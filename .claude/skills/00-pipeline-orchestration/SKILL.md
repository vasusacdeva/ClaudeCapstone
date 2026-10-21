---
name: 00-pipeline-orchestration
description: "Reusable capability for running one Jira story through the ordered SDLC stages with approval gates."
---
# Pipeline Orchestration

Reusable capability for running one Jira story through the ordered SDLC stages with approval gates.

## When to use
`00-sdlc-pipeline` at intake and at every stage handoff.

## Steps
1. Confirm the Jira key was supplied by the user and the story exists (see `.claude/skills/01-jira-retrieval/SKILL.md`).
2. Create `docs/<story-id>/pipeline-state.json` after the story is accepted; never pre-create empty story folders.
3. Before each stage, apply `.claude/hooks/01-pre-step-hook.md`: predecessor artifact exists and is `approved`, stage is next in sequence.
4. After each stage, apply `.claude/hooks/02-approval-hook.md`: require an explicit decision from a named approver; never infer approval.
5. After approval, apply `.claude/hooks/03-post-step-hook.md`: set the stage status, append one history entry, name the next agent.
6. Report: current stage, artifact, evidence, risks, and the exact reply needed to continue.

## State keys
`requirements`, `architecture`, `design-review`, `implementation-planner`, `implementation`, `code-review`, `verification`, `pr-creator`.

## Session manager
Stores the current session as a cache in `.cache/<story-id>.session.json` (git-ignored).

```json
{
  "sessionId": "<uuid>",
  "storyId": "KAN-116",
  "startedAt": "<ISO-8601>",
  "lastActiveAt": "<ISO-8601>",
  "currentStage": "architecture",
  "stages": { "requirements": "approved", "architecture": "pending-approval" },
  "tasks": { "T1": "done", "T2": "in-progress" },
  "pendingInput": "<draft of the decision or reply awaiting the user, or null>"
}
```

- **Start:** after the story is accepted, resume if a file exists with the same `storyId` and `pipeline-state.json` agrees on `currentStage`; otherwise create a new `sessionId`.
- **Update:** set `lastActiveAt` and the changed fields after every stage result, approval decision, and implementation task change.
- **Conflict:** if the cache disagrees with `pipeline-state.json`, trust `pipeline-state.json`, rewrite the cache, and record the mismatch.
- **Never store:** secrets, tokens, credentials, or raw Jira payloads (those stay in `.cache/<story-id>.atlassian-issue.json`).
- **Reset:** delete or replace the file when the story key changes or the user asks for a fresh session.
- The cache never counts as approval evidence.

## Session memory
Durable notes for resuming across Claude Code sessions, stored in `docs/<story-id>/session-memory.md` (format: `.claude/templates/session-memory.md`). Unlike the session cache it is committed and survives cache deletion.

- **Load:** at intake, after the story is accepted, read it if it exists and report the current stage and next steps. Create it from the template at the first stage handoff, not before.
- **Update:** at every stage result, approval decision, and when the user ends or pauses a session. Append decisions, open questions, and learnings; replace `Next steps`; set `Last updated` and `Current stage`.
- **Keep short:** record only what is not already in a stage artifact; link to artifacts instead of copying them.
- **Conflict:** `pipeline-state.json` and approved artifacts win; correct the memory and note the mismatch.
- **Never store:** secrets, tokens, credentials, or raw Jira payloads.
- It never counts as approval evidence and does not unblock a stage.

## Failure handling
On `rejected`, `blocked`, a missing predecessor, or a failed hook, stop, record the reason, and leave the last approved state unchanged.
