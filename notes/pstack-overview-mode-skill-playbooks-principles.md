---
title: pstack is Cursor's pstack plugin (one mode skill, 23 playbooks, 24 principle skills, multi-model review panels), mirrored harness-neutral at backnotprop/pstack
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/cursor/plugins/tree/main/pstack
  - https://github.com/backnotprop/pstack
  - https://github.com/backnotprop/pstack/blob/main/MIRROR.md
  - https://github.com/backnotprop/pstack/blob/main/docs/harness/claude-code.md
  - https://github.com/backnotprop/pstack/blob/main/plugin.json
tags: [pstack, skills, cursor, claude-code, multi-model, overview]
applies_to: [pstack@0.15.28]
added: 2026-10-21
last_verified: 2026-10-21
verified_by: agent
---

`backnotprop/pstack` is a mirror of `cursor/plugins/pstack`, Lauren Tan's ("poteto", Cursor, React core team) skill pack, with Cursor-only instructions rewritten so the skills run in Claude Code, Codex, Pi and OpenCode. The primary source is the Cursor repo; the mirror adds an install path (`skills` CLI) and a harness-mapping section. Treat it as a second upstream skill collection next to the Pocock skills, with a different philosophy: no planning skills, one routing "mode" skill, and multi-model subagent panels (Opus plus Grok by default).

## When to use

- You want a second opinion on how to structure a skill collection: pstack's shape (mode skill, playbooks, principle leaves, routed workflow skills) differs from [the Pocock flow](pocock-skills-overview.md).
- You want ready procedures for adversarial review, parallel bakeoffs, blast-radius checks, perf-number vetting or repeated-mistake elimination. Each has its own note, listed below.
- You run Claude Code and want pstack's Cursor-specific fields translated. See Facts.

## Facts

Structure, at version 0.15.28 (plugin.json in the mirror; upstream commits through 2026-10-17 and later):

- `skills/poteto-mode/SKILL.md`: the entry point. Matches the task to one of 23 playbooks under `playbooks/`, carries an inline index of 24 principles, and routes to the other skills. See [the mode-skill pattern](pstack-mode-skill-routes-to-playbooks-and-copies-steps-verbatim-into-todos.md).
- 24 `principle-*` skills, one rule each, grouped core, architecture, verification, delegation, meta. The mode skill requires the agent to read the leaf file before citing a principle.
- Workflow skills: `how`, `why`, `architect`, `arena`, `swarm`, `interrogate`, `blast-radius`, `reflect`, `correct`, `automate-me`, `tdd`, `unslop`, `no-comments`, `technical-writing`, `benchmark-checklist`, `create-verification-skill`, `create-formal-verification-skill` and their `maintain-*` pairs, `setup-pstack`, `show-me-your-work`, `figure-it-out`, `poteto-help`, `in-your-own-words`, `sharpen`, `recall`, `ketchup`, `bro`, `make-bot-ui`.
- Two subagent definitions under `agents/`: `poteto-agent` (a delegate that reads the mode skill in full first) and `comment-sicko` (a read-only comment reviewer, invoked through `no-comments`).
- `docs/guide/` is a ten-chapter tutorial; `docs/harness/claude-code.md` is the Cursor-to-Claude-Code mapping; `automations/benny` is a Cursor-only Slack triage bot.
- Not bundled: `deslop`, `control-cli`, `control-ui` (Cursor's `cursor-team-kit` plugin) and `create-skill` (a Cursor built-in). The mode skill says what to do without them.
- Author's stated position: "i don't believe in planning. the best spec is code." There is no planning skill; the multi-phase playbook covers it on request.

Notes on individual procedures:

- [interrogate: multi-model adversarial review](pstack-interrogate-multi-model-adversarial-review-signal-from-model-diversity.md)
- [arena: parallel candidates, cross-judge, graft](pstack-arena-parallel-candidates-cross-judge-pick-base-graft.md)
- [blast-radius: prove the one safety fact](pstack-blast-radius-prove-the-one-safety-fact-by-running-code.md)
- [correct: fix repeated mistakes at the highest enforcement level](pstack-correct-fixes-repeated-agent-mistakes-at-highest-enforcement-level.md)
- [benchmark-checklist: seven questions before reporting a number](pstack-benchmark-checklist-seven-questions-before-reporting-a-number.md)
- [create-verification-skill: a project-local app driver](pstack-create-verification-skill-generates-project-local-app-driver.md)
- [per-role model config](pstack-per-role-model-config-rule-with-inherit-parent.md)
- [fresh subagents over resume](pstack-fresh-subagents-with-consolidated-scope-over-resume.md)
- [unslop: numbered AI-tell rules](pstack-unslop-numbered-ai-tell-rules.md)

Claude Code mapping (from `docs/harness/claude-code.md`):

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `readonly: true` | `subagent_type: "Explore"`, plus "do not edit files" in the brief and a `git status` check after |
| `environment: "cloud"` | `isolation: "worktree"` |
| `run_in_background: true` | omit, default |
| `resume` | spawn a new agent, paste the earlier result |
| `claude-opus-5-5-xhigh` | `model: "opus"`, `effort: "xhigh"` |
| `grok-*` or other non-Claude slug | omit `model`, say so |
| Run another pstack skill | `Read` its `SKILL.md`; the `Skill` tool refuses most pstack skills |
| Cursor Automations, Bugbot, cloud agents | one line `Skipped in Claude Code: <step>. <reason>.`, then continue |

Install paths: `npx skills add backnotprop/pstack` (mirror, any harness); `/plugin marketplace add cursor/plugins` then `/plugin install pstack@cursor-plugins` (upstream, Claude Code). Neither was run for this note.

Overlap with the Pocock skills: `tdd` in both; `interrogate` and `arena` cover ground near [code-review](pocock-skill-code-review.md) and [prototype](pocock-skill-prototype.md); `how` and `why` near [research](pocock-skill-research.md); `unslop` and `technical-writing` near [writing-for-agents](pocock-skill-writing-for-agents.md); `in-your-own-words` is a one-round cousin of [grilling](pocock-skill-grilling.md). pstack has no equivalent of to-spec or to-tickets, by design.

## Evidence

Everything above is read from the skill and doc sources themselves. The repo publishes no evals, benchmarks or outcome data for any skill; the only quantitative claims in the README are GitHub counts (2.5k stars, 194 forks on the mirror). The mirror's `MIRROR.md` describes the sync (an `upstream` branch holding Cursor's files verbatim, `main` merging mirror edits on top) but no diff between the two was taken for this note.

## Open questions

- Which skills the mirror rewrote, and how far, versus upstream. The MIRROR.md grep for Cursor-only strings suggests the deltas are small.
- Whether the Claude Code plugin install (`harness/pstack/` generated tree upstream) and the mirror's `skills` CLI install produce the same files.
- Default models are `claude-opus-5-5-xhigh` for judgment and `grok-4.7-xhigh-fast` for code; the Claude Code mapping drops Grok to the session model, so the "multi-model" panels become single-model there unless configured otherwise.
