---
title: The Pocock /code-review skill reviews a committed diff on two axes (repo standards, originating spec) in separate subagents and refuses to blend them into one verdict
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills-code-review
  - https://github.com/mattpocock/skills
tags: [aihero, pocock-skills, code-review, quality]
applies_to: [mattpocock-skills@1.3, claude-code@2.x]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/code-review <fixed-point>` diffs `<fixed-point>...HEAD` and runs two subagents that never see each other: Standards (does the code follow this repo's documented conventions, with a twelve-smell Fowler baseline underneath) and Spec (does it do what the issue or spec asked). Every finding must cite a rule, a smell plus hunk, or a spec line. The report ends with a worst issue per axis and no overall winner, so a passing axis cannot hide a failing one. Per-skill detail belongs in [pocock-skill-code-review](pocock-skill-code-review.md).

## When to use

- A diff exists and you want both "built right" and "the right thing". For bug hunting (nulls, races, off-by-one) use Claude Code's built-in review instead; the two share a name.
- Per ticket (what `/implement` does) or once at the branch point; if unsure, both.

## Procedure

1. Commit first. The three-dot diff excludes staged and working-tree changes, so uncommitted work is invisible to it.
2. Supply the fixed point (`main`, a tag, `HEAD~5`). The skill checks the ref resolves and the diff is non-empty before spawning anything.
3. Prefer a fresh session over the one that wrote the code; the authoring session reviews with its own assumptions in context.
4. Make the spec findable: issue references in commit messages, a path argument, or a file under `docs/`, `specs/`, `.scratch/`. With no spec it reports "no spec available" rather than inventing requirements.
5. Read the citation on each finding before acting; subagent output is a hypothesis.
6. Act on cited findings, then stop. Repeated runs always find new judgement-call items; there is no convergence.
7. If running unattended, watch the agent count; subagents have been seen re-invoking `/code-review` and fanning out past fifty agents. Fork users append "do not invoke /code-review or spawn additional agents" to both briefs.

## Evidence

Vendor docs page. The design (two isolated axes, mandatory citations, per-axis worst issue) is stated as the skill's contract. Three open problems are documented from user reports without method: the name clash with Claude Code's built-in `/code-review` (which one wins depends on plugin versus plain install), the recursive fan-out, and non-convergence across runs. One user quoted on the page: "Same context reviewing itself isn't review, it's confirmation bias with a slash command."

## Open questions

- This repo installs the plugin, so the skill is `mattpocock-skills:code-review`; confirm which review the bare `/code-review` resolves to here.
- The Standards axis reads `CODING_STANDARDS.md` or `CONTRIBUTING.md`; this repo has neither. Does `AGENTS.md` rule 9 (no em-dashes) get checked, or only the smell baseline?
