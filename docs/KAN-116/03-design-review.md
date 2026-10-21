# KAN-116 Design Review: Create Basic To-Do List (re-run)

Status: re-run 2026-10-22 after architecture amendment. Input: `02-architecture.md` (decision `approved`, vasu, 2026-10-22; matches `pipeline-state.json` architecture entry). Replaces the superseded first review. Review only; architecture and code unchanged. `validate-story.ps1` was read, not executed.

## 1. Verdict
Ready for implementation planning. All of DR-1 to DR-8 are resolved. 0 High, 0 Medium, 3 new Low findings (DR-9 to DR-11). No unresolved High, so approval is not blocked.

## 2. Requirements Coverage
| Requirement | Satisfied by | Result |
|-------------|--------------|--------|
| FR-1 input + "Add Task" button | `index.html` form, AD-2 | Covered |
| FR-2 click or Enter | Native form `submit` in `app.js` | Covered |
| FR-3 immediate, active, position | `addTask` (index 0, `completed:false`), AD-1 | Covered |
| FR-4 input clears | `app.js` clears on `added: true` | Covered |
| FR-5 trash Delete button | `render`, `aria-label`, AD-5 | Covered |
| FR-6 permanent removal | `deleteTask`, AD-3, AD-5 | Covered |
| FR-7 mark complete | `toggleTask`, checkbox, AD-4 | Covered (no Jira AC; labeled "derived from AD-4" in section 7) |
| FR-8 show list | `render`, empty state AD-6 | Covered |

AC-1 and AC-2 fully mapped. No uncovered requirement.

## 3. Resolution of Previous Findings
| ID | Status | Evidence |
|----|--------|----------|
| DR-1 storage.js in README | Resolved | `README.md` line 24 now lists `index.html, app.js, tasks.js, styles.css`; no `storage.js`. |
| DR-2 missing package.json / validate-story.ps1 | Resolved | `package.json` exists: CommonJS (no `"type"`), `test` = `node --test tests/tasks.test.js`, no dependencies. `tests/validate-story.ps1` exists (see DR-10, DR-11). `tests/tasks.test.js` is still absent: expected, stage 05 deliverable. |
| DR-3 completion tests/labeling | Resolved | Architecture section 7 lists toggle tests (complete, un-complete, unknown id) and the "derived from AD-4" label. |
| DR-4 CSP risk | Resolved | Architecture section 5: CSP dropped; external JS/CSS only, no inline. |
| DR-5 nextId ownership | Resolved | AD-9 now matches interface and data model (`app.js` owns, increments only on `added: true`); uniqueness test in section 7. |
| DR-6 length semantics | Resolved | AD-2: trim, then `.length > MAX_LENGTH`; 200/201 boundary tests in section 7. |
| DR-7 focus / live region | Resolved | Delete flow moves focus to input; messages defined for add, complete, reopen, delete; keyboard-only pass in section 7 checklist. |
| DR-8 dual export / load order | Resolved | AD-8: `typeof module` guard, `globalThis.Tasks` fallback, `tasks.js` before `app.js`, no `type="module"`. |

## 4. New Findings
| ID | Severity | Finding | Evidence | Recommendation |
|----|----------|---------|----------|----------------|
| DR-9 | Low | Stale or inconsistent wording in the architecture artifact: section 10 says the approval "is reset to `pending`" while section 11 now shows `approved`; approver is recorded as "vasu" whereas stage 01 used "vasu sachdeva". | `02-architecture.md` lines 105, 121-122; `01-requirements.md` line 80; `pipeline-state.json` line 6. | No architecture change needed. Stage 04 should treat section 11 and `pipeline-state.json` as authoritative. Optionally normalize the approver name when the user next touches the artifact. |
| DR-10 | Low | `package.json` and `validate-story.ps1` were created by the amendment, not planned or reviewed by stage 04/05. `validate-story.ps1` is stricter than the stage 07 need only if later artifacts are missing; it checks only artifacts 01-06 plus `code-review` approval, and does not verify earlier stages are approved. README line 97 invokes it as `./tests/validate-story.ps1` while CLAUDE.md uses `pwsh tests/validate-story.ps1`. | `tests/validate-story.ps1` lines 12-33; `README.md` line 97; CLAUDE.md Commands. | Stage 04 should include a step to run `pwsh tests/validate-story.ps1 -JiraId KAN-116` at stage 07 and record its result, and decide whether to also check approvals of stages 01-05. Use the `pwsh` form in docs. |
| DR-11 | Low | `npm test` currently fails (target `tests/tasks.test.js` does not exist). Not a defect before stage 05, but code-security rule requires an actual recorded run. | `package.json` line 7; `tests/` contains only `validate-story.ps1`. | Stage 04 must create `tests/tasks.test.js` before the first `npm test` and record the exact command and result in stage 05. |

## 5. Checks Performed
- Security: `textContent`/`createElement` only, module-level validation, no network/storage/secrets; code review greps `innerHTML`. Sound.
- Accessibility: labels, native controls, non-color completion cue, polite live region, focus handling. Adequate.
- Runtime: plain scripts under `file://`, no `crypto.randomUUID`, CommonJS package preserves dual export.
- Consistency: README layout, `package.json`, and architecture agree; filenames and state key match `.claude/rules/docs-artifacts.md`.
- Residual accepted risks: AR-1 manual-only DOM verification, AR-3 no persistence, AR-5/AR-6 assumptions.

## 6. Recommendations Stage 04 Must Carry Forward
1. Create `tests/tasks.test.js` covering add (trim, empty, whitespace, 200/201, padded input, top placement, active, immutability), toggle (both ways, unknown id), delete (removal, others unaffected, unknown id), id uniqueness (DR-3, DR-5, DR-6, DR-11).
2. Keep `package.json` CommonJS with no `"type"` (AR-2, AD-8).
3. `app.js` owns `nextId`; `tasks.js` stays pure with the `typeof module` guard; script order `tasks.js` then `app.js`, no modules (DR-5, DR-8).
4. External JS/CSS only; no CSP, inline scripts, styles, or handlers; no `innerHTML` (DR-4, AR-4).
5. Manual checklist: Enter, click, input clears, delete icon, empty state, keyboard-only pass with focus after delete and live-region messages, open from `file://` (DR-7).
6. Label completion evidence "derived from AD-4, not a Jira AC" (DR-3).
7. Plan running `pwsh tests/validate-story.ps1 -JiraId KAN-116` at stage 07 (DR-10).

## 7. Risks
- Manual-only DOM verification (AR-1), accepted.
- Unreviewed tooling files could hide defects until stage 07 (DR-10), low.

## 8. Approval
| Field | Value |
|-------|-------|
| Decision | approved |
| Approver | Vasu Sachdeva |
| Rationale | User replied "approved by Vasu Sachdeva for stage 3" directly in the main session. |
| Evidence | `02-architecture.md` sections 2 to 11; `01-requirements.md`; `README.md`; `package.json`; `tests/validate-story.ps1`; `pipeline-state.json`; findings DR-1 to DR-11 above |
| Timestamp | 2026-10-22 |
| Next agent | `implementation-planner` (only after decision is `approved`) |
