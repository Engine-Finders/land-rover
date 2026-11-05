import Image from "next/image";
import Link from "next/link";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, H1, ICON_LG, SMALL } from "@/lib/typeScale";

// Engine hero: tag pill, serif headline (accent on "Replacement Cost"), sub-headline, quote CTA,
// the engine on its lit ring in the dusk mountain / garage scene, and a four-stat trust strip -
// all from the page's `hero` JSON. Follows the site theme: on the day theme the scene is a framed
// photo on white; on the night theme it fades into the green page (a CSS mask, so it blends with any
// background). Phones and tablets stack the copy, scene and strip; from lg the scene sits on the
// right. The 200Tdi/300Tdi page shows the "Tdi"-badged engine cover, every other engine the same
// render without the badge.

// night theme: feather the photo's edges into the page
const FADE_X = "dark:[mask-image:linear-gradient(to_right,transparent,#000_34%,#000_90%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_76%,transparent)] dark:[mask-composite:intersect]";
const FADE_Y = "dark:[mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_84%,transparent)]";

/* ---------- trust strip icons (brand icon set) ---------- */
const ICON_BY_EMOJI = { "📊": "real-inquiries", "🔧": "vehicle", "💯": "real-data", "🏆": "part-of-engine-finders" };
const ICON_ORDER = ["real-inquiries", "vehicle", "real-data", "part-of-engine-finders"];

function ArrowIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

// "Land Rover 200Tdi / 300Tdi Engine - Specs, Reliability & Replacement Cost"
// -> lead "... Engine — Specs, Reliability & " + accent "Replacement Cost"
function splitTitle(h1 = "") {
  const title = h1.replace(/ - /g, " — ");
  const accent = "Replacement Cost";
  const at = title.lastIndexOf(accent);
  return at === -1 ? { lead: title, accent: "" } : { lead: title.slice(0, at), accent: title.slice(at) };
}

// green source tag at the end of the sub-headline: "... in 2025 [EM-VERIFIED]."
const highlightTags = (html = "") =>
  html.replace(/ - /g, " — ").replace(/(\[[A-Z][A-Z-]*\]\.?)/g, `<span class="text-lr-green">$1</span>`);

// "1,500+ Enquiries" / "[Score]/100 Engine Score" / "3 Models Fitted" / "Part of Engine Finders"
function parseStat(label = "") {
  const m = label.match(/^(\[[^\]]+\]|[\d,.+]+)(\/\d+)?\s+(.+)$/);
  if (!m) {
    const i = label.indexOf(" of ");
    return i === -1 ? { lead: "", caption: label } : { lead: label.slice(0, i + 3), caption: label.slice(i + 4) };
  }
  return { value: m[1], outOf: m[2] || "", caption: m[3] };
}

function StatIcon({ name }) {
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-gold-line/70 bg-lr-chip sm:h-16 sm:w-16 lg:h-[60px] lg:w-[60px] xl:h-[72px] xl:w-[72px] dark:bg-[radial-gradient(circle_at_50%_38%,#17402d_0%,#0b2219_72%)]"
    >
      <LrIcon name={name} className={ICON_LG} />
    </span>
  );
}

function Stat({ item, index }) {
  const icon = ICON_BY_EMOJI[item.icon] || ICON_ORDER[index % ICON_ORDER.length];
  const stat = parseStat(item.label);
  const captionClass = `block ${SMALL} uppercase tracking-[0.03em] text-lr-muted`;

  return (
    <li
      className={`relative flex flex-col items-center gap-2.5 px-2 py-4 text-center sm:flex-row sm:gap-4 sm:px-4 sm:py-5 sm:text-left lg:justify-center lg:gap-3 lg:px-3 lg:py-6 xl:gap-5 ${
        index > 0
          ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[56%] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-lr-line"
          : ""
      }`}
    >
      <StatIcon name={icon} />
      <span className="min-w-0" style={SANS}>
        {stat.value ? (
          <>
            <span className="block whitespace-nowrap text-[18px] font-semibold leading-[1.1] text-lr-head min-[375px]:text-[20px] sm:text-[22px] lg:text-[21px] xl:text-[24px]">
              {stat.value}
              {stat.outOf && <span className="text-[0.72em]">{stat.outOf}</span>}
            </span>
            <span className={`mt-1 ${captionClass}`}>
              {stat.caption}
              {icon === "real-inquiries" && <span className="normal-case"> in 2025</span>}
            </span>
          </>
        ) : (
          <>
            {stat.lead && <span className={`block ${SMALL} uppercase tracking-[0.03em] text-lr-head`}>{stat.lead}</span>}
            <span className={`mt-1 ${captionClass}`}>{stat.caption}</span>
          </>
        )}
      </span>
    </li>
  );
}

export default function EngineHero({ data, slug = "" }) {
  if (!data) return null;

  const pill = (data.tagPill || "").split(" • ").filter(Boolean);
  const { lead, accent } = splitTitle(data.h1);
  const ctaLabel = (data.primaryCta?.label || "Compare Engine Prices").replace(/\s*→\s*$/, "");
  const scene = /tdi/.test(slug) ? "/engine-hero/scene-tdi.webp" : "/engine-hero/scene.webp";
  const alt = `${pill[1] ? pill[1].replace(/<[^>]+>/g, "") : "Land Rover"} engine`;

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head" style={SANS}>
      {/* desktop: the scene on the right - framed on the day theme, feathered into the page at night */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className={`relative h-full ${CONTAINER}`}>
          <div
            className={`absolute right-4 top-12 aspect-[882/656] w-[46%] overflow-hidden rounded-2xl border border-lr-line shadow-[0_30px_60px_-34px_var(--lr-shadow)] md:right-8 xl:top-14 xl:w-[47%] dark:right-0 dark:top-0 dark:w-[56%] dark:rounded-none dark:border-0 dark:shadow-none xl:dark:w-[54%] ${FADE_X}`}
          >
            <Image src={scene} alt="" fill priority sizes="56vw" className="object-cover" />
          </div>
        </div>
      </div>

      <div className={`relative ${CONTAINER} pb-6 pt-5 md:pb-10 md:pt-8 lg:pb-12 lg:pt-12 xl:pt-14`}>
        {pill.length > 0 && (
          <p className="inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-[22px] border border-lr-gold-line/60 bg-lr-panel/80 px-4 py-2 text-[13px] leading-[1.45] text-lr-body sm:gap-x-3 sm:px-5 md:text-[14px] xl:gap-x-4 xl:px-6 xl:py-2.5 xl:text-[15px] [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2">
            {pill.map((part, i) => (
              <span key={i} className="inline-flex items-center gap-x-2.5 sm:gap-x-3 xl:gap-x-4">
                {i > 0 && <span className="h-[5px] w-[5px] rounded-full bg-lr-gold-line" aria-hidden="true" />}
                <span dangerouslySetInnerHTML={{ __html: part }} />
              </span>
            ))}
          </p>
        )}

        <div className="lg:max-w-[50%] xl:max-w-[640px]">
          <h1 className={`mt-5 ${H1} text-lr-head md:mt-7 lg:max-w-[10.4em] [&_a]:text-inherit [&_a]:no-underline`}>
            <span dangerouslySetInnerHTML={{ __html: lead }} />
            {accent && <span className="text-lr-green">{accent}</span>}
          </h1>

          {data.subHeadline && (
            <p
              className={`mt-4 max-w-[600px] ${BODY} text-lr-body md:mt-5 [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2`}
              dangerouslySetInnerHTML={{ __html: highlightTags(data.subHeadline) }}
            />
          )}

          {data.primaryCta && (
            <Link
              href="/quote"
              className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-lr-gold-line/70 bg-lr-brand px-4 py-[15px] text-[15px] font-medium leading-snug text-lr-on-brand shadow-[0_14px_34px_-18px_rgba(31,112,73,0.7)] transition-colors hover:border-lr-gold-line hover:bg-lr-brand-hover sm:w-fit sm:gap-3 sm:px-8 sm:text-[16px] md:mt-8 xl:px-9 xl:py-[17px] xl:text-[17px]"
            >
              <span className="min-w-0 text-center sm:text-left">{ctaLabel}</span>
              <ArrowIcon className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* phones / tablets: the scene between the CTA and the trust strip */}
        <div className={`relative mt-6 aspect-[882/656] overflow-hidden rounded-xl border border-lr-line md:mt-8 md:aspect-[16/10] lg:hidden dark:-mx-4 dark:rounded-none dark:border-0 sm:dark:-mx-6 md:dark:-mx-8 ${FADE_Y}`}>
          <Image src={scene} alt={alt} fill priority sizes="100vw" className="object-cover object-[50%_60%]" />
        </div>

        {/* trust strip */}
        {data.trustStrip?.length > 0 && (
          <ul className="relative grid grid-cols-2 overflow-hidden mt-6 rounded-xl border border-lr-line bg-lr-card/95 shadow-[0_24px_60px_-34px_var(--lr-shadow)] max-lg:[&>li:nth-child(even)]:border-l max-lg:[&>li:nth-child(n+3)]:border-t max-lg:[&>li]:border-lr-line lg:mt-9 max-lg:dark:mt-0 lg:grid-cols-4 lg:px-2">
            {data.trustStrip.map((item, i) => (
              <Stat key={item.label} item={item} index={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
