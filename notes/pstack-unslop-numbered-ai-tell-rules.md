---
title: unslop is a numbered list of AI-writing tells with stable rule ids (no dashes as separators, no mid-sentence colons, no inline-header lists, say what it does not how it feels) that other skills cite by number
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/unslop/SKILL.md
tags: [pstack, writing, prose, skills, writing-for-agents]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `unslop` is an edit pass over any text, including the agent's reply, against about 30 numbered patterns. The numbers are stable ids other skills cite ("unslop rule 14"), and a removed rule leaves a gap rather than renumbering. The mode skill requires the reply to be written clean as drafted, on the ground that a cleanup pass after drafting does not remove the patterns.

## When to use

- Editing anything under `skills/` or an AGENTS.md; pairs with [writing-for-agents](pocock-skill-writing-for-agents.md), which covers structure where unslop covers sentence-level tells.
- Enforcing this repo's no-em-dash rule: unslop rule 13 is the same rule, extended to en dashes and hyphen-as-dash.

## Facts

Rules worth having by number:

- 7: AI vocabulary (delve, crucial, pivotal, landscape, tapestry, underscore, vibrant). Plain words.
- 9: "Not just X, but Y." State the point.
- 10: Rule of three. Use the natural number.
- 13: No em dashes, en dashes, parentheses or hyphen-as-dash. End the sentence or use a comma.
- 14: No colon as a mid-sentence connector. A colon before a list is fine.
- 16: Inline-header lists where a bold label restates the line. A bold lead-in ending in a period followed by new detail is fine.
- 20, 22: Chatbot phrases and sycophancy.
- 26: Abstract metaphor nouns (substrate, vector, nexus, primitive as a noun, harness as a metaphor, north star, flywheel). Pick the concrete word.
- 27: Say what it does, not how it feels. If a sentence could appear unchanged in another project's docs, cut it.
- 29, 30, 31: Active voice; cut adverbs or use the number; plain word over utilize, leverage, facilitate.
- 32: Mannered prose (aphorisms, personified code, figurative verbs).
- 33: Over-compression (dropped articles, arrows, symbol-speak). Write whole sentences.

Gaps in the numbering (1, 2, 4, 6, 21) are removed rules kept as gaps.

## Evidence

Read from the skill file. The list is the author's taxonomy; no detector accuracy or reader study is cited. The claim that a post-hoc cleanup pass does not remove the patterns is stated in the mode skill without data.

## Open questions

- Rule 33 pulls against this repo's own front-loaded style for agent readers; the two agree on whole sentences but differ on how terse a skill may be.
