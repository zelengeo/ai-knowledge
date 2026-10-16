---
title: improve-codebase-architecture surveys recently changed code for deepening candidates and changes nothing; run it between features, then take one candidate into the main flow
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md
  - https://aihero.dev/skills-improve-codebase-architecture
tags: [pocock-skills, engineering, architecture, maintenance]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/improve-codebase-architecture` scans for shallow modules that could become deep ones, writes them as an HTML report in the OS temp directory with a strength badge per card, then grills you through the one you pick. The run produces a decision and a report, never a diff.

## When to use

- Routine upkeep between features; before a big build, pointed at the spec ("how can we make this change easy?"); a brownfield audit; finding seams before writing tests against legacy code.
- Not for designing one chosen module (`codebase-design`), an effort too big for a session (`wayfinder`), or a known defect (`diagnosing-bugs`).

## Procedure

1. User-invoked (`disable-model-invocation: true`). Name a direction, or it reads the last ~20 commits and biases toward active paths (the YAGNI filter added in 1.2.0).
2. Every candidate must pass the deletion test; cards state files, friction, a plain-English fix, payoff as locality or leverage, before/after diagram, badge (`Strong`, `Worth exploring`, `Speculative`).
3. It stops after the report and asks which candidate to explore. Picking one starts a `grilling` session with `domain-modeling` underneath; rejected candidates can be recorded as ADRs so they are not re-suggested.
4. Take the decision into `/grill-with-docs` or `/to-spec`; one candidate per session.

## Evidence

- Upstream claims: candidates in dormant code are refactors you never cash in, hence the commit-history bias.
- Demonstrated: loudest complaint is the grilling loop firing on the first idea instead of after the report (no documented no-grill mode; "don't grill me, just show the report" works); the report loads Tailwind and Mermaid from CDNs and renders unstyled offline or behind SRI hooks; the framing pushes toward findings, so an all-`Speculative` report is how it says the codebase is fine; an eight-year legacy codebase sent the model in circles.
- v1.2.3 dropped Claude Code tool names from the exploration step; v1.3.0 renamed `CONTEXT.md` to `GLOSSARY.md`.
- No eval data is published.

## Open questions

- Our delta: none yet.
- This repo has `scripts/` as its only code; is there enough surface for the skill to find anything?
