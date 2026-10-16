---
title: Claude Code compacts an idle 200K+ conversation before its one-hour prompt cache expires
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.299
tags: [claude-code, context-engineering, cost]
applies_to: [claude-code@2.1.x]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

Since Claude Code v2.1.299 a terminal conversation of 200K or more tokens that sits idle for about 54 minutes is compacted automatically, before its one-hour prompt cache expires. The next message then lands on the compacted context instead of reprocessing the whole uncached conversation.

## When to use

- Long sessions you leave open between work blocks. The default behaviour costs nothing to turn on; the question is whether to tune or disable it.
- Lower the threshold when you routinely resume mid-size sessions after a break and pay for cache misses.
- Disable it when a session's full history matters more than cost, for example while debugging a long trace you will quote from.

## Facts

- Trigger: 200K+ tokens and about 54 minutes idle, in the terminal.
- `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` changes the 200K minimum.
- `"idleCompaction": false` in `settings.json` turns it off.
- Both settings need v2.1.290 or later according to the changelog, although the feature itself shipped in v2.1.299.
- Related in the same release: `CLAUDE_CODE_DISABLE_FILE_MENTIONS` makes `@` mentions pass file paths rather than contents, see [claude-code-file-mentions-paths-only](claude-code-file-mentions-paths-only.md).

## Evidence

The v2.1.299 release notes state the feature, its threshold, the timing rationale (the one-hour cache), and both overrides. No measurement of saved tokens is published; the saving is implied by the cache lifetime.

## Open questions

- Does idle compaction apply to VS Code, desktop, and headless sessions, or only the terminal as the changelog says?
- What does the compaction summary drop? Worth checking against a session you know well before relying on it unattended.
