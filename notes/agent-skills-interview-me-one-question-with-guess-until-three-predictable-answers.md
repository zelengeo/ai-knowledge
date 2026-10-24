---
title: interview-me asks one question per turn with the agent's guess attached and a confidence number, stops when it can predict the user's answers to the next three questions, restates intent with an Out of scope line, requires an explicit yes, then ends the turn
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/interview-me/SKILL.md
  - https://github.com/mattpocock/skills/blob/main/skills/grilling/SKILL.md
tags: [agent-skills, requirements, grilling, interview, define, pocock]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

agent-skills' requirements interrogation is a cousin of [Pocock's grilling](pocock-skill-grilling.md) with three mechanical additions: every question carries the agent's own guess with reasoning, every turn carries a confidence percentage (with a reason whenever under about 70%), and the stop condition is a checkable test rather than a feeling: can I predict the user's reaction to the next three questions I would ask. The deliverable is a confirmed statement of intent, not a spec.

## When to use

- The ask lacks who, why, what success looks like, or the binding constraint; or the user says "interview me", "grill me", "are we sure".
- Not in CI, `/loop` or scheduled runs: the skill needs a live user and says to flag underspecification as a blocker there instead.
- Not when the user asked for speed over verification, or the task is mechanical.

## Procedure

1. Hypothesis in one sentence plus confidence 0 to 100%. Below about 70%, append what is missing.
2. One question, formatted `Q:` then `GUESS:` with the reasoning. Wait. Three or more questions in one message is a red flag.
3. Listen for "should want" answers: best-practice words (scalable, clean, modern), deference to convention, "I'm supposed to". Then ask: if you did not have to justify this to anyone, what would you actually want?
4. Restate in 5 to 8 lines the user can confirm line by line: Outcome, User, Why now, Success, Constraint, Out of scope. Out of scope is mandatory; half of misalignment is silent disagreement about non-goals.
5. Gate on an explicit yes. Not yes: "whatever you think is best" (delegation; re-ask with two concrete options), "sounds good", "sure, let's go", silence then "okay let's start" (the user gave up; ask what was missed).
6. On yes: deliver the statement, offer downstream paths (save to `docs/intent/<topic>.md`, `spec-driven-development`), and stop the turn without invoking tools. The intent file is saved only after confirmation.

Floor: after several rounds without rising confidence, stop and say something foundational is missing rather than grind.

Delta versus Pocock grilling: grilling walks the design tree and resolves dependencies in order, prefers reading the codebase over asking, and offers a recommended answer; interview-me adds the confidence number, the three-question predictability test, the "want versus should want" probe and the hard turn stop. Both are one question at a time. See also [grilling asks the whole frontier in rounds](aihero-grilling-asks-the-whole-frontier-in-rounds.md) for where the two differ on batching.

## Evidence

Read from the skill file. The 95% figure and the three-question test are the authors' rules; no study of interview outcomes is cited. The README says the skill is "gaining an opt-in collaborative mode", not yet in the file read.

## Open questions

- Whether attaching a guess increases sycophantic agreement; the skill names the risk and mitigates by guessing against expectation sometimes, without data.
