import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose, splitHeading } from "@/components/models/modelKit";
import { localHtml } from "@/components/models/generationsFaqLinks";
import { genCar, genCode } from "./genKit";

// Generation page section 3 - the overview, built to the approved Defender L316 reference: on the
// left the Highland hillside full-bleed (the loch at its edge, the green-and-gold stripe in the
// top-left corner, the generation code as a large watermark) with the generation's own car on the
// rocky ground, fading into the page; on the right the eyebrow, the "… — / Overview" headline, a
// split green-and-gold rule and the intro in two paragraphs. Across the photo's foot a four-column
// key-facts card (platform, predecessor, successor, sibling body styles), then the dark market band:
// the enquiry figure in gold, the market line and a rising bar motif.
// Phones / tablets: the copy, the hillside with the car full-bleed, the facts (stacked, then 2 x 2)
// and the band stacked.

const BG = "bg-[url(/home/hero-loch-day-m.webp)] sm:bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:dark:bg-[url(/home/hero-loch-night.webp)]";

const LINKS = "[&_a]:font-semibold [&_a]:text-lr-ink [&_a]:no-underline hover:[&_a]:underline dark:[&_a]:text-lr-green";

// "Platform: … • Predecessor: … • Successor: … • Sibling body styles in this generation: …"
function parseFacts(keyFacts) {
  if (Array.isArray(keyFacts)) return keyFacts;
  return String(keyFacts || "")
    .split(/\s+•\s+/)
    .map((chunk) => chunk.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((chunk) => {
      const i = chunk.indexOf(":");
      if (i === -1) return { label: chunk, value: "" };
      return { label: chunk.slice(0, i).replace(/\s+in this generation$/i, "").trim(), value: chunk.slice(i + 1).trim() };
    });
}

// the intro in two paragraphs, split at the sentence nearest its middle
function paragraphs(html = "") {
  const sentences = String(html).trim().split(/(?<=[.!?]["”]?)\s+(?=[A-Z<])/);
  if (sentences.length < 2) return [html];
  const total = sentences.join(" ").length;
  let best = 1;
  let bestGap = Infinity;
  let run = 0;
  sentences.forEach((s, i) => {
    run += s.length + 1;
    const gap = Math.abs(run - total / 2);
    if (i < sentences.length - 1 && gap < bestGap) {
      bestGap = gap;
      best = i + 1;
    }
  });
  return [sentences.slice(0, best).join(" "), sentences.slice(best).join(" ")];
}

const TAG = /\[(EM[-‑]VERIFIED|PATTERN DATA|EM[-‑]QUOTE)\]/i;

// the band's headline figure: the market line's own ("generated 292 real UK engine enquiries in
// 2025 [EM-VERIFIED]"), else the hero's first stat ("292+ D1 Enquiries (2025)*"), else none
function bandFigure(line = "", hero = null) {
  const text = String(line).replace(/<[^>]+>/g, "");
  const m = text.match(/(\d[\d,]*\+?)\s+(real UK engine enquiries in (\d{4}))\s*(\[[^\]]+\])?/i);
  if (m) return { value: m[1], caption: `Real UK engine enquiries in ${m[3]}`, tag: m[4] || text.match(TAG)?.[0] || "" };
  const stat = String(hero?.trustStrip?.[0]?.label || "");
  const h = stat.match(/^(\d[\d,]*\+?)\s+(.*?)\s*\((\d{4})\)/);
  if (h) return { value: h[1], caption: `UK engine enquiries in ${h[3]}`, tag: stat.match(TAG)?.[0] || text.match(TAG)?.[0] || "" };
  const caption = prose(stat.replace(/\s*\[[^\]]+\]/g, "").replace(/\*$/, "").trim()) || "UK engine enquiries";
  const tag = stat.match(TAG)?.[0] || text.match(TAG)?.[0] || "";
  // "Discovery 2 Enquiries (Pattern Data)" already says it: no "[PATTERN DATA]" after it
  return { value: "", caption, tag: tag && caption.toLowerCase().includes(tag.slice(1, -1).toLowerCase()) ? "" : tag };
}

// data tags in the dark band: sage green, never breaking
const bandHtml = (html) =>
  localHtml(prose(html)).replace(/\[(PATTERN DATA|EM[-‑]\w+)\](?![^<]*<\/span>)/g, '<span class="whitespace-nowrap font-medium">[$1]</span>');

// ------------------------------------------------------------------ pieces

function ArrowRing() {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-ink/55 text-lr-ink xl:h-[54px] xl:w-[54px] dark:border-lr-gold-line/60 dark:text-lr-gold">
      <svg viewBox="0 0 24 24" className="h-6 w-6 xl:h-7 xl:w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </span>
  );
}

function FactIcon({ index }) {
  if (index === 1 || index === 2) return <ArrowRing />;
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center text-lr-ink xl:h-[54px] xl:w-[54px] dark:text-lr-gold">
      <LrIcon name={index === 0 ? "chassis" : "vehicle"} tone="current" className="h-10 w-10 xl:h-12 xl:w-12" />
    </span>
  );
}

function Fact({ fact, index }) {
  return (
    <li
      className={`relative flex min-w-0 items-start gap-4 px-5 py-4 sm:px-6 sm:py-5 lg:items-center lg:px-6 lg:py-6 xl:gap-5 xl:px-8 ${
        index > 0 ? "border-t border-lr-line sm:border-t-0" : ""
      } ${index >= 2 ? "sm:border-t sm:border-lr-line lg:border-t-0" : ""} ${index % 2 === 1 ? "sm:border-l sm:border-lr-line lg:border-l-0" : ""} ${
        index > 0 ? "lg:before:absolute lg:before:inset-y-6 lg:before:left-0 lg:before:w-px lg:before:bg-lr-line" : ""
      }`}
    >
      <FactIcon index={index} />
      <div className="min-w-0">
        <p className="text-[16px] font-semibold leading-snug text-lr-head xl:text-[17px]" dangerouslySetInnerHTML={{ __html: prose(fact.label) }} />
        {fact.value && <p className={`mt-1 text-[14px] leading-[1.55] text-lr-body xl:text-[16px] ${LINKS}`} dangerouslySetInnerHTML={{ __html: localHtml(prose(fact.value)) }} />}
      </div>
    </li>
  );
}

// the rising bar motif at the band's right (decorative)
const BARS = [6, 14, 31, 48, 73, 100];
function Bars({ className = "" }) {
  return (
    <span className={`items-end ${className}`} aria-hidden="true">
      {BARS.map((h, i) => (
        <span key={i} className="w-[26px] rounded-[2px] bg-[#6c795a] dark:bg-lr-green/45" style={{ height: `${h}%` }} />
      ))}
    </span>
  );
}

// the green-and-gold stripe in the photo's top-left corner (decorative); its size follows the
// screen width, so it keeps the reference's proportions
function Stripe({ className = "" }) {
  return (
    <svg viewBox="0 0 220 380" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ov-stripe-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="0.92" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="ov-stripe-mask">
          <rect width="220" height="380" fill="url(#ov-stripe-fade)" />
        </mask>
      </defs>
      <g mask="url(#ov-stripe-mask)">
        <polygon points="89,0 141,0 -72,380 -124,380" fill="#a4ae92" fillOpacity="0.82" />
        <polygon points="141,0 147,0 -66,380 -72,380" fill="#e2cfa8" />
        <polygon points="147,0 214,0 1,380 -66,380" className="fill-[#4d5a43] dark:fill-[#2c4536]" fillOpacity="0.9" />
      </g>
    </svg>
  );
}

// ------------------------------------------------------------------ section

export default function Overview({ data, hero = null, model = "" }) {
  if (!data) return null;

  const { lead, accent } = splitHeading(prose(data.h2 || ""));
  const intro = paragraphs(localHtml(prose(data.intro || "")));
  const facts = parseFacts(data.keyFacts).slice(0, 4);
  const code = genCode(`${hero?.h1 || ""} ${hero?.tagPill || ""} ${data.h2 || ""}`);
  const car = genCar(hero || { h1: data.h2 }, model);
  const line = data.marketIntelligenceLine || "";
  const figure = bandFigure(line, hero);

  return (
    <section className={`relative overflow-hidden bg-lr-page pb-6 text-lr-head md:pb-7 xl:pb-8 ${SANS}`}>
      <div className={`${CONTAINER} pt-6 md:pt-6 lg:pt-6 xl:pt-7`}>
        <div className="relative lg:grid lg:min-h-[30vw] lg:grid-cols-[minmax(0,0.486fr)_minmax(0,0.514fr)]">
          {/* laptops: the hillside from the screen's left edge, fading into the page under the copy */}
          <div className="pointer-events-none absolute -top-12 bottom-[-190px] left-[calc(50%-50vw)] right-[calc(51.4%-48px)] hidden lg:block xl:-top-14" aria-hidden="true">
            <div className="absolute inset-0 [mask-image:linear-gradient(90deg,#000_74%,transparent)]">
              <div className={`absolute inset-0 bg-cover bg-[28%_62%] ${BG} [mask-image:linear-gradient(180deg,#000_62%,transparent_96%)]`} />
            </div>
            <Stripe className="absolute left-0 top-0 h-auto w-[14.3vw]" />
          </div>

          {/* laptops: the watermark and the car in the left column */}
          <div className="pointer-events-none relative hidden lg:block" aria-hidden="true">
            {code && (
              <span className="absolute left-[19.6%] top-[-4px] select-none text-[clamp(110px,10vw,176px)] font-bold italic leading-none tracking-[-0.03em] text-[#3f4440]/35 dark:text-white/[0.09]">
                {code}
              </span>
            )}
            {car && (
              <div className="absolute bottom-[22px] left-[4%] w-[70%] max-w-[560px]">
                <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 34vw, 1px" />
              </div>
            )}
          </div>

          <div className="relative min-w-0">
            <p className="text-[14px] font-semibold uppercase leading-none tracking-[0.08em] text-lr-ink md:text-[15px] xl:text-[17px] dark:text-lr-green">Overview</p>
            <h2 className={`${H2_MODEL} mt-4 text-balance text-lr-head md:mt-5`}>
              {lead}
              {accent && (
                <>
                  {" "}—<br />
                  <span className="text-lr-ink dark:text-lr-green">{accent}</span>
                </>
              )}
            </h2>
            <span className="mt-5 flex gap-1.5 md:mt-6" aria-hidden="true">
              <span className="h-[3px] w-[50px] rounded-full bg-lr-ink dark:bg-lr-green" />
              <span className="h-[3px] w-[50px] rounded-full bg-lr-gold-line" />
            </span>
            <div className={`mt-5 space-y-4 text-[15px] leading-[1.75] text-lr-body md:mt-7 md:text-[16px] xl:text-[17px] xl:leading-[1.82] ${LINKS}`}>
              {intro.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </div>
        </div>

        {/* phones / tablets: the hillside with the car, full-bleed */}
        {car && (
          <div className="relative -mx-5 mt-7 aspect-[4/3] sm:-mx-6 sm:aspect-[16/9] md:-mx-10 md:aspect-[2/1] lg:hidden" aria-hidden="true">
            <div className={`absolute inset-0 bg-cover bg-[28%_64%] ${BG} [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_78%,transparent)]`} />
            <Stripe className="absolute left-0 top-0 h-auto w-[24vw] max-w-[180px]" />
            {code && (
              <span className="absolute left-[24%] top-[7%] select-none text-[clamp(64px,19vw,150px)] font-bold italic leading-none tracking-[-0.03em] text-[#3f4440]/35 dark:text-white/[0.09]">
                {code}
              </span>
            )}
            <div className="absolute bottom-[15%] left-1/2 w-[76%] max-w-[560px] -translate-x-1/2">
              <GroundedCar src={car} sceneByTheme sizes="(max-width: 640px) 76vw, 560px" />
            </div>
          </div>
        )}

        {facts.length > 0 && (
          <ul
            className={`relative grid overflow-hidden rounded-xl border border-lr-line bg-lr-card/95 shadow-[0_24px_60px_-38px_var(--lr-shadow)] backdrop-blur-md sm:grid-cols-2 lg:mt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.27fr)] lg:rounded-2xl dark:bg-lr-card/85 ${
              car ? "-mt-10 sm:-mt-14" : "mt-8"
            }`}
          >
            {facts.map((fact, i) => (
              <Fact key={`${fact.label}-${i}`} fact={fact} index={i} />
            ))}
          </ul>
        )}

        {line && (
          <div className="mt-5 grid overflow-hidden rounded-xl bg-[#1b2b1c] text-white md:mt-6 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.42fr)_minmax(0,0.28fr)] lg:rounded-2xl dark:border dark:border-lr-line dark:bg-lr-card">
            <div className="flex items-center gap-4 px-5 py-5 sm:px-6 lg:py-7 xl:gap-8 xl:px-8">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#e1af65]/70 text-[#e1af65] md:h-20 md:w-20 xl:h-[104px] xl:w-[104px]">
                <LrIcon name="scope-decision" tone="current" className="h-8 w-8 md:h-10 md:w-10 xl:h-12 xl:w-12" />
              </span>
              <p className="min-w-0">
                {figure.value ? (
                  <span className="block text-[34px] font-bold leading-none tracking-[-0.01em] text-[#d0ab6b] md:text-[38px] xl:text-[46px]">{figure.value}</span>
                ) : (
                  <span className="block text-[20px] font-semibold leading-tight text-[#d0ab6b] xl:text-[24px]">Market Intelligence</span>
                )}
                <span className="mt-2 block text-[15px] leading-snug text-white/90 md:text-[16px] xl:text-[18px]">
                  {figure.caption}
                  {figure.tag && <span className="whitespace-nowrap text-[#8fb07c]"> {figure.tag}</span>}
                </span>
              </p>
              {/* tablets: the bar motif beside the figure (laptops: its own column) */}
              <Bars className="ml-auto hidden h-[72px] shrink-0 gap-[14px] md:flex lg:hidden [&>span]:w-[20px]!" />
            </div>
            <div className="relative flex items-start gap-3.5 border-t border-white/10 px-5 py-5 sm:px-6 lg:items-center lg:border-t-0 lg:py-7 lg:before:absolute lg:before:inset-y-7 lg:before:left-0 lg:before:w-px lg:before:bg-white/15 xl:gap-5 xl:px-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#93a171] text-[#93a171] lg:mt-0 xl:h-10 xl:w-10">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6.5 12.5 3.6 3.6 7.4-8.2" />
                </svg>
              </span>
              <p
                className="min-w-0 text-[15px] leading-[1.6] text-white/90 md:text-[16px] xl:text-[17px] [&_a]:font-semibold [&_a]:text-[#8fb07c] [&_a]:no-underline hover:[&_a]:underline [&_.text-lr-green]:text-[#8fb07c] [&_span.font-medium]:text-[#8fb07c]"
                dangerouslySetInnerHTML={{ __html: bandHtml(line) }}
              />
            </div>
            <div className="hidden items-end justify-center px-8 pb-[22px] pt-7 lg:flex">
              <Bars className="flex h-[100px] gap-[21px]" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
