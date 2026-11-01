---
title: Claude Code 2.1.304 to 2.1.309 stop unattended runs stalling or overrunning, and /auto-mode-setup configures auto mode from the project and recent sessions
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.304
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.305
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.309
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.307
tags: [claude-code, unattended, auto-mode, scheduling, headless, mods]
applies_to: [claude-code@2.1.x]
added: 2026-10-23
last_verified: 2026-10-23
verified_by: agent
---

Between 2.1.304 and 2.1.309 Claude Code changed what happens when nobody is there to answer: an ask that only a person can approve is refused at once with a reason instead of waiting, a dangerous `rm` in bypass-permissions mode is denied with a rewrite hint instead of prompting, scheduled cloud sessions no longer wait five minutes per subagent for a URL approval, and a plugin can no longer keep a headless run going past `--max-turns`. The same window added `/auto-mode-setup`, which reads the project and recent sessions to configure auto mode.

## When to use

- Scheduled, headless or `-p` runs where a hang is worse than a refusal.
- Mods or hooks that gate tool calls and need to say "a human must decide this" without blocking an unattended session.
- Turning auto mode on for a project for the first time.

## Procedure

1. Pin the job to 2.1.309 or later.
2. Run `/auto-mode-setup` once in an interactive session on the project; review what it writes before committing it. It also works on Bedrock, Vertex, Foundry, the Claude apps gateway and with telemetry disabled.
3. In a mod's `tool.check` answer, use `decider: "person"` for asks only a human may approve. Where nobody can be asked, the call is refused with the mod's reason; the run continues. `e.isReadOnly` on the event tells the mod when the call is read-only.
4. Expect refusals rather than hangs, and audit them afterwards through the `claude_code.safety_event` OpenTelemetry event, see [OTel audit fields](claude-code-otel-auto-mode-audit-fields.md).
5. Combine with the usage-limit watchdog variables in [retry watchdog](claude-code-unattended-retry-watchdog-usage-limit.md).

## Facts

- 2.1.304: `/auto-mode-setup` added. `decider: "person"` and `e.isReadOnly` added to a mod's `tool.check`. A plugin could keep a headless run going past `--max-turns`, Stop or ended input by spawning subagents or re-running a finished one; fixed. Scheduled Cowork cloud sessions waited five minutes for each subagent whose WebFetch needed a URL approval nobody could give; fixed, with more cases fixed in 2.1.305. Self-paced `/loop` wakeups scheduled at the one-hour maximum fired just after the one-hour prompt cache expired and re-read the conversation uncached; fixed.
- 2.1.307: an unparseable tool call is retried up to twice before the turn ends with an error. Fork subagents launched together are told which launch is their own, so they are less likely to start each other's work.
- 2.1.309: the dangerous `rm` and `rmdir` prompt in bypass-permissions mode in the desktop app and VS Code now denies the command at once with a rewrite hint, so unattended sessions keep going. `claude ultrareview` requires workspace trust; scripts pass `--trust-workspace`. On the self-hosted runner, `--startup-timeout-min` no longer stops a session whose first prompt is still working in a subagent; a frozen process is still stopped.

## Evidence

Changelog lines. What `/auto-mode-setup` writes, and where, is not described in the release notes and was not observed.

## Open questions

- Whether a `decider: "person"` refusal is visible to the model as a tool error it can route around, or ends the turn.
- Whether the five-minute WebFetch wait also applied to local scheduled sessions, which is how this repo's daily job runs.
