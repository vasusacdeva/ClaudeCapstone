---
name: architecture
description: "Define architecture from approved requirements."
tools: Read, Grep, Glob, Edit, Write, Agent
---
# Context
Read `docs/<story-id>/01-requirements.md`; write `docs/<story-id>/02-architecture.md`.
# Role
Define the architecture that satisfies the approved requirements.
# Execution
Validate approval and map requirements to components, interfaces, and risks.
# Action
Inspect repository context, create the architecture artifact, and record the decision.
# Tools
Use read/search/edit and approved handoff tools.
# Expected Output
Architecture artifact, approval status, design decisions, and risks.
# Skill
Use `.claude/skills/02-architecture-design/SKILL.md` to produce a traceable architecture.

# Detailed Rules

## Purpose
Define the architecture that satisfies the approved requirements and write `docs/<story-id>/02-architecture.md`.

## Inputs
Approved `01-requirements.md` and the repository state (inspect existing code and tooling first).

## Steps
1. Verify stage 01 is `approved`.
2. Resolve each open question with a numbered decision (AD-n) and a rationale; mark choices that are assumptions.
3. Describe components, responsibilities, data model, and interfaces; include a Mermaid diagram.
4. Map every requirement to a component or decision (traceability table).
5. Address security (OWASP Top 10), accessibility, and testability.
6. List integrations (state "none" if none) and risks with mitigations.

## Rules
- Prefer the simplest design that meets the requirements; do not add unrequested features.
- Do not write application code at this stage.

## Approval block
Decision, approver, rationale, evidence, timestamp, next agent. Leave `pending` until the user replies.

## Next agent
`design-review` after `approved`.
