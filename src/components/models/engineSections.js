import { generationCar, modelName } from "@/components/models/modelKit";

// Helpers shared by the model page's engine sections: Engine Codes database (section 5) and
// Engine Evolution (section 9). Everything here is derived from the page JSON - counts, ranges
// and links to engine pages that exist in this repo (src/data/registery/engines/pages.json).

// ------------------------------------------------------------------ text

const TAG_RE = /\[((?:EM-|PLACEHOLDER)[^\]]*)\]/g;
const tagHtml = (t) =>
  `<span class="${t.length > 16 ? "" : "whitespace-nowrap "}font-medium text-lr-green">[${t}]</span>`;

// Table-cell copy: a leading "-" (no value) becomes an em dash, " - " becomes " - ", straight
// double quotes curly, and data tags green. Long tags may wrap (narrow cells); short ones don't.
export function cellHtml(raw = "") {
  return String(raw)
    .trim()
    .replace(/^-(\s|$)/, "-$1")
    .replace(/\s+-\s+/g, " - ")
    .replace(/"([^"<>]+)"/g, "“$1”")
    .replace(TAG_RE, (_, t) => tagHtml(t));
}

// "£3,500–£5,800 [EM-QUOTE]" -> { main: "£3,500–£5,800", tags: ["EM-QUOTE"] }, so the figure and
// its data tag can sit on separate lines as in the reference.
export function splitTags(raw = "") {
  const tags = [];
  const main = String(raw)
    .replace(TAG_RE, (_, t) => {
      tags.push(t);
      return "";
    })
    .trim();
  return { main: cellHtml(main), tags: tags.map((t) => cellHtml(`[${t}]`)) };
}

export const stripHtml = (html = "") => String(html).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// ------------------------------------------------------------------ engine pages

const ENGINE_PAGES = [
  [/\bTD5\b/i, "td5"],
  [/\b(?:200|300)?Tdi\b/, "200-300tdi"],
  [/\b276DT\b/i, "276dt"],
  [/\b306DT\b/i, "306dt"],
  [/\b368DT\b/i, "368dt"],
  [/\b448DT\b/i, "448dt"],
  [/\bAJ20D6\b/i, "aj20d6"],
  [/\bAJ20P6\b/i, "aj20p6"],
  [/\bAJ133\b/i, "aj133"],
  [/\bAJ-V8\b|\b4\.2 SC\b/i, "aj-v8-42-44-sc"],
  [/\bSi4\b/, "ford-si4-pt204"],
  [/\bSI6\b/, "volvo-si6"],
  [/\b204PT\b/i, "ingenium-20-petrol"],
  [/\b204DTD\b/i, "psa-dw12-204dtd"],
  [/\bM47/, "m47"],
  [/\bM51\b/, "m51"],
  [/\bM57\b/, "m57-td6"],
  [/\bM62\b/, "m62"],
  [/K-series/i, "k-series-18-23"],
];

// the engine page for a code ("306DT (D300 V6)" -> "/engine/306dt"), or "" when there is none
export function enginePage(code = "") {
  const text = stripHtml(code);
  const hit = ENGINE_PAGES.find(([re]) => re.test(text));
  return hit ? `/engine/${hit[1]}` : "";
}

// ------------------------------------------------------------------ engine shots (section 9)

// Seven engine cut-outs trimmed onto one 340x300 canvas (scripts/build-engine-evolution-art.py).
// Each engine type lists shots in order of preference; a row never repeats a shot while another
// suitable one is free, so a four-engine era shows four different engines where it can.
const SHOT = (n) => `/model/engines/${n}.webp`;
const SHOTS = [
  [/\b(?:200|300)?Tdi\b/, ["tdi-classic", "lr-black"]],
  [/\bTD5\b/i, ["lr-black", "lr-black-alt"]],
  [/\bVM\b|L-series|\bDi\b|\bM47|\bM51\b|\bTd4\b/, ["lr-black-alt", "lr-black"]],
  [/\bM57\b|AJ20D6|D300 i6|D350/i, ["modern-six", "lr-black-alt"]],
  [/\b(?:276|306)DT\b|TDV6|SDV6|D300 V6/i, ["v6-diesel", "lr-black"]],
  [/\b(?:368|448)DT\b|TDV8|SDV8/i, ["lr-black", "lr-black-alt"]],
  [/AJ20P6|\bSI6\b|P440e|P510e|\bPHEVs?\b/i, ["modern-six", "lr-black-alt"]],
  [/AJ126|3\.0 SC|KV6/i, ["lr-black-alt", "v6-diesel"]],
  [/AJ133|AJ-V8|V8|M62|P530|508PS|SVR|\bSV\b/i, ["compact-black", "v6-diesel", "lr-black"]],
  [/224DT|204DTD|Duratorq|eD4|TD4|SD4/i, ["inline4-diesel", "compact-black"]],
  [/204PT|\bSi4\b|K-series|AJ20P3|P300e|P400e|1\.8/i, ["compact-black", "inline4-diesel"]],
];
const FALLBACK_SHOTS = ["lr-black-alt", "lr-black", "compact-black"];
// when a row has used every shot suited to an engine, any other unused shot beats a repeat
// (the 200Tdi shot carries its name on the cover, so it is never borrowed)
const SPARE_SHOTS = ["lr-black-alt", "modern-six", "compact-black", "inline4-diesel", "v6-diesel", "lr-black"];

// "306DT D300" -> { code: "306DT", sub: "(D300)" }; "Td4 (M47R)" -> { code: "Td4", sub: "(M47R)" };
// names that are one thing ("Si4 GTDi", "2.5 KV6", "P530/SV") stay whole
export function engineLabel(item = "") {
  const text = stripHtml(item);
  const m = text.match(/^(\S+)\s+(.+)$/);
  if (!m) return { code: text, sub: "" };
  if (m[2].startsWith("(")) return { code: m[1], sub: m[2] };
  if (/^(?:[DP]\d{3}e?|MHEV|PHEV|SDV8|SDV6|SVR|SV)$/.test(m[2])) return { code: m[1], sub: `(${m[2]})` };
  return { code: text, sub: "" };
}

// "204DTD, 204PT, 306DT D300" -> [{ code, sub, shot, href }]; "-" -> []
export function keyEngines(list = "") {
  const used = new Set();
  return String(list)
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter((s) => s && s !== "-" && s !== "-")
    .map((item) => {
      const text = stripHtml(item);
      const pool = (SHOTS.find(([re]) => re.test(text)) || [null, FALLBACK_SHOTS])[1];
      const pick = pool.find((n) => !used.has(n)) || SPARE_SHOTS.find((n) => !used.has(n)) || pool[0];
      used.add(pick);
      return { ...engineLabel(item), shot: SHOT(pick), href: enginePage(text) };
    });
}

// ------------------------------------------------------------------ years, generations, cars

const NOW = new Date().getFullYear();

// "2017–2020" -> [2017, 2020]; "2019.5–present" -> [2019, NOW]; "2014→" -> [2014, NOW]; "2015" -> [2015, 2015]
export function yearSpan(text = "") {
  const t = stripHtml(text);
  const m = t.match(/(\d{4})(?:\.\d)?\s*(?:[–--]\s*(\d{4}|present|today)|(→))?/i);
  if (!m) return null;
  const start = Number(m[1]);
  const end = m[3] || /present|today/i.test(m[2] || "") ? NOW : m[2] ? Number(m[2]) : start;
  return [start, end];
}

// The car for an era row: the generation (from the page's generation cards) that overlaps the
// era's years the most - "Tdi era 1989–1998" on the Discovery page is the Discovery 1 - with the
// era text added so facelift eras pick the facelift car. Falls back to the model's own car.
export function eraCar(era = "", years = "", slug = "", page = null) {
  const span = yearSpan(years);
  const cards = (page?.generations?.cards || []).filter((c) => c.verdict && yearSpan(c.meta));
  let best = null;
  let bestScore = -Infinity;
  if (span) {
    for (const c of cards) {
      const [a, b] = yearSpan(c.meta);
      const score = Math.min(b, span[1]) - Math.max(a, span[0]) + 1;
      if (score > bestScore || (score === bestScore && a > yearSpan(best.meta)[0])) {
        best = c;
        bestScore = score;
      }
    }
  }
  const named = best && bestScore > 0 ? stripHtml(best.title) : modelName(slug);
  return generationCar(`${named} ${era} ${years}`, slug);
}

// ------------------------------------------------------------------ figures for the stat cards

// hero "275+ Enquiries (2025) [EM-VERIFIED] - …" -> { value: "275+", label: "Enquiries in 2025" }
export function heroEnquiries(page) {
  const label = stripHtml(page?.hero?.trustStrip?.[0]?.label || "");
  const m = label.match(/^([\d,]+\+?)\s+(.*?Enquiries)\s*\((\d{4})\)/i);
  return m ? { value: m[1], label: `${m[2]} in ${m[3]}` } : null;
}

// generations with a written verdict on the page's generation cards (or the hero pill's count)
export function generationCount(page) {
  const n = (page?.generations?.cards || []).filter((c) => c.verdict).length;
  if (n) return n;
  const m = stripHtml(page?.hero?.tagPill || "").match(/(\d+)\s+Generations?/i);
  return m ? Number(m[1]) : 0;
}

// lowest-to-highest of every £ figure in the engines' recon costs: "£3K–£12K"
export function reconRange(engines = []) {
  const nums = engines
    .flatMap((e) => String(e.avgRebuildCost || "").match(/£\s?[\d,]+/g) || [])
    .map((s) => Number(s.replace(/[£,\s]/g, "")))
    .filter((n) => n > 0);
  if (!nums.length) return "";
  const k = (n) => `£${n % 1000 === 0 ? n / 1000 : (n / 1000).toFixed(1)}K`;
  return `${k(Math.min(...nums))}–${k(Math.max(...nums))}`;
}

// distinct engine families in the database, and the fuel mix they cover
export function engineFamilies(engines = []) {
  const families = new Set(engines.map((e) => stripHtml(e.family)).filter(Boolean));
  const fuels = engines.map((e) => stripHtml(e.fuel).toLowerCase());
  const parts = [];
  if (fuels.some((f) => f.includes("diesel"))) parts.push("diesel");
  if (fuels.some((f) => f.includes("petrol"))) parts.push("petrol");
  if (fuels.some((f) => /hev|hybrid/.test(f))) parts.push("hybrid");
  const mix = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} & ${parts.at(-1)}` : parts[0] || "";
  return { count: families.size, mix: mix ? mix[0].toUpperCase() + mix.slice(1) : "" };
}
