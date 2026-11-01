---
title: agent-skills is Addy Osmani's 25-skill lifecycle pack (router meta-skill, 9 phase commands, 4 review personas, 7 checklists, 2 hooks, 3-tier in-repo evals) installable on Claude Code, Codex, Cursor, Gemini CLI and others
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills
  - https://github.com/addyosmani/agent-skills/blob/main/skills/using-agent-skills/SKILL.md
  - https://github.com/addyosmani/agent-skills/blob/main/docs/comparison.md
  - https://github.com/addyosmani/agent-skills/blob/main/AGENTS.md
  - https://github.com/addyosmani/agent-skills/blob/main/.claude-plugin/plugin.json
  - https://github.com/addyosmani/agent-skills/blob/main/references/definition-of-done.md
tags: [agent-skills, skills, claude-code, codex, cursor, lifecycle, overview]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

`addyosmani/agent-skills` (MIT, plugin version 0.6.13, last commit 2026-10-13 at the time of reading) packages a full software lifecycle as skills: Define, Plan, Build, Verify, Review, Ship. One meta-skill routes a task to one of 24 lifecycle skills, nine slash commands map one to one onto the phases, four review personas run as subagents, and an in-repo eval framework checks that skills route and behave. It is the third upstream skill collection next to [the Pocock skills](pocock-skills-overview.md) and [pstack](pstack-overview-mode-skill-playbooks-principles.md), and the only one of the three that ships evals.

## When to use

- You want lifecycle coverage past Build: constraints, security, performance, observability, deprecation, launch. The Pocock skills stop at review; pstack has no planning skills by design.
- You want a reference for skill authoring discipline: anti-rationalization tables, verification checklists, description-level routing evals. See the notes listed below.
- You run a team and want shared phase commands and checklists rather than one engineer's workflow.

## Facts

Structure, read from the repo tree and README:

- `skills/` (25): `using-agent-skills` (router) plus Define (`interview-me`, `idea-refine`, `spec-driven-development`, `constraint-driven-development`), Plan (`planning-and-task-breakdown`), Build (`incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `frontend-ui-engineering`, `api-and-interface-design`), Verify (`browser-testing-with-devtools`, `debugging-and-error-recovery`), Review (`code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`), Ship (`git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch`).
- `.claude/commands/` (9): `/spec`, `/plan`, `/build` (with `auto`), `/test`, `/constraints`, `/review`, `/webperf`, `/code-simplify`, `/ship`. Gemini and Antigravity get TOML copies under `.gemini/commands/` and `commands/`.
- `agents/` (4): `code-reviewer`, `security-auditor`, `test-engineer`, `web-performance-auditor`. Personas never invoke personas; `/ship` fans them out in parallel and merges.
- `references/` (7): definition-of-done, testing, security, performance, accessibility, observability checklists, orchestration patterns. Kept at the repo root on purpose, so a per-skill `npx skills add --skill` install loses them (tracked upstream as issue 361).
- `hooks/`: `sdd-cache` (conditional-revalidation cache for WebFetch), `simplify-ignore` (hides annotated blocks from the model), `session-start.sh` (injects the router on hosts without native skill routing; not wired for Claude Code or Codex, which route from descriptions already).
- `evals/`: `cases/<skill>.json` for every skill, `fixtures/`, `plugin/` cases for `claude plugin eval`, `skill-impact.md` (an append-only ledger of description changes rejected on eval evidence; empty when read).
- `scripts/` (13): structural validators and `run-evals.js`, all run in CI.
- The Definition of Done (`references/definition-of-done.md`) is a fixed project-wide bar distinct from per-task acceptance criteria: tests that fail without the change, runtime verification, no regressions, docs updated, human approval before merge.
- Router behaviours that apply across all skills: state assumptions before non-trivial work, stop on confusion, push back with quantified downsides, enforce simplicity, scope discipline, verify with evidence.

Install paths stated in the README (none run for this note): `npx skills add addyosmani/agent-skills`; Claude Code `/plugin marketplace add addyosmani/agent-skills` then `/plugin install agent-skills@addy-agent-skills`; Codex `codex plugin marketplace add addyosmani/agent-skills`; Gemini `gemini skills install <repo> --path skills`. In Claude Code `/review` collides with the built-in and is reached as `/agent-skills:review`.

The repo's own comparison (`docs/comparison.md`) positions the three collections: agent-skills for whole-lifecycle work with a human checkpoint per phase, Superpowers (obra) for long autonomous runs, Pocock's for a light daily loop with the sharpest requirements interrogation. It warns against running two collections as active routers at once (command-name and TDD-philosophy collisions) and says none of the three has solved cross-session memory.

Notes on individual procedures and findings:

- [Skill anatomy: rationalization table, red flags, verification](agent-skills-skill-anatomy-rationalization-table-red-flags-verification.md)
- [Three-tier evals](agent-skills-three-tier-evals-structure-lexical-routing-behavioral.md) and [the measured finding that skill firing is stochastic and the description is the lever](agent-skills-skill-invocation-is-stochastic-description-clause-is-the-lever.md)
- [WikiSkill: model-specific workarounds transfer negatively](wikiskill-skills-encoding-model-workarounds-transfer-negatively-to-stronger-models.md)
- [interview-me](agent-skills-interview-me-one-question-with-guess-until-three-predictable-answers.md), [doubt-driven-development](agent-skills-doubt-driven-fresh-reviewer-gets-artifact-and-contract-not-the-claim.md), [constraint-driven-development](agent-skills-constraints-md-floor-numbered-dimensions-ratchets-placed-by-cost.md), [source-driven-development](agent-skills-source-driven-development-detect-fetch-implement-cite-flag-unverified.md), [context-engineering handoff](agent-skills-context-engineering-restart-only-at-task-boundary-persist-five-items.md)
- [code-review-and-quality](agent-skills-code-review-five-axes-hundred-line-changes-severity-labels-hand-mutation.md), [test-driven-development deltas](agent-skills-tdd-blind-subagent-writes-repro-test-and-no-rerun-of-unchanged-suite.md), [performance: neutral is a revert](agent-skills-performance-neutral-optimization-is-a-revert-keep-a-ledger.md), [security: supply-chain gate and destructive paths](agent-skills-security-supply-chain-gate-and-three-condition-destructive-path-check.md)
- [Orchestration: personas do not invoke personas, /ship fan-out](agent-skills-personas-do-not-invoke-personas-ship-fans-out-and-merges.md), [/build auto](agent-skills-build-auto-one-approval-then-per-task-tdd-commits-with-stop-conditions.md)
- Design and ship procedures: [idempotency-key contract](agent-skills-idempotency-key-derived-from-intent-claimed-by-unique-insert-retained-past-the-longest-retry.md), [expand/contract schema changes](agent-skills-expand-contract-schema-change-in-five-deploys-never-rename-in-place.md), [rollout thresholds and error-budget gate](agent-skills-rollout-advance-hold-rollback-thresholds-and-error-budget-gate.md)
- Hooks: [sdd-cache](agent-skills-sdd-cache-hook-revalidates-with-origin-before-serving-cached-docs.md), [simplify-ignore](agent-skills-simplify-ignore-hook-hides-annotated-blocks-from-the-model.md)
- [Claude Code skill frontmatter facts the repo depends on](claude-code-skill-allowed-tools-preapproves-disallowed-tools-restricts-context-fork-isolates.md)
- [The one published head-to-head run against Superpowers](agent-skills-vs-superpowers-single-task-run-more-validation-passes-same-total-time.md)

## Evidence

Everything above is read from the repo's own files. The repo publishes routing evals and one first-party measurement of skill firing rates (see the evals notes) but no outcome data on whether using the pack improves shipped software. GitHub counts at read time were 110k stars and 11.5k forks; the comparison doc itself declines to cite such numbers.

## Open questions

- Overlap with the Pocock skills is large (`interview-me` versus grilling, `test-driven-development` in both, `spec-driven-development` versus to-spec, `planning-and-task-breakdown` versus to-tickets). Which to route by default is a human choice; the comparison doc says not both.
- Whether the Claude Code marketplace install and the `npx skills` install produce the same files, given the `references/` portability gap.
