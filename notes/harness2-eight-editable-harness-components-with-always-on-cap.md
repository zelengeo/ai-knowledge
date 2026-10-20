---
title: Harness2 splits an agent harness into eight editable components and caps the always-on text, because every always-on token is paid on every turn
type: concept
status: inbox
evidence: T1
sources:
  - https://github.com/google-research/harness2/blob/main/harness2/substrate/opencode.py
  - https://github.com/google-research/harness2/blob/main/harness2/substrate/codex.py
  - https://github.com/google-research/harness2/blob/main/harness2/core/tree.py
  - https://github.com/google-research/harness2/blob/main/third_party/jb_runner/harness_baseline_oc/harness.yaml
  - https://github.com/google-research/harness2#harness-components
tags: [harness, context-engineering, agents-md, skills, hooks, opencode, codex]
applies_to: [harness2@0.1.0, opencode, codex-cli]
added: 2026-10-20
last_verified: 2026-10-20
verified_by: agent
---

Harness2 treats a coding agent's harness as a file tree of eight component kinds and makes the improver pay for context: always-on prose has a hard character cap per substrate, a skill without a trigger line in always-on text is dead weight, and plugins or hooks are the only components that can enforce a rule the model cannot skip. The vocabulary is useful on its own for anyone hand-maintaining CLAUDE.md, AGENTS.md, and skills.

## When to use

- Deciding where a new rule belongs: always-on prompt, on-demand skill, script, subagent, or hook.
- Auditing an AGENTS.md or CLAUDE.md that has grown: the cap and the "cut something to pay for it" rule give a concrete budget.

## Facts

The eight components, numbered c1 to c8 in the baseline manifest:

| # | Component | Runtime role | OpenCode file | Codex file |
|---|---|---|---|---|
| c1 | system prompt | context construction | `systemprompt.md` | `AGENTS.md` |
| c2 | context policy | compaction | not editable (framework owns it) | not editable |
| c3 | memory | durable domain facts | `LongTermMEMORY.md` | `AGENTS.md` |
| c4 | tool guidance | prose about the toolset | `tool_descriptions/tool_guidance.md` | `AGENTS.md` |
| c5 | subagents | delegation in own context | `sub_agents/<name>/AGENT.md` | same |
| c6 | guardrails and skills | always-on rules; on-demand procedures | `guardrails.md`, `skills/<name>/SKILL.md` | `AGENTS.md`, `.agents/skills/<name>/SKILL.md` |
| c7 | scripts | deterministic helpers via shell | `scripts/<name>.py` | same |
| c8 | plugins or hooks | inside the tool loop | `plugin/<name>.ts` | `.codex/hooks.json` (command hooks only) |

Caps and rules the validator enforces (`core/tree.py`, substrate specs):

- Always-on text is capped at 24,000 characters across the four OpenCode files and 8,000 characters for Codex's single `AGENTS.md`. The Codex spec's stated reason: the file is injected whole into every turn, and Codex also truncates it silently at 32,768 bytes.
- A skill must have its literal name in always-on text as a trigger, or it is never opened. The validator auto-repairs this by appending a trigger line built from the skill's `description`, unless that would breach the cap.
- Component names are lowercase letters, digits, underscore, hyphen. Paths outside the surface are rejected and reported back to the proposer.
- Scripts must compile; hook files must match the dispatched event schema, because a malformed hook never fires rather than erroring.
- The edit contract is omitted-is-inherited: a proposal emits only what it changes.

Guidance the improver prompts give on choosing a component (paraphrased from `core/prompts.py`):

- A named component usually beats prose. A skill, script, or subagent can be invoked or copied by the next task; a paragraph in always-on text is paid for on every run and travels badly.
- Repeated deterministic extraction, conversion, or checking goes in a script, with clear inputs, outputs, and failure behaviour.
- Only repeated evidence that clear prose is ignored justifies a hook or plugin, and it must not block valid completion.
- Always-on memory is for short universal facts; task-specific facts there are wrong anchors for the next task.
- Workspace facts the rollouts paid to discover (a column mapping, a unit, which look-alike value satisfies a requirement) are the most valuable thing to encode, labelled "in this workspace" so the next reader can tell fact from procedure.

## Evidence

Source code of the substrate specs and validator in the google-research organisation, plus the baseline manifest comments. The caps are design choices the authors made, not measured optima; no ablation over cap size is published in the repo. The "named component beats prose" and "trigger line or dead weight" rules match the progressive-disclosure finding in [the AI Hero note on minimal AGENTS.md](aihero-agents-md-stays-minimal-with-progressive-disclosure.md) and the deterministic-enforcement finding in [the pre-commit hooks note](precommit-hooks-enforce-conventions-on-agents.md).

## Open questions

- Claude Code is not a supported substrate; the mapping would be `CLAUDE.md` for c1/c3/c4/c6, `.claude/skills/`, `.claude/agents/`, and `settings.json` hooks for c8. Whether Claude Code's own `@import` and skill auto-loading change the trigger-line rule is untested.
- The 24,000 and 8,000 character caps are the authors' numbers for their models and benchmarks; the right budget for other models is unknown.
