---
title: Cursor's marketplace served a backdoored Anthropic.claude-code extension (2.1.312 and 2.1.313) for eleven hours on 2026-10-29; detect it by the svc-telemetry key in authorized_keys, and treat IDE agent extensions as unsigned dependencies with an install cooldown
type: concept
status: inbox
evidence: T1
sources:
  - https://cursor.com/blog/claude-code-extension-security-notice
  - https://cursor.com/help/customization/extensions
  - https://news.ycombinator.com/item?id=50304129
  - https://news.ycombinator.com/item?id=50300683
tags: [claude-code, cursor, supply-chain, security, vscode, extensions, unattended]
applies_to: [cursor, claude-code-vscode@2.1.312, claude-code-vscode@2.1.313]
added: 2026-11-01
last_verified: 2026-11-01
verified_by: agent
---

On 2026-10-29, between about 02:27 and 13:35 Pacific time, the Cursor VS Code Extension Marketplace served versions 2.1.312 and 2.1.313 of `Anthropic.claude-code` for Windows and macOS that Anthropic did not build or publish. The modified `extension.js` collected host details, appended an attacker SSH key labelled `svc-telemetry` to `authorized_keys`, tried to enable the local SSH service and open a reverse SSH tunnel, and installed persistence (a LaunchAgent on macOS, a scheduled task plus a Startup-folder script on Windows). The official VS Code Marketplace and Open VSX were not affected. The practical lesson for anyone running a coding agent through an IDE extension: the extension is an unsigned dependency with a publisher string, not a signed artifact from the vendor, and a marketplace proxy with "automated malware and supply-chain analysis" did not catch an SSH backdoor with no obfuscation.

## When to use

- You installed or updated the Claude Code extension in Cursor on macOS or Windows on 2026-10-29: run the check below regardless of how the install went.
- You administer Cursor for a team: set the marketplace install cooldown and consider requiring extension signature verification.
- You evaluate any coding-agent IDE extension: ask where it is served from and what, if anything, binds the publisher name to the vendor.

## Procedure

1. Check for the key. macOS or Linux: `grep -qs svc-telemetry ~/.ssh/authorized_keys`. Windows PowerShell: search `$HOME\.ssh\authorized_keys` and `C:\ProgramData\ssh\administrators_authorized_keys` for `svc-telemetry`. A hit means the host is impacted.
2. If impacted, do not stop at uninstalling the extension: the payload dropped standalone persistence scripts that keep retrying the tunnel about every 60 seconds. Remove the key, the persistence (`~/Library/LaunchAgents/com.apple.sysmond.plist` on macOS; scheduled task `SysMon` and `sysmon.cmd` in the Startup folder on Windows; `~/.config/.smt`, `.smtk`, `.stk_<hex>` files), kill the tunnel processes (`ssh -N -R`, `autossh -M 0`), and decide whether to rebuild the host. Cursor published remediation scripts for both platforms; read them before running anything, and rotate credentials reachable from the host from a trusted machine.
3. For a team: Cursor Team settings, Security & automation, "Marketplace Install Cooldown (hours)". Default is 0 (disabled). A value above 0 applies fleet-wide and overrides per-user `extensions.installCooldownHours`. Enterprise teams can also turn on "Require Extension Signature Verification" for Open VSX signatures.
4. For an individual: set `extensions.installCooldownHours` in Cursor settings. Pin or defer extension updates the same way you would a dependency with no lockfile.

## Facts

- Cursor's notice: the malicious versions were live between about 2:27am PT and 1:35pm PT on 2026-10-29. Enabling the SSH service needs admin rights, which the extension does not have on most macOS and Windows hosts, so on those hosts the tunnel step failed; the key was still added, persistence still installed, and host details (hostname, username, OS, architecture, home directory, environment variable names, working directories, Git email, public IP) were still sent. The attacker server was taken offline with the hosting provider. Cursor removed the version, shut the whole marketplace down, audited access, rotated keys, and rebuilt the marketplace.
- Indicators: attacker endpoint `134.209.82.225` (beacon on port 8099, reverse SSH on port 22), key comment `svc-telemetry`, key fingerprint `SHA256:0Z6R+DF64Do2nwQic8a7kkfDLNNk4IiK+2U2Rci4htk`, modified VSIX hashes listed in the notice.
- Cursor's extensions help page states that Cursor uses Open VSX for third-party extensions behind its own proxy, `marketplace.cursorapi.com`, which runs automated malware and supply-chain analysis before an extension is shown or served, and that the same `publisher.extension` name can point to different publishers or code on Open VSX than on the Microsoft Marketplace: "Treat extension IDs like dependencies: install from publishers you trust."
- Anthropic's statements exist only as Hacker News comments by Anthropic employees: it was not a compromise of Anthropic's systems or employee laptops; a malicious actor used access to Cursor's marketplace to publish a tampered copy; official channels (VS Code Marketplace, Open VSX) are unaffected; there is no legitimate 2.1.313 of the extension. No post on an Anthropic domain was found by this run.
- Cursor's notice does not give a root cause (how the actor gained publish access). The HN thread's root-cause claims are commentary.

## Evidence

- T1 for the incident facts, indicators and remediation: Cursor's own notice on cursor.com, updated 2026-10-30. T1 for the cooldown and signature settings: Cursor's help page.
- T4 for Anthropic's position: HN comments attributed to Anthropic staff, not an Anthropic page. Cited for completeness; the tier of this note rests on the Cursor sources.
- Not reproduced here. This machine runs Claude Code in the desktop app and a terminal, not through Cursor; the `authorized_keys` check was not run as part of the daily job.

## Open questions

- Root cause of the publish access is not public as of 2026-11-01. Whether Cursor's proxy mints its own publisher namespace, so that "Anthropic" was claimable, or whether a real publisher credential was used, decides which mitigation (signing versus namespace verification) addresses it.
- Whether the Claude Code extension on Open VSX is signed, and whether Cursor's "Require Extension Signature Verification" would have blocked a tampered upload through Cursor's own proxy rather than Open VSX.
- What the analogue is for other coding-agent distribution channels this repo touches: Claude Code plugins and marketplaces, MCP server registries, and `npx`-installed CLIs all have the same unsigned-publisher-string shape.
