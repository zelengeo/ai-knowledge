# Glossary

The vocabulary this repo uses. Use these terms in notes, tickets, and PR descriptions; do not drift to synonyms.

- **Source**: a feed, API, or repo listed in `sources.yaml`. Each has a `why` line that justifies its place.
- **Item**: one thing a source produced in a fetch: a post, release, story. Identified by `<source-id>:<guid>`.
- **Watchlist**: the set of sources. Kept tight; growth is a decision, not a drift.
- **Triage**: applying `docs/rubric.md` to an item. Produces exactly one verdict.
- **Verdict**: keep or drop, with the rule that decided it and an evidence tier. Logged in `state/verdicts.jsonl`.
- **Evidence tier**: T1 primary, T2 reproduced, T3 reported, T4 hearsay. The tier of the best source cited, never of the write-up itself.
- **Note**: a claim with evidence, as a markdown file under `notes/`. Opinion without a procedure or a measurable fact is not a note.
- **Skill**: a procedure an agent runs when a task matches its trigger, as `skills/<name>/SKILL.md`. A note becomes a skill when it is `adopted` and has steps.
- **Status**: where a note stands with the human: `inbox`, `tried`, `adopted`, `deprecated`. Only humans promote.
- **Validation**: checking that a claim is still true and still evidenced, per `docs/validation-contract.md`. Distinct from triage, which happens once at intake.
- **Digest**: the daily PR description. There is no separate digest file.
- **Upstream**: a dependency whose changes we track: the Pocock skills, the coding agent in use.
- **Lead**: a T4 item logged for the validation layer to chase a primary source, not a note.
