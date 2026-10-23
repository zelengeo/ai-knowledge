---
title: Give follow-up work to a fresh subagent with the original brief, every later directive and the prior report consolidated, instead of resuming the old one; resume only when state that cannot move (checkout, uncommitted changes, a running process) lives in it
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/poteto-mode/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/principle-guard-the-context-window/SKILL.md
tags: [pstack, subagents, context-engineering, delegation]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's Subagents section makes fresh subagents the default for a fix round, a follow-up, a retry and the next queue item. The brief for the fresh agent consolidates the original task, every directive issued since, and the prior agent's report and branch. The stated reason is that interrupt-chained resumes silently drop directives, so a "done" summary from a resumed agent is not trusted. Resume only when the new work strictly needs state that lives in the agent and is costly to move: its local checkout, uncommitted changes, or a process it still runs (dev server, simulator, PR watcher). A role such as PR owner outlives its agent; the next round gets a fresh one.

## When to use

- Any orchestration where a parent sends follow-up instructions to workers. Compare [the AI Hero handoff rule](aihero-handoff-only-when-work-must-travel.md), which is about moving work between contexts at all.
- Reviewing a workflow that resumes agents by default.

## Procedure

Defaults for every spawn, as the skill lists them: run in the background; file pointers rather than inlined context; an explicit model per role from [the model config](pstack-per-role-model-config-rule-with-inherit-parent.md); read-only mode for reviewers (which strips MCP servers), agent mode where the worker needs MCP lookups. Trivial mechanical edits go to the fast code model, the hardest changes (cross-cutting design, concurrency, subtle algorithms) to the strongest judgment model.

Rules the parent keeps:

1. The parent owns every subagent's work: review the diff and write your own summary, never pass the agent's summary through.
2. A second opinion is the same prompt against a different model; agreement is high-signal.
3. Fresh by default, consolidated scope. A stop or hold order to a running agent is not reuse.
4. Route bulk output to subagents and keep summaries in the main thread (the `guard-the-context-window` principle).

Claude Code mapping: `resume` becomes "spawn a new agent and paste the earlier result into its brief"; read-only becomes `subagent_type: "Explore"` plus a `git status` check afterwards, because Explore keeps Bash.

## Evidence

Read from the mode skill. The "resumes drop directives" claim is stated as observed behaviour in Cursor with no transcript cited. No cost comparison between fresh and resumed agents is given.

## Open questions

- Whether the dropped-directive failure applies to Claude Code's `SendMessage` continuation; the pstack Claude Code mapping avoids the question by never resuming.
