import LrIcon from "@/components/shared/LrIcon";
import HeroRegCta from "@/components/shared/HeroRegCta";
import { modelCtaCopy } from "@/lib/ctaCopy";
import { CONTAINER, H1, ICON_MD, ICON_SM, ICON_XL } from "@/lib/typeScale";

// Model page hero (section 1), built to the approved Velar reference: a rounded card holding the
// model pill, the serif headline ("UK Guide" in green), the sub-headline and the Explore button on
// the left; on the right a diagonal panel with the model's line-up of four cars in the Highland
// mountains (misty overcast by day, a storm at night); and a four-stat bar along the bottom.
// Below xl (1280px) the copy stacks over the line-up, with the stats over its foot (2 x 2 grid on
// phones and tablets, one row from lg).
// Art comes in two layers (built by scripts/build-model-hero-art.py) so the cars are never cropped,
// masked or softened by the panel: a shared Highland backdrop with a paved apron
// (public/model/hero/bg-<day|night>[-m].webp, cover-fitted) and each model's four-car line-up on
// transparency (<slug>-cars-<day|night>[-m].webp), laid out like the reference and stood on the
// apron with its own cast and contact shadows.

const SANS = "font-[family-name:var(--font-instrument-sans)]";
const STAT_ICONS = ["real-inquiries", "commercial", "generation-honest-rated", "part-of-engine-finders"];
const LINEUPS = new Set([
  "defender", "discovery", "discovery-sport", "freelander",
  "range-rover", "range-rover-evoque", "range-rover-sport", "velar",
]);

// desktop panel: diagonal left edge, feathered into the card at the foot (behind the stats bar)
const PANEL_CLIP = "[clip-path:polygon(30%_0,100%_0,100%_100%,0_100%,0_58%)]";
const PANEL_FADE =
  "[mask-image:linear-gradient(to_bottom,#000_78%,transparent),linear-gradient(to_right,transparent,#000_12%)] [mask-composite:intersect]";
// phones / tablets: the backdrop feathers into the card at the top and under the stats
const MOBILE_FADE = "[mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]";
const BG_DESKTOP = "bg-[url(/model/hero/bg-day.webp)] dark:bg-[url(/model/hero/bg-night.webp)]";
const BG_MOBILE =
  "bg-[url(/model/hero/bg-day-m.webp)] sm:bg-[url(/model/hero/bg-day.webp)] dark:bg-[url(/model/hero/bg-night-m.webp)] sm:dark:bg-[url(/model/hero/bg-night.webp)]";
const CARS_DESKTOP = "bg-[image:var(--cars-day)] dark:bg-[image:var(--cars-night)]";
const CARS_MOBILE =
  "bg-[image:var(--cars-day-m)] sm:bg-[image:var(--cars-day)] dark:bg-[image:var(--cars-night-m)] sm:dark:bg-[image:var(--cars-night)]";
// the line-up image's own proportions (1950 x 670)
const CARS_RATIO = "aspect-[2040/670] bg-contain bg-no-repeat bg-bottom";

const verified = (html = "") =>
  html.replace(/\[EM-VERIFIED\]/g, '<span class="whitespace-nowrap font-semibold text-lr-ink dark:font-medium dark:text-lr-green">[EM-VERIFIED]</span>');

// "Velar • 2017–Present • 1 Generation (L560) • Ingenium, SDV6, PHEV"
function splitPill(tagPill = "") {
  const [model = "", years = "", generations = "", ...engines] = tagPill.split(" • ");
  return { model, years, generations, engines: engines.join(" • ") };
}

// "275+ Enquiries (2025) [EM-VERIFIED] - #1 Most-Enquired Velar Model"
//   -> { value: "275+", label: "Enquiries (2025) [EM-VERIFIED] - #1 Most-Enquired Velar Model" }
function splitStat(text = "") {
  const clean = text.replace(/\s+-\s+/g, " - ");
  const m = clean.match(/^([\d,.]+\+?)\s+(.+)$/);
  // short labels break after their comma, as in the reference ("Generation," / "8 Powertrains")
  const label = (s) => (s.length < 40 ? s.replace(/, /, ",<br>") : s);
  return m ? { value: m[1], label: label(m[2]) } : { value: "", label: clean };
}

function Dot() {
  return <span aria-hidden="true" className="px-1.5 text-lr-muted md:px-2.5">•</span>;
}

function Stat({ item, index }) {
  const { value, label } = splitStat(item.label || item.text || "");
  const partOf = label.match(/^Part of\s+(.+)$/i);
  return (
    <li
      className={`flex min-w-0 flex-col items-start gap-2.5 px-4 py-4 sm:flex-row sm:items-center sm:gap-3.5 sm:px-5 lg:gap-4 lg:px-6 lg:py-6 xl:gap-5 xl:px-8
        ${index % 2 === 0 ? "border-r border-lr-line" : ""} ${index < 2 ? "border-b border-lr-line lg:border-b-0" : ""} ${index === 1 ? "lg:border-r" : ""}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lr-brand sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[72px] xl:w-[72px] dark:border dark:border-lr-gold-line/55 dark:bg-transparent">
        <LrIcon name={STAT_ICONS[index] || STAT_ICONS[0]} tone="skin" className={`${ICON_XL} max-sm:h-6 max-sm:w-6`} />
      </span>
      <p className="min-w-0 text-[13px] leading-[1.4] text-lr-body sm:text-[14px] lg:text-[15px] xl:text-[16px]">
        {partOf ? (
          <>
            <span className="block">Part of</span>
            <strong className="block font-semibold text-lr-head">{partOf[1]}</strong>
          </>
        ) : (
          <>
            {value && (
              <span className="mb-0.5 block text-[21px] font-semibold leading-none text-lr-ink sm:text-[24px] lg:mb-1 lg:text-[26px] xl:text-[30px] dark:text-lr-green">
                {value}
              </span>
            )}
            <span className="block" dangerouslySetInnerHTML={{ __html: verified(label) }} />
          </>
        )}
      </p>
    </li>
  );
}

export default function ModelHero({ data, slug = "" }) {
  if (!data) return null;

  const pill = splitPill(data.tagPill);
  const [firstEngine, ...restEngines] = pill.engines.split(" ");
  const dash = (data.h1 || "").search(/\s[-–-]\s/);
  const lead = dash === -1 ? data.h1 : data.h1.slice(0, dash);
  const tail = dash === -1 ? "" : data.h1.slice(dash + 3);
  const accentAt = tail.search(/UK Guide$/);
  // long model names ("Range Rover Sport Engines -") step down to 54px on desktop so the headline
  // stays at three lines and the line-up panel beside it keeps its proportions
  const longLead = lead.length > 20;
  const cta = modelCtaCopy(slug);
  const sub = (data.subHeadline || "").replace(/\s+-\s+/g, " - ");

  const lineup = LINEUPS.has(slug) ? slug : "";
  const art = lineup && {
    "--cars-day": `url(/model/hero/${lineup}-cars-day.webp)`,
    "--cars-night": `url(/model/hero/${lineup}-cars-night.webp)`,
    "--cars-day-m": `url(/model/hero/${lineup}-cars-day-m.webp)`,
    "--cars-night-m": `url(/model/hero/${lineup}-cars-night-m.webp)`,
  };

  return (
    <section className={`relative overflow-hidden bg-lr-page text-lr-head ${SANS}`} style={art || undefined}>
      <div className={`${CONTAINER} pb-6 pt-6 md:pb-6 md:pt-8 lg:pt-10`}>
        <div className="relative">
          <div className="relative">
          {/* desktop: the line-up in a diagonal panel on the right, as tall as the copy and running
              under the top of the stats bar, with the green accent stripe on its edge */}
          {lineup && (
            <div className="pointer-events-none absolute -bottom-20 -top-10 left-[47%] right-[calc(50%-50vw)] hidden xl:block" aria-hidden="true">
              <div className={`absolute inset-0 bg-cover bg-[right_bottom] ${BG_DESKTOP} ${PANEL_CLIP} ${PANEL_FADE}`} />
              <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="model-hero-stripe" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
                    <stop offset="0" stopColor="var(--lr-brand)" />
                    <stop offset="0.35" stopColor="var(--lr-brand)" stopOpacity="0.9" />
                    <stop offset="0.58" stopColor="var(--lr-brand)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="30" y1="-1" x2="0" y2="58" stroke="url(#model-hero-stripe)" strokeWidth="7" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          )}
          {/* desktop: the line-up stands on the apron with the front wheels level with the button and
              the back car running past the diagonal - every car whole (the front car ends just inside the
              page edge, never cut off), never masked, so every car stays sharp */}
          {lineup && (
            <div className={`pointer-events-none absolute bottom-0 left-[42.5%] hidden w-[59.5%] xl:block ${CARS_RATIO} ${CARS_DESKTOP}`} aria-hidden="true" />
          )}

          <div className="relative text-center xl:pt-4 xl:text-left">
            {/* model pill: one line from sm; on phones three tidy lines (model + years, generations,
                engines) with no bullets left dangling at a line start */}
            <div className="mx-auto inline-flex max-w-full items-start gap-2.5 rounded-xl border border-lr-line-strong/80 bg-lr-card/70 px-3.5 py-3 text-left text-[13.5px] leading-[1.55] text-lr-head backdrop-blur-sm sm:items-center sm:gap-3 sm:px-5 sm:text-[14.5px] xl:max-w-[54%] lg:rounded-2xl lg:px-6 lg:py-4 xl:text-[16px]">
              <LrIcon name="genuine-failure-data" className={`${ICON_MD} mt-0.5 sm:mt-0 lg:h-7 lg:w-7 xl:h-8 xl:w-8`} />
              <p className="min-w-0 [&_a]:font-[inherit] [&_a]:text-inherit [&_a]:no-underline hover:[&_a]:underline">
                <strong className="font-semibold text-lr-ink dark:text-lr-green lg:text-[18px] xl:text-[20px]">{pill.model}</strong>
                {"\u00a0"}<Dot /> {pill.years}
                {pill.generations && (
                  <>
                    <span className="max-sm:hidden">{"\u00a0"}<Dot /> </span>
                    <br className="sm:hidden" />
                    <span className="whitespace-nowrap">{pill.generations}</span>
                  </>
                )}
                {pill.engines && (
                  <>
                    <span className="max-sm:hidden">{"\u00a0"}<Dot /> </span>
                    <br className="sm:hidden" />
                    <span className="whitespace-nowrap">
                      <LrIcon name="drivetrain-failures" className={`${ICON_SM} mr-1.5 inline-block align-[-3px] dark:bg-lr-gold`} />
                      <span dangerouslySetInnerHTML={{ __html: firstEngine }} />
                    </span>
                    {restEngines.length > 0 && <span dangerouslySetInnerHTML={{ __html: ` ${restEngines.join(" ")}` }} />}
                  </>
                )}
              </p>
            </div>

            <h1 className={`${H1} mt-6 text-balance text-lr-head sm:mt-8 lg:mt-11 xl:mt-12 xl:max-w-[63%] ${longLead ? "xl:text-[54px]!" : ""}`}>
              {tail ? (
                <>
                  {lead}{"\u00a0"}-{!longLead && <br className="max-xl:hidden" />}{" "}
                  {accentAt > 0 ? (
                    <>
                      {tail.slice(0, accentAt)}
                      <span className="whitespace-nowrap text-lr-ink dark:text-lr-green">{tail.slice(accentAt)}</span>
                    </>
                  ) : (
                    tail
                  )}
                </>
              ) : (
                lead
              )}
            </h1>

            {sub && (
              <p
                className="mx-auto mt-4 max-w-[34em] text-[15px] xl:mx-0 [&_a]:font-semibold [&_a]:text-lr-ink [&_a]:no-underline hover:[&_a]:underline dark:[&_a]:text-lr-green leading-[1.65] text-lr-body sm:mt-5 md:text-[16px] lg:mt-6 xl:max-w-[42%] xl:text-[18px]"
                dangerouslySetInnerHTML={{ __html: verified(sub) }}
              />
            )}

            <HeroRegCta
              className="mx-auto mt-6 max-w-[680px] lg:mt-9 xl:mx-0"
              buttonLabel={cta.heroButton}
              buttonClassName="rounded-[10px]"
            />
          </div>
          </div>

          {/* phones / tablets: the line-up between the copy and the stats */}
          {lineup && (
            <div className="relative -mx-5 sm:-mx-6 -mt-2 aspect-[16/11] sm:-mt-4 sm:aspect-[16/10] md:-mx-10 lg:aspect-[2/1] xl:hidden" aria-hidden="true">
              <div className={`absolute inset-0 bg-cover bg-[right_bottom] ${BG_MOBILE} ${MOBILE_FADE}`} />
              {/* the whole line-up on screen at every width (no car running off the edge) */}
              <div className={`absolute bottom-[21%] left-[-1%] w-[102%] sm:bottom-[18%] sm:left-[1%] sm:w-[99%] lg:bottom-[19%] lg:left-[8%] lg:w-[92%] ${CARS_RATIO} ${CARS_MOBILE}`} />
            </div>
          )}

          {data.trustStrip?.length > 0 && (
            <div className={`relative ${lineup ? "-mt-12 sm:-mt-16 lg:-mt-20 xl:mt-14" : "mt-6 lg:mt-14"}`}>
              <ul className="grid grid-cols-2 overflow-hidden rounded-xl border border-lr-line bg-lr-card/92 shadow-[0_18px_40px_-30px_var(--lr-shadow)] backdrop-blur-md lg:grid-cols-4 lg:rounded-2xl dark:bg-lr-page/80">
                {data.trustStrip.slice(0, 4).map((item, i) => (
                  <Stat key={item.label || i} item={item} index={i} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
