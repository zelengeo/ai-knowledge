---
title: When an agent repeats a mistake, fix the class at the highest level that works (architecture, then types, then a lint whose error names the fix, then a test, docs last) and keep a table pairing each rule with its enforcer
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/correct/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/skills/principle-encode-lessons-in-structure/SKILL.md
tags: [pstack, agents-md, hooks, lint, architecture, enforcement]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack's `correct` skill assumes every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. It mines commits, reverts, review comments and workaround comments for mistake classes (a class counts after two occurrences), then fixes each at the highest level that works: remove the possibility with architecture (one owner per state, one supported way, hide internals so the wrong import fails); make the bad state unwritable with types; add a lint or CI check whose error names the file, type or function to use instead; fix or delete tests that pass when behaviour breaks; and write docs or agent rules last, only for judgment calls, because nothing fails when an agent skips them.

## When to use

- The human has corrected the agent for the same thing twice. Same trigger as [the pre-commit hook note](precommit-hooks-enforce-conventions-on-agents.md) and [the PreToolUse hook note](aihero-pretooluse-hooks-enforce-cli-rules-deterministically.md); this note adds the ordering above hooks and lints.
- Reviewing an AGENTS.md that has grown a list of "never do X" rules. Each is a candidate for a higher level.

## Procedure

1. Read recent commits, reverts, review threads, agent instruction files, and comments that explain workarounds. Group into classes. Two occurrences make a class.
2. For each class, try architecture first, then types, then lint or CI (if the pattern is already common, fail only on new additions), then a behaviour test, then docs.
3. Fix the most frequent classes now, one commit each. Prove each new check fails on a real past mistake. Run the same command locally and in CI. An exception sits on the offending line with a reason, an expiry date, and a human's approval.
4. Keep a table in the agent instruction file pairing each rule with what enforces it. When the human corrects you again, fix the mistake and add the rule. A rule that was already there with no enforcer is a repeat: raise its level in the same change. Drop a rule once its mistake cannot happen.
5. Reply with each class, its evidence, the level chosen, and why a higher level did not work.

## Evidence

Read from the skill file and the `encode-lessons-in-structure` principle ("encode the rule as a lint, metadata flag, runtime check, or script instead of more text"). This agrees with the T2 observation in the pre-commit note that a failing check got compliance where AGENTS.md did not. pstack publishes no before-and-after counts of its own.

## Open questions

- The rule table lives in the agent instruction file, which this repo's security doc treats as an instruction, not a check. The table is an index to enforcers, not an enforcer; the check is whether every row has one.
