---
title: Use /handoff only when work must travel to another harness, directory, person, or forked task; at every other phase boundary the ordered choice is continue, clear, handoff, subagent, then compact
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills-handoff
  - https://www.aihero.dev/skills-ask-matt
  - https://github.com/mattpocock/skills
tags: [aihero, pocock-skills, context-engineering, handoff]
applies_to: [mattpocock-skills@1.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/handoff` writes one markdown file to the OS temp directory that a fresh agent reads to continue. It buys portability, not better compression, so it fits exactly four situations: switching harness, moving directory or repo, sending work to a colleague, or forking a side task while the original session keeps going. The router skill orders the five phase-boundary options as continue, `/clear`, `/handoff`, subagent, `/compact`, and most days the tree ends at `/compact`. Per-skill detail belongs in [pocock-skill-handoff](pocock-skill-handoff.md).

## When to use

- Only at a phase boundary (end of grilling, end of implementation, end of QA). Mid-phase there is nothing to decide beyond continue or delegate.
- The prototype detour is the canonical fork: hand off to a prototype session, answer the question there, hand the answer back; the original thread stays live.

## Procedure

1. Rule out "continue" first; it is the only option that keeps the session a primary source.
2. `/clear` if everything behind you is disposable. `/compact` if nothing travels and you want to stay. Subagent if the task is tight enough to run unattended.
3. For a true handoff, pass what the next session is for: `/handoff <purpose>`. The document carries the live thread and a suggested-skills list, references specs, issues, and diffs by path or URL, and redacts secrets.
4. Ask for the file path and copy it somewhere durable at once; some harnesses clear temp between sessions and a reboot empties `/private/tmp`.
5. Start the next session with "read this file, then continue". Do not paste the summary into a shell argument; backticks and `$(...)` get mangled silently.
6. Read the document before handing it over and downgrade claims the session never verified; the next agent treats them as facts.

## Evidence

Vendor docs for the skill and for the router (`ask-matt`) agree on the four triggers and on the five-option ordering. The "what, not why" weakness and the temp-directory loss are user reports relayed on the page (T3). The page itself notes that `/handoff` "does not summarise better" than `/compact`; the difference is a file you can carry.

## Open questions

- Claude Code's built-in `/handoff` and `--fork-session` overlap with this skill; the page calls them similar, not identical. Which wins on name clash under the plugin install?
- This repo's daily job is AFK and single-session; does it ever need a handoff, or only `inbox/` state on disk?
