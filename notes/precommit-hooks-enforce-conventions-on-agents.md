---
title: A pre-commit hook that fails the commit and injects a corrective prompt enforces a codebase convention on agents more reliably than AGENTS.md
type: technique
status: inbox
evidence: T2
sources:
  - https://ghuntley.com/agency/
  - https://simonwillison.net/2026/Oct/13/geoffrey-huntley/
tags: [agents-md, hooks, architecture, claude-code]
applies_to: []
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

When an agent keeps bypassing a convention (here: calling observability modules directly instead of the project's diagnostics library), a deterministic pre-commit hook that scans the diff, fails the commit, and prints a prompt telling the agent what to use instead got compliance to "ten out of ten", where editing AGENTS.md left a drift that returned. Instructions are probabilistic; a failing check is not.

## When to use

- A convention the agent has violated at least three times despite being written down.
- The violation is detectable from the diff with a deterministic check: a forbidden import, a direct call to a module that should be wrapped, a dependency crossing a layer boundary.

## Procedure

1. Write the rule as a script that inspects `git diff --cached` for the forbidden pattern. Keep it deterministic; no model call.
2. Install it as a pre-commit hook. On a hit, exit non-zero and print one paragraph addressed to the agent: what was found, what to use instead, where the wrapper lives.
3. Let the agent's loop see the failure. The printed text re-enters its context as the fix instruction.
4. Keep the AGENTS.md line too, but treat the hook as the enforcement.

## Evidence

Geoffrey Huntley, in a write-up of a podcast conversation (the primary source), reports refactoring toward a diagnostics library, the next agent loop not following it, and the hook fixing it fully. The count is his; no eval or sample size is given. He frames it as the agent-era version of Danger Systems style CI checks. Simon Willison quoted the passage, which is how it surfaced here.

The same post makes two further claims without evidence that are not noted separately: delete skills and AGENTS.md every couple of months because models change under them, and read model cards because labs give opposite instructions (yelling at the model helps per Anthropic, hurts per OpenAI's GPT-5 card). Both are leads, not notes.

## Open questions

- Which hook runner fits Claude Code best: a git pre-commit hook the Bash tool trips, or a PreToolUse hook on `git commit`? The former works for every agent; the latter can block earlier.
- Whether the injected text should be terse (just the rule) or include the fix location. Huntley's wording suggests the latter.
