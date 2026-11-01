---
title: Claude Code 2.1.316 adds CLAUDE_CODE_SUBAGENT_EFFORT as the subagent effort default, CLAUDE_CODE_DISABLE_ULTRATHINK, a second PowerShell hook exit-code-2 fix, and keeps scheduled-task prompts allowed under a custom autoMode.allow list
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.316
tags: [claude-code, subagents, hooks, unattended, windows, auto-mode, cost]
applies_to: [claude-code@2.1.x]
added: 2026-11-01
last_verified: 2026-11-01
verified_by: agent
---

Claude Code 2.1.316 (released 2026-10-31) changes four things an unattended or multi-agent setup depends on: subagents can be given their own default effort instead of inheriting the session's, the `ultrathink` keyword can be switched off, PowerShell hooks now block on exit code 2 even when the hook command starts with a type cast, `param`, `using` or an attribute, and a managed `autoMode.allow` list without `"$defaults"` no longer removes the built-in rule that lets scheduled-task prompts run. Fast mode on Opus 4.8 is deprecated as of 2026-10-30 and removed on 2026-11-30 with no fallback.

## When to use

- You fan out to subagents and want them cheaper or more thorough than the parent session: set `CLAUDE_CODE_SUBAGENT_EFFORT` in the environment. It applies only when nothing else (an agent definition, the Agent call) names an effort.
- You have prompts or fetched text that may contain the word `ultrathink` and do not want it to switch the turn to the highest effort: set `CLAUDE_CODE_DISABLE_ULTRATHINK`. Relevant to a job that reads strangers' text, as this repo's daily job does.
- You run `PreToolUse` or `PermissionRequest` hooks under `"shell": "powershell"` on Windows: hooks whose command began with `[string]`, `param(...)`, `using` or an attribute were not blocking on exit code 2 before this release. Re-test such hooks on 2.1.316 or later.
- You run scheduled tasks under a managed `autoMode.allow` list that leaves out `"$defaults"`: before this release the list removed the built-in exception for scheduled-task prompts.
- You rely on fast mode on Opus 4.8: migrate to Opus 5.5 before 2026-11-30, when requests return an error.

## Facts

Added in 2.1.316, as stated in the changelog:

- `CLAUDE_CODE_DISABLE_ULTRATHINK` turns the `ultrathink` keyword off. In the VS Code extension, `ultrathink` now runs its turn at `xhigh` effort, as in the terminal.
- `CLAUDE_CODE_SUBAGENT_EFFORT` sets the effort level subagents run at when nothing else names one, instead of inheriting the session's.
- `CLAUDE_CODE_DISABLE_LOOPED_CROSS_CERT_DROP` keeps system cross-certificates that certify each other in a loop, for servers whose private CA needs one.
- Claude apps gateway: pooled group budgets (`pooled_budget` on the spend limits admin API), `managed.policy_mode: layered` (every matching policy applies, merged over the ones below), and `guardrail.input_tagging` for Bedrock upstreams.

Fixed in 2.1.316:

- PowerShell hooks not blocking on exit code 2 when the command begins with a type cast, `param`, `using` or an attribute. This is the second PowerShell hook exit-code fix after 2.1.309, which fixed hooks not blocking on exit code 2 at all.
- `--restricted` sessions uploading files from outside the working directories when a `Read` allow rule covered them.
- Sub-agents that inherited a parent sub-agent's model moving to the main model when a background job or message woke them.
- Shell commands left running on macOS and Linux when Claude Code exits by itself, for example when credentials are refused or a cloud session is archived.
- Bash scripts started from the Bash tool stopping after their first command when `SHELLOPTS` is exported; bash aliases with line breaks and functions whose names start with a dash being garbled (Git Bash excepted); on Windows, the Bash tool losing aliases and functions in Git Bash when the rc file sets `errexit` and `pipefail`.
- `Grep` and `Glob` never returning when the search process is killed at the timeout but does not exit, seen on Windows.
- Cloud sessions and cloud scheduled tasks not being marked as failed when auto mode stopped a turn because the server returned no safety verdict; `claude -p` text output sometimes not saying why auto mode stopped a turn.
- Prompts containing invisible characters needing a second Enter to send; plain prompts now send cleaned on the first Enter.
- `/model <id>` not warning when the model is unknown to this version and auto-compact will assume a 200K context window.

Changed in 2.1.316:

- A managed `autoMode.allow` list without `"$defaults"` no longer removes the built-in rule on scheduled-task prompts. A related fix stops such a list getting the built-in exceptions back from a host app's `--settings`, a first rule added in `/permissions`, or `/auto-mode-setup`.
- Server-managed settings for Team and Enterprise logins apply without an approval prompt; a stored copy that does not verify is refused.
- Fast mode on Opus 4.8 deprecated 2026-10-30, removed 2026-11-30. After removal, fast mode requests on Opus 4.8 return an error and do not fall back to standard Opus 4.8.

## Evidence

All items are changelog lines in the release notes; none was reproduced here. The subagent effort default and the second PowerShell hook fix are the two lines that change behaviour this repo already documents (per-role effort in the pstack notes, PowerShell hooks in `docs/security.md` and the 2.1.309 note). The auto-mode change matters because this repo's daily job runs as a scheduled task.

## Open questions

- Whether `CLAUDE_CODE_SUBAGENT_EFFORT` accepts the same values as the session effort setting (`low` to `max`) is not stated in the changelog.
- Whether `CLAUDE_CODE_DISABLE_ULTRATHINK` also disables the VS Code rainbow trigger or only the terminal keyword.
- Whether the PowerShell hook in this repo's `.claude/settings.json`, if any, begins with a construct the fixed case covers is a human check.
