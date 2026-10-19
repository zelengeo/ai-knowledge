---
title: MCP proxy guardrails miss direct harness access, and harnesses cache the MCP tool list
type: concept
status: inbox
evidence: T3
sources:
  - https://wiki.alcidesfonseca.com/blog/lessons-learned-building-fronteira/
tags: [mcp, security, guardrails, codex]
applies_to: []
added: 2026-10-19
last_verified: 2026-10-19
verified_by: agent
---

An MCP proxy that enforces behavioral rules (for example against the lethal trifecta: private read plus external write) only sees calls routed through MCP. Harness-native filesystem, web, desktop, and API access bypasses it.

## When to use

- Evaluating an MCP gateway or firewall as a security control for a coding agent.
- Deciding whether a proxy substitutes for a sandbox.

## Facts

- Harness skills and built-in tools reach files, the web, and APIs directly, so a proxy gives logging and rules for MCP traffic only.
- Skills written for a harness's official integration (the author cites Codex and Gmail) may not find the same service exposed through a proxy.
- The MCP spec lets servers return different tool lists mid-conversation, but the author reports harnesses load the list once and do not refresh it.
- The author reports a Codex DevOps task that changed a Django server root and exposed an email-API token, which was then abused to send spam. Fix was easy once found.
- Combining a policy engine with a sandbox is the reported mitigation (Amazon's Strands SDK with Dogwood), and the author notes remote-browser MCP servers can still evade it.

## Evidence

Single practitioner write-up by the builder of a prototype. Harness behaviours (no tool-list refresh, skill mismatch) are asserted without versions or repro steps. The token-exposure incident is a first-hand post-mortem without logs.

## Open questions

- Which harnesses and versions skip tool-list refresh? Test against the MCP spec's list-changed notification.
