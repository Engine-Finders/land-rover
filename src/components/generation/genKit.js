import { generationCar } from "@/components/models/modelKit";

// Helpers shared by the generation page sections.

// the page's model, when its URL parent is not the model's own slug
export const MODEL_SLUG = {
  "range-rover-velar": "velar",
  "land-rover-range-rover": "range-rover",
  "land-rover-discovery-3": "discovery",
  "land-rover-freelander-2": "freelander",
  "discovery-4": "discovery",
  "range-rover-classic": "range-rover",
};

// the generation code for watermarks and copy: L316, P38A, D1 … or "Classic"
export function genCode(text = "") {
  const m = String(text).match(/\b(L\d{3}|P38A?|D\d)\b/i);
  if (m) return m[1].toUpperCase();
  return /Classic/i.test(text) ? "Classic" : "";
}

// the generation's own car cut-out, from the hero's headline and pill
export function genCar(hero = {}, model = "") {
  return generationCar(`${hero?.h1 || ""} ${hero?.tagPill || ""}`, MODEL_SLUG[model] || model);
}

// The engine database (section 2) shows the car its reference shows where that differs from the
// hero's: the Defender L316 reference has the long-wheelbase 110 in Coniston green with a white roof
// (scripts/build-defender-110-green.py).
const DB_CARS = {
  L316: "/variant/cars/land-rover-defender-110-county-coniston-green.webp",
};

export function engineDbCar(hero = {}, model = "") {
  return DB_CARS[genCode(`${hero?.h1 || ""} ${hero?.tagPill || ""}`)] || genCar(hero, model);
}

// the generation's display name, from the overview heading ("Land Rover Defender L316 - Overview")
export function genName(page = {}) {
  return String(page?.overview?.h2 || page?.hero?.h1 || "")
    .split(/\s+[-–-]\s+/)[0]
    .replace(/\s+Engines?$/i, "")
    .trim();
}
