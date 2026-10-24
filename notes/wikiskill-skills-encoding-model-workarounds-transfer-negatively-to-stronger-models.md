---
title: WikiSkill (arXiv 2608.27454) measured that evolved skills transfer across model families and can beat self-evolved ones, but skills encoding a weak model's workarounds cut a stronger model below its no-skill baseline (Gemini-3.5-Flash on SpreadSheetBench 50.5% to 18.1%)
type: concept
status: inbox
evidence: T1
sources:
  - https://arxiv.org/abs/2608.27454
  - https://arxiv.org/html/2608.27454
  - https://github.com/addyosmani/agent-skills/blob/main/docs/skill-anatomy.md
tags: [skills, skill-authoring, evals, transfer, research, agent-skills]
applies_to: []
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Skills written against one model's failures are not neutral for other models. In WikiSkill (Tang et al., submitted 2026-08-27), skills evolved by Qwen-3.5-4B encoded low-level workarounds (single-line Python commands, string-conversion rules) and fragmented diagnostic sequences; given to Gemini-3.5-Flash on SpreadSheetBench they dropped it from 50.5% (no skill) to 18.1%, while Qwen-3.6-27B's skills raised it to 63.4%. agent-skills cites this as the ground for its "write the procedure, not the workaround" authoring rule.

## When to use

- Writing a skill that will run on more than one model or model generation. Strip steps that exist only because one model gets a call wrong.
- Reviewing a skill PR: ask whether each step can be justified without naming a model or an agent's private tool name.
- Deciding whether to adopt skills written by or for a weaker model.

## Facts

From the paper (five benchmarks: LiveMathematicanBench, SealQA, SpreadSheetBench, OfficeQA, ALFWorld; five models from Qwen, Gemma and Gemini families; three independent evolution runs per method, paired bootstrap p < 0.05):

- WikiSkill co-evolves a skill set with a persistent wiki of consolidated experience; it beats Trace2Skill, EvoSkill and SkillOpt on average for every model, and beats the no-skill baseline in most but not all model-benchmark pairs.
- Gains grow with scale within one family: +12.3, +17.5, +23.9 points average for Qwen 4B, 9B, 27B. Skills also compensate for scale: Qwen-3.5-9B with skills (47.4%) beats Qwen-3.6-27B without (39.4%).
- Transfer: Qwen-3.6-27B skills lift Qwen-3.5-9B on SpreadSheet to 50.5% versus 33.6% self-evolved; Qwen-3.5-4B skills lift Gemma-4-31B on LiveMath to 73.1%. Stronger source models do not always produce better skills.
- Negative transfer, with the error analysis: small-model skills constrain stronger models from writing end-to-end scripts, and redundant diagnostic tool calls exhaust the interaction budget. Qwen-3.5-4B's own OfficeQA skills lowered its score (30.2% to 28.5%) while raising Qwen-3.6-27B (42.1% to 52.9%): discovering a procedure and executing it are distinct capabilities.
- Ablation: letting the inference agent read the wiki during training rollouts degrades final skill quality.
- Competing methods are less reliable: EvoSkill lifted Qwen-9B on LiveMath but degraded Gemma-4-31B there (33.9% to 29.8%).

## Evidence

Primary source read through the arXiv HTML version. Benchmarks are agentic task suites, not software engineering; the models are Qwen, Gemma and Gemini, not Claude. The agent-skills anatomy doc paraphrases the finding as skills leaving a stronger model "worse than with no skill at all", which the SpreadSheet transfer row supports exactly. The abstract alone does not carry the negative-transfer result; it is in section 4.2.2.

## Open questions

- No coding benchmark in the paper. Whether hand-written engineering skills show the same effect is unmeasured; the agent-skills eval README's adherence gaps are the closest observation in this KB.
- The paper's "skills" are evolved prompt fragments injected at inference, not SKILL.md files loaded on demand.
