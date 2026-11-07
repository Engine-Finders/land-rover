import Image from "next/image";
import Link from "next/link";
import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, LABEL } from "@/lib/typeScale";
import { BAND_PAGE, CARD, EyebrowPill, SANS, SECTION_Y, SectionTitle, TABLE_HEAD, prose, splitHeading, INTRO } from "@/components/models/modelKit";
import { cellHtml, engineFamilies, eraCar, heroEnquiries, keyEngines, stripHtml, yearSpan } from "@/components/models/engineSections";

// Model page section 9 — how the model's engine range evolved, built to the approved Velar
// reference: the eyebrow and "How the … Engine Range Evolved — 2017 to Today" headline with a
// four-stat card (all derived from the page data), then the era table: the era with the
// generation's car, its years, the key engines as photos with their codes (linked to the engine
// pages that exist), why Land Rover changed, and what's worth knowing. Below xl the table becomes
// one card per era. Engine photos: public/model/engines (scripts/build-engine-evolution-art.py).

const DEFAULT_COLUMNS = ["Era", "Years", "Key Engines", "Why Land Rover Changed", "Worth Knowing"];
const LINKS = "[&_a]:font-[inherit] [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline";

function InfoIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.4" />
      <path d="M12 10.8v5.6M12 7.4h.01" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

// one key engine: its photo with the code (and variant) underneath, linked when it has a page
function EngineTile({ engine, imageClass, codeClass, subClass, sizes }) {
  const body = (
    <>
      <span className={`relative block aspect-[17/15] w-full dark:bg-[radial-gradient(closest-side,rgba(255,255,255,0.13),transparent)] ${imageClass}`}>
        <Image
          src={engine.shot}
          alt=""
          fill
          sizes={sizes}
          className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)]"
        />
      </span>
      <span className={`mt-1.5 block font-semibold leading-tight text-lr-head ${codeClass}`}>{engine.code}</span>
      {engine.sub && <span className={`block leading-tight text-lr-muted ${subClass}`}>{engine.sub}</span>}
    </>
  );
  if (!engine.href) return <span className="flex flex-col items-center text-center">{body}</span>;
  return (
    <Link href={engine.href} className="group flex flex-col items-center text-center no-underline">
      {body}
      <span className="sr-only">: engine guide</span>
    </Link>
  );
}

// "Launch era" + its tagline ("original line-up") and note ("The Velar arrives") when the page has them
const noBreakHyphen = (html = "") => String(html).replace(/(\w)-(\w)/g, "$1\u2011$2");

function EraTitle({ era, as: Tag = "span", className = "", taglineClass = "" }) {
  return (
    <>
      <Tag className={`block font-[family-name:var(--font-serif-display)] leading-tight text-lr-ink dark:text-lr-green ${className}`}>
        <span dangerouslySetInnerHTML={{ __html: cellHtml(era.era) }} />
        {era.tagline && (
          <>
            {" "}—<br />
            <span className={taglineClass} dangerouslySetInnerHTML={{ __html: noBreakHyphen(cellHtml(era.tagline)) }} />
          </>
        )}
      </Tag>
      {era.note && <span className="mt-1.5 block text-[14px] font-normal leading-snug text-lr-body md:text-[15px]" dangerouslySetInnerHTML={{ __html: cellHtml(era.note) }} />}
    </>
  );
}

// the data-source note along the foot, from the page's own enquiry figure
function DataNote({ enquiries }) {
  if (!enquiries) return null;
  const what = enquiries.label.replace(/Enquiries/i, "enquiries");
  return (
    <div className={`${CARD} mt-5 flex items-start gap-4 p-4 sm:items-center sm:p-5 md:mt-6 xl:px-7`}>
      <LrIcon name="oem-references" tone="current" className="mt-0.5 h-7 w-7 shrink-0 text-lr-ink sm:mt-0 md:h-9 md:w-9 dark:text-lr-green" />
      <p className="text-[14.5px] leading-[1.6] text-lr-body md:text-[15px] xl:text-[16px]">
        All engine reliability insights and failure patterns are based on {enquiries.value} verified {what}.
        <span className="sm:block">
          {" "}Data covers the UK market. <span className="whitespace-nowrap font-medium text-lr-green">[EM-VERIFIED]</span>
        </span>
      </p>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <li className="flex min-w-0 flex-col items-center border-lr-line px-3 py-5 text-center md:px-4 xl:py-6">
      <LrIcon name={icon} tone="current" className="h-8 w-8 text-lr-ink md:h-9 md:w-9 xl:h-10 xl:w-10 dark:text-lr-green" />
      <p className="mt-3 text-[15px] font-semibold leading-snug text-lr-head md:text-[16px]">{value}</p>
      <p className="mt-1 text-[13px] leading-snug text-lr-body md:text-[14px] xl:text-[15px]">{label}</p>
    </li>
  );
}

export default function EngineEvolution({ data, slug = "", page = null }) {
  if (!data?.eras?.length) return null;

  const cols = data.columns?.length === 5 ? data.columns : DEFAULT_COLUMNS;
  const eras = data.eras.map((e) => ({ ...e, engines: keyEngines(e.keyEngines), car: eraCar(e.era, e.years, slug, page) }));

  // stats, only from the page data
  const accent = splitHeading(data.h2).accent;
  const first = yearSpan(eras[0].years)?.[0];
  const last = eras.at(-1);
  const lastSpan = yearSpan(last.years);
  const spanText = /^\d{4}\s+to\s+(\d{4}|today)$/i.test(accent)
    ? accent
    : first
      ? `${first} to ${/present|today|→/i.test(last.years) ? "Today" : lastSpan?.[1] || ""}`
      : "";
  const families = engineFamilies(page?.engineDatabase?.engines || []);
  const codes = page?.engineDatabase?.engines?.length || 0;
  const enquiries = heroEnquiries(page);
  const stats = [
    { icon: "real-data", value: `${eras.length} Engine Era${eras.length === 1 ? "" : "s"}`, label: spanText },
    families.count > 0 && { icon: "drivetrain-failures", value: `${families.count} Engine Families`, label: families.mix },
    codes > 0 && { icon: "trend", value: `${codes} Engine Codes`, label: "Tracked in our database" },
    enquiries && { icon: "users", value: enquiries.value, label: enquiries.label },
  ].filter(Boolean);

  return (
    <section className={`${BAND_PAGE} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid gap-6 md:gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-center xl:gap-10">
          <div className="min-w-0">
            <EyebrowPill>Engine Evolution</EyebrowPill>
            <SectionTitle h2={data.h2} breakAfterDash={false} className="mt-3 md:mt-4" />
            {data.subHeadline && (
              <p className={INTRO} dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }} />
            )}
          </div>
          {stats.length > 0 && (
            <ul className={`${CARD} grid grid-cols-2 divide-lr-line max-md:[&>li:nth-child(n+3)]:border-t max-md:[&>li:nth-child(even)]:border-l md:grid-cols-4 md:divide-x`}>
              {stats.map((s) => (
                <Stat key={s.icon} {...s} />
              ))}
            </ul>
          )}
        </div>

        {/* xl: the era table */}
        <div className={`${CARD} mt-8 hidden overflow-hidden xl:mt-10 xl:block`}>
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">{stripHtml(cellHtml(data.h2))}</caption>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "9.5%" }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "19.5%" }} />
            </colgroup>
            <thead className={TABLE_HEAD}>
              <tr>
                {cols.map((c, i) => (
                  <th key={c} scope="col" className={`px-5 py-4 text-[16px] font-semibold ${i === 1 || i === 2 ? "text-center" : ""}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {eras.map((e) => (
                <tr key={`${e.era}-${e.years}`} className="border-t border-lr-line first:border-t-0">
                  <th scope="row" className="border-r border-lr-line px-5 py-4 align-top font-normal">
                    <EraTitle era={e} className="text-[20px] 2xl:text-[21px]" />
                    {e.car && (
                      <span className="mt-2 block w-full max-w-[150px] 2xl:max-w-[168px]">
                        <GroundedCar src={e.car} studio sizes="(min-width: 1280px) 170px, 1px" />
                      </span>
                    )}
                  </th>
                  <td className="border-r border-lr-line px-3 py-4 text-center align-middle text-[16px] font-semibold text-lr-head">{e.years}</td>
                  <td className="border-r border-lr-line px-4 py-4 align-middle">
                    {e.engines.length ? (
                      <ul className="flex flex-wrap justify-center gap-y-4">
                        {e.engines.map((en, i) => (
                          <li key={`${en.code}-${i}`} className={`w-1/4 min-w-0 px-2 ${i % 4 ? "border-l border-lr-line" : ""}`}>
                            <EngineTile engine={en} imageClass="max-w-[92px] mx-auto 2xl:max-w-[100px]" codeClass="text-[15px]" subClass="mt-0.5 text-[14px]" sizes="100px" />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-[15px] text-lr-muted">—</p>
                    )}
                  </td>
                  <td className={`border-r border-lr-line px-5 py-4 align-middle text-[15px] leading-[1.6] text-lr-body ${LINKS}`} dangerouslySetInnerHTML={{ __html: cellHtml(e.whyBmwChanged) }} />
                  <td className="px-5 py-4 align-middle">
                    <p className={`flex gap-3.5 text-[15px] leading-[1.6] text-lr-body ${LINKS}`}>
                      <InfoIcon className="mt-0.5 h-7 w-7 text-lr-ink dark:text-lr-green" />
                      <span dangerouslySetInnerHTML={{ __html: cellHtml(e.worthKnowing) }} />
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* phones to laptops: one card per era */}
        <ol className="mt-7 grid gap-4 md:mt-9 md:gap-5 xl:hidden">
          {eras.map((e) => (
            <li key={`${e.era}-${e.years}`} className={`${CARD} min-w-0 overflow-hidden md:grid md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]`}>
              <div className="flex items-start gap-3 p-4 pb-1 md:block md:border-r md:border-lr-line md:p-6">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-lr-chip px-3 py-1 text-[13px] font-semibold leading-tight text-lr-ink md:text-[14px] dark:text-lr-green">{e.years}</span>
                  <EraTitle era={e} as="h3" className="mt-2.5 text-[21px] md:text-[24px]" taglineClass="text-[17px] min-[400px]:text-[18px] md:text-[24px]" />
                </div>
                {e.car && (
                  <span className="block w-[42%] max-w-[200px] shrink-0 pt-1 md:mt-4 md:w-full md:max-w-[240px] md:pt-0">
                    <GroundedCar src={e.car} studio sizes="(min-width: 768px) 240px, 42vw" />
                  </span>
                )}
              </div>
              <div className="min-w-0 p-4 pt-3 md:p-6">
                <p className={`${LABEL} text-lr-muted`}>{cols[2]}</p>
                {e.engines.length ? (
                  <ul className="mt-2.5 grid grid-cols-4 gap-1.5 sm:gap-2">
                    {e.engines.map((en, i) => (
                      <li key={`${en.code}-${i}`} className="min-w-0 rounded-xl border border-lr-line bg-lr-panel/50 px-1 pb-2 pt-1.5 sm:px-2 sm:pb-2.5 sm:pt-2">
                        <EngineTile engine={en} imageClass="max-w-[120px] mx-auto" codeClass="text-[12.5px] sm:text-[14px] md:text-[15px]" subClass="mt-0.5 text-[11.5px] sm:text-[13px]" sizes="(min-width: 640px) 120px, 22vw" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[15px] text-lr-muted">—</p>
                )}
                <p className={`${LABEL} mt-5 text-lr-muted`}>{cols[3]}</p>
                <p className={`mt-1.5 text-[15px] leading-[1.6] text-lr-body md:text-[16px] ${LINKS}`} dangerouslySetInnerHTML={{ __html: cellHtml(e.whyBmwChanged) }} />
                <div className="mt-4 flex gap-3 rounded-xl bg-lr-chip/70 p-3.5 md:p-4">
                  <InfoIcon className="mt-0.5 h-6 w-6 text-lr-ink dark:text-lr-green" />
                  <p className={`text-[15px] leading-[1.6] text-lr-body md:text-[16px] ${LINKS}`}>
                    <strong className="font-semibold text-lr-head">{cols[4]}: </strong>
                    <span dangerouslySetInnerHTML={{ __html: cellHtml(e.worthKnowing) }} />
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <DataNote enquiries={enquiries} />
      </div>
    </section>
  );
}
