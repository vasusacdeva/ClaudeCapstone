---
paths:
  - "app/**"
  - "tests/**"
---
# Code and security rules

- Change only what the approved implementation plan covers; do not touch unrelated files.
- Never use `innerHTML`, `eval`, or inline handlers with user-controlled data; validate input at boundaries.
- Never hardcode or log secrets, tokens, or credentials.
- Run checks locally (`npm test`); record the exact command and result, and list any check you could not run.
- Do not claim a check passed unless you ran it.
