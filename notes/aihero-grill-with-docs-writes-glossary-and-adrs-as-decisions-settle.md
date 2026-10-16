---
title: grill-with-docs writes GLOSSARY.md term by term during the interview and an ADR only when a decision passes three gates; everything else survives only in the conversation
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/grill-with-docs
  - https://www.aihero.dev/skills-grilling
  - https://github.com/mattpocock/skills
tags: [aihero, pocock-skills, grilling, domain-modeling, planning]
applies_to: [mattpocock-skills@1.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/grill-with-docs` is the stateful entry to the Pocock build chain: the `grilling` interview pointed at a repo, with `domain-modeling` writing settled vocabulary to `GLOSSARY.md` the moment a term resolves and an ADR under `docs/adr/` only when a decision is hard to reverse, surprising without context, and a real trade-off. Most decisions meet none of those gates, so most of a session's output lives only in the context window. Per-skill detail belongs in [pocock-skill-grill-with-docs](pocock-skill-grill-with-docs.md).

## When to use

- Start of a change in a repo where the plan is fuzzy and the words are not settled. Single-session scope; `/wayfinder` for multi-session.
- A repo with no domain docs at all: invoke it aimed at the repo, not a change.
- Not when nothing is undecided: go to `/to-spec` or `/implement`.

## Procedure

1. Type `/grill-with-docs` (model never invokes it). Confirm `grilling` and `domain-modeling` are installed; its own `SKILL.md` is a one-line delegation and does nothing alone.
2. Answer rounds. Expect `GLOSSARY.md` to change during the session, not in one lump at the end. Few or zero ADRs is normal.
3. When the frontier empties, do not clear. Hand the same conversation to `/to-spec`, or `/implement` if it fits one window.
4. Re-read the spec against your own answers: later steps soften numeric defaults, ordering guarantees, and negative requirements into prose.

## Evidence

The vendor's docs page states the write-inline behaviour, the three ADR gates, and the "working if" signals. It also documents two open defects reported by users: the file-writing half silently skipping when the skill runs inside another orchestration layer, and the dependencies (`grilling`, `domain-modeling`) failing to load, which shows as every question at once with no recommendations. Vendor origin makes the skill-behaviour claims T1; the user reports inside it are T3. The page concedes the glossary's effect on agent output is disputed; the undisputed value is to the humans sharing the words.

## Open questions

- This repo keeps `CONTEXT.md`; upstream v1.3 renamed the target to `GLOSSARY.md`. Decide whether to rename or point the skill at `CONTEXT.md`.
- Does the inline-write behaviour hold under the plugin install (`mattpocock-skills:` prefix) as well as `npx skills add`?
