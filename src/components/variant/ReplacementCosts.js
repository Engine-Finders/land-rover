import Link from "next/link";
import VIcon from "@/components/variant/VariantIcons";
import { BODY, BODY_SM, CONTAINER, H2, H6, LABEL } from "@/lib/typeScale";

// Variant section: engine replacement cost table (desktop) / one card per engine type (mobile),
// the figures note, labour estimate and compare CTA - all from the page's `replacementCosts` JSON.
// Follows the site theme (day / night).

// icon for the engine type and its "best for" line, matched on the row's engine type
function rowIcons(type = "") {
  const t = type.toLowerCase();
  if (t.includes("used")) return ["tag", "car"];
  if (t.includes("recon")) return ["cog", "scale"];
  if (t.includes("rebuil")) return ["piston", "clock"];
  if (t.includes("dealer") || t.includes("new")) return ["star", "shield"];
  return ["engine", "info"];
}

const isNA = (v = "") => /^n\/?a$/i.test(String(v).trim());
const stripArrow = (label = "") => label.replace(/^\s*→\s*/, "").replace(/\s*→\s*$/, "");
// highlight the "10–14 hours" span of the labour estimate
const highlightHours = (html = "") => html.replace(/(\d+\s*[–-]\s*\d+\s*hours?)/, `<span class="text-lr-green">$1</span>`);

function TypeIcon({ name }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lr-green/30 bg-lr-chip text-lr-green md:h-11 md:w-11">
      <VIcon name={name} className="h-5 w-5 md:h-[22px] md:w-[22px]" />
    </span>
  );
}

const Html = ({ html, className }) => <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;

export default function ReplacementCosts({ data }) {
  if (!data?.rows?.length) return null;
  const columns = data.columns?.length === 5 ? data.columns : ["Engine Type", "Supply Only", "Fitted (Indie)", "Warranty", "Best For"];

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      <div className={`relative ${CONTAINER} py-10 md:py-14`}>
        <span className={`${LABEL} inline-block rounded bg-lr-chip px-2.5 py-1 text-lr-green`}>
          Replacement Costs
        </span>
        <h2 className={`${H2} mt-3 text-lr-head`}>
          {data.h2}
        </h2>

        {/* ---------- mobile / tablet: one card per engine type ---------- */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
          {data.rows.map((r) => {
            const [icon, bestIcon] = rowIcons(r.engineType);
            return (
              <article key={r.engineType} className="rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)]">
                <div className="flex items-center gap-3">
                  <TypeIcon name={icon} />
                  <h3 className={`${H6} text-lr-head`} dangerouslySetInnerHTML={{ __html: r.engineType }} />
                </div>
                <dl className="mt-3.5 grid grid-cols-3 divide-x divide-lr-line rounded-lg border border-lr-line bg-lr-panel py-2.5">
                  {[[columns[1], r.supplyOnly], [columns[2], r.fittedIndie], [columns[3], r.warranty]].map(([k, val]) => (
                    <div key={k} className="px-1.5 text-center">
                      <dt className="text-[11px] font-medium uppercase leading-tight tracking-[0.05em] text-lr-muted">{k}</dt>
                      <dd className={`mt-1 text-[12.5px] font-semibold leading-snug tracking-[-0.01em] min-[400px]:text-[13.5px] ${isNA(val) ? "text-lr-muted" : "text-lr-head"}`} dangerouslySetInnerHTML={{ __html: String(val || "").replace(" – ", "–") }} />
                    </div>
                  ))}
                </dl>
                {r.bestFor && (
                  <p className={`${BODY_SM} mt-3 flex items-start gap-2 text-lr-body`}>
                    <VIcon name={bestIcon} className="mt-1 h-4 w-4 shrink-0 text-lr-green" />
                    <span>
                      <span className="font-semibold text-lr-head">{columns[4]}:</span> <Html html={r.bestFor} />
                    </span>
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {/* ---------- desktop: table ---------- */}
        <div className="mt-6 hidden overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)] lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-lr-panel text-[15px] text-lr-head [&>th]:font-medium">
                {columns.map((h, i) => (
                  <th key={h} scope="col" className={`border-lr-line px-5 py-3.5 ${i ? "border-l" : ""} ${i > 0 && i < 4 ? "text-center" : i === 0 ? "pl-16" : "pl-6"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => {
                const [icon, bestIcon] = rowIcons(r.engineType);
                return (
                  <tr key={r.engineType} className={`${BODY} border-t border-lr-line text-lr-head transition-colors hover:bg-lr-panel/60`}>
                    <th scope="row" className="w-[22%] px-5 py-4 font-medium">
                      <span className="flex items-center gap-3.5">
                        <TypeIcon name={icon} />
                        <Html html={r.engineType} />
                      </span>
                    </th>
                    <td className={`border-l border-lr-line px-4 py-4 text-center ${isNA(r.supplyOnly) ? "text-lr-muted" : ""}`}><Html html={r.supplyOnly} /></td>
                    <td className={`border-l border-lr-line px-4 py-4 text-center ${isNA(r.fittedIndie) ? "text-lr-muted" : ""}`}><Html html={r.fittedIndie} /></td>
                    <td className="border-l border-lr-line px-4 py-4">
                      <span className={`flex items-center justify-center gap-3 ${isNA(r.warranty) ? "text-lr-muted" : ""}`}>
                        {!isNA(r.warranty) && <VIcon name="shield" className="h-7 w-7 shrink-0 text-lr-green" />}
                        <Html html={r.warranty} />
                      </span>
                    </td>
                    <td className="w-[24%] border-l border-lr-line px-5 py-4">
                      <span className={`${BODY_SM} flex items-center gap-3.5 text-lr-body`}>
                        <VIcon name={bestIcon} className="h-7 w-7 shrink-0 text-lr-muted" />
                        <Html html={r.bestFor} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* figures note */}
        {data.figuresNote && (
          <p className={`${BODY_SM} mt-3 flex items-start gap-3 rounded-xl border border-lr-line bg-lr-panel px-4 py-3.5 text-lr-body md:mt-4 md:items-center md:px-5`}>
            <VIcon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-lr-green md:mt-0 md:h-6 md:w-6" />
            <Html html={data.figuresNote} />
          </p>
        )}

        {/* labour + CTA */}
        {(data.labourEstimate || data.cta?.label) && (
          <div className="mt-3 flex flex-col gap-4 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:mt-4 md:p-5 lg:flex-row lg:items-center lg:gap-8">
            {data.labourEstimate && (
              <div className="flex flex-1 items-start gap-3.5 md:gap-5">
                <VIcon name="wrench" className="h-9 w-9 shrink-0 text-lr-green md:h-12 md:w-12" />
                <p className={`${BODY_SM} text-lr-body`}>
                  <span className="font-semibold text-lr-head">Labour estimate:</span> <Html html={highlightHours(data.labourEstimate)} />
                </p>
              </div>
            )}
            {data.cta?.label && (
              <Link
                href="/quote"
                className="group flex items-center gap-4 rounded-lg border border-lr-brand bg-lr-brand px-5 py-4 text-[15px] font-medium leading-snug text-lr-on-brand shadow-[0_10px_30px_-12px_rgba(31,112,73,0.7)] transition-colors hover:border-lr-brand-hover hover:bg-lr-brand-hover md:text-[16px] xl:text-[17px] lg:w-[420px] lg:shrink-0 lg:px-6"
              >
                <VIcon name="arrow" className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                {stripArrow(data.cta.label)}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
