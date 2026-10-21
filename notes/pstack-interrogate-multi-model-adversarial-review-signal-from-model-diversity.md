---
title: Adversarial code review with one read-only reviewer per model family, a shared rubric, and a lead who buckets findings into act-on, consider, noted, dismissed; signal comes from model diversity, not personas
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/interrogate/SKILL.md
tags: [pstack, code-review, multi-model, subagents, verification]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `interrogate` spawns one reviewer per configured model (defaults: `claude-opus-5-5-xhigh` and `grok-4.7-xhigh-fast`), each read-only, each given the same intent paragraph, diff, rubric and code-quality lens, then has the parent act as lead reviewer and sort every finding into four buckets. The skill states that the adversarial signal comes from using different models, not from assigning personas, and that findings two or more models raised independently are the highest signal. Nothing is auto-applied.

## When to use

- A diff you want broken before shipping, especially a contested design.
- As a comparison point for [the Pocock code-review skill](pocock-skill-code-review.md), which splits by axis (standards, spec) rather than by model.

## Procedure

1. Scope: the files or diff the user points at, else `git diff main...HEAD`.
2. Write the intent in one paragraph from the message, commits and PR description. Ask if unsure.
3. Spawn all reviewers in one message, one per entry on the `interrogate reviewers` line of the model config (see [per-role model config](pstack-per-role-model-config-rule-with-inherit-parent.md)). Each is `readonly`, labelled Reviewer A, B, and gets the same template (`references/reviewer-prompt.md`), rubric (`references/rubric.md`) and code-quality lens.
4. Synthesize: merge findings that describe the same issue, record which models raised each, note explicit disagreements.
5. Lead judgment: act on (would block a real PR), consider (legitimate, cost unclear), noted (valid, not actionable now), dismissed (wrong or nitpick, with reason).
6. Output sections: Intent, Reviewers (model and finding count each), the four buckets, Agreement Map.

In Claude Code the second reviewer runs on the session model unless a Claude model is configured, so the panel is single-family by default.

## Evidence

Procedure read from the skill file. The claim that cross-model agreement is "highest signal" is the author's rule, not a measured result; the repo publishes no precision or recall data for the panel. The "no personas" choice is stated as a design decision without a comparison.

## Open questions

- Whether a two-model panel beats one model run twice with different seeds. The `arena` skill allows the same model N times "when the work is generation-bound", implying the author thinks diversity matters more for judgment than for generation.
