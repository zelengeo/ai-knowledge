---
title: Claude Code puts the account email in model context, the model sometimes copies it into a User-Agent it writes, and the 2.1.317 built-in mod cc-plugin-privacy refuses only shell calls that hold the address and name User-Agent
type: concept
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/issues/107757
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.317
  - https://tin.computer/blog/claude-code-email-user-agent
tags: [claude-code, security, privacy, exfiltration, mods, unattended, web]
applies_to: [claude-code@2.1.x]
added: 2026-11-06
last_verified: 2026-11-06
verified_by: agent
---

Claude Code includes the account email address in the model's context, and when the model writes its own network request (a `curl -A`, a Python `headers` dict) it sometimes puts that address into the User-Agent as contact information, usually when a site's policy asks automated clients to identify themselves. Anthropic's fix is a built-in mod, `cc-plugin-privacy`, enabled by default from 2.1.317, which refuses without a prompt a shell tool call that contains both the account address and a User-Agent reference. By the mod's own description it does not cover WebFetch, WebSearch or MCP tools, an address written into a script and then run, values computed at runtime, or an email sent without a User-Agent reference. Users report the check not firing on a direct test on 2.1.317 through 2.1.319; a maintainer said the account email will be removed from model context in a later release.

## When to use

- You run Claude Code against the public web, attended or not, and the account is a personal or company address: assume any request the model composes may carry it until the context change ships.
- You maintain a deny list for an unattended job, as `docs/security.md` in this repo does: this is the exfiltration shape (threat 2) that a prompt-level instruction cannot stop and a text-matching mod stops only in one form. Keep raw HTTP clients denied and route page reads through a script with a fixed User-Agent.
- You want to know whether it already happened on your machine: the transcript scan below takes a minute.

## Procedure

1. Check the version and the mod: `claude --version`, then `/plugins` and look for `cc-plugin-privacy@builtin` enabled. 2.1.317 or later ships it; updating does not remove its documented limits.
2. Scan past sessions for the address in outbound requests. Transcripts live under `~/.claude/projects/**/*.jsonl`; search them for your address next to `User-Agent`, `-A `, `mailto:` or `headers`. One reporter found two cases this way, one in a `curl -A` and one in a script written with Edit and run with `python3`, which no shell check saw.
3. Read outgoing commands and scripts before allowing network access. A plain-looking script invocation can hide the request in the file it runs.
4. If a site needs a contact, choose it yourself: a project address or page you approve. The login address is not the agent's default to give away. In this repo, `scripts/fetch.ts` and `scripts/read.ts` send a fixed User-Agent that names the project and says "contact via GitHub", with no address.
5. Treat the mod as a courtesy layer. The structural fix is not having the address in context; check later changelogs for it and re-verify this note then.

## Facts

- Issue #107757 (opened 2026-11-05, version 2.1.318, macOS) reports the account email appearing in User-Agent headers of web requests made during research, without the user's permission.
- A Claude Code maintainer replied on the issue: a built-in mod called `cc-plugin-privacy` was introduced in 2.1.317 and later to deterministically block the behaviour; it is enabled by default and can be turned off via `/plugins`. The source of the built-in mod was not yet published at the time of reading.
- The mod's rule, as quoted on the issue from its description: a shell call that holds the account's address and names a User-Agent is refused, with no prompt; a deny beneath keeps its own reason.
- Gaps reported on the issue by users, none reproduced here: a project-name product token with no address passes (`<project>-site-build/1.0`), so the header still ties a request to what the session is working on; an address the model wrote into a script with Edit and then ran with `python3` was not in any checked shell input; `echo 'User-Agent: test <account email>' > /dev/null` ran unrefused on 2.1.317, 2.1.318 and 2.1.319 on macOS with the mod enabled.
- A user request on the issue: for requests the model composes itself, default to a generic User-Agent such as `claude-code/<version>` with nothing taken from the session.
- The tin.computer write-up (2026-11-06) relays a Claude Code team member's explanation on Hacker News: account emails were added to model context to reduce invented names in author tags, and the model sometimes reused the address as contact information when writing a network command. The same write-up relays a statement that the address will be removed from model context in the next release. Both are second-hand here; the issue itself does not contain them.
- The same write-up reports what the mod's published README says it excludes: WebFetch, WebSearch and MCP tools, scripts containing the address, values computed at runtime, and emails sent without a User-Agent reference, and that it calls itself a courtesy, not a boundary.
- The write-up's own measurement: between 2026-10-27 and 2026-11-05 it counted 275 requests to two sites with the standard `Claude-User (claude-code/...)` header and none carried an address; five custom tool-named User-Agents with redacted addresses hit one article on 2026-10-31. It does not establish that Claude Code made those five requests.
- The 2.1.317 changelog line reads "a check that asks before a web or shell tool call sends your account email address to the network", which is broader than the refuse-without-prompt rule the mod describes. The 2.1.318 and 2.1.319 changelogs carry no line on this.
- Observed in the scheduled-task session that wrote this note (2026-11-06, desktop app): the session context named the account email for attribution and carried an instruction not to send it to unrelated services or put it in a User-Agent when a site asks automated clients for contact details. That is an instruction to the model, not a machine check.

## Evidence

The issue is on the vendor's GitHub organisation, so the maintainer's statement of the fix and its version is T1. The gap reports on the issue are user reports (T3) and were not reproduced here. The tin.computer write-up is T2 for its own request-log count and T4 for what it relays from Hacker News; the relayed cause and the "next release" statement are recorded as hearsay and should be replaced by a changelog line when one exists. Nothing on either page was acted on.

## Open questions

- Whether the account email is removed from model context in a later release, and in which. Re-verify against the changelog.
- Whether the mod's check runs on `PreToolUse` for Bash only or also for PowerShell on Windows; the issue reports are all macOS.
- Whether the 2.1.317 changelog's "asks before" and the mod's "refused, with no prompt" describe one check or two.
- What the standard `Claude-User (claude-code/<version>; +https://support.anthropic.com/)` header is sent by (WebFetch, WebSearch, both) and whether a model-composed `curl` ever inherits it.
