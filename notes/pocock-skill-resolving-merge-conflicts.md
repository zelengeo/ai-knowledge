---
title: resolving-merge-conflicts resolves hunks by traced intent and runs the repo's checks before committing; removed upstream in v1.3.0 as no longer needed
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/v1.2.3/skills/engineering/resolving-merge-conflicts/SKILL.md
  - https://aihero.dev/skills-resolving-merge-conflicts
tags: [pocock-skills, engineering, git, merge-conflicts]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`resolving-merge-conflicts` is a five-step loop for an in-progress merge or rebase: see the state, find each side's primary source (commit, PR, issue), resolve each hunk preserving both intents, run the project's automated checks, finish the operation. It never runs `--abort`. The skill shipped in 1.2.3 and was removed in 1.3.0; the aihero page is marked archived.

## When to use

- Git has stopped on conflict markers and the merge is going to happen.
- Not after the merge finished and something misbehaves (`diagnosing-bugs`). Not for planning how to slice work to avoid conflicts.
- On 1.3.x there is no skill: the upstream position is the agent does this unprompted.

## Procedure

1. Model-invoked on 1.2.3; also `/resolving-merge-conflicts`.
2. Read history before touching a hunk; quote the commit messages, PRs or issues that explain each side.
3. Each hunk ends with both behaviours or an explicit note of what was dropped and why. Nothing appears that was on neither branch.
4. Typecheck, tests, format run green before the commit; a multi-commit rebase is continued to the end.

## Evidence

- Upstream claims (1.2.3 docs): the value is the two steps an unprompted agent skips, reading why each side exists and running checks afterwards; a thin margin over a good model, predicted to become a no-op.
- Demonstrated: the 1.3.0 changeset acted on that prediction and deleted the skill with nothing replacing it. The docs page also records a parallel-worktree report: the session that wrote a change should merge it back, because batching conflicts onto one agent discards the intent step 2 has to reconstruct.
- No eval data is published.

## Open questions

- Our delta: none yet. The GitHub source is pinned to the `v1.2.3` tag because the file no longer exists on `main`.
- Does this repo's worktree-per-agent setup make the "author merges their own change" rule worth writing into `AGENTS.md`?
