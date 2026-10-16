---
title: teach runs a multi-session course from a dedicated directory with cited HTML lessons; verify procedural content against its sources before trusting it
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md
  - https://aihero.dev/skills-teach
tags: [pocock-skills, productivity, learning]
applies_to: [mattpocock-skills@1.2.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/teach` turns the current directory into a stateful teaching workspace: `MISSION.md`, `RESOURCES.md` (vetted sources, parametric knowledge treated as untrusted), numbered `lessons/*.html`, `reference/*.html` cheat-sheets, `learning-records/*.md`, reusable `assets/` components. Each lesson is one sitting, cites sources, and names one primary source to read yourself.

## When to use

- The learning is the project: a language, framework, new codebase, certification, or a non-code subject (the larger part of the field record).
- Not for one explanation in passing (just ask), not for a cited document (`research`), not for sharpening thinking you already have (`grill-me`). Mid-grilling, `handoff` out to a teaching workspace rather than derailing the grill.

## Procedure

1. User-invoked (`disable-model-invocation: true`). Run it in a dedicated repo, not the project you work in, and name the directory explicitly.
2. Empty directory: it interviews you for the mission first. Then it fills `RESOURCES.md` before writing lessons.
3. Each lesson is its own invocation; the folder, not the conversation, is the continuity (`/teach next lesson for <topic>` in a fresh session).
4. State prior knowledge and gaps up front; there is no assessment step. Ask for review or drilling explicitly; it will not propose the switch.

## Evidence

- Upstream claims: storage strength over fluency via retrieval, spacing, interleaving; reuse-first components since 1.0.1.
- Demonstrated: `./` resolves against two roots, so lessons have been written into `~/.claude/skills` (issue #377); the correct quiz answer lands in slot A 33 of 33 times across nine lessons (#335); a 2x2 Rubik's cube course taught fabricated move sequences; `GLOSSARY-FORMAT.md` ships but is no longer linked (#559); no spaced-repetition scheduling or exit criteria; output quality varies sharply by model, harness and effort.
- Unchanged between 1.2.3 and 1.3.1.
- No eval data is published.

## Open questions

- Our delta: none yet.
- The user profile in memory says no social networks; the skill's "wisdom" pointers to communities may not fit.
