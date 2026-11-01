---
title: grill-me interviews a loose idea in rounds and writes nothing; use it with no repo or on non-code subjects, and grill-with-docs inside a codebase
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md
  - https://aihero.dev/skills-grill-me
tags: [pocock-skills, productivity, grilling, planning]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-11-01
verified_by: agent
---

`/grill-me` is the stateless front door to `grilling`: its whole body is a call to that skill. It interviews you in rounds until the frontier is empty and leaves no files, only a sharper idea. The subject does not have to be code.

## When to use

- An idea worth taking seriously (feature, product direction, business call, piece of writing) before you know what it involves. If you can already specify it precisely, skip it.
- Not in a working directory: `grill-with-docs` runs the same interview and leaves a paper trail. Too big for one session: `wayfinder`. Answers in someone else's head: `to-questionnaire`.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Start in a fresh conversation, plan mode off.
2. Rounds: each is the whole frontier, numbered, with a recommendation per question; answer by number. Push back, say "I don't know", flag scope drift; passivity produces a plan you nodded at.
3. An ungrillable question (how should it look or feel) means stop and `prototype`, then return with a one-line answer.
4. Do not clear afterwards; hand the same conversation to `/to-spec` or `/implement` if it turned out to be software.

## Evidence

- Upstream claims: 46 questions in four rounds is ordinary; 200 questions means the scope was too big; the model matters more than for most skills.
- Demonstrated: installing `grill-me` without `grilling` does nothing (the body is one line). The opt-out line `When grilling, ask one question at a time.` in global `CLAUDE.md` is documented and used by a large part of the audience.
- 1.3.0 changed the body to an explicit Skill-tool call to raise the load rate.
- No eval data is published on decision quality.

## Open questions

- Our delta: none yet.
- The aihero page (v1.3.x) references `GLOSSARY.md`; the local 1.2.3 docs say `CONTEXT.md`.
