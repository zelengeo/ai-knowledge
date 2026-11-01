---
title: ask-matt names the next skill to type and stops; verify any load-bearing claim it makes against that skill's SKILL.md
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md
  - https://aihero.dev/skills-ask-matt
  - https://github.com/mattpocock/skills/releases/tag/v1.3.2
tags: [pocock-skills, engineering, routing, workflow]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-11-01
verified_by: agent
---

`/ask-matt` is a hand-written router over the 25 promoted skills. You describe a situation, it names the skill or sequence (and where human decisions sit), then stops. It runs nothing, and it only knows this skill set.

## When to use

- You have a situation (an idea, a pile of incoming bugs, a long session) and do not know which skill or flow fits.
- Two skills look interchangeable (grill-me vs grill-with-docs, grill-with-docs vs wayfinder) and you want the deciding test.
- You are at a phase boundary and need the ordered choice between continue, `/clear`, `/handoff`, subagent, `/compact`.
- Do not use it when you already know the skill: invoke that skill directly. It cannot route over your own or third-party skills.

## Procedure

1. User-invoked only (`disable-model-invocation: true`). Type `/ask-matt` and describe the situation.
2. The router answers from its own map: main flow (grill, spec, tickets, implement, review), on-ramps (triage, diagnosing-bugs, wayfinder), codebase health, vocabulary layer, standalones, and the precondition `/setup-matt-pocock-skills`.
3. Output is the next thing to type. You type it.
4. Companion file `PHASE-BOUNDARIES.md` holds the five-option decision tree for what to do with context between phases.

## Evidence

- Upstream claims: routes by situation, carries the branch conditions a flat list would drop, and says where to clear or compact.
- Demonstrated in the docs page's own "Common questions": the harness hides user-invoked skills from the model's skill list, so the router reports installed skills as missing; it answers from one-line summaries and has recommended skipping `/to-spec` without opening `to-spec/SKILL.md`. Both are unfixed upstream bugs.
- The docs page states the router is a secondary source: where it and a `SKILL.md` disagree, the `SKILL.md` wins.
- No eval data is published for routing accuracy.
- v1.3.0 added routes for `implement-spec`, `pr` and `retro`; v1.3.1 dropped the stale `diagnosing-bugs` to `improve-codebase-architecture` hand-off.
- v1.3.2 (2026-10-29) makes the router read a skill's `SKILL.md` before stating what it does or recommending a step be skipped, instead of trusting its one-line summaries (upstream issue 614). The current `SKILL.md` carries that instruction. The harness hiding user-invoked skills from the model's list is still unfixed as of the docs page read on 2026-11-01.

## Open questions

- Our delta: none yet.
- Should this repo's `AGENTS.md` point agents at `/ask-matt`, or is the overview note enough for an agent reader?
