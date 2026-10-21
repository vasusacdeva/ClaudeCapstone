# KAN-116 Requirements: Create Basic To-Do List

Status: awaiting approval. Source: Jira MCP (retrieved 2026-10-21). Items tagged [A] are assumptions and [Q] are open questions; neither is a Jira fact.

## 1. Metadata
| Field | Value |
|-------|-------|
| Key | KAN-116 |
| Title | Create Basic To-Do List |
| Type | Story |
| Priority | Medium |
| Status | To Do |
| Project | KAN (Codemie Capston) |
| Reporter / Assignee | Vasu Sachdeva / Unassigned |
| Created / Updated | 2026-10-16 |
| Link | https://vasusachdeva11.atlassian.net/browse/KAN-116 |
| Comments / linked issues / remote links | None |

## 2. User Story
As an end-user using the To-Do application dashboard, I want to quickly add tasks, view what needs to be done, mark tasks as complete, and delete items I no longer need, so that I can stay organized and track my work.

## 3. Context
- Clean, intuitive To-Do list interface.
- Core foundational feature of the productivity application.

## 4. Functional Requirements
| ID | Requirement | Source |
|----|-------------|--------|
| FR-1 | The dashboard provides a text input field and an "Add Task" button for entering a task description. | AC-1 |
| FR-2 | Clicking "Add Task" or pressing Enter in the input adds the task. | AC-1 |
| FR-3 | A newly added task appears immediately in the list with active (incomplete) status. Position (top or bottom) is unresolved, see Q-1. | AC-1 |
| FR-4 | After a task is added, the input field clears automatically. | AC-1 |
| FR-5 | Each task shows a Delete (trash icon) button. | AC-2 |
| FR-6 | Clicking Delete permanently removes that task from the list and the UI. | AC-2 |
| FR-7 | The interface lets users mark tasks as complete. | Jira "Other information"; user story |
| FR-8 | The interface shows the current task list so users can see what needs to be done. | User story ("view what needs to be done") |

## 5. Acceptance Criteria (verbatim intent from Jira)
- AC-1: Given the user is on the dashboard, when they type a task description and click "Add Task" (or press Enter), then the new task instantly appears at the top/bottom of the task list with an active status, and the input field automatically clears.
- AC-2: Given the user has tasks, when they click the Delete (trash icon) button next to a task, then the task is permanently removed from the list and UI.
- Note: No explicit acceptance criterion exists for marking a task complete (FR-7); it appears only under "Other information". See Q-4.

## 6. Non-Functional Constraints
- Jira states only: clean and intuitive interface; additions appear "instantly".
- [A] No performance, accessibility, browser, or security targets are given; none are invented here.

## 7. Assumptions
- A-1 [A]: Repository context (CLAUDE.md) indicates a static app in `app/` (`app/index.html`); a client-side implementation is assumed. Not stated in Jira.
- A-2 [A]: Tasks are not required to persist across page reloads, because the story does not mention persistence (see Q-3).
- A-3 [A]: Empty or whitespace-only input does not create a task (see Q-2).
- A-4 [A]: "Permanently removed" means no undo or confirmation; the story mentions no confirmation dialog.
- A-5 [A]: Completed tasks stay visible in the list, shown with a distinct style, and completion is toggleable (see Q-4).

## 8. Open Questions
- Q-1: Top or bottom placement of new tasks? The story says "top/bottom" without choosing. Proposed default: top (newest first). Needs user decision.
- Q-2: Behavior for empty or whitespace-only input (ignore silently, show validation message)? Also, is there a maximum task length or duplicate handling?
- Q-3: Should tasks persist across reloads (for example localStorage), or is in-memory state sufficient?
- Q-4: How is completion represented (checkbox, click on text, strikethrough)? Can it be undone? Does it need an acceptance criterion?
- Q-5: Is a delete confirmation wanted, given "permanently removed"?
- Q-6: Is an empty-state message wanted when there are no tasks?

## 9. Dependencies
- None declared in Jira (no linked issues).
- Pipeline dependency: stage 02 (architecture) is blocked until this artifact is approved.

## 10. Risks
- R-1: The ambiguous placement (Q-1) and persistence (Q-3) answers directly affect design, tests, and verification; unresolved they risk rework.
- R-2: The completion feature lacks an acceptance criterion, so verification coverage may be unclear.
- R-3: Minimal story detail (no NFRs) could cause scope drift.

## 11. Evidence
- Jira MCP `jira_get_issue` for KAN-116: summary, description, acceptance criteria, status, priority, type present; no comments, no remote links.
- Raw response cached at `.cache/KAN-116.atlassian-issue.json` (trimmed copy).
- Required fields check: story exists and acceptance criteria are present, so no block applies.

## 12. Approval
| Field | Value |
|-------|-------|
| Decision | approved |
| Approver | vasu sachdeva |
| Rationale | User replied "approved by vasu sachdeva" directly in the main session; draft defaults for Q-1 to Q-6 accepted. |
| Evidence | User message in main session; sections 4, 5, 8, 11 of this artifact |
| Timestamp | 2026-10-22 |
| Next agent | `architecture` (only after decision is `approved`) |
