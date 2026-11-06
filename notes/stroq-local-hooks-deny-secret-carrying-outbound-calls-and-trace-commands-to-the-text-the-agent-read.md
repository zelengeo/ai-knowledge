---
title: Stroq adds local hooks to Claude Code, Codex CLI and Cursor that deny curl-pipe-sh and outbound calls carrying a known secret, ask when a command repeats text the agent read, and replay past transcripts to show which commands came from read content
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/AGGIB/Stroq
tags: [security, hooks, exfiltration, prompt-injection, claude-code, codex, cursor, unattended, candidate]
applies_to: [stroq@0.30.0]
added: 2026-11-06
last_verified: 2026-11-06
verified_by: agent
---

Stroq (AGGIB/Stroq, Apache-2.0, TypeScript, Node 22 or newer) is a local hook layer for coding agents. Before an action runs, its hooks deny `curl | sh` and outbound calls that carry a known secret from the machine, and ask first when a command repeats text the agent read, naming that text. After the fact, `stroq replay` reads the agent's own transcripts from the last 30 days and shows which commands came from content the agent read, and `stroq sent` says where each known key went (sent to another company, maybe sent, seen by the AI, used with its own service, blocked). It prints key names, never values, writes only a cache under `~/.stroq`, and makes no outbound calls. Recorded here as a candidate for the machine-check gaps in `docs/security.md`; nothing was installed or run.

## When to use

- You run an agent that reads strangers' text and then runs commands, as this repo's daily job does, and want a deterministic check on the two shapes `docs/security.md` names as threats 1 and 2: install-and-run, and sending a secret out. The provenance rule ("this command repeats text you just read") is the one check this repo does not have in any form.
- You want a one-off audit of past sessions without installing a hook: `stroq replay --all` and `stroq sent` read local transcripts only, per the README. Human decision; they read `~/.claude`, `~/.aws/credentials`, `~/.npmrc` and project `.env` files.
- Not a sandbox and not a substitute for one: the README says matching is text-level, a command the model writes from scratch does not trace back to a source, and a key can leave in a script, a file or a variable without showing in a command.

## Facts

As stated in the README, read 2026-11-06:

- Install and run: `npx @stroq/cli` prints a card of your own sessions; `init` hooks into the agent; `why` explains a stopped action; `attack` runs known attacks against the policy in a sandbox; `uninstall` removes it. From source: `pnpm install --frozen-lockfile`, `pnpm platform:build`.
- Before each action: native hooks for Claude Code, Cursor, Codex, Copilot CLI, Windsurf and Antigravity, a plugin for OpenClaw, and a stdio MCP proxy. Outbound calls containing a known secret can be denied; provenance ties later actions to the tool output they repeat. A question about a value copied from text the agent read is asked once per session in Claude Code, unless the session has started something in the background.
- After the fact: `replay` and `sent` read local session records, including sessions from before Stroq was installed. The verdicts are today's policy's, not a record of what happened at the time. A local transcript match does not by itself prove delivery to a model provider.
- Console: a private page on 127.0.0.1 with Check, Live (each decision opens into its chain: what the agent read, what it did, the decision, the rule), Agents (add or remove hooks with the exact file change shown first, and which of an agent's settings weaken it), Skills & MCP (every skill and MCP server by agent, what the rules matched, what changed), and Rules (try an action without running it, turn rules on with a preview and a test, history with undo). Adding hooks from the console needs macOS or Linux; on Windows use `stroq init`.
- Self-reported coverage: `stroq attack` runs 36 attacks from public reports and synthetic cells in a throwaway home; on 0.30.0, 15 are denied, 21 asked about, 0 pass through.
- Stated limits: a hook sees only what the host sends it, and that differs by agent and version; matching is text-level; it is a filter, not a sandbox; `sent` names a send only when it sees the key in the command that sent it.
- No account, no telemetry; the hooks make no outbound network calls.

## Evidence

Everything above is the project's own README on its own GitHub repository, so the facts about what the tool does are T1 by the origin rule in `docs/rubric.md`. The attack-coverage numbers are the vendor's own measurement with the method stated only in outline (36 attacks, throwaway home, one version), so they are T3 and are not evidence that the hooks stop a real injection. No command from the README was run and nothing was installed; the reader flagged the page for `install-command`, which is expected for a tool README. The HN thread (89 points) was not read.

## Open questions

- Whether its Claude Code hook coexists with the deny list in this repo's `.claude/settings.json`, and which runs first.
- Windows support beyond `stroq init`: the console cannot add hooks there, and this repo's job runs on Windows with the PowerShell tool.
- Whether a replay of this machine's daily-job transcripts would find anything the reads log does not already show. Human decision; see the second bullet under When to use.
- How the provenance rule handles a fetched page's text that the agent legitimately quotes into a note file, which is this job's normal output.
