// Deterministic fetcher. No model calls. Reads sources.yaml, appends new items
// to state/seen.jsonl, and writes every item that has no verdict yet to
// inbox/pending.json for the daily job to triage. Safe to run repeatedly.
//
// Usage: node scripts/fetch.ts [--days N]

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import { parse as parseYaml } from "yaml";

const ROOT = join(import.meta.dirname, "..");
const SEEN = join(ROOT, "state", "seen.jsonl");
const VERDICTS = join(ROOT, "state", "verdicts.jsonl");
const PENDING = join(ROOT, "inbox", "pending.json");

type FeedSource = { id: string; kind: "rss" | "atom"; url: string; defaultTier?: string; why?: string };
type HnSource = { id: string; kind: "hn"; queries: string[]; minPoints?: number; defaultTier?: string; why?: string };
type Source = FeedSource | HnSource;
type Config = { lookbackDays?: number; topics: string[]; sources: Source[] };

type Item = {
  id: string;
  source: string;
  title: string;
  url: string;
  published: string;
  summary: string;
  fetched: string;
};

const args = process.argv.slice(2);
const daysFlag = args.indexOf("--days");
const config = parseYaml(readFileSync(join(ROOT, "sources.yaml"), "utf8")) as Config;
const lookbackDays = daysFlag >= 0 ? Number(args[daysFlag + 1]) : (config.lookbackDays ?? 2);
const since = Date.now() - lookbackDays * 86_400_000;
const now = new Date().toISOString();

function readJsonl<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "#text" in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)["#text"]);
  }
  return String(value);
}

function strip(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

function iso(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? now : date.toISOString();
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

async function get(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "user-agent": "ai-knowledge fetcher (personal knowledge base; contact via GitHub)" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function parseFeed(sourceId: string, body: string): Item[] {
  const doc = xml.parse(body);
  const items: Item[] = [];
  if (doc.rss) {
    for (const entry of asArray<any>(doc.rss.channel?.item)) {
      const url = text(entry.link);
      items.push({
        id: `${sourceId}:${text(entry.guid) || url}`,
        source: sourceId,
        title: text(entry.title),
        url,
        published: iso(text(entry.pubDate)),
        summary: strip(text(entry.description)),
        fetched: now,
      });
    }
  } else if (doc.feed) {
    for (const entry of asArray<any>(doc.feed.entry)) {
      const links = asArray<any>(entry.link);
      const alternate = links.find((l) => !l["@_rel"] || l["@_rel"] === "alternate") ?? links[0];
      const url = alternate?.["@_href"] ?? "";
      items.push({
        id: `${sourceId}:${text(entry.id) || url}`,
        source: sourceId,
        title: text(entry.title),
        url,
        published: iso(text(entry.published ?? entry.updated)),
        summary: strip(text(entry.summary ?? entry.content)),
        fetched: now,
      });
    }
  } else {
    throw new Error("neither RSS nor Atom");
  }
  return items;
}

async function fetchHn(source: HnSource): Promise<Item[]> {
  const items: Item[] = [];
  const sinceSeconds = Math.floor(since / 1000);
  for (const query of source.queries) {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.searchParams.set("query", query);
    url.searchParams.set("tags", "story");
    url.searchParams.set("numericFilters", `created_at_i>${sinceSeconds},points>=${source.minPoints ?? 20}`);
    url.searchParams.set("hitsPerPage", "50");
    const data = JSON.parse(await get(url.toString()));
    for (const hit of data.hits ?? []) {
      items.push({
        id: `${source.id}:${hit.objectID}`,
        source: source.id,
        title: hit.title ?? "",
        url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
        published: iso(hit.created_at),
        summary: strip(`${hit.points} points, ${hit.num_comments} comments, matched "${query}". ${hit.story_text ?? ""}`),
        fetched: now,
      });
    }
  }
  return items;
}

const seen = readJsonl<Item>(SEEN);
const seenIds = new Set(seen.map((item) => item.id));
const verdictIds = new Set(readJsonl<{ id: string }>(VERDICTS).map((verdict) => verdict.id));
const summary: Record<string, string> = {};
const fresh: Item[] = [];

for (const source of config.sources) {
  try {
    const items =
      source.kind === "hn"
        ? await fetchHn(source)
        : parseFeed(source.id, await get(source.url)).filter((item) => Date.parse(item.published) >= since);
    let added = 0;
    for (const item of items) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
      fresh.push(item);
      added++;
    }
    summary[source.id] = `${items.length} in window, ${added} new`;
  } catch (error) {
    summary[source.id] = `ERROR ${(error as Error).message}`;
  }
}

mkdirSync(dirname(SEEN), { recursive: true });
mkdirSync(dirname(PENDING), { recursive: true });
if (fresh.length > 0) {
  appendFileSync(SEEN, fresh.map((item) => JSON.stringify(item)).join("\n") + "\n");
}
const pending = [...seen, ...fresh].filter((item) => !verdictIds.has(item.id));
writeFileSync(PENDING, JSON.stringify(pending, null, 2) + "\n");

console.log(`${fresh.length} new items, ${pending.length} pending triage (lookback ${lookbackDays}d)`);
for (const [id, line] of Object.entries(summary)) console.log(`  ${id}: ${line}`);

const allFailed = config.sources.every((source) => summary[source.id]?.startsWith("ERROR"));
process.exit(allFailed ? 1 : 0);
