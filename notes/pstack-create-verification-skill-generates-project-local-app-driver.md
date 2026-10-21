---
title: Generate a project-local verify skill (launch, doctor, drive, evidence, cleanup, plus a per-feature map) by interviewing the repo, and prove it by running one feature end to end before handing it over
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/create-verification-skill/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/principle-prove-it-works/SKILL.md
tags: [pstack, verification, skills, testing, e2e]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `create-verification-skill` writes `<skills>/verify-<app>/SKILL.md` for the current repo so a later agent, reading it cold mid-task, can start the real app, drive one user path, capture evidence, and tear down. The generator interviews the codebase rather than the user, seeds a feature map with one file per user-facing feature, and is not a deliverable until its own instructions have been run once end to end with the evidence surviving cleanup.

## When to use

- A project has no scripted way to prove UI, CLI or service behaviour, so "prove it works" has nothing to run against. Same gap [the agent-harness note](agent-harness-deterministic-state-and-image-diff.md) fills for one app; this is the generator.
- pstack's `setup-pstack` offers it once after model setup.

## Procedure

1. Interview the repo: surface (web, CLI/TUI, desktop, API, mobile, library), run command from the repo's own docs with ports, env and seed data, drive mechanism (existing Playwright or Cypress specs, PTY helpers, curl-able endpoints, a debug port, else CDP for web and Electron, tmux or PTY for CLIs, HTTP for services), observable evidence, and whether two instances can run side by side. If the checkout does not start, fix or report that first.
2. Write the skill with frontmatter (`name: verify-<app>`, a description naming app and surface) and sections: Launch (exact command, readiness signal that means usable, not just answering; teardown), Doctor (one read-only "is this instance worth driving" check), Drive (real selectors and commands from this repo, stable handles over coordinates), Evidence (real user path, action plus resulting state, side effects, mocks only at an existing production boundary; verify what a dry-run skips by observing files, network and git refs), Cleanup (kill what you started, never by process name; never the evidence), Helpers (executable, invocation shown).
3. Seed `features/README.md` plus one file per feature (top 3 to 5) with four H2s: Sub-features, How to get to it (user POV), Driving it with <harness>, Gotchas. A journey that fails for a missing precondition reports the failure; never weaken it to pass.
4. Run the generated skill once: launch, doctor, drive one feature, capture, clean up, confirm the evidence still exists. Run cleanup after every failed iteration too. If proved on a stand-in (container for VM), list every step the stand-in did that the target will not.
5. Point at `maintain-verification-skill` for keeping the map honest.

## Evidence

Read from the skill file. The structure is prescriptive; the repo gives no count of projects it was generated for or of failures it caught. The "ready means usable" and "cleanup never eats the proof" rules read like post-mortem lessons but no incident is cited.

## Open questions

- How the generated skill coexists with a repo's existing e2e suite. The skill prefers existing harnesses for the drive step but does not say whether to wrap or duplicate them.
