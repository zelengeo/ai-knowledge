---
title: A Claude Code PreToolUse hook on Bash that exits 2 blocks the command and feeds its stderr back to the agent, enforcing CLI rules (pnpm over npm, no destructive git) deterministically instead of through CLAUDE.md
type: technique
status: inbox
evidence: T2
sources:
  - https://www.aihero.dev/how-to-use-claude-code-hooks-to-enforce-the-right-cli
  - https://www.aihero.dev/this-hook-stops-claude-code-running-dangerous-git-commands
  - https://github.com/mattpocock/skills
tags: [aihero, hooks, claude-code, sandbox, afk]
applies_to: [claude-code@2.x]
added: 2026-10-16
last_verified: 2026-10-23
verified_by: agent
---

A `CLAUDE.md` line such as "use pnpm" lowers the odds of the wrong command but costs instruction budget on every task and guarantees nothing. A `PreToolUse` hook with a `Bash` matcher in `.claude/settings.json` runs a script that reads the tool input JSON on stdin, greps the command, and exits 2 with a message on stderr; the harness blocks the call and shows the agent the message, which it acts on. Matt Pocock ships the pattern as the `git-guardrails-claude-code` skill, blocking `git push`, `reset --hard`, `clean -f`, `branch -D`, `checkout .`, and `restore .` by default. This is the pre-execution counterpart of the git pre-commit approach in [precommit-hooks-enforce-conventions-on-agents](precommit-hooks-enforce-conventions-on-agents.md).

## When to use

- A rule that is mechanical and detectable from the command string.
- Unattended runs in a Docker sandbox: the sandbox limits where commands run, not which, and the git history is inside it.

## Procedure

1. Add to `.claude/settings.json`: `hooks.PreToolUse` with `matcher: "Bash"` and a `command` hook pointing at a script in `.claude/hooks/`.
2. Script: read stdin, extract `.tool_input.command` with `jq`, `grep -qE` against the pattern list, print a one-line reason to stderr, `exit 2`; otherwise `exit 0`.
3. Restart Claude Code, clear context, ask it to run a blocked command, and confirm the block message appears.
4. To convert existing `CLAUDE.md` rules, the post provides a prompt that asks the agent to pick the deterministic ones, confirm with you, implement, and give test steps. Treat the result as code review material.
5. Allow legitimately needed commands (a push to a PR branch) by editing the pattern list; the defaults are "safe by default", not "never".

## Evidence

Two practitioner posts with complete scripts and config. The hook semantics (exit 2 blocks, stderr returned to the model) are Claude Code behaviour and should be confirmed against Anthropic's hooks documentation; the posts show the behaviour working but do not link the vendor doc. No measurement of compliance rate is given. The instruction-budget claim ("around 500 instructions") is unsourced.

## Open questions

- This worktree session was itself blocked from running shell loops around `pnpm` by a sandbox rule; compare that mechanism with a PreToolUse hook for the daily job.
- Does the hook fire for `Bash` calls made by subagents, and inside `docker sandbox run`?
