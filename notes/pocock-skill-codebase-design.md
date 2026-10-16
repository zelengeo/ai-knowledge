---
title: codebase-design is a vocabulary reference, not a process; load it under a driver skill or the agent improvises a refactor
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md
  - https://aihero.dev/skills-codebase-design
tags: [pocock-skills, engineering, architecture, vocabulary]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`codebase-design` defines seven terms (module, interface, depth, seam, adapter, leverage, locality) and four principles for deep modules. It produces no artifact and asks no questions; `tdd`, `improve-codebase-architecture` and `diagnosing-bugs` pull it in for the words.

## When to use

- You know which module you are redesigning and need to decide where the seam goes or how small the interface can get.
- An argument about what "module", "boundary" or "service" means needs settling.
- Not for choosing which module to redesign (`improve-codebase-architecture`), domain words (`domain-modeling`), or building a behaviour (`tdd`).

## Procedure

1. Model-invoked; also `/codebase-design`. It is read, not run.
2. Vocabulary with banned substitutes: module (not unit, component, service), interface (not API, signature), seam (not boundary). Depth is defined as leverage per unit of interface learned, not Ousterhout's line ratio.
3. Principles: depth is an interface property; the deletion test; the interface is the test surface; one adapter is a hypothetical seam, two make a real one.
4. On demand: `DEEPENING.md` classifies a candidate's dependencies by how they get tested across a seam; `DESIGN-IT-TWICE.md` spawns parallel sub-agents for three or more radically different interfaces.

## Evidence

- Upstream claims: consistent language is the whole point; the glossary stays small on purpose.
- Demonstrated: issue #449 records a session burning 100k tokens redesigning unasked-for code after being pointed at this skill alone, because a reference has no checkpoints. Issue #458 records that the skill says nothing about enforcing a deep module in TypeScript (answers given in the thread: class or IIFE, monorepo package, dependency-cruiser).
- No eval data is published.
- v1.2.3 dropped Claude Code tool names from the `DESIGN-IT-TWICE.md` dispatch; v1.3.0 renamed `CONTEXT.md` references to `GLOSSARY.md`.

## Open questions

- Our delta: none yet.
- Does the deletion test apply to a notes repo with no code modules, or is this skill irrelevant here?
