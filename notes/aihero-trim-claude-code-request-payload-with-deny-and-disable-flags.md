---
title: In Claude Code, bare tool names under permissions.deny and the disableBundledSkills and disableWorkflows flags remove tool definitions from every request, measurably shrinking per-turn input tokens
type: technique
status: inbox
evidence: T2
sources:
  - https://www.aihero.dev/how-to-kill-the-bloat-in-claude-codes-system-prompt
  - https://gist.github.com/mattpocock/5b3d76ea21f5f698aefded47a9cea3b1
tags: [aihero, claude-code, context-engineering, cost]
applies_to: [claude-code@2.x]
added: 2026-10-16
last_verified: 2026-10-26
verified_by: agent
---

Every Claude Code request carries tool schemas, a skills catalogue, and feature instructions you may never use. Matt Pocock's procedure measures that payload with `/context` and a logging proxy, then removes it with settings that already exist: `disableBundledSkills`, `disableWorkflows`, and `permissions.deny` entries using bare tool names. A bare name (`"NotebookEdit"`) removes the definition; a scoped rule (`"Bash(rm *)"`, `"Skill(dataviz)"`) only blocks matching calls and leaves the schema in the payload.

## When to use

- Any long-lived Claude Code setup where cost per turn matters, or where the model has to read past dozens of unused tools.
- Not blindly: background tasks, workflows, and worktree tools look like bloat and are needed for multi-agent runs.

## Procedure

1. Run `/context` and note the per-category token counts.
2. Run the proxy (`node proxy.mjs`, Node built-ins only) and start Claude Code with `ANTHROPIC_BASE_URL=http://localhost:8787`. Each request is logged as markdown with a ranked table of tool sizes.
3. Turn off whole features: `disableBundledSkills`, `disableWorkflows` (and, in the author's config, `disableRemoteControl`, `disableClaudeAiConnectors`, `disableArtifact`).
4. Deny individual tools by bare name in `permissions.deny`. For selective skills, use `skillOverrides` with `"off"` or `"user-invocable-only"`.
5. Restart and re-run `/context`; the difference is tokens no longer sent every turn.

## Evidence

Practitioner post with a worked procedure and one sample proxy readout: 69 tools, 154,946 tool bytes, 65,538 real input tokens, with the `Workflow` tool at about 5,300 tokens as the largest line. The headline saving ("tens of thousands of tokens per turn") is the author's own session, no before-and-after table. The settings names are Claude Code features and should be checked against Anthropic's settings reference and changelog for the version in use; the bare-name versus scoped-rule distinction is the load-bearing claim. The proxy is the author's gist and must be read before running, per this repo's untrusted-download rule.

## Open questions

- Does `permissions.deny` by bare name also remove MCP tools, or only built-ins?
- Measure this repo's daily-job session before and after; it runs headless and may already carry a reduced tool set.
