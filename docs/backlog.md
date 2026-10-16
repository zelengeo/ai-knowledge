# Backlog

Tickets waiting for the GitHub repo. Once the remote exists, each becomes a GitHub issue with the label shown, and this file is deleted. Order is rough priority.

## 1. Create the public GitHub repo and push `main` · ready-for-human

Create `zelengeo/ai-knowledge` (public), add the remote, push. Then the daily job can push branches and open PRs. Blocks everything below that mentions a PR.

## 2. Seed notes from the Pocock skills · ready-for-agent

One note per promoted skill in `mattpocock/skills` (25 at v1.2.3): when it earns its place, what the upstream docs page claims, our delta if any. Link upstream `SKILL.md` and `https://aihero.dev/skills-<name>`. Status `inbox`; the human marks the ones in daily use `adopted`. Do not copy skill bodies (docs/adr/0005).

## 3. Seed notes from AI Hero · ready-for-agent

Walk the markdown twins: `https://www.aihero.dev/sitemap.md`, the AI Coding Dictionary at `https://www.aihero.dev/ai-coding-dictionary`, and the free workshop lessons under `/workshops/<module>/<lesson>.md`. Summarise claims with links, never reproduce content. Fold dictionary terms into `CONTEXT.md` where this repo uses them.

## 4. Validation layer, "later" subset · ready-for-human (design) then ready-for-agent

Implement the deferred parts of `docs/validation-contract.md`: primary-source search for T3 and T4 leads, sandboxed reproduction of T2 procedures, contradiction detection. Decide the sandbox first (the AI Hero course lesson on Sandcastle is a candidate).

## 5. Package `skills/` as an installable plugin · ready-for-agent

Add `.claude-plugin/plugin.json` and whatever the `agentskills` spec needs so this repo's own skills install into Claude Code and Codex. Run `claude plugin validate . --strict`.

## 6. Watchlist review after two weeks of data · ready-for-human

From `state/verdicts.jsonl`, compute keep and drop counts per source. Prune sources with no keeps; consider the sources the daily PRs proposed. Candidate additions to evaluate: Codex CLI releases, the Cursor changelog, arXiv cs.SE with a tight keyword filter.

## 7. Move the daily job to GitHub Actions · ready-for-human

Same procedure as `docs/daily-job.md`, triggered by cron, using the Claude Code action with an API key secret. Only worth it when the local scheduled task becomes the bottleneck.

## 8. Obsidian as viewer · ready-for-human

Decide what, if anything, from `.obsidian/` is worth committing (probably nothing). Confirm that frontmatter tags and plain links give enough navigation. Revisit docs/adr/0004 if not.

## 9. Publishing flow · needs-triage

When a note reaches `adopted` and has been stable for a month, it is a candidate post. Decide the format and the channel. Out of scope until the notes exist.
