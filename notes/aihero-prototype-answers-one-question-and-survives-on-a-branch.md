---
title: /prototype builds throwaway code to answer one design question, then keeps the code on a prototype/<name> branch that is never merged, with a pointer from the implementation issue
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills-prototype
  - https://www.aihero.dev/tracer-bullets
  - https://github.com/mattpocock/skills
tags: [aihero, pocock-skills, prototyping, planning]
applies_to: [mattpocock-skills@1.3]
added: 2026-10-16
last_verified: 2026-10-23
verified_by: agent
---

`/prototype` writes code with no tests, no error handling beyond what runs, no abstractions, and no persistence, scoped to one question stated at the top. Two shapes: a logic question yields a single self-contained HTML file with a visible state panel and tabbed walkthroughs over a pure reducer module; a look-and-feel question yields several structurally different UI variants on one route behind a `?variant=` switch. The answer goes to main (commit message, ADR, or issue); the prototype goes to `prototype/<name>` as evidence and is never merged. Per-skill detail belongs in [pocock-skill-prototype](pocock-skill-prototype.md).

## When to use

- A grilling question that talking cannot settle: a state machine you cannot hold in your head, a screen you cannot picture.
- A `wayfinder` ticket typed `prototype`.
- Not for "why is the built thing broken" (that is `diagnosing-bugs`) and not for a whole-app demo, which has no stopping point and drifts into production.

## Procedure

1. Write the question in one sentence. If you cannot, the scope is too big; split.
2. Run it in its own session and directory; bring back only the answer (see [aihero-handoff-only-when-work-must-travel](aihero-handoff-only-when-work-must-travel.md)).
3. For UI variants, insist they disagree on structure and render against real data and density; three card grids with colour tweaks answer nothing.
4. Stop the moment you add a test, wire a real database, or generalise. That is implementation, not prototyping.
5. Record the verdict permanently, commit the prototype to `prototype/<name>` off main, link the branch from the implementation issue.
6. Finish in one sitting.

## Evidence

Vendor docs page. It records two design changes with their reasons: prototypes used to be deleted and are now kept as a primary source because a prose summary loses what convinced; the logic branch used to emit a terminal app and now emits HTML so non-developers can drive it. It also documents a naming failure: agents that do not know the flow recommend `/prototype` when `/implement` is the next step. The tracer-bullets post calls `/prototype` the automation of that technique. No measurement of time or tokens is given; the page's token argument is cost of a wrong state model versus cost of a prototype.

## Open questions

- A `prototype/<name>` branch per question accumulates branches; decide a pruning rule for this repo.
- Does a single-file HTML prototype fit non-UI questions here (for example a triage rule), or is the pure-module half enough on its own?
