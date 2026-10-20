---
title: AI Skills for Real Engineers teaches one build chain (grill-with-docs, to-spec, to-tickets, implement, code-review, retro) with prototype and handoff as detours and a sandboxed loop for unattended work; its lesson pages are not publicly readable
type: concept
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills
  - https://www.aihero.dev/skills-ask-matt
  - https://www.aihero.dev/skills-catalog
  - https://www.aihero.dev/workshops/ai-coding-crash-course
  - https://www.aihero.dev/cohorts/claude-code-for-real-engineers-2026-04
tags: [aihero, pocock-skills, course, map]
applies_to: [mattpocock-skills@1.3]
added: 2026-10-16
last_verified: 2026-10-19
verified_by: agent
---

"AI Skills for Real Engineers" is the name Matt Pocock gives both the skill set (`mattpocock/skills`, plugin `mattpocock-skills`) and the free seven-lesson email course that walks it. What the course delivers, per the public skill pages, is a single idea-to-ship chain the router skill calls the main flow, two detours, and an on-ramp for unattended execution. The lesson pages themselves were not reachable on 2026-10-16 (see Evidence), so this map ties each lesson topic to the public page that documents the same skill and to the repo notes built from it.

## When to use

- Deciding which Pocock skill a task here should start with; the table and the chain below are the route.
- Checking whether a new aihero page is already covered before writing a note.

## Lesson sequence and where each maps

| # | Lesson (per ticket brief) | Public page read | Repo note | Planned per-skill note |
| - | - | - | - | - |
| 1 | Choose your workflow path | `/skills-ask-matt` | this note | pocock-skill-ask-matt |
| 2 | Clarify with /grill-with-docs | `/grill-with-docs`, `/skills-grilling`, `/skills-grill-me` | [grill-with-docs](aihero-grill-with-docs-writes-glossary-and-adrs-as-decisions-settle.md), [rounds](aihero-grilling-asks-the-whole-frontier-in-rounds.md), [failure modes](aihero-grilling-fails-on-oversized-scope-and-ungrillable-questions.md) | pocock-skill-grill-with-docs, pocock-skill-grilling, pocock-skill-grill-me |
| 3 | Test ideas with /prototype and /handoff | `/skills-prototype`, `/skills-handoff` | [prototype](aihero-prototype-answers-one-question-and-survives-on-a-branch.md), [handoff](aihero-handoff-only-when-work-must-travel.md) | pocock-skill-prototype, pocock-skill-handoff |
| 4 | /to-spec and /to-tickets | `/skills-to-spec`, `/skills-to-tickets`, `/tracer-bullets` | [to-spec](aihero-to-spec-records-decisions-and-fixes-test-seams.md), [to-tickets](aihero-to-tickets-cuts-tracer-bullet-tickets-with-blocking-edges.md), [tracer bullets](aihero-tracer-bullets-force-end-to-end-slices.md) | pocock-skill-to-spec, pocock-skill-to-tickets |
| 5 | Safer unattended agents with Sandcastle | no Sandcastle page; `/getting-started-with-ralph`, `/tips-for-ai-coding-with-ralph-wiggum`, hooks posts | [ralph loop](aihero-ralph-loop-hitl-first-then-afk-in-a-sandbox.md), [PreToolUse hooks](aihero-pretooluse-hooks-enforce-cli-rules-deterministically.md) | none (Sandcastle is a separate repo) |
| 6 | /code-review | `/skills-code-review` | [code-review](aihero-code-review-runs-standards-and-spec-axes-in-separate-subagents.md) | pocock-skill-code-review |
| 7 | The full loop | `/skills-implement`, `/skills-implement-spec`, `/skills-pr`, `/skills-retro`, `/skills-setup-matt-pocock-skills` | this note | pocock-skill-implement, pocock-skill-implement-spec, pocock-skill-pr, pocock-skill-retro, pocock-skill-setup-matt-pocock-skills |

## Facts

- The chain every skill page repeats: `grill-with-docs` to `to-spec` to `to-tickets` to `implement` (or `implement-spec` for the whole graph in parallel) to `code-review` to `retro`, with `pr` between review and retro when work ships as a PR. The spec and tickets steps are skipped when the build fits one context window.
- `setup-matt-pocock-skills` runs once per repo and writes `docs/agents/issue-tracker.md`, `domain.md`, and `triage-labels.md`; this repo already carries those files.
- Renames to know when reading older material: `to-prd` became `to-spec`, `to-issues` became `to-tickets`, `decision-mapping`/`pathfinder` became `wayfinder`, `writing-great-skills` became `writing-for-agents`, and `CONTEXT.md` became `GLOSSARY.md` in v1.3.
- Sandcastle (github.com/mattpocock/sandcastle) is described on the `implement-spec` page as a deterministic loop for truly AFK work, preferred over agent-orchestrated runs because no agent makes the orchestration decisions.

## Evidence

Vendor pages, so T1 for structure. The `/skills` page carries the course title, install commands, and a six-entry changelog (v1.0 to v1.3, Apr to Oct 2026). The course's own lesson routes (`/workshops/<module>/<lesson>`) returned nothing: `sitemap.xml` lists one workshop lesson site-wide (an AI SDK lesson), the search API returns zero items of type `lesson`, and guessed landing pages 404. The only workshop is the paid "AI Coding Crash Course" (about 60 lessons, 6 sections, topic list only). The lesson sequence in the table therefore comes from the repo ticket brief, not from a page read. The cohort page lists comparable topics (plan/clear/execute loop, steering, PRDs and tracer bullets, feedback loops, Ralph, prototyping and research) and is marketing (rubric D5), cited only for corroboration.

## Open questions

- Find the actual lesson URLs (email-only, or a route family the discovery surfaces omit) and re-verify the sequence.
- Sandcastle has no readable aihero page; read its README directly when a note on unattended loops is next revised.
