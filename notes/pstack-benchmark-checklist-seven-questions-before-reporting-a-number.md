---
title: Before reporting a measured speedup or regression, answer seven questions from runs (limiter, tuning, physical limits, errors, five alternating repeats, end-to-end share, did the work happen) or call it inconclusive
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/benchmark-checklist/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/benchmark-checklist/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/principle-explain-the-number/SKILL.md
tags: [pstack, performance, benchmarks, evals, verification]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `benchmark-checklist` makes an agent write the claim it expects to ship before measuring ("export is 30% faster at p50 on the 60k-row dataset"), then test that sentence with seven questions answered from runs, not from reading the code. A verdict is inconclusive when the limiter cannot be named, a side ran untuned, or errors and "did it happen" were not checked. The same discipline applies to eval numbers through the `explain-the-number` principle.

## When to use

- Any PR with a before-and-after number, a regression claim, a hillclimb harness, or a library or config choice.
- Triaging someone else's benchmark: the questions double as a drop rule for "X beats Y" without method (this repo's rubric D3).

## Procedure

Before running: write the claim; read the measurement script and note what it times and ignores; check `uptime` and `nproc`, and if the machine is busy interleave sides and say so.

1. Why not double? Name the limiter from a profiled run you do not report (`top`, `pidstat`, `node --cpu-prof`, `py-spy`, `perf`, `strace -c`). If the load generator saturates first, you measured it.
2. Was it tuned? Every side runs as production does: release build, flags, pools, caches, versions, data. A limiter that is a setting means that side is untuned; tune and rerun before picking a winner.
3. Did it break limits? Compare with disk, network and core arithmetic. Removing a piece that takes 10% of the run makes it at most about 11% faster. A result past a limit measured a cache, a no-op or a bug.
4. Did it error? Count failures and non-success responses; check outputs are correct. Rejections are fast, timeouts are slow.
5. Does it reproduce? At least 5 runs per side, alternating A, B, A, B. Report median and range. A gap inside run-to-run variation is no difference; use a rank-sum test when close.
6. Does it matter? Measure the end-to-end path a user waits on and report the micro result as a share of it.
7. Did it even happen? Confirm the work ran inside the timed region: generators iterated, promises awaited, results used, rows written.

Report: verdict first (faster, slower, no measurable difference, inconclusive), then the number with unit, run count, range and limiter. One primary number in the PR body; runs and evidence in a linked artifact. A quick ballpark the user asked for may be one run, still checking 4 and 7 and saying it is one run; a choice between options is never a ballpark.

## Evidence

Read from the skill file. The thresholds (5 runs, alternating order) are the author's defaults with no cited study. The arithmetic checks are standard Amdahl reasoning.

## Open questions

- None specific; the procedure is self-contained and runnable today.
