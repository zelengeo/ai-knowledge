---
title: research delegates primary-source reading to a background agent and returns one cited Markdown file; scope the question narrowly and watch for a duplicate agent
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md
  - https://aihero.dev/skills-research
tags: [pocock-skills, engineering, research, subagents]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`research` spins up a background agent that investigates a question against primary sources only (official docs, source, specs, first-party APIs), follows each claim to the source that owns it, and writes one Markdown file where the repo already keeps notes. Your session keeps working. The skill body is 12 lines.

## When to use

- An external fact a decision is waiting on: how a third-party API behaves, what a spec says, whether a version claim holds.
- A `wayfinder` research ticket (fired automatically per ticket since 1.2.0).
- Not for decisions (`grilling`, `grill-with-docs`), not for "does this work in our codebase" (`prototype`), not for a small question a two-line prompt answers.

## Procedure

1. Model-invoked; also `/research`. State one narrow question.
2. The caller dispatches a background agent; it writes a single file matching the repo's note convention and reports the path.
3. Verify by following two or three citations: they must land on the owning source, not a write-up.
4. Feed the file deliberately into the next step (grilling, spec, ticket); nothing auto-loads it later.

## Evidence

- Upstream claims: delegation keeps the main context clean; the primary-source constraint is what distinguishes it from a harness's deep-research mode.
- Demonstrated: issue #530, the background agent is an unrestricted general-purpose agent and re-spawns itself; one report measured ~450k tokens across three overlapping runs, reproduced on Codex too. No shipped fix. If global instructions forbid re-delegation the agent declines and nothing happens. No allowlist or verification pass decides "high-trust"; the model does. No stopping criterion, so both too deep and too shallow are reported.
- Unchanged between 1.2.3 and 1.3.1.
- No eval data is published.

## Open questions

- Our delta: this repo's own read path (`pnpm run read`, denied WebFetch/curl) and `docs/rubric.md` tiers are a stricter version of the same primary-source rule; whether the plugin's `research` honours the deny list is untested.
