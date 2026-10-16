---
title: setup-matt-pocock-skills records tracker, triage labels and doc layout under docs/agents/ once per repo; the tracker-dependent skills guess without it
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md
  - https://aihero.dev/skills-setup-matt-pocock-skills
tags: [pocock-skills, engineering, setup, issue-tracker]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/setup-matt-pocock-skills` answers three questions for one repo (where issues live, what the triage labels are called, where domain docs sit) and writes them as `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md` plus an `## Agent skills` block in `CLAUDE.md` or `AGENTS.md`. The skills never change; they read these files at run time.

## When to use

- Once per repo, before the first `triage`, `to-spec`, `to-tickets`, `wayfinder` or `implement`.
- Re-run to switch trackers, or after a plugin update if a downstream skill starts behaving differently from the docs.
- Not for per-user preferences (grilling cadence, tone): those go in your own `CLAUDE.md`.

## Procedure

1. User-invoked (`disable-model-invocation: true`); no skill can fire it, and since 1.3.0 downstream skills tell the human to run it rather than calling it.
2. It reads `git remote`, existing `CLAUDE.md` and `CONTEXT.md`, proposes answers, and waits for confirmation before writing.
3. Tracker options: GitHub (`gh`), GitLab (`glab`), local markdown under `.scratch/<feature>/`, or "other" described in a paragraph (Jira, Linear, Beads work this way). Labels are asked only if `triage` is installed. Domain docs default to single-context unless monorepo signals appear.
4. It does not create labels in the tracker; run `gh label create` for the five states and two categories yourself.

## Evidence

- Upstream claims: the config files are the only thing that varies between repos, which is why the set is not GitHub-locked.
- Demonstrated: labels not created is filed as a bug more than once (#616 on `triage`); the `CLAUDE.md`-if-exists rule writes to a file Codex never reads; no user-level config mode exists. Both verified here: this repo's `docs/agents/` and `AGENTS.md` carry exactly the files and block this skill writes.
- v1.3.0 renamed the domain-doc convention to `GLOSSARY.md`; a repo set up on 1.2.3 will have `CONTEXT.md` references in `docs/agents/domain.md`.
- No eval data is published.

## Open questions

- Our delta: this repo was set up on 1.2.3 with `CONTEXT.md`; re-running on 1.3.x would rename the convention. Human decision.
