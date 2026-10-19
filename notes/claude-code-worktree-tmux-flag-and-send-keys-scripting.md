---
title: claude --worktree --tmux isolates a task; script a running agent pane with literal send-keys
type: technique
status: inbox
evidence: T1
sources:
  - https://code.claude.com/docs/en/cli-reference
  - https://crystl.dev/guides/tmux-for-ai-agents/
tags: [claude-code, tmux, worktree, unattended]
applies_to: [claude-code@2.1.x]
added: 2026-10-19
last_verified: 2026-10-19
verified_by: agent
---

`claude --worktree [name] --tmux` starts Claude Code in a new git worktree with its own tmux session. For scripting an agent pane you already run in tmux, send text with `send-keys -l`, wait, then send Enter as a separate call.

## When to use

- One agent on one branch, isolated from your working tree: use the flag, build nothing by hand.
- Driving an agent from cron, a git hook, or another agent through tmux.

## Procedure

1. Single agent: `claude -w feature-auth --tmux`. `--tmux` errors without `--worktree`.
2. On iTerm2 the flag uses native panes, not tmux. Pass `--tmux=classic` if you plan to script against the session.
3. Send a prompt to a pane: `tmux send-keys -t api:auth -l "$PROMPT"`, `sleep 0.3`, `tmux send-keys -t api:auth Enter`.
4. Read back: `tmux capture-pane -p -J -S -200 -t api:auth` (`-J` rejoins wrapped lines).
5. Open new panes with `-c '#{pane_current_path}'` or the agent starts in the wrong directory.

## Evidence

The flag semantics (requires `--worktree`, iTerm2 native panes, `--tmux=classic`) are in the official CLI reference. The `send-keys` details (`-l` avoids key-name lookup, the delay before Enter, `\;` escaping) come from a vendor guide for a tmux-based product, with no stated test method; treat them as reported, not reproduced.

## Open questions

- The 0.3 s delay is a guess from one guide; the real constraint is the TUI's input debounce, which may change between versions.
- Scraping `capture-pane` for agent state ("esc to interrupt") breaks when the TUI changes strings.
