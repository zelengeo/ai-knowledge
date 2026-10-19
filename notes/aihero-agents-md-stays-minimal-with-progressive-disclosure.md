---
title: A root AGENTS.md should hold only what is both undiscoverable and relevant to every session, and point to separate files and skills for the rest; auto-generated init files are a net negative
type: technique
status: inbox
evidence: T2
sources:
  - https://www.aihero.dev/a-complete-guide-to-agents-md
  - https://www.aihero.dev/never-run-claude-init
  - https://www.humanlayer.dev/blog/writing-a-good-claude-md
  - https://arxiv.org/abs/2602.11988
tags: [aihero, agents-md, context-engineering, progressive-disclosure]
applies_to: []
added: 2026-10-16
last_verified: 2026-10-19
verified_by: agent
---

Every line of `AGENTS.md` loads on every request, competes for a finite instruction budget, and rots as paths change, so Matt Pocock's rule is to keep the root file to a one-sentence project description, the package manager if not npm, and non-standard build or typecheck commands, then link out to domain files (`docs/TYPESCRIPT.md`), nested `AGENTS.md` in monorepo packages, and skills. His own `CLAUDE.md` is one line about running on WSL. He also argues `claude /init` output (command listings, architecture, file references, patterns) is either discoverable from source or will go stale, and should be deleted.

## When to use

- Any repo whose instruction file has grown by accretion ("agent did X, add a rule"), or was generated.
- Before adding a rule: ask whether it is true next month and relevant to every task. If not, it belongs in a domain file, a skill, or a deterministic hook.

## Procedure

1. Audit: find contradictions, extract the essentials, group the rest by domain into separate files, flag redundant or vague lines for deletion. The guide includes a refactoring prompt that does these steps and asks before writing.
2. Replace rule lists with light pointers ("For TypeScript conventions, see docs/TYPESCRIPT.md"); no all-caps forcing.
3. Document capabilities and domain concepts, not file paths; let the agent explore just in time.
4. In monorepos, root holds navigation and shared tooling; package-level files hold their own stack. Levels merge, so keep each small.
5. Move steering that is really a CLI rule into a hook (see [aihero-pretooluse-hooks-enforce-cli-rules-deterministically](aihero-pretooluse-hooks-enforce-cli-rules-deterministically.md)).

## Evidence

Two practitioner posts. The instruction-budget figures disagree: the AGENTS.md guide quotes Humanlayer's 150 to 200 instructions; the init post says 300 to 400, maybe 500 for bigger models. Neither cites an experiment, so treat the budget as a direction, not a number. The init post links arXiv 2602.11988 as showing unnecessary context files make tasks harder; that paper was not read for this note and is the lead to chase. The `AGENTS.md` versus `CLAUDE.md` symlink and merge-by-directory behaviour are claims about harnesses that need checking against vendor docs.

## Open questions

- This repo's `AGENTS.md` is far above the one-line bar by design (it is the entry point per ADR 0001). Which lines could move to `docs/` without the daily job losing them?
- Read arXiv 2602.11988 and record its method and effect size.
