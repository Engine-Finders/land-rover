// Small text helpers shared by the redesigned variant sections.

// a problem/check icon (VariantIcons name) picked from its wording
export function topicIcon(text = "") {
  const t = text.toLowerCase();
  if (/chain/.test(t)) return "chain";
  if (/belt/.test(t)) return "belt";
  if (/turbo/.test(t)) return "turbo";
  if (/gasket|cylinder head|head bolt/.test(t)) return "gasket";
  if (/injector|fuel|high-pressure pump|hpfp/.test(t)) return "fuel";
  if (/bearing|crank/.test(t)) return "bearing";
  if (/coolant|overheat|water pump|thermostat|cooling/.test(t)) return "coolant";
  if (/oil/.test(t)) return "oil";
  if (/dpf|egr|smoke|soot|filter|regen/.test(t)) return "filter";
  if (/electr|sensor|ecu|wiring|battery/.test(t)) return "bolt";
  if (/warning light|engine light|mil\b/.test(t)) return "engine";
  if (/service|history|record|stamp|invoice/.test(t)) return "clipboard";
  if (/mot\b|advisor/.test(t)) return "docsearch";
  if (/mileage|miles/.test(t)) return "gauge";
  if (/noise|rattle|knock/.test(t)) return "ear";
  return "alert";
}

export const stripArrow = (label = "") => label.replace(/^\s*→\s*/, "").replace(/\s*→\s*$/, "");
export const stripBullet = (text = "") => text.replace(/^\s*[*•-]\s*/, "");

// "£1,200–£2,500 [EM-QUOTE]" -> { text: "£1,200–£2,500", tag: "EM-QUOTE" }
export function splitTag(value = "") {
  const m = String(value).match(/^(.*?)\s*\[([^\]]+)\]\s*(.*)$/);
  return m ? { text: [m[1], m[3]].filter(Boolean).join(" "), tag: m[2] } : { text: String(value), tag: "" };
}
