import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose, splitHeading } from "@/components/models/modelKit";
import { localHtml } from "@/components/models/generationsFaqLinks";
import SectionQuoteCta from "@/components/shared/SectionQuoteCta";
import { generationCtaCopy, modelMeta } from "@/lib/ctaCopy";
import { engineDbCar, genCode, genName } from "./genKit";

// Generation page section 7 - engine replacement costs, built to the approved Defender L316
// reference: the eyebrow, "<code> Engine Replacement Costs - / By Engine and Condition" with the last
// word in green and a short intro; on the right the hillside with the generation's car standing on
// the table's top edge; the six-column table (icons in the head - variant, engine code, used,
// reconditioned, rebuilt, labour hours); the data note when the JSON has one; and the five-point
// trust strip.
// Phones / tablets: the copy, the car full-bleed, one card per variant, the strip stacked.

const BG = "bg-[url(/home/hero-loch-day-m.webp)] sm:bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:dark:bg-[url(/home/hero-loch-night.webp)]";
const KEYS = ["variant", "engineCode", "usedSupply", "reconditionedSupply", "rebuiltSupply", "labourHours"];
const DEFAULT_COLUMNS = ["Variant", "Engine Code", "Used (Supply)", "Reconditioned (Supply)", "Rebuilt (Supply)", "Labour Hours"];
const WIDTHS = [14, 15.6, 14.6, 19.5, 16.6, 14.7];
const html = (raw) => localHtml(prose(raw || ""));
const LINKS = "[&_a]:text-inherit [&_a]:no-underline hover:[&_a]:underline";
const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

function HeadIcon({ index, className = "h-6 w-6 shrink-0 xl:h-7 xl:w-7" }) {
  if (index === 0) return <LrIcon name="vehicle" tone="current" className={className} />;
  if (index === 1) return <LrIcon name="engine" tone="current" className={className} />;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g {...STROKE}>
        {index === 2 && (
          <>
            <path d="M3.5 12.6V4.4a.9.9 0 0 1 .9-.9h8.2l8 8a1.5 1.5 0 0 1 0 2.1l-6.3 6.3a1.5 1.5 0 0 1-2.1 0Z" />
            <circle cx="8.2" cy="8.2" r="1.5" />
          </>
        )}
        {index === 3 && <path d="M20 8.5A8.5 8.5 0 0 0 5 6.4L3.5 8M4 15.5a8.5 8.5 0 0 0 15 2.1l1.5-1.6M3.5 3.6V8h4.4M20.5 20.4V16h-4.4" />}
        {index === 4 && (
          <>
            <path d="M12 2.8 19.5 5.8v5.6c0 4.7-3.2 8.3-7.5 9.8-4.3-1.5-7.5-5.1-7.5-9.8V5.8Z" />
            <path d="m8.6 12 2.4 2.4 4.6-4.9" />
          </>
        )}
        {index === 5 && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5V12l3 2" />
          </>
        )}
      </g>
    </svg>
  );
}

const STRIP = [
  { icon: "genuine-failure-data", title: "Transparent. Specialist. Trusted.", text: "All prices are supply only and reflect real UK market data. Labour hours are estimates based on specialist workshop experience.", ring: true },
  { icon: "pound", title: "Specialist Prices", text: "Real-world pricing from UK engine specialists." },
  { icon: "safe-buy", title: "Quality Assured", text: "Every rebuilder in our network is vetted, rated and reviewed by real owners." },
  { icon: "commercial", title: "Expert Fitment", text: "Labour guidance from Land Rover specialist workshops." },
  { icon: "uk-wide-delivery", title: "UK Wide Delivery", text: "Supply-only or full supply & fit, nationwide." },
];

function StripIcon({ item }) {
  const icon =
    item.icon === "pound" ? (
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.8px] border-current font-[family-name:var(--font-serif-display)] text-[20px] leading-none xl:h-10 xl:w-10" aria-hidden="true">
        £
      </span>
    ) : (
      <LrIcon name={item.icon} tone="current" className="h-9 w-9 xl:h-10 xl:w-10" />
    );
  return (
    <span
      className={`flex shrink-0 items-center justify-center text-lr-ink dark:text-lr-gold ${
        item.ring ? "h-16 w-16 rounded-full border-[1.5px] border-lr-ink/40 xl:h-[72px] xl:w-[72px] dark:border-lr-gold-line/55" : "h-12 w-12"
      }`}
    >
      {icon}
    </span>
  );
}

// the five-point trust strip under the cost tables (also closes section 9)
export function TrustStrip({ className = "" }) {
  return (
    <ul className={`grid overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_18px_44px_-36px_var(--lr-shadow)] sm:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))] ${className}`}>
      {STRIP.map((s, i) => (
        <li
          key={s.title}
          className={`relative flex items-center gap-4 px-5 py-4 xl:px-6 xl:py-5 ${i > 0 ? "border-t border-lr-line xl:border-t-0" : ""} ${i === 0 ? "sm:col-span-2 xl:col-span-1" : ""} ${
            i === 2 || i === 4 ? "sm:border-l sm:border-lr-line xl:border-l-0" : ""
          } ${i > 0 ? "xl:before:absolute xl:before:inset-y-5 xl:before:left-0 xl:before:w-px xl:before:bg-lr-line" : ""}`}
        >
          <StripIcon item={s} />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-snug text-lr-head xl:text-[16px]">{s.title}</p>
            <p className="mt-1 text-[13.5px] leading-[1.5] text-lr-body xl:text-[14px]">{s.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ReplacementCosts({ data, page = null, model = "" }) {
  const rows = data?.rows || [];
  if (!data || !rows.length) return null;

  const { lead, accent } = splitHeading(prose(data.h2 || ""));
  const words = accent.split(" ");
  const last = words.pop();
  const columns = KEYS.map((_, i) => data.columns?.[i] || DEFAULT_COLUMNS[i]);
  const car = engineDbCar(page?.hero || { h1: data.h2 }, model);
  const name = genName(page);
  const code = genCode(`${page?.hero?.h1 || ""} ${page?.hero?.tagPill || ""}`);
  const meta = modelMeta(model);
  const cta = generationCtaCopy({
    brandLabel: /^Range Rover/i.test(name || meta.label) ? "Range Rover" : "Land Rover",
    modelShort: meta.short === "Range Rover" ? "" : meta.short.replace(/^Range Rover\s+/, ""),
    generation: code || meta.short,
  });

  return (
    <section className={`relative overflow-hidden bg-lr-page pb-6 text-lr-head md:pb-7 xl:pb-8 ${SANS}`}>
      <div className={`${CONTAINER} pt-6 md:pt-6 lg:pt-6 xl:pt-6`}>
        <div className="relative lg:pb-7">
          {/* laptops: the hillside and the car, from the screen's right edge to the table's top */}
          <div className="pointer-events-none absolute -top-10 bottom-0 right-[calc(50%-50vw)] hidden w-[62vw] lg:block xl:-top-11" aria-hidden="true">
            <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.6)_26%,#000_48%)]">
              <div className={`absolute inset-0 bg-cover bg-[center_32%] ${BG} brightness-[1.05] contrast-[.92] hue-rotate-[14deg] saturate-[.78] dark:filter-none [mask-image:linear-gradient(180deg,transparent,#000_14%)]`} />
            </div>
            {car && (
              <div className="absolute bottom-[2px] right-[12vw] w-[25vw] max-w-[460px]">
                <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 25vw, 1px" />
              </div>
            )}
          </div>

          <div className="relative max-w-[760px] lg:max-w-[calc(54vw_-_56px)] xl:max-w-[calc(54vw_-_max(48px,50vw_-_752px)_-_16px)]">
            <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">Replacement Costs</p>
            <h2 className={`${H2_MODEL} mt-3.5 text-lr-head md:mt-4 xl:text-[44px]!`}>
              {lead}
              {accent && (
                <>
                  {"\u00a0"}-<br />
                  {words.length > 0 && `${words.join(" ")} `}
                  <span className="text-lr-ink dark:text-lr-green">{last}</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-[34em] text-[15px] leading-[1.6] text-lr-body md:mt-4 md:text-[16px] xl:text-[17px]">
              Real UK pricing for used, reconditioned and rebuilt engines -<br className="hidden lg:block" /> supply only, with labour guidance.
            </p>
          </div>
        </div>

        {/* phones / tablets: the hillside with the car, full-bleed */}
        {car && (
          <div className="relative -mx-5 mt-6 aspect-[2/1] sm:-mx-6 sm:aspect-[5/2] md:-mx-10 md:aspect-[3/1] lg:hidden" aria-hidden="true">
            <div className={`absolute inset-0 bg-cover bg-[center_70%] ${BG} brightness-[1.05] contrast-[.92] hue-rotate-[14deg] saturate-[.78] dark:filter-none [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_80%,transparent)]`} />
            <div className="absolute bottom-[8%] left-1/2 w-[56%] max-w-[400px] -translate-x-1/2 sm:w-[44%] md:w-[34%]">
              <GroundedCar src={car} sceneByTheme sizes="(max-width: 640px) 56vw, 400px" />
            </div>
          </div>
        )}

        {/* phones / tablets: one card per variant */}
        <ul className={`relative grid gap-3 md:grid-cols-2 md:gap-4 xl:hidden ${car ? "-mt-6 sm:-mt-8 lg:mt-0" : "mt-6"}`}>
          {rows.map((r, i) => (
            <li key={`${r.variant}-${i}`} className="min-w-0 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className={`text-[18px] font-semibold leading-snug text-lr-head ${LINKS}`} dangerouslySetInnerHTML={{ __html: html(r.variant) }} />
                {r.labourHours && (
                  <span className="flex shrink-0 items-center gap-1.5 text-[13px] text-lr-muted">
                    <HeadIcon index={5} className="h-4 w-4" />
                    {r.labourHours}
                  </span>
                )}
              </div>
              {r.engineCode && <p className={`mt-0.5 text-[14px] text-lr-body ${LINKS}`} dangerouslySetInnerHTML={{ __html: html(r.engineCode) }} />}
              <dl className="mt-3.5 grid grid-cols-3 gap-2 border-t border-lr-line pt-3.5">
                {[2, 3, 4].map((k) => (
                  <div key={k} className="min-w-0">
                    <dt className="text-[12px] leading-snug text-lr-muted">{columns[k].replace(/\s*\(Supply\)/i, "")}</dt>
                    <dd className="mt-0.5 whitespace-nowrap text-[13px] font-semibold leading-snug tracking-[-0.01em] text-lr-head min-[400px]:text-[14px]" dangerouslySetInnerHTML={{ __html: html(r[KEYS[k]]) || "-" }} />
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        {/* laptops: the table, on the hillside's foot */}
        <div className="relative hidden overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_28px_70px_-44px_var(--lr-shadow)] xl:block dark:bg-lr-card/85 dark:backdrop-blur-sm">
          <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">{prose(data.h2 || "")}</caption>
            <colgroup>
              {WIDTHS.map((w, i) => (
                <col key={i} style={{ width: `${w}%` }} />
              ))}
            </colgroup>
            <thead className="border-b border-lr-line">
              <tr>
                {columns.map((c, i) => (
                  <th key={c} scope="col" className="border-r border-lr-line px-4 py-5 align-middle last:border-r-0 min-[1440px]:px-6">
                    <span className={`flex items-center gap-3 text-[13px] font-semibold uppercase leading-snug tracking-[0.02em] text-lr-ink min-[1440px]:text-[14.5px] dark:text-lr-green ${i >= 2 ? "justify-center" : ""}`}>
                      <HeadIcon index={i} />
                      {c}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={`${r.variant}-${ri}`} className="border-t border-lr-line transition-colors first:border-t-0 hover:bg-lr-panel/50">
                  {KEYS.map((k, i) => (
                    <td
                      key={k}
                      className={`border-r border-lr-line px-4 py-3.5 align-middle leading-snug last:border-r-0 min-[1440px]:px-6 ${
                        i === 0 ? "text-[17px] font-semibold text-lr-head min-[1440px]:text-[18px]" : i === 1 ? "text-[15px] text-lr-body min-[1440px]:text-[16px]" : "text-center text-[16px] text-lr-head min-[1440px]:text-[17px]"
                      } ${LINKS}`}
                      dangerouslySetInnerHTML={{ __html: html(r[k]) || "-" }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.note && (
          <p className="mt-3 text-[13px] leading-[1.55] text-lr-muted md:text-[14px]">
            <strong className="font-semibold text-lr-body">Data note: </strong>
            <span dangerouslySetInnerHTML={{ __html: html(data.note) }} />
          </p>
        )}

        <TrustStrip className="mt-5 md:mt-6" />

        <SectionQuoteCta label={cta.costsButton} supportText={cta.costsSupport} />
      </div>
    </section>
  );
}
