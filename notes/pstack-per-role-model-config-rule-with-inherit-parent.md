---
title: Put subagent model choices in one per-role config file the harness auto-loads (Claude Code reads every .md in ~/.claude/rules/), with an inherit-parent alias so skills never hardcode a slug
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md
  - https://code.claude.com/docs/en/memory
  - https://github.com/backnotprop/pstack/blob/main/skills/setup-pstack/SKILL.md
  - https://github.com/backnotprop/pstack/blob/main/docs/harness/claude-code.md
tags: [pstack, claude-code, subagents, models, configuration]
applies_to: [pstack@0.15.28, claude-code@2.1.x]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

pstack keeps every model decision out of the skills and in one file with one line per role (`feature, refactoring`, `bug-fix`, `judgment and prose`, `hardest tasks`, `swarm workers`, `arena runners`, `interrogate reviewers`, and so on), plus a `# budget` line that sets the effort token for every real slug. Each skill reads its role line and falls back to a stated default when the line is missing. The aliases `inherit-parent` and `auto` mean "omit the subagent `model`, run on the parent chat model", which is how a user without a second model family still runs every skill. In Claude Code the file is `~/.claude/rules/pstack-models.md`; the Claude Code docs confirm that personal rules under `~/.claude/rules/` load into every project on the machine.

## When to use

- You maintain skills that spawn subagents and want to change models without editing skill text.
- You run Claude Code and want a user-level rule that applies everywhere without a per-project approval dialog (project `.claude/rules/` symlinks need one; user-scope rules do not).

## Procedure

1. Detect the slugs your subagent tool accepts in this session. Never write a slug you have not confirmed. The two aliases are always valid.
2. Load the existing file if any; its budget and role lines are the current choices. Drop lines for retired roles.
3. Ask for a budget with four fixed labels (`unlimited`, `large`, `medium`, `small` mapping to `max`, `xhigh`, `high`, `medium` effort). Apply it to the effort token of every real slug, falling back to the same family's highest detected effort at or below the target.
4. Show every role, mark slugs not in the detected set, confirm. Panel roles (arena runners, interrogate reviewers, architect runners) are lists; the list length sets the fan-out.
5. Write the whole file (idempotent overwrite). Cursor: `~/.cursor/rules/pstack-models.mdc` with `alwaysApply: true` frontmatter. Claude Code: `~/.claude/rules/pstack-models.md`, no frontmatter, role values as `<model> <effort>` such as `opus xhigh`. Other harnesses: `~/.agents/pstack-models.md`, which the skills read themselves at model-pick time.
6. Never put the role lines in `CLAUDE.md` or `AGENTS.md`.

A rule written before a default changed still pins the old default; delete those lines and rerun.

## Evidence

The config shape and procedure are from the skill file. The claim that `~/.claude/rules/` loads into every session is from the Claude Code memory docs ("Personal rules in ~/.claude/rules/ apply to every project on your machine"). Neither source measures anything; this is a configuration pattern.

## Open questions

- Claude Code's `Agent` tool takes only `opus`, `sonnet`, `haiku`, `fable` for `model`, so the Grok defaults become `inherit-parent` there; the pstack docs say so. Whether a two-family panel is possible in Claude Code at all depends on the account.
