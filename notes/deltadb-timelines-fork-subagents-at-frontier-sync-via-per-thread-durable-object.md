---
title: DeltaDB forks a subagent as a new timeline parked at the parent thread's frontier and merges it back without a Git commit; each shared thread syncs through its own Cloudflare Durable Object over one WebSocket
type: concept
status: inbox
evidence: T1
sources:
  - https://delta.dev/blog/fine-grained-version-control-for-agents
  - https://delta.dev/blog/future-of-version-control
tags: [delta, deltadb, version-control, crdt, subagents, parallel-agents, zed]
applies_to: [delta@0.21.x]
added: 2026-11-01
last_verified: 2026-11-01
verified_by: agent
---

Zed's 2026-10-29 engineering post on DeltaDB adds the mechanism behind two things the earlier Delta notes only name: how parallel agents coordinate, and how threads are hosted. Timelines are named frontiers in one shared DAG of deltas; kicking off a subagent creates a timeline at the parent thread's frontier, the subagent edits in parallel, and the timeline is merged back later. None of that touches Git or needs a commit. Synchronisation is per thread: a shared thread gets its own Cloudflare Durable Object, every client holds one WebSocket per thread it follows, and a reconnect exchanges only the deltas each side missed. This extends the concept note `deltadb-crdt-layer-over-git-records-deltas-between-commits.md`, which describes the delta and version model; this note records the coordination and hosting facts from the new post.

## When to use

- Comparing Delta's parallel-agent model with git worktrees or forked conversations: Delta's unit of isolation is a timeline inside one DAG, not a checkout or a branch, and the merge is a CRDT merge, not a Git merge.
- Deciding whether thread data can live inside your own infrastructure: the post states the portability requirements.
- Reasoning about what a subagent's "fresh context" means in Delta: the files and transcript fork at a version, the parent's frontier keeps moving.

## Facts

- A delta is the smallest unit of change; all deltas form one DAG stored locally in SQLite. The system's whole state is identified by its frontier (the tips of the DAG), whose size grows with open branches, not with the number of writers that ever existed. The design is stated to follow the Eg-walker paper by Gentle and Kleppmann.
- A text edit on the wire is `{parent: Version, offset, text}`. When the local buffer is not at `parent`, the client reifies the buffer at that version, maps the offset to an internal fragment id, and applies it at the current version. This keeps deltas small and lets the internal representation change.
- Versions are reified by walking back to the nearest cached snapshot and replaying the deltas in between. Snapshots are copy-on-write B+ trees (a mutable-cursor variant of Zed's SumTree), so a cached version shares most nodes with its neighbours; new, changed and released nodes map to inserts, in-place rewrites and refcount decrements in one SQLite `nodes` table.
- Timelines: clients can track any number of frontiers. A subagent gets a new timeline parked at the parent's frontier; all timelines share the DAG and can merge at any later time. The post states this requires no committing for cross-agent coordination.
- Sync: a shared thread connects over WebSocket and subscribes to timelines; a sync step walks the DAG with a logarithmically spaced list of versions to find a recent common ancestor, then streams missed deltas incrementally. Reconnection uses the same procedure.
- Hosting: one Cloudflare Durable Object per thread, created on first connection, authentication only at connection time, share-nothing across threads. Cloudflare is the first deployment target, with a multi-tenant deployment and single-tenant "bring your own Cloudflare" deployments. Stated portability requirements for another platform: an object store, a fault-tolerant Postgres database for authentication, and addressable single-threaded processes with their own transactional storage.
- Client API primitives: `Register<T>` (last-writer-wins), `Map<K, V>` (add-wins), `Buffer` (rope-backed collaborative text), `Worktree` (a file tree layered on Git that can be mounted anywhere on disk; a worktree starts at a commit, each file is either pinned to its committed blob or carries the deltas since, and creating a commit produces a delta, which is what ties the DAG to Git). A thread is a `#[derive(Replicate)]` struct of these.
- In Delta's native UI the main thread mints deltas synchronously against an `Arc` snapshot; one writer thread persists them and two to four reader threads upload them, and remote deltas are merged into a background snapshot that is shipped back to the main thread. Foreground and background are treated as two concurrent clients of the same CRDT.
- Announced but not shipped in the post: per-character provenance across files and versions ("a supercharged, per-character git blame"), and the server-side loading and burst-write work.

## Evidence

- T1: the vendor's own engineering post on delta.dev, by Antonio Scandurra (Zed co-founder), dated 2026-10-29. The post is a description of the implementation, with code excerpts; no benchmark numbers are given, and nothing here was reproduced. DeltaDB is not open source as of the earlier Delta notes, so the claims cannot be checked against code.
- The earlier post on the future of version control is the source for the delta model this note builds on.

## Open questions

- How a timeline merge resolves conflicting edits to the same span beyond actor-id tie-breaking is not described; whether an agent sees a merge as a diff it can review is not stated.
- Whether a subagent's timeline can be discarded without leaving deltas in the shared DAG (the DAG is described as monotonically growing).
- Whether the Claude Code plugin for Delta creates timelines for Claude Code subagents or only records the parent session.
