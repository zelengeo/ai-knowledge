---
title: The simplify-ignore hook uses PreToolUse Read, PostToolUse Edit|Write and Stop hooks to swap annotated code blocks for content-hashed placeholders so the model never sees them, then restores them, giving block-level protection against a refactoring agent
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/hooks/SIMPLIFY-IGNORE.md
  - https://github.com/addyosmani/agent-skills/tree/main/hooks
tags: [agent-skills, hooks, claude-code, refactoring, redaction, code-simplification]
applies_to: [agent-skills@0.6.13, claude-code@2.x]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

A hook on the agent's file tools can redact source from the model rather than merely instruct it to leave code alone. Blocks between `simplify-ignore-start` and `simplify-ignore-end` comments are replaced in place by `/* BLOCK_<8-hex-hash>: reason */` before any `Read`, expanded back after every `Edit` or `Write`, and expanded again at `Stop`. The model reasons about the surrounding code with a placeholder where the protected implementation was.

## When to use

- Running `/code-simplify` or any refactoring agent over files with hand-tuned or deliberately odd code (unrolled loops, workarounds) that an instruction alone may not protect. This is the enforcement-over-instruction move from [pstack correct](pstack-correct-fixes-repeated-agent-mistakes-at-highest-enforcement-level.md) applied to a reading boundary.

## Procedure

Annotate with any comment style (`//`, `/* */`, `#`, `<!-- -->`), one block per start/end pair, optional `: reason`. Register one script, `hooks/simplify-ignore.sh`, on three events in `.claude/settings.json`: `PreToolUse` matcher `Read` (backs up the file, substitutes placeholders), `PostToolUse` matcher `Edit|Write` (expands placeholders, saves the model's change, re-filters), `Stop` (expands whatever is left on disk, so edits made via Bash or a formatter survive; detects a file put back whole by a revert and keeps it rather than the stale backup). Backups live in `.claude/.simplify-ignore-cache/` (gitignore it). Content hashing makes the round trip unambiguous if the model duplicates or reorders placeholders.

Failure handling: an `Edit` or `Write` that deletes a placeholder is reported back to the model with exit 2 and the placeholder to restore; if still missing at `Stop`, the backup is restored and the changed file is kept as `<id>.recovered` for manual merge. Crash recovery: `echo '{}' | bash hooks/simplify-ignore.sh`. Known limits: single-line blocks hide the whole line; only `*/` and `-->` closers detected; renames via shell leave placeholders in the new file; fuzzy fallback matching may leave cosmetic debris.

## Evidence

Read from the hook README; not run. The repo lists test scripts (`simplify-ignore-test.sh`) beside the hook. No data on how often the model damages placeholders in practice.

## Open questions

- The same mechanism could redact secrets or licence-restricted code from an agent's view; the README does not claim that use and the single-line and rename limits would matter more there.
