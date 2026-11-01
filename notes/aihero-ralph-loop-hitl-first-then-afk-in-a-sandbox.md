---
title: A Ralph loop reruns one prompt per iteration so the agent picks the next task from a PRD; run it HITL first, then AFK inside a Docker sandbox with capped iterations, a progress file, a completion sigil, and commit-blocking feedback loops
type: technique
status: inbox
evidence: T2
sources:
  - https://www.aihero.dev/getting-started-with-ralph
  - https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum
  - https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects
  - https://ghuntley.com/ralph/
  - https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
tags: [aihero, afk, ralph, sandbox, feedback-loops, claude-code]
applies_to: [claude-code@2.x, docker-desktop@4.50]
added: 2026-10-16
last_verified: 2026-10-26
verified_by: agent
---

Ralph (Geoffrey Huntley's pattern) is a shell loop that runs the same prompt against `claude -p` up to N times; each iteration reads a PRD and a progress file, picks one task, implements it, runs feedback loops, commits, and appends progress. Matt Pocock's two guides add the operating rules: start with a single-iteration script you watch (HITL), move to the loop (AFK) only once the prompt is trusted, cap iterations (5 to 10 small, 30 to 50 large), run inside `docker sandbox run claude`, make pre-commit checks block the commit, and stop on a `<promise>COMPLETE</promise>` sigil in the output. The course's "safer unattended agents" lesson covers the same ground with Sandcastle; see the map note.

## When to use

- Backlog work with explicit scope and stop condition: feature lists, test coverage, lint fixes, duplication, dead code.
- Not for early architectural decisions; keep those HITL because their shortcuts cascade.

## Procedure

1. Write the PRD as a checklist or JSON items with a `passes` flag (Anthropic's long-running-agent format). Name files to include, the stop condition, and edge cases, or the agent redefines "done".
2. `ralph-once.sh`: one `claude --permission-mode acceptEdits` run with `@PRD.md @progress.txt` and "only do one task". Watch, check the commit, rerun.
3. `afk-ralph.sh`: `for` loop over `docker sandbox run claude -p ...`, capture output, exit when the sigil appears.
4. Prompt additions: prioritise architecture, integration points, and unknowns before polish; keep one logical change per commit; run typecheck, test, lint before committing and do not commit on failure.
5. Pre-commit hooks (husky plus lint-staged, typecheck, tests) so a red loop cannot commit.
6. Delete `progress.txt` after the sprint; it is session state, not documentation.

## Evidence

Practitioner guides with full scripts. Outcomes reported without method: the author's CLI went from 16% to 100% test coverage via a coverage loop; a coverage run declared "done" after skipping internal commands until the scope named them. The sandbox tradeoff is stated: it isolates where commands run, not which (hence the git-guardrail hook, see [aihero-pretooluse-hooks-enforce-cli-rules-deterministically](aihero-pretooluse-hooks-enforce-cli-rules-deterministically.md)); global `AGENTS.md` and user skills are not loaded inside it. The `-p` print mode and `--permission-mode` flags are Claude Code features; verify against Anthropic's docs before relying on them.

## Open questions

- This repo's daily job is already an AFK loop with a watchdog note; does the sigil pattern beat the existing retry logic?
- Sandcastle (github.com/mattpocock/sandcastle) is the author's later tool for this; no aihero page describing it was readable on 2026-10-16.
