---
title: The sdd-cache hook caches WebFetch results across Claude Code sessions but only serves an entry after the origin answers 304 Not Modified to a conditional HEAD, so caching never becomes trusting memory; a hit is delivered by blocking the tool with exit 2 and the body on stderr
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/hooks/SDD-CACHE.md
  - https://github.com/addyosmani/agent-skills/tree/main/hooks
tags: [agent-skills, hooks, claude-code, webfetch, caching, http, source-driven-development]
applies_to: [agent-skills@0.6.13, claude-code@2.x]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

`source-driven-development` refetches official docs for every framework decision, which repeats across sessions on one project. A plain cache would contradict the skill (docs change, a stale cache hides it). The hook's answer is HTTP's: store the body with the response's `ETag` and `Last-Modified`, and on the next fetch send a conditional `HEAD`; only a `304` serves the cache. Pages without validators are never cached. No TTL, no prompt in the key.

## When to use

- Any agent workflow that re-reads the same documentation URLs across sessions and must not trust stale copies. The same shape fits this repo's `pnpm run read` path, which currently has no cache.
- Requires `jq`, `curl`, `shasum` or `sha256sum`, Bash 3.2+.

## Procedure

Register in `.claude/settings.json` (or `settings.local.json`): a `PreToolUse` hook matching `WebFetch` running `hooks/sdd-cache-pre.sh` (timeout 10), and a `PostToolUse` hook matching `WebFetch` running `hooks/sdd-cache-post.sh` with `async: true`. Add `.claude/sdd-cache/` to `.gitignore`. Paths use `${CLAUDE_PROJECT_DIR}`; use absolute paths if the hooks live outside the project.

Behaviour: on `PreToolUse`, if `.claude/sdd-cache/<sha256(url)>.json` exists, HEAD with `If-None-Match` / `If-Modified-Since`; on 304, exit 2 with the cached body on stderr, prefixed `[sdd-cache] Cache hit for <url>` and fenced by BEGIN/END CACHED CONTENT markers, which Claude Code returns to the agent as a tool error carrying the content; otherwise exit 0 and the fetch runs. On `PostToolUse`, capture the response, HEAD once more to record validators (Claude Code does not expose the headers WebFetch received, so every miss costs one extra round trip), store `{url, prompt, etag, last_modified, content, fetched_at}`.

Caveats stated by the authors: the stored body is WebFetch's model-processed reading under the first caller's prompt, not raw HTML, so the prompt is surfaced on hits and the agent decides whether it fits; a server that wrongly returns 304 is a server bug, not papered over with a TTL; cache is local and per project. Debug log via `SDD_CACHE_DEBUG=1` or a `.claude/sdd-cache/.debug` sentinel. Smoke tests pipe fake hook payloads into the scripts; a freshness test corrupts one entry's ETag and expects a miss.

## Evidence

Read from the hook README; scripts not executed. The exit-2-with-stderr mechanism for returning content through a blocked tool call is the authors' reading of Claude Code hook semantics and matches the documented PreToolUse behaviour (exit 2 blocks and feeds stderr to the model) but was not re-verified for this note.

## Open questions

- For this repo: `scripts/read.ts` could record `ETag` and `Last-Modified` in `inbox/reads.log` and skip unchanged pages during validation link checks. Separate ticket.
