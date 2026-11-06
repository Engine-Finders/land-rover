import LrIcon from "@/components/shared/LrIcon";
import { BODY, H2, LABEL } from "@/lib/typeScale";

// Shared building blocks for the redesigned model page sections (2-14), so every section speaks
// the same visual language: the eyebrow, the serif H2 with its green accent, data tags, star
// ratings, icon chips / tiles, the card and table-head styles, and the car photo for a generation.
// Colours are the lr-* theme tokens (white day theme, deep green night theme; globals.css).

export const SANS = "font-[family-name:var(--font-instrument-sans)]";
export const SERIF = "font-[family-name:var(--font-serif-display)]";

// vertical rhythm for a section band, and the alternating band colours (even sections white,
// odd sections the soft band) so a long page keeps its rhythm in both themes
export const SECTION_Y = "py-10 md:py-14 xl:py-16";

// The site-wide H2 (src/lib/typeScale.js): 48px from lg, 44px on 1280-1439px laptops
export const H2_MODEL = H2;
// One intro style under every section H2
export const INTRO = `${BODY} mt-3 max-w-[36em] text-lr-body md:mt-4`;
export const BAND_PAGE = "bg-lr-page";
export const BAND_SOFT = "bg-lr-band";

// a raised card on either band
export const CARD = "rounded-xl border border-lr-line bg-lr-card shadow-[0_18px_44px_-36px_var(--lr-shadow)] lg:rounded-2xl";
// dark green table head (both themes), as in the references
export const TABLE_HEAD = "bg-lr-brand text-lr-on-brand";

export const MODEL_NAMES = {
  defender: "Defender",
  "discovery-sport": "Discovery Sport",
  discovery: "Discovery",
  freelander: "Freelander",
  "range-rover-evoque": "Evoque",
  "range-rover-sport": "Range Rover Sport",
  "range-rover": "Range Rover",
  velar: "Velar",
};
export const modelName = (slug = "") => MODEL_NAMES[slug] || "";

// ------------------------------------------------------------------ text

const TAG_RE = /\[((?:EM-|PLACEHOLDER)[^\]]*)\]/g;
// short tags ("[EM-QUOTE]") never break; long ones ("[PLACEHOLDER — confirm vs Table A; …]") may
// wrap, so they can't push a phone layout sideways
const tag = (t) =>
  `<span class="${t.length > 18 ? "[overflow-wrap:anywhere]" : "whitespace-nowrap"} font-medium text-lr-green">[${t}]</span>`;

// Copy from the JSON, made typographic: " - " -> " — ", straight double quotes -> curly (text only;
// the data's attributes use single quotes), and the [EM-…] / [PLACEHOLDER…] data tags in green.
export function prose(html = "") {
  return String(html)
    .replace(/\s+-\s+/g, " — ")
    .replace(/"([^"<>]+)"/g, "“$1”")
    .replace(TAG_RE, (_, t) => tag(t));
}

// "Velar Engine Codes - The Complete Database" -> { lead: "Velar Engine Codes", accent: "The Complete Database" }
export function splitHeading(h2 = "") {
  const clean = String(h2).replace(/\s+[-–—]\s+/, " — ");
  const i = clean.indexOf(" — ");
  return i === -1 ? { lead: clean, accent: "" } : { lead: clean.slice(0, i), accent: clean.slice(i + 3) };
}

// Gold "/ LABEL /" eyebrow above every H2 (no "SECTION n" labels on the site)
// Every model section opens with the same small bordered pill (the label is the section's name -
// the site shows no "SECTION n" numbers)
export function Eyebrow({ children, className = "" }) {
  return <EyebrowPill className={className}>{children}</EyebrowPill>;
}

// Small bordered pill eyebrow with an icon (the section 4-5 references: "⚖ SECTION 4"); the
// label is the section's name - the site shows no "SECTION n" numbers
export function EyebrowPill({ icon, children, className = "" }) {
  return (
    <p className={`inline-flex items-center gap-1.5 rounded-md border border-lr-line bg-lr-band px-2.5 py-1 text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[13px] dark:border-lr-gold-line/40 dark:bg-lr-card dark:text-lr-gold ${className}`}>
      {icon && <LrIcon name={icon} tone="current" className="h-3.5 w-3.5 md:h-4 md:w-4" />}
      {children}
    </p>
  );
}

// The section H2: serif, the part after the dash on its own line in green. `accent` instead names
// a phrase inside the heading to set in green ("Velar?", "275 UK Owners"); `breakAfterDash` false
// keeps a dashed heading on one flowing line.
export function SectionTitle({ h2, accent, breakAfterDash = true, className = "", as: Tag = "h2" }) {
  const text = String(h2 || "").replace(/\s+[-–—]\s+/, " — ");
  let body;
  if (accent) {
    const i = text.indexOf(accent);
    body =
      i === -1 ? (
        text
      ) : (
        <>
          {text.slice(0, i)}
          <span className="text-lr-ink dark:text-lr-green">{accent}</span>
          {text.slice(i + accent.length)}
        </>
      );
  } else {
    const { lead, accent: tail } = splitHeading(text);
    body = tail ? (
      <>
        {lead}
        {" "}—{breakAfterDash ? <br /> : " "}
        <span className="text-lr-ink dark:text-lr-green">{tail}</span>
      </>
    ) : (
      lead
    );
  }
  return <Tag className={`${H2_MODEL} text-balance text-lr-head ${className}`}>{body}</Tag>;
}

// ------------------------------------------------------------------ ratings

// "★★★½ (3.5/5)", "⭐⭐⭐⭐☆", "★★★☆☆ - engine choice…" -> { full, half, empty, rest }
export function parseRating(raw = "") {
  const text = String(raw).trim();
  const m = text.match(/^([★⭐☆½\s]+)/u);
  if (!m || !/[★⭐]/u.test(m[1])) return { full: 0, half: 0, empty: 0, rest: text, stars: false };
  const run = m[1];
  const full = (run.match(/[★⭐]/gu) || []).length;
  const half = run.includes("½") ? 1 : 0;
  return { full, half, empty: Math.max(0, 5 - full - half), rest: text.slice(run.length).trim(), stars: true };
}

const STAR_PATH = "M12 2.6l2.85 5.94 6.53.84-4.79 4.5 1.22 6.47L12 17.2l-5.81 3.15 1.22-6.47-4.79-4.5 6.53-.84L12 2.6Z";

function StarShape({ filled, size }) {
  return (
    <svg viewBox="0 0 24 24" className={`${size} block`} aria-hidden="true">
      <path d={STAR_PATH} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ fill = "full", size }) {
  if (fill !== "half") return <span className="shrink-0"><StarShape filled={fill === "full"} size={size} /></span>;
  return (
    <span className={`relative shrink-0 ${size}`}>
      <StarShape filled={false} size={size} />
      <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
        <StarShape filled size={size} />
      </span>
    </span>
  );
}

// Five stars: filled, half (outline + filled left half) and outline, brand green.
export function Stars({ full = 0, half = 0, empty = 0, size = "h-[18px] w-[18px] md:h-5 md:w-5", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 align-[-4px] text-lr-ink dark:text-lr-green ${className}`} role="img" aria-label={`${full + half * 0.5} out of 5`}>
      {Array.from({ length: full }, (_, i) => <Star key={`f${i}`} size={size} />)}
      {half ? <Star fill="half" size={size} /> : null}
      {Array.from({ length: empty }, (_, i) => <Star key={`e${i}`} fill="empty" size={size} />)}
    </span>
  );
}

// ------------------------------------------------------------------ icons

export function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function Chevron({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Round brand chip: deep green with a sand icon by day, a gold ring at night (as in sections 1-2).
export function IconChip({ name, className = "h-10 w-10 xl:h-11 xl:w-11", iconClass = "h-[18px] w-[18px] xl:h-5 xl:w-5", children }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-lr-brand dark:border dark:border-lr-gold-line/55 dark:bg-transparent ${className}`}>
      {children || <LrIcon name={name} tone="skin" className={iconClass} />}
    </span>
  );
}

// Rounded-square tile (card headers in the references): same colours as the chip.
export function IconTile({ name, className = "h-12 w-12 md:h-14 md:w-14", iconClass = "h-6 w-6 md:h-7 md:w-7", children }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-xl bg-lr-brand dark:border dark:border-lr-gold-line/45 dark:bg-lr-card ${className}`}>
      {children || <LrIcon name={name} tone="skin" className={iconClass} />}
    </span>
  );
}

// Soft tile (light chip with a brand-green icon), for list rows on cards.
export function SoftTile({ name, className = "h-11 w-11 md:h-12 md:w-12", iconClass = "h-5 w-5 md:h-6 md:w-6" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-xl bg-lr-chip ${className}`}>
      <LrIcon name={name} tone="current" className={`${iconClass} text-lr-ink dark:text-lr-green`} />
    </span>
  );
}

// ------------------------------------------------------------------ cars

const CAR = (f) => `/variant/cars/${f}.webp`;
const CARS = {
  defenderClassic: CAR("land-rover-defender-defender-110-station-wagon-5-door-4x4-19-5cd1"),
  defender90: CAR("land-rover-defender-defender-90-county-3-door-4x4-19901998-n-547b"),
  defenderL663: CAR("land-rover-defender-l663-90-3-door-suv-2020-new-pangea-green-caf9"),
  disco1: CAR("land-rover-discovery-series-i-discovery-3-5-door-suv-1989199-519f"),
  disco2: CAR("land-rover-discovery-series-ii-discovery-5-door-suv-19982004-d782"),
  disco3: CAR("land-rover-discovery-l319-hse-5-door-suv-20042009-group-buck-6375"),
  disco4: CAR("land-rover-discovery-l319-hse-5-door-suv-20092016-new-causew-0ea8"),
  disco5: CAR("land-rover-discovery-l462-s-5-door-suv-20172020-new-indus-si-eaa4"),
  dsPre: CAR("land-rover-discovery-sport-l550-se-compact-suv-20152019-new-9504"),
  dsFace: CAR("land-rover-discovery-sport-l550-lci-se-compact-suv-20192021-3487"),
  freelander1: CAR("land-rover-freelander-l314-5-door-station-wagon-compact-suv-6ab4"),
  freelander2: CAR("land-rover-freelander-l359-hse-luxury-compact-suv-20102012-n-5069"),
  evoqueL538: CAR("range-rover-evoque-l538-se-5-door-suv-20152018-new-corris-gr-19e8"),
  evoqueL551: CAR("range-rover-evoque-l551-hse-5-door-suv-20192023-new-corris-g-385e"),
  rrsL320: CAR("range-rover-sport-l320-hse-suv-20052009-new-zambezi-silver-s-3a4c"),
  rrsL494: CAR("range-rover-sport-l494-se-suv-20132017-new-indus-silver-l494-c7c8"),
  rrsL461: CAR("range-rover-sport-l461-dynamic-hse-suv-2022-new-eiger-grey-l-78f7"),
  rrClassic: CAR("land-rover-range-rover-classic-2-door-2-door-suv-19701981-hi-e1f2"),
  rrP38: CAR("land-rover-range-rover-p38a-vogue-suv-19982002-new-epsom-gre-b23e"),
  rrL322: CAR("land-rover-range-rover-l322-hse-suv-20022009-new-zambezi-sil-bcf0"),
  rrL405: CAR("land-rover-range-rover-l405-vogue-suv-20122017-new-causeway-b791"),
  rrL460: CAR("land-rover-range-rover-l460-hse-suv-2022-new-eiger-grey-l460-263f"),
  velarPre: CAR("range-rover-velar-l560-hse-suv-20172019-new-silicon-silver-v-a6a5"),
  velarFace: CAR("range-rover-velar-l560-lci-s-suv-20212024-new-ostuni-white-v-c0f3"),
};

// the model's newest car, when a heading names no generation
const MODEL_CAR = {
  defender: CARS.defenderL663,
  "discovery-sport": CARS.dsFace,
  discovery: CARS.disco5,
  freelander: CARS.freelander2,
  "range-rover-evoque": CARS.evoqueL551,
  "range-rover-sport": CARS.rrsL461,
  "range-rover": CARS.rrL460,
  velar: CARS.velarPre,
};

const isFacelift = (t) => /facelift|lci|2019\.5|2021/i.test(t) && !/pre-?facelift/i.test(t);

// A front three-quarter cut-out (public/variant/cars, front-left view, measured in carMeta.json for
// GroundedCar) for a generation named in a heading or card title, e.g. "Discovery 4 (L319)",
// "Range Rover Sport L494 - 2013–2022", "Velar (L560) - 2021–present (facelift)".
export function generationCar(text = "", slug = "") {
  const t = String(text);
  if (/L560|Velar/i.test(t)) return isFacelift(t) ? CARS.velarFace : CARS.velarPre;
  if (/L316/i.test(t)) return CARS.defender90;
  if (/L663/i.test(t)) return CARS.defenderL663;
  if (/L550|Discovery Sport/i.test(t)) return isFacelift(t) ? CARS.dsFace : CARS.dsPre;
  if (/L538/i.test(t)) return CARS.evoqueL538;
  if (/L551/i.test(t)) return CARS.evoqueL551;
  if (/L320/i.test(t)) return CARS.rrsL320;
  if (/L494/i.test(t)) return CARS.rrsL494;
  if (/L461/i.test(t)) return CARS.rrsL461;
  if (/L322/i.test(t)) return CARS.rrL322;
  if (/L405/i.test(t)) return CARS.rrL405;
  if (/L460/i.test(t)) return CARS.rrL460;
  if (/P38/i.test(t)) return CARS.rrP38;
  if (/Discovery 5|L462/i.test(t)) return CARS.disco5;
  if (/Discovery 4/i.test(t)) return CARS.disco4;
  if (/Discovery 3|L319/i.test(t)) return CARS.disco3;
  if (/Discovery 2|\bD2\b/i.test(t)) return CARS.disco2;
  if (/Discovery 1|\bD1\b/i.test(t)) return CARS.disco1;
  if (/Freelander 2|L359/i.test(t)) return CARS.freelander2;
  if (/Freelander 1|L314/i.test(t)) return CARS.freelander1;
  if (/Classic/i.test(t)) return slug === "range-rover" || /Range Rover/i.test(t) ? CARS.rrClassic : CARS.defenderClassic;
  return MODEL_CAR[slug] || "";
}

// The model's own art (scripts/build-model-hero-art.py): the shared backdrop and one of the
// model's cars on transparency, as CSS custom properties for a style prop. `variant` picks another
// car of the same model ("silver", "light" or "dark") so a page never repeats one photo: the
// front car of the hero line-up (no variant) appears in sections 2 and 14, the others in 7, 11, 12.
export function modelArt(slug = "", variant = "") {
  if (!MODEL_CAR[slug]) return null;
  const base = `/model/hero/${slug}-car${variant ? `-${variant}` : ""}`;
  return {
    "--car-day": `url(${base}-day.webp)`,
    "--car-night": `url(${base}-night.webp)`,
    "--car-day-m": `url(${base}-day-m.webp)`,
    "--car-night-m": `url(${base}-night-m.webp)`,
  };
}
// background classes that read those properties (phones get the lighter -m files)
export const CAR_ART =
  "bg-contain bg-bottom bg-no-repeat bg-[image:var(--car-day-m)] sm:bg-[image:var(--car-day)] dark:bg-[image:var(--car-night-m)] sm:dark:bg-[image:var(--car-night)]";
export const CAR_ART_RATIO = "aspect-[1200/760]";
export const BACKDROP =
  "bg-cover bg-[center_bottom] bg-[url(/model/hero/bg-day-m.webp)] sm:bg-[url(/model/hero/bg-day.webp)] dark:bg-[url(/model/hero/bg-night-m.webp)] sm:dark:bg-[url(/model/hero/bg-night.webp)]";
