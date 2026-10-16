---
title: prototype answers one design question talking cannot settle with throwaway code kept on a prototype/<name> branch; if you already know what to build, implement instead
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md
  - https://aihero.dev/skills-prototype
tags: [pocock-skills, engineering, prototyping, design]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`prototype` builds throwaway code scoped to a single question. Two branches: "does this state model feel right" produces one self-contained HTML file a non-developer can drive; "what should this look like" produces several structurally different UI variants on one route. The answer folds into the real code; the prototype is committed to a `prototype/<name>` branch out of main and pointed at from the implementation issue.

## When to use

- A grilling session hits an ungrillable question: edge cases of a state machine you cannot hold in your head, a screen you cannot picture.
- A `wayfinder` map files a `prototype` decision ticket.
- Not for a broken thing (`diagnosing-bugs`), not for a whole-app demo, not when the design is settled (`implement`).

## Procedure

1. Model-invoked; also `/prototype`. The skill picks the branch from the question (`LOGIC.md` or `UI.md`), defaulting by surrounding code if you are away.
2. Rules for both: marked throwaway, trivial to run (double-click or one task-runner command), in-memory state, no tests or error handling, full state surfaced after every action.
3. Run it in its own directory and session; `handoff` bridges out and back so the asking thread stays clean.
4. Capture: verdict plus question into an issue, ADR or commit; code onto the throwaway branch; context pointer on the implementation issue.

## Evidence

- Upstream claims (1.2.0 changeset): a prose summary loses what made the prototype convincing, so it is kept as a primary source; the HTML file replaces a terminal app so PMs and designers can drive it.
- Demonstrated on the docs page: agents recommend `/prototype` by name once tickets exist even when the design is settled (a naming problem); a `wayfinder` agent built three UI variants, chose one itself and closed the ticket. No measurements of token cost versus wrong-model rework are published.
- Unchanged between 1.2.3 and 1.3.1 beyond the em-dash sweep.

## Open questions

- Our delta: none yet.
- Where would a `prototype/<name>` branch live in a knowledge repo whose only runnable code is `scripts/`?
