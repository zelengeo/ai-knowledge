---
title: implement builds one already-decided ticket per fresh session and commits to the current branch; it does not close the ticket or open a PR
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md
  - https://aihero.dev/skills-implement
tags: [pocock-skills, engineering, implementation, tdd]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/implement` turns a settled ticket, spec, or in-thread plan into a commit without reopening the plan: it drives `tdd` at pre-agreed seams, typechecks as it goes, runs the full suite once, runs `code-review`, and commits to the branch you are on. The skill body is 15 lines.

## When to use

- A ticket from `to-tickets` or `triage`: `/implement #42`, one ticket per session, clear between tickets.
- A small spec or a plan that lives only in the current conversation (say so when invoking; the skill text expects a file).
- Not decided yet: `grill-with-docs`. One behaviour test-first without a spec: `tdd`. Already built: `code-review`.

## Procedure

1. User-invoked (`disable-model-invocation: true`); no other skill can call it. Check you are on the right branch first; it does not create one.
2. Five beats: read the ticket and work out seams; red-green per seam via `tdd`; typecheck and single test files often; full suite once; `code-review` then commit.
3. Pass full issue references (`owner/repo#2` or a URL); a bare `#2` in a fresh session resolves against whatever list the agent can see.
4. Afterwards, close the ticket and reconcile acceptance criteria yourself.

## Evidence

- Upstream claims: a run never redesigns the work; tracer-bullet tickets make the previous ticket's context disposable.
- Demonstrated on the docs page: no completion step (ticket stays open on GitHub and local markdown); no batch or parallel mode, and parallel sessions in one checkout corrupted stash and commits in one field report; `code-review` runs before any commit so it reviews an empty diff unless an interim commit exists; 100k+ tokens per non-trivial ticket is normal. Nothing agrees seams inside `implement` itself; if the spec does not name them the run degrades to "just write the code".
- v1.3.0 added `implement-spec` as the parallel alternative (worktrees per ticket, one integration branch) and `pr` for the PR body.
- No eval data is published.

## Open questions

- Our delta: none yet. This repo's rule that knowledge changes only via PR conflicts with "commit to the current branch"; an invocation override ("commit to a branch and open a PR") is the documented workaround.
