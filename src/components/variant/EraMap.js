import Image from "next/image";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H2, ICON_LG, ICON_MD } from "@/lib/typeScale";

// Variant section: era map, built to the approved reference - a bold sans title with a short green
// rule, the source note on the right, then one row per generation (years, engine code, reliability,
// recon cost, era note) from the page's `eraMap` JSON. The generation sits on a green angled panel
// with the variant's car; ratings show as large stars with their source tag underneath, costs in bold
// green. A five-point "why use this era map?" strip closes the section. Phones get one card per
// generation with every value in view (no accordion). Follows the site theme; `band` picks the page or
// the alternate section background. `car` is the variant's own cutout (null when none exists).

const SANS = "font-[family-name:var(--font-instrument-sans)]";
const DESKTOP_COLS = "grid-cols-[1.5fr_0.9fr_0.95fr_1.15fr_1.1fr_1.4fr]";
const DEFAULT_SOURCE =
  "This table is the single source every other section on this page matches — Sections 2, 4 and 6 reference it rather than restating conflicting figures.";
const WHY =
  "Every cost guide, reliability rating and engine code on this page is aligned to the data above. This keeps everything consistent and trustworthy.";

// £ in a circle (the brand set's currency icon is a euro)
const POINTS = [
  { icon: "honest-repair-vs-replace", title: "Real UK Cost Data", text: "Live market pricing from UK specialists." },
  { icon: "genuine-failure-data", title: "Verified Reliability", text: "Ratings based on real engine data and specialist feedback." },
  { icon: "users", title: "Expert Insights", text: "Guidance from 12 vetted Land Rover engine specialists." },
  { icon: "gearbox-problem", title: "Updated for 2025", text: "All data reviewed and updated for the UK market." },
];

const dash = (t = "") => String(t).replace(/ - /g, " — ");
// "★★★★½ [NEWLY ASSIGNED - see Data Note]" -> { main, tag: "[NEWLY ASSIGNED — see Data Note]" }
function splitTag(value = "") {
  const m = String(value).match(/^(.*?)\s*(\[[^\]]+\])\s*$/);
  return m ? { main: m[1].trim(), tag: dash(m[2]) } : { main: String(value), tag: "" };
}
const colLabel = (c) => (c === "Recon Cost" ? "Recon Cost (Guide)" : c);

function GenerationPanel({ generation, car }) {
  return (
    <div className={`relative h-full overflow-hidden min-h-[150px] xl:min-h-[164px]`}>
      <span className="absolute inset-y-0 left-0 w-[88%] bg-lr-brand" style={{ clipPath: "polygon(0 0, 100% 0, 72% 100%, 0 100%)" }} aria-hidden="true" />
      <p className={`relative max-w-[70%] px-3.5 pt-3 font-semibold leading-snug text-lr-on-brand text-[15px] lg:text-[16px] xl:text-[17px]`} dangerouslySetInnerHTML={{ __html: generation }} />
      {car && (
        <div className={`absolute bottom-2 left-2.5 h-[64px] w-[74%] xl:h-[74px]`}>
          <Image src={car} alt="" fill className="object-contain object-left-bottom drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]" sizes="200px" />
        </div>
      )}
    </div>
  );
}

function Rating({ value, big = false }) {
  const { main, tag } = splitTag(value);
  return (
    <span className="flex flex-col items-center text-center">
      <span className={`leading-none tracking-[0.08em] text-lr-head ${big ? "text-[22px] lg:text-[24px] xl:text-[26px]" : "text-[18px]"}`} dangerouslySetInnerHTML={{ __html: main }} />
      {tag && <span className={`mt-1.5 text-lr-body ${big ? "text-[13px] leading-snug xl:text-[15px]" : "text-[12px] leading-snug xl:text-[15px]"}`}>{tag}</span>}
    </span>
  );
}
function Cost({ value, big = false }) {
  const { main, tag } = splitTag(value);
  return (
    <span className="flex flex-col items-center text-center">
      <span className={`whitespace-nowrap font-semibold text-lr-ink dark:text-lr-green ${big ? "text-[17px] lg:text-[18px] xl:text-[20px]" : "text-[16px]"}`} dangerouslySetInnerHTML={{ __html: main }} />
      {tag && <span className={`mt-1 text-lr-body ${big ? "text-[13px] leading-snug xl:text-[15px]" : "text-[12px] leading-snug xl:text-[15px]"}`}>{tag}</span>}
    </span>
  );
}

function DesktopRow({ row, car }) {
  return (
    <div className={`grid ${DESKTOP_COLS} items-stretch border-t border-lr-line text-[14px] text-lr-head lg:text-[15px] xl:text-[16px]`}>
      <GenerationPanel generation={row.generation} car={car} />
      <span className="flex items-center justify-center border-l border-lr-line px-3 text-center" dangerouslySetInnerHTML={{ __html: row.years }} />
      <span className="flex items-center justify-center border-l border-lr-line px-3 text-center" dangerouslySetInnerHTML={{ __html: row.engineCode }} />
      <span className="flex items-center justify-center border-l border-lr-line px-3 py-4"><Rating value={row.reliability} big /></span>
      <span className="flex items-center justify-center border-l border-lr-line px-3 py-4"><Cost value={row.reconCost} big /></span>
      <span className="flex items-center border-l border-lr-line px-4 py-4 leading-relaxed text-lr-body xl:px-5" dangerouslySetInnerHTML={{ __html: dash(row.eraNote) }} />
    </div>
  );
}

function MobileCard({ row, car }) {
  const label = "text-[11.5px] font-semibold uppercase tracking-[0.06em] text-lr-muted xl:text-[15px]";
  return (
    <article className="overflow-hidden rounded-lg border border-lr-line bg-lr-card shadow-[0_10px_24px_-22px_var(--lr-shadow)]">
      {/* generation strip: the name on the green angled panel, the car on the right */}
      <div className="relative flex min-h-[92px] items-center overflow-hidden border-b border-lr-line">
        <span className="absolute inset-y-0 left-0 w-[62%] bg-lr-brand" style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }} aria-hidden="true" />
        <p className="relative w-[54%] px-3.5 py-3 text-[15px] font-semibold leading-snug text-lr-on-brand" dangerouslySetInnerHTML={{ __html: row.generation }} />
        {car && (
          <div className="relative ml-auto mr-2 h-[74px] w-[44%]">
            <Image src={car} alt="" fill className="object-contain object-right drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]" sizes="170px" />
          </div>
        )}
      </div>
      <dl className="grid grid-cols-2 border-b border-lr-line">
        <div className="px-3.5 py-3"><dt className={label}>Years</dt><dd className="mt-0.5 text-[15px] font-medium text-lr-head" dangerouslySetInnerHTML={{ __html: row.years }} /></div>
        <div className="border-l border-lr-line px-3.5 py-3"><dt className={label}>Engine Code</dt><dd className="mt-0.5 text-[15px] font-medium text-lr-head" dangerouslySetInnerHTML={{ __html: row.engineCode }} /></div>
      </dl>
      <div className="grid grid-cols-2 border-b border-lr-line">
        <div className="px-3 py-3.5"><p className={`${label} mb-2 text-center`}>Reliability</p><Rating value={row.reliability} /></div>
        <div className="border-l border-lr-line px-3 py-3.5"><p className={`${label} mb-2 text-center`}>Recon Cost (Guide)</p><Cost value={row.reconCost} /></div>
      </div>
      <div className="px-3.5 py-3">
        <p className={label}>Era Note</p>
        <p className="mt-1 text-[14.5px] leading-relaxed text-lr-body xl:text-[16px]" dangerouslySetInnerHTML={{ __html: dash(row.eraNote) }} />
      </div>
    </article>
  );
}

export default function EraMap({ data, band = "soft", car = null }) {
  if (!data) return null;
  const rows = data.rows || [];
  const cols = data.columns?.length === 6 ? data.columns : ["Generation", "Years", "Engine Code", "Reliability", "Recon Cost", "Era Note"];

  return (
    <section id="era-map" className={`w-full scroll-mt-24 py-6 text-lr-head md:py-6 lg:py-7 ${SANS} ${band === "soft" ? "bg-lr-band" : "bg-lr-page"}`}>
      <div className={`relative ${CONTAINER}`}>
        {/* title + source note */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="md:pt-4">
            <h2 className={`${H2} text-lr-head`}>{dash(data.title)}</h2>
            <span className="mt-3 block h-[3px] w-12 rounded-full bg-lr-brand md:w-14" aria-hidden="true" />
            <p className="mt-3 text-[15px] leading-relaxed text-lr-body md:text-[16px] xl:text-[17px]">
              Four generations. Four eras. One guide to reliability, costs and what really matters.
            </p>
          </div>
          <aside className="flex items-start gap-3 rounded-lg border border-lr-line bg-lr-card px-4 py-3.5 shadow-[0_10px_24px_-22px_var(--lr-shadow)] md:max-w-[330px] md:shrink-0 lg:max-w-[360px]">
            <LrIcon name="note" tone="current" className={`mt-0.5 ${ICON_MD} text-lr-head`} />
            <p className="text-[13.5px] leading-relaxed text-lr-body xl:text-[15px]" dangerouslySetInnerHTML={{ __html: dash(data.sourceNote || DEFAULT_SOURCE) }} />
          </aside>
        </div>

        {rows.length > 0 && (
          <>
            <div className="mt-5 flex flex-col gap-3 md:hidden">
              {rows.map((row) => <MobileCard key={row.generation} row={row} car={car} />)}
            </div>
            <div className="mt-6 hidden overflow-hidden rounded-lg border border-lr-line bg-lr-card shadow-[0_10px_24px_-22px_var(--lr-shadow)] md:block">
              <div className={`grid ${DESKTOP_COLS} bg-lr-brand text-[13.5px] font-semibold text-lr-on-brand lg:text-[14.5px] xl:text-[15px]`}>
                {cols.map((col, i) => (
                  <span key={col} className={`flex items-center justify-center px-3 py-3.5 text-center ${i > 0 ? "border-l border-lr-on-brand/20" : ""}`}>{colLabel(col)}</span>
                ))}
              </div>
              {rows.map((row) => <DesktopRow key={row.generation} row={row} car={car} />)}
            </div>
          </>
        )}

        {/* why use this era map */}
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 rounded-lg border border-lr-line bg-lr-card p-4 shadow-[0_10px_24px_-22px_var(--lr-shadow)] sm:grid-cols-4 md:mt-6 md:p-6 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-0 lg:divide-x lg:divide-lr-line lg:px-2 lg:py-6">
          <div className="col-span-2 flex items-start gap-3.5 sm:col-span-4 lg:col-span-1 lg:px-5">
            <LrIcon name="safe-buy" tone="current" className={`${ICON_LG} text-lr-ink dark:text-lr-green`} />
            <div>
              <p className="text-[15px] font-semibold text-lr-head xl:text-[16px]">Why use this era map?</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-lr-body xl:text-[15px]">{WHY}</p>
            </div>
          </div>
          {POINTS.map((p) => (
            <div key={p.title} className="flex items-start gap-3 lg:px-4 xl:px-5">
              <LrIcon name={p.icon} tone="current" className={`${ICON_LG} text-lr-ink dark:text-lr-green`} />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-snug text-lr-head xl:text-[15px]">{p.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-lr-body xl:text-[15px]">{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        {data.dataNote ? <p className="mt-4 text-[13px] text-lr-muted xl:text-[15px]" dangerouslySetInnerHTML={{ __html: data.dataNote }} /> : null}
      </div>
    </section>
  );
}
