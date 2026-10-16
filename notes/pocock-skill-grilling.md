---
title: grilling asks the whole frontier per round, looks facts up itself and leaves decisions to the human; it is the primitive every grill wrapper calls
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md
  - https://aihero.dev/skills-grilling
tags: [pocock-skills, productivity, grilling, interview]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`grilling` models the subject as a design tree and interviews you round by round. A round is the frontier: every decision whose prerequisites are settled, and nothing that depends on an open answer. Facts are dispatched to sub-agents; decisions wait for you. It ends when the frontier is empty and will not act until you confirm shared understanding.

## When to use

- You want the bare interview with no wrapper, or you are writing your own skill that needs one.
- Usually you do not type it: `grill-me`, `grill-with-docs`, `triage`, `wayfinder` and `improve-codebase-architecture` run it for you.
- A question talking cannot settle goes to `prototype`.

## Procedure

1. Model-invoked (the only grilling-family skill that is); also `/grilling`.
2. Round format is fixed: numbered question with title and body, then the agent's recommended answer on its own line; 1.3.0 added a `---` rule between questions. Answer by number.
3. Each answer reshapes the tree; the next round is recomputed, not pre-written. Thirteen questions typically land in about three rounds.
4. Opt out of rounds with `When grilling, ask one question at a time.` in global `CLAUDE.md`.

## Evidence

- Upstream claims: no question in a round can invalidate another in that round; that is the answer to "batching loses follow-ups".
- Demonstrated limits on the docs page: the frontier is the agent's judgement, not a computed graph, so two dependent questions can share a round; the recommendation sometimes argues against the question's wording; weaker or lower-effort models collapse the interview into a couple of questions and start building despite the confirmation gate; agents answering their own decisions inside a resolve-the-ticket frame is the reason facts and decisions were split in 1.1.0.
- 1.3.0 removed em-dashes from the body and added the horizontal rule.
- No eval data is published.

## Open questions

- Our delta: none yet.
- A GitHub-issue async variant was requested and refused upstream (an unanswered grill is the agent's opinion); relevant if this repo ever wants decision memos on issues.
