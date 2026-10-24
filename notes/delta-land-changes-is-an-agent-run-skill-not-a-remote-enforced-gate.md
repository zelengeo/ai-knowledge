---
title: Delta's Land Changes runs a skill marked `metadata.delta-action: land`, so the merge decision is an agent-interpreted instruction and the enforcement point has to stay on the Git remote
type: technique
status: inbox
evidence: T1
sources:
  - https://delta.dev/docs/agents/skills
  - https://delta.dev/docs/agents/review-and-sync
  - https://delta.dev/docs/whats-in-the-latest
  - https://zed.dev/blog/delta-public-beta
  - https://rohitghumare.com/blog/zed-delta-after-pull-requests/
  - https://www.devopsness.com/blog/zed-delta-are-pull-requests-obsolete
tags: [delta, merge-gate, ci, code-review, agent-skills, unattended]
applies_to: [delta@0.21.0]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

In Delta the step that lands a change on `main` is a project skill: a `SKILL.md` whose frontmatter carries `metadata.delta-action: land`. Land Changes opens a Land subthread and the agent runs that skill, which "defines your checks, merge strategy, and publication steps". That makes landing an instruction the agent interprets, with the failure modes of any instruction (a misread CI log, a flaky job retried until green, a skill edited in the thread). A pull request's branch protection is an enforcement point that reads nothing. The two compose: keep the ruleset on the remote and write the land skill to queue a merge the remote decides, never to decide itself.

## When to use

- Any repository Delta threads will land into, before the first Land.
- The same reasoning applies to any agent given a "merge when green" instruction in Claude Code or elsewhere: the gate belongs to the host, not the prompt.

## Facts

- Eligibility is the frontmatter value, lowercase `land`; naming the skill or folder `land` is not enough. Example from the docs:

  ```yaml
  ---
  name: land
  description: >-
    Land this project's changes only when explicitly requested.
    Do not use for review, preparation, or skill installation.
  metadata:
    delta-action: land
  ---
  ```

- Land Changes opens a dedicated subthread and runs the eligible skill. With several eligible skills the agent lists them and you invoke one through the slash menu; a conversational reply naming a skill does not attach it. With none, Delta offers to write one, asking approval first; approving setup creates the skill and lands nothing. `/land` typed directly runs the skill in the current conversation without a subthread.
- Invalid skills: Land ignores invalid skills not marked for Land, but stops if a broken skill is marked for Land (0.21.0 adds: skips an invalid landing skill when a working one exists).
- Results: since 0.18.0 a Land card in the Land subthread and the parent shows whether the change landed, with target branch, commit and CI status. Since 0.20.0 agents ask for confirmation before landing when a planning discussion left permission to merge unclear, and 0.21.0 stops agents reporting a change as landed when only preparation finished.
- CI: Zed's launch post says an agent "can trigger a run with an existing CI provider and check the results before landing", and that content-based builds bringing verification into the thread are longer term. Delta does not claim a merge gate of its own.
- Zed's own public repository stays on GitHub with pull requests; contributors are asked to link Delta threads alongside PRs.

## Procedure

Ghumare's layered setup, stated by him as not run; GitHub field names from the rulesets REST docs.

1. Create a ruleset on the default branch before any agent can land: required status checks pinned by `integration_id` (so a status from another source does not count) with the strict policy (check must pass against the latest `main`), one approving review with `require_last_push_approval` (the pushing token cannot self-approve) and `require_code_owner_review`, linear history, no non-fast-forward.
2. CODEOWNERS on the files that become agent instructions or run on mount: `.agents/skills/`, `.agents/prepare`, `.delta/`, `AGENTS.md`, `.github/`.
3. Write the land skill to queue, not merge: push the thread's branch, `gh pr create --fill` if no PR exists, `gh pr merge --auto --rebase --match-head-commit "$(git rev-parse HEAD)"`, then `gh pr checks --required --watch --fail-fast`; on a failed check stop and report its name; never pass `--admin`.
4. Quarantine flaky tests separately. No merge gate distinguishes a real pass from a lucky third retry.

## Evidence

Facts are from Delta's docs and release notes. The objection is from the launch thread on Hacker News, quoted by Ghumare: "I wouldn't want to leave it up to the LLM to decide if CI is passing. I'd rather that be a decision enforced by the git remote." Both essays reach the same layering; neither ran it. The devopsness piece adds a conventional CODEOWNERS and ruleset example without Delta-specific paths.

## Open questions

- Whether the Land card's CI status is read from the provider's API by Delta or reported by the agent from the skill's output. The release notes do not say.
- Whether a collaborator can trigger Land in a shared thread using the author's remote credentials, or needs their own. The docs tie Land to "an available model in the desktop app" and say nothing about tokens.
- Whether the land skill can be invoked from a review subthread; the docs allow Land from a top-level or plain subthread only.
