---
title: Parallel agent checkouts need a fast committed prepare script, shared ignored config, and ports and database names that are not constants, whether the checkouts are Delta worktrees or git worktrees
type: technique
status: inbox
evidence: T1
sources:
  - https://delta.dev/blog/escaping-the-tyranny-of-worktrees
  - https://delta.dev/docs/concepts/worktrees
  - https://delta.dev/docs/concepts/delta-and-git
tags: [delta, worktrees, parallel-agents, project-setup, claude-code]
applies_to: [delta@0.21.0]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Delta gives every thread an isolated checkout by default and treats that directory as disposable: removed when the thread is archived, re-created on demand from the recorded history. Conrad Irwin's post on why Delta does not use git worktrees ends with the part that transfers to any tool running several agents in one repository: temporary checkouts only work if setup is repeatable from a clean clone, if git-ignored config is shared rather than hand-crafted per directory, and if nothing the project runs hard-codes a port, a database name or a container name. Claude Code's `--worktree` flag has the same requirements; see [claude-code-worktree-tmux-flag-and-send-keys-scripting](claude-code-worktree-tmux-flag-and-send-keys-scripting.md).

## When to use

- Preparing a repository for more than one concurrent agent, in Delta or with git worktrees.
- Diagnosing "works in my checkout, fails in the agent's": the usual cause is state that lives in a directory nobody committed.

## Facts

- A Delta worktree is not a git worktree. Each thread's worktree lives in DeltaDB; a checkout is where Delta materialises it on one machine while in use. Each managed checkout has its own git clone (Zed says it uses tricks to make them cheap), so several threads can work on the same branch, which git worktrees forbid.
- New isolated threads fetch the remote and start from the repository's default branch, or a branch you set with Make default branch for Delta worktrees. The fetch does not touch your primary checkout. If the fetch fails the thread starts from local commits and may be behind.
- Managed checkouts live under `.delta/` inside your clone when you have one connected, otherwise in a fully managed directory. Archiving a thread removes its managed checkout; checkouts you chose to work in are left alone.
- `.agents/prepare` (or `.delta/prepare`) runs from the checkout root on every mount, before the agent starts. It must be fast because it runs per thread creation. Adopted existing checkouts skip it.
- `.agents/linked` lists git-ignored paths that Delta symlinks to a shared location on the machine, so every checkout sees the same values.
- Separate checkouts share the machine's ports, processes, containers, caches and databases.
- Adopting the primary checkout is allowed (and since September, an existing git worktree too) but gives up isolation; Zed says it should be the exception.

## Procedure

1. Commit a prepare script that only configures: write env files from templates, link caches, generate local settings. Do not install dependencies in it; most threads will not need them and it would run on every thread.
2. Put each git-ignored config file that should be identical across checkouts in `.agents/linked` (Delta) or generate it in step 1 (git worktrees).
3. Make the dev server port, test database name and container project or volume names configurable through the environment, and have the prepare script pick distinct values per checkout.
4. Share build caches across checkouts at the machine level (Irwin's example: pnpm's content-addressed store over npm).
5. If something must run against the exact current state of your working copy, adopt the primary checkout for that one thread and accept the loss of isolation.

## Evidence

Author's practice at Zed, stated as what made Delta workable for the team; no measurements. The mechanics (prepare, linked, fetch-on-create, checkout locations) are in the docs at 0.21.0.

## Open questions

- How `.agents/linked` behaves when a linked file needs a per-checkout value (a port), which contradicts "same values everywhere".
- Prepare is executable code from the repository that runs on mount with no trust prompt; see [Delta agentic safety](delta-agentic-safety-no-permissions-no-sandbox-prepare-script-runs-on-mount.md).
