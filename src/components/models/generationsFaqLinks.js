// Link helpers for model sections 4 (Generations) and 13 (FAQ).
//
// The page JSON links to the live domain (https://landroverengine.uk/...) and uses "#" where a
// destination was never filled in. Same-site links are made relative (they keep working on preview
// and staging builds and never bounce through the domain), and "#" comparison links are resolved to
// the comparison guides that actually exist under public/compare/ - matched on the pair the copy
// itself names, so a link only appears when the page it promises is real.

const SITE = /^https?:\/\/(?:www\.)?landroverengine\.uk/i;

export function localHref(href = "") {
  if (!href || href === "#") return "";
  const local = href.replace(SITE, "");
  return local === "" ? "/" : local;
}

// same-site links inside the JSON's HTML snippets
export function localHtml(html = "") {
  return String(html).replace(/href=(['"])https?:\/\/(?:www\.)?landroverengine\.uk/gi, "href=$1");
}

// [slug, short label, test on the lower-cased copy]
const COMPARE_PAGES = [
  ["velar-d300-v6-vs-i6", "Velar D300 V6 vs Inline-Six", (t) => /velar/.test(t) && /powertrain|d300|pre-2021/.test(t) && !/range rover sport|evoque/.test(t)],
  ["velar-vs-range-rover-sport", "Velar vs Range Rover Sport", (t) => /velar/.test(t) && /range rover sport/.test(t)],
  ["velar-vs-evoque", "Velar vs Evoque", (t) => /velar/.test(t) && /evoque/.test(t)],
  ["defender-classic-vs-l663", "Defender Classic vs L663", (t) => /classic/.test(t) && /l663/.test(t)],
  ["defender-vs-discovery", "Defender vs Discovery", (t) => /defender/.test(t) && /discovery(?! sport)/.test(t)],
  ["discovery-sport-prefacelift-vs-facelift", "Discovery Sport Pre-Facelift vs Facelift", (t) => /discovery sport/.test(t) && /pre/.test(t) && /facelift/.test(t)],
  ["discovery-sport-vs-evoque", "Evoque vs Discovery Sport", (t) => /discovery sport/.test(t) && /evoque/.test(t)],
  ["discovery-sport-vs-freelander-2", "Freelander 2 vs Discovery Sport", (t) => /discovery sport/.test(t) && /freelander 2/.test(t)],
  ["discovery-4-vs-discovery-5", "Discovery 4 vs Discovery 5", (t) => /discovery 4/.test(t) && /discovery 5/.test(t)],
  ["evoque-l538-vs-l551", "Evoque L538 vs L551", (t) => /l538/.test(t) && /l551/.test(t)],
  ["l494-vs-l461", "Range Rover Sport L494 vs L461", (t) => /l494/.test(t) && /l461/.test(t)],
  ["p38-vs-l322", "Range Rover P38 vs L322", (t) => /p38/.test(t) && /l322/.test(t)],
  ["l322-vs-l405", "Range Rover L322 vs L405", (t) => /l322/.test(t) && /l405/.test(t)],
  ["l405-vs-l460", "Range Rover L405 vs L460", (t) => /l405/.test(t) && /l460/.test(t)],
  ["range-rover-sport-vs-discovery", "Range Rover Sport vs Discovery", (t) => /range rover sport/.test(t) && /discovery(?! sport)/.test(t)],
  ["range-rover-vs-range-rover-sport", "Range Rover vs Range Rover Sport", (t) => /range rover sport/.test(t) && /range rover(?! sport)/.test(t)],
];

// The comparison guide a piece of copy is about, or null: { href, label }
export function comparePage(text = "") {
  const t = String(text).replace(/<[^>]+>/g, " ").toLowerCase();
  const hit = COMPARE_PAGES.find(([, , test]) => test(t));
  return hit ? { href: `/compare/${hit[0]}`, label: hit[1] } : null;
}
