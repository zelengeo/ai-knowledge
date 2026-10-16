# ADR 0004: the knowledge base is a skills repo first; Obsidian is a viewer

**Status**: accepted, 2026-10-16

## Context

The goal is "quickly find the relevant tactic for the current task". The reader at that moment is the coding agent, not the human. Zettelkasten-style atomic linking is high maintenance by hand and turns to mush when an agent writes it.

## Decision

Structure by retrieval: `skills/` holds procedures with triggers in the `agentskills` SKILL.md format, installable as a plugin so the agent's own router finds them. `notes/` holds claims with evidence, flat, indexed by frontmatter. Obsidian can open the folder as a vault, but nothing depends on it: plain markdown links, no wikilinks, no Dataview, `.obsidian/` gitignored.

## Consequences

Discovery by task works without searching. Graph views are a bonus, not a design input. Revisit if the flat `notes/` folder passes a few hundred files.
