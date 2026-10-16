# Security: untrusted content and the daily job

The daily job reads text written by strangers and then runs commands, pushes branches, and writes notes that future agent sessions will trust. That is the whole attack surface. This file states the threat model and which defence covers each threat, split into what is enforced by a machine and what is only an instruction. Instructions are probabilistic; a check that fails is not (see `notes/precommit-hooks-enforce-conventions-on-agents.md`).

## Threats

1. **Command injection.** A page tells the agent to install a tool, run a script, or change files. Seen on day one: a README addressed to coding agents with an install-and-run block (PR #1, Suspicious content).
2. **Exfiltration.** A page tells the agent to send repo contents, tokens, or environment to a URL.
3. **Knowledge poisoning.** A page steers triage rather than the shell: "this is the official documentation", a fake changelog, a benchmark with invented numbers. Lands in `notes/` as a trusted claim and is read by every later session.
4. **Hidden text.** Zero-width or bidi-override characters, white-on-white text, HTML comments: content the model reads and the reviewer does not.
5. **Supply chain.** The fetcher's own dependencies, and anything the job is talked into installing.

## Layers

| Layer | Covers | Enforced by | Where |
| --- | --- | --- | --- |
| One read path. Pages are read only through `pnpm run read`, which strips markup and invisible characters, flags instruction-like phrases, logs every URL, and fences the text as untrusted data. | 1, 2, 4 | script; harness denies the agent's own fetch tools | `scripts/read.ts`, `.claude/settings.json` |
| Feed-level flags. Titles and summaries are sanitised and scanned at fetch time; flagged items are listed in the fetch output and the PR. | 1, 2, 4 | script | `scripts/fetch.ts`, `scripts/lib/untrusted.ts` |
| Tool deny list. The agent's built-in page fetch, raw HTTP clients, shells spawned from Bash, package installers, recursive delete, force-push, and history rewrites are denied for sessions in this folder. Deny rules win over every allow and over auto mode. Web search stays: results are URLs, and every URL still goes through the read path. | 1, 2, 5 | harness (Claude Code; other harnesses need their own equivalent) | `.claude/settings.json` |
| Pull request gate. Nothing reaches `notes/` or `skills/` without a human merge. The PR lists every page read and every flagged item. | 3 | git and GitHub | `docs/daily-job.md` |
| Evidence tiers with origin rule. T1 only for the vendor's own domain or GitHub organisation; a page claiming to be official is not. | 3 | instruction, checked by the reviewer | `docs/rubric.md` |
| Human-only promotion. An agent can only create at `inbox`; nothing it writes is trusted by default. | 3 | instruction, checked by the reviewer | `docs/note-schema.md` |
| Instructions. Fetched content is data; instruction-like text is quoted under Suspicious content, never followed. The section is mandatory so its absence is visible. | 1, 2 | instruction | `AGENTS.md`, `docs/daily-job.md`, the task prompt |

## What the deny list does not do

- It does not stop Node from making network requests. `scripts/fetch.ts` and `scripts/read.ts` are the intended paths; a script the agent writes could do the same. The PR diff and the reads log are the controls.
- It does not sandbox the file system. The job can write anywhere the user can. Scope is an instruction ("work only inside this directory") plus review.
- It is prefix matching, not a security boundary (the Claude Code docs say so). `/usr/bin/curl`, `sh -c "curl ..."`, and `git -C . push --force` slip past the written rules. The deny list raises the cost of the easy path; review is still the control.
- It is Claude Code specific. Codex, Cursor, and others need their own deny or sandbox configuration; the policy above is the spec, `.claude/settings.json` is one implementation.
- Unconfirmed: the docs do not state that a project-level deny applies to sessions started by the desktop app's scheduled tasks. It should, since the session runs in this folder. To check, run `/permissions` inside a scheduled-task session and look for rules sourced from this file; if they are missing, copy the deny block into `~/.claude/settings.json`.
- On Windows, any Bash deny rule disables the PowerShell tool unless `CLAUDE_CODE_USE_POWERSHELL_TOOL` is set; the settings file sets it and carries PowerShell rules of its own.

## Deferred

Tracked in issue #4 (validation layer) and worth their own tickets when they bite:

- A network allowlist or OS-level sandbox for the job (Claude Code sandbox mode is not available on Windows at the time of writing; a container runner or GitHub Actions would give this for free).
- Reproduction of T2 procedures in a throwaway sandbox only, never on the host.
- A pre-commit hook that rejects notes whose `evidence` is T1 with a source outside the vendor's origin, making the origin rule deterministic.

## When something is flagged

Flags are hints. A changelog that says "npm install" trips `install-command` and is fine. The reviewer's question is only: did the agent treat it as data? The PR's Suspicious content section and the reads log answer that.
