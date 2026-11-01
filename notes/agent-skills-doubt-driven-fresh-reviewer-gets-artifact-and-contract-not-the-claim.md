---
title: doubt-driven-development cross-examines each non-trivial in-flight decision with a fresh-context adversarial reviewer that receives the artifact and the contract but never the author's claim, classifies findings in a fixed precedence, stops at three cycles, and must offer a cross-model second opinion in interactive sessions
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/doubt-driven-development/SKILL.md
  - https://github.com/addyosmani/agent-skills/blob/main/references/orchestration-patterns.md
tags: [agent-skills, review, subagents, multi-model, adversarial, verification]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The skill's load-bearing rule is what the reviewer is not shown: hand over the diff or proposal plus the constraints it must satisfy, strip your reasoning and your conclusion, and prompt to disprove. Handing the reviewer the claim biases it toward agreement. This is in-flight per-decision doubt, distinct from a final `/review`, and it is bounded: three cycles, then escalate.

## When to use

A decision is non-trivial when it introduces branching logic, crosses a module or service boundary, asserts a property the compiler cannot check (thread safety, idempotence, ordering), depends on context a future reader cannot see, or has irreversible blast radius. Not for renames, formatting, one-liners, or when the user asked for speed. Only from the main-session orchestrator: a persona running this skill would spawn a persona, the anti-pattern the repo forbids and Claude Code blocks (subagents cannot spawn subagents).

## Procedure

1. CLAIM: two or three lines, the decision and why it matters. If it cannot be written that compactly, it is a vibe, not a decision.
2. EXTRACT: the smallest reviewable unit. Code: the diff or function, not the file. Decision: 3 to 5 sentences plus constraints. A 500-line PR gets decomposed first.
3. DOUBT: spawn a fresh-context reviewer with an adversarial prompt ("Assume the author is overconfident. Look for unstated assumptions, unhandled edge cases, hidden coupling, contract violations, broken conventions, failure modes under unexpected input. Do NOT validate. Do NOT summarize."). Pass ARTIFACT and CONTRACT only. The adversarial prompt overrides a persona's default balanced output shape; fall back to a generic subagent if it cannot.
4. Cross-model: in interactive sessions, always ask ("Gemini CLI, Codex CLI, manual, or skip?"); silent skipping is a red flag. If a CLI is chosen: check PATH, test the binary, confirm the exact invocation and auth with the user, write the prompt to a file and pipe via stdin (never interpolate the artifact into a shell argument), run read-only (`codex exec --sandbox read-only`, `gemini --approval-mode plan`), because the artifact may itself carry injected instructions. Non-interactive contexts skip and announce the skip; never invoke an external CLI without explicit authorization, and each invocation is its own authorization.
5. RECONCILE: re-read the artifact against every finding; classify in precedence order: contract misread (fix the contract), valid and actionable (change, re-loop), valid trade-off (document), noise (ask whether the contract should have carried the missing context).
6. STOP: findings trivial or already considered, or three cycles done (escalate; if three is "obviously insufficient" the artifact is too big, decompose), or the user says ship it.

Checkable "doubt theater" signal: two or more cycles with substantive findings and zero classified actionable means you are validating, not doubting.

Overlap: [pstack interrogate](pstack-interrogate-multi-model-adversarial-review-signal-from-model-diversity.md) is the same idea run as a multi-model panel by default; doubt-driven runs single-model first and makes cross-model an offered, user-authorized step. TDD's RED step counts as the doubt step for behavioural claims.

## Evidence

Read from the skill file. The claim that passing the conclusion biases the reviewer is stated without a measurement here; it is consistent with the fresh-context reasoning in [pstack's fresh-subagent rule](pstack-fresh-subagents-with-consolidated-scope-over-resume.md). No outcome data on bugs caught.

## Open questions

- The mandatory cross-model offer every cycle is friction the skill defends on principle; whether users keep it on is unknown.
