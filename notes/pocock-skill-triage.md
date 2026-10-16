---
title: triage moves issues you did not create through one category and one state role to an agent brief; never run it over tickets you generated
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/triage/SKILL.md
  - https://aihero.dev/skills-triage
tags: [pocock-skills, engineering, triage, issue-tracker]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/triage` works incoming issues and external PRs through a state machine: two categories (`bug`, `enhancement`) and five states (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), exactly one of each per item. It verifies the claim, checks for redundancy and prior rejection, recommends with reasoning, and applies nothing until you say so.

## When to use

- A tracker with raw reports from other people; open-source repos are the main case.
- Not for `to-tickets` output (already `ready-for-agent`), not for a root cause (`diagnosing-bugs`), not for your own rough idea (`grill-with-docs`).

## Procedure

1. User-invoked (`disable-model-invocation: true`). Type `/triage` plus plain language: "show me what needs attention", "let's look at #42".
2. Verify before brief: reproduce the bug or check out and test the PR; report confirmed, failed, or not enough detail (the strongest `needs-info` signal).
3. Vague requests get a `grilling` round with `domain-modeling` underneath. The artifact is the agent brief (`AGENT-BRIEF.md`): types, signatures, behavioural contracts, never file paths or line numbers.
4. `wontfix` on a rejected enhancement writes one file per concept to `.out-of-scope/` (`OUT-OF-SCOPE.md`), read before every evaluation so old rejections resurface instead of being re-litigated. Every posted comment opens with an AI-generated disclaimer.

## Evidence

- Upstream claims: the single-state invariant keeps tracker queries simple; durable briefs survive weeks in the queue.
- Demonstrated: labels do not exist on a fresh repo and `gh` fails (issue #616); the external-PR listing uses an `authorAssociation` field `gh` does not expose (#468); bulk passes fall back to a cheap listing that skips comments and re-briefed three already-fixed issues; a blocked or deferred state is the most-filed gap (#139, #297) and has not shipped. Neither this skill nor `diagnosing-bugs` mentions the other despite overlapping phases.
- 1.3.0 switched its sub-skill calls to explicit Skill-tool calls and renamed `CONTEXT.md` to `GLOSSARY.md`.
- No eval data is published.

## Open questions

- Our delta: this repo already uses the five canonical labels (`docs/agents/triage-labels.md`), so the mapping is an identity table. Whether the labels exist on GitHub for `zelengeo/ai-knowledge` is unverified.
