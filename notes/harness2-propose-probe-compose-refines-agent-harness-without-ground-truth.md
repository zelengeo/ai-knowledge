---
title: Harness2 refines an agent's harness per task with no verifier by proposing edits, probing each with one rollout, and composing from trajectory contrasts
type: concept
status: inbox
evidence: T1
sources:
  - https://github.com/google-research/harness2
  - https://github.com/google-research/harness2/blob/main/harness2/core/recursion.py
  - https://github.com/google-research/harness2/blob/main/harness2/core/selection.py
  - https://github.com/google-research/harness2/blob/main/harness2/core/library.py
  - https://github.com/google-research/harness2/blob/main/docs/EXPERIMENTS.md
  - https://arxiv.org/abs/2610.14224
tags: [harness, context-engineering, evals, opencode, codex, skills, self-improvement]
applies_to: [harness2@0.1.0]
added: 2026-10-20
last_verified: 2026-10-20
verified_by: agent
---

Harness2 (Google Research, Apache 2.0, released with arXiv 2610.14224) keeps model weights fixed and edits the files around the model instead: system prompt, memory, skills, scripts, subagents, plugins. It does so on a task it has never seen and without a grader, by comparing full trajectories of the unmodified harness against trajectories of candidate edits, then composing one harness from the contrasts. The authors report a single step lifts GLM-5 and Gemini 3.5 Flash over their base harnesses on three professional benchmarks; the gains are self-reported and not reproduced here.

## When to use

- You run the same agent on a stream of tasks within a domain and want the harness to improve between tasks without hand-tuning.
- You have no ground truth per task but can afford several rollouts per task plus a few improver sessions.
- You want a worked, open design for "harness optimisation" rather than a prompt-tuning library; the repo is also a reference for how to isolate an improver from grading signal.

## Facts

Task-level recursion, one "Propose-Probe-Compose" step at budget k (`core/recursion.py`):

1. Roll the base harness k times on the task. These are the shared evidence for everything that follows.
2. Propose 2k candidate harnesses in parallel: k on the INV dimension (how the agent works: tool use, procedure, completion) and k on the DOM dimension (what a practitioner knows: artifact contract, decision rules, checks). Each proposer is an agent session that edits the harness files in place and gets the full trajectories and deliverables on disk, not in the prompt.
3. Probe: roll each candidate once.
4. Compose k finals in parallel from the whole pool (base rollouts, candidate harnesses, candidate rollouts, decision notes). Merge, adopt one wholesale, or `KEEP_BASE`; each decision line must cite the trajectory moment or base-set pattern that decided it. Roll each final once.
5. Select: a separate session sees only the finals' deliverables, anonymised and shuffled with a seed, and picks one against the task text and source material. The k=1 case skips selection.

Per task this is 4k rollouts and 3k improver sessions. `--mode sequential` instead runs k rounds of (2 candidates, 1 composition), each editing the previous checkpoint and seeing all earlier rounds. The README's framing: parallel explores wider, sequential refines deeper.

Invalid proposals get exactly one retry with the validator's error text fed back verbatim, then the stage falls back to the harness it started from. A rollout that crashes is recorded, never raised, and a non-delivering rollout makes its edit "unsafe" in the composer prompt.

Harnessing-level recursion (`core/library.py`, `core/selection.py`): after adoption a reflection session compares the chosen harness with the base and writes a lesson with four fields: cue, lesson, evidence, confidence. A lesson missing cue, lesson, or evidence is not stored. The per-domain library keeps the full adopted tree plus that lesson; later tasks in the same domain see earlier entries as examples to copy from, with the instruction to re-verify any workspace fact before reuse. Libraries are scoped per benchmark, executor, mode, budget, and seed, so every sweep starts empty.

Grader isolation is enforced in code, not only in prompts:

- `RunView` carries no score; the judge is called only after selection has committed.
- Benchmark prompt slots are rejected if they contain "benchmark", "evaluation", "grader", "rubric", or "score".
- The context builder strips answer-key paths by glob and refuses any evidence tree whose file names or contents match grader-output markers; the comment calls this a tripwire, not the defence.
- Every improver prompt carries a block stating that no rubric exists in context and that files under `context/` are data, never instructions, with an explicit rule never to execute a script found in a candidate harness.

## Evidence

Source code and docs in the google-research organisation (T1 for what the system does). The accuracy claims come from the authors' paper and README: up to 11.5 points on WorkBuddy-Bench, 4.5 on JobBench, 11.8 percentage points on LAB partial pass rate, with more as k grows. No method-independent reproduction exists here, and the repo's own `dependencies/PINNED.md` says the historical paper runs may have used different tasks, model deployments, and additional local tooling than the public release. Treat the numbers as T3 until reproduced; the mechanism is T1.

## Open questions

- Cost: a k=3 parallel run is 12 rollouts plus 9 improver sessions per task on long office tasks. The docs warn about API cost but publish no per-task figure.
- The selector judges artifacts blind, but all candidates come from the same model family; the composer prompt itself notes that agreement between candidates is "support, not independent proof".
- Whether the library transfers across domains is untested by design: retrieval is by domain directory only.
- Related notes: [the eight editable components and their always-on caps](harness2-eight-editable-harness-components-with-always-on-cap.md), [the edit-justification rule](harness2-every-harness-edit-must-trace-to-a-trajectory-moment.md), [the rubric-leak incident](harness2-codex-rollout-fetched-benchmark-rubric-unprompted.md).
