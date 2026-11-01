---
title: Claude Code unattended retry mode can stop at a usage limit instead of waiting for it to reset, and since 2.1.305 can notice a limit lifted early
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.301
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.305
tags: [claude-code, unattended, scheduling]
applies_to: [claude-code@2.1.x]
added: 2026-10-16
last_verified: 2026-10-23
verified_by: agent
---

Claude Code's unattended retry mode (`CLAUDE_CODE_RETRY_WATCHDOG`) will wait at a usage limit until it resets. Since v2.1.301, `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS` caps that wait: a limit that resets further away than the cap ends the request instead of blocking the run. Since v2.1.305, `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` sets how often the wait rechecks the limit, so a limit lifted before its announced reset is noticed instead of waited out.

## When to use

- Scheduled or headless runs where a request parked for hours on a usage limit is worse than a clean failure the scheduler can report.
- Set the cap below the scheduler's own timeout so the job fails inside its window with a usage-limit reason rather than being killed.

## Procedure

1. Enable unattended retry mode with `CLAUDE_CODE_RETRY_WATCHDOG` in the job's environment.
2. Set `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS` to the longest wait the job can afford, in milliseconds.
3. Set `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` (2.1.305 or later) to a recheck interval shorter than the cap, so a limit that lifts early resumes the run instead of running out the cap.
4. Treat a request ended by the cap as a reportable failure; rerun on the next schedule.

## Evidence

The v2.1.301 release notes describe the cap variable and the behaviour in one line. The v2.1.305 notes describe the recheck variable in one line: unattended retry mode "notices a usage limit that was lifted before its reset". The accepted values of `CLAUDE_CODE_RETRY_WATCHDOG` itself are not restated in either; the variable predates both releases. No default for the recheck interval is stated.

## Open questions

- How the ended request surfaces in headless output (exit code, stderr message) is not documented in the changelog.
- Whether the cap also applies to rate-limit waits that are not usage limits.
