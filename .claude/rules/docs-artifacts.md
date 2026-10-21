---
paths:
  - "docs/**"
---
# Story artifact rules

- Filenames: `01-requirements.md`, `02-architecture.md`, `03-design-review.md`, `04-impl-plan.md`, `05-implementation-summary.md`, `06-code-review.md`, `07-verification-report.md`, `08-pr-summary.md`, plus `pipeline-state.json` and `session-memory.md`.
- Keep the Jira key (`<story-id>`) in every artifact and in its path; never write outside `docs/<story-id>/`.
- Keep artifacts concise: status, decision, evidence, risks, next action.
- End every stage artifact with an approval block: decision, approver, rationale, evidence, timestamp, next agent. Leave the decision `pending` until the user replies.
- Number findings `DR-n` (design review) and `CR-n` (code review) with severity, evidence, and a concrete recommendation.
- `pipeline-state.json` is the source of truth; append exactly one history entry per approved stage.
- `session-memory.md` is context only; never treat it as approval.
