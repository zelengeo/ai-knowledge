---
title: The grilling primitive asks the whole frontier per round, researches facts with subagents, and waits on decisions; one CLAUDE.md line reverts it to one question at a time
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills-grilling
  - https://www.aihero.dev/skills-grill-me
  - https://github.com/mattpocock/skills
tags: [aihero, pocock-skills, grilling, planning]
applies_to: [mattpocock-skills@1.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`grilling` models a plan as a design tree and asks, each round, every decision whose prerequisites are settled (the frontier), with a recommended answer on its own line so a round can be answered by number. Facts the environment can settle go to a subagent instead of the human; decisions wait for the human. The session ends on an empty frontier plus an explicit confirmation of shared understanding. The vendor's rough figure: thirteen questions in about three rounds. Per-skill detail belongs in [pocock-skill-grilling](pocock-skill-grilling.md).

## When to use

- Any skill of your own that needs an interview: invoke `/grilling` rather than writing another one.
- `/grill-me` (no repo, no files) and `/grill-with-docs` (repo, writes files) are its two user-invoked front doors; `wayfinder`, `triage`, and `improve-codebase-architecture` call it internally.

## Procedure

1. Answer a round by number: "1 yes, 2 second option, 3 no, because...". When the recommendation argues against the question's wording, answer the recommendation and say so.
2. If two questions in one round turn out to depend on each other, say so; the agent reopens that branch next round. The frontier is chosen by judgement, not computed.
3. If the agent answers its own decision questions, that is a broken run: stop it. This happens most when another skill runs grilling to resolve a ticket.
4. On weaker or low-effort models, add "do not implement without permission" to `AGENTS.md`, because they skip the confirmation gate.
5. To revert to sequential questions, add `When grilling, ask one question at a time.` to global `CLAUDE.md`. Supported, not a workaround.

## Evidence

The vendor's docs page describes the mechanism and its one structural limit (judgement-chosen frontier). Numbers (thirteen questions, three rounds; forty-six questions over four rounds on `grill-me`) are the author's own examples, not measurements. The "no cap on questions" stance is stated as a design decision. User-reported failures (gate skipped on cheaper models, dependency skills not loading) are relayed on the page without method, so T3 inside a T1 page.

## Open questions

- Does the round format survive in harnesses other than Claude Code, where skill loading differs?
- Measure rounds versus questions on a real plan here before trusting the three-round figure.
