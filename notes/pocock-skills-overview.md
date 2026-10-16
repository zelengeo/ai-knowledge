---
title: The Pocock skills are one main flow (grill, spec, tickets, implement, review) plus on-ramps and standalones; user-invoked skills orchestrate, model-invoked skills are callable by other skills
type: concept
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md
  - https://github.com/mattpocock/skills/blob/main/CHANGELOG.md
  - https://github.com/mattpocock/skills/releases
  - https://aihero.dev/skills-ask-matt
tags: [pocock-skills, engineering, productivity, workflow, overview]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

The 25 promoted skills in `mattpocock-skills` 1.2.3 arrange into one main flow, three on-ramps, two vocabulary references and a set of standalones. The router `/ask-matt` carries the map; each skill has a note in this repo. Upstream is at 1.3.1, which adds three skills and removes one (see below).

## When to use

- You are starting work and need to know which skill opens it: read the main flow, then the skill's note.
- You are deciding whether an agent may reach a skill on its own: check the invocation column.
- You are planning context hygiene across a multi-step build: see the phase-boundary rule.

## Facts

Main flow, idea to ship, kept in one unbroken context window until tickets exist:

1. [grill-with-docs](pocock-skill-grill-with-docs.md) in a repo, or [grill-me](pocock-skill-grill-me.md) with none; both call [grilling](pocock-skill-grilling.md), the former also [domain-modeling](pocock-skill-domain-modeling.md). A question talking cannot settle detours to [prototype](pocock-skill-prototype.md), bridged by [handoff](pocock-skill-handoff.md). Knowledge in someone else's head goes to [to-questionnaire](pocock-skill-to-questionnaire.md); an external fact goes to [research](pocock-skill-research.md).
2. Multi-session build: [to-spec](pocock-skill-to-spec.md) then [to-tickets](pocock-skill-to-tickets.md). Single-session: skip both.
3. [implement](pocock-skill-implement.md) per ticket in a fresh window; it drives [tdd](pocock-skill-tdd.md) and closes with [code-review](pocock-skill-code-review.md).

On-ramps that merge onto the flow: [triage](pocock-skill-triage.md) for issues you did not create (meets the flow at `ready-for-agent`); [diagnosing-bugs](pocock-skill-diagnosing-bugs.md) for something broken; [wayfinder](pocock-skill-wayfinder.md) for an effort too big for one session, which hands off at `to-spec`. Upkeep: [improve-codebase-architecture](pocock-skill-improve-codebase-architecture.md) generates ideas that re-enter at `grill-with-docs`. Vocabulary underneath: [codebase-design](pocock-skill-codebase-design.md) (module shape) and `domain-modeling` (domain words). Standalones: [wizard](pocock-skill-wizard.md), [wait-what](pocock-skill-wait-what.md), [teach](pocock-skill-teach.md), [writing-for-agents](pocock-skill-writing-for-agents.md), [resolving-merge-conflicts](pocock-skill-resolving-merge-conflicts.md). Precondition: [setup-matt-pocock-skills](pocock-skill-setup-matt-pocock-skills.md) once per repo. Router: [ask-matt](pocock-skill-ask-matt.md).

HITL versus AFK: `wayfinder` labels every decision ticket. `grilling` and `prototype` tickets are HITL, resolved only through a live exchange with the human; an agent that answers its own grilling questions has broken the skill. `research` is AFK, fired as a background subagent. `task` is either. The same split explains why `code-review` and `research` run in subagents and why `to-spec`'s `ready-for-agent` label trips AFK pollers.

User-invoked versus model-invoked (`disable-model-invocation: true` in frontmatter; Codex analog `policy.allow_implicit_invocation: false`): user-invoked skills exist to orchestrate and are reachable only when typed; no skill may call one. Model-invoked skills fire on their description and may be called by other skills. At 1.2.3, 14 are user-invoked: ask-matt, grill-with-docs, implement, improve-codebase-architecture, setup-matt-pocock-skills, to-spec, to-tickets, triage, wayfinder, grill-me, handoff, teach, to-questionnaire, wait-what. 11 are model-invoked: code-review, codebase-design, diagnosing-bugs, domain-modeling, prototype, research, resolving-merge-conflicts, tdd, wizard, grilling, writing-for-agents. A side effect: the harness hides user-invoked skills from the model's skill list, so agents report them as not installed.

Phase boundaries (from `ask-matt`): between phases choose in order continue, `/clear`, `/handoff`, subagent, `/compact`. Continue is ruled out first because it is the only option that keeps the conversation a primary source; `/compact` is the default, not the first reach. Smart zone is stated as roughly 150k tokens.

## Evidence

- Source for the structure is the 1.2.3 `ask-matt` SKILL.md and its docs page, both vendor-owned (T1). The invocation flags were read from each SKILL.md frontmatter.
- Changes 1.2.3 to 1.3.1 (CHANGELOG at `main`, release notes): added `implement-spec` (user-invoked, whole spec in parallel worktrees onto one integration branch), `pr` (model-invoked PR-body shape), `retro` (user-invoked, session retrospective proposing environment changes); removed `resolving-merge-conflicts`; renamed `CONTEXT.md` / `CONTEXT-MAP.md` to `GLOSSARY.md` / `GLOSSARY-MAP.md` across eleven skills; cross-skill calls rewritten as explicit "Call the Skill tool" instructions; skills no longer try to call user-invoked skills; repo-wide em-dash removal; `ask-matt` routes updated. The aihero docs pages already reflect 1.3.x, so they disagree with the installed 1.2.3 plugin on the glossary filename.
- No eval data is published for any skill or for the flow as a whole; the docs pages' "Common questions" sections are the field record and read as curated issue reports.

## Open questions

- Our delta: this repo keeps `CONTEXT.md` and `docs/agents/*` written by the 1.2.3 setup; updating the plugin to 1.3.x without re-running setup leaves the convention split. Human decision.
- Whether to add notes for `implement-spec`, `pr` and `retro` once the local plugin reaches 1.3.x.
