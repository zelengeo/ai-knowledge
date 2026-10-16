---
title: /to-tickets cuts a spec into tracer-bullet tickets sized for one fresh context window, with native blocking edges, prefactoring first, and expand-migrate-contract for wide refactors
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills-to-tickets
  - https://github.com/mattpocock/skills/issues/554
  - https://github.com/mattpocock/skills/issues/513
tags: [aihero, pocock-skills, tickets, planning, issue-tracker]
applies_to: [mattpocock-skills@1.3, gh@2.94]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/to-tickets` turns a spec, plan, or the current thread into tracker tickets where each is a vertical slice through every layer, demoable alone, and small enough for a session that has never seen the spec. It orders prefactoring first, presents a numbered list with blocking edges for you to approve before publishing, and on GitHub creates sub-issues (`gh issue create --parent`) with native `--blocked-by` links. Per-skill detail belongs in [pocock-skill-to-tickets](pocock-skill-to-tickets.md).

## When to use

- A spec issue and a multi-session build; or a plan that lives only in the conversation.
- Not for a change that fits one window (`/implement`), and not over tickets it produced itself (`/triage` is for work that arrived from others).

## Procedure

1. Run it in the same window as `/to-spec`.
2. At the quiz step ask per ticket: what can I demo when this is done? No answer means a horizontal slice; merge or re-cut. Over-decomposition is the most reported problem; ask it to merge.
3. Check each acceptance criterion fails at the base commit and is satisfiable by this ticket alone.
4. For a wide mechanical refactor (rename a column, retype a shared symbol) accept the expand, migrate-in-batches, contract sequence, each batch blocked by the expand and the contract blocked by every batch.
5. Dispatch yourself: count frontier tickets (no open blockers), open that many fresh sessions, clear between tickets. `/implement` does not close tickets; update state by hand or use `/implement-spec`.

## Evidence

Vendor docs page plus two upstream issues. The page relays one team's post-mortem of a 26-ticket stack sliced by layer: about twenty agent runs per closed ticket, roughly three quarters rework, every failure class traced to horizontal slicing. That is a reported result without published method (T3), relayed on a T1 page. Issues #554 (sub-issues not created) and #513 (blocked-by written as body text) document fixed defects and the `gh` version floor. Local-mode tickets moved from a single `tickets.md` to one file per ticket under `.scratch/<feature>/issues/` after a race between parallel agents.

## Open questions

- This repo's `docs/agents/issue-tracker.md` describes dependency edges through the REST API with database ids; check whether `gh issue create --blocked-by` on `gh` 2.94+ supersedes that.
- Is a "demo path" line per ticket worth adding to our ticket template, as some users report it steers slicing?
