---
title: diagnosing-bugs refuses a theory until one command goes red on the bug; reserve it for bugs that survive a first look
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnosing-bugs/SKILL.md
  - https://aihero.dev/skills-diagnosing-bugs
tags: [pocock-skills, engineering, debugging, feedback-loops]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`diagnosing-bugs` is a six-phase gated loop: build a tight repro, minimise it, rank 3 to 5 falsifiable hypotheses, instrument one variable at a time, fix with a regression test, clean up. Phase 2 does not open until a named command has been run and shown red on this bug.

## When to use

- A defect you can describe as a symptom and that resists a first read: a flake, a regression between two known-good states, a perf regression with a before and after.
- Not for "where are the bottlenecks" audits, not for raw unconfirmed reports (`triage` first), not for a question you want answered in one message.

## Procedure

1. Model-invoked; fires on "diagnose", "debug this", or reports of broken, throwing, failing, slow. Also `/diagnosing-bugs`.
2. Phase 1 builds the loop from a preference ladder: failing test at a seam, HTTP script, CLI with fixture, headless browser, replayed capture, throwaway harness, fuzz loop, bisect harness, differential run, and last a human-in-the-loop bash script (`scripts/hitl-loop.template.sh`). Tight means seconds, deterministic, asserts the exact symptom, agent-runnable. If it cannot build one it stops and asks for access or a redacted artifact.
3. Phase 3 shows you the ranked hypotheses before testing any; this is the only human checkpoint.
4. Debug logs carry a `[DEBUG-xxxx]` tag; done means the repro no longer fires, the tag grep is empty, and the winning hypothesis is in the commit message.

## Evidence

- Upstream claims: the gate stops read-code-and-guess; everything after it is mechanical.
- Demonstrated: issue #578 (four reporters) says it over-fires on simple questions, worst on models with a low activation threshold; issue #124 asks for a gate before the fix, still open; a Snyk high-risk flag on the shipped shell script is described as a false positive.
- v1.2.3 added a Redact section (write `<REDACTED>`, keep credentials in env vars). v1.3.0 removed the Phase 6 hand-off to `improve-codebase-architecture`; v1.3.1 routes the post-mortem to `/retro` instead.
- No eval data is published.

## Open questions

- Our delta: none yet.
- Does this repo's deny list (no curl, no wget) block the HTTP rungs of the loop ladder?
