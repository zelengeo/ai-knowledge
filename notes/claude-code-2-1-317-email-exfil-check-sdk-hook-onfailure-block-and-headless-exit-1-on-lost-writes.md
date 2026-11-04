---
title: Claude Code 2.1.317 asks before a web or shell tool call sends your account email, adds onFailure "block" for Agent SDK hooks, makes claude -p exit 1 when a full disk loses its transcript, and gives off-model subagents their model's own effort default
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.317
tags: [claude-code, unattended, hooks, agent-sdk, headless, auto-mode, mcp, subagents, windows, security]
applies_to: [claude-code@2.1.x]
added: 2026-11-03
last_verified: 2026-11-03
verified_by: agent
---

Claude Code 2.1.317 (released 2026-11-03) adds four things an unattended or scripted setup should know about: a built-in check that asks before a web or shell tool call sends the account email address to the network, `onFailure: "block"` for Agent SDK hook callbacks so a hook that throws fails closed instead of open, `claude -p` exiting 1 instead of 0 when a full disk or quota loses its transcript or `~/.claude.json` writes, and subagents or teammates on a different model than the main conversation taking that model's saved effort level or default instead of the session's. It also fixes project and local MCP servers disconnecting after the first turn in some desktop sessions, auto mode failing every turn behind an LLM gateway that answers 403 or 422 to the server-side safety check, and `Grep` and `Glob` partial results being treated as complete when a search hit its time limit.

## When to use

- You run Claude Code as a scheduled or headless job that reads text written by strangers: the email check is a second layer against the exfiltration threat in `docs/security.md`. It is an ask, so in a run where nobody can answer it is expected to behave like any other ask under auto mode; the changelog does not say.
- You gate tool calls with Agent SDK hook callbacks and want a crashed callback to block rather than allow: set `onFailure: "block"` on the callback. Before 2.1.317 a failing callback let the action run. This is the SDK counterpart of the exit-code-2 rule for shell hooks in [PreToolUse hooks enforce CLI rules](aihero-pretooluse-hooks-enforce-cli-rules-deterministically.md).
- You wrap `claude -p` in a script and branch on the exit code: from 2.1.317 a lost transcript or `~/.claude.json` write prints an error and exits 1 in text and json output. Full NFS exports may still be missed.
- You set per-role models for subagents and relied on them inheriting the session's effort: they now use the other model's saved effort level or its default. Check this against `CLAUDE_CODE_SUBAGENT_EFFORT` from [2.1.316](claude-code-2-1-316-subagent-effort-env-ultrathink-off-and-powershell-hook-fix.md); the changelog does not state which wins.
- You run `claude -p` inside a cloud or self-hosted runner session and depended on it sharing the outer session's ID and transcript: that is now off by default. `CLAUDE_CODE_DISABLE_NESTED_SESSION_ID=1` on a self-hosted runner restores the earlier behaviour.
- You create cloud scheduled tasks with `/schedule`: it now warns when a new task gets connectors you did not ask for and says how to remove them.

## Facts

Added in 2.1.317, as stated in the changelog:

- A check that asks before a web or shell tool call sends your account email address to the network.
- `onFailure: "block"` for Agent SDK hook callbacks: a callback that fails blocks the action instead of letting it run.
- A `/schedule` warning when a new cloud scheduled task gets connectors you did not ask for, with how to remove them.
- A notice when auto mode's check has no answer for a subagent's tool call, which used to leave nothing in the main view.
- `anthropic.plan`, `anthropic.seat_type`, `anthropic.provider` and `anthropic.custom_base_url` on OTel metrics, events and spans (recorded in [OTel audit fields](claude-code-otel-auto-mode-audit-fields.md)).
- `CLAUDE_CODE_DISABLE_NESTED_SESSION_ID`: set to 1 on a self-hosted runner so `claude -p` run inside a session uses that session's ID and transcript, as in earlier versions.
- Claude apps gateway: a cost report at `GET /v1/organizations/analytics/cost` (total, per developer, per day or per IdP group) and a daily record of each developer's IdP groups kept for `admin.identity_retention_days`.
- Cloud sessions: a link card so a URL an MCP server asks you to visit can be opened or declined instead of going unseen.

Fixed in 2.1.317, the lines that touch unattended, scripted or multi-agent use:

- Project and local MCP servers disconnecting after the first turn in some Claude desktop sessions.
- Auto mode failing every turn when an LLM gateway set as the base URL answers 403 or 422 to its server-side safety check (a 403 with an `apiKeyHelper` is unchanged).
- `claude -p` exiting 0 when a full disk or quota lost its transcript or `~/.claude.json` writes; now an error and exit 1 in text and json output.
- `claude -p` run inside a cloud or self-hosted runner session sharing that session's ID, writing into its transcript, generating a title for it, and letting a restart resume the wrong conversation.
- A project's `effortLevel` setting being ignored by sessions an app starts ahead of time and then opens in the project, such as new sessions in the desktop app's Code tab.
- Self-paced `/loop` wakeups sometimes not being scheduled when Claude left a field out of its request.
- Auto mode in cloud sessions stopping for approval when the Artifact tool uploaded, wrote to a database or saved a file through the outputs folder.
- Skills synced from claude.ai being lost or downloaded again every ten minutes when they cannot be written to disk.
- Edits to settings files made in the first second or so after launch not taking effect until a settings file changed again.
- Stdio MCP servers receiving an empty `AWS_BEARER_TOKEN_BEDROCK` when their env config sets it to empty; the variable is now unset so the server can use the machine's AWS credentials.
- Claude treating partial `Grep` and `Glob` results as complete when a search hit its time limit.
- Very long conversations losing their earlier summary when compaction had to shorten its own request; "Prompt is too long" after automatic compaction when a very large `CLAUDE.md` changed since it was last sent.
- Agent team teammates in tmux or iTerm2 panes starting in auto mode when the lead session was in manual mode.
- Ctrl+C stopping all running background agents when pressed to clear typed text at the prompt.
- Child processes of a stopped shell command sometimes receiving SIGTERM twice.
- `DISABLE_PROMPT_CACHING_OPUS` and `DISABLE_PROMPT_CACHING_SONNET` having no effect on `[1m]`, other-region and undated spellings of the default model.
- A PDF's own metadata being able to make `Read` and @-mentions under-count its pages.
- Resumed sessions telling Claude again about a file change it already knew about; Claude sometimes not using a built-in tool after an earlier call failed because the tool was switched off.
- OpenTelemetry exports hanging behind a proxy that never answers: they now time out after 10 seconds, or `OTEL_EXPORTER_OTLP_TIMEOUT` up to 30 seconds; https exports through a proxy never being sent while another export was in progress; a flood of connection attempts to a proxy that blocks http exports with 403.
- Windows: every tool call refused on some volumes where the native path lookup fails; the working-directory check now compares the folder's identity. Windows: the session scratchpad and other temporary paths growing with the project path in sessions not started by Claude Desktop, which made repositories cloned into them hit the 260-character path limit.
- Self-hosted runner: an MCP server that was switched off coming back on after the session moved to a new machine; recovery after 5xx errors and unanswered heartbeats now opens new connections instead of reusing the failed one.

Changed in 2.1.317:

- Subagents and teammates on a different model from the main conversation use that model's saved effort level or its default, instead of the session's effort level.
- `SendMessage` to a running background agent arrives earlier: its running command moves to the background without being stopped.
- The `Read` tool's "file unchanged since your last Read" stub is removed; reading an unchanged file again returns its content.
- Exit skips the "Background work is running" prompt for plugin monitors.

## Evidence

All items are changelog lines in the GitHub release, read through `pnpm run read`; none was reproduced here. The tier is T1 because the release page is on the vendor's GitHub organisation. The email check and the SDK `onFailure` option are the two lines that bear on this repo's own threat model (`docs/security.md`, threats 1 and 2): one is a machine check against one exfiltration shape, the other turns a hook crash from fail-open into fail-closed. The `claude -p` exit-code change bears on the watchdog pattern in [unattended retry watchdog](claude-code-unattended-retry-watchdog-usage-limit.md), which lists how an ended request surfaces in headless output as an open question.

## Open questions

- How the email check behaves in auto mode or `-p` runs where nobody can answer the ask: refused with a reason, as the 2.1.304 to 2.1.309 changes made other person-only asks, or something else. Not stated.
- Whether the check covers only the literal account email string or also encodings of it.
- Precedence between `CLAUDE_CODE_SUBAGENT_EFFORT` (2.1.316) and the new per-model saved effort for off-model subagents.
- What `onFailure` values exist besides `"block"`, and what the default is for existing callbacks.
