# Triage rubric

Applied to every fetched item by the daily job. Every item gets exactly one verdict in `state/verdicts.jsonl`, with the rule that decided it.

## Relevance gate

The item must touch a topic listed under `topics` in `sources.yaml`. Off-topic: drop, rule `off-topic`.

## Keep when (any one suffices)

- `K1 primary`: official docs, changelog, release notes, or source code of a tool or model in use or under evaluation.
- `K2 procedure`: a technique with steps concrete enough to run on your own work the same day.
- `K3 measured`: a benchmark, eval, or experiment that states its method, inputs, and numbers.
- `K4 post-mortem`: a failure report with specifics: what was tried, what broke, what fixed it.
- `K5 upstream-change`: a change in a dependency this repo tracks.

## Drop when (any one suffices, checked after the keep rules)

- `D1 opinion`: a take with no procedure, no measurement, and no primary source.
- `D2 announcement`: a release with no changelog, or a model with no benchmark method.
- `D3 comparison-no-method`: "X beats Y" without a reproducible setup.
- `D4 social`: threads, screenshots of threads, reaction posts, drama, personnel news.
- `D5 marketing`: vendor content whose substance is a feature list already in the docs.
- `D6 duplicate`: already covered by a note. Name the note in the verdict.

## Evidence tiers

Assign the tier of the best source the item cites, not of the item itself.

- `T1 primary`: official docs, changelog, source code, spec, or first-party API behaviour observed directly.
- `T2 reproduced`: a practitioner write-up with a procedure that was run and its outcome stated.
- `T3 reported`: results without enough method to reproduce.
- `T4 hearsay`: social posts, aggregator summaries, "I heard".

T4 never becomes a note on its own. It may be logged as a lead (`"lead": true` in the verdict) for the validation layer to chase a primary source.

## Verdict format

One JSON line per item in `state/verdicts.jsonl`:

```json
{"id":"<source>:<guid>","date":"2026-10-16","verdict":"keep","rule":"K2","tier":"T2","note":"notes/<slug>.md","reason":"one sentence"}
{"id":"<source>:<guid>","date":"2026-10-16","verdict":"drop","rule":"D1","reason":"one sentence"}
```

`note` is required on keep. `lead: true` is optional on drop.
