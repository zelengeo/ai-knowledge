---
title: Claude Code 2.1.309 closes a dozen sandbox, permission-check and worktree-isolation bypasses, including PowerShell hooks that failed open on Windows
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.309
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.305
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.316
tags: [claude-code, sandbox, permissions, hooks, security, unattended, windows]
applies_to: [claude-code@2.1.x]
added: 2026-10-23
last_verified: 2026-11-01
verified_by: agent
---

Before Claude Code 2.1.309, sandboxed Bash on macOS and Linux ran the shell's startup files outside the sandbox before every command, PowerShell hooks on Windows did not block on exit code 2 and failed open when Git for Windows was missing, and several Bash permission checks could be slipped with a redirect, a subshell, a wrapped `cd`, a locale prefix or a symlink. Any deny list, hook or sandbox configuration that was evaluated on an older version should be re-evaluated on 2.1.309 or later, and 2.1.305 added an opt-in that reopens one of the file protections.

## When to use

- You rely on deny rules, hooks or the sandbox to run Claude Code unattended, as `docs/security.md` in this repo does.
- You run on Windows with hooks declared as `"shell": "powershell"`.
- You use worktree-isolated sessions or `--mcp-config` and assume the agent cannot touch the config it was started with.

## Facts

Fixed in 2.1.309, as stated in the changelog:

- Sandbox: shell startup files ran outside the sandbox before each command (macOS, Linux). macOS `denyWrite` globs did not apply at a path's real location when reached through a symlink. Sandboxed commands and auto-accepted edits could modify the file passed with `--mcp-config`. On Linux, write denies lifted when a background command outlived the session. Profile store write protection did not apply when the config directory was reached through a symlink.
- Permission checks: the Bash check trusted a variable set by a command whose redirect can fail to open. Compound commands that change directory before running git did not prompt when the `cd` was wrapped or prefixed. An `Edit(path)` deny rule did not block a Bash redirect to that path in some commands that also held a subshell. On Windows, PowerShell checks auto-approved some `Set-Location` or `cd` commands that target the current directory with extra arguments.
- Hooks: hooks run in PowerShell did not block when the hook's program exited with code 2. On Windows, `PreToolUse` and `PermissionRequest` hooks with `"shell": "powershell"` failed open when Git for Windows was not installed.
- Worktree isolation: locale-prefixed commands, and arithmetic commands on zsh, passed the isolation guard.
- MCP: a disabled MCP server was reconnected by a later permission prompt in print and SDK sessions.

Behaviour changes in 2.1.309:

- `sed -i` gets the standard Bash prompt and runs as written; it is no longer a simulated edit preview and is not restored by `/rewind`.
- Commands the settings exclude from the sandbox now ask before writing to the sandbox's write-list paths while the sandbox is enabled but cannot run; the unsandboxed fallback is refused there.
- `claude ultrareview` requires workspace trust: it asks on a terminal and refuses otherwise. Scripts pass `--trust-workspace` (takes no value, put a PR number or base branch before it) or set `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1`.

Added in 2.1.305:

- `sandbox.allowNestedUserNamespaces` lets sandboxed commands on Linux create user namespaces (Chromium, rootless podman). The changelog itself says this lets them get around the sandbox's file protections. Leave it off for unattended jobs.

Follow-up in 2.1.316 (2026-10-31): a second PowerShell hook fix, for hooks not blocking on exit code 2 when the command begins with a type cast, `param`, `using` or an attribute. Hooks of that shape were still failing open after 2.1.309. See `claude-code-2-1-316-subagent-effort-env-ultrathink-off-and-powershell-hook-fix.md`.

## Evidence

All items are changelog lines in the two release notes; none was reproduced here. The number of distinct bypasses closed in one release is the finding: the deny list and hooks are prefix matching and process exit codes, and both had holes that only a release note disclosed.

## Open questions

- Which release introduced each gap is not stated, so it is unknown how long PowerShell hooks were failing open. 2.1.316 shows the exit-code-2 fix in 2.1.309 was incomplete for some command shapes.
- Whether hooks declared for Bash and run through Git Bash on Windows had the same exit-code problem.
- `docs/security.md` in this repo records the Windows PowerShell rules; whether its deny block needs a change after 2.1.309 is a human check.
