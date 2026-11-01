---
title: Anthropic's attack-surface-reduction skill runs three passes with a fresh context each, confirms every finding by dynamic trace, and accepts a gate only when the test suite stays identical to baseline
type: technique
status: inbox
evidence: T1
sources:
  - https://www.anthropic.com/research/attack-surface-reduction
tags: [anthropic, skills, security, verification, evals, context-engineering, claude]
applies_to: []
added: 2026-10-23
last_verified: 2026-10-23
verified_by: agent
---

Anthropic's Frontier Red Team ran Claude over 25 open-source projects (more than five million lines of C, C++, Java, PHP and Python) and reports 493 attack-surface issues. The reusable skill they built has a shape worth copying for any analysis skill: three passes, each starting with an empty context window plus a short handoff from the previous pass; an inventory of entry points built from the code; every finding confirmed by a dynamic trace of the program; and every proposed gate run against the project's own test suite plus a black-box regression suite, with modified builds required to give identical results. Anything that would change a non-default configuration is set aside for a human.

## When to use

- Designing a skill whose output is a list of findings the agent itself produced. The confirm-by-execution and identical-test-results rules are the verification step.
- Security review of inherited or agent-written code where finding individual vulnerabilities does not scale. Reducing reachable code lowers the severity of unknown bugs at once.
- Deciding what to do with a finding that only holds in a non-default configuration: hand it to a human rather than let the agent decide.

## Procedure

The skill as described in the post:

1. Pass 1, default configuration: code reachable in the shipped default configuration that no intended functionality uses.
2. Pass 2, early reachability: security-sensitive code that runs before a hard gate such as authentication, without victim interaction, or before a protocol state transition, in any configuration.
3. Pass 3, configuration interaction: pairs of options that are reasonable alone but silently disable or degrade a control together.
4. In every pass: inventory the entry points from the code, confirm each finding with a dynamic trace, then propose a change (a gate, a reordered check, a guard enforcing state order, or rejecting the combination at configuration load).
5. For a default-configuration gate: implement it, run the project's tests and a black-box regression suite against the baseline, require identical results. Set aside any gate that would change a non-default configuration for a human.
6. Each pass starts fresh, carrying only a short piece of context from the prior pass.

## Facts

- Inventory: over 17,000 configuration options across the 25 projects, 3,842 of them security relevant.
- Gated cohort (11 projects): 93 unnecessary pre-authentication surfaces in the default configuration, 37 places where code ran or state was recorded before authentication, 61 configuration combinations that silently weakened a pre-authentication control. All eleven had unintentionally reachable code.
- 162 security-sensitive configuration combinations were accepted with no error, warning or documentation; 94 silently turned a control off.
- One pattern appeared in four unrelated projects: an access rule written as a hostname or wildcard is compared against a bare IP address when reverse DNS lookups are off (the common default), so a deny list written that way fails open.
- OpenSSH 10.4: about 4,500 lines of ML-DSA-44 code, roughly 16% of a default sshd's pre-authentication code, were parsed for any client even when the algorithm was excluded. 10.5 moved the check before parsing; Claude then found two gaps (advertised algorithm versus the type string inside the key blob; CA signature verification for any algorithm before the configuration check). 10.6 placed the checks inside the parser, removing roughly a fifth of the pre-authentication reachable code.
- The skill is being integrated into OSS-Scanner.

## Evidence

T1 by origin: first-party research post on anthropic.com with method, inputs and counts, and an externally checkable case (OpenSSH 10.5 and 10.6 release content). Limits: the 25 projects are not all named, no per-finding dataset is published, the false-positive rate before dynamic confirmation is not stated, and the skill itself was not available to read at the time of this note.

## Open questions

- How "dynamic trace" is implemented per language, and whether it runs in a sandbox.
- Whether the skill will be published, and under what name, in OSS-Scanner.
- How many of the 493 findings led to upstream patches beyond OpenSSH.
