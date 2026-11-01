import variantCars from "@/data/variant-design/variantCars.json";

// Per-variant assets for the redesigned variant pages, keyed by the registry `dataFile`.
// The car is a transparent cutout matched to the variant's generation (null when there is no
// clean cutout for it, e.g. Discovery 1/2, Range Rover Classic/P38A - the scenes then show the
// landscape on its own). 200Tdi pages show the 200Tdi engine photo, every other page a generic one.

export const variantCar = (dataFile) => variantCars[dataFile] || null;

export const variantEngine = (dataFile = "") =>
  /200tdi/.test(dataFile) ? "/variant/sec2_engine.webp" : "/variant/sec10_engine.webp";
