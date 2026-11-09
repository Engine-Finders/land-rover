import Link from "next/link";
import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { Arrow, H2_MODEL, SANS, prose } from "@/components/models/modelKit";
import { localHtml } from "@/components/models/generationsFaqLinks";
import { generationCtaCopy, modelMeta } from "@/lib/ctaCopy";
import { engineDbCar, genCode, genName } from "./genKit";

// Generation page section 11 - why owners trust us, built to the approved Defender L316 reference:
// the "Why UK <generation> Owners Trust / LandRoverEngine.uk" headline (the site name in green), the
// three trust points with square icon tiles and dividers; on the right the generation's car large on
// the hillside, fading into the page; then the closing card - a rosette, the final call to action and
// the "Compare … Engine Prices" button.
// Phones / tablets: the heading, the car full-bleed, the points, the closing card stacked.

const BG = "bg-[url(/home/hero-loch-day-m.webp)] sm:bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:dark:bg-[url(/home/hero-loch-night.webp)]";
const ICONS = ["genuine-failure-data", "scale", "commercial"];
const html = (raw) => localHtml(prose(raw || ""));
const capital = (t = "") => String(t).trim().replace(/^[a-z]/, (c) => c.toUpperCase());

// "Why UK … Owners Trust LandRoverEngine.uk" -> lead / site
function splitHeading(h2 = "") {
  const m = String(h2).match(/^(.*?)\s+((?:[\w-]+\.)+(?:uk|com|co\.uk))\s*$/i);
  return m ? { lead: m[1], site: m[2] } : { lead: h2, site: "" };
}

function Rosette({ className = "" }) {
  return (
    <svg viewBox="0 0 64 72" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M22 44 14 66l9-4 5 9 6-19M42 44l8 22-9-4-5 9-6-19" />
      <path d="M32 4.5l5 3.6 6.1-.5 2.4 5.7 5.7 2.4-.5 6.1 3.6 5-3.6 5 .5 6.1-5.7 2.4-2.4 5.7-6.1-.5-5 3.6-5-3.6-6.1.5-2.4-5.7-5.7-2.4.5-6.1-3.6-5 3.6-5-.5-6.1 5.7-2.4 2.4-5.7 6.1.5Z" />
      <path d="m32 17.5 3.5 7.1 7.8 1.1-5.6 5.5 1.3 7.8-7-3.7-7 3.7 1.3-7.8-5.6-5.5 7.8-1.1Z" className="fill-[#e7c35a] stroke-current" strokeWidth="1.8" />
    </svg>
  );
}

export default function TrustCta({ data, page = null, model = "" }) {
  if (!data) return null;
  const { lead, site } = splitHeading(prose(data.h2 || ""));
  const points = data.trustPoints || [];
  const car = engineDbCar(page?.hero || {}, model);
  const name = genName(page);
  const code = genCode(`${page?.hero?.h1 || ""} ${page?.hero?.tagPill || ""}`);
  const meta = modelMeta(model);
  const ctaCopy = generationCtaCopy({
    brandLabel: /^Range Rover/i.test(name || meta.label) ? "Range Rover" : "Land Rover",
    modelShort: meta.short === "Range Rover" ? "" : meta.short.replace(/^Range Rover\s+/, ""),
    generation: code || meta.short,
  });
  const label = ctaCopy.trustButton;
  const href = "/quote";
  const support = ctaCopy.trustSupport;

  return (
    <section className={`relative overflow-hidden bg-lr-page pb-6 text-lr-head md:pb-7 xl:pb-8 ${SANS}`}>
      <div className={`${CONTAINER} pt-6 md:pt-6 xl:pt-7`}>
        <div className="relative lg:min-h-[36vw] xl:min-h-[32vw]">
          {/* laptops: the hillside and the car, from the screen's right edge */}
          <div className="pointer-events-none absolute -top-10 bottom-[-28px] right-[calc(50%-50vw)] hidden w-[62vw] lg:block xl:-top-14" aria-hidden="true">
            <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.65)_24%,#000_44%)]">
              <div className={`absolute inset-0 bg-cover bg-[center_66%] ${BG} brightness-[1.05] contrast-[.94] hue-rotate-[12deg] saturate-[.8] dark:filter-none [mask-image:linear-gradient(180deg,transparent,#000_12%,#000_86%,transparent)]`} />
            </div>
            {car && (
              <div className="absolute bottom-[9%] right-[2.5vw] w-[47vw] max-w-[880px] xl:w-[50vw]">
                <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 50vw, 1px" />
              </div>
            )}
          </div>

          <div className="relative max-w-[640px] lg:max-w-[calc(44vw_-_40px)] xl:max-w-[calc(44vw_-_max(48px,50vw_-_752px)_-_8px)]">
            <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">Why trust us</p>
            <h2 className={`${H2_MODEL} mt-3.5 text-balance text-lr-head md:mt-4 lg:[text-wrap:wrap] xl:text-[44px]!`}>
              {lead}
              {site && (
                <>
                  {" "}
                  <span className="block text-lr-ink dark:text-lr-green">{site}</span>
                </>
              )}
            </h2>

            {/* phones / tablets: the hillside with the car, full-bleed */}
            {car && (
              <div className="relative -mx-5 mt-6 aspect-[2/1] sm:-mx-6 sm:aspect-[5/2] md:-mx-10 md:aspect-[3/1] lg:hidden" aria-hidden="true">
                <div className={`absolute inset-0 bg-cover bg-[center_70%] ${BG} brightness-[1.05] contrast-[.94] hue-rotate-[12deg] saturate-[.8] dark:filter-none [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_80%,transparent)]`} />
                <div className="absolute bottom-[8%] left-1/2 w-[60%] max-w-[440px] -translate-x-1/2 sm:w-[48%] md:w-[38%]">
                  <GroundedCar src={car} sceneByTheme sizes="(max-width: 640px) 60vw, 440px" />
                </div>
              </div>
            )}

            {points.length > 0 && (
              <ul className="mt-6 divide-y divide-lr-line md:mt-8">
                {points.map((p, i) => (
                  <li key={`${p.title}-${i}`} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0 sm:gap-5 xl:gap-6">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-lr-line bg-lr-panel/70 text-lr-ink shadow-[0_10px_24px_-18px_var(--lr-shadow)] xl:h-[72px] xl:w-[72px] dark:bg-lr-card dark:text-lr-green">
                      <LrIcon name={ICONS[i % ICONS.length]} tone="current" className="h-7 w-7 xl:h-9 xl:w-9" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold leading-snug text-lr-head xl:text-[18px]" dangerouslySetInnerHTML={{ __html: html(p.title) }} />
                      <p className="mt-1.5 text-[14px] leading-[1.6] text-lr-body xl:text-[16px]" dangerouslySetInnerHTML={{ __html: html(capital(p.text)) }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {(data.finalCta || label) && (
          <div className="relative mt-8 flex flex-col gap-5 rounded-2xl border border-lr-line bg-lr-panel/60 p-5 shadow-[0_24px_60px_-42px_var(--lr-shadow)] backdrop-blur-sm sm:p-6 md:mt-10 lg:flex-row lg:items-center lg:gap-8 xl:px-9 xl:py-8 dark:bg-lr-card/80">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-lr-line bg-lr-card text-lr-ink xl:h-[92px] xl:w-[92px] dark:text-lr-green">
              <Rosette className="h-11 w-11 xl:h-[60px] xl:w-[60px]" />
            </span>
            <div className="min-w-0 flex-1">
              {data.finalCta && <p className="text-[16px] leading-[1.55] text-lr-head md:text-[18px] xl:text-[21px]" dangerouslySetInnerHTML={{ __html: html(data.finalCta) }} />}
              {support && <p className="mt-2 text-[14px] leading-snug text-lr-body md:text-[15px]">{support}</p>}
            </div>
            {label && (
              <Link
                href={href}
                className="flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-lg bg-lr-brand px-6 py-3.5 text-center text-[16px] font-semibold leading-snug text-lr-on-brand no-underline shadow-[0_14px_30px_-18px_rgba(18,61,42,0.8)] transition-colors hover:bg-lr-brand-hover lg:max-w-[440px] xl:px-8 xl:text-[19px]"
              >
                <span>{label}</span>
                <Arrow className="h-5 w-5 shrink-0" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
