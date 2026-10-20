---
title: Justify each harness edit with a moment in a trajectory, prefer divergences between runs over repeated failures, and treat keeping the harness unchanged as a valid answer
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/google-research/harness2/blob/main/harness2/core/prompts.py
  - https://github.com/google-research/harness2/blob/main/harness2/core/context.py
tags: [harness, context-engineering, agents-md, evals, prompt-engineering]
applies_to: []
added: 2026-10-20
last_verified: 2026-10-20
verified_by: agent
---

Harness2's improver prompts encode a discipline for editing an agent's instructions that transfers to hand-editing CLAUDE.md or a skill: every edit must name the run and the moment it would have changed, edits are ranked by the kind of evidence behind them, a defect seen in one of k runs is noise, and leaving the harness alone is a real outcome rather than a failure.

## When to use

- After watching an agent fail or wobble on a task, before adding a rule to the always-on prompt or writing a skill.
- Reviewing a colleague's or an agent's proposed change to AGENTS.md, CLAUDE.md, or a SKILL.md.

## Procedure

1. Collect full trajectories of several runs on the same task, plus what each run produced. Harness2 serves them as files and keeps the prompt a short pointer, so nothing is truncated to fit a context window; the per-observation truncation floor is 10,000 characters because lower values "fabricate defects".
2. For each candidate edit, name the run and the moment: which run did what, and would this text have changed it? If you cannot name the moment, drop the edit; it is speculation and costs context for nothing.
3. Rank edits by evidence, in this order:
   - a divergence: runs disagreed, so the agent can already do it and only needs telling. Cheapest win.
   - a repeated concrete failure: the same error or omission in every run.
   - a risk visible in a trajectory but not yet realised.
4. Read the base runs as a set from one distribution. A failure that repeats across the set is a property of the harness; a defect in 1 of k is noise, and an edit aimed at it is overfitting to one sample.
5. Do not fix what the runs already got right, and do not restate what the harness already says; duplicated instruction dilutes the rest.
6. Weigh the downside as heavily as the upside. The costliest failure is a run that produces nothing; an edit that helps one run and risks emptiness elsewhere is a bad edit. An edit whose skill was never loaded or whose rule was ignored changed nothing, whatever it says on paper.
7. Write the decision log one line per edit: `kept|revised|dropped -> which edit -> the trajectory moment or base-set pattern, with counts`. A decision without evidence attached cannot be audited by the next reader.
8. `KEEP_BASE` is a real answer. Adaptation the evidence does not argue for is a regression: it costs context and buys nothing.

Two further rules from the DOM dimension prompt: never invent an authority, identifier, standard, or citation; and state knowledge the agent can apply and check ("before finishing, confirm X covers A, B, C") rather than background reading.

## Evidence

These are the literal rules in the proposer and composer prompts of a released system that the authors report improves two models on three benchmarks (see [the Harness2 mechanism note](harness2-propose-probe-compose-refines-agent-harness-without-ground-truth.md)). The repo does not ablate the rules individually, so there is no measurement of how much each one contributes. T1 for what the prompts say; the effectiveness of the discipline on its own is unmeasured.

## Open questions

- The procedure assumes k of 2 or more base runs; with one run there is no set to read and every defect is 1 of 1.
- Harness2 applies it with an agent as the editor. Whether a human editor following the same log format gets the same restraint is untested.
