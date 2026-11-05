import { Fragment } from "react";
import Image from "next/image";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, H2, ICON_LG, ICON_MD, ICON_XS, SMALL, STAT_LG } from "@/lib/typeScale";

// Engine section: At a Glance - four spec tiles (family, fuel, power, score), four wide cards
// (configuration with the engine photo, years, models fitted, cross-brand fitment) and a
// four-point trust bar. Values come from the page's `atAGlance.rows` JSON; a row's optional
// `note` overrides the supporting line built from the data. Follows the site theme (day / night).


/* ---------- icons: brand icon set in gold-rimmed rings ---------- */
function IconRing({ name, size = "md" }) {
  const box = {
    sm: "h-11 w-11 lg:h-[52px] lg:w-[52px]",
    tile: "h-12 w-12 lg:h-14 lg:w-14 xl:h-[52px] xl:w-[52px]",
    md: "h-14 w-14 lg:h-[58px] lg:w-[58px]",
  }[size];
  const glyph = size === "md" ? ICON_LG : ICON_MD;
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-gold-line/70 bg-lr-chip dark:bg-[radial-gradient(circle_at_50%_38%,#17402d_0%,#0b2219_72%)] dark:shadow-[0_0_24px_-10px_rgba(201,163,93,0.55)] ${box}`}
    >
      <LrIcon name={name} className={glyph} />
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
  { icon: "genuine-failure-data", title: "EM-Verified Data", text: "Verified using real UK enquiries and workshop data." },
  { icon: "market-insight", title: "Real-World Insights", text: "Based on UK owner and specialist patterns." },
  { icon: "users", title: "Trusted by Enthusiasts", text: "Part of Engine Finders — trusted Land Rover specialists." },
  { icon: "transparent-data", title: "Quality You Can Trust", text: "Every engine is checked, inspected and quality assured." },
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
          <SpecTile icon="petrol" label="Fuel">
            <p className={VALUE}>{fuel}</p>
            <Underline />
          </SpecTile>
          <SpecTile icon="meter" label="Power Range">
            <p className={VALUE}>{power}</p>
            {powerTag && (
              <span className="mt-2.5 inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-lr-gold-line/70 bg-lr-gold-line/[0.08] px-1.5 py-1 text-[10px] font-medium uppercase tracking-[0.03em] min-[375px]:gap-1.5 min-[375px]:px-2 min-[375px]:text-[10.5px] min-[375px]:tracking-[0.05em] text-lr-gold lg:mt-3 lg:gap-2 lg:px-3 lg:py-1.5 lg:text-[14px] xl:text-[15px]">
                <LrIcon name="genuine-failure-data" tone="current" className={ICON_XS} />
                {powerTag}
              </span>
            )}
          </SpecTile>
          <SpecTile icon="real-data" label="Engine Score">
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
            icon="rod-bearing"
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
            icon="generation-honest-rated"
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
              <LrIcon
                name="generation-honest-rated"
                className="pointer-events-none absolute -right-2 top-1/2 h-[130px] w-[130px] -translate-y-1/2 opacity-[0.07] sm:h-[150px] sm:w-[150px] lg:right-4 lg:h-[170px] lg:w-[170px]"
              />
            }
          />
          <WideCard
            icon="two-cars"
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
            icon="independent-and-impartial"
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
