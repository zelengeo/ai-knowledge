---
title: agent-skills runs a three-tier skill eval framework in-repo (structural validators, deterministic TF-IDF routing evals with a 95% rank-1 floor and 75% collision error, behavioural evals through headless claude graded on expectations), extending Anthropic's skill-creator evals.json
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/evals/README.md
  - https://github.com/addyosmani/agent-skills/tree/main/scripts
  - https://github.com/anthropics/skills/tree/main/skills/skill-creator
tags: [agent-skills, evals, skills, skill-authoring, ci, claude-code]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

agent-skills tests its skill catalog at three cost levels: free structural checks, a free deterministic routing approximation, and paid behavioural runs. The middle tier is the repo's own addition: a stemmed TF-IDF ranking of realistic user prompts against all skill descriptions, which catches the two routing bugs that dominate in practice (a description missing the words users say, and an over-broad description outranking the right skill) without a model call.

## When to use

- You maintain more than a handful of skills and have had "why didn't the skill fire" incidents. Tier 2 turns those into a CI failure.
- You change a skill description. Run Tier 2 before and after; the fix is almost always to the description, not the eval.

## Procedure

| Tier | Checks | Runs | Cost |
| --- | --- | --- | --- |
| 1 Structural | frontmatter, naming, sections, line budget, reference links, command parity, artifact paths, manifest versions | CI, `validate-*.js` | free |
| 2 Trigger and routing | positive prompts rank their skill in top-k (default 3, 1 for the signature ask); negative prompts owned by another skill must rank that owner higher; pairwise description similarity errors at 75% and warns at 50% | CI, `run-evals.js --min-rank1 95` | free |
| 3 Behavioural | an agent following the skill meets `expectations[]`, graded from the execution trace | on demand, `run-evals.js --behavioral <skill>` | tokens |

Case file: `evals/cases/<skill>.json` with `trigger.positive[]`, `trigger.negative[]` (each with `owner`) and `evals[]` in skill-creator's schema (`id`, `prompt`, `expected_output`, `files[]`, `expectations[]`) plus one added field `kind`: `execution` (default, runs in a throwaway git repo seeded from `evals/fixtures/`, grader sees the `stream-json --verbose` trace including tool calls) or `dialogue` (the conversation is the artifact; a human-reviewed exemption, not an escape hatch).

Runner details worth copying: executor runs with `--permission-mode acceptEdits` and a pre-approved tool list so evals can really edit and commit; traces are fenced as untrusted data and piped to the grader over stdin (argv would hit OS limits); executor and grader have timeouts; grader output is validated as JSON before writing to a gitignored `evals/results/`. Discipline skills include pressure cases (time pressure, sunk cost, authority).

Rules: write trigger prompts the way users talk, never by copying the description. CI floor is 95% rank-1 against a checked-in 100% baseline; raise it as routing improves, never lower it to pass. A fourth, host-level check is `claude plugin eval` over `evals/plugin/` cases, which scores Claude Code's real router with and without the plugin; see [the findings from running it](agent-skills-skill-invocation-is-stochastic-description-clause-is-the-lever.md).

## Evidence

Read from the evals README and the scripts listing. The README states that Anthropic's skill-creator v2 provides per-skill `evals.json` and trigger testing, and Superpowers tests with bash plus `claude -p`, and that neither offers a deterministic catalog-wide routing check; this is the authors' survey, not independently confirmed here. Tier 2 is explicitly a lexical approximation and cannot judge semantics.

## Open questions

- Whether `run-evals.js` could run against this repo's `skills/` as-is; it expects `evals/cases/` beside `skills/`.
- Tier 2 measures descriptions against each other, so a catalog of one or two skills gets little from it.
