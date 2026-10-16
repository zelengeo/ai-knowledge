---
title: to-spec synthesises a settled conversation into one tracker issue without interviewing; it earns its step only when the build spans sessions
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md
  - https://aihero.dev/skills-to-spec
tags: [pocock-skills, engineering, spec, planning]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/to-spec` records decisions already made. It reads the thread, the codebase, `CONTEXT.md` and ADRs, sketches the test seams and checks them with you, then writes a spec in the project's vocabulary and publishes it as a single issue on the configured tracker with the `ready-for-agent` label. It asks no fresh questions.

## When to use

- Deciding is done and the build will not fit one context window: `/to-spec`, then `/to-tickets`.
- A cleared `wayfinder` map: `/to-spec #<map_issue>` collapses the linked decisions into one buildable document.
- Not before grilling, and not when the work fits one session (go straight to `implement`).

## Procedure

1. User-invoked (`disable-model-invocation: true`). Requires a tracker from `setup-matt-pocock-skills` (GitHub, GitLab or `.scratch/` markdown).
2. Seams first: it proposes as few as it can, preferring existing ones, and confirms with you. Those seams bind `tdd` and are what `code-review` checks against.
3. Writes and publishes; every decision in it should be one you remember making.
4. Stay in the same window for `/to-tickets`; re-fetching a large spec from the tracker truncates.

## Evidence

- Upstream claims: the spec exists because context windows end; tickets are disposable, the spec is not.
- Demonstrated: the `ready-for-agent` label on the parent spec makes AFK pollers try to build the whole spec in one run (most-reported rough edge); the template leans on user stories and fits refactors poorly; it neither links the ADRs it respects nor searches the tracker for duplicates. The spec goes stale once implementation starts; durable learning belongs in `CONTEXT.md` and ADRs.
- Renamed from `to-prd` in 1.1.0; 1.3.0 quoted its description (previously invalid YAML on skills.sh) and reworded the setup precondition.
- No eval data is published.

## Open questions

- Our delta: none yet.
- This repo's daily job opens a PR per run; is a GitHub issue the right spec home here, or the PR description?
