---
title: performance-optimization treats an optimization as a hypothesis, re-measured under the baseline's conditions one change at a time against run-to-run noise, with anything neutral, worse or test-breaking reverted and a ledger of tried ideas so dead ones stay dead
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/performance-optimization/SKILL.md
  - https://github.com/addyosmani/agent-skills/blob/main/agents/web-performance-auditor.md
tags: [agent-skills, performance, benchmarks, web-vitals, measurement, review]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The skill's non-obvious rule is the keep/revert table. Teams keep neutral changes because they are already written; the skill calls neutral a revert, because code you keep you maintain forever and an unmeasured win is how complexity lands. It pairs with a ledger because reverted work leaves no trace in git, which is why the same idea gets retried next quarter.

## When to use

- Any change justified by speed, including an agent's "optimizations" during a refactor.
- Alongside [pstack's benchmark checklist](pstack-benchmark-checklist-seven-questions-before-reporting-a-number.md), which covers how to produce the number this rule consumes.

## Procedure

Loop: MEASURE (synthetic and real-user), IDENTIFY the bottleneck, FIX one thing, VERIFY with the same command and conditions, GUARD with a CI gate and RUM alerting.

Verify rules: same command, same conditions as the baseline; one change at a time; compare the delta to variance (a 3% gain inside plus or minus 5% noise is not a gain). Decision table: past the threshold with a green suite, keep and commit the before/after numbers; within noise, revert; worse, revert; improved but a test went red, revert ("a regression wearing a win's clothing"). Correctness gates the metric: a win from dropping needed work (a skipped validation, a cache on something that must be fresh, a removed load-bearing await) is a regression.

Ledger: a table of Idea, Baseline to Result, Verdict, Why, in the PR description or a `PERF.md`. Example row: memoize row component, INP 240ms to 235ms, reverted, inside noise of plus or minus 15ms.

Reference thresholds carried by the skill (Core Web Vitals good / needs improvement / poor): LCP 2.5s / 4.0s; INP 200ms / 500ms; CLS 0.1 / 0.25; long task over 50ms. Backend: prove N+1 and index guesses with `EXPLAIN ANALYZE`, run `ANALYZE` when row estimates are off before adding an index; keep `instances x pool max` under the database ceiling and pool with pgbouncer rather than raising max; cache keys include every varying input (tenant, locale, permissions, flags).

Rationalizations rebutted: "it didn't help much but it doesn't hurt" (you pay maintenance forever for nothing), "we already wrote it" (sunk cost; the measurement does not care), "the improvement is obvious" (then re-measuring is cheap and proves it).

## Evidence

Read from the skill. Thresholds are the published Core Web Vitals values. The claim that 100ms delays affect conversion is stated without a citation. No data on how often agents keep neutral changes; the rule is a prescription.

## Open questions

- A ledger of reverted attempts is the same shape as this repo's `state/verdicts.jsonl`; a note on a dropped technique is the ledger entry.
