---
title: Measured with claude plugin eval, skill invocation in Claude Code is stochastic and a description clause saying the skill applies even when the code is pasted inline raised review-skill firing from 7 of 27 to 21 of 27 and TDD firing from 6 of 24 to 19 of 24, with must-not-fire prompts staying at zero
type: technique
status: inbox
evidence: T2
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/evals/README.md
  - https://github.com/addyosmani/agent-skills/tree/main/evals/plugin
tags: [agent-skills, claude-code, skills, evals, routing, skill-description]
applies_to: [claude-code@2.1.278, claude-opus-5-5, agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Claude Code does not deterministically invoke a skill whose description matches the prompt. The agent-skills maintainers ran `claude plugin eval` with the model pinned and found that the lever is a specific kind of description clause: naming the case the model treats as "I can just do this myself" (a diff or function pasted inline, a request that does not mention tests) and saying the skill still applies. Describing what the skill adds, or naming diffs and pull requests, did not move the rate.

## When to use

- A skill you wrote rarely fires on natural phrasings although its description seems right.
- Before reporting any skill firing rate: pin `--model`, record the Claude Code version, give each case a turn budget of 10 or more, and read the per-run delta rather than the exit code.

## Facts

All numbers from the evals README, Claude Code 2.1.278 and later, model pinned to claude-opus-5-5 unless stated.

- Baseline stochasticity (default model, unpinned): the review skill fired in 5 of 7 runs on the case's own phrasing; TDD fired in 2 of 7 on a test-first prompt. In one run the review skill did not fire yet the reply used its severity taxonomy as headings, which no baseline run did in nine: loaded descriptions may shape replies without an invocation.
- Review skill, four phrasings ("Review this diff before I merge it" and similar): original description 7 of 27 fires; with the added clause "applies even when the diff is pasted inline", 21 of 27. Nine adjacent must-not-fire prompts stayed 0 of 27 both ways. The plainest phrasing went 0 of 9 to 3 of 9.
- TDD skill, four prompts: "Add unit tests for this function", "Fix this bug, here is the function", "Change this function so size can never exceed 100" fired 0 of 6 each; the process-shaped "Write a failing test for this bug before we fix it" fired 6 of 6. Naming the three request shapes and saying the skill applies when code is pasted inline and tests are not mentioned took the four prompts from 6 of 24 to 19 of 24 (add tests 6/6, fix bug 6/6, change behaviour 1/6). Eight must-not-fire prompts stayed 0 of 24. The one-line behaviour change is the floor: the trace shows a single-turn edit with no tool call.
- Adherence is separate from routing: on the pasted-bug case the TDD skill fired every run, but the reply put the failing test before the fix in only 2 of 4 runs with the plugin and 0 of 3 without, in a session with no shell to run anything.
- The model may reach a skill through its slash command first (`agent-skills:review`, then the skill), costing two turns, hence the turn budget.
- The default model changed twice in one day during the runs, hence pinning.
- A `tool_used: Skill` grader only says whether the skill fired and is excluded from a two-arm score; pair it with a grader on the reply itself (the repo uses a free regex grader for the severity labels plus one LLM judge for a planted off-by-one).

## Evidence

First-party measurement by the repo authors with method, model, version and counts stated; the case files are public under `evals/plugin/`. Small n (6 to 9 runs per prompt), one model, one CLI version range, no confidence intervals. Rated T2 because the procedure and outcome are stated and reproducible from the repo, not T1 because it measures Claude Code behaviour the vendor does not document.

## Open questions

- Whether the same clause works on other models and on the `Skill` tool in non-Claude hosts.
- The description-length cost: every clause sits in context on every turn for every skill.
- The pstack mode skill and the Pocock user-invoked versus model-invoked split both route around this problem rather than measuring it; this is the first measurement in the KB.
