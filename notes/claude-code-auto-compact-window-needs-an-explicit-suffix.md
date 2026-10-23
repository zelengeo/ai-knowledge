---
title: CLAUDE_CODE_AUTO_COMPACT_WINDOW=200k silently set a 100K window before Claude Code 2.1.304; the variable now takes k and M suffixes and warns on ignored values
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.304
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.306
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.307
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.309
tags: [claude-code, context-engineering, compaction, cost]
applies_to: [claude-code@2.1.x]
added: 2026-10-23
last_verified: 2026-10-23
verified_by: agent
---

Setting `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200k` on Claude Code before 2.1.304 silently gave a 100K window. Since 2.1.304 the variable accepts `k` and `M` suffixes like `--autocompact` and warns when a value is out of range or ignored. Four consecutive releases also removed causes of unneeded or repeated compaction, so a session that compacts more than expected on an older build is a version problem before it is a prompt problem.

## When to use

- You set the compaction window by environment variable in scripts or scheduled jobs. Check the value after upgrading and read the startup warning.
- A session compacts repeatedly or reports "prompt is too long" without the context being full. Match the symptom against the list below before changing prompts.

## Procedure

1. Write the window with an explicit suffix (`200k`, `1M`) and run on 2.1.304 or later. Look for a warning row under the banner; an ignored value is now reported instead of silently replaced.
2. If a job ran with `200k` on an older build, assume it compacted at 100K and re-read any cost or quality comparison made with that setting.
3. If a session compacts repeatedly after reading files, check for a nested `CLAUDE.md` over the size limit (2.1.309 symptom). An oversized nested file now loads only its start.

## Facts

- 2.1.304: `CLAUDE_CODE_AUTO_COMPACT_WINDOW` accepts `k` and `M` suffixes; `200k` no longer means 100K; out-of-range or ignored values warn. Compaction now sends the skill list again afterwards, and `/reload-skills` sends only new or changed skills. The compaction summary in the transcript view (Ctrl+O) names the tools called earlier. A "Context limit reached" or "Prompt is too long" error after stopping a turn mid-compaction is fixed. Pro and Max plans get a warning when resuming an inactive conversation would use a noticeable share of the 5-hour usage limit.
- 2.1.306: an API error was being replaced by "prompt is too long", followed by an unneeded compaction, in sessions with many MCP tools. Fixed.
- 2.1.307: some "Autocompact is thrashing" errors in turns that read many PDF pages, images or other large tool results are fixed. `/autocompact` in cloud sessions no longer reverts to the default window after a restart.
- 2.1.309: sessions compacting repeatedly after reading files under a very large nested `CLAUDE.md` are fixed; such a file now loads only its start.

Related: [idle compaction before the one-hour cache expires](claude-code-idle-compaction-before-cache-expiry.md) covers the idle trigger; 2.1.304 also moved self-paced `/loop` wakeups scheduled at the one-hour maximum back inside the cache window.

## Evidence

Changelog lines only. The 100K figure for `200k` is the changelog's own description of the bug, not a measurement from this repo.

## Open questions

- What the size limit for a nested `CLAUDE.md` is, and whether the same cap applies to the root file.
- Whether the suffix parsing accepts decimals such as `0.5M`.
