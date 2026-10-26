/**
 * Pick a local car image from public/cars for a reg-lookup vehicle.
 * Model name only (no generation/variant scoring). Fallback = brand default.
 *
 * DVLA often shortens RANGE ROVER → "R ROVER" (e.g. "R ROVER SPORT HSE…").
 */

export const DEFAULT_VEHICLE_IMAGE = "/right.webp";

/** One representative front-angle photo per model line. */
const MODEL_IMAGES = {
  defender:
    "/cars/land rover-defender-l663-110-5-door suv-2020–-new-gondwana stone-l663 110-45-angle-front-view.webp",
  discovery:
    "/cars/land rover-discovery-l462 lci-r-dynamic hse luxury-5-door suv-2020–2024-new-santorini black-disc rd lux-45-angle-front-view.webp",
  "discovery sport":
    "/cars/land rover-discovery sport-l550 lci-black edition-compact suv-2020–2022-special-santorini black-ds black fl-45-angle-front-view.webp",
  freelander:
    "/cars/land rover-freelander-l359 lci-hse luxury-compact suv-2012–2014-new-orkney grey-fl lux-45-angle-front-view.webp",
  "range rover":
    "/cars/land rover-range rover-l460-autobiography lwb-luxury suv-2022–-new-borasco grey-l460 auto lwb-45-angle-front-view.webp",
  "range rover sport":
    "/cars/range rover-sport-l461-autobiography-suv-2022–-new-ostuni white-l461 auto-45-angle-front-view.webp",
  evoque:
    "/cars/range rover-evoque-l551 lci-autobiography black-5-door suv-2023–-special-narvik black-l551 fl black-45-angle-front-view.webp",
  velar:
    "/cars/range rover-velar-l560 lci-belgravia edition-suv-2026–-special-hakuba silver-velar belgravia-45-angle-front-view.webp",
};

/** Longer / more specific names first. */
const MODEL_RULES = [
  { re: /discovery\s*sport/, key: "discovery sport" },
  { re: /range\s*rover\s*sport|\brr\s*sport\b/, key: "range rover sport" },
  { re: /\bevoque\b|range\s*rover\s*evoque/, key: "evoque" },
  { re: /\bvelar\b|range\s*rover\s*velar/, key: "velar" },
  { re: /range\s*rover/, key: "range rover" },
  { re: /\bdiscovery\b/, key: "discovery" },
  { re: /\bdefender\b/, key: "defender" },
  { re: /\bfreelander\b/, key: "freelander" },
];

/** Expand DVLA / VRM abbreviations so matching works. */
function normalizeHaystack(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    // "R ROVER SPORT…" / "R ROVER EVOQUE…" → "range rover …"
    .replace(/\br\s*rover\b/g, "range rover")
    .replace(/\brr\s*sport\b/g, "range rover sport")
    .replace(/\brr\s*evoque\b/g, "evoque")
    .replace(/\brr\s*velar\b/g, "velar");
}

function encodePublicPath(path) {
  // Keep leading slash; encode the rest so spaces / en-dashes work in <Image src>.
  if (!path || path === DEFAULT_VEHICLE_IMAGE) return path || DEFAULT_VEHICLE_IMAGE;
  if (path.startsWith("/")) return `/${encodeURI(path.slice(1))}`;
  return encodeURI(path);
}

/**
 * @param {{ brand?: string, series?: string, model?: string }} vehicle
 * @returns {string} public URL for next/image
 */
export function matchVehicleImage(vehicle = {}) {
  const brand = String(vehicle.brand || "").trim();
  const series = String(vehicle.series || "").trim();
  const model = String(vehicle.model || "").trim();
  const haystack = normalizeHaystack(`${brand} ${series} ${model}`);

  for (const rule of MODEL_RULES) {
    if (rule.re.test(haystack)) {
      return encodePublicPath(MODEL_IMAGES[rule.key] || DEFAULT_VEHICLE_IMAGE);
    }
  }

  // No model match → brand default (this site is Land Rover–focused).
  return DEFAULT_VEHICLE_IMAGE;
}
