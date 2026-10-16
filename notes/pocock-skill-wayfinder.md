---
title: wayfinder charts a multi-session effort as decision tickets on the tracker and hands off to to-spec; use grill-with-docs whenever one session holds the plan
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md
  - https://aihero.dev/skills-wayfinder
tags: [pocock-skills, engineering, planning, issue-tracker]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/wayfinder` takes an effort too large for one agent session, names its destination, and builds a map (one `wayfinder:map` issue with child decision tickets) that is resolved one ticket per session until nothing is left to decide. It plans; it does not build. A cleared map goes to `/to-spec #<map_issue>`.

## When to use

- A greenfield project or a huge feature with a foggy route, spanning many sessions. Works on legacy codebases too.
- Not for a well-scoped feature (`grill-with-docs`), not for a settled thread (`to-spec`). It is the heaviest flow in the set.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Needs the "Wayfinding operations" section `setup-matt-pocock-skills` writes into the tracker doc; create the `wayfinder:*` labels on GitHub first.
2. The map holds Destination, Decisions so far (one line per closed ticket, linking out), Not yet specified (fog that graduates into tickets when a question can be stated precisely), Out of scope.
3. Four ticket types: `grilling` (HITL, default), `prototype` (HITL), `research` (AFK, fired as a `/research` subagent per ticket at charting time onto a `research/<name>` branch), `task` (manual work that unblocks a decision). A session claims a ticket by assigning itself.
4. No fog after the opening grill means the effort fits one session; the skill stops and says so.

## Evidence

- Upstream claims: HITL/AFK labelling fixed student reports of wayfinder grilling itself; native blocking renders the frontier in the tracker UI.
- Demonstrated: the most-reported failure is production code written mid-map, because the "plan, don't do" override lives in Notes the agent writes; a 27-ticket map had its later tickets invalidated by the thirteenth; question verbosity causes decision exhaustion; parallel grilling sessions re-ask answered questions; research subagents open draft PRs from never-merge branches (#576).
- Renamed from `decision-mapping` in 1.1.0; 1.3.0 switched sub-skill calls to explicit Skill-tool calls and the setup precondition to a human instruction.
- No eval data is published.

## Open questions

- Our delta: none yet.
- Open-source maintainers choose local markdown to keep planning tickets off public trackers; this repo is public.
