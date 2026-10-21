---
title: Blast-radius review finds the one fact a change is safe because of and proves it by running real code, with a five-rung certainty ladder from "you said so" to "reproduced in the running app"
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/blast-radius/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/blast-radius/SKILL.md
tags: [pstack, code-review, verification, risk]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `blast-radius` rejects the written risk analysis as the deliverable ("it reads as convincing whether or not it's true") and replaces it with one proven fact: most risky-looking changes are safe because of a single property, so find that property, then write a script or test that imports the real library and calls the exact function, and paste what happened. Each supporting fact carries its rung on a five-step ladder: you said so; you pointed at a `file:line`; you walked the failure path and it does not reach; you ran it; you reproduced it in the running app.

## When to use

- A small diff you do not trust, or "what could this break".
- Companion to `how` (what the code does) and `why` (why it is shaped that way). Listing callers is explicitly not the job; grep does that.

## Procedure

1. Read the change, including what the diff does not spell out. Pull the PR and commits.
2. Find the one fact it is safe because of. Spend the time here, not on a list of maybes.
3. Look where grep stops: the library's own source at its pinned version and local patches, timing (microtasks, teardown), JSON an API returns, a DB column, a wire format, another language reading the same bytes, feature flags, code three hops downstream.
4. For each risk give a real likelihood and cost with a `file:line`. Keep confirmed risks; list cleared ones separately. A search that finds nothing is still an answer; never invent a caller.
5. Prove the one fact with a script that runs the real code. Run it. Paste the output.
6. For a wide change, run the question as an [arena](pstack-arena-parallel-candidates-cross-judge-pick-base-graft.md) across models and merge.

Hand back: what it does, the one fact with its rung and proof (or "unproven"), risks, cleared, and the cheapest pre-merge test including the script written.

## Evidence

Read from the skill file. The ladder and the "one fact" heuristic are the author's practice; no data on how often a single fact covers the risk, or on false-safe rates.

## Open questions

- How the rung is enforced. The skill asks the agent to say where it stopped; nothing checks that a claimed rung 4 has a script in the diff.
