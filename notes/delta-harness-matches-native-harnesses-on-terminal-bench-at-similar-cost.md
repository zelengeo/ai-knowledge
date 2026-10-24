---
title: Zed's own Terminal-Bench 2.1 run puts Delta's harness level with Codex and Claude Code on tasks solved, at 0.80x to 1.12x the cost per pass, on 29 tasks per model, self-reported
type: comparison
status: inbox
evidence: T3
sources:
  - https://delta.dev/blog/beyond-pass-rate
  - https://delta.dev/blog/the-diff-2026-09
  - https://frontierharness.org
tags: [delta, evals, harness, benchmarks, claude-code, codex]
applies_to: [delta@2026-09-23-build, claude-code@2.x, codex-cli]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Anant Goel (Zed) ran the same models through Delta and through their native harness on a Terminal-Bench 2.1 subset and reports Delta matching or exceeding each native harness on tasks solved, at 0.80x to 1.12x the cost per pass. The method is stated, the sample is small, the run is the vendor's own, and the post's more useful content is its argument that pass rate hides harness behaviour: whether a solution is left as readable code or a one-off shell command, how many tool-call failures the harness silently retries, and how tool calls are batched per request. Keep as a lead on harness-as-variable, not as a ranking.

## When to use

- When choosing or defending a harness and someone quotes a pass rate: the references below are the current literature on harness effects.
- When reading any vendor harness benchmark: the footnotes here show what to check (task count, cost definition, effort parity, run date).

## Facts

Same reasoning effort in both harnesses, 29 tasks (25 for Fable because its security classifier refused some tasks). Cost per pass is total cost of all tasks including failures divided by tasks solved.

| Model (effort) | Harness | Passed | Cost per pass |
|---|---|---|---|
| GPT-5.6 Sol (xhigh) | Delta | 21/29 | $0.88 |
| | Codex | 19/29 | $1.10 |
| GPT-6 Astra (xhigh) | Delta | 25/29 | $1.83 |
| | Codex | 24/29 | $1.65 |
| Claude Opus 5 (high) | Delta | 24/29 | $1.75 |
| | Claude Code | 24/29 | $1.56 |
| Claude Fable 5.1 (high) | Delta | 20/25 | $1.63 |
| | Claude Code | 20/25 | $1.54 |

A second table runs Kimi K3 on the 30 FrontierHarness tasks: Delta 21/30 at $2.95 per pass against thirteen other harnesses, with Claude Code at 19/30 and $18.34. Delta's numbers are from its own Harbor run on 2026-09-23; every other harness is copied from frontierharness.org results published 2026-08-22.

Behavioural claims, each illustrated with one task and not measured across the set:

- Code left behind. On `code-from-image`, Codex computed the answer in a one-line `node -e` command and wrote only the output file; Delta with the same model wrote a `solution.py` and ran it. Claude Code wrote the answer with `printf`; Delta had the hashing script write the file.
- Tool-call failures. The post says Claude Code has "high reported failure rates" that the harness absorbs with silent retries, and that Delta's failure rate is about 1.5 percent on Anthropic models. Mechanism: DeltaDB records which version of a file the model read, so an edit that now matches two places is applied to the line the model read; if that line itself changed, the model is told the content is stale.
- Request count. On `count-dataset-tokens`, Codex took 14 requests in 110 seconds, five of them polling still-running commands; Delta took 7 requests in 78 seconds because its terminal waits for a command to finish and the harness batches reads with installs.

References the post builds on, worth chasing as primary sources: Pan et al., HarnessTax (2026); Zhu and Mei, FrontierHarness (Runta, September 2026); Vats and Golev, arXiv:2607.22585; Arjmandi, arXiv:2609.11987; Lewis, arXiv:2608.26218; Merrill et al., Terminal-Bench (ICLR 2026); Huang et al., DeepSWE (2026); Ronacher, "Better Models: Worse Tools" (July 2026).

## Evidence

T3, not T1 or T2, because: the runs are the vendor's on its own product; the 29-task subset and harness versions are not listed; a single run per task with no variance; Delta's system prompt is not published; the cross-harness table mixes a September Delta run with August third-party numbers; and the "high reported failure rates" claim about Claude Code links to a source the post does not name. Zed says it will publish deeper metrics on a release cadence; nothing published as of 2026-10-24.

## Open questions

- Reproduction on the published FrontierHarness task set with pinned harness versions would move this to T2.
- Whether Delta's lower request count holds on long tasks, where waiting on a command instead of polling could cost more wall time.
- Compare with the repo's harness notes: [harness2's eight editable components](harness2-eight-editable-harness-components-with-always-on-cap.md) treats the harness as the tunable object; this post is the vendor-side version of the same claim.
