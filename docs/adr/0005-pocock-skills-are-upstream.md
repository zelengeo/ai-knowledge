# ADR 0005: Matt Pocock's skills are an upstream dependency, not vendored

**Status**: accepted, 2026-10-16

## Context

The starting corpus is `mattpocock/skills` (MIT, installed as the `mattpocock-skills` plugin) and the free AI Hero course "AI Skills for Real Engineers". Copying the skills into this repo would drift from upstream within weeks and reproduce content that already has a canonical home. The repo is public.

## Decision

Consume the plugin as a dependency. This repo holds notes about the skills (when each one earns its place, what was learned using it, deltas we apply), links to the upstream `SKILL.md` and docs pages, and its own skills where ours differ. The daily job tracks the upstream release feed and reports changes. AI Hero material is summarised with links to the markdown twins (`<page>.md`), never reproduced wholesale.

## Consequences

Upstream changes show up in the daily PR instead of silently diverging. Anything we would have "fixed" in a copy becomes either a note on our delta or an upstream contribution.
