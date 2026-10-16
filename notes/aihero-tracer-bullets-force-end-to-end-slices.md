---
title: Telling an agent to build a tracer bullet (one thin end-to-end slice, tested, then the next slice in a fresh window) counters its tendency to build whole layers before anything is validated
type: technique
status: inbox
evidence: T2
sources:
  - https://www.aihero.dev/tracer-bullets
  - https://www.aihero.dev/skills-to-tickets
tags: [aihero, planning, tickets, quality]
applies_to: []
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

Left alone, a coding agent tends to produce a complete solution in one leap: all endpoints, models, middleware, logging, and only then the database connection that turns out to be wrong. Matt Pocock's fix is the Pragmatic Programmer's tracer bullet: build one narrow path through every layer, test it, get feedback, then take the next slice in a fresh context window. The same rule is what `/to-tickets` encodes as vertical slicing (see [aihero-to-tickets-cuts-tracer-bullet-tickets-with-blocking-edges](aihero-to-tickets-cuts-tracer-bullet-tickets-with-blocking-edges.md)).

## When to use

- Any feature touching more than one layer (schema, API, UI) handed to an agent.
- Inside an unattended loop prompt or a build-feature skill, where you cannot intervene mid-build.

## Procedure

1. Add a short "Tracer Bullets" section to the loop prompt or skill: build a tiny end-to-end slice first, seek feedback, then expand. The post gives a paragraph you can adapt; summarise it in your own words rather than copying.
2. Ask the agent to break the task down before coding and to label which item is the tracer bullet.
3. Build and verify that slice alone (one backend endpoint wired to one UI location, in the post's example).
4. Start the next slice in a fresh window.

## Evidence

Practitioner post. The mechanism claim (agents build layers because of sycophancy and a drive to finish) is asserted, not measured. The evidence shown is one agent breakdown for a real issue (#161 in the author's video manager) where the agent labelled the first of four items as the tracer bullet and built it first. The post ties the discipline to context-window limits: unlike with humans, the cost of outrunning feedback is immediate. T2 for a procedure run once and shown; the behavioural claim about agents is the author's experience.

## Open questions

- Does the instruction still help with models that already plan slices by default? Compare a run with and without the section.
- Where should it live for this repo: the daily-job procedure, or a skill under `skills/`?
