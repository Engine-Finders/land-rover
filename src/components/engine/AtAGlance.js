import { Fragment } from "react";
import Image from "next/image";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";
import { BODY, BODY_SM, H2, SMALL, STAT_LG } from "@/lib/typeScale";

// Engine section: At a Glance - four spec tiles (family, fuel, power, score), four wide cards
// (configuration with the engine photo, years, models fitted, cross-brand fitment) and a
// four-point trust bar. Values come from the page's `atAGlance.rows` JSON; a row's optional
// `note` overrides the supporting line built from the data. Follows the site theme (day / night).


/* ---------- gold line icons ---------- */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const GLYPHS = {
  engine: (
    <>
      <path {...line} d="M7 8.5h7.5l1.5 2h2v-1.5h2.5v7H18V15h-1.8l-2 2.5H8.5L6.8 16H5v-2.2H3.5v-3.3H5V8.5z" />
      <path {...line} d="M9 8.5V6.5h4v2M10 4.8h2" />
      <path {...line} d="m8.9 12.6 1.8 1.8 3.4-3.4" />
    </>
  ),
  drop: (
    <>
      <path {...line} d="M12 3.2c3 3.7 6.2 7.4 6.2 10.8a6.2 6.2 0 0 1-12.4 0c0-3.4 3.2-7.1 6.2-10.8z" />
      <path {...line} d="M9.1 14.6a3 3 0 0 0 3 2.9" />
    </>
  ),
  gauge: (
    <>
      <path {...line} d="M4.4 17.6a8.6 8.6 0 1 1 15.2 0" />
      <path {...line} d="M12 5.6v1.7M6.4 9l1.2 1.2M17.6 9l-1.2 1.2M4.9 13.7h1.7M17.4 13.7h1.7M12 14.2l3.5-3.7" />
      <circle cx="12" cy="14.2" r="1.4" fill="currentColor" />
    </>
  ),
  shieldCheck: (
    <>
      <path {...line} d="M12 3 19 5.8v5.8c0 4.4-3 7.5-7 9.2-4-1.7-7-4.8-7-9.2V5.8z" />
      <path {...line} d="m8.8 12.1 2.2 2.2 4.3-4.5" />
    </>
  ),
  piston: (
    <g transform="rotate(38 12 12)">
      <rect {...line} x="7.8" y="2.6" width="8.4" height="7.2" rx="1.2" />
      <path {...line} d="M7.8 5.2h8.4M7.8 7.3h8.4M10.6 9.8l.4 5.9M13.4 9.8l-.4 5.9" />
      <circle {...line} cx="12" cy="18" r="2.4" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" />
    </g>
  ),
  calendar: (
    <>
      <rect {...line} x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path {...line} d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
      {[8, 12, 16].map((x) => [13.3, 16.8].map((y) => <rect key={`${x}-${y}`} x={x - 1} y={y - 1} width="2" height="2" rx="0.4" fill="currentColor" />))}
    </>
  ),
  car: (
    <>
      <path {...line} d="M4 16.2v-4.1l1.9-4.9a1.6 1.6 0 0 1 1.5-1h9.2a1.6 1.6 0 0 1 1.5 1l1.9 4.9v4.1z" />
      <path {...line} d="M4.2 12.1h15.6M5.5 16.2v2.3h2.3v-2.3M16.2 16.2v2.3h2.3v-2.3" />
      <circle cx="7.6" cy="14.2" r="1.1" fill="currentColor" />
      <circle cx="16.4" cy="14.2" r="1.1" fill="currentColor" />
    </>
  ),
  chartUp: (
    <>
      <rect x="4" y="15" width="3" height="5" rx="0.5" fill="currentColor" />
      <rect x="8.7" y="12.5" width="3" height="7.5" rx="0.5" fill="currentColor" />
      <rect x="13.4" y="13.5" width="3" height="6.5" rx="0.5" fill="currentColor" />
      <rect x="18.1" y="10" width="3" height="10" rx="0.5" fill="currentColor" />
      <path {...line} strokeWidth="1.7" d="m3.6 11.4 5-4.4 3.4 2.8 6.8-5.6M15.6 4.2h3.5v3.4" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="7" r="3.2" fill="currentColor" />
      <circle cx="5.5" cy="8.5" r="2.4" fill="currentColor" />
      <circle cx="18.5" cy="8.5" r="2.4" fill="currentColor" />
      <path fill="currentColor" d="M6 19.5c0-3.6 2.7-6 6-6s6 2.4 6 6zM1.5 18.5c0-2.6 1.7-4.4 4-4.4.8 0 1.5.2 2.1.6-1.2 1.1-2 2.5-2.2 3.8zM22.5 18.5c0-2.6-1.7-4.4-4-4.4-.8 0-1.5.2-2.1.6 1.2 1.1 2 2.5 2.2 3.8z" />
    </>
  ),
  award: (
    <>
      <path {...line} d="M12 2.8l1.6 1.2 2-.2.8 1.8 1.8.8-.2 2 1.2 1.6-1.2 1.6.2 2-1.8.8-.8 1.8-2-.2L12 17l-1.6-1.2-2 .2-.8-1.8-1.8-.8.2-2L4.8 9.8 6 8.2l-.2-2 1.8-.8.8-1.8 2 .2z" />
      <circle {...line} cx="12" cy="9.9" r="3.3" />
      <path {...line} d="m8.4 16.4-1.5 4.8 2.6-1 1.7 2 .8-4.1M15.6 16.4l1.5 4.8-2.6-1-1.7 2-.8-4.1" />
    </>
  ),
};

const Svg = ({ name, className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    {GLYPHS[name]}
  </svg>
);

function IconRing({ name, size = "md" }) {
  const box = {
    sm: "h-11 w-11 lg:h-[60px] lg:w-[60px]",
    tile: "h-12 w-12 lg:h-14 lg:w-14 xl:h-[60px] xl:w-[60px]",
    md: "h-12 w-12 lg:h-[72px] lg:w-[72px]",
  }[size];
  const glyph = { sm: "h-[22px] w-[22px] lg:h-8 lg:w-8", tile: "h-6 w-6 lg:h-7 lg:w-7", md: "h-6 w-6 lg:h-9 lg:w-9" }[size];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-gold-line/70 bg-lr-chip text-lr-gold dark:bg-[radial-gradient(circle_at_50%_38%,#17402d_0%,#0b2219_72%)] dark:shadow-[0_0_24px_-10px_rgba(201,163,93,0.55)] ${box}`}
    >
      <Svg name={name} className={glyph} />
    </span>
  );
}

function Star({ on }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-[22px] lg:w-[22px]" aria-hidden="true">
      <path fill={on ? "var(--lr-gold-line)" : "var(--lr-line-strong)"} d="m12 2.6 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z" />
    </svg>
  );
}

/* ---------- data helpers ---------- */
const row = (rows, prefix) => rows.find((r) => r.metric?.startsWith(prefix)) || {};
const stripTag = (v = "") => v.replace(/\s*\[[A-Z][A-Z-]*\]\s*/g, " ").trim();
const tagOf = (v = "") => (v.match(/\[([A-Z][A-Z-]*)\]/) || [])[1] || "";
const sentence = (t = "") => (/[.!?]$/.test(t) ? t : `${t}.`);
const listSentence = (items) =>
  items.length < 2 ? items.join("") : items.length === 2 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;

// "2.5L I4 Turbo" + "Diesel" + "107–122 hp" -> "Inline four-cylinder turbo-diesel producing 107–122 hp."
function configNote(config = "", fuel = "", power = "") {
  const layout = { I4: "Inline four-cylinder", I5: "Inline five-cylinder", I6: "Straight-six", V6: "V6", V8: "V8" }[(config.match(/\b([IV]\d)\b/) || [])[1]];
  if (!layout) return "";
  const c = config.toLowerCase();
  const asp = /twin.?turbo/.test(c) ? "twin-turbo" : /supercharged/.test(c) && /\bna\b/.test(c) ? "naturally aspirated or supercharged" : /supercharged/.test(c) ? "supercharged" : /turbo/.test(c) ? "turbo" : "naturally aspirated";
  const f = fuel.toLowerCase();
  const mhev = /mhev/.test(c);
  const engine = asp === "turbo" && !mhev ? `turbo-${f}` : `${asp}${mhev ? " mild-hybrid" : ""} ${f}`;
  return `${layout} ${engine}${power ? ` producing ${power}` : ""}.`;
}

function yearsNote(years = "") {
  if (/present/i.test(years)) return "Still in production and fitted to current Land Rover models.";
  const m = years.match(/(\d{4})\s*[–-]\s*(\d{4})/);
  if (!m) return "";
  const prefix = /land rover fitment/i.test(years) ? "Land Rover fitment" : "In production";
  return `${prefix} for ${m[2] - m[1]} years, from ${m[1]} to ${m[2]}.`;
}

// "3 (Defender, Discovery 1, Range Rover Classic)" -> "3 models" + "Defender, Discovery 1, and Range Rover Classic."
function parseModels(value = "") {
  const m = value.match(/^(\d+)\s*\((.+)\)\s*$/);
  if (!m) return { value, note: "" };
  const n = Number(m[1]);
  return { value: `${n} model${n === 1 ? "" : "s"}`, note: sentence(listSentence(m[2].split(/,\s*/))) };
}

// "Also fitted to Jaguar (XF, XJ)" -> "Also fitted to Jaguar" + "Jaguar: XF, XJ."
function parseCrossBrand(value = "") {
  const m = value.match(/^(.*?\b(Jaguar|BMW))\s*\((.+)\)\s*$/);
  if (m) return { value: m[1], note: sentence(`${m[2]}: ${m[3]}`) };
  if (/in this ecosystem/i.test(value)) return { value: value.replace(/\s*in this ecosystem/i, ""), note: "No cross-brand fitment within the Engine Finders network." };
  return { value, note: /^exclusive/i.test(value) ? "Engineered specifically for Land Rover applications." : "" };
}

/* ---------- cards ---------- */
const CARD =
  "relative overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)] dark:bg-[linear-gradient(180deg,#17302a_0%,#12271f_100%)]";
const LABEL = `${SMALL} font-medium uppercase tracking-[0.06em] text-lr-muted`;

function GoldEdge() {
  return <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,178,110,0.55),transparent)]" aria-hidden="true" />;
}

function SpecTile({ icon, label, children }) {
  return (
    <article className={`${CARD} flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5 lg:p-6`}>
      <GoldEdge />
      <IconRing name={icon} size="tile" />
      <div className="min-w-0 sm:pt-1 lg:pt-2">
        <p className={LABEL}>{label}</p>
        {children}
      </div>
    </article>
  );
}

const VALUE = "mt-1.5 text-[17px] font-medium leading-[1.25] text-lr-head sm:text-[18px] lg:mt-2.5 lg:text-[19px] xl:text-[20px]";

function Underline() {
  return <span className="mt-3 block h-[2px] w-8 rounded-full bg-lr-gold-line lg:mt-4 lg:w-10" aria-hidden="true" />;
}

function WideCard({ icon, label, value, note, media, textClass = "", headClass = "", valueClass = "sm:text-[21px] lg:text-[22px] xl:text-[24px]" }) {
  return (
    <article className={`${CARD} p-5 sm:p-6 lg:min-h-[214px] lg:p-7`}>
      {media}
      <div className="relative flex items-start gap-4 lg:gap-6">
        <IconRing name={icon} />
        <div className={`min-w-0 pt-0.5 lg:pt-3 ${textClass}`}>
          <div className={headClass}>
            <p className={LABEL}>{label}</p>
            <p className={`mt-1.5 text-[19px] font-medium leading-[1.25] text-lr-head lg:mt-2.5 ${valueClass}`}>{value}</p>
          </div>
          {note && <p className={`mt-2.5 ${BODY_SM} text-lr-body lg:mt-3.5`}>{note}</p>}
        </div>
      </div>
    </article>
  );
}

const TRUST = [
  { icon: "shieldCheck", title: "EM-Verified Data", text: "Verified using real UK enquiries and workshop data." },
  { icon: "chartUp", title: "Real-World Insights", text: "Based on UK owner and specialist patterns." },
  { icon: "users", title: "Trusted by Enthusiasts", text: "Part of Engine Finders — trusted Land Rover specialists." },
  { icon: "award", title: "Quality You Can Trust", text: "Every engine is checked, inspected and quality assured." },
];

export default function AtAGlance({ data, title = "", slug = "" }) {
  const rows = data?.rows || [];
  if (rows.length === 0) return null;

  const family = row(rows, "Engine Family").value || "";
  const fuel = row(rows, "Fuel").value || "";
  const powerRaw = row(rows, "Power Range").value || "";
  const power = stripTag(powerRaw);
  const powerTag = tagOf(powerRaw);
  const config = row(rows, "Configuration");
  const years = row(rows, "Years Produced");
  const models = row(rows, "Models Fitted");
  const modelsParsed = parseModels(models.value);
  const cross = row(rows, "Cross-Brand");
  const crossParsed = parseCrossBrand(cross.value);
  const score = (row(rows, "Overall Engine Score").value || "").match(/(\d+)\s*\/\s*(\d+)/);
  const stars = score ? Math.round((Number(score[1]) / Number(score[2])) * 5) : 0;

  const heading = `${title.replace(/<[^>]+>/g, "").split(" Engine - ")[0]} Engine Overview`;
  const engine = /tdi/.test(slug) ? "/variant/sec2_engine.webp" : "/engine-glance/engine.webp";

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head" style={SANS}>
      {/* soft diagonal light bands, top right */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[520px] w-full max-w-[900px] opacity-90 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]"
        style={{
          background:
            "linear-gradient(128deg, transparent 46%, rgba(120,140,110,0.07) 46.2%, transparent 52%), linear-gradient(128deg, transparent 58%, rgba(201,163,93,0.09) 58.1%, transparent 58.5%), linear-gradient(128deg, transparent 66%, rgba(120,140,110,0.06) 66.2%, transparent 74%), linear-gradient(128deg, transparent 80%, rgba(201,163,93,0.07) 80.1%, transparent 80.5%)",
        }}
        aria-hidden="true"
      />

      <div className={`relative ${CONTAINER} py-12 md:py-14 lg:py-16`}>
        <header className="mx-auto max-w-[1240px] text-center">
          <p className={`flex items-center justify-center gap-3 ${SMALL} font-medium uppercase tracking-[0.24em] text-lr-gold md:gap-4`}>
            <span className="h-px w-8 bg-lr-gold-line md:w-10" aria-hidden="true" />
            At a Glance
            <span className="h-px w-8 bg-lr-gold-line md:w-10" aria-hidden="true" />
          </p>
          <h2 className={`mt-3 ${H2} text-lr-head md:mt-4`}>
            {heading}
          </h2>
          <p className={`mx-auto mt-3 max-w-[640px] ${BODY} text-lr-body md:mt-4`}>
            All the essential specifications, performance data, and compatibility information at a glance.
          </p>
        </header>

        {/* spec tiles */}
        <div className="mt-7 grid grid-cols-2 gap-3 md:mt-10 lg:gap-4 xl:grid-cols-4">
          <SpecTile icon="engine" label="Engine Family">
            <p className={VALUE}>{family}</p>
            <Underline />
          </SpecTile>
          <SpecTile icon="drop" label="Fuel">
            <p className={VALUE}>{fuel}</p>
            <Underline />
          </SpecTile>
          <SpecTile icon="gauge" label="Power Range">
            <p className={VALUE}>{power}</p>
            {powerTag && (
              <span className="mt-2.5 inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-lr-gold-line/70 bg-lr-gold-line/[0.08] px-1.5 py-1 text-[10px] font-medium uppercase tracking-[0.03em] min-[375px]:gap-1.5 min-[375px]:px-2 min-[375px]:text-[10.5px] min-[375px]:tracking-[0.05em] text-lr-gold lg:mt-3 lg:gap-2 lg:px-3 lg:py-1.5 lg:text-[14px] xl:text-[15px]">
                <Svg name="shieldCheck" className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                {powerTag}
              </span>
            )}
          </SpecTile>
          <SpecTile icon="shieldCheck" label="Engine Score">
            {score && (
              <>
                <p className="mt-1 flex items-baseline gap-1 leading-none lg:mt-2 lg:gap-1.5">
                  <span className={`${STAT_LG} text-lr-gold dark:bg-[linear-gradient(180deg,#e6c78d_0%,#b38a45_100%)] dark:bg-clip-text dark:text-transparent`}>{score[1]}</span>
                  <span className="text-[17px] text-lr-head lg:text-[19px] xl:text-[20px]">/{score[2]}</span>
                </p>
                <span className="mt-2.5 flex gap-1 lg:mt-3 lg:gap-1.5" role="img" aria-label={`${stars} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} on={i < stars} />
                  ))}
                </span>
              </>
            )}
          </SpecTile>
        </div>

        {/* wide cards */}
        <div className="mt-3 grid gap-3 lg:mt-4 lg:grid-cols-[minmax(0,1.11fr)_minmax(0,1fr)] lg:gap-4">
          <WideCard
            icon="piston"
            label={config.metric || "Configuration / Displacement"}
            value={config.value}
            note={config.note || configNote(config.value, fuel, power)}
            headClass="min-h-[84px] pr-[38%] sm:min-h-0 sm:pr-0"
            textClass="sm:pr-[38%] lg:pr-[40%]"
            media={
              <div className="pointer-events-none absolute right-2 top-3 h-[96px] w-[36%] max-w-[170px] sm:right-3 sm:top-1/2 sm:h-[86%] sm:w-[38%] sm:max-w-none sm:-translate-y-1/2 lg:right-2 lg:w-[42%]" aria-hidden="true">
                <Image src={engine} alt="" fill sizes="(min-width: 1024px) 300px, 40vw" className="object-contain object-right" />
              </div>
            }
          />
          <WideCard
            icon="calendar"
            label="Years Produced"
            value={(years.value || "").split(" · ").map((part, i) => (
              <Fragment key={part}>
                {i > 0 && " · "}
                <span className="whitespace-nowrap">{part}</span>
              </Fragment>
            ))}
            note={years.note || yearsNote(years.value)}
            valueClass={(years.value || "").length > 24 ? "sm:text-[20px] lg:text-[20px] xl:text-[22px]" : undefined}
            textClass="lg:pr-[8%]"
            media={
              <Svg
                name="calendar"
                className="pointer-events-none absolute -right-2 top-1/2 h-[130px] w-[130px] -translate-y-1/2 text-lr-head/[0.05] sm:h-[150px] sm:w-[150px] lg:right-4 lg:h-[170px] lg:w-[170px]"
              />
            }
          />
          <WideCard
            icon="car"
            label={models.metric || "Models Fitted"}
            value={modelsParsed.value}
            note={modelsParsed.note}
            textClass="sm:pr-[30%] lg:pr-[36%]"
            media={
              <div className="pointer-events-none absolute bottom-2 right-0 aspect-[612/240] w-[46%] max-w-[320px] opacity-60 mix-blend-multiply grayscale invert sm:bottom-auto dark:mix-blend-screen dark:grayscale-0 dark:invert-0 sm:opacity-100 sm:top-1/2 sm:w-[40%] sm:-translate-y-1/2 lg:right-3 lg:w-[44%]" aria-hidden="true">
                <Image src="/engine-glance/cars.webp" alt="" fill sizes="320px" className="object-contain object-right" />
              </div>
            }
          />
          <WideCard
            icon="shieldCheck"
            label={cross.metric || "Cross-Brand Fitment"}
            value={crossParsed.value}
            note={crossParsed.note}
            textClass="sm:pr-[24%] lg:pr-[26%]"
            media={
              <div className="pointer-events-none absolute -right-3 top-1/2 aspect-[468/292] w-[44%] max-w-[260px] -translate-y-1/2 opacity-60 mix-blend-multiply grayscale invert sm:right-2 dark:mix-blend-screen dark:grayscale-0 dark:invert-0 sm:w-[34%] sm:opacity-100 lg:right-4 lg:w-[33%]" aria-hidden="true">
                <Image src="/engine-glance/land-rover-badge.webp" alt="" fill sizes="260px" className="object-contain object-right" />
              </div>
            }
          />
        </div>

        {/* trust bar */}
        <ul className={`${CARD} mt-3 grid divide-y divide-lr-line sm:grid-cols-2 sm:divide-y-0 lg:mt-4 lg:grid-cols-4 lg:px-2`}>
          {TRUST.map((t, i) => (
            <li
              key={t.title}
              className={`relative flex items-start gap-3.5 px-4 py-4 sm:px-5 sm:py-5 lg:gap-4 lg:px-5 lg:py-7 xl:px-6 ${i >= 2 ? "sm:border-t sm:border-lr-line lg:border-t-0" : ""} ${
                i % 2 === 1 ? "sm:border-l sm:border-lr-line lg:border-l-0" : ""
              } ${i > 0 ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[60%] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-lr-line" : ""}`}
            >
              <IconRing name={t.icon} size="sm" />
              <div className="min-w-0 pt-0.5 lg:pt-1.5">
                <p className={`${SMALL} font-medium uppercase tracking-[0.04em] text-lr-head`}>{t.title}</p>
                <p className={`mt-1.5 ${SMALL} leading-[1.55] text-lr-muted`}>{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
