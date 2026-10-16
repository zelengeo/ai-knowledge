# ADR 0003: intake and knowledge are separate; knowledge changes only by PR

**Status**: accepted, 2026-10-16

## Context

A feed digest decays in days; a knowledge base compounds. One process doing both fills the knowledge base with unverified "someone said" and turns the digest into an unread newsletter.

## Decision

Intake lives in `state/` (append-only logs) and `inbox/` (disposable). Knowledge lives in `notes/` and `skills/` and changes only through a pull request that a human merges. The PR description is the digest; there is no digest file. Only humans promote a note past `inbox`.

## Consequences

The agent proposes, the human decides, every day. Rejected items still leave a verdict with a rule, so the rubric can be tuned from data.
