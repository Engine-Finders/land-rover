import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H1 } from "@/lib/typeScale";
import { Arrow, SANS, prose } from "@/components/models/modelKit";
import { localHref, localHtml } from "@/components/models/generationsFaqLinks";
import { genCar, genCode } from "./genKit";

// Generation page section 1 (hero), built to the approved Defender L316 references (day + night):
// the model pill (shield, model - mountain, body - calendar, years), the serif headline with
// "The Complete UK Guide" in green and a two-tone rule, the intro in sentence lines with its engine
// links and the enquiry figure in green, and the Explore button; behind it the loch-side Highland
// hillside (golden hour by day, a storm at night) washed into the page behind the copy, the
// generation code as a large watermark, the green-and-gold diagonal stripe at the right edge and the
// generation's own car standing on the hillside; along the foot a four-stat card.
// Phones / tablets: copy, then the car on the hillside full-bleed, then the stats (2 x 2).

const BG_DESKTOP = "bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night.webp)]";
const BG_MOBILE = "bg-[url(/home/hero-loch-day-m.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)]";
// page-coloured wash behind the copy, measured from the container's left edge at any width
const WASH = {
  background:
    "linear-gradient(90deg, var(--lr-page) 0px, color-mix(in srgb, var(--lr-page) 94%, transparent) calc(max(0px, 50vw - 800px) + 520px), color-mix(in srgb, var(--lr-page) 62%, transparent) calc(max(0px, 50vw - 800px) + 760px), transparent calc(max(0px, 50vw - 800px) + 1040px))",
};

// "Land Rover Defender L316 Engines - The Complete UK Guide" -> lead / accent
function splitH1(h1 = "") {
  const m = String(h1).match(/^([\s\S]*?)\s+[-–—]\s+([\s\S]+)$/);
  return m ? { lead: m[1], accent: m[2] } : { lead: h1, accent: "" };
}

// "Land Rover Defender L316 • Off-Roader • 1990–2016"
function splitPill(tagPill = "") {
  const [model = "", body = "", years = ""] = String(tagPill).split(/\s+•\s+/);
  return { model, body, years };
}

// "292+ L316 Enquiries (2025) [EM-VERIFIED]" -> { value, label, verified }
function splitStat(text = "") {
  const verified = /\[EM[‑-]VERIFIED\]/i.test(text);
  const clean = String(text).replace(/\s*\[[^\]]+\]\s*/g, " ").replace(/\*$/, "").trim();
  const m = clean.match(/^(#?[\d,.]+\+?)\s+(.+)$/);
  return m ? { value: m[1], label: m[2], verified } : { value: "", label: clean, verified };
}

// intro: each sentence on its own line, the closing "Backed by …" line as its own paragraph with its
// figure in green
function introParts(html = "") {
  const text = localHtml(prose(html));
  const cut = text.search(/\bBacked by\b/);
  const body = cut > 0 ? text.slice(0, cut).trim() : text;
  const backed = cut > 0 ? text.slice(cut).trim() : "";
  const lines = body.split(/(?<=[.!?])\s+(?=[A-Z])/);
  return {
    lines,
    backed: backed.replace(/(^|\s)(\d[\d,]*\+?)(?=\s)/, '$1<strong class="font-semibold text-lr-ink dark:text-lr-green">$2</strong>'),
  };
}

function CalendarIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17.5h2" />
    </svg>
  );
}

// separators only where the pill holds one line; on phones the items wrap without a dangling dot
function Dot() {
  return <span aria-hidden="true" className="hidden opacity-60 sm:inline">•</span>;
}

function Pill({ pill }) {
  const icon = "h-[18px] w-[18px] shrink-0 text-lr-on-brand/90 lg:h-5 lg:w-5 dark:text-lr-green";
  return (
    <p className="inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl sm:gap-x-2.5 bg-lr-brand px-3.5 py-2.5 text-[14px] font-medium leading-snug text-lr-on-brand sm:px-4 lg:text-[15.5px] dark:border dark:border-lr-line-strong dark:bg-lr-card/70 dark:text-lr-head dark:backdrop-blur-sm">
      <span className="inline-flex items-center gap-2">
        <LrIcon name="genuine-failure-data" tone="current" className={icon} />
        <span dangerouslySetInnerHTML={{ __html: pill.model }} />
      </span>
      {pill.body && (
        <>
          <Dot />
          <span className="inline-flex items-center gap-2">
            <LrIcon name={/off|4x4|road/i.test(pill.body) ? "hill" : "vehicle"} tone="current" className={icon} />
            <span dangerouslySetInnerHTML={{ __html: pill.body }} />
          </span>
        </>
      )}
      {pill.years && (
        <>
          <Dot />
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <CalendarIcon className={icon} />
            {pill.years}
          </span>
        </>
      )}
    </p>
  );
}

const STAT_ICON = (i, label) =>
  ["real-inquiries", /off|4x4|road/i.test(label) ? "hill" : "vehicle", "generation-honest-rated", "part-of-engine-finders"][i] || "real-inquiries";

function Stat({ item, index }) {
  const { value, label, verified } = splitStat(item.label || "");
  const partOf = label.match(/^Part of\s+(.+)$/i);
  return (
    <li
      className={`relative flex min-w-0 flex-col items-start gap-2.5 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5 lg:justify-center lg:px-4 lg:py-6 xl:gap-5
        ${index % 2 === 1 ? "border-l border-lr-line lg:border-l-0" : ""} ${index >= 2 ? "border-t border-lr-line lg:border-t-0" : ""}
        ${index > 0 ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[62%] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-lr-line" : ""}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lr-chip text-lr-ink sm:h-14 sm:w-14 xl:h-[72px] xl:w-[72px] dark:border dark:border-lr-gold-line/55 dark:bg-transparent dark:text-lr-gold">
        <LrIcon name={STAT_ICON(index, label)} tone="current" className="h-6 w-6 sm:h-7 sm:w-7 xl:h-9 xl:w-9" />
      </span>
      <p className="min-w-0 text-[14px] leading-snug text-lr-head sm:text-[15px] xl:text-[17px]">
        {partOf ? (
          <>
            <span className="block text-lr-body">Part of</span>
            <strong className="block font-semibold">{partOf[1]}</strong>
          </>
        ) : value ? (
          <>
            <span className="mb-1 block text-[24px] font-semibold leading-none sm:text-[26px] xl:text-[32px] dark:text-lr-green">{value}</span>
            <span className="block">{label}</span>
            {verified && <span className="block font-semibold text-lr-ink dark:font-medium dark:text-lr-green">[EM-VERIFIED]</span>}
          </>
        ) : (
          <strong className="block text-[15px] font-semibold sm:text-[16px] xl:text-[19px]">{label}</strong>
        )}
      </p>
    </li>
  );
}

// the green band and gold line down the right edge (decorative)
function Stripe({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gen-hero-stripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.72" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="gen-hero-stripe-fade">
          <rect width="100" height="100" fill="url(#gen-hero-stripe)" />
        </mask>
      </defs>
      <g mask="url(#gen-hero-stripe-fade)">
        <polygon points="66,0 100,0 100,8 44,100 10,100" className="fill-lr-brand dark:opacity-80" />
        <polygon points="100,10 100,14 46.5,100 44,100" className="fill-lr-gold-line" />
      </g>
    </svg>
  );
}

export default function ModelHero({ data, model = "" }) {
  if (!data) return null;

  const { lead, accent } = splitH1(data.h1);
  const pill = splitPill(data.tagPill);
  const code = genCode(`${data.h1} ${data.tagPill}`);
  const car = genCar(data, model);
  const intro = introParts(data.subHeadline || "");
  const ctaLabel = String(data.primaryCta?.label || "").replace(/\s*(?:→|->)\s*$/, "");
  const ctaHref = localHref(data.primaryCta?.href) || "#engine-database";
  const stats = (data.trustStrip || []).slice(0, 4);

  return (
    <section className={`relative overflow-hidden bg-lr-page text-lr-head ${SANS}`}>
      {/* desktop: the hillside behind the whole hero, washed into the page behind the copy */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className={`absolute inset-0 bg-cover bg-[center_58%] ${BG_DESKTOP} [mask-image:linear-gradient(to_bottom,#000_82%,transparent)]`} />
        <div className="absolute inset-0" style={WASH} />
        <Stripe className="absolute right-0 top-0 h-[62%] w-[20%] max-w-[360px]" />
        <div className={`${CONTAINER} relative h-full`}>
          {code && (
            <span className="absolute right-[3%] top-[5%] select-none text-[clamp(150px,16vw,300px)] font-bold leading-none tracking-[-0.04em] text-lr-head/[0.13] dark:text-white/[0.08]">
              {code}
            </span>
          )}
          {car && (
            <div className="absolute bottom-[170px] right-[3%] w-[44%] max-w-[700px] xl:bottom-[184px] xl:w-[47%]">
              <GroundedCar src={car} priority sceneByTheme sizes="(min-width: 1024px) 46vw, 1px" />
            </div>
          )}
        </div>
      </div>

      <div className={`${CONTAINER} relative pb-6 pt-7 md:pb-6 md:pt-9 lg:pb-6 lg:pt-12 xl:pt-14`}>
        <div className="max-w-[640px] lg:max-w-[54%]">
          <Pill pill={pill} />

          <h1 className={`${H1} mt-5 text-balance text-lr-head md:mt-6 lg:mt-8 lg:[text-wrap:wrap]`}>
            {lead}
            {accent && (
              <>
                {" "}—{" "}
                <span className="text-lr-ink dark:text-lr-green">{accent}</span>
              </>
            )}
          </h1>
          <span className="mt-5 flex h-[3px] w-28 overflow-hidden rounded-full md:mt-6" aria-hidden="true">
            <span className="w-[62%] bg-lr-ink dark:bg-lr-green" />
            <span className="flex-1 bg-lr-gold-line" />
          </span>

          <div className="mt-5 max-w-[36em] text-[15px] leading-[1.65] text-lr-body md:mt-6 md:text-[16px] xl:text-[18px] [&_a]:font-semibold [&_a]:text-lr-ink [&_a]:no-underline hover:[&_a]:underline dark:[&_a]:text-lr-green">
            <p>
              {intro.lines.map((line, i) => (
                <span key={i} className={`${i ? "mt-1.5 " : ""}block`} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </p>
            {intro.backed && <p className="mt-3.5 text-lr-head" dangerouslySetInnerHTML={{ __html: intro.backed }} />}
          </div>

          {ctaLabel && (
            <a
              href={ctaHref}
              className="group mt-7 flex h-13 items-center justify-center gap-3 rounded-xl bg-lr-brand px-6 text-[16px] font-semibold text-lr-on-brand no-underline shadow-[0_14px_30px_-18px_rgba(18,61,42,0.8)] transition-colors hover:bg-lr-brand-hover sm:inline-flex sm:h-14 lg:mt-9 lg:h-[60px] lg:px-8 lg:text-[18px] dark:border dark:border-lr-gold-line/70 dark:bg-lr-page/70 dark:hover:bg-lr-card"
            >
              {ctaLabel}
              <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-0.5 dark:text-lr-gold" />
            </a>
          )}
        </div>

        {/* phones / tablets: the car on the hillside, full-bleed */}
        {car && (
          <div className="relative -mx-5 mt-7 aspect-[4/3] sm:-mx-6 sm:aspect-[16/9] md:-mx-10 lg:hidden" aria-hidden="true">
            <div className={`absolute inset-0 bg-cover bg-bottom ${BG_MOBILE} [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_84%,transparent)]`} />
            {code && (
              <span className="absolute right-4 top-[6%] select-none text-[clamp(72px,24vw,170px)] font-bold leading-none tracking-[-0.04em] text-lr-head/[0.1] sm:right-6 dark:text-white/[0.08]">
                {code}
              </span>
            )}
            <div className="absolute bottom-[14%] left-1/2 w-[80%] max-w-[560px] -translate-x-1/2">
              <GroundedCar src={car} priority sceneByTheme sizes="(max-width: 640px) 80vw, 560px" />
            </div>
          </div>
        )}

        {stats.length > 0 && (
          <ul className={`relative grid grid-cols-2 overflow-hidden rounded-2xl border border-lr-line bg-lr-card/92 shadow-[0_24px_60px_-34px_var(--lr-shadow)] backdrop-blur-md lg:mt-14 lg:grid-cols-4 xl:mt-16 dark:bg-lr-page/80 ${car ? "-mt-10 sm:-mt-14" : "mt-8"}`}>
            {stats.map((item, i) => (
              <Stat key={item.label || i} item={item} index={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
