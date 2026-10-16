# ai-knowledge

A personal, agent-maintained knowledge base of AI-assisted engineering practice. Technical insight only, with evidence. No takes, no drama.

## How it works

- A daily agent job fetches a tight watchlist (`sources.yaml`), triages every item against a written rubric (`docs/rubric.md`), and opens a pull request. The PR description is the digest.
- Knowledge is markdown: `notes/` for claims with evidence, `skills/` for procedures an agent runs when a task matches. Every note cites its sources and carries an evidence tier.
- Only a human promotes a note from `inbox` to `tried` or `adopted`. The agent proposes; the PR review decides.
- Built on Matt Pocock's skills (upstream, MIT) and the free AI Hero course "AI Skills for Real Engineers". Decisions are in `docs/adr/`.

## Reading it

On GitHub, or open the folder as an Obsidian vault. Plain markdown links, no plugins required.

## For agents

`AGENTS.md` is the entry point. `CLAUDE.md` imports it.

## Status

Scaffolded 2026-10-16. Open work is in the issues, labelled per `docs/agents/triage-labels.md`.
