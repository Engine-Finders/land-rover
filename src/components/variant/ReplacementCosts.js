import Link from "next/link";
import ArrowIcon from "@/components/variant/VariantIcons";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H2, H6, ICON_MD, ICON_XL } from "@/lib/typeScale";

// Variant section 2: engine replacement costs, built to the approved reference - a label chip, bold
// sans title, then the cost table (desktop) or one card per engine type (phones / tablets): engine type
// on a brand-green icon disc, supply / fitted prices, warranty with a shield, and "best for" with its
// own icon. Below: the figures note (linking back to the Era Map), the labour estimate beside the
// compare CTA, and the ticker band. All copy from the page's `replacementCosts` JSON (the ticker from
// the hero's). Follows the site theme.

const SANS = "font-[family-name:var(--font-instrument-sans)]";
// section titles use the shared H2 (one size and weight across every section and page)
export const SECTION_TITLE = H2;
export const CHIP = "inline-block rounded-[4px] bg-lr-brand/12 px-2 py-1 text-[11.5px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink ring-1 ring-inset ring-lr-brand/25 dark:bg-lr-brand/30 dark:text-lr-green md:text-[12px] xl:text-[15px]";

const isNA = (v = "") => /^n\/?a$/i.test(String(v).trim());
const stripArrow = (label = "") => label.replace(/^\s*→\s*/, "").replace(/\s*→\s*$/, "");
const dash = (t = "") => String(t).replace(/ - /g, " — ");
// "£800–£2,000" -> "£800 – £2,000"
const money = (t = "") => String(t).replace(/(£[\d,.]+k?)\s*[–-]\s*(£)/g, "$1 – $2");
// phones: "£3,500–£4,500" kept tight, allowed to break only after the dash
const moneyTight = (t = "") => String(t).replace(/(£[\d,.]+k?)\s*[–-]\s*(£)/g, "$1–<wbr>$2");
// the "8–12 hours" span of the labour estimate in green
const highlightHours = (html = "") => html.replace(/(\d+\s*[–-]\s*\d+\s*hours?)/, `<span class="font-medium text-lr-ink dark:text-lr-green">$1</span>`);

function typeIcon(type = "") {
  const t = type.toLowerCase();
  if (t.includes("used")) return "best-used-buy-2";
  if (t.includes("recon")) return "specific-knowledge";
  if (t.includes("rebuil")) return "rod-bearing";
  if (t.includes("dealer") || t.includes("new")) return "independent-star";
  return "engine";
}

// "best for" icon by engine type: car, balance, clock, shield
function BestForIcon({ type = "", className = "" }) {
  const t = type.toLowerCase();
  const cls = `shrink-0 text-lr-body ${className}`;
  const name = t.includes("used") ? "vehicle" : t.includes("recon") ? "scale" : t.includes("rebuil") ? "best-long-term" : "genuine-failure-data";
  return <LrIcon name={name} tone="current" className={cls} />;
}

function TypeDisc({ type, className = "h-11 w-11 md:h-12 md:w-12" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-lr-brand ${className}`}>
      <LrIcon name={typeIcon(type)} className={ICON_MD} />
    </span>
  );
}

const Html = ({ html, className }) => <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;

export default function ReplacementCosts({ data, ticker = "" }) {
  if (!data?.rows?.length) return null;
  const columns = data.columns?.length === 5 ? data.columns : ["Engine Type", "Supply Only", "Fitted (Indie)", "Warranty", "Best For"];
  const items = (ticker || "").replace(/^●\s*/, "").split(" · ").filter(Boolean);
  // "... see the Era Map above." -> "Era Map" in green, linking up to the table
  const figures = dash(data.figuresNote || "").replace(/\bEra Map\b/, `<a href="#era-map" class="font-medium text-lr-ink no-underline hover:underline dark:text-lr-green">Era Map</a>`);

  return (
    <section className={`relative bg-lr-page text-lr-head ${SANS}`}>
      <div className={`relative ${CONTAINER} pb-8 pt-8 md:pb-10 md:pt-12 lg:pt-11`}>
        <span className={CHIP}>Replacement Costs</span>
        <h2 className={`${SECTION_TITLE} mt-3 text-lr-head`}>{data.h2}</h2>

        {/* ---------- phones / tablets: one card per engine type ---------- */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
          {data.rows.map((r) => {
            const na = isNA(r.supplyOnly) && isNA(r.fittedIndie);
            return (
              <article key={r.engineType} className="overflow-hidden rounded-lg border border-lr-line bg-lr-card shadow-[0_10px_24px_-22px_var(--lr-shadow)]">
                <div className="flex items-center gap-3 px-4 pb-3 pt-4">
                  <TypeDisc type={r.engineType} />
                  <h3 className={`${H6} text-lr-head`} dangerouslySetInnerHTML={{ __html: r.engineType }} />
                </div>
                <dl className="grid grid-cols-3 border-y border-lr-line">
                  {[[columns[1], r.supplyOnly], [columns[2], r.fittedIndie], [columns[3], r.warranty]].map(([k, val], i) => (
                    <div key={k} className={`px-1.5 py-3 text-center min-[400px]:px-2 ${i ? "border-l border-lr-line" : ""}`}>
                      <dt className="text-[11px] font-semibold uppercase leading-tight tracking-[0.05em] text-lr-muted xl:text-[15px]">{k}</dt>
                      <dd className={`mt-1.5 text-[13px] font-semibold leading-snug tracking-[-0.01em] min-[400px]:text-[14.5px] min-[400px]:tracking-normal ${isNA(val) ? "text-lr-muted" : "text-lr-head"}`} dangerouslySetInnerHTML={{ __html: moneyTight(val) }} />
                    </div>
                  ))}
                </dl>
                {r.bestFor && (
                  <p className={`flex items-center gap-3 px-4 py-3 text-[14.5px] leading-snug ${na ? "text-lr-muted" : "text-lr-body"}`}>
                    <BestForIcon type={r.engineType} className={ICON_MD} />
                    <span>
                      <span className="font-semibold text-lr-head">{columns[4]}:</span> <Html html={dash(r.bestFor)} />
                    </span>
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {/* ---------- desktop: table ---------- */}
        <div className="mt-6 hidden overflow-hidden rounded-lg border border-lr-line bg-lr-card shadow-[0_10px_24px_-22px_var(--lr-shadow)] lg:block">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[21%]" /><col className="w-[18.5%]" /><col className="w-[18.5%]" /><col className="w-[19%]" /><col className="w-[23%]" />
            </colgroup>
            <thead>
              <tr className="bg-lr-brand/10 text-[15px] font-semibold text-lr-head dark:bg-lr-brand/25 xl:text-[16px]">
                {columns.map((h, i) => (
                  <th key={h} scope="col" className={`px-4 py-3.5 text-center font-semibold ${i ? "border-l border-lr-line" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[15px] xl:text-[16.5px]">
              {data.rows.map((r) => (
                <tr key={r.engineType} className="border-t border-lr-line text-lr-head transition-colors hover:bg-lr-panel/50">
                  <th scope="row" className="px-5 py-4 font-medium">
                    <span className="flex items-center gap-4">
                      <TypeDisc type={r.engineType} className="h-11 w-11" />
                      <Html html={r.engineType} />
                    </span>
                  </th>
                  <td className={`border-l border-lr-line px-4 py-4 text-center ${isNA(r.supplyOnly) ? "text-lr-muted" : ""}`}><Html html={money(r.supplyOnly)} /></td>
                  <td className={`border-l border-lr-line px-4 py-4 text-center ${isNA(r.fittedIndie) ? "text-lr-muted" : ""}`}><Html html={money(r.fittedIndie)} /></td>
                  <td className="border-l border-lr-line px-4 py-4">
                    <span className={`flex items-center justify-center gap-3.5 ${isNA(r.warranty) ? "text-lr-muted" : ""}`}>
                      {!isNA(r.warranty) && <LrIcon name="genuine-failure-data" tone="current" className={`${ICON_MD} text-lr-ink dark:text-lr-green`} />}
                      <Html html={r.warranty} />
                    </span>
                  </td>
                  <td className="border-l border-lr-line px-5 py-4">
                    <span className="flex items-center gap-4 text-[14px] leading-snug text-lr-body xl:text-[15px]">
                      <BestForIcon type={r.engineType} className={ICON_MD} />
                      <Html html={dash(r.bestFor)} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* figures note */}
        {data.figuresNote && (
          <p className="mt-3 flex items-start gap-3 rounded-lg border border-lr-line bg-lr-card px-4 py-3.5 text-[14.5px] leading-relaxed text-lr-body md:mt-4 md:items-center md:px-5 md:py-4 lg:text-[15.5px]">
            <LrIcon name="note" tone="current" className={`mt-0.5 ${ICON_MD} text-lr-ink md:mt-0 dark:text-lr-green`} />
            <Html html={figures} />
          </p>
        )}

        {/* labour estimate + compare CTA */}
        {(data.labourEstimate || data.cta?.label) && (
          <div className="mt-3 flex flex-col gap-4 rounded-lg border border-lr-line bg-lr-card p-4 shadow-[0_10px_24px_-22px_var(--lr-shadow)] md:mt-4 md:flex-row md:items-center md:gap-6 md:p-5">
            {data.labourEstimate && (
              <div className="flex flex-1 items-start gap-4 md:items-center md:gap-5">
                <LrIcon name="commercial" tone="current" className={`${ICON_XL} text-lr-head`} />
                <p className="text-[14.5px] leading-relaxed text-lr-body lg:text-[15.5px]">
                  <span className="font-semibold text-lr-head">Labour estimate:</span> <Html html={highlightHours(data.labourEstimate)} />
                </p>
              </div>
            )}
            {data.labourEstimate && data.cta?.label && <span className="hidden h-16 w-px shrink-0 bg-lr-line md:block" aria-hidden="true" />}
            {data.cta?.label && (
              <Link
                href="/quote"
                className="group flex items-center gap-4 rounded-md bg-lr-brand px-5 py-4 text-[15.5px] font-semibold leading-snug text-lr-on-brand shadow-[0_10px_30px_-14px_rgba(31,112,73,0.7)] transition-colors hover:bg-lr-brand-hover md:w-[44%] md:max-w-[360px] md:shrink-0 lg:text-[17px]"
              >
                <ArrowIcon className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                {stripArrow(data.cta.label)}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ticker band: scrolls on phones (list rendered twice), one static row from lg */}
      {items.length > 0 && (
        <div className="relative border-y border-lr-line bg-lr-band">
          <div className="mx-auto w-full max-w-8xl overflow-hidden md:px-8">
            <ul className="hero-ticker flex w-max items-center py-3.5 md:py-4 lg:w-full lg:justify-between lg:gap-4">
              {[...items, ...items].map((t, i) => (
                <li key={i} className={`flex shrink-0 items-center gap-2 pl-7 text-[13.5px] text-lr-body md:text-[14px] lg:pl-0 xl:text-[15px] ${i >= items.length ? "lg:hidden" : ""}`} aria-hidden={i >= items.length || undefined}>
                  <span className="text-[15px] font-semibold leading-none text-lr-ink dark:text-lr-green" aria-hidden="true">+</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
