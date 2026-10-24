---
title: A one-line quality goal under Claude Code's Ultracode mode produced a measured rebalance because the agent built its own simulator and ran 1,200 matches overnight
type: technique
status: inbox
evidence: T2
sources:
  - https://simonwillison.net/2026/Oct/20/battledrones/
tags: [claude-code, ultracode, dynamic-workflows, evals, self-play, game-dev, vibe-coding]
applies_to: [claude-code@2.x, claude-opus-5-5]
added: 2026-10-23
last_verified: 2026-10-23
verified_by: agent
---

Simon Willison gave Claude Code for Web, in Ultracode mode (dynamic workflows, a JavaScript script orchestrating many subagents), the prompt "This game isn't fun enough yet. Make it a LOT more fun." The run took from evening to late the next morning and returned a release whose notes report 1,200 AI-vs-AI test matches, with games still undecided after 25 minutes falling from 14% to 0.9% and comeback wins from 24% to 46%. The measured result came from the agent building and running an evaluation loop, not from anything in the prompt; the prerequisite was a game the agent could play against itself.

## When to use

- A quality property you cannot specify but the system can exercise on its own: self-play in a game, scripted users through a flow, load against a service.
- Low stakes and a token budget you are willing to burn overnight. Willison: Ultracode "burns tokens like there's no tomorrow" but solved audio-based multiplayer from one prompt.
- Replay or multiplayer features, where the simulation must be deterministic first.

## Procedure

As run, with the prompts quoted in the post:

1. Reach a working but dull baseline with ordinary prompting (v1 to v3 here: Fable 5 in July, then Opus 5.5).
2. Switch to Ultracode and state the goal in one line. Do not list features.
3. Let it run unattended overnight. Ask it to write its own release notes with the numbers it measured.
4. Playtest, and treat the numbers as the agent's claim until replayed. The post reports them from the agent-written release notes.
5. For replay and multiplayer, make the simulation deterministic. Claude had to replace `Math.sin` and `Math.cos` with custom versions because Chrome and Safari return slightly different values, which desynchronised replays.

## Facts

- 12 major iterations, 321 commits by coding agents, mainly Claude Code; almost none of the TypeScript reviewed by the author.
- Later single prompts under the same mode: a port to three.js with 3D models for everything (overnight), a random map generator built inside a 45-minute usage window, agent-vs-agent play with an `AGENT-BATTLES.md` proposal written first, and an audio modem for two-device multiplayer, which started from a Radio Probe tool the agent built to measure available bandwidth.
- A longer design prompt (the Archipelago map) ended with "First research and then critique this design. Only build after we have agreed on any modifications", and produced the map the author rates most fun.
- Cost of a feature was low enough that the author built one purely to use 25% of a weekly allowance that was about to reset.
- The audio multiplayer gave a player a headache; the fix was a warning plus a stateless WebSockets relay on a scale-to-zero Fly.io instance, prompted in two lines.

## Evidence

T2: a practitioner ran the procedure and links the transcripts. The 14% to 0.9% figure is reported from release notes the agent wrote, so the measurement itself is agent-reported and not independently reproduced; apply [the benchmark checklist](pstack-benchmark-checklist-seven-questions-before-reporting-a-number.md) before quoting it. The determinism lesson matches [deterministic state as a harness prerequisite](agent-harness-deterministic-state-and-image-diff.md).

## Open questions

- Token cost of the overnight runs is not stated.
- Whether the simulation harness existed before the "more fun" run or was built inside it; the post says only that Claude ran over a thousand simulated playtests.
- How much of the result depends on Opus 5.5 versus the orchestration mode.
