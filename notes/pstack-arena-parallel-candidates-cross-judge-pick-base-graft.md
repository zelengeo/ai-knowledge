---
title: Arena bakeoff. N candidates on the same prompt in separate worktrees, a rubric written before fan-out, a cross-judge from a different model family, pick one base, graft one or two parts from each loser by hand
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/arena/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/arena/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/swarm/SKILL.md
tags: [pstack, subagents, parallelism, prototype, design]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `arena` runs the same prompt against N subagents (default one Opus, one Grok), each writing to its own worktree, then picks a base by scoring every candidate against a rubric fixed before fan-out, compared with an independent cross-judge on a different model family, and grafts at most a few parts from the losers into the base by hand. Convergence means ship the consensus; wild divergence means the prompt was under-specified, so reframe and rerun rather than average.

## When to use

- One attempt at a non-trivial artifact would lock in the wrong shape (a module boundary, a renderer, an instrumentation design).
- The companion `swarm` is for partitioned coverage or races with a declared selection rule (`first pass`, `rank all`, `best-of`), not for picking a design.
- Related: [prototype](pocock-skill-prototype.md) answers one question with one throwaway; arena compares several.

## Procedure

1. Frame. State the artifact. Write 3 to 6 gradeable criteria; candidates never see them. Pick runners from the `arena runners` config line. Give each its own output path (worktree, else `/tmp/arena-<slug>/candidate-<n>/`).
2. Fan out. Spawn all N in one message, in the background, each with the task, the shared grounding path, its output path, and an instruction to write a short rationale naming rejected alternatives. A dropout reduces N by one.
3. Cross-judge. After all candidates finish, spawn one read-only judge on a model from the `arena cross-judge pool`, preferring a family different from the parent's. It scores by criterion and recommends a base.
4. Pick. Read every candidate end to end, score criterion by criterion, compare with the judge. Agreement confirms; disagreement means a bias or an ambiguous rubric, read both rationales. Tie-break toward the cleaner boundary or smaller API.
5. Graft. One pass over each loser for one or two things worth porting, folded in by hand so the result keeps one mental model.
6. Verify the synthesized artifact like any other output. A problem the arena missed means either reframe and rerun, or a graft was missed.

Output: the artifact plus a synthesis note naming the base, the judge's verdict, each graft and its source, rejections, convergence or dropouts, and the verification result.

## Evidence

Read from the skill file. The repo gives no data on how often candidates converge, on cross-judge agreement rates, or on cost. The rule "same model N times when generation-bound, different models when judgment-sensitive" is stated, not measured.

## Open questions

- Token cost of N full candidates plus a judge versus one candidate plus interrogate. Not stated.
