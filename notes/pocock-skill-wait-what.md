---
title: wait-what re-pitches the last message with the missing context in Simplified Technical English and CONTEXT.md vocabulary; it repairs one message, grill-with-docs prevents the next
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/wait-what/SKILL.md
  - https://aihero.dev/skills-wait-what
tags: [pocock-skills, productivity, communication, leading-words]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/wait-what` is a three-line skill. Typing it tells the agent comprehension failed here; it re-pitches what it just said with a little context, in ASD-STE100 Simplified Technical English, using the ubiquitous language from `CONTEXT.md` (following `CONTEXT-MAP.md` when there is more than one).

## When to use

- The moment you notice you are skimming: invented jargon, stacked acronyms, a decision whose premise you never saw. Works inside any other skill.
- Not as a standing concision setting; it fixes the conversation you are in. The upfront cure is a shared glossary from `grill-with-docs`.

## Procedure

1. User-invoked (`disable-model-invocation: true`); only you know when you stopped following.
2. The agent decides how far back to go ("re-pitch that", not "the last message").
3. Works without a `CONTEXT.md`; you lose only the domain-vocabulary half.
4. Working if the re-pitch is shorter and clearer, adds the missing premise, uses project nouns, and does not degrade into terseness on repeat.

## Evidence

- Upstream claims (1.2.0 changeset): naming the listener's state ("wait") beats naming the output (`/tldr`, `/no-fluff`), which makes the model clip words and lose you further; concision skills fail by growing, so this one is a single leading word.
- Demonstrated: the mechanism is argued, not measured. No comparison against output-named correctives is published.
- 1.3.0 quoted the description (the unquoted colon made the YAML invalid on skills.sh), renamed `CONTEXT.md` to `GLOSSARY.md`, and taught it to follow `GLOSSARY-MAP.md`.

## Open questions

- Our delta: none yet.
- This repo's `AGENTS.md` rule 8 ("write for an agent reader") and the no-em-dash rule overlap with the STE register; is a `wait-what` equivalent useful for notes an agent finds unclear?
