# ADR 0001: AGENTS.md is the entry point; CLAUDE.md imports it

**Status**: accepted, 2026-10-16

## Context

The repo must work with any coding agent, not only Claude Code. Claude Code reads `CLAUDE.md`; most other agents read `AGENTS.md`. Keeping two copies drifts.

## Decision

`AGENTS.md` is the only instruction file with content. `CLAUDE.md` contains the single line `@AGENTS.md`, Claude Code's import syntax. No symlinks: they are fragile on Windows checkouts.

## Consequences

Edit `AGENTS.md` only. Tooling that insists on editing `CLAUDE.md` (the Pocock setup skill prefers it when both exist) must be pointed at `AGENTS.md`; the Pocock wiring block already lives there.
