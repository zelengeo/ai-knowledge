---
title: Graphicle's own benchmark finds its code graph plus memory ties Claude Code alone on fact-finding and saves no tokens
type: comparison
status: inbox
evidence: T2
sources:
  - https://github.com/graphicle-ai/graphicle
  - https://github.com/graphicle-ai/graphicle/blob/HEAD/docs/benchmarks.md
tags: [mcp, context-engineering, code-graph, evals, claude-code]
applies_to: [claude-code@2.1.x]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

Graphicle (a Rust code-graph and project-memory MCP server, a port of Graphify) publishes a vendor benchmark that is unusually candid: on a 30-question fact-finding corpus with Claude Code 2.1.287 and Opus 5.5 at medium effort, Graphicle 0.1.1 tied Claude Code alone on facts found and showed no measured token difference. It beat Graphify 0.9.91 on both. The useful claim for this knowledge base is the tie: a code graph did not beat built-in grep and read for an agent finding facts in a repository.

## When to use

- When evaluating whether to add a code-graph or memory MCP server to Claude Code: the vendor's own numbers do not show a retrieval gain over the stock tools on this corpus.
- When you want a faster Graphify: the speed and memory measurements against Graphify are large and consistent.

## Facts

- Facts found, 30 questions, Graphify's showcase corpus: Claude Code alone 94.7%, Graphicle 0.1.1 99.2%, Graphify 0.9.91 87.8%. Graphicle versus Claude Code alone is reported as a tie (95% interval includes 0). Graphicle versus Graphify: plus 11.4 points, 95% CI [4.2, 19.7].
- Median tokens per answer in the same test: Claude Code alone 60.8k, Graphicle 69.2k, Graphify 87.1k. Graphicle versus Claude Code alone: no difference measured.
- Speed against Graphify: 3.0 to 22.7 times less time across 13 codebases and 3 operations, same machine, 3 CPUs, 8 workers; graphs differ slightly (node counts within 4.7%).
- The README states: "we do not claim it saves tokens".
- Long sessions and memory accumulated across sessions are explicitly not tested yet.

## Evidence

All numbers are the vendor's, from the README and docs/benchmarks.md, run 15 October 2026, with versions, hardware, and paired 95% intervals stated. Not independently reproduced. T2 because the method is stated well enough to rerun; the fact that the result is unfavourable to the vendor raises confidence but not the tier.

## Open questions

- Whether the tie holds on a corpus the vendor did not choose, and on tasks beyond fact lookup (refactors, impact analysis).
- Whether cross-session memory, the untested part, is where a tool like this would actually pay off.
