---
title: AIP (arXiv 2606.04781) measured that compiling a human-written SKILL.md into a typed YAML graph of script-backed steps raised Claude Sonnet 4.6's mean reward on 27 SkillsBench tasks from 0.60 to 0.71 (p = 0.011), while agent-authored graphs with no human source scored 0/15
type: technique
status: inbox
evidence: T1
sources:
  - https://arxiv.org/abs/2606.04781
  - https://arxiv.org/html/2606.04781
  - https://github.com/zach-blumenfeld/aip
  - https://github.com/zach-blumenfeld/aip-skillbench
  - https://neo4j.com/blog/genai/from-agent-memory-to-portable-skills/
  - https://www.youtube.com/watch?v=g_NgCLTibiM
tags: [skills, skill-authoring, evals, research, graph, claude-code]
applies_to: [claude-sonnet-4-6, aip@0.3a3]
added: 2026-11-04
last_verified: 2026-11-04
verified_by: agent
---

A skill whose routing and computation live in prose makes the agent re-derive them every run. AIP (Agent Instruction Protocol, Blumenfeld and Webber, Neo4j, June 2026, revised September 2026) compiles an existing SKILL.md into a schema-validated YAML graph: a skill node over step nodes that are either script-backed (deterministic) or description-based (judgment), joined by typed input and output edges. On a stratified 27-task sample of SkillsBench with Claude Sonnet 4.6 as the solver, the compiled form raised mean task reward from 0.599 to 0.705 and pass rate from 53.3% to 67.4%, winning 12 tasks, losing 2, tying 13. The same compiler given only the task instruction, with no human-written skill to compile from, passed 0 of 15 trials against 11 of 15 for the human prose. The gain comes from making human procedural knowledge executable, not from the agent inventing it.

## When to use

- A skill that is long prose with embedded commands, formulas, or multi-step pipelines, where runs vary in which steps the agent actually performs. The paper's gains concentrate in prose-only skills; already script-heavy skills tied.
- A skill that fails the same way every run. The graph makes the failing step addressable: fix one node, recompile, re-run.
- Deciding whether to let an agent author a skill from scratch. The evidence says no: compile from human source, do not generate.

## Procedure

As the paper and repo describe it (AIP tag v0.3a3; nothing here has been run in this repo):

1. Start from a human-written skill: SKILL.md, docs, or code. The compiler is a meta-skill that an agent runs over that source (the paper used Opus 4.7 for compilation, Sonnet 4.6 for solving).
2. The output is a YAML graph validated against the AIP schema. Each step declares typed inputs and outputs, binds to a script where the computation is deterministic, or carries a description where judgment is needed. Provenance to the source is kept on each node.
3. Author once, mount unchanged across runs. The agent runs the graph rather than re-reading prose.
4. When a task fails consistently, trace it to a node, edit the spec or the compiler instruction, recompile, and re-run the full suite to check for regressions.

The Neo4j Agent Memory Service applies the same format in reverse: derive the step topology deterministically from recorded tool-call traces, use one LLM call only to write claim text, gate on grounding above 0.9 and coverage above 0.6, fall back to prose below three recorded steps, and hold every distilled skill for human review. That pipeline is vendor-described and unmeasured; see Evidence.

## Facts

Paper setup: SkillsBench via the BenchFlow SDK, 94 tasks across 8 domains, stratified 27-task sample; solver harness claude-agent-acp driving claude-sonnet-4-6 in a Docker sandbox; 5 trials per task and condition; primary metric mean task reward, because several verifiers are all-or-nothing.

| Metric, human-curated prose vs AIP-compiled | Prose | AIP |
|---|---|---|
| Mean task reward | 0.599 | 0.705 |
| Pass rate | 53.3% | 67.4% |
| Tasks won / lost / tied | | 12 / 2 / 13 |
| Wilcoxon signed-rank on per-task mean reward | | p = 0.011 |
| Mean wall-clock, seconds | 585 | 510 |

- The wall-clock drop is not significant (p about 0.28) and is driven by a few prose-only tasks: one fell 1,305 seconds because the compiled skill ran an 847-combination grid search as a script instead of having the agent attempt it. Script-heavy source skills did not speed up. One task got 511 seconds slower and more accurate.
- The loaded specification grew by about 78% on average and runs still got faster. Per-call token usage is not logged by the harness.
- The 24-task subset compiled under the final protocol version is consistent on its own (+0.101, p = 0.022). Three tasks were compiled under the prior version and sampled differently.
- Node-level repair, two cases, zero regressions on the other tasks: a template lookup keyed on the wrong constant took one task from 0/5 to 5/5; a compiler-authored 1,146-line routing script was timing out, and a spec change favouring lean scripts moved that task from 0.40 to 0.60 and timeouts from 3 to 1.
- aip-from-instruction (agent writes the AIP skill from the task alone) was dropped from the headline after scoring 0/15 against 11/15 for human prose in an early medium-difficulty set. Failures were wrong methods committed into scripts: a distorting map projection, a parser rejecting valid input, a controller producing no output.

## Evidence

Primary source read through the arXiv HTML. Method, model IDs, trial counts, and the test are stated; code, harness, and run data are in the two GitHub repos linked above (not executed here). The authors are Neo4j employees and the paper underpins a Neo4j product; the measurement itself is on a third-party benchmark with a public harness. The authors flag the power: 5 trials per cell and 12 to 14 non-tied pairs for the test.

The Neo4j blog post and the conference talk (the talk is the YouTube link) restate the paper's numbers and describe the distillation pipeline and a loan-approval demo. The demo's timings (about 7.5 minutes down to about 2, Haiku replacing a frontier model) are stated as a demo, not a result, and are not carried into this note.

## Open questions

- Single model. The authors hypothesise a weaker solver gains more from the graph, which is untested. The opposite risk is in [the WikiSkill note](wikiskill-skills-encoding-model-workarounds-transfer-negatively-to-stronger-models.md): structure that compensates for one model's routing errors may cost a stronger model. A Sonnet-compiled graph run under Opus or Fable has no measurement.
- No software-engineering benchmark. SkillsBench domains are scientific and office workflows; the one build-repair task in the sample was a floor for both formats (0.20 each, 90 to 140 tool calls).
- The compiled artifact is a YAML graph plus scripts, not a SKILL.md. Whether Claude Code or another harness runs it directly, or needs a CLI wrapper as the talk's demo used, is a harness question the paper does not settle.
- Compare with [the pstack correct note](pstack-correct-fixes-repeated-agent-mistakes-at-highest-enforcement-level.md): AIP is the same move (prose rule to executable structure) applied to a whole skill, with a measurement attached.
