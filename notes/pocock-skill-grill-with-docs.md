---
title: grill-with-docs resolves open decisions before implementation in a repo and leaves CONTEXT.md and ADRs behind; use grill-me when there is no codebase
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md
  - https://aihero.dev/skills-grill-with-docs
tags: [pocock-skills, engineering, grilling, domain-modeling, planning]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/grill-with-docs` is the head of the main flow: the `grilling` interview pointed at a codebase, with `domain-modeling` writing resolved terms into `CONTEXT.md` and qualifying decisions into `docs/adr/` as the session runs. Its own `SKILL.md` is one line that calls both skills.

## When to use

- Start of a change in a repo, plan still fuzzy, words not settled, and the whole thing fits one session.
- A repo with no domain docs at all: "help me document my repo".
- Not in a working directory: `grill-me`. Too big for one session: `wayfinder`. Answers live in someone else's head: `to-questionnaire`.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Type `/grill-with-docs` and state the idea. Leave plan mode off.
2. Rounds of questions per the `grilling` frontier rule; facts are looked up in the codebase, decisions are put to you.
3. Three outputs with different homes: a term goes to `CONTEXT.md` inline; a decision passing all three ADR gates goes to `docs/adr/`; everything else stays in the conversation only.
4. Do not clear afterwards. Hand the same conversation to `/to-spec` (multi-session build) or `/implement` (fits one window).

## Evidence

- Upstream claims: the paper trail makes it strictly better than `grill-me` whenever a repo exists; the glossary is the real product.
- Demonstrated: the most-reported problem is dependency loading. When `grilling` or `domain-modeling` fails to load you get a question dump with no recommendations or an interview with no files. Inside third-party orchestration wrappers the file-writing half is reported to silently not happen. Most decisions never earn an ADR, so precise answers can soften downstream; the mitigation is feeding the live session to `/to-spec`.
- v1.3.0 changed the body to "Call the Skill tool twice" to raise the load rate and renamed the glossary to `GLOSSARY.md`.
- No eval data is published.

## Open questions

- Our delta: none yet.
- Field reports put a brownfield scaffolding session at 50+ questions; is that acceptable for this repo's size?
