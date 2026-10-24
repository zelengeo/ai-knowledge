---
title: Delta review is a forked subthread with its own worktree copy where the agent writes a change guide, the reviewer records a verdict, and Pull Changes applies only the snapshot saved with that verdict
type: technique
status: inbox
evidence: T1
sources:
  - https://delta.dev/docs/agents/review-and-sync
  - https://delta.dev/docs/agents/skills
  - https://zed.dev/blog/delta-public-beta
  - https://rohitghumare.com/blog/zed-delta-after-pull-requests/
  - https://news.ycombinator.com/item?id=49727245
tags: [delta, code-review, agent-review, collaboration]
applies_to: [delta@0.21.0]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Delta replaces the pull request with a review thread forked from the thread that did the work. The reviewer gets the original agent and its context, an agent-written change guide ordered to explain the change rather than listed file by file, an isolated copy of the worktrees to try fixes in, and a verdict (Approve or Request Changes) that is posted back to the parent. Edits made during review come back only when the author clicks Pull Changes, which applies the snapshot captured at verdict time, never later edits. The design bets that review cost is dominated by rebuilding intent, not by reading the diff; Zed has not published a measurement of that.

## When to use

- Reviewing agent-written changes where the "why" is in a conversation you did not have; the reviewer can ask the same agent, in the same context, instead of a fresh agent guessing from the diff.
- Comparing with the two-axis review in [Pocock's code-review skill](pocock-skill-code-review.md) and multi-model review in [pstack interrogate](pstack-interrogate-multi-model-adversarial-review-signal-from-model-diversity.md): both of those review a diff; Delta reviews a thread.

## Procedure

1. From a top-level thread or a plain subthread (fork or subagent, nested allowed), start a review: the eye button, `/review`, or Cmd+Shift+R (Ctrl+Shift+R on Linux and Windows). You cannot start a review from a Review or Land subthread. Reviewing a subthread covers its changes plus those inherited from its parents. A thread can have several reviews.
2. Delta asks the agent for a change guide: a structured walkthrough in the order that explains the change best, with focused inline diffs. The agent is told to identify work already on the default branch and focus on what is unmerged. A second review of the same work notes what changed since the last verdict. The same guide is available anywhere as the built-in `/change-guide` skill.
3. Review in the thread: comment on the transcript or on code lines in diffs and file tabs. The review agent works in forked worktrees, so its edits do not touch the parent's files. Ask it to fix things if you prefer that to requesting changes.
4. Use the Changes tab to pick a comparison: an upstream ref such as `origin/main` (merge base), Last Commit (uncommitted), Last Turn (since the agent's last turn), or a specific commit. Mark files Seen; the mark is per person, follows you across machines, and clears when the file changes again. The merge base is recorded and shared, so everyone compares against the same base.
5. Submit Review, then Approve or Request Changes. `/approve` and `/request-changes` submit a verdict from any thread without a review thread. Resubmitting updates your verdict; earlier verdicts stay in the parent's history.
6. Author: click Pull Changes on the verdict in the parent. It applies the edits snapshot saved with that verdict. Later review edits need a new verdict. If the pull fails, inspect the parent's files before retrying: some worktrees may already hold the changes.
7. A review thread has no sharing settings; it follows its parent. Share the parent first.

## Evidence

The procedure is from Delta's docs, current at 0.21.0. Zed's adoption claim (33 people landed 570 changes to main in the week after disabling PRs on Delta's own repository) is self-reported, T3. Two objections from the launch discussion are unmeasured on both sides: a reviewer must now consume a teammate's agent transcript rather than a distilled PR description (Zed's answer is the change guide); and a change guide is agent-written, so it can misdescribe the diff, and nothing in the docs checks the guide against the diff. Ghumare's queue model makes the condition explicit: attached context helps only if reading the guide costs less than rebuilding intent, and no number for either exists.

## Open questions

- Review throughput versus pull requests on the same team: no data.
- Whether the change guide can be verified against the diff mechanically (the repo's [blast-radius](pstack-blast-radius-prove-the-one-safety-fact-by-running-code.md) ladder would rank an unverified guide at "you said so").
- The verdict is not a gate: landing is a separate agent-run skill, see [land is a skill, not a gate](delta-land-changes-is-an-agent-run-skill-not-a-remote-enforced-gate.md).
