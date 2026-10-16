---
title: writing-for-agents prunes any agent-read document by the no-op test and leading words; it fires on skill, AGENTS.md and CLAUDE.md edits and earns most on existing drafts
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md
  - https://aihero.dev/skills-writing-for-agents
tags: [pocock-skills, productivity, writing, skills-authoring, context-engineering]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`writing-for-agents` is the reference for any text an agent reads: skills, `AGENTS.md` / `CLAUDE.md`, specs, tickets, runtime prompts. Its levers are context pointers, information hierarchy with progressive disclosure, completion criteria, leading words, and pruning (single source of truth, relevance, the no-op test). The skill-only mechanics live in `SKILL-MECHANICS.md`.

## When to use

- Creating or editing a skill, or modifying `AGENTS.md` / `CLAUDE.md` (automatic trigger). By hand for specs, tickets, docs and AFK prompts: the test is "does an agent read this".
- Not for discovering what a codebase contains (`grill-with-docs`); this governs how a document reads.

## Procedure

1. Model-invoked; also `/writing-for-agents`. This repo's `AGENTS.md` rule 8 requires it for edits under `skills/` and to `AGENTS.md` itself.
2. Two budgets: context load (always-loaded material) and cognitive load (the human as index). Most split/inline/point decisions are that trade.
3. No-op test per sentence: delete it and ask whether behaviour changes; if not, delete the whole sentence. Cache only what the agent cannot find by looking (unwritten conventions, reasons, gotchas); leave one-command lookups to the environment.
4. Done when it works and no duplication, sediment or no-ops remain; there is no automated eval.

## Evidence

- Upstream claims: the default agent move when asked to write instructions is explaining what the model already knows; a document gets shorter as it gets better.
- Demonstrated: the 1.2.0 rename from `writing-great-skills` tracked practitioners already applying it beyond skills; the 1.1.0 changeset added the negation (elephant) and negative-space (void) failure modes. "Streamline" requests cut functionality because agents optimise for visible length. Model-invocation on Codex broke in 1.2.0 and was restored in 1.2.2.
- No eval data is published; the check is a manual run.

## Open questions

- Our delta: this repo already binds the skill via `AGENTS.md`. Whether the notes under `notes/` count as agent-read documents for the trigger is undecided; they are written for an agent reader by rule 8.
