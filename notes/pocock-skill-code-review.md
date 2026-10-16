---
title: code-review scores a committed diff on Standards and Spec in separate sub-agents; commit first and run it from a fresh session
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md
  - https://aihero.dev/skills-code-review
tags: [pocock-skills, engineering, code-review, testing]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/code-review` diffs `<fixed-point>...HEAD` and reviews it on two axes that are never merged: Standards (does it follow this repo's documented conventions, plus a Fowler smell baseline) and Spec (does it do what the originating issue or spec asked). Each axis runs in its own sub-agent and the report gives a worst issue per axis, never one verdict.

## When to use

- A diff exists and you want to know both whether it is built right and whether it is the right thing.
- Closing out a ticket: `/implement` calls it before committing.
- Not for bug hunting in the diff (null paths, races); that is a different review. Not for whole-codebase drift: use `improve-codebase-architecture`.

## Procedure

1. Model-invoked; also `/code-review <ref>`. You must supply the fixed point (commit, branch, tag, `main`). It fails fast on a bad ref or an empty diff.
2. Standards axis reads `CODING_STANDARDS.md`, `CONTRIBUTING.md` or similar; a documented repo rule overrides the baseline; linter-enforced rules are skipped; smells are judgement calls, never hard violations.
3. Spec axis finds the spec in order: issue refs in commit messages via `docs/agents/issue-tracker.md`, a path you pass, a file under `docs/`, `specs/` or `.scratch/`, then asks you. With no spec it reports "no spec available".
4. Every finding cites a rule or a smell plus the hunk, or a spec line.

## Evidence

- Upstream claims: separate axes stop a passing axis hiding a failing one; mandatory citations make findings checkable.
- Demonstrated rough edges on the docs page: name clash with Claude Code's built-in `/code-review`; sub-agents re-invoking the skill and fanning out (one report reached 50+ agents); the three-dot diff excludes uncommitted work, so `/implement`'s in-run review can see nothing; findings are aggregated, not re-verified; no convergence across repeated runs.
- No eval data is published.
- v1.2.3 removed Claude Code tool names from sub-agent dispatch so the step works on Codex; v1.3.0 reworded its setup precondition as an instruction to the human.

## Open questions

- Our delta: none yet.
- This repo has Claude Code's own `/code-review` alongside the plugin's; which one wins at the unqualified name here is unverified.
