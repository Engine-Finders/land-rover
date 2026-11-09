/** Shared CTA label helpers for Land Rover / Range Rover pages. */

const MODEL_META = {
  defender: { label: "Land Rover Defender", short: "Defender" },
  discovery: { label: "Land Rover Discovery", short: "Discovery" },
  "discovery-sport": { label: "Land Rover Discovery Sport", short: "Discovery Sport" },
  freelander: { label: "Land Rover Freelander", short: "Freelander" },
  "range-rover": { label: "Range Rover", short: "Range Rover" },
  "range-rover-sport": { label: "Range Rover Sport", short: "Range Rover Sport" },
  "range-rover-evoque": { label: "Range Rover Evoque", short: "Evoque" },
  evoque: { label: "Range Rover Evoque", short: "Evoque" },
  velar: { label: "Range Rover Velar", short: "Velar" },
  "range-rover-velar": { label: "Range Rover Velar", short: "Velar" },
};

export function modelMeta(slug = "") {
  return MODEL_META[slug] || { label: "Land Rover", short: "Land Rover" };
}

export function modelCtaCopy(slug = "") {
  const { label, short } = modelMeta(slug);
  return {
    label,
    short,
    heroButton: `Explore ${short} Engine Replacement Options`,
    heroSupport: `Enter your registration to explore ${label} engine replacement options, costs and specialist guidance.`,
    problemsButton: `Diagnose ${label} Engine Problems`,
    problemsSupport: "Experiencing similar symptoms? Explore possible faults and understand your repair or replacement options.",
    costsButton: `Get a ${label} Engine Quote`,
    costsSupport: `Compare used, reconditioned and rebuilt ${label} engine options with a quote tailored to your vehicle.`,
    path1Button: `Start ${label} Diagnosis`,
    path1Support: "Know your engine? Explore likely faults and compare repair-versus-replacement costs.",
    path2Button: `Identify ${short} Engine Code`,
    path2Support: "Not sure which engine you have? Identify your engine code before starting diagnosis.",
  };
}

export function generationCtaCopy({ brandLabel = "Land Rover", modelShort = "", generation = "" } = {}) {
  const modelBit = modelShort ? ` ${modelShort}` : "";
  const gen = generation || "Generation";
  const full = `${brandLabel}${modelBit} ${gen}`.replace(/\s+/g, " ").trim();
  return {
    heroButton: `Explore ${gen} Engine Replacement Options`,
    heroSupport: `Enter your registration to explore ${full} engine replacement options and specialist guidance.`,
    problemsButton: `Diagnose ${full} Engine Problems`,
    problemsSupport: "Experiencing similar symptoms? Explore possible faults and understand your repair or replacement options.",
    costsButton: `Get a ${full} Engine Quote`,
    costsSupport: `Compare used, reconditioned and rebuilt ${full} engine options with a quote tailored to your vehicle.`,
    trustButton: `Get a ${full} Engine Quote`,
    trustSupport: `Request a specialist quote based on your ${gen} engine, vehicle details and replacement requirements.`,
  };
}

export function variantCtaCopy(name = "Land Rover") {
  const label = String(name).replace(/\s+/g, " ").trim() || "Land Rover";
  return {
    heroButton: `Explore ${label} Engine Replacement Options`,
    heroSupport: `Enter your registration to explore ${label} engine options, replacement costs and specialist guidance.`,
    problemsButton: `Diagnose ${label} Engine Problems`,
    problemsSupport: "Experiencing similar symptoms? Explore possible faults and understand your repair or replacement options.",
    costsButton: `Get a ${label} Engine Quote`,
    costsSupport: `Compare used, reconditioned and rebuilt ${label} engine options with a quote tailored to your vehicle.`,
    trustButton: `Get a ${label} Engine Quote`,
    trustSupport: `Request a specialist quote based on your ${label} engine, vehicle details and replacement requirements.`,
  };
}

export function engineCtaCopy(name = "Land Rover Engine") {
  const label = String(name).replace(/\s+/g, " ").trim() || "Land Rover Engine";
  return {
    heroButton: `Explore ${label} Replacement Options`,
    heroSupport: `Enter your registration to explore ${label} options, replacement costs and specialist guidance.`,
    costsButton: `Get a ${label} Quote`,
    costsSupport: `Compare used, reconditioned and rebuilt options for the ${label} with a quote tailored to your vehicle.`,
    trustButton: `Get a ${label} Quote`,
    trustSupport: `Request a specialist quote based on your ${label}, vehicle details and replacement requirements.`,
  };
}

/** Homepage (neutral Land Rover + Range Rover wording). */
export const HOME_CTA = {
  heroButton: "Explore Engine Replacement Options",
  heroSupport:
    "Enter your registration to explore Land Rover and Range Rover engine options, replacement costs and specialist guidance.",
  diagnoseButton: "Get Specialist Advice",
  diagnoseSupport: "Understand the likely engine fault, repair-versus-replacement costs and possible next steps.",
  economicsButton: "Get an Engine Replacement Quote",
  economicsSupport: "Compare replacement costs against your vehicle's value before making a repair or replacement decision.",
  failuresButton: "Diagnose Engine Problems",
  failuresSupport: "Explore possible causes of common Land Rover and Range Rover faults and understand your next steps.",
  marketButton: "Request a Specialist Engine Quote",
  marketSupport: "Use our replacement-cost data as a starting point and request a quote for your specific vehicle and engine.",
};
