---
title: DeltaDB is a CRDT layer over Git that records every edit and message between commits as a delta anchored to a causal version, so references survive code movement while commits, branches and remotes stay in Git
type: concept
status: inbox
evidence: T1
sources:
  - https://delta.dev/blog/future-of-version-control
  - https://delta.dev/deltadb
  - https://delta.dev/docs/concepts/delta-and-git
  - https://delta.dev/docs/privacy-and-security/data-storage
  - https://zed.dev/blog/introducing-deltadb
  - https://zed.dev/blog/agentic-xanadu
  - https://zed.dev/blog/delta-public-beta
tags: [delta, deltadb, version-control, crdt, provenance, zed]
applies_to: [delta@0.21.0]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

DeltaDB is the database under Delta, Zed's agent app. It does not replace Git: a project must have a Git remote, commits stay Git commits, and you push and open pull requests as before. What it adds is a continuous record between commits: every file edit, file-tree change, message and comment is a delta with a stable identity, its author (person or agent), and the version it builds on. Because a reference points at a delta rather than a line number, a comment or a citation stays attached to the same span as the code moves, and from any line you can get back to the conversation that produced it. This is the anchor note for the Delta notes in this repo; the practice notes link here.

## When to use

- Understanding what Delta's threads, reviews and worktrees are built on before evaluating them.
- Reasoning about provenance for agent-written code: DeltaDB is the first shipped system that records which prompt produced which characters.

## Facts

- A delta carries the text it inserts, the range it replaces, and the version it is based on: either a Git blob or commit, or a set of earlier delta ids (a set because edits can be concurrent). A delta id is a Lamport-style timestamp plus an actor id; there is no shared clock, order comes from the causal graph.
- Concurrent inserts at the same position are tie-broken by actor id, so every replica converges on the same text regardless of arrival order. The design is loosely based on diamond-types, reworked to interoperate with Git.
- Each file is stored as text plus a fragment index: a B-tree recording which delta created each character. An edit based on an old version is resolved by looking up where that old position is now.
- Versions are immutable trees with structural sharing: a new version creates only the nodes on the path to the change, so storage grows with the size of edits rather than the square of their count.
- Every Delta client holds a replica; deltas sync as you type. Agents and browser participants edit the replicated representation directly; on a desktop Delta mounts it into a checkout for terminals, builds and editors. Revert a thread to an earlier message and the files follow, without a commit.
- Recorded: tracked files, untracked files Git does not ignore, and tracked files that now match an ignore rule. Ignored files such as `.env` and build output stay on the machine that made them.
- Stored on Zed's servers as well as locally: Git objects for attached repositories, all deltas, thread records and catalogue, the configured remote URL, collaborators' GitHub logins, commit author identities, and synced account settings including provider API keys. Storing does not share; threads are private until shared.
- Early support for Jujutsu colocated repositories. Directory-level CRDT semantics (two concurrent renames producing a directory inside itself) are described as still open.
- Not open source as of 2026-10-24: no public repository for Delta or DeltaDB was found; the Claude Code plugin is the only public code (AGPL-3.0). Pricing: Personal free with your own keys, Pro $10 a month with hosted models, shared with Zed plans.

## Evidence

The data model is from Conrad Irwin's 2026-10-15 post (based on his talk) and the DeltaDB page, with Rust struct sketches; the storage and recording rules from the docs. Adoption is self-reported: Zed disabled pull requests on Delta's own repository in September 2026 and says 33 people landed 570 changes in the following week (T3). The launch drew 154 points and 102 comments on Hacker News; the earlier DeltaDB and Delta announcements drew 529 and 679 points. None of that is practitioner evidence.

## Open questions

- Licensing and self-hosting: the June post promised a free version; nothing says whether the server or the database will be open.
- Retention of deltas for a file that is later ignored or deleted, and whether a thread's recorded history can be purged from the server short of deleting the thread.
- How a thread maps to Git: the Xanadu post says "every thread is also a git branch", the docs say each managed checkout has its own repository and commits land there until pushed to `local` or the source remote; see [isolated checkouts](delta-isolated-checkouts-need-fast-prepare-script-and-configurable-ports.md).
