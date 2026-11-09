import Image from "next/image";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";
import LrIcon from "@/components/shared/LrIcon";
import HeroRegCta from "@/components/shared/HeroRegCta";
import GroundedCar from "@/components/variant/GroundedCar";
import { engineCtaCopy } from "@/lib/ctaCopy";
import { BODY, H1, ICON_LG, SMALL } from "@/lib/typeScale";

// Engine hero: tag pill, serif headline (accent on "Replacement Cost"), sub-headline, quote CTA,
// the engine on its lit ring in the dusk mountain / garage scene, and a four-stat trust strip -
// all from the page's `hero` JSON. Follows the site theme: on the day theme the engine (a cut-out of
// the same render) stands on the golden-hour Highland loch used by the home hero, washed in the page
// colour behind the copy; on the night theme the dusk garage scene fades into the green page (CSS
// masks). Phones and tablets stack the copy, the scene and the strip; from lg the scene sits on the
// right. The 200Tdi/300Tdi page shows the "Tdi"-badged engine cover, every other engine the same
// render without the badge.

// day theme: page-coloured wash over the loch behind the copy column (from the container's left edge)
const WASH = {
  background:
    "linear-gradient(90deg, var(--lr-page) 0px, color-mix(in srgb, var(--lr-page) 92%, transparent) calc(max(0px, 50vw - 704px) + 520px), color-mix(in srgb, var(--lr-page) 55%, transparent) calc(max(0px, 50vw - 704px) + 740px), transparent calc(max(0px, 50vw - 704px) + 980px))",
};

// night theme: feather the photo's edges into the page
const FADE_X = "dark:[mask-image:linear-gradient(to_right,transparent,#000_34%,#000_90%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_76%,transparent)] dark:[mask-composite:intersect]";
const FADE_Y = "dark:[mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_84%,transparent)]";

/* ---------- trust strip icons (brand icon set) ---------- */
const ICON_BY_EMOJI = { "📊": "real-inquiries", "🔧": "vehicle", "💯": "real-data", "🏆": "part-of-engine-finders" };
const ICON_ORDER = ["real-inquiries", "vehicle", "real-data", "part-of-engine-finders"];

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
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-gold-line/70 bg-lr-chip sm:h-13 sm:w-13 lg:h-[52px] lg:w-[52px] xl:h-[58px] xl:w-[58px] dark:bg-[radial-gradient(circle_at_50%_38%,#17402d_0%,#0b2219_72%)]"
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
  const engineName = String(data.h1 || "")
    .split(/\s+[-–—]\s+/)[0]
    .replace(/\s+Engine$/i, "")
    .trim() || "Land Rover Engine";
  const cta = engineCtaCopy(engineName);
  const tdi = /tdi/.test(slug);
  const scene = tdi ? "/engine-hero/scene-tdi.webp" : "/engine-hero/scene.webp";
  const engine = tdi ? "/engine-hero/engine-tdi-cut.webp" : "/engine-hero/engine-cut.webp";
  const alt = `${pill[1] ? pill[1].replace(/<[^>]+>/g, "") : "Land Rover"} engine`;

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head" style={SANS}>
      {/* desktop, day theme: the loch behind the band, the engine standing on its foreground */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block lg:dark:hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[url(/home/hero-loch-day.webp)] bg-cover bg-[center_64%] [mask-image:linear-gradient(to_bottom,#000_86%,transparent)]" />
        <div className="absolute inset-0" style={WASH} />
        <div className={`relative h-full ${CONTAINER}`}>
          {/* the engine's base sits on the hillside just above the stats strip */}
          <div className="absolute bottom-[168px] right-12 w-[31%] xl:bottom-[160px] xl:w-[30%] min-[1400px]:w-[29%]">
            <GroundedCar src={engine} priority sceneByTheme sizes="(min-width: 1024px) 32vw, 1px" />
          </div>
        </div>
      </div>
      {/* desktop, night theme: the dusk scene feathered into the page */}
      <div className="pointer-events-none absolute inset-0 hidden dark:lg:block" aria-hidden="true">
        <div className={`relative h-full ${CONTAINER}`}>
          <div
            className={`absolute right-4 top-12 aspect-[882/656] w-[46%] overflow-hidden rounded-2xl border border-lr-line shadow-[0_30px_60px_-34px_var(--lr-shadow)] md:right-8 xl:top-14 xl:w-[47%] dark:right-0 dark:top-0 dark:w-[56%] dark:rounded-none dark:border-0 dark:shadow-none xl:dark:w-[54%] ${FADE_X}`}
          >
            <Image src={scene} alt="" fill sizes="56vw" className="object-cover" />
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

          <HeroRegCta
            className="mt-6 max-w-[680px] md:mt-8"
            buttonLabel={cta.heroButton}
            buttonClassName="rounded-lg border-[1.5px] border-lr-gold-line/70"
          />
        </div>

        {/* phones / tablets, day theme: the engine on the loch-side hillside, top edge feathered into the page */}
        <div className="relative -mx-5 sm:-mx-6 mt-6 aspect-[4/3] bg-[url(/home/hero-loch-day-m.webp)] bg-cover bg-bottom [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_86%,transparent)] sm:aspect-[16/9] md:-mx-10 md:mt-8 lg:hidden dark:hidden" role="img" aria-label={alt}>
          <div className="absolute bottom-[16%] left-1/2 w-[50%] max-w-[360px] -translate-x-1/2 sm:bottom-[15%] sm:w-[34%]">
            <GroundedCar src={engine} priority sceneByTheme sizes="(max-width: 640px) 50vw, 360px" />
          </div>
        </div>
        {/* phones / tablets, night theme: the dusk scene between the CTA and the trust strip */}
        <div className={`relative mt-6 hidden aspect-[882/656] overflow-hidden md:mt-8 md:aspect-[16/10] dark:-mx-5 sm:dark:-mx-6 dark:block md:dark:-mx-10 lg:dark:hidden ${FADE_Y}`}>
          <Image src={scene} alt={alt} fill sizes="100vw" className="object-cover object-[50%_60%]" />
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
