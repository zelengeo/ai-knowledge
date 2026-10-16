---
title: wizard generates a bash script that walks a human through steps only they can click; the agent writes it and never runs it
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/SKILL.md
  - https://aihero.dev/skills-wizard
tags: [pocock-skills, engineering, setup, secrets, human-in-the-loop]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`wizard` scopes a manual procedure (third-party dashboards, credentials, CI secrets, a one-off migration or cutover), confirms an ordered stage list with you, then authors stages onto a fixed `template.sh` library that opens URLs, captures values with hidden entry, upserts `.env`, writes `gh secret` / `gh variable`, and summarises what it could not do. Captured secrets never enter the model's context.

## When to use

- The agent hits a wall only a human can pass: a key it cannot mint, a dashboard it cannot click, switches that must be flipped in order.
- You are about to write setup steps into a README; an executable version rots less quietly.
- Not for steps the agent can do itself, and not for deciding what to build.

## Procedure

1. Model-invoked since 1.2.0 (it fires mid-build when blocked); also `/wizard`.
2. Scoping reads `.env*`, `docker-compose*`, framework config and every `secrets.*` / `vars.*` in `.github/workflows/`; each is a value the wizard must produce. Where it does not know a UI path it asks or checks docs rather than inventing clicks.
3. Each stage is one screen; destination per value: `.env`, secret, variable, both, or nowhere. Verification is static: `bash -n`, `shellcheck`, a trace that every value lands where scoped.
4. You run it. Re-running offers saved values as defaults. One-off scripts are deleted after use; shared setup paths are committed and linked from the README.

## Evidence

- Upstream claims: the template pre-solves the UX so the skill only scopes and authors stages.
- Demonstrated: no back button mid-run (Ctrl-C and re-run); arrow keys insert escape codes in prompts because `read -r` is used (issue #741); it does not check the third-party service, only the repo. 1.2.3 removed the time estimate (`TOTAL_MINUTES`); progress is counted in stages. The first real run is the test; the agent never executes it.
- Unchanged between 1.2.3 and 1.3.1 beyond the em-dash sweep.
- No eval data is published.

## Open questions

- Our delta: none yet.
- This repo's scheduled job needs no dashboard setup today; the skill becomes relevant if a token for a new source is ever required.
