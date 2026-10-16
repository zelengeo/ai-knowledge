// Shared handling for untrusted fetched text. Deterministic, no model calls.
// Two jobs: strip characters that hide text from a human reviewer, and flag
// phrases that look like instructions aimed at an agent. Flags are hints for
// the reviewer and the triage step, never a verdict: release notes legitimately
// say "npm install", so a flag means "look", not "drop".

export type Flag =
  | "override"
  | "role-claim"
  | "agent-address"
  | "system-tag"
  | "install-command"
  | "exfiltration"
  | "secrets"
  | "encoded-blob";

const MARKERS: { id: Flag; re: RegExp }[] = [
  { id: "override", re: /\b(ignore|disregard|forget)\b[^.\n]{0,40}\b(previous|prior|above|earlier|all)\b[^.\n]{0,20}\b(instructions?|prompts?|rules?)\b/i },
  { id: "role-claim", re: /\b(you are (now )?(an? )?(ai|assistant|agent|llm|claude|gpt|model)\b|as an ai (assistant|model|agent)\b|your (new )?(task|goal|objective) is\b)/i },
  { id: "agent-address", re: /\b(paste this into|run this in|tell your (agent|assistant)|if you are an? (ai|agent|llm|assistant)|dear (ai|agent|assistant|claude|copilot)|attention (ai|agents?|assistants?|llms?)|coding agents?:)\b/i },
  { id: "system-tag", re: /<\/?\s*(system|assistant|user|human|instructions?|tool_call|function_call|tool_result)\b[^>]*>/i },
  { id: "install-command", re: /\b(brew install|apt(-get)? install|choco install|winget install|npm i(nstall)? (-g|--global)|npx [a-z@][^\n]{0,60}|pnpm dlx|pip3? install|curl [^\n|]{0,200}\|\s*(ba|z)?sh\b|wget [^\n|]{0,200}\|\s*(ba|z)?sh\b|iwr [^\n|]{0,200}\|\s*iex\b|Invoke-Expression)/i },
  { id: "exfiltration", re: /\b(send|post|upload|forward|exfiltrate|transmit)\b[^.\n]{0,60}\b(to|at)\b[^.\n]{0,20}(https?:\/\/|webhook|discord|telegram|pastebin|ngrok)/i },
  { id: "secrets", re: /\b(api[_ -]?keys?|secrets?|tokens?|passwords?|credentials?|\.env\b|ssh keys?)\b[^.\n]{0,60}\b(print|cat|read|send|include|paste|reveal|dump|echo)\b/i },
  { id: "encoded-blob", re: /(?:[A-Za-z0-9+/]{4}){30,}={0,2}/ },
];

// Zero-width, bidi override, soft hyphen, BOM, variation selectors, private
// use, and tag characters: everything that makes text read differently to a
// human than to a parser. Built from code points at runtime because some of
// these (U+2028, U+2029) are line terminators and cannot sit inside a regex
// literal in source.
const INVISIBLE_RANGES: [number, number][] = [
  [0x00ad, 0x00ad], // soft hyphen
  [0x034f, 0x034f], // combining grapheme joiner
  [0x061c, 0x061c], // arabic letter mark
  [0x115f, 0x1160], // hangul fillers
  [0x17b4, 0x17b5], // khmer inherent vowels
  [0x180e, 0x180e], // mongolian vowel separator
  [0x200b, 0x200f], // zero width space .. right-to-left mark
  [0x2028, 0x202e], // line/paragraph separators, bidi embeddings and overrides
  [0x2060, 0x206f], // word joiner .. nominal digit shapes
  [0x3164, 0x3164], // hangul filler
  [0xe000, 0xf8ff], // private use area
  [0xfe00, 0xfe0f], // variation selectors
  [0xfeff, 0xfeff], // byte order mark
  [0xffa0, 0xffa0], // halfwidth hangul filler
  [0xfff9, 0xfffb], // interlinear annotation
  [0xe0000, 0xe007f], // tag characters
];

const INVISIBLE = new RegExp(
  "[" +
    INVISIBLE_RANGES.map(([from, to]) =>
      from === to ? String.fromCodePoint(from) : `${String.fromCodePoint(from)}-${String.fromCodePoint(to)}`,
    ).join("") +
    "]",
  "gu",
);

export function sanitize(text: string): { text: string; stripped: number } {
  let stripped = 0;
  const cleaned = text
    .replace(INVISIBLE, () => {
      stripped++;
      return "";
    })
    .normalize("NFKC");
  return { text: cleaned, stripped };
}

export function scan(text: string): Flag[] {
  const flags: Flag[] = [];
  for (const marker of MARKERS) {
    if (marker.re.test(text)) flags.push(marker.id);
  }
  return flags;
}

// Crude HTML to text. Good enough for triage; the markdown twin is preferred
// where a site offers one.
export function htmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr|pre|blockquote|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}
