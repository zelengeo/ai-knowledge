---
title: handoff writes a portable file for work that must travel to another harness, directory or person; for the same place and task, compact instead
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/handoff/SKILL.md
  - https://aihero.dev/skills-handoff
tags: [pocock-skills, productivity, context-engineering, sessions]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/handoff` compacts the current conversation into one Markdown file in the OS temp directory, with a suggested-skills section, secrets redacted, and existing artifacts (specs, ADRs, issues, diffs) referenced by path or URL rather than copied. What it buys is portability, not better compression.

## When to use

- Four triggers: swapping harness, moving to another directory or repo (the `prototype` detour is the common case), sending work to a colleague, forking a side task mid-phase while you keep working.
- Everything else at a phase boundary is continue, `/clear`, a subagent, or `/compact`; `/compact` is the default.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Pass an argument saying what the next session is for; the document is tailored to it.
2. Ask for the path back and keep it; copy the file somewhere durable if the next session is not within the hour or is on another harness.
3. In the new session, point at the file ("read this, then continue") rather than pasting the summary into a shell command.
4. Read it before handing over and downgrade anything the session assumed but never verified; the next agent treats it as a contract.

## Evidence

- Upstream claims: continue is the only move that keeps the conversation a primary source; compact, clear and handoff all produce a secondary source.
- Demonstrated: temp paths differ per OS and Windows agents take several attempts to find the right one (most-reported friction); Codex clears temp between sessions and `/private/tmp` goes on reboot; shell interpolation of a summary truncates silently; it captures the what, not the why. The 1.2.0 `ask-matt` rework explicitly says `/handoff` had been oversold as the general bridge between windows.
- Unchanged between 1.2.3 and 1.3.1.
- No eval data is published.

## Open questions

- Our delta: none yet.
- This repo's agents run in worktrees; a handoff across worktrees is a "new directory" case by the skill's own test.
