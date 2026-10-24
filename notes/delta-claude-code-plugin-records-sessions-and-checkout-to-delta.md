---
title: The delta-claude plugin records a Claude Code session, including thinking, tool I/O and untracked checkout files, to Zed's servers, with a per-repository policy that can upload every session automatically
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/zed-industries/delta-claude
  - https://raw.githubusercontent.com/zed-industries/delta-claude/main/README.md
  - https://delta.dev/docs/whats-in-the-latest
  - https://delta.dev/docs/privacy-and-security/data-storage
  - https://delta.dev/pricing
tags: [delta, claude-code, plugins, collaboration, privacy]
applies_to: [claude-code@2.1.303+, delta-claude@0.1.x]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Zed publishes a Claude Code plugin, `delta-claude` (AGPL-3.0, in the zed-industries GitHub organisation), that gives a Claude Code session a URL: the conversation and the Git checkout it works in are recorded to Delta so a teammate can join from their own Claude Code, from the browser, or from the Delta app. The upload is the whole session, not a summary: messages, tool inputs and outputs, Claude's thinking, and the staged, unstaged and untracked non-ignored files of the checkout. A repository-level setting chooses whether that happens on every session or only on an explicit share.

## When to use

- You want a second person, or a second agent, to pick up a Claude Code session with its context instead of a diff and a description.
- You want to evaluate Delta's review model without leaving Claude Code; see [review is a forked subthread](delta-review-is-a-forked-subthread-with-change-guide-and-verdict-snapshot.md).
- Not when the repository or conversation must stay on your machine: everything recorded goes to Zed's servers, see Facts.

## Facts

- Requires Claude Code 2.1.303 or newer; older versions warn but are not blocked. Install from inside Claude Code (quoted from the README, not run here):

  ```text
  /plugin marketplace add zed-industries/delta-claude
  /plugin install delta@zed-industries
  ```

- The plugin needs the `delta` CLI. If it is missing, the plugin installs it the first time you set up syncing, share or join. On Windows it asks first and runs the official installer; background discovery never installs anything. At startup it checks for Delta updates in the background and only notifies.
- `/delta-setup` picks a team and one of three policies per repository, saved to `.delta/settings.json` and kept out of Git: private sync (every session uploads, only you see it), team sharing (every session uploads and is shared), manual (uploads only on `/delta-share`). Setup is offered once per repository, right after install or on the first session in an unconfigured repository.
- `/delta-share [email...]` syncs the current session and checkout and picks the audience. `/delta-join <link>` opens a shared thread in a fresh Claude Code session inside the thread's checkout. `/delta-org` lists, switches, invites and manages teams. Sharing and joining need an interactive terminal or Desktop Code tab; headless sessions never open a browser.
- What is stored: the conversation including tool inputs and outputs and thinking, plus the checkout's staged, unstaged and untracked files that are not ignored. Nothing uploads until you share or join, or the repository policy syncs automatically.
- Telemetry: which integration ran each command, plugin version, turn start and end and how it ended. No messages, paths, tool inputs or error text.
- From Delta 0.21.0 (2026-10-21) a shared thread can be opened the other way with Open in Claude Code, and collaborators connected through Claude Code appear in the thread's participant bar labelled with their tool.
- Delta's own storage page: repository contents and Git history, every delta, thread catalogue, Git remote URL, collaborators' GitHub logins, and synced account settings including model-provider API keys (encrypted local cache per device) live on Zed's servers. Storing a thread does not share it; threads are private unless shared or an organisation default is set.
- Personal plan is free with your own keys or external agents. A Zed Business organisation's server-enforced controls apply when selected in Delta.

## Evidence

Read from the README at the repository's main branch and from Delta's docs; the plugin was not installed or run. The README documents behaviour, not outcomes: no data on sync latency, size limits or what happens to a session that exceeds them.

## Open questions

- Whether a synced session preserves Claude Code's permission prompts and sandbox for the joining teammate, or whether the joined checkout runs under Delta's rules; see [Delta agentic safety](delta-agentic-safety-no-permissions-no-sandbox-prepare-script-runs-on-mount.md).
- How Claude Code subagents are represented in the recorded thread. A pull request in the repository proposes recording them as child threads; merge status not checked.
- Whether `/delta-join` honours the joined repository's `.agents/prepare` on the joiner's machine.
