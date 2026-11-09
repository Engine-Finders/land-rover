// Small text helpers shared by the redesigned variant sections.

// a problem / check pictogram (brand icon set name, see src/components/shared/lrIconNames.js) picked
// from its wording. Rules run in order, so the most specific part wins ("oil dilution from DPF
// regeneration" is an oil problem, "EGR cooler coolant leak" an EGR one).
const TOPIC_ICONS = [
  [/chain|belt|pulley|fead|vanos|vvt|valve timing|camshaft|valvetrain/, "timing-chain"],
  [/egr/, "egr"],
  [/dilution/, "oil-leaks"],
  [/dpf|regen|particulate/, "dpf-filter"],
  [/turbo|supercharg|boost|whistl/, "turbo"],
  [/injector/, "injector"],
  [/hpfp|high-pressure|injection pump|lift pump|fuel pump|fuel pressure|fuel system|vacuum/, "hpfp"],
  [/adblue/, "adblue"],
  [/gasket|cylinder head|head bolt|liner|top-hat|piston/, "ingenium"],
  [/crank|balancer/, "crankshaft"],
  [/bearing|knock|con-?rod/, "rod-bearing"],
  [/coolant|overheat|water pump|thermostat|cooling|radiator|temperature|heater|cabin heat/, "cooling-system-2"],
  [/oil|leak|dipstick/, "oil-leaks"],
  [/smoke|soot|carbon|exhaust|emission|gpf/, "exhaust-and-emission"],
  [/hybrid|48v|mhev|phev|ev mode|electric range|hv battery/, "ev"],
  [/battery|charging|alternator|stop-start|starter/, "starting-and-charging"],
  [/electr|sensor|ecu|wiring|loom|connector/, "chip"],
  [/warning|engine light|management light|check engine|mil\b|diagnos|fault|codes/, "check-watch"],
  [/warranty/, "genuine-failure-data"],
  [/mot\b|advisor/, "symptoms"],
  [/service|history|record|stamp|invoice|documented|recall|parts/, "oem-references"],
  [/clutch|flywheel|vibration/, "flywheel"],
  [/gearbox|transmission|drivetrain|brake/, "drivetrain-failures"],
  [/pump/, "hpfp"],
  [/fuel|petrol|diesel|carb|efi|economy/, "petrol"],
  [/test drive|drivab/, "steering-wheel"],
  [/compression|performance|power|mileage|miles/, "meter"],
  [/chassis|body|rust|corrosion/, "chassis"],
];

export function topicIcon(text = "", fallback = "engine") {
  const t = text.toLowerCase();
  return TOPIC_ICONS.find(([re]) => re.test(t))?.[1] || fallback;
}

export const stripArrow = (label = "") => label.replace(/^\s*→\s*/, "").replace(/\s*→\s*$/, "");
export const stripBullet = (text = "") => text.replace(/^\s*[*•-]\s*/, "");

// "£1,200-£2,500 [EM-QUOTE]" -> { text: "£1,200-£2,500", tag: "EM-QUOTE" }
export function splitTag(value = "") {
  const m = String(value).match(/^(.*?)\s*\[([^\]]+)\]\s*(.*)$/);
  return m ? { text: [m[1], m[3]].filter(Boolean).join(" "), tag: m[2] } : { text: String(value), tag: "" };
}
