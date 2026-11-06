import genPages from "@/data/registery/generations/pages.json";
import modelPages from "@/data/registery/models/pages.json";

// Link resolution for sections 11 (CalculatorCTA) and 14 (ClosingActionCards). The page JSON was
// written against planned URLs (/calculator/?model=…, /quotes/?model=…, /velar/l560/, absolute
// landroverengine.uk links); this maps each one onto a route that exists in this app, so no button
// leads to a 404 or a redirect chain:
//   /calculator/identify…  -> /tools/registration-lookup   (public/tools/*.html, served at clean URLs)
//   /calculator… (verdict) -> /tools/repair-vs-replace-calculator
//   /calculator… (diagnose)-> /tools/diagnostic-wizard
//   /quotes…               -> /quote                       (app route)
//   /<model>/<gen-code>    -> the generation page in src/data/registery/generations/pages.json
// Anything else that has no page returns "" (render it as text, not a dead link).

const ORIGIN = /^https?:\/\/(www\.)?landroverengine\.uk/i;
const GEN_ROUTES = new Set(genPages.filter((p) => p.parent && p.slug).map((p) => `/${p.parent}/${p.slug}`));
const MODEL_ROUTES = new Set(modelPages.filter((p) => p.slug).map((p) => `/${p.slug}`));

export const TOOLS = {
  verdict: "/tools/repair-vs-replace-calculator",
  identify: "/tools/registration-lookup",
  diagnose: "/tools/diagnostic-wizard",
  quote: "/quote",
};

export function resolveHref(href = "", kind = "verdict") {
  if (!href || href.trim() === "#") return "";
  const [rawPath, query = ""] = href.trim().replace(ORIGIN, "").split("?");
  const path = rawPath.replace(/\/+$/, "") || "/";
  const q = query ? `?${query}` : "";
  if (/^\/calculator\/identify/i.test(path)) return TOOLS.identify + q;
  if (/^\/calculator/i.test(path)) return (kind === "diagnose" ? TOOLS.diagnose : TOOLS.verdict) + q;
  if (/^\/quotes?$/i.test(path)) return TOOLS.quote + q;
  if (path === "/" || GEN_ROUTES.has(path) || MODEL_ROUTES.has(path)) return path + q;
  const gen = path.match(/^\/[^/]+\/([a-z0-9-]+)$/i);
  if (gen) {
    const hit = genPages.find((p) => p.parent && p.slug === gen[1].toLowerCase());
    if (hit) return `/${hit.parent}/${hit.slug}`;
  }
  return "";
}

// Short label for a generation card title: "Discovery 1 (D1)" -> "D1", "Discovery 4 (L319)" -> "D4",
// "Freelander 2 (L359)" -> "FL2", "Range Rover Sport L494" -> "L494", "Range Rover Classic" -> "Classic".
function genLabel(title = "") {
  const disco = title.match(/Discovery (\d)\b/);
  if (disco) return `D${disco[1]}`;
  const fl = title.match(/Freelander (\d)\b/);
  if (fl) return `FL${fl[1]}`;
  const code = title.match(/\b(L\d{3}|P38A?|Classic)\b/i);
  if (code) return code[1];
  const paren = title.match(/\(([^)]+)\)/);
  return paren ? paren[1] : title;
}

// The model's generation pages that exist, from the generations section's cards (in page order).
export function generationLinks(page) {
  const seen = new Set();
  return (page?.generations?.cards || [])
    .map((c) => ({ label: genLabel(c.title), href: resolveHref(c.cta?.href || "") }))
    .filter((g) => g.href && !seen.has(g.href) && seen.add(g.href));
}
