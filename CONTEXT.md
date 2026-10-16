# Glossary

The vocabulary this repo uses. Use these terms in notes, tickets, and PR descriptions; do not drift to synonyms.

- **Source**: a feed, API, or repo listed in `sources.yaml`. Each has a `why` line that justifies its place.
- **Item**: one thing a source produced in a fetch: a post, release, story. Identified by `<source-id>:<guid>`.
- **Watchlist**: the set of sources. Kept tight; growth is a decision, not a drift.
- **Triage**: applying `docs/rubric.md` to an item. Produces exactly one verdict.
- **Verdict**: keep or drop, with the rule that decided it and an evidence tier. Logged in `state/verdicts.jsonl`.
- **Evidence tier**: T1 primary, T2 reproduced, T3 reported, T4 hearsay. The tier of the best source cited, never of the write-up itself.
- **Note**: a claim with evidence, as a markdown file under `notes/`. Opinion without a procedure or a measurable fact is not a note.
- **Skill**: a procedure an agent runs when a task matches its trigger, as `skills/<name>/SKILL.md`, loaded into context only when relevant. A note becomes a skill when it is `adopted` and has steps. See [skill](https://www.aihero.dev/ai-coding-dictionary/skill).
- **Status**: where a note stands with the human: `inbox`, `tried`, `adopted`, `deprecated`. Only humans promote.
- **Validation**: checking that a claim is still true and still evidenced, per `docs/validation-contract.md`. Distinct from triage, which happens once at intake.
- **Digest**: the daily PR description. There is no separate digest file.
- **Upstream**: a dependency whose changes we track: the Pocock skills, the coding agent in use.
- **Lead**: a T4 item logged for the validation layer to chase a primary source, not a note.

## Terms adopted from the AI Coding Dictionary

Vocabulary this repo shares with Matt Pocock's [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary). Definitions are ours; each links to the entry it was adopted from. Where a term above already existed (Skill), the line above carries the link instead.

- **Agent**: a model plus a harness (tools, system prompt, context window) taking turns with a user. [agent](https://www.aihero.dev/ai-coding-dictionary/agent)
- **Harness**: everything around the model that makes it an agent: tools, system prompt, context management, permissions, hooks. Claude Code and Codex are harnesses. [harness](https://www.aihero.dev/ai-coding-dictionary/harness)
- **Session**: one bounded run with an agent, from empty context until it is cleared, closed, or compacted. [session](https://www.aihero.dev/ai-coding-dictionary/session)
- **Turn**: one user message plus everything the agent does before yielding back. [turn](https://www.aihero.dev/ai-coding-dictionary/turn)
- **Context**: what the agent can read right now that bears on the task. [context](https://www.aihero.dev/ai-coding-dictionary/context)
- **Context window**: everything the model sees on one request; finite and model-specific. [context-window](https://www.aihero.dev/ai-coding-dictionary/context-window)
- **Context pointer**: a path, URL, issue number, or branch name that refers to context instead of copying it in. [context-pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer)
- **Smart zone**: the early part of a session where the agent is still sharp; past it, quality degrades as context fills. [smart-zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)
- **Compaction**: summarising a session's history in memory to seed a fresh one; lossy. [compaction](https://www.aihero.dev/ai-coding-dictionary/compaction)
- **Clearing**: ending a session and starting the next one with an empty context window. [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing)
- **Handoff**: moving agent context from one session to another with no return path. [handoff](https://www.aihero.dev/ai-coding-dictionary/handoff)
- **Handoff artifact**: a document one session writes for another to read; specs and tickets are handoff artifacts. [handoff-artifact](https://www.aihero.dev/ai-coding-dictionary/handoff-artifact)
- **Spec**: a handoff artifact describing a multi-session piece of work by its end state, made of tickets. [spec](https://www.aihero.dev/ai-coding-dictionary/spec)
- **Ticket**: a handoff artifact scoping one session of work; may block or be blocked by sibling tickets. In this repo, a GitHub issue. [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)
- **Grilling**: the agent interviews the human one decision at a time until a design is shared. [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)
- **Prototyping**: throwaway code built to answer one design question that talking cannot settle. [prototyping](https://www.aihero.dev/ai-coding-dictionary/prototyping)
- **Subagent**: an agent spawned by another via a tool call, in its own session, returning one result. [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent)
- **Sandbox**: an isolated environment (container, VM, restricted shell) that bounds what an agent can damage. [sandbox](https://www.aihero.dev/ai-coding-dictionary/sandbox)
- **HITL**: human-in-the-loop; a human pairs with the agent during the session, reviewing and redirecting. [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)
- **AFK**: the human starts a session and leaves the agent to run unattended; needs a sandbox and permissive permissions. The daily job here runs AFK. [afk](https://www.aihero.dev/ai-coding-dictionary/afk)
- **Automated check**: a deterministic pass/fail run in the environment: tests, types, lint, hooks. [automated-check](https://www.aihero.dev/ai-coding-dictionary/automated-check)
- **Automated review**: an agent judging another agent's work; non-deterministic. [automated-review](https://www.aihero.dev/ai-coding-dictionary/automated-review)
- **Human review**: a human reading the diff, not the summary, and forming a judgement. The `tried` and `adopted` transitions here require it. [human-review](https://www.aihero.dev/ai-coding-dictionary/human-review)
- **Vibe coding**: accepting agent code without human review. Out of scope for this repo. [vibe-coding](https://www.aihero.dev/ai-coding-dictionary/vibe-coding)
- **Primary source**: the thing itself (the conversation, the code, the vendor's docs); matches our T1 tier. [primary-source](https://www.aihero.dev/ai-coding-dictionary/primary-source)
- **Secondary source**: a summary of a primary source; a compaction, a handoff file, a write-up. [secondary-source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)
- **Progressive disclosure**: load only the context needed now and point to the rest; how `AGENTS.md` and skills are meant to be structured here. [progressive-disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)
- **AGENTS.md**: the file the harness loads at session start as the project's standing brief. [agents-md](https://www.aihero.dev/ai-coding-dictionary/agents-md)
- **Design concept**: the shared understanding of what is being built, held by human and agent, separate from any artifact. [design-concept](https://www.aihero.dev/ai-coding-dictionary/design-concept)

Related terms from AI Hero posts, not dictionary entries: **tracer bullet** (a thin end-to-end slice through every layer, demoable on its own) and **vertical slice** (the same, as opposed to a **horizontal slice** that ships one layer). See [tracer bullets](https://www.aihero.dev/tracer-bullets).
