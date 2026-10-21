# KAN-116 Code Review: Create Basic To-Do List

Status: reviewed 2026-10-22; awaiting approval. Input: `05-implementation-summary.md` (decision `approved`, vasu sachdeva). Review only; no application code modified.

## 1. Checks Run
| Check | Command | Result |
|-------|---------|--------|
| Unit tests | `npm test` (`node --test tests/tasks.test.js`) | PASS: tests 19, pass 19, fail 0, cancelled 0, skipped 0 (run by reviewer) |
| Unsafe sinks | Grep `innerHTML\|insertAdjacentHTML\|outerHTML\|document\.write\|eval\(\|new Function\|\son\w+=\|\sstyle=\|localStorage\|fetch\(\|console\.` in `app/` | 0 matches |
| Full read | `app/tasks.js`, `app/app.js`, `app/index.html`, `app/styles.css`, `tests/tasks.test.js` | Done |
| Editor diagnostics | Not available to this stage | NOT RUN |
| Browser / DOM behavior | No browser available | NOT VERIFIED |

## 2. Acceptance Coverage
| Req | Evidence | Status |
|-----|----------|--------|
| FR-1 input + "Add Task" | `index.html:13-16` | Present; DOM NOT VERIFIED |
| FR-2 click or Enter adds | `<form>` + submit handler `app.js:65-76` (button type submit, Enter submits form) | Present; DOM NOT VERIFIED |
| FR-3 new task at top, active | `tasks.js:16`; tests `add: trims text and places...` | Unit-verified |
| FR-4 input clears | `app.js:71` | Present; DOM NOT VERIFIED |
| FR-5 trash button per task | `app.js:43-50` | Present; DOM NOT VERIFIED |
| FR-6 delete removes | `tasks.js:25-29`; `app.js:51-56`; 3 delete tests | Logic unit-verified; UI NOT VERIFIED |
| FR-7 complete toggle | `tasks.js:19-23`; `app.js:26-37`; 4 toggle tests | Logic unit-verified (derived from AD-4, not a Jira AC) |
| FR-8 list visible | `render()` `app.js:18-63`, empty state `index.html:19` | Present; DOM NOT VERIFIED |
| AC-1 | FR-1..FR-4 | Logic verified; UI NOT VERIFIED |
| AC-2 | FR-5, FR-6 | Logic verified; UI NOT VERIFIED |

## 3. Design Conformance
AD-1 (top insert), AD-2 (trim, then length >200 reject, `maxlength=200`, duplicates allowed), AD-3 (no storage), AD-4 (checkbox toggle, strikethrough), AD-5 (no confirmation), AD-6 (empty state), AD-7 (pure module vs DOM), AD-8 (`typeof module` guard, plain scripts in correct order, no `package.json` change), AD-9 (`nextId` in `app.js`, incremented only on `added:true`, `app.js:68-70`): all conform. No files outside the plan were changed. The two deviations in summary section 3 (checkbox refocus, emoji glyph) are small and acceptable.

## 4. Correctness Notes
- `nextId` logic correct; ids never reused after deletes.
- Toggle closure: `task.completed` is the pre-toggle value because `toggleTask` creates new objects, so `nowCompleted = !task.completed` is correct (`app.js:32`).
- Focus: add and rejected submit keep focus on input; delete focuses input; toggle refocuses checkbox by id after rebuild. Logic reads correct; not verified in a browser.
- Empty state: `hidden` toggled each render; `.empty[hidden]{display:none}` guards against the author `display` rule.

## 5. Findings
| ID | Severity | Blocking | Evidence | Finding | Recommendation |
|----|----------|----------|----------|---------|----------------|
| CR-1 | Medium | No | `app.js` entire file; summary section 6 (M1-M12 NOT RUN) | All DOM behavior (AC-1/AC-2 UI paths, focus, live region, literal markup display) has no automated or manual evidence. | Run M1-M12 manually in a browser at stage 07 (or by the user) and record results before release. |
| CR-2 | Low | No | `app.js:14-16, 73` | Live region is set to identical text on repeated actions (e.g. "Task added" twice); some screen readers will not re-announce an unchanged value. | Clear the region then set text (e.g. empty first, then message in a timeout), or alternate/append unique text. |
| CR-3 | Low | No | `app.js:75` | `input.focus()` after delete and after rejected submit can pop the virtual keyboard on touch devices; also rejected input gives no feedback (accepted per AD-2/A-3). | Acceptable for scope; consider noting for future UX work. |
| CR-4 | Low | No | `tests/tasks.test.js:134-154` | The id-uniqueness test re-implements the `app.js` counter rather than exercising `app.js`, so it cannot catch a regression in `app.js`. `createTask` non-string coverage omits numbers/objects. | Label the test as modelling AD-9 (already partly stated) and add a browser/jsdom check later if a DOM test tool is approved. |
| CR-5 | Low | No | `app.js:49`, `styles.css:75-80` | Trash glyph U+1F5D1 renders differently or may be missing on some platforms; `aria-label` carries meaning but sighted users may see a blank/tofu box. | Verify during M8/M10 on the target browser; fall back to an inline SVG or text "Delete" if poor. |
| CR-6 | Low | No | `styles.css:45-48, 72` | Contrast ratios were chosen by inspection, not measured (#666 on white is about 5.7:1, AA for text; others appear adequate). | Optional measurement with a contrast tool at stage 07. |

No High findings. No blocking findings.

## 6. Security Review
- No `innerHTML`, `insertAdjacentHTML`, `outerHTML`, `document.write`, `eval`, inline handlers, inline styles, storage, network calls, or console logging (grep 0 matches).
- User text reaches the DOM only via `textContent` (`app.js:41`) and `setAttribute('aria-label', ...)` (`app.js:46`); both are inert for markup. Event handlers are attached with `addEventListener`.
- Input validated at the boundary in `createTask` (type check, trim, empty and length checks) plus `maxlength`.
- No secrets, tokens, or credentials in changed files.
- Scripts are external and local; no third-party resources.

## 7. Residual Risks
- DOM behavior unverified (CR-1); the main release risk.
- No persistence (AR-3); reload clears tasks by design.
- `validate-story.ps1` not reviewed (PR-3); not part of this change.
- `app.js` depends on `tasks.js` loading first (satisfied in `index.html:23-24`).

## 8. Verdict
Approve with non-blocking findings (recommendation). Implementation conforms to the approved architecture and plan, `npm test` passes 19/19, and the security review is clean. The manual browser checklist remains outstanding and should be executed in stage 07. No issues require return to stage 05.

## 9. Approval
| Field | Value |
|-------|-------|
| Decision | approved |
| Approver | vasu sachdeva |
| Rationale | User replied "approved by vasu sachdeva for stage 6" directly in the main session. CR-1..CR-6 accepted as non-blocking; M1-M12 still outstanding for stage 07. |
| Evidence | `npm test` 19/19 pass (reviewer run); unsafe-sink grep 0 matches; sections 2 to 6 of this artifact |
| Timestamp | 2026-10-22 |
| Next agent | `verification` (only after decision is `approved`) |
