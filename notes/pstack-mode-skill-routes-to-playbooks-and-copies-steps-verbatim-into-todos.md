---
title: A single mode skill that matches the task to a playbook, copies the playbook's steps verbatim into the todo list, and indexes principles inline with leaf files it must read before citing
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/poteto-mode/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/agents/poteto-agent.md
tags: [pstack, skills, context-engineering, progressive-disclosure, routing]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `poteto-mode` is one user-invoked skill that does three things at task start: match the request to one of 23 playbooks and open a todo list whose first items are that playbook's steps copied verbatim (a skipped step stays listed with `skip: <reason>`), route to other skills from a fixed trigger list, and hold an inline one-line-per-principle index whose leaves are separate `principle-*` skills the agent must read before it may cite them.

## When to use

- Designing an entry-point skill for a collection: compare with [the Pocock router](pocock-skill-ask-matt.md), which maps the user to a skill but does not carry steps.
- Writing an AGENTS.md that is getting long: the index-plus-leaf shape is the same progressive disclosure as [the AI Hero AGENTS.md rule](aihero-agents-md-stays-minimal-with-progressive-disclosure.md), applied to principles instead of docs.

## Procedure

As the skill specifies:

1. Match the task to a playbook (investigation, bug fix, perf, hillclimb, feature, refactoring, prototype, eval, babysit, shipping, autonomous run, orchestrate, session pickup, pause safely, and others). Large or cross-cutting work routes to `figure-it-out`, which designs a bespoke playbook, even when a narrower one fits.
2. Open a todo list whose first items are the playbook's steps, verbatim, before any task-specific todos.
3. Apply the trigger list: nontrivial change or "are we sure" runs `how`; code crossing a function boundary runs `architect`; contested design runs `interrogate`; any measured number runs `benchmark-checklist`; any prose runs `unslop`; work the user walks away from keeps a decision log via `show-me-your-work`.
4. Before asking the human a "which approach" question, classify it. If the answer is observable by running something, prototype it and let the result decide. Reserve questions for product or preference calls.
5. In the reply, name each principle that changed a decision and the specific choice it changed. Cite only principles whose leaf file was read this session.
6. Every playbook ends with the "Opening a PR" playbook and a reply in the skill's house style (short declarative sentences, no long dash, every claim labelled measured, inferred or guess).
7. Delegates spawned inside a playbook use `poteto-agent`, whose first instruction is to read the mode skill in full. The chat that received the mode runs the playbook; a delegate never runs it.

Keeping the mode across turns is a Cursor feature (custom mode via option+enter). In Claude Code the skill is attached per message, or its SKILL.md is read directly.

## Evidence

The structure is read from the skill file (23,613 characters, with `disable-model-invocation: true`). No eval of the routing accuracy or of the verbatim-steps rule is published. The "cite only principles whose leaf you read" rule is a text instruction with no enforcing check; the `build-the-lever` leaf adds one self-check ("if you cited it and there is no script in the diff, you didn't apply it").

## Open questions

- Context cost: the mode skill alone is about 6k tokens before any playbook or leaf is read. No measurement of how much of a session it consumes.
- Whether copying steps verbatim into todos holds up across compaction; the skill has a "pause safely" playbook for imminent compaction, which suggests it does not by itself.
