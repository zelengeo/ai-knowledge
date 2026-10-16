---
title: to-questionnaire interviews you about the recipient and what you need back, not the subject, then drafts a flat questionnaire for one person
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/to-questionnaire/SKILL.md
  - https://aihero.dev/skills-to-questionnaire
tags: [pocock-skills, productivity, discovery, stakeholders]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/to-questionnaire` turns a decision blocked on knowledge in someone else's head into a Markdown discovery questionnaire. It asks two things (who it is going to, what you need back) and aims every question at the gap. Output lands at `to-questionnaire-<slug>.md` in the current directory; delivery is yours.

## When to use

- A grilling session stalls on questions that are not yours to answer: a client, a domain expert, an exec, a colleague on another team. Run it in the same conversation so the session is in context.
- Answers in your own head: `grill-me`. In the codebase: `grill-with-docs`. In nobody's head yet: `prototype`.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Two exchanges, then drafting; a question about the subject itself is the skill off the rails.
2. Document shape: purpose line naming the decision, short context for a recipient who was not there, questions most-important-first under themed headings, one idea per question with an answer stub, explicit permission to say "I don't know", a closing catch-all.
3. Not branching, not multi-recipient: three people means three runs.
4. Bring the answers back as input for the next grilling round, `grill-with-docs` or `to-spec`.

## Evidence

- Upstream claims (1.2.0 changeset): grilling the send rather than the subject is the defining move, because the subject is what you cannot answer.
- Demonstrated: there is no ingest phase, so a fresh session knows nothing of the grill that produced the questions; branching questionnaires were explored and dropped because a model planning several answers ahead plans badly; routing by recipient inside one document was requested and not shipped. No field measurements of answer quality are published.
- Graduated from `in-progress/` in 1.2.0; unchanged through 1.3.1.

## Open questions

- Our delta: none yet.
- Single-maintainer repo: the recipient here would most often be the human owner answering an agent's open questions. Is a questionnaire better than a `needs-info` label for that?
