---
title: Delta runs agents with no permission prompts and no sandbox, and executes a repository's `.agents/prepare` script and `.envrc` the moment it mounts a checkout
type: tool
status: inbox
evidence: T1
sources:
  - https://delta.dev/docs/privacy-and-security/agentic-safety
  - https://delta.dev/docs/concepts/worktrees
  - https://delta.dev/docs/concepts/delta-and-git
  - https://rohitghumare.com/blog/zed-delta-after-pull-requests/
tags: [delta, sandboxing, security, unattended, worktree-trust]
applies_to: [delta@0.21.0]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Delta (Zed's agent app, public beta since 2026-09-16) ships with none of the safeguards Claude Code users take for granted: the agent never asks before a tool call, it is not sandboxed, and opening or joining a repository runs code from that repository before the agent starts. Zed states all three limits on its own safety page and lists the fixes as roadmap items. Treat a Delta checkout as an unattended agent with full device access, and treat joining a stranger's shared thread as executing their repository.

## When to use

- Before installing Delta or the [Claude Code plugin](delta-claude-code-plugin-records-sessions-and-checkout-to-delta.md) on a machine that holds credentials.
- Before joining a shared thread for a repository you did not clone yourself.
- When writing CODEOWNERS or a merge gate for a repository that Delta threads will land into; see [land is a skill, not a gate](delta-land-changes-is-an-agent-run-skill-not-a-remote-enforced-gate.md).

## Facts

- No permission system. The agent acts autonomously and does not ask before calling tools, including destructive calls.
- No sandbox. An agent has unrestricted access to the device where it runs. A collaborator's message runs the agent on the collaborator's machine, against their checkout.
- Code runs on mount. When Delta first mounts a managed checkout it runs an executable `.agents/prepare` (or the `.delta/prepare` override) from the checkout root, before the agent starts. Adopted existing checkouts are skipped. The script runs on every new thread and every re-created checkout.
- `.envrc` runs. On macOS and Linux an `.envrc` that applies to the checkout runs through `direnv` when an interactive terminal or an agent command starts, and Delta allows it if direnv has not seen it before.
- Repository files become instructions. `AGENTS.md`, `.agents/skills/` and `.delta/skills/` are loaded as agent instructions without a trust prompt. A skill in the repository marked `metadata.delta-action: land` becomes the merge procedure.
- No worktree trust. Delta does not ask you to review settings or configuration in a shared repository before loading them. Zed names "agent permissions, sandboxing, and Delta worktree trust controls" as planned.
- Early-access terms apply: use is at your own risk under Delta's Early Access Agreement.

## Procedure

1. Run Delta on a machine or VM with no production credentials, deploy keys or password-manager session. Until permissions ship there is no narrower blast radius.
2. Before joining a shared thread or opening a repository you do not control, read `.agents/prepare`, `.delta/prepare`, `.envrc`, `AGENTS.md` and everything under `.agents/skills/` and `.delta/skills/`.
3. In repositories you own, put those paths under CODEOWNERS with code-owner review required, so an agent or teammate cannot change the agent's instructions or the mount-time script in a thread and have it land.
4. Keep ignored files out of the sync: Delta imports tracked files even when they now match an ignore rule, so `git rm --cached` a secret before opening the repository, then rotate it.

## Evidence

The limits are stated verbatim on Zed's safety page, dated to the current beta. The mitigations in the procedure are Ghumare's (2026-09-17, checked against the docs 2026-09-25), marked by him as not run. Compare Claude Code, where permission modes and the sandbox are first-class, and the repo's rule for unattended runs is sandbox first, see [aihero-ralph-loop-hitl-first-then-afk-in-a-sandbox](aihero-ralph-loop-hitl-first-then-afk-in-a-sandbox.md).

## Open questions

- Whether a session synced through the Claude Code plugin keeps Claude Code's own permission prompts and sandbox. The plugin runs inside Claude Code, but the prepare script runs through the `delta` CLI on mount; unverified.
- Whether Delta Business organisations get server-enforced controls that narrow any of this; the pricing page says Business "data and privacy controls" apply in Delta but does not list them.
