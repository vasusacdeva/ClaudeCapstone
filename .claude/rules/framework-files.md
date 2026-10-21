---
paths:
  - ".claude/**"
---
# Framework file rules

- Keep each agent to one responsibility; do not add unrequested agents, commands, or workflow files.
- Number agents, commands, and skills by stage (`00`-`08`); the agent `name` in frontmatter stays unprefixed.
- A skill folder name must match its `name` frontmatter.
- Keep agent `tools` lists minimal: only `01-requirements` gets Jira MCP and only `08-pr-creator` gets GitHub MCP.
- Do not create or edit hook definitions unless asked. If a required hook fails, record it and stop where a gate requires.
- Update path references in `CLAUDE.md` and `README.md` when renaming or moving a framework file.
