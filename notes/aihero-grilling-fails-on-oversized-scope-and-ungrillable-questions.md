---
title: Grilling sessions go wrong past roughly 120k tokens, on questions that need a prototype to answer, on passive answering, and on small models
type: technique
status: inbox
evidence: T2
sources:
  - https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs
  - https://www.aihero.dev/skills-grill-me
tags: [aihero, pocock-skills, grilling, context-engineering, planning]
applies_to: []
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

Matt Pocock's field guide to `/grill-me` and `/grill-with-docs` names the recurring failure modes: trying to talk through high-fidelity questions (layout, feel) that need something to react to; grilling a scope so large the session crosses into the "dumb zone", which he puts at about 120k tokens for current frontier models; answering "agreed" forty times; writing the spec in a fresh session and losing the decisions; and grilling with a small model, which lacks the parametric knowledge the interview relies on.

## When to use

- Before any grilling session longer than a few rounds, or any session that will feed `/to-spec`.
- When a session has produced hundreds of questions: the scope, not the skill, is the problem.

## Procedure

1. Split before grilling: ask the agent to break a large scope into grillable chunks and grill each in its own session.
2. Classify each question. Low fidelity ("which URL?") is grillable. High fidelity ("one form or three pages?") is not: hand off to a `/prototype` session, get the answer, hand back, answer in one line. Pattern: grill, prototype, grill again.
3. Steer. Push back on questions that are too fine, say "I don't know" and mean it, stop when planning outruns building.
4. Never clear before the spec. Either implement in the same window or run `/to-spec` on the live conversation.
5. Grill with the best model available; implementation can use a cheaper one because it runs mostly on contextual knowledge.
6. Optional throughput trick: run two grilling sessions in parallel, answering one while the other thinks. The author caps himself at two, three if one is doing long research.

## Evidence

A practitioner write-up from the skill's author, based on his own sessions and user reports; no measurement is published. The 120k-token threshold is asserted, not derived, and sits alongside the dictionary's "smart zone" entry. The contextual-versus-parametric knowledge argument for model choice is reasoning, not an experiment. The page still references `/2PRD`, a since-renamed skill, which dates it to before v1.1. Treat the procedure as runnable and the numbers as the author's heuristics.

## Open questions

- Does the degradation point move with the model generation in use here? Worth logging session size at the point questions get worse.
- Is parallel grilling compatible with `grill-with-docs` writing to one `GLOSSARY.md` from two sessions?
