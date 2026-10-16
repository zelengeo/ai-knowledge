---
title: tdd is red then green at pre-agreed seams with no refactor step; skip it for glue and config that have no independent truth to assert
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md
  - https://aihero.dev/skills-tdd
tags: [pocock-skills, engineering, testing, tdd]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`tdd` is a reference, not a driver: the rules that make red-green produce tests worth keeping. One failing test at a pre-agreed seam, just enough code to pass, repeat in vertical slices. No test is written at a seam the human has not confirmed. Refactoring was dropped from the loop and belongs to `code-review`.

## When to use

- A behaviour with defined inputs and observable outputs: business logic, a request/response contract, validation.
- Driven by `implement` per ticket, or alone when there is no spec.
- Not when the behaviour is unpinned (`to-spec`), the interface shape is the question (`codebase-design`), or the change is wiring, config, type annotations or CRUD delegation (open gap, issue #746).

## Procedure

1. Model-invoked; fires on test-first requests or "red-green-refactor". Also `/tdd`.
2. Before any test: name the seams, wait for confirmation. In the full chain the seams come from `to-spec`; alone, it asks.
3. Loop: red first, one slice per cycle, the first slice a tracer bullet through every layer. Expected values must come from an independent source (a literal, a worked example, the spec).
4. Mocks only at system boundaries (external APIs, time, randomness); never your own modules. `tests.md` and `mocking.md` carry examples.

## Evidence

- Upstream claims: horizontal slicing (all tests first) tests imagined behaviour; tautological tests pass by construction.
- Demonstrated: the trigger phrase still says "refactor" though the step is gone (issue #589); seam selection prompts list names only, so users cannot choose (issue #607, most-reported friction); one user got the model to admit it wrote the implementation first out of habit, which the skill accepts as a known compliance limit; a Playwright-first run burned a long loop, so browser tests should be deferred via `CLAUDE.md`.
- v1.3.0 switched its `codebase-design` reference to an explicit Skill-tool call and renamed `CONTEXT.md` to `GLOSSARY.md`.
- No eval data is published.

## Open questions

- Our delta: none yet.
- The only tests this repo can run are over `scripts/`; the "no independent truth" gap applies to most of it.
