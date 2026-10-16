# Note schema

Every file under `notes/` starts with this frontmatter. The daily job and the validation layer read it. A note missing a required field fails PR review.

```yaml
---
title: Short, specific, searchable
type: technique | tool | concept | comparison
status: inbox | tried | adopted | deprecated
evidence: T1 | T2 | T3 | T4          # tier of the best source cited, see docs/rubric.md
sources:
  - https://...                       # primary source first
tags: [claude-code, testing]
applies_to: [claude-code@2.x]         # tools or models the claim is bound to; empty when general
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent | human
---
```

## Status transitions

- `inbox`: agent-proposed, no human action yet. The only status an agent may create.
- `tried`: a human used it at least once. Human-only transition.
- `adopted`: in regular use. Candidate for a skill when it has steps. Human-only.
- `deprecated`: superseded or disproven. An agent may propose it with a reason in the body; the human confirms by merging.

## Body

Lead with the claim in one or two sentences. Then, as headings: **When to use**, **Procedure** or **Facts**, **Evidence** (what the sources actually show, not what they say), **Open questions**. Write for an agent reader: front-loaded, no narrative, no hedging filler.

A note is a claim with evidence. Opinion without a procedure or a measurable fact is dropped at triage, not written down.

## File naming

`notes/<kebab-slug>.md`, slug from the claim, not the source. One claim per note. A source that yields three claims yields three notes, or one note updated three times if it is the same claim.
