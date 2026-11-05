import Link from "next/link";
import Image from "next/image";
import Tagged from "@/components/variant/Tagged";
import VIcon from "@/components/variant/VariantIcons";
import { stripArrow, stripBullet } from "@/components/variant/variantText";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, CONTAINER, H2, H5, ICON_SM, LABEL, SMALL } from "@/lib/typeScale";

// Variant section: engine codes table (engine photo, code, years, power, enquiries, recon cost),
// technical specs and a compare CTA, from the page's `engineCodes` JSON. Follows the site theme
// (day / night); the compare CTA is a brand-green panel in both themes.

const DEFAULT_COLUMNS = ["Engine Code", "Years", "Power", "2025 Enquiries", "Avg. Recon Cost"];

// "Technical Specs (204DTD):" -> title + tag
function splitSpecsTitle(title = "") {
  const match = title.match(/^(.*?)\s*\(([^)]+)\)\s*:?$/);
  return match ? { title: match[1], tag: match[2] } : { title: title.replace(/:$/, ""), tag: "" };
}

function specIcon(label = "") {
  const t = label.toLowerCase();
  if (/displacement|capacity/.test(t)) return "engine";
  if (/cylinder/.test(t)) return "ingenium";
  if (/compression/.test(t)) return "meter";
  if (/fuel|injection/.test(t)) return "hpfp";
  if (/turbo|torque|power|output/.test(t)) return "turbo";
  if (/valve|timing|cam/.test(t)) return "timing-chain";
  return "note";
}

export default function EngineCodes({ data, engine = "/variant/sec10_engine.webp" }) {
  if (!data) return null;
  const rows = data.rows || [];
  const columns = data.columns?.length === 5 ? data.columns : DEFAULT_COLUMNS;
  const specs = data.technicalSpecs;
  const specsTitle = specs ? splitSpecsTitle(specs.title) : null;

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      <div className={`relative ${CONTAINER} grid gap-y-4 border-t border-transparent py-10 md:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-x-10`}>
        {/* ---------- engine codes ---------- */}
        <div className="min-w-0">
          <p className={`${LABEL} text-lr-gold`}>Engine Reference</p>
          <h2 className={`${H2} mt-3 text-lr-head`}>
            Engine Codes
          </h2>
          {data.matchNote && <p className={`${BODY} mt-3 text-lr-body`} dangerouslySetInnerHTML={{ __html: data.matchNote }} />}

          {rows.length > 0 && (
            <>
              {/* mobile cards */}
              <ul className="mt-5 space-y-2.5 md:hidden">
                {rows.map((r) => (
                  <li key={r.engineCode} className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-xl border border-lr-line bg-lr-card p-3.5 shadow-[0_20px_44px_-34px_var(--lr-shadow)]">
                    <Image src={engine} alt="" width={504} height={495} sizes="56px" className="h-14 w-14 object-contain" aria-hidden="true" />
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[17px] font-semibold leading-snug text-lr-green" dangerouslySetInnerHTML={{ __html: r.engineCode }} />
                      <p className={`${SMALL} shrink-0 font-medium text-lr-body`}>{r.years}</p>
                    </div>
                    {/* the figures use the card's full width so long values and source tags fit */}
                    <dl className="col-span-2 grid grid-cols-3 gap-3 border-t border-lr-line pt-3 text-[13px] leading-snug">
                      {[[columns[2], r.power], [columns[3], r.enquiries], [columns[4], r.avgReconCost]].map(([k, val]) => (
                        <div key={k} className="min-w-0">
                          <dt className="text-[11px] font-medium uppercase tracking-[0.05em] text-lr-muted">{k}</dt>
                          <dd className="mt-0.5 font-medium text-lr-head [overflow-wrap:anywhere]"><Tagged value={val || "—"} tagSize="text-[10px] font-medium uppercase tracking-[0.02em]" /></dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>

              {/* tablet / desktop table */}
              <div className="mt-6 hidden overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className={`${SMALL} bg-lr-panel text-lr-head [&>th]:font-medium`}>
                      <th scope="col" className="w-[110px] px-3 py-3.5"><span className="sr-only">Engine</span></th>
                      {columns.map((h) => (
                        <th key={h} scope="col" className="border-l border-lr-line px-4 py-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.engineCode} className={`${BODY_SM} border-t border-lr-line`}>
                        {i === 0 && (
                          <td rowSpan={rows.length} className="px-3 py-3 align-middle">
                            <Image src={engine} alt="" width={504} height={495} sizes="90px" className="mx-auto h-auto w-[86px]" aria-hidden="true" />
                          </td>
                        )}
                        <td className="border-l border-lr-line px-4 py-4 font-medium leading-snug text-lr-green" dangerouslySetInnerHTML={{ __html: r.engineCode }} />
                        <td className="whitespace-nowrap border-l border-lr-line px-4 py-4 text-lr-body">{r.years}</td>
                        <td className="border-l border-lr-line px-4 py-4 leading-snug text-lr-body">{r.power || "—"}</td>
                        <td className="border-l border-lr-line px-4 py-4 leading-snug text-lr-body"><Tagged value={r.enquiries || "—"} /></td>
                        <td className="border-l border-lr-line px-4 py-4 font-medium leading-snug text-lr-head"><Tagged value={r.avgReconCost || "—"} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ---------- specs + CTA ---------- */}
        <div className="flex flex-col gap-4 lg:pt-2">
          {specs?.items?.length > 0 && (
            <div className="rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-lr-line pb-3">
                <h3 className={`${H5} text-lr-head`}>{specsTitle.title}</h3>
                {specsTitle.tag && <p className={`${LABEL} text-lr-green`}>{specsTitle.tag}</p>}
              </div>
              <dl className="divide-y divide-lr-line">
                {specs.items.map((s) => {
                  const label = stripBullet(s.label);
                  return (
                    <div key={label} className={`${BODY_SM} grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 py-3`}>
                      <dt className="flex items-center gap-3 text-lr-body">
                        <LrIcon name={specIcon(label)} className={ICON_SM} />
                        {label}
                      </dt>
                      <dd className="leading-snug text-lr-head" dangerouslySetInnerHTML={{ __html: s.value }} />
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          {data.cta?.label && (
            <Link
              href="/quote"
              className="group relative isolate flex min-h-[132px] items-center gap-4 overflow-hidden rounded-xl font-medium border border-lr-green/35 px-5 py-5 text-lr-on-brand shadow-[0_18px_40px_-20px_var(--lr-shadow)] md:min-h-[150px] md:gap-6 md:px-7 md:py-6"
              style={{
                background:
                  "radial-gradient(ellipse 30% 55% at 18% 25%, rgba(255,255,255,0.09) 0%, transparent 70%), radial-gradient(ellipse 35% 60% at 55% 85%, rgba(255,255,255,0.06) 0%, transparent 70%), radial-gradient(ellipse 25% 45% at 70% 15%, rgba(255,255,255,0.05) 0%, transparent 70%), linear-gradient(115deg, var(--lr-brand) 0%, var(--lr-brand-hover) 100%)",
              }}
            >
              {/* engine, blended into the green on its left edge */}
              <Image
                src={engine}
                alt=""
                width={504}
                height={495}
                sizes="(min-width: 768px) 240px, 170px"
                className="pointer-events-none absolute -right-6 top-1/2 -z-10 h-auto w-[170px] -translate-y-1/2 opacity-55 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] sm:w-[210px] sm:opacity-80 md:-right-8 md:w-[230px] md:opacity-95"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: "linear-gradient(90deg, var(--lr-brand) 0%, color-mix(in srgb, var(--lr-brand) 95%, transparent) 52%, color-mix(in srgb, var(--lr-brand) 45%, transparent) 74%, transparent 100%)" }}
                aria-hidden="true"
              />
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-gold-line text-lr-gold-line transition-colors group-hover:bg-lr-gold-line/10 md:h-16 md:w-16">
                <VIcon name="arrow" className="h-6 w-6 transition-transform group-hover:translate-x-0.5 md:h-7 md:w-7" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 max-w-[70%] sm:max-w-[60%]">
                <span className={`${H5} block`}>
                  {stripArrow(data.cta.label)}
                </span>
                <span className={`${BODY_SM} mt-1.5 block font-normal text-lr-on-brand/90 md:mt-2`}>Get quotes from trusted UK specialists in minutes.</span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
