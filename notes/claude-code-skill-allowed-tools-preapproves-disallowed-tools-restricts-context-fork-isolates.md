---
title: In Claude Code skill frontmatter, allowed-tools only pre-approves tools for the invoking turn and restricts nothing, disallowed-tools removes tools from the pool while the skill is active, and context fork runs the skill in a fresh subagent that does not see the conversation; portable SKILL.md files keep to the six spec fields and put vendor controls under metadata or adapter files
type: tool
status: inbox
evidence: T1
sources:
  - https://code.claude.com/docs/en/skills
  - https://agentskills.io/specification
  - https://github.com/addyosmani/agent-skills/blob/main/docs/advanced-per-agent-configuration.md
tags: [claude-code, skills, permissions, frontmatter, subagents, portability]
applies_to: [claude-code@2.1.x]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Two of the three Claude Code skill fields that sound like permission controls do different things, and the third is not a fork of the conversation despite its name. agent-skills' per-agent configuration doc states these facts to argue for keeping vendor fields out of shared SKILL.md files; the Claude Code docs confirm them.

## When to use

- Writing a skill that must run with least privilege (review, audit, background loops): use `disallowed-tools`, not `allowed-tools`.
- Writing a skill that should run isolated: `context: fork` with explicit, self-contained instructions and an optional `agent` type.
- Publishing a skill to more than one host: only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` at top level; the Claude Code packager and the Skills API reject other keys ("Unexpected key(s) in SKILL.md frontmatter").

## Facts

From the Claude Code skills documentation, read directly:

- `allowed-tools`: tools Claude may use without asking during the turn that invokes the skill. The grant clears on the next user message even though the skill content stays in context. It does not restrict anything; every tool stays callable and permission settings still govern unlisted tools. Deny and ask rules override it. Workspace trust does not gate it: a project skill's `allowed-tools` applies even in a `-p` run in an untrusted folder, so review the field in repository skills before running there. Under `allowManagedPermissionRulesOnly` it is ignored (Claude Code 2.1.282 or later).
- `disallowed-tools`: removes the listed tools from the available pool while the skill is active; clears on the next message; cannot remove `EndConversation` while other tools remain.
- `model`: overrides for the rest of the turn; with `context: fork` sets the subagent's model.
- `context: fork`: starts a new subagent of the `agent` type (default general-purpose) with the skill content as its prompt and no conversation history. The docs warn it is not a fork of the conversation and is pointless for guideline-only skills with no task. `background: false` waits for the result (2.1.218 or later).
- Skill content enters the conversation once on invocation and persists; the file is not re-read on later turns, so write standing instructions, not one-time steps.
- `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PROJECT_DIR}` substitute in both the body and `allowed-tools` Bash rules, letting a skill run its bundled script without a prompt.

From the Agent Skills spec: `name` (64 chars, lowercase letters, numbers, hyphens), `description` (1024 chars) required; `license`, `compatibility` (500 chars), `metadata` (string map), `allowed-tools` (experimental, space-separated) optional.

agent-skills' consequence: vendor controls (`kind`, `model`, `temperature`, `max_turns`, `tools`, `context`) live under `metadata` or in adapter files (`.gemini/agents/*.md` for Gemini subagents, local command copies for Claude Code); the repo's validator rejects them at top level. Google guidance quoted there: omit `temperature` for Gemini 3.x and use `thinking_level`.

## Evidence

Claude Code facts read from the vendor docs page; spec fields read from the agentskills.io specification page. The agent-skills doc is consistent with both. The Gemini `thinking_level` guidance is quoted second-hand and not followed to a Google source.

## Open questions

- This repo's own `skills/` frontmatter has not been checked against the six-field rule since the packager error was documented.
