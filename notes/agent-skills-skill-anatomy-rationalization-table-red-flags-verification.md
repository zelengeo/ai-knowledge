---
title: agent-skills requires every skill to carry a Common Rationalizations table (excuse paired with rebuttal), Red Flags, and an evidence-backed Verification checklist, with frontmatter limited to the six Agent Skills spec fields
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/docs/skill-anatomy.md
  - https://github.com/addyosmani/agent-skills/blob/main/CONTRIBUTING.md
  - https://agentskills.io/specification
tags: [agent-skills, skills, writing-for-agents, skill-authoring]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The pack's distinctive authoring rule is that a skill is a workflow with built-in defences against being skipped: a table of the excuses an agent uses to bypass a step, each with a factual rebuttal, plus observable Red Flags and a Verification checklist whose every item needs evidence. Frontmatter stays within the Agent Skills specification's six fields so the same file loads on every host; vendor fields go under `metadata`, and the repo's validator rejects anything else at top level.

## When to use

- Writing or reviewing a skill under `skills/` in this repo. Pair with [writing-for-agents](pocock-skill-writing-for-agents.md) for structure and [unslop](pstack-unslop-numbered-ai-tell-rules.md) for prose.
- Deciding whether a skill is complete: if you cannot name the excuse an agent would use to skip a step, the step has no defence.

## Procedure

Section order (recommended, equivalent headings allowed): Overview, When to Use (with exclusions), Process, Common Rationalizations, Red Flags, Verification.

- Description: third person, what the skill does, then one or more "Use when" triggers. Up to 1024 characters. Do not summarise the workflow in it; the agent may follow the summary instead of reading the skill.
- Rationalizations table: two columns, excuse and reality. Every skip-worthy step needs a row.
- Red Flags: behavioural signs the skill is being violated, usable in review and self-monitoring.
- Verification: checkboxes, each provable by test output, build result, screenshot or runtime data.
- Size: keep `SKILL.md` under 500 lines; move material over 100 lines to supporting files, keep under 50 lines inline. Prefer a script over inline code (a script costs context only for its output). Links one level deep.
- Model neutrality: a step that cannot be justified without naming a model, version, or one agent's private tool name is a workaround, not a procedure, and belongs in an issue. Two smells: over-specified mechanics and fragmented diagnostics. See [the WikiSkill finding this cites](wikiskill-skills-encoding-model-workarounds-transfer-negatively-to-stronger-models.md).
- Frontmatter: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` only. Confirmed against the spec page, which lists the same six with `name` (64 chars, lowercase, hyphens) and `description` required.
- Every new skill ships `evals/cases/<name>.json` with at least 3 positive triggers, 2 negative triggers and 1 behavioural eval; CI enforces. See [three-tier evals](agent-skills-three-tier-evals-structure-lexical-routing-behavioral.md).
- Shared checklists live in a repo-root `references/`, not inside any skill, accepting the per-skill-install portability loss.

## Evidence

Read from `docs/skill-anatomy.md` and `CONTRIBUTING.md`. The anatomy is the authors' design; the only measurement behind it is the routing eval work in the evals README. Whether rationalization tables change agent behaviour is asserted, not measured, in this repo. The evals README mentions "pressure cases" (time pressure, sunk cost, authority) for discipline skills, which is the mechanism that would test it.

## Open questions

- This repo's own `skills/` do not carry rationalization tables. Worth trying on one skill and checking with a pressure prompt whether it holds.
