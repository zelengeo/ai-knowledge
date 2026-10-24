---
title: constraint-driven-development writes a CONSTRAINTS.md with a tool-free floor, numbered dimensions each naming the command that checks it, ratchets for metrics without a target, and expiring exceptions, then places checks by cost (seconds in the edit loop, under 90s at task end, the rest in CI) and guards the bar itself against five agent moves
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/constraint-driven-development/SKILL.md
  - https://github.com/addyosmani/agent-skills/blob/main/.claude/commands/constraints.md
tags: [agent-skills, quality-gates, ci, hooks, coverage, autonomous, constraints]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The skill's premise: an agent writes more in an afternoon than you read that week, so the judgement must move out of your head into checks that run around the loop, with numbers you chose, firing close enough to the work that the agent fixes its own output. It produces one file at the repo root any harness can read, and its most useful parts are the placement rule and the list of ways an agent quietly lowers the bar.

## When to use

- No quality bar is written down, CI has checks nobody can rank as blocking or decorative, or you are about to run an autonomous loop where the only gate is a suite the agent also wrote.
- Not for throwaway code, and not in non-interactive contexts (apply the floor, flag the rest).

## Procedure

1. Detect before asking: stack, test runner, linters, current coverage, CI, agent harness files. Report in two lines.
2. Four questions, each with a guess and a default so "I don't know" still yields a config: which dimensions beyond the floor (default: changed-line coverage and security scanning); block or warn mid-task (default: block on the floor, warn on the rest for two weeks); targets or measure-and-hold (default: measure); slowest check tolerated before the agent hands back (default: 90s at task end, unlimited in CI). Stop at four.
3. Write `CONSTRAINTS.md`: Floor (no new suppression comments such as `@ts-ignore`, `eslint-disable`, `# noqa`; no stubs or empty catch; no skipped or deleted tests without a reason in the commit; no secrets; this file is not weakened to pass), an Enforced table whose every row names rule, command and when it runs, a Measured-not-enforced table with today's value and a direction, an Exceptions table with owner and expiry. Add one line to `AGENTS.md`: read it, never weaken it to make a change pass.
4. Install the de facto tool per dimension rather than hand-rolling: Semgrep, gitleaks (always `--redact`, or the secret lands in the transcript), osv-scanner, axe-core, Lighthouse, size-limit, dependency-cruiser, Stryker. Drop a dimension that needs a URL if the project has none. Expose as `check:fast`, `check:task`, `check:full`; the markdown file stays canonical.
5. Place by cost: types, lint, secrets after each edit (under 5s, changed file only); related tests and changed-line coverage at task end (under 90s); everything else at review or CI. Scope to the diff; read the lcov the suite already wrote rather than running twice; mutation-test only changed files.
6. Guard the bar: five moves to look for in the diff at review: a threshold moved, a test got easier (`.skip`, deleted file, pulled assertions), a checker got silenced (`istanbul ignore`, `Stryker disable`, `nosemgrep`, `gitleaks:allow`), unfinished work (stub, empty catch, TODO), a new exception row. Rank checks by circularity: external (axe, osv, Lighthouse) over project-owned (lint, boundaries) over the suite the agent wrote; require at least one external.
7. Ratchet when there is no number: record today's value, refuse to get worse, tolerance 0.5%.

Sane defaults: changed-line coverage 80%, mutation score 60% to start, no high-or-above vulnerabilities, LCP 2500ms, CLS 0.1, zero critical or serious axe violations, exception lifetime 90 days. Escalation: written only, then a `check` script in a post-edit hook and CI (most projects stop here), then a dedicated runner once the shell passes about thirty lines. A reference floor guard ships in the skill's `references/floor-guard.md`. Sub-commands: `/constraints check`, `guard`, `ratchet`.

## Evidence

Read from the skill and command files. The thresholds are defaults with stated reasons, not measured. The "agents take the cheapest road to green" observation matches [pstack correct](pstack-correct-fixes-repeated-agent-mistakes-at-highest-enforcement-level.md) and [pre-commit hooks enforce conventions on agents](precommit-hooks-enforce-conventions-on-agents.md), both also unmeasured. The skill argues that models are rewarded for passing tests in seconds while rot shows over months, and calls the ratchet "the missing penalty"; that is an argument, not data.

## Open questions

- This repo could carry a CONSTRAINTS.md of its own: the no-em-dash rule, no wikilinks, frontmatter keys, T1 origin rule are all floor-shaped and diff-scoped.
