# ADR 0002: lagging indicators only; no X or other social feeds

**Status**: accepted, 2026-10-16

## Context

The stated problem is noise and the harm of being on social networks. X's API is paid and restrictive, scraping breaks its terms, and the drama lives there. Technical substance that starts on X lands within a day or two in a repo, a changelog, a blog post, or Hacker News, already filtered by someone deciding it was worth writing down.

## Decision

The watchlist contains only sources where someone already did the first filter: changelogs and release feeds of tools in use, a small set of practitioner blogs with feeds, Hacker News above a points threshold, and the upstream skills repo. No X, no Reddit, no Discord, no Mastodon, no YouTube.

## Consequences

Latency of a day or two on news. Acceptable: the goal is a knowledge base, not a ticker. Adding a source is a PR with a one-line `why`; the daily PR may propose sources but never adds them.
