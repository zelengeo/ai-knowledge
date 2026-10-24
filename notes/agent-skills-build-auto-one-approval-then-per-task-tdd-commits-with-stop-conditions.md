---
title: /build auto runs a whole approved plan unattended with one human gate, requiring a spec at a known path, a clean git baseline, one RED-GREEN-regression-build commit per task staging only that task's files, and hard stops for unfixable failures, ambiguity, and anything git revert cannot undo
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/.claude/commands/build.md
  - https://github.com/addyosmani/agent-skills/blob/main/skills/incremental-implementation/SKILL.md
tags: [agent-skills, autonomous, afk, tdd, commits, claude-code, build]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

`/build auto` removes the human stepping between tasks, not the verification: every task still earns a failing-then-passing test and its own commit, so any point is a clean rollback. It is agent-skills' version of an AFK loop, and its preconditions are the useful part.

## When to use

- A spec exists and the remaining work is disciplined implementation of a known plan. Compare [the Ralph loop: HITL first, then AFK in a sandbox](aihero-ralph-loop-hitl-first-then-afk-in-a-sandbox.md), which adds sandboxing that this command does not mention.

## Procedure

1. Require a spec at `SPEC.md`, `docs/SPEC.md` or under `spec/`. A README or arbitrary doc does not count; with none, stop and say run `/spec`. Do not invent requirements.
2. Clean baseline: `git status --porcelain`; any uncommitted change outside the planning artifacts (`SPEC.md`, `docs/SPEC.md`, `spec/*`, `tasks/plan.md`, `tasks/todo.md`) stops the run, or per-task commits absorb unrelated work and the rollback guarantee breaks.
3. Plan if `tasks/plan.md` is missing (`planning-and-task-breakdown`). Commit a generated plan as its own preparatory commit.
4. Single checkpoint: show the full plan; only an unambiguous affirmative ("approve", "go", "yes") counts; "looks reasonable" or "I guess" is not approval.
5. Per task in dependency order: read acceptance criteria, load context, RED, GREEN, full suite, build, commit staging only that task's files plus its status update (never `git add -A`), mark complete.
6. Stop and ask when a test cannot pass or the build breaks without an obvious fix (hand to `debugging-and-error-recovery`); the spec is ambiguous or a task needs an uncovered decision; a task is high-risk or irreversible: auth or permission changes, destructive migrations, payments, deletions, deploys, secrets, or anything `git revert` cannot undo (hand to `doubt-driven-development` and get sign-off). After the user resolves it, re-invoking resumes from the next pending task.
7. Summarise: tasks completed, tests added, commits, anything skipped or flagged.

Default `/build` without `auto` does one task and stops. The underlying `incremental-implementation` skill adds: more than about 100 lines without running tests is a red flag; note out-of-scope improvements under "NOTICED BUT NOT TOUCHING" rather than fixing them; do not re-run an unchanged build or test command for reassurance.

## Evidence

Read from the command and skill files. No run data. The README states `/build auto` pauses on failures or risky steps; the stop list above is the operational definition.

## Open questions

- No sandbox or permission narrowing is specified for the autonomous stretch; `constraint-driven-development` is positioned as the gate that should exist before running it.
