---
title: CLAUDE_CODE_DISABLE_FILE_MENTIONS passes @ file mentions as paths, not contents
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.299
tags: [claude-code, context-engineering]
applies_to: [claude-code@2.1.x]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

With `CLAUDE_CODE_DISABLE_FILE_MENTIONS` set, an `@file` mention in a Claude Code prompt gives the model the path to read with its file tools instead of inlining the file's contents. Added in v2.1.299.

## When to use

- You mention large files or many files in one prompt and want the model to read only the parts it needs.
- You want file reads to show up as tool calls in the transcript and in hooks (PreToolUse on Read), which inlined mentions bypass.

## Facts

- Environment variable: `CLAUDE_CODE_DISABLE_FILE_MENTIONS`.
- Effect: the model receives the mentioned paths; it must call Read (or similar) to see contents.
- Default behaviour, unchanged: mention contents are inlined into the prompt.

## Evidence

The v2.1.299 release notes name the variable and describe the behaviour in one line. No token measurements are published.

## Open questions

- Does the variable accept only `1`, or any non-empty value?
- Interaction with the desktop app's file pane and with pasted paths is not described.
