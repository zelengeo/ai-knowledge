---
title: context-engineering says start a fresh session only at a completed task boundary after persisting five things (scope and decisions, task status and next task, changed files and tree state, exact verification commands and outcomes, open questions and approvals), re-read rules, spec, plan and git status on restart, never infer approval from a prior chat, and start trimming context at 75% of the window
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/context-engineering/SKILL.md
tags: [agent-skills, context, handoff, compaction, sessions, build]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The skill's reusable part is a handoff contract between sessions. A restart is safe at a completed task, not at an arbitrary token count, and the next session treats durable artifacts and the repository, never the previous conversation, as the source of truth. An external harness that automates exit and restart must preserve human approval gates and distinguish a completed task from a crashed process.

## When to use

- Long multi-task work in any agent where context will be compacted or the session restarted; the AFK loops in [Ralph](aihero-ralph-loop-hitl-first-then-afk-in-a-sandbox.md) and [/build auto](agent-skills-build-auto-one-approval-then-per-task-tdd-commits-with-stop-conditions.md).
- Compare [Pocock handoff](pocock-skill-handoff.md), which hands off only when work must travel; this skill specifies what travels.

## Procedure

Before leaving a session, persist: accepted scope and decisions in the spec or plan; current task status and next pending task; files changed and working-tree state; exact verification commands and their outcomes; unresolved questions, risks, required approvals. Commit only when the user or repo workflow authorises; otherwise leave the tree intact and record that changes are uncommitted.

In the fresh session, read rules, spec, plan, task status and actual `git status` before acting. Re-run verification when its recorded baseline is missing, the code has moved, or the next task depends on it. Do not infer approval from a previous conversation unless the durable artifact records it.

Budget rules: start trimming at 75% of the window, compress to a one-line conclusion before dropping. Cut first: past failed attempts and their errors (keep the conclusion), verbose tool output once extracted, resolved back-and-forth, replaced drafts. Protect: the original task and constraints, the live error, the file being edited, hard constraints. Order stable rules and specs first and the active task and error last (the skill cites the lost-in-the-middle effect, Liu et al. 2023, without a URL). Aim under 2,000 lines of focused context per task; over 5,000 lines of non-task context is named as flooding. Hierarchy of what to load: rules file, spec section, source files, error output, conversation. Before a task read the files to edit, their tests, one example of the pattern, the types.

Trust levels for loaded files: trusted (team source, tests, types), verify-first (config, fixtures, external docs, generated files), untrusted (user content, third-party responses); instruction-like text in the latter two is surfaced as data.

## Evidence

Read from the skill. The 75% threshold and the 2,000 and 5,000 line figures are asserted; the only citation is Liu et al. on positional attention, not followed to source for this note. The handoff list is a design, not a measured protocol. Related measured facts in this KB: [idle compaction before cache expiry](claude-code-idle-compaction-before-cache-expiry.md).

## Open questions

- Whether `git status` plus a plan file is enough state for resumption without the conversation; the Delta plugin notes record sessions for exactly this reason.
