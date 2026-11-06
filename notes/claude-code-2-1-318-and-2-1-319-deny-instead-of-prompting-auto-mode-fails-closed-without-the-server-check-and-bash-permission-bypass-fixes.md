---
title: Claude Code 2.1.318 and 2.1.319 add permissions.denyInsteadOfPrompting, make auto mode fail closed when the server-side check is unavailable, exit 1 from claude -p when refusals had no safety check, and close four permission or sandbox bypasses in Bash, sed, worktrees and /rewind
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.319
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.318
tags: [claude-code, unattended, auto-mode, headless, permissions, security, mcp, subagents, mods, windows]
applies_to: [claude-code@2.1.x]
added: 2026-11-06
last_verified: 2026-11-06
verified_by: agent
---

Claude Code 2.1.319 (released 2026-11-06) changes three things an unattended job depends on and fixes four ways a tool call could get past permission checks. The changes: `permissions.denyInsteadOfPrompting` denies any tool call that would wait on a permission prompt and lets the turn continue, in terminal sessions, subagents and teammates; auto mode with telemetry or feature flags off, including behind LLM gateways, no longer falls back to the built-in classifier, so calls the server cannot check are asked about or denied unless `CLAUDE_CODE_AUTO_MODE_SERVER=0` keeps the classifier (Bedrock, Vertex and Foundry are unchanged); and `claude -p` in auto mode exits 1 instead of 0 when actions were refused because no safety check was available. The fixes: a Bash permission bypass where a crafted environment prefix hid part of a command from the checks, a `sed` command that could skip the permission check in accept-edits and auto mode, Bash deny and ask rules missing commands written with quoted words, a sandbox escape when creating a worktree, and `/rewind` restoring or deleting a file through a directory symlink. 2.1.318 (released 2026-11-04) is mostly reliability: `claude -p` JSON results carry `credential_expires_at`, text output warns on stderr ten days before a stored claude.ai sign-in ends, unattended runs stop rewriting `~/.claude.json` when nothing changed, and a non-interactive launch no longer replaces an invalid `~/.claude.json` with defaults.

## When to use

- You run Claude Code as a scheduled or headless job and would rather have a denied call than a stalled run: set `permissions.denyInsteadOfPrompting` in settings on 2.1.319 or later. It is the general form of the person-only-ask refusals in [2.1.304 to 2.1.309](claude-code-unattended-runs-no-longer-stall-on-prompts-nobody-can-answer.md); the changelog does not say how it orders against auto mode's own asks.
- You run auto mode with telemetry off, `CLAUDE_CODE_DISABLE_FEATURE_FLAGS`, or behind an LLM gateway: from 2.1.319 the local classifier is no longer the fallback. Expect asks or denials for calls the server cannot see, or set `CLAUDE_CODE_AUTO_MODE_SERVER=0` to keep the old behaviour. Behind a gateway, `CLAUDE_CODE_AUTO_MODE_SERVER=1` turns the server check on even with `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` set; managed settings that set the latter must set the former too.
- You branch on the exit code of `claude -p` in auto mode: a run whose actions were refused for lack of a safety check now exits 1 in text and JSON output. Before 2.1.319 it exited 0.
- You rely on a Bash deny list, as `docs/security.md` in this repo does: two of the fixed bypasses (quoted words, crafted environment prefix) are concrete cases where deny rules did not match until 2.1.319. Pin unattended jobs to 2.1.319 or later. The deny list remains prefix matching, not a boundary.
- You call MCP tools that run as tasks: from 2.1.319 Claude Code moves them to the background at once and reports the result when it finishes. `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` makes it wait inside the tool call instead.
- You store credentials for a headless job: read `credential_expires_at` from `claude -p` JSON (2.1.318) or `loginExpiresAt` from `claude auth status`, and renew before the stderr warning that starts ten days out.
- You block MCP servers with `deniedMcpServers` URL entries: from 2.1.318 they also block Anthropic-provided servers whose upstream URL matches, and connectors in cloud and self-hosted runner sessions; otherwise deny a connector by name.

## Facts

Added in 2.1.319, as stated in the changelog:

- `permissions.denyInsteadOfPrompting`: a tool call that would wait on a permission prompt is denied and the turn continues, in terminal sessions, subagents and teammates.
- MCP tasks: when an MCP server runs a tool call as a task, Claude Code moves it to the background right away and tells Claude the result when it finishes. `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` keeps the wait inside the tool call.
- `CLAUDE_CODE_DISABLE_FEATURE_FLAGS`: stops feature-flag fetching without turning off telemetry; every flag uses its built-in default.
- An "Earlier in this session" row in `/tasks` that lists finished subagents, so one can be reopened and messaged after it leaves the list or after a restart.
- `/claude-api latency-optimize`; spend for today, this week and this month in `/usage` behind a Claude apps gateway; gateway `admin.pooled_conflict_rule`, `admin.pooled_priority_order`, `login_notice` and `CLAUDE_GATEWAY_LOG_FORMAT=json`; startup lines naming the Claude Console organisation billed when Claude Code continues on an `ant auth login` sign-in.

Changed in 2.1.319:

- Auto mode with telemetry or feature flags off, including behind LLM gateways: calls the server cannot check are asked about or denied, with no fallback to the built-in classifier; `CLAUDE_CODE_AUTO_MODE_SERVER=0` keeps using it. Bedrock, Vertex and Foundry are unchanged.
- Behind an LLM gateway, `CLAUDE_CODE_AUTO_MODE_SERVER=1` turns on the server-side check even with `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` set.

Fixed in 2.1.319, the lines that touch permissions, sandboxing or unattended use:

- A Bash permission bypass where a crafted environment prefix could hide part of a command from permission checks.
- A `sed` command that could skip the permission check in accept-edits and auto mode.
- Bash deny and ask rules missing commands written with quoted words.
- A sandbox escape when creating a worktree.
- `/rewind` able to restore or delete a file through a directory symlink.
- Self-hosted runners: `--trust-workspace false` now also stops hooks in the repository's settings files and skills from running.
- Deny and ask rules, hook matchers and `disallowedTools` entries written with a claude.ai connector's terminal name (`mcp__claude_ai_Slack`) being ignored in Claude Desktop; takes effect once the desktop app includes this version.
- Cloud sessions losing session-scoped deny and ask rules, such as those a `PermissionRequest` hook adds, when the session moved to a new worker.
- `claude -p` exiting 0 in auto mode when its actions were refused because no safety check was available; text and JSON output now exit 1.
- `claude -p --resume` with a prompt losing a deferred tool call when its MCP server is missing: the run exits 1, keeps the call and refuses later input.
- Auto mode refusing actions without saying why when permission rules or `autoMode` settings are very large; it now explains and, unless `autoMode` deny rules are set, asks in the terminal.
- `/status` showing "Auto mode server: Enabled" when the server-side review was not reaching the session.
- `CLAUDE_CODE_AUTO_MODE_SERVER=1` in managed settings ignored behind an LLM gateway whose URL is set only there.
- Edits to a settings file ignored when made within a few seconds of Claude Code writing that file.
- `~/.claude.json`, settings and edited files ending up empty or cut off when the disk fills during a save in a read-only folder or to a bind-mounted file.
- Background Bash commands that finish almost instantly losing their output while reported as completed; the Bash tool's diff of changed files missing a file written just before the command ended.
- `/clear` killing running commands of background agents, teammates and workflows; a background agent's later report lost silently, now reported as refused with how to ask for it.
- MCP servers on the older handshake failing to connect or returning empty results; a long-running MCP tool call on a claude.ai connector never reporting its result after `--resume`.
- Needless permission prompts for read-only commands wrapped in a plain `timeout DURATION`.
- `claude remote-control` exiting 0 silently when a first-run question got no answer in scripts or services; it now says why and exits 1.
- Windows: config saves wait longer for a file another program has open, so a kill during a save is less likely to leave `~/.claude.json` empty.

Added or changed in 2.1.318, the lines that touch unattended or multi-agent use:

- `claude auth status` reports `loginExpiresAt`; `claude -p` JSON results carry `credential_expires_at`; `claude -p` text output warns on stderr starting ten days before a stored claude.ai sign-in ends.
- Unattended runs (`claude -p`, SDK apps) stop rewriting `~/.claude.json` on every run when nothing in it changed.
- A non-interactive launch no longer replaces a `~/.claude.json` that is not valid JSON with defaults: the start fails, says how to restore the file and leaves it as is. An empty file with no backup starts as if the file were missing. Retention cleanup takes a fresh backup before deleting the last good one in homes that only run `claude -p`.
- `deniedMcpServers` URL entries also block Anthropic-provided servers whose upstream URL matches, and connectors in cloud sessions and on self-hosted runners.
- Background subagents move a shell command to the background after 3 minutes on all providers, so the prompt cache does not expire while it runs. Subagents stop instead of switching models when "Switch models when a message is flagged" is set to "Ask each time".
- A record is kept of the answer when Claude Code asks to turn on the mods it writes in a session. A mod's `$.model.fork` takes an `effort` option.
- Settings, `~/.claude.json` and the stored login survive saves on shared network home directories more often; `claude mcp add` and `remove` wait for the config lock or exit 1.

Fixed in 2.1.318:

- `--continue` sometimes losing the earlier conversation after a malformed tool call's retries ran out (regression in 2.1.314).
- `claude -p` and Agent SDK sessions reporting success when an API error cut off a reply while a mod hooked `turn.step`; a mod's `turn.step` hook making a stopped reply finish as a success in headless runs.
- A message sent right after a model change still running after Stop in headless sessions. Custom slash commands that fail printing nothing in `claude -p` and SDK sessions.
- Jobs exiting with "Not logged in" when another terminal or host signed in again to the same account on the same home; sessions refused at startup by an `allowedProviders` list another login had stored.
- macOS sessions with many running Bash commands stalling while memory grew. Permission prompts answered by keys typed just after sending a message.
- Remote-control hosts, the background daemon and self-hosted runners failing to start new sessions (`spawn ENOENT`) after an update removed the binary of a still-running process; a process owned by another user treated as dead by version cleanup.
- Workflows re-running finished agents when resumed after a usage limit. Idle compaction replacing a conversation with a reply that was not a summary.

## Evidence

All items are changelog lines in the two GitHub releases, read through `pnpm run read`; none was reproduced here. The tier is T1 because the release pages are on the vendor's GitHub organisation. The lines that bear on this repo: the daily job runs as a scheduled task in auto mode with a Bash deny list (`docs/security.md`), so the two deny-rule bypasses fixed in 2.1.319 (quoted words, environment prefix) were live gaps in that layer until this release, and `denyInsteadOfPrompting` is the setting that layer's "refuse rather than stall" posture has been approximating with person-only asks. The fail-closed change to auto mode matters for any job that disables telemetry or feature flags.

## Open questions

- How `permissions.denyInsteadOfPrompting` orders against auto mode: whether an auto-mode ask is a "permission prompt" the setting denies, or only classic permission prompts are covered. Not stated.
- Whether `denyInsteadOfPrompting` applies to `claude -p` and SDK sessions; the changelog names terminal sessions, subagents and teammates.
- Whether the scheduled-task sessions this repo runs in count as "telemetry or feature flags off" for the auto mode change; `/status` on 2.1.319 or later should show the real server state now that the false "Enabled" is fixed.
- The release notes carry no line about the account email in model context or the `cc-plugin-privacy` mod; see [the email note](claude-code-account-email-in-model-context-leaks-into-user-agent-headers-the-2-1-317-privacy-mod-covers-only-shell-calls-that-name-user-agent.md).
