---
title: mattpocock/skills v1.3.2 tells every dispatching skill to start subagents with a fresh context window, runs code-review's sub-agents in the foreground, makes ask-matt read SKILL.md before summarising, and asks for a re-run of setup-matt-pocock-skills to refresh docs/agents
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/releases/tag/v1.3.2
tags: [pocock-skills, upstream, subagents, code-review, issue-tracker, codex]
applies_to: [mattpocock-skills@1.3.2]
added: 2026-11-01
last_verified: 2026-11-01
verified_by: agent
---

v1.3.2 of the upstream skills plugin (released 2026-10-29) is a patch release of 19 changesets. Four change how this repo's agents should behave: skills that dispatch subagents now say to start each one with a fresh context window rather than forking the current conversation (Codex forks by default, which throws away the clean context a subagent exists for); `code-review` runs both sub-agents in the foreground, uses their returned reports, searches the repo for standards files and resolves the issue tracker through the tracker doc instead of a hard-coded path; `ask-matt` reads a skill's `SKILL.md` before stating what it does or recommending a step be skipped; and the GitHub tracker template that `setup-matt-pocock-skills` writes changed enough that upstream asks for a re-run to refresh `docs/agents/`. This repo's `docs/agents/issue-tracker.md` and `docs/agents/triage-labels.md` come from that template.

## When to use

- You dispatch subagents from a skill on a harness that forks by default (Codex): the upstream skills now state fresh context explicitly; apply the same rule in your own skills.
- You read the `pocock-skill-*` notes in this repo: 26 are bound to 1.2.3 and 8 to 1.3; the deltas below are what changed since.
- You maintain `docs/agents/` from the upstream template: decide whether to re-run `/setup-matt-pocock-skills` (human decision; the daily job does not run it).

## Facts

Per-skill changes stated in the release notes:

- Subagent dispatch (`implement-spec`, `code-review`, `codebase-design`, `improve-codebase-architecture`, `wayfinder`, `research`, `grilling`, `chief-of-staff`): start each subagent with a fresh context window rather than forking the current conversation.
- `ask-matt`: reads a skill's `SKILL.md` before stating what it does or recommending a step be skipped, instead of trusting its own one-line summaries (upstream issue 614).
- `code-review`: searches the repo for standards files and always hands `CODING_STANDARDS.md` and `CONTRIBUTING.md` to the Standards sub-agent (1065); runs both sub-agents in the foreground and uses their returned reports (1073); resolves the issue tracker through the provided tracker doc (937).
- `diagnosing-bugs` Phase 5: diff a forced mutation against a pristine copy before trusting the red, so an edit that silently changed nothing cannot pass as a failing test (955).
- `grilling`: each question is worded so "yes" accepts the recommended answer (706).
- `handoff`: names the OS temp directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) (272).
- `implement`: calls the Skill tool for `tdd` and `code-review` instead of bare slash-command prose; fetches a passed ticket reference from the tracker and states its title before starting (700).
- `tdd`: each proposed seam gets a one-line note on what it catches and what it misses (607).
- `to-tickets`: each ticket becomes a sub-issue of its source issue; `## Blocked by` is omitted when blockers are native edges (554, 262).
- `wayfinder`: no longer labels maps or tickets `ready-for-agent` (518); cross-references only real issue ids (507); opens no PR from research branches (576); resolves each ticket as the type its label names (625).
- `teach`: quizzes vary the position of the correct answer (611); workspace is written to the directory you ran it in (377).
- `chief-of-staff`: memory kept in an LLM wiki (`index.md` plus one page per topic, maintained through ingest, query and lint), every claim dated, every claim about code citing the commit it was true at.
- `setup-matt-pocock-skills` and its templates: wires up a git remote before writing a tracker doc (1201); offers to `git mv` a legacy `CONTEXT.md` or `CONTEXT-MAP.md` to its `GLOSSARY` name (1176); creates missing triage labels (616); the GitHub template fixes the external-PR listing that failed on `authorAssociation` (468), comments before closing (873), reads a PR's body as well as its comments (1138), moves Blocking into Conventions with native `gh` flags (855), names the command that counts open blockers (1118), reads issues with `--json` (733); the template now tells agents to file issues only into the user's own repo, never into `mattpocock/skills`, after agents in clones filed specs there (541 to 550).
- `wizard` template: ten fixes to the bash template (Readline in `ask`, single-quoted `.env` values, symlinked `.env`, EOF handling, stages inside `run_wizard`, ANSI fallback for `_clear`, and others).

## Evidence

- T1: the release page on github.com/mattpocock/skills, read through this repo's reader on 2026-11-01. Each line links a merged pull request and most link the issue they close. Nothing was run; the plugin version installed in this session was not checked against 1.3.2.
- This repo's `docs/agents/issue-tracker.md` and `triage-labels.md` were produced by an earlier template; which of the template fixes above are missing from them is a diff a human or a later run should make.

## Open questions

- Our delta: this repo's `AGENTS.md` already says `CONTEXT.md` at the root for domain docs; upstream now prefers a `GLOSSARY` name. Whether to follow is an ADR-level decision.
- Whether the daily job itself should adopt the fresh-context rule when it spawns subagents (it currently spawns none).
- The 26 notes bound to `mattpocock-skills@1.2.3` and 8 bound to `1.3` have not been re-read against 1.3.2; the per-skill lines above name which notes are affected.
