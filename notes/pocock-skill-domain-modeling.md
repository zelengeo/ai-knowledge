---
title: domain-modeling writes a resolved term into CONTEXT.md the moment it resolves; it fails when the glossary turns into a spec
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md
  - https://aihero.dev/skills-domain-modeling
tags: [pocock-skills, engineering, domain-modeling, adr]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`domain-modeling` is the active discipline behind a project's ubiquitous language: it challenges a term that conflicts with the glossary, forces a precise word, cross-references what you say against the code, and writes the result inline into `CONTEXT.md`. A decision that is hard to reverse, surprising without context, and a real trade-off becomes an ADR in `docs/adr/`.

## When to use

- Two people mean different things by one word, or one word is doing three jobs across files.
- You just made a hard-to-reverse architectural choice and want it recorded.
- Not for module shape (`codebase-design`). Not for looking a term up: read `CONTEXT.md`.

## Procedure

1. Model-invoked; also `/domain-modeling`. `grill-with-docs`, `wayfinder`, `triage` and `improve-codebase-architecture` call it underneath.
2. Glossary: `CONTEXT.md` at root, or the per-context file a `CONTEXT-MAP.md` points at. Entries say what a thing is in one or two sentences, with rejected synonyms under `_Avoid_`. Created lazily by the first term. Format in `CONTEXT-FORMAT.md`.
3. ADR: offered, never assumed; must pass all three tests. Format in `ADR-FORMAT.md`.
4. Cross-referencing covers code and committed docs only, not the issue tracker.

## Evidence

- Upstream claims: inline writing is the session's real output; batched glossaries are summaries.
- Demonstrated: the most-reported problem across models is `CONTEXT.md` absorbing implementation detail and growing to thousands of lines; the documented fix is `/grill-with-docs make my CONTEXT.md more concise`. Models frequently load `grilling` and skip this skill, leaving `CONTEXT.md` untouched. Issue #717 (tracker not cross-referenced) and #557 (split glossary from ADR format) are open.
- v1.3.0 renamed the convention to `GLOSSARY.md` / `GLOSSARY-MAP.md` and widened the trigger to "discussing codebase terminology". The aihero page already uses the new name; the local 1.2.3 plugin still reads `CONTEXT.md`.
- No eval data is published.

## Open questions

- Our delta: none yet. This repo keeps `CONTEXT.md` per `docs/agents/domain.md`; adopting the 1.3.0 `GLOSSARY.md` name is a human decision when the plugin updates.
