---
title: In one published same-model same-repo same-prompt run, agent-skills reached first code 4 minutes earlier than Superpowers, ran 7 validation passes to 5 including the full 446-test suite, which caught a compatibility bug outside the feature, and both finished in about 22 minutes with one replan each
type: comparison
status: inbox
evidence: T3
sources:
  - https://www.linkedin.com/pulse/superpowers-vs-agent-skills-faster-shipping-safer-reasoning-om-mishra-dzakf/
  - https://github.com/addyosmani/agent-skills/blob/main/docs/comparison.md
  - https://github.com/obra/superpowers
tags: [agent-skills, superpowers, comparison, claude-code, tdd, validation]
applies_to: [agent-skills@0.6.x, claude-code@2.x]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Om Mishra's write-up (2026-06-20) is the only head-to-head the agent-skills repo cites, and it is a single task, so the result is a lead, not a benchmark. The observed difference is where each framework spends its minutes: Superpowers front-loads architectural reasoning into one dense plan; agent-skills writes a spec and task list, starts coding sooner, and validates more broadly after.

## When to use

- Choosing between the two for a task where requirements and patterns already exist (the author's own conclusion favours agent-skills there) versus exploratory architecture (the author keeps Superpowers as daily driver).
- As a template for how to run your own comparison: identical worktrees, pinned model and reasoning level, the same prompt, metrics on behaviour rather than code quality.

## Facts

Setup as stated: Claude Code, Claude Sonnet 4.6, medium reasoning, all permissions granted, sub-agentic execution, independent worktrees, identical prompt, an existing production codebase. Skills loaded: Superpowers `brainstorming-plan`, `writing-plans`, `test-driven-development`, `verification-before-completion`; agent-skills `spec-driven-development`, `planning-and-task-breakdown`, `test-driven-development`, `incremental-implementation`, `/build`.

| Metric | Superpowers | agent-skills |
| --- | --- | --- |
| First code change | ~12 min | ~8 min |
| Total time | ~22 min | ~22 min |
| Validation passes | 5, feature-scoped | 7, including full 446-test suite |
| Tests added | 7 | 8 |
| Replans | 1 | 1 |
| Context re-reads | 0 | 0 |

Both hit the same fixture defect (a missing `session_started` event). agent-skills' full-suite run then exposed a `MagicMock` compatibility issue in a context builder outside the feature, fixed it following existing defensive patterns, and added the eighth test for that fallback. Token efficiency was reported as effectively identical.

Comments on the post raise the obvious limits: run-to-run variance at n=1 was not measured, and medium reasoning effort may have shortened Superpowers' normally separate spec and plan into one file.

## Evidence

T3: a practitioner's write-up with setup and numbers, but the repository, prompt and raw traces are not published, so it cannot be reproduced. The agent-skills comparison doc summarises it fairly and labels it one developer's single-task experiment. Read through the LinkedIn public page; a login wall truncated comments.

## Open questions

- Repeating the run five times per framework would answer whether the 4-minute and 2-pass gaps exceed noise.
- Neither run included the Pocock skills; the commenter exploring them had no results yet.
