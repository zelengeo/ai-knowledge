---
title: Parsimony ranks coding agents by net syntax units added on SWE-bench patches, and finds more code correlates with more solves
type: tool
status: inbox
evidence: T2
sources:
  - https://parsimony.lasu.dev/
tags: [evals, benchmarks, swe-bench, code-quality]
applies_to: []
added: 2026-10-16
last_verified: 2026-11-01
verified_by: agent
---

Parsimony is an open benchmark that takes patches already published by SWE-bench Verified, SWE-bench Live and DeepSWE and counts the net syntax units each model added (statements, calls, comparisons, names, literals; added minus removed). Models are ranked lowest first on solved tasks. The site reports that models writing more code also tend to solve more tasks, Spearman 0.33 to 0.60 on boards with 26 or more models, so size is not a free quality signal.

## When to use

- Choosing a model for long-lived codebases where volume of generated code is a maintenance cost.
- Sanity-checking a "solved more" claim against how much code it took.
- Measuring your own agent runs: the site accepts a JSON file in its published format and renders the same chart locally in the browser.

## Facts

- Unit of measure: syntax elements, not lines, so dense formatting is not rewarded; deletions are subtracted.
- Scope: Python only; tests, docs and generated files excluded; nothing is executed.
- Pass/fail is taken from the benchmarks' published results, not rerun.
- Every published model ran under the same agent (mini-SWE-agent), which the author notes still influences code volume.
- The author's own runs with Claude Code, pi and Codex on 5 to 10 DeepSWE tasks are shown faded and unranked. One cross-check: GPT-5.6 Sol under the author's harness added 0.88 times the code of its published run.
- Data and hashes are on GitHub, linked from the page.

## Evidence

The page states method, inputs, exclusions, and limits, and publishes the data. It is a single author's measurement, not independently reproduced, and the leaderboard numbers were not pulled into this note because they change as models are added. T2 for a stated, repeatable method.

## Open questions

- How well "units" tracks readability or design; the author says it does not.
- Whether the correlation between code volume and solve rate holds when the agent harness varies.
