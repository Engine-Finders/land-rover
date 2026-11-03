import Link from "next/link";
import VIcon from "@/components/variant/VariantIcons";

// Variant section: engine replacement cost table (desktop) / one card per engine type (mobile),
// the figures note, labour estimate and compare CTA - all from the page's `replacementCosts` JSON.
// Fixed dark design.

const GREEN = "#7f9f4f";
const SANS = { fontFamily: "var(--font-instrument-sans), Arial, sans-serif" };

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
const highlightHours = (html = "") => html.replace(/(\d+\s*[–-]\s*\d+\s*hours?)/, `<span style="color:${GREEN}">$1</span>`);

function TypeIcon({ name }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#7f9f4f]/30 bg-[#1d2a18] text-white md:h-11 md:w-11">
      <VIcon name={name} className="h-5 w-5 md:h-[22px] md:w-[22px]" />
    </span>
  );
}

const Html = ({ html, className }) => <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;

export default function ReplacementCosts({ data }) {
  if (!data?.rows?.length) return null;
  const columns = data.columns?.length === 5 ? data.columns : ["Engine Type", "Supply Only", "Fitted (Indie)", "Warranty", "Best For"];

  return (
    <section className="relative overflow-hidden bg-[#0b0d0a] text-white">
      <div className="relative mx-auto max-w-8xl px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <span className="inline-block rounded bg-[#1d2a18] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#a9c47e] md:text-[11px]">
          Replacement Costs
        </span>
        <h2 className="mt-3 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[30px] lg:text-[36px]" style={SANS}>
          {data.h2}
        </h2>

        {/* ---------- mobile / tablet: one card per engine type ---------- */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
          {data.rows.map((r) => {
            const [icon, bestIcon] = rowIcons(r.engineType);
            return (
              <article key={r.engineType} className="rounded-xl border border-white/12 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <TypeIcon name={icon} />
                  <h3 className="text-[16px] font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: r.engineType }} />
                </div>
                <dl className="mt-3.5 grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-black/30 py-2.5">
                  {[[columns[1], r.supplyOnly], [columns[2], r.fittedIndie], [columns[3], r.warranty]].map(([k, val]) => (
                    <div key={k} className="px-1.5 text-center">
                      <dt className="text-[10px] font-medium uppercase tracking-[0.06em] text-white/55">{k}</dt>
                      <dd className={`mt-1 text-[12.5px] font-semibold leading-snug tracking-[-0.01em] min-[400px]:text-[13.5px] ${isNA(val) ? "text-white/45" : "text-white"}`} dangerouslySetInnerHTML={{ __html: String(val || "").replace(" – ", "–") }} />
                    </div>
                  ))}
                </dl>
                {r.bestFor && (
                  <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-white/80">
                    <VIcon name={bestIcon} className="mt-px h-4 w-4 shrink-0" style={{ color: GREEN }} />
                    <span>
                      <span className="font-semibold text-white">{columns[4]}:</span> <Html html={r.bestFor} />
                    </span>
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {/* ---------- desktop: table ---------- */}
        <div className="mt-6 hidden overflow-hidden rounded-xl border border-[#7f9f4f]/35 lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#16231a] text-[15px] font-semibold">
                {columns.map((h, i) => (
                  <th key={h} scope="col" className={`border-white/10 px-5 py-3.5 ${i ? "border-l" : ""} ${i > 0 && i < 4 ? "text-center" : i === 0 ? "pl-16" : "pl-6"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => {
                const [icon, bestIcon] = rowIcons(r.engineType);
                return (
                  <tr key={r.engineType} className="border-t border-white/10 text-[16px] transition-colors hover:bg-white/[0.025]">
                    <th scope="row" className="w-[22%] px-5 py-4 font-medium">
                      <span className="flex items-center gap-3.5">
                        <TypeIcon name={icon} />
                        <Html html={r.engineType} />
                      </span>
                    </th>
                    <td className={`border-l border-white/10 px-4 py-4 text-center ${isNA(r.supplyOnly) ? "text-white/45" : ""}`}><Html html={r.supplyOnly} /></td>
                    <td className={`border-l border-white/10 px-4 py-4 text-center ${isNA(r.fittedIndie) ? "text-white/45" : ""}`}><Html html={r.fittedIndie} /></td>
                    <td className="border-l border-white/10 px-4 py-4">
                      <span className={`flex items-center justify-center gap-3 ${isNA(r.warranty) ? "text-white/45" : ""}`}>
                        {!isNA(r.warranty) && <VIcon name="shield" className="h-7 w-7 shrink-0" style={{ color: GREEN }} />}
                        <Html html={r.warranty} />
                      </span>
                    </td>
                    <td className="w-[24%] border-l border-white/10 px-5 py-4">
                      <span className="flex items-center gap-3.5 text-[15px] leading-snug">
                        <VIcon name={bestIcon} className="h-7 w-7 shrink-0 text-white/80" />
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
          <p className="mt-3 flex items-start gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-[13.5px] leading-relaxed text-white/85 md:mt-4 md:items-center md:px-5 md:text-[15px]">
            <VIcon name="info" className="mt-0.5 h-5 w-5 shrink-0 md:mt-0 md:h-6 md:w-6" style={{ color: GREEN }} />
            <Html html={data.figuresNote} />
          </p>
        )}

        {/* labour + CTA */}
        {(data.labourEstimate || data.cta?.label) && (
          <div className="mt-3 flex flex-col gap-4 rounded-xl border border-white/12 bg-white/[0.03] p-4 md:mt-4 md:p-5 lg:flex-row lg:items-center lg:gap-8">
            {data.labourEstimate && (
              <div className="flex flex-1 items-start gap-3.5 md:gap-5">
                <VIcon name="wrench" className="h-9 w-9 shrink-0 text-white/85 md:h-12 md:w-12" />
                <p className="text-[14px] leading-relaxed text-white/85 md:text-[15px]">
                  <span className="font-semibold text-white">Labour estimate:</span> <Html html={highlightHours(data.labourEstimate)} />
                </p>
              </div>
            )}
            {data.cta?.label && (
              <Link
                href="/quote"
                className="group flex items-center gap-4 rounded-lg border border-[#5a7a3c] bg-linear-to-br from-[#3e5a2c] to-[#2c4220] px-5 py-4 text-[15px] font-semibold leading-snug text-white shadow-[0_10px_30px_-12px_rgba(90,122,60,0.8)] transition-colors hover:from-[#4a6a35] hover:to-[#35502a] md:text-[17px] lg:w-[400px] lg:shrink-0 lg:px-6"
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
