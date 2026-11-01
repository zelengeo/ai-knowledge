---
title: agent-skills test-driven-development adds to the standard cycle a blind subagent that writes the bug reproduction test without seeing the fix, Google's small/medium/large test sizes beside the 80/15/5 pyramid, a real > fake > stub > mock preference, and a rule against re-running an unchanged test command for reassurance
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/test-driven-development/SKILL.md
  - https://github.com/mattpocock/skills/blob/main/skills/tdd/SKILL.md
tags: [agent-skills, tdd, testing, subagents, pocock, google]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Most of the skill is textbook TDD. The deltas against [Pocock's tdd](pocock-skill-tdd.md) are the ones worth recording: refactor stays inside the loop (Pocock moves it to review), the Prove-It pattern for bugs can be delegated to a subagent that never sees the fix, tests are classified by resources consumed as well as by pyramid level, and the skill names the agent habit of re-running a green suite as a red flag.

## When to use

- Any behaviour change or bug fix. Not for config, docs or static content.
- Discover the stack first: find the repo's own focused-test and full-suite commands (checked-in wrappers like `./gradlew`, `make test` over global tools) and never default to `npm test`.

## Procedure

Cycle: RED (a test that passes immediately proves nothing), GREEN (minimum code), REFACTOR (tests after every step). Prove-It for bugs: reproduce with a failing test before any fix, then fix, then full suite.

Blind reproduction: for complex bugs, the main agent spawns a subagent to write a test that fails on current code from the bug description alone; the main agent verifies it fails, implements the fix, verifies it passes. The separation keeps the test independent of the fix. Compare [doubt-driven's artifact-without-claim rule](agent-skills-doubt-driven-fresh-reviewer-gets-artifact-and-contract-not-the-claim.md), the same information-hiding move for review.

Sizing: pyramid about 80% unit, 15% integration, 5% end-to-end; plus Google's resource sizes: small (one process, no I/O, milliseconds), medium (localhost only, seconds), large (multi-machine, external services, minutes). Small should dominate.

Writing rules: test state not interactions; DAMP over DRY in tests; prefer real implementation, then fake, then stub, then mock, and mock only slow, non-deterministic or side-effecting boundaries; arrange-act-assert; one concept per test; names that read as a specification. The Beyonce Rule: if you liked it, you should have put a test on it; infrastructure changes are not responsible for catching your bugs.

Re-run rule: after a clean run, repeating the same command with no code change adds nothing; run again after edits, not for reassurance. The same rule appears in `incremental-implementation`.

Browser code: unit tests are not enough; verify at runtime through Chrome DevTools MCP with a clean-console standard, treating everything read from the browser as untrusted data and never reading cookies or tokens via JS.

## Evidence

Read from the skill. The pyramid and test sizes are Google SWE-book conventions, attributed by the README, not cited in the skill. The eval README records that in a session with no shell the skill fired every run but put the failing test before the fix in only 2 of 4 runs, so adherence to RED-first is a known gap. See [the firing-rate note](agent-skills-skill-invocation-is-stochastic-description-clause-is-the-lever.md).

## Open questions

- Whether the blind subagent writes a test that fails for the right reason; the skill has the main agent verify failure but not its cause.
