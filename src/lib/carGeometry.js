import carMeta from "@/data/variant-design/carMeta.json";

// Per-image car cutout geometry measured into carMeta.json: the exact aspect ratio (so overlays
// shaped by the car's own alpha line up pixel for pixel) and the three visible tyre contact
// points [x%, y%, width%] - front-left, near front, near rear.

const FALLBACK_WHEELS = [[12, 94, 7], [60, 100, 6], [92, 84, 6]];

export const carRatio = (src) => (carMeta[src] ? `${carMeta[src].w} / ${carMeta[src].h}` : "633 / 419");
export const carWheels = (src) => carMeta[src]?.wheels || FALLBACK_WHEELS;
