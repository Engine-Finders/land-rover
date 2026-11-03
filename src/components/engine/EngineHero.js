import Image from "next/image";
import Link from "next/link";
import { CONTAINER, DARK, GOLD_ON_DARK as GOLD, SANS, SERIF } from "@/components/engine/engineTheme";

// Engine hero: tag pill, serif headline (accent on "Replacement Cost"), sub-headline, quote CTA,
// the engine on its lit ring in the dusk mountain / garage scene, and a four-stat trust strip -
// all from the page's `hero` JSON. Fixed dark design. Phones and tablets stack the copy, scene
// and strip; from lg the scene sits behind the copy on the right. The 200Tdi/300Tdi page shows the
// "Tdi"-badged engine cover, every other engine the same render without the badge.

const GREEN = "#3f8a5c";

/* ---------- gold line icons for the trust strip ---------- */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const GLYPHS = {
  chart: (
    <>
      <rect {...line} x="3.5" y="14" width="3" height="6" rx="0.4" />
      <rect {...line} x="8.5" y="9.5" width="3" height="10.5" rx="0.4" />
      <rect {...line} x="13.5" y="4" width="3" height="16" rx="0.4" />
      <rect {...line} x="18.5" y="11" width="3" height="9" rx="0.4" />
      <path {...line} d="m13.5 20 3-16" />
    </>
  ),
  wrench: <path {...line} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />,
  shield: (
    <>
      <path {...line} d="M12 2.8 19.5 5.6v6.1c0 4.6-3.1 7.7-7.5 9.5-4.4-1.8-7.5-4.9-7.5-9.5V5.6z" />
      <path fill="currentColor" d="m12 7.9 1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z" />
    </>
  ),
  trophy: (
    <>
      <path {...line} d="M7.5 3.5h9v5.2a4.5 4.5 0 0 1-9 0z" />
      <path {...line} d="M7.5 5.5H4.3v1.6a3.3 3.3 0 0 0 3.5 3.3M16.5 5.5h3.2v1.6a3.3 3.3 0 0 1-3.5 3.3" />
      <path {...line} d="M12 13.2v3.6M9.2 20.5h5.6M10 16.8h4l.8 3.7H9.2z" />
    </>
  ),
};
const ICON_BY_EMOJI = { "📊": "chart", "🔧": "wrench", "💯": "shield", "🏆": "trophy" };
const ICON_ORDER = ["chart", "wrench", "shield", "trophy"];

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
  html.replace(/ - /g, " — ").replace(/(\[[A-Z][A-Z-]*\]\.?)/g, `<span style="color:${GREEN}">$1</span>`);

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
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#8c7650] bg-[radial-gradient(circle_at_50%_38%,#0c2a1d_0%,#04140e_72%)] sm:h-16 sm:w-16 lg:h-[52px] lg:w-[52px] xl:h-[72px] xl:w-[72px] 2xl:h-[84px] 2xl:w-[84px]"
      style={{ color: GOLD }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-7 lg:w-7 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10" aria-hidden="true">
        {GLYPHS[name]}
      </svg>
    </span>
  );
}

function Stat({ item, index }) {
  const icon = ICON_BY_EMOJI[item.icon] || ICON_ORDER[index % ICON_ORDER.length];
  const stat = parseStat(item.label);
  const captionClass = "block text-[11px] uppercase leading-[1.3] tracking-[0.03em] text-[#a4aaa8] sm:text-[12.5px] lg:text-[11.5px] xl:text-[13.5px] 2xl:text-[15px]";

  return (
    <li
      className={`relative flex flex-col items-center gap-2.5 px-2 py-4 text-center sm:flex-row sm:gap-4 sm:px-4 sm:py-5 sm:text-left lg:justify-center lg:gap-3 lg:px-3 lg:py-6 xl:gap-5 2xl:gap-6 ${
        index > 0
          ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[56%] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-[#2c3333]"
          : ""
      }`}
    >
      <StatIcon name={icon} />
      <span className="min-w-0" style={SANS}>
        {stat.value ? (
          <>
            <span className="block whitespace-nowrap text-[18px] leading-[1.1] text-[#f3f1ec] min-[375px]:text-[20px] sm:text-[23px] lg:text-[20px] xl:text-[26px] 2xl:text-[30px]" style={SERIF}>
              {stat.value}
              {stat.outOf && <span className="text-[0.72em]">{stat.outOf}</span>}
            </span>
            <span className={`mt-1 2xl:mt-1.5 ${captionClass}`}>
              {stat.caption}
              {icon === "chart" && <span className="normal-case"> in 2025</span>}
            </span>
          </>
        ) : (
          <>
            {stat.lead && <span className="block text-[11px] uppercase leading-[1.3] tracking-[0.03em] text-[#eceae5] sm:text-[12.5px] lg:text-[11.5px] xl:text-[13.5px] 2xl:text-[15px]">{stat.lead}</span>}
            <span className={`mt-1 2xl:mt-1.5 ${captionClass}`}>{stat.caption}</span>
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
    <section className="relative overflow-hidden text-white" style={{ ...SANS, background: DARK }}>
      {/* desktop: the scene on the right, faded into the page under the copy */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[1680px] -translate-x-1/2 lg:block" aria-hidden="true">
        <div className="absolute right-0 top-0 aspect-[882/656] w-[56%] xl:w-[54%]">
          <Image src={scene} alt="" fill priority sizes="56vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${DARK} 0%, rgba(6,11,13,0.85) 8%, rgba(6,11,13,0.35) 20%, transparent 34%)` }} />
          <div className="absolute inset-x-0 top-0 h-[16%]" style={{ background: "linear-gradient(to bottom, rgba(6,11,13,0.7), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }} />
          <div className="absolute inset-y-0 right-0 hidden w-[10%] min-[1700px]:block" style={{ background: `linear-gradient(to left, ${DARK}, transparent)` }} />
        </div>
      </div>

      <div className={`relative ${CONTAINER} pb-6 pt-5 md:pb-10 md:pt-8 lg:pb-12 lg:pt-12 xl:pt-14`}>
        {pill.length > 0 && (
          <p className="inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-[22px] border border-[#8c7650]/80 bg-black/35 px-4 py-2 text-[13px] leading-[1.45] text-[#eceae5] sm:gap-x-3 sm:px-5 sm:text-[14px] xl:gap-x-4 xl:px-6 xl:py-2.5 xl:text-[16px] 2xl:gap-x-5 2xl:text-[17.5px] [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-2">
            {pill.map((part, i) => (
              <span key={i} className="inline-flex items-center gap-x-2.5 sm:gap-x-3 xl:gap-x-4">
                {i > 0 && <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#e4b97c" }} aria-hidden="true" />}
                <span dangerouslySetInnerHTML={{ __html: part }} />
              </span>
            ))}
          </p>
        )}

        <div className="lg:max-w-[50%] xl:max-w-[640px] 2xl:max-w-[720px]">
          <h1 className="mt-5 text-[31px] leading-[1.14] tracking-[-0.01em] text-[#f3f1ec] min-[375px]:text-[32px] sm:text-[42px] md:mt-7 md:text-[48px] lg:max-w-[10.4em] lg:text-[44px] xl:text-[54px] 2xl:text-[64px] [&_a]:text-inherit [&_a]:no-underline" style={SERIF}>
            <span dangerouslySetInnerHTML={{ __html: lead }} />
            {accent && <span style={{ color: GREEN }}>{accent}</span>}
          </h1>

          {data.subHeadline && (
            <p
              className="mt-4 max-w-[600px] text-[15.5px] leading-[1.6] text-white/[0.88] md:mt-5 md:text-[18px] xl:text-[19px] 2xl:text-[20px] [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-2"
              dangerouslySetInnerHTML={{ __html: highlightTags(data.subHeadline) }}
            />
          )}

          {data.primaryCta && (
            <Link
              href="/quote"
              className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-[#8c7650] bg-[linear-gradient(180deg,#123222_0%,#0a2318_100%)] px-4 py-[15px] text-[15px] font-medium leading-snug text-white shadow-[0_14px_34px_-16px_rgba(63,138,92,0.7)] transition-colors hover:border-[#b0955f] hover:bg-[linear-gradient(180deg,#173d2a_0%,#0d2a1d_100%)] min-[390px]:text-[15.5px] sm:w-fit sm:gap-3 sm:px-8 sm:text-[16px] md:mt-8 md:text-[18px] xl:px-9 xl:py-[18px] xl:text-[19px]"
            >
              <span className="min-w-0 text-center sm:text-left">{ctaLabel}</span>
              <ArrowIcon className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* phones / tablets: the scene between the CTA and the trust strip */}
        <div className="relative -mx-4 mt-6 aspect-[882/656] overflow-hidden sm:-mx-6 md:-mx-8 md:mt-8 md:aspect-[16/10] lg:hidden">
          <Image src={scene} alt={alt} fill priority sizes="100vw" className="object-cover object-[50%_60%]" />
          <div className="absolute inset-x-0 top-0 h-[20%]" style={{ background: `linear-gradient(to bottom, ${DARK}, transparent)` }} />
          <div className="absolute inset-x-0 bottom-0 h-[16%]" style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }} />
        </div>

        {/* trust strip */}
        {data.trustStrip?.length > 0 && (
          <ul className="relative grid grid-cols-2 overflow-hidden rounded-xl border border-[#262d2d] bg-[#0b1212]/90 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] max-lg:divide-[#262d2d] max-lg:[&>li:nth-child(even)]:border-l max-lg:[&>li:nth-child(n+3)]:border-t max-lg:[&>li]:border-[#262d2d] lg:mt-9 lg:grid-cols-4 lg:px-2">
            {data.trustStrip.map((item, i) => (
              <Stat key={item.label} item={item} index={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
