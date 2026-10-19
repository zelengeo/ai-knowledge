---
title: A coding agent iterates reliably on a stateful visual app only when it can reproduce exact state and score visual change numerically
type: technique
status: inbox
evidence: T2
sources:
  - https://kylekukshtel.com/ai-harness-engineering-game-development-claude-code
tags: [harness, context-engineering, game-dev, evals, claude-code]
applies_to: []
added: 2026-10-16
last_verified: 2026-10-19
verified_by: agent
---

Kyle Kukshtel's write-up of his "Your Game Is A Harness" talk argues that agents fail on games because most of a game is opaque to them, and gives a procedure to make the app legible: deterministic state the agent can reach from scratch every time, a typed command interface so it can drive the app without recompiling, and screenshots scored by image diff so each turn has a number to move. The pattern transfers to any stateful app with visual output.

## When to use

- The agent has to iterate on behaviour it can only judge by running the app and looking (games, canvases, simulations, dashboards).
- Before/after screenshots alone have not helped: the author reports they add noise and the model cannot tell what changed.

## Procedure

1. Seed all randomness from one source at startup, so any state is reproducible.
2. Build save/load first, not last. Prefer one object type (a "fat struct" with a type enum) so serialisation has one path in and one out; the author reports agents also place changes correctly with a single type where many classes make them guess.
3. Route all state changes through serialisable commands. Record them, replay them from a saved state to reproduce bugs, and let the agent author command sequences as text to drive a running build with no compile.
4. Keep operational data (speeds, damage, costs) outside code, loaded at runtime, so value changes need no rebuild.
5. Put the simulation in its own library; the engine sends commands and renders returned state. Tests and the agent then run the simulation without the engine.
6. Expose a screenshot API and toggles to hide UI or gameplay layers, so a screenshot shows only the layer under change.
7. Score each change with an image diff. The author uses `odiff`, which outputs a diff image and a similarity percentage the agent reads as its per-turn eval against a target image.

## Evidence

The author ran this on Cantata, a shipped game, where about seven non-programmers iterated on live builds through an external data editor, and reports using the same loop with Claude Code. Claims are experiential; no measurements of agent success rates are given. T2 for a stated procedure with reported outcomes.

## Open questions

- Similarity percentage is a blunt eval. Cropping to the region of interest is mentioned as the mitigation; how much it helps is not measured.
- The post is written for games; which steps pay off for ordinary web UIs is untested here.
