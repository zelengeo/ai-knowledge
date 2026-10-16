---
title: to-tickets slices a spec into tracer-bullet tickets with blocking edges and quizzes you before publishing; skip it when the change fits one context window
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md
  - https://aihero.dev/skills-to-tickets
tags: [pocock-skills, engineering, tickets, planning]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/to-tickets` breaks a spec, plan or the current conversation into tickets, each a vertical slice through every layer that can be demoed alone and fits one fresh context window, each declaring the tickets that block it. On a real tracker the edges are native blocking links and sub-issues; locally they are one file per ticket under `.scratch/<feature>/issues/<NN>-<slug>.md`.

## When to use

- A spec issue exists and the build spans sessions: `/to-tickets #<spec>`.
- The plan is only in the thread: `/to-tickets` reads it directly.
- Not when the whole change fits one window (`implement`). Never run `triage` over its output; the tickets are agent-ready by construction.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Requires a tracker from `setup-matt-pocock-skills`.
2. It looks for prefactoring ("make the change easy") and orders it first, then presents a numbered list with a `Blocked by` line per ticket and quizzes you: granularity, real edges, merge or split. Nothing publishes until you approve.
3. Wide refactors (one mechanical change with a codebase-wide blast radius) are sequenced as expand, migrate in batches, contract.
4. Dispatch is yours: count tickets with no open blockers, open that many `/implement` sessions, clear between them, close tickets by hand.

## Evidence

- Upstream claims: a 26-ticket stack sliced by layer produced ~20 agent runs per closed ticket, three quarters rework, traced to horizontal slicing (post-mortem cited on the docs page).
- Demonstrated gaps: over-decomposition is the most-reported friction; layer-per-ticket output still happens (catch it at the quiz with "what can I demo"); GitHub sub-issues and native blocking links are often not created (issues #554, #513) despite `gh issue create --parent` and `--blocked-by` existing; acceptance criteria can be true at the base commit.
- 1.2.0 fixed local mode from a single `tickets.md` to one file per ticket; 1.3.0 reworded the setup precondition.
- No eval data is published.

## Open questions

- Our delta: this repo's issue tracker is GitHub via `gh` (`docs/agents/issue-tracker.md`); whether sub-issue linking works here is untested.
