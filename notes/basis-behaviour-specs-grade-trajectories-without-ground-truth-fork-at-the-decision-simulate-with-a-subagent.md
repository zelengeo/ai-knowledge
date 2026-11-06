---
title: Write behaviour specs and grade trajectories against them, fork at the offending decision, and iterate cheaply by having a sub-agent role-play the production agent
type: technique
status: inbox
evidence: T3
sources:
  - https://www.youtube.com/watch?v=JGtkTjn4120
tags: [evals, harness, context-engineering, subagents, agents, trajectories]
applies_to: []
added: 2026-11-04
last_verified: 2026-11-04
verified_by: agent
---

Basis (agents for accounting firms) supervises long agent runs that have no ground truth by writing down the few behaviours the agent must exhibit, grading every trajectory on whether each behaviour was relevant and followed, and diagnosing misses by forking the run at the decision or, more cheaply, by asking a coding agent to spawn a sub-agent that role-plays the production agent with its real context. The claim is that behaviour signal scales with trajectory volume while outcome evals do not, because a multi-hour run with hundreds of inference calls cannot be graded on its final answer alone.

## When to use

- The agent's runs are long, branch often, and most production situations have no reference answer to grade against.
- Users get different results on the same input from one run to the next and the complaint is inconsistency rather than a specific wrong answer.
- You are about to edit a system prompt, skill, or tool description and want to know in advance what the edit is supposed to change.

## Procedure

1. Pick the opinions that matter. For each thing the agent does, choose one way to do it and write it down as a behaviour, for example "explain a reconciliation difference, never post a plug entry to force a tie" or "read the primary source before answering a tax question". Do not write every detail; keep the handful that decide trust, since the rest is duplicated state. The opinion is a cost trade, not only accuracy: a screenshot check on a generated slide deck adds latency and may not be worth it if formatting fails one time in a hundred.
2. Keep the behaviours in a behaviour spec, a product spec for the agent, written before the context is edited. It states intent so the team aligns on it, and it doubles as the rubric in step 3.
3. Grade trajectories against the spec, not only against outcomes. For each trajectory, from an eval set, testing, or production, ask two questions per behaviour: did a situation arise where this behaviour applied, and if so, did the agent exhibit it? A behaviour that is exhibited across the distribution is evidence the harness generalises; a passed outcome eval on a hundred cases is not.
4. On a behaviour miss, fork the trajectory at the decision. Replay to the point just before or just after the agent chose against the spec, then either ask it why it did that, or edit the context and run forward to see whether the behaviour changes. Basis built this internally; the speaker notes it is hard to do in the cloud because the database and environment must be recreated at that point.
5. Before you have forking, simulate. In a coding agent, ask it to create a sub-agent that pretends to be the production agent, given the real system prompt and skills, rendered exactly, and told not to cheat. Describe the failing situation and check whether the sub-agent reproduces the decision. If it does, change the context and ask again. This is worse than forking but needs no tooling; the speaker says he used it for over a year before Basis built forking.
6. Treat everything the agent sees at runtime as training data, not a prompt: system prompt, progressive disclosures, tool descriptions. A behaviour is the product of all of it, so a miss is rarely fixed by one more paragraph in the system prompt, and every token should be accounted for.
7. Expect trust to arrive the way it does for a new coworker: reviewers weigh the blast radius of the change against their perception of the author's competence. A narrow, consistent agent gets reviewed less over time; a brilliant but erratic one does not. See [pstack's blast-radius check](pstack-blast-radius-prove-the-one-safety-fact-by-running-code.md) for a code-side version of the same axis.

## Evidence

The only source is the conference talk itself. It describes the three techniques as in use at Basis and gives worked examples (bank reconciliation plug versus explanation; PDF extraction with many possible methods; screenshotting a slide deck before returning it) but states no measurements: no count of trajectories graded, no before-and-after on consistency, no comparison of simulation against forking beyond "much cheaper, much faster, obviously far worse". The speaker's claim that behaviour grading scales faster than outcome evals is argued, not shown. Tier T3 for that reason.

The approach is the practitioner-side counterpart of Google Research's Harness2, which also refines a harness from trajectories without a grader; see [the Harness2 mechanism note](harness2-propose-probe-compose-refines-agent-harness-without-ground-truth.md) and [its edit discipline](harness2-every-harness-edit-must-trace-to-a-trajectory-moment.md), which adds the rule that each edit must name the trajectory moment it would have changed. Step 4 here is the manual version of that rule.

## Open questions

- Who grades the trajectories against the spec? The talk does not say whether it is a model, a human, or both, and a model grader on a long trajectory has the same truncation problems Harness2 works around.
- How faithful is the role-playing sub-agent? It runs inside a coding agent's context, not the production harness, so tool behaviour and environment state are approximated. No data on how often it reproduces a production decision.
- The spec is meant to stay short. No guidance on how to retire or merge behaviours as the agent's scope grows.
