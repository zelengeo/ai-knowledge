---
title: agent-skills endorses one multi-agent pattern, parallel persona fan-out with a merge in the main context (/ship), forbids personas invoking personas and router personas, keeps the user as the lifecycle orchestrator, and uses Agent Teams only when teammates must disprove each other
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/references/orchestration-patterns.md
  - https://github.com/addyosmani/agent-skills/blob/main/.claude/commands/ship.md
  - https://github.com/addyosmani/agent-skills/blob/main/docs/agents.md
tags: [agent-skills, subagents, orchestration, claude-code, agent-teams, review]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The repo separates three layers: skills are the how (mandatory hops), personas the who (one role, one perspective, one output format), slash commands the when (the only orchestration layer besides the user). From that it derives a short catalog: five endorsed patterns and four anti-patterns, with a decision flow. The governing rule, personas do not invoke other personas, is also enforced by Claude Code, whose subagents cannot spawn subagents and whose teams cannot nest.

## When to use

- Designing a slash command or subagent that coordinates others. Walk the decision flow first: one perspective on one artifact means direct invocation; repeated composition with independent sub-tasks means fan-out with merge; dependent steps mean user-driven sequential commands.
- Deciding between Claude Code subagents and Agent Teams.

## Procedure

Endorsed: (1) direct invocation, the baseline every other pattern is compared against; (2) a slash command wrapping one persona plus skills; (3) parallel fan-out with merge, used only when sub-tasks share no mutable state or ordering, each produces a different kind of finding, the merge fits in the main context, and the wait is long enough for parallelism to show; (4) a sequential pipeline run by the user (`/spec` to `/ship`), not by an LLM orchestrator, because summarising between steps loses nuance, skips the human checkpoints and doubles tokens; (5) research isolation, where a read-only subagent returns a digest (on Claude Code use the built-in `Explore`).

Anti-patterns: a router persona (two paraphrase hops, about 2x tokens, no domain value; add slash commands instead), a persona calling a persona (recommend the follow-up in the report instead), a sequential orchestrator that paraphrases, and persona trees deeper than one level.

`/ship` as the worked instance: Phase A issues all three Agent calls in a single assistant turn (sequential turns serialise) for `code-reviewer`, `security-auditor`, `test-engineer`; user-level definitions of the same names win over the plugin's. Phase B merges in the main context and adds accessibility, infrastructure and documentation checks directly. Phase C emits GO or NO-GO with blockers, recommended fixes, acknowledged risks and a mandatory rollback plan; any Critical finding defaults to NO-GO. Skip the fan-out only when all hold: two files or fewer, under 50 lines, no auth, payments, data access or config.

Agent Teams versus subagents: subagents report back and never talk to each other; teammates message each other and share a task list, cost more, and are experimental (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). Use teams for competing-hypothesis debugging where the surviving theory must have resisted disproof, never for a verdict on a known diff. Persona `skills` and `mcpServers` frontmatter are honoured as subagents and ignored as teammates. Plugin agents silently ignore `hooks`, `mcpServers`, `permissionMode`.

Catalog hygiene: add a pattern only after using it twice, with a concrete artifact, a reason an existing pattern failed, and a named anti-pattern shadow.

## Evidence

Read from the three repo files. The platform constraints ("subagents cannot spawn other subagents", "no nested teams", the frontmatter field lists) are quoted by the repo from Claude Code docs; not re-verified against the docs for this note beyond the skill-frontmatter facts in [the Claude Code skill frontmatter note](claude-code-skill-allowed-tools-preapproves-disallowed-tools-restricts-context-fork-isolates.md). No measurement of fan-out versus single review quality.

## Open questions

- [pstack arena](pstack-arena-parallel-candidates-cross-judge-pick-base-graft.md) and `swarm` are fan-out patterns over candidate implementations rather than review perspectives; the catalog's checklist still applies.
