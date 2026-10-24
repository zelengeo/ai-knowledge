---
title: code-review-and-quality reviews on five axes with Google's approval standard (merge when it definitely improves code health), sizes changes at about 100 lines, labels findings Critical / unprefixed Required / Nit / Optional / FYI, and tests the tests by inverting one condition and running the suite
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/code-review-and-quality/SKILL.md
  - https://google.github.io/eng-practices/review/reviewer/standard.html
tags: [agent-skills, code-review, google, mutation-testing, change-sizing]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The skill is a compact restatement of Google's reviewer guide with three agent-specific additions: a hand mutation step to check that tests would catch a regression, a rule that AI-generated code needs more scrutiny not less, and a dependency-upgrade discipline (one package per change, read the changelog, review the lockfile diff).

## When to use

- Before any merge, including your own agent's output and a bug fix (review the fix and the regression test).
- Pair with [Pocock code-review](pocock-skill-code-review.md), which splits standards and spec into separate subagents, where this skill is a single-reviewer checklist.

## Procedure

Axes: correctness, readability and simplicity, architecture, security, performance. Readability and architecture carry the sharpest questions: could this be 100 lines instead of 1000; does the refactor reduce the number of concepts a reader holds or merely relocate them; is a new conditional bolted onto an unrelated flow (design smell, not a nit); is feature logic leaking into a shared module; are type boundaries explicit rather than papered over with `any` or silent fallbacks.

Sizing: about 100 changed lines good, about 300 acceptable for one logical change, about 1000 split. Watch total file size too: a file around 1000 lines is an inspection signal; decompose before adding. Splitting strategies: stack, by file group, horizontal (shared code first), vertical (full-stack slices). Separate refactoring from feature work. Large deletions and automated refactors are the exceptions.

Process: understand intent; review tests first; then for the last test question ("would these tests catch a regression") answer by experiment: invert one condition the change adds, run the suite, restore the file. A mutation that stays green is a finding, naming the missing test case. Then walk the implementation per axis; label every comment; verify the author's verification story.

Labels: no prefix means required; `Critical:` blocks (security, data loss, broken function); `Nit:` optional style; `Optional:` or `Consider:` suggestion; `FYI` informational. Order by leverage: one structural problem and ten nits means the structural problem is the review.

Approval standard, confirmed against the Google source: favour approving once the change definitely improves the overall code health of the system, even if it is not perfect; nothing justifies checking in a change that definitely worsens it. Disagreements: technical facts and data over opinion, the style guide is absolute on style, consistency acceptable if it does not degrade health. Do not accept "I'll clean it up later"; require cleanup before submission or a filed, self-assigned bug. Respond within one business day at most.

Dead code: list orphaned elements and ask before deleting. Dependencies: existing stack first; for upgrades, one dependency per change, changelog not version number, green suite before and after, lockfile diff reviewed and never hand-edited.

## Evidence

Read from the skill. The approval standard and the review-speed norm are traced to Google's engineering practices (primary, read directly). The ~100-line sizing is attributed to Google culture by the README and matches the "small CLs" guidance but no measurement is cited in the skill. The hand-mutation step is the authors' addition; [pstack interrogate](pstack-interrogate-multi-model-adversarial-review-signal-from-model-diversity.md) and [code-review runs standards and spec axes](aihero-code-review-runs-standards-and-spec-axes-in-separate-subagents.md) do not include it.

## Open questions

- The multi-model review section ("Model A writes, Model B reviews, human decides") is two sentences with no procedure; the real version is in [doubt-driven-development](agent-skills-doubt-driven-fresh-reviewer-gets-artifact-and-contract-not-the-claim.md).
