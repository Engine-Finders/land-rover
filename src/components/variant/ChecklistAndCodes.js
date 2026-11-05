import Link from "next/link";
import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import Tagged from "@/components/variant/Tagged";
import VIcon from "@/components/variant/VariantIcons";
import { stripArrow, stripBullet, topicIcon } from "@/components/variant/variantText";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H2, H5, H6, ICON_SM, ICON_XL } from "@/lib/typeScale";

// Variant sections 5 + 6, built to the approved reference as one two-column band:
//  left  - Buying Checklist (serif caps title, intro, eight numbered check cards), then Engine Codes
//          (title, match note linking to the Era Map, the codes table);
//  right - the variant's car on a studio floor, the "Buy smart" card over its foot, Technical Specs
//          and the brand-green compare card with the engine.
// Phones / tablets run it as one column in reading order (title, car, checks, buy smart, codes, specs,
// compare) - the car and buy-smart card render once per layout, and the hidden copy never loads.
// Copy from the page's `buyingChecklist` and `engineCodes` JSON. Follows the site theme.

const SERIF = "font-[family-name:var(--font-serif-display)]";
const SANS = "font-[family-name:var(--font-instrument-sans)]";
const LABEL = "text-[13px] font-semibold uppercase tracking-[0.08em] text-lr-gold md:text-[14px] xl:text-[15px]";
const TITLE = `${H2} text-lr-head`;
const CARD = "rounded-lg border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)]";
const dash = (t = "") => String(t).replace(/ - /g, " — ");

// studio backdrop: concrete wall with window light from the right, a floor with a soft horizon
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const STUDIO = {
  background: [
    "radial-gradient(ellipse 50% 58% at 86% 24%, var(--studio-light) 0%, transparent 64%)",
    "linear-gradient(90deg, transparent 0 62%, var(--studio-pillar) 62% 63.2%, transparent 63.2% 100%)",
    "linear-gradient(180deg, transparent 0%, transparent 64%, var(--studio-horizon) 67.5%, var(--studio-floor) 74%, var(--studio-floor-2) 100%)",
    "linear-gradient(180deg, var(--studio-wall) 0%, var(--studio-wall-2) 66%)",
  ].join(", "),
};
const STUDIO_VARS =
  "[--studio-wall:#d6d3cc] [--studio-wall-2:#c9c6be] [--studio-pillar:rgba(0,0,0,0.035)] [--studio-horizon:#b9b5ac] [--studio-floor:#cfccc5] [--studio-floor-2:#e2e0db] [--studio-light:rgba(255,255,255,0.62)] dark:[--studio-wall:#2a3833] dark:[--studio-wall-2:#212d29] dark:[--studio-pillar:rgba(0,0,0,0.12)] dark:[--studio-horizon:#141d1a] dark:[--studio-floor:#24302c] dark:[--studio-floor-2:#1a2521] dark:[--studio-light:rgba(255,255,255,0.09)]";

/* ---------- checklist icons (brand set) ---------- */
function checkIcon(label = "") {
  const t = label.toLowerCase();
  if (/cold start|listen|noise|rattle|knock/.test(t)) return "starting-and-charging";
  if (/mot/.test(t)) return "oem-references";
  if (/service|history|record|warranty status/.test(t)) return "symptoms";
  if (/coolant|cooling|water pump|temperature/.test(t)) return "cooling-system-2";
  if (/turbo|supercharg|boost/.test(t)) return "turbo";
  if (/oil|dipstick/.test(t)) return "oil-leaks";
  if (/smoke|exhaust/.test(t)) return "exhaust-and-emission";
  if (/warning light|engine light|diagnos|fault/.test(t)) return "engine";
  return topicIcon(label);
}
function CheckIcon({ label }) {
  return <LrIcon name={checkIcon(label)} tone="current" className={`${ICON_XL} text-lr-head dark:text-lr-green`} />;
}

// "* 2. Cold Start - Listen for ..." -> { label: "Cold Start", text: "Listen for ..." }
function splitItem(item = "") {
  const clean = stripBullet(item).replace(/^\d+\.\s*/, "");
  const i = clean.search(/\s[-–—:]\s/);
  return i === -1 ? { label: clean, text: "" } : { label: clean.slice(0, i).trim(), text: clean.slice(i + 3).trim() };
}

function VerdictShield({ id, className = "" }) {
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="[stop-color:#e3e7e2] dark:[stop-color:#e7c98d]" />
          <stop offset="1" className="[stop-color:#8d958f] dark:[stop-color:#a7843f]" />
        </linearGradient>
        <linearGradient id={`${id}-field`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "#1f7049" }} />
          <stop offset="1" style={{ stopColor: "#0f3d27" }} />
        </linearGradient>
      </defs>
      <path d="M32 2 60 12v20c0 18-12 30-28 38C16 62 4 50 4 32V12z" fill={`url(#${id}-rim)`} />
      <path d="M32 7.5 55 15.8v16.4c0 15-10 25.2-23 31.8C19 57.4 9 47.2 9 32.2V15.8z" fill={`url(#${id}-field)`} />
      <path d="m20.5 35 8.5 8.5 15.5-17" fill="none" className="stroke-white dark:stroke-[#e7c98d]" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StudioCar({ car, className = "", sizes }) {
  return (
    <div className={`relative ${STUDIO_VARS} ${className}`} aria-hidden="true">
      <div className="absolute inset-0" style={STUDIO} />
      <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply dark:opacity-[0.25] dark:mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="absolute bottom-[10%] left-1/2 w-[80%] max-w-[600px] -translate-x-1/2">
        <GroundedCar src={car} studio sizes={sizes} />
      </div>
    </div>
  );
}

function BuySmart({ id, engineName, className = "" }) {
  return (
    <div className={`${CARD} flex items-center gap-4 p-4 md:gap-6 md:p-6 ${className}`}>
      <VerdictShield id={id} className="h-[70px] w-[62px] shrink-0 drop-shadow-[0_8px_10px_rgba(0,0,0,0.25)] md:h-[96px] md:w-[86px]" />
      <div className="min-w-0">
        <h3 className={`${H5} text-lr-head`}>Buy smart. Drive with confidence.</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-lr-body md:text-[15px] xl:text-[16px]">
          A few checks today can save thousands tomorrow. Use this checklist to avoid the most common {engineName ? `${engineName} ` : ""}pitfalls.
        </p>
      </div>
    </div>
  );
}

/* ---------- engine codes ---------- */
const DEFAULT_COLUMNS = ["Engine Code", "Years", "Power", "2025 Enquiries", "Avg. Recon Cost"];
// "107 bhp @ 4,000rpm" -> "107 bhp" / "@ 4,000rpm"; "- (pattern data)" -> "—" / "(pattern data)"
function TwoLine({ value = "" }) {
  const v = String(value || "—").trim();
  let m = v.match(/^(.*?)\s+(@.*)$/);
  if (m) return <><span className="block">{m[1]}</span><span className="block">{m[2]}</span></>;
  m = v.match(/^[-–—]\s*(\(.*\))$/);
  if (m) return <><span className="block">—</span><span className="block">{m[1]}</span></>;
  return <Tagged value={v} />;
}
function Cost({ value = "" }) {
  const m = String(value || "—").match(/^(.*?)\s*(\[[^\]]+\])\s*$/);
  return m ? (
    <>
      <span className="block whitespace-nowrap">{m[1]}</span>
      <span className="mt-0.5 block text-[13px] text-lr-ink dark:text-lr-green xl:text-[15px]">{m[2]}</span>
    </>
  ) : (
    <span className="whitespace-nowrap">{value || "—"}</span>
  );
}
function specIcon(label = "") {
  const t = label.toLowerCase();
  if (/displacement|capacity/.test(t)) return "engine";
  if (/cylinder/.test(t)) return "ingenium";
  if (/compression/.test(t)) return "meter";
  if (/fuel|injection/.test(t)) return "petrol";
  if (/turbo|torque|power|output/.test(t)) return "turbo";
  if (/valve|timing|cam/.test(t)) return "timing-chain";
  if (/electric|motor|hybrid/.test(t)) return "ev";
  if (/battery/.test(t)) return "starting-and-charging";
  return "note";
}

function CodesTable({ codes, engine }) {
  const rows = codes.rows || [];
  const columns = codes.columns?.length === 5 ? codes.columns : DEFAULT_COLUMNS;
  if (!rows.length) return null;
  return (
    <>
      {/* phones: one card per engine code */}
      <ul className="mt-5 space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.engineCode} className={`${CARD} overflow-hidden`}>
            <div className="flex items-center gap-3 bg-lr-brand px-3.5 py-3 text-lr-on-brand">
              <span className="relative h-12 w-12 shrink-0 rounded-md bg-white/90 p-1 dark:bg-white/10">
                <Image src={engine} alt="" fill sizes="48px" className="object-contain p-0.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: dash(r.engineCode) }} />
                <p className="mt-0.5 text-[13.5px] text-lr-on-brand/85 xl:text-[15px]">{r.years}</p>
              </div>
            </div>
            <dl className="grid grid-cols-3 text-center">
              {[[columns[2], <TwoLine key="p" value={r.power} />], [columns[3], <TwoLine key="e" value={r.enquiries} />], [columns[4], <Cost key="c" value={r.avgReconCost} />]].map(([k, val], i) => (
                <div key={k} className={`px-2 py-3 ${i ? "border-l border-lr-line" : ""}`}>
                  <dt className="text-[11px] font-semibold uppercase leading-tight tracking-[0.05em] text-lr-muted xl:text-[15px]">{k}</dt>
                  <dd className="mt-1.5 text-[14px] font-medium leading-snug text-lr-head xl:text-[16px]">{val}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* tablet / desktop: table */}
      <div className={`${CARD} mt-6 hidden overflow-hidden md:block`}>
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[12%]" /><col className="w-[22%]" /><col className="w-[14%]" /><col className="w-[15%]" /><col className="w-[18%]" /><col className="w-[19%]" />
          </colgroup>
          <thead>
            <tr className="bg-lr-brand text-[13.5px] font-semibold text-lr-on-brand xl:text-[15px]">
              <th scope="col" className="px-3 py-3.5 font-semibold"><span className="sr-only">Engine</span></th>
              {columns.map((h, i) => (
                <th key={h} scope="col" className={`border-l border-lr-on-brand/15 px-3 py-3.5 font-semibold leading-snug xl:whitespace-nowrap ${i === 0 ? "text-left" : "text-center"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[14.5px] xl:text-[15.5px]">
            {rows.map((r, i) => (
              <tr key={r.engineCode} className="border-t border-lr-line">
                {i === 0 && (
                  <td rowSpan={rows.length} className="px-3 py-4 align-middle">
                    <span className="relative mx-auto block aspect-square w-full max-w-[96px]">
                      <Image src={engine} alt="" fill sizes="96px" className="object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.25)]" />
                    </span>
                  </td>
                )}
                <td className="border-l border-lr-line px-4 py-5 leading-snug text-lr-ink dark:text-lr-green" dangerouslySetInnerHTML={{ __html: dash(r.engineCode) }} />
                <td className="whitespace-nowrap border-l border-lr-line px-3 py-5 text-center text-lr-head">{r.years}</td>
                <td className="border-l border-lr-line px-3 py-5 text-center leading-snug text-lr-head"><TwoLine value={r.power} /></td>
                <td className="border-l border-lr-line px-3 py-5 text-center leading-snug text-lr-body"><TwoLine value={r.enquiries} /></td>
                <td className="border-l border-lr-line px-3 py-5 text-center leading-snug text-lr-head"><Cost value={r.avgReconCost} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Specs({ specs, specTag }) {
  if (!specs?.items?.length) return null;
  const title = (specs.title || "Technical Specs").replace(/\s*\([^)]*\)\s*:?\s*$/, "").replace(/:$/, "");
  return (
    <div className={`${CARD} px-4 pb-2 pt-4 md:px-6 md:pt-5`}>
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-lr-line pb-3">
        <h3 className={`${H5} text-lr-head`}>{title}</h3>
        {specTag && <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-lr-ink dark:text-lr-green md:text-[13px] xl:text-[15px]">{specTag}</p>}
      </div>
      <dl className="divide-y divide-lr-line">
        {specs.items.map((s) => {
          const label = stripBullet(s.label);
          return (
            <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] text-[14px] min-[400px]:text-[14.5px] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] xl:text-[15px]">
              <dt className="flex min-w-0 items-center gap-2.5 py-2.5 pr-2 text-lr-head [overflow-wrap:anywhere] md:gap-4 md:pr-3">
                <LrIcon name={specIcon(label)} tone="current" className={`${ICON_SM} text-lr-head dark:text-lr-green`} />
                {label}
              </dt>
              <dd className="border-l border-lr-line py-2.5 pl-4 leading-snug text-lr-head" dangerouslySetInnerHTML={{ __html: s.value }} />
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function CompareCard({ cta, engine }) {
  if (!cta?.label) return null;
  return (
    <Link href="/quote" className="group relative isolate flex min-h-[124px] items-center gap-4 overflow-hidden rounded-lg bg-lr-brand px-5 py-5 text-lr-on-brand no-underline shadow-[0_18px_40px_-22px_var(--lr-shadow)] md:gap-5 md:px-7 dark:bg-[#123d2a]">
      <span className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[48%] max-w-[320px] [mask-image:linear-gradient(to_right,transparent,#000_45%)]" aria-hidden="true">
        <Image src={engine} alt="" fill sizes="320px" className="object-cover object-left opacity-55" />
      </span>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-gold-line text-lr-gold-line transition-colors group-hover:bg-lr-gold-line/10 md:h-[58px] md:w-[58px]">
        <VIcon name="arrow" className="h-6 w-6 transition-transform group-hover:translate-x-0.5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 max-w-[74%] sm:max-w-[68%]">
        <span className={`${H5} block`}>{stripArrow(cta.label)}</span>
        <span className={`${SANS} mt-1.5 block text-[14px] font-normal leading-snug text-lr-on-brand/90 md:text-[15px]`}>Get quotes from trusted UK specialists in minutes.</span>
      </span>
    </Link>
  );
}

export default function ChecklistAndCodes({ checklist, codes, car = null, engine = "/variant/sec10_engine.webp", variantName = "" }) {
  const items = checklist?.items || [];
  if (!items.length && !codes) return null;
  const engineName = (codes?.technicalSpecs?.title || "").match(/\(([^)]+)\)/)?.[1] || "";
  const specTag = variantName ? `${variantName.replace(/^Land Rover\s+/, "")} Spec` : engineName ? `${engineName} Spec` : "";
  const note = dash(codes?.matchNote || "").replace(/(Section\s+\w+['’]s\s+)?Era Map/, (m) => `<a href="#era-map" class="text-lr-ink no-underline hover:underline dark:text-lr-green">${m}</a>`);

  return (
    <section className={`relative overflow-hidden bg-lr-page text-lr-head ${SANS}`}>
      {/* desktop: the studio spans the top right of the band and feathers into the page */}
      {car && (
        <div className={`pointer-events-none absolute right-0 top-0 hidden h-[620px] w-[46%] lg:block ${STUDIO_VARS} [mask-image:linear-gradient(to_right,transparent,#000_14%),linear-gradient(to_bottom,#000_86%,transparent)] [mask-composite:intersect]`} aria-hidden="true">
          <div className="absolute inset-0" style={STUDIO} />
          <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply dark:opacity-[0.25] dark:mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
        </div>
      )}

      <div className={`relative ${CONTAINER} grid gap-x-10 pb-10 pt-9 md:pb-14 md:pt-12 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] xl:gap-x-12`}>
        {/* ---------------- left column (and phones' reading order) ---------------- */}
        <div className="min-w-0">
          {items.length > 0 && (
            <>
              <p className={LABEL}>Before You Buy</p>
              <h2 className={`${TITLE} mt-3`}>Buying Checklist</h2>
              {checklist.intro && <p className="mt-3 max-w-[34em] text-[15px] leading-relaxed text-lr-body md:text-[16px] xl:text-[17px]" dangerouslySetInnerHTML={{ __html: dash(checklist.intro) }} />}

              {/* phones / tablets: the car on the studio floor */}
              {car && <StudioCar car={car} className="-mx-4 mt-5 aspect-[4/3] sm:aspect-[16/9] md:-mx-8 lg:hidden" sizes="(min-width: 640px) 600px, 80vw" />}

              <ol className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3 lg:mt-6">
                {items.map((item, i) => {
                  const { label, text } = splitItem(item);
                  return (
                    <li key={item} className={`${CARD} relative flex flex-col items-center px-3 pb-4 pt-9 text-center md:px-3.5`}>
                      <span className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-[4px] bg-lr-brand text-[13px] font-semibold text-lr-on-brand md:h-7 md:w-7 md:text-[14px] xl:text-[15px]">{i + 1}</span>
                      <CheckIcon label={label} />
                      <h3 className={`${H6} mt-2.5 text-lr-head`} dangerouslySetInnerHTML={{ __html: label }} />
                      {text && <p className="mt-1.5 text-[13px] leading-[1.5] text-lr-body md:text-[13.5px] lg:text-[13px] xl:text-[15px]" dangerouslySetInnerHTML={{ __html: dash(text) }} />}
                    </li>
                  );
                })}
              </ol>

              <BuySmart id="cc-m" engineName={engineName} className="mt-4 lg:hidden" />
            </>
          )}

          {codes && (
            <div className={items.length ? "mt-10 border-t border-lr-line pt-8 md:mt-12 md:pt-10" : ""}>
              <p className={LABEL}>Engine Reference</p>
              <h2 className={`${TITLE} mt-3`}>Engine Codes</h2>
              {note && <p className="mt-3 text-[15px] leading-relaxed text-lr-body md:text-[16px] xl:text-[17px]" dangerouslySetInnerHTML={{ __html: note }} />}
              <CodesTable codes={codes} engine={engine} />
            </div>
          )}
        </div>

        {/* ---------------- right column ---------------- */}
        <div className="mt-4 flex min-w-0 flex-col gap-4 lg:mt-0">
          {car && items.length > 0 && (
            <div className="relative hidden lg:block">
              <div className="relative aspect-[16/11] w-full" aria-hidden="true">
                <div className="absolute bottom-[4%] left-1/2 w-[94%] max-w-[600px] -translate-x-1/2">
                  <GroundedCar src={car} studio sizes="(min-width: 1024px) 40vw, 1px" />
                </div>
              </div>
              <BuySmart id="cc-d" engineName={engineName} className="relative -mt-6" />
            </div>
          )}
          {codes && <Specs specs={codes.technicalSpecs} specTag={specTag} />}
          {codes && <CompareCard cta={codes.cta} engine={engine} />}
        </div>
      </div>
    </section>
  );
}
