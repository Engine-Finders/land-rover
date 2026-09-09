/** Alternating home section bands: current page bg, then softer shade. */

export function sectionBgClass(band = "page") {
  return band === "soft" ? "bg-[var(--color-page-soft)]" : "bg-[var(--color-page)]";
}

/** RGB channels matching --color-page / --color-page-soft for overlays & smoke. */
export function sectionRgb(band = "page", isDark = false) {
  if (isDark) {
    return band === "soft" ? "20,39,34" : "13,28,24";
  }
  return band === "soft" ? "239,238,232" : "248,247,242";
}
