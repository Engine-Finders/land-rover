import Link from "next/link";
import { CONTAINER, INK, SANS } from "@/components/engine/engineTheme";
import { BODY, BODY_SM, H2, H5, LABEL as EYEBROW, STAT } from "@/lib/typeScale";

// Engine section: Cost Guide - intro (labour estimate + shared-cost note), one price card per
// condition (Used / Reconditioned "most popular" / Rebuilt: supply-only, fitted, warranty) and a
// dark compare-prices card. Copy from the page's `costGuide` JSON. Fixed light design; sits
// straight under Compatibility on the same cream band. 2xl values are the reference design at
// 1672px; xl is the same single-row layout scaled for 1280-1535px; lg puts the intro on its own
// row; below that everything stacks.


const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const GLYPHS = {
  tag: (
    <>
      <path fill="currentColor" d="M11.2 2.5H20a1.5 1.5 0 0 1 1.5 1.5v8.8a1.5 1.5 0 0 1-.44 1.06l-7.7 7.7a1.5 1.5 0 0 1-2.12 0L2.44 12.76a1.5 1.5 0 0 1 0-2.12l7.7-7.7a1.5 1.5 0 0 1 1.06-.44z" />
      <circle cx="16.6" cy="7.4" r="1.7" fill="var(--lr-chip)" />
    </>
  ),
  star: <path fill="currentColor" d="m12 3.2 2.6 5.4 5.9.7-4.4 4.1 1.2 5.8L12 16.3l-5.3 2.9 1.2-5.8-4.4-4.1 5.9-.7z" />,
  tools: (
    <>
      <path {...line} d="M14.2 6.4a3.4 3.4 0 0 0 4.3 4.3L9.4 19.8a1.6 1.6 0 0 1-2.3-2.3zM14.2 6.4a3.4 3.4 0 0 1 4.2-2.1l-2 2 .3 1.8 1.8.3 2-2a3.4 3.4 0 0 1-2.1 4.2" />
      <path {...line} d="m4.2 4.2 2.4-.9 5.2 5.2-1.5 1.5-5.2-5.2zM12.9 13.1l5.6 5.6a1.4 1.4 0 0 1-2 2l-5.6-5.6" />
    </>
  ),
  info: (
    <>
      <circle {...line} strokeWidth="1.4" cx="12" cy="12" r="9.2" />
      <path {...line} d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
    </>
  ),
  arrow: <path {...line} strokeWidth="1.8" d="M4 12h16M14 6l6 6-6 6" />,
};
const Svg = ({ name, className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    {GLYPHS[name]}
  </svg>
);

// filled shield on a viewBox cropped to its outline
function ShieldIcon({ className }) {
  return (
    <svg viewBox="4.4 2.6 15.2 18.8" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 2.6 19.6 5.6v6c0 4.7-3.2 8-7.6 9.8-4.4-1.8-7.6-5.1-7.6-9.8v-6z" />
      <path fill="none" stroke="var(--lr-panel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="m8.6 12 2.4 2.4 4.5-4.7" />
    </svg>
  );
}

function ChartIcon({ className }) {
  return (
    <svg viewBox="0 0 48 42" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cost-guide-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7c98d" />
          <stop offset="1" stopColor="#a9853f" />
        </linearGradient>
      </defs>
      <rect x="4" y="29" width="7" height="12" rx="1" fill="url(#cost-guide-gold)" />
      <rect x="15" y="22" width="7" height="19" rx="1" fill="url(#cost-guide-gold)" />
      <rect x="26" y="25" width="7" height="16" rx="1" fill="url(#cost-guide-gold)" />
      <rect x="37" y="15" width="7" height="26" rx="1" fill="url(#cost-guide-gold)" />
      <path d="m3 21 10-9 7 6 15-13" fill="none" stroke="url(#cost-guide-gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 4h7v7" fill="none" stroke="url(#cost-guide-gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICON_BY_CONDITION = [
  [/recon/i, "star"],
  [/rebuil/i, "tools"],
  [/used/i, "tag"],
];

// source tags in green, hours and labour rates in bold
const richText = (t = "") =>
  t
    .replace(/ - /g, " — ")
    .replace(/(\d+[–-]\d+)(?= hours)/g, "<strong>$1</strong>")
    .replace(/(£\d+[–-]£\d+\/hr)/g, "<strong>$1</strong>")
    .replace(/(\[[A-Z][A-Z -]*\]\.?)/g, `<span class="text-lr-green">$1</span>`);

const CARD = "relative rounded-xl border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)]";
const CARD_TITLE = "font-[family-name:var(--font-instrument-sans)] font-medium text-[17px] md:text-[15px] xl:text-[20px]";
const LABEL = "text-[12px] uppercase leading-snug tracking-[0.04em] text-lr-muted md:text-[13px] xl:text-[15px]";
const NOTE = `rounded-lg border border-lr-line bg-lr-panel ${BODY_SM} text-lr-body xl:rounded-[9px]`;

function PriceCard({ row }) {
  const icon = (ICON_BY_CONDITION.find(([re]) => re.test(row.condition)) || [])[1] || "tag";
  const featured = icon === "star";
  return (
    <article
      className={`${CARD} flex flex-col px-4 pb-4 pt-5 sm:px-5 md:px-4 xl:px-[16px] xl:pb-[22px] xl:pt-[14px] ${featured ? "mt-3 border-[1.5px] border-lr-ink md:mt-0 dark:border-lr-green" : ""}`}
    >
      {featured && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] bg-lr-brand text-lr-on-brand md:text-[12px] xl:px-[16px] xl:py-[3px] xl:text-[15px]">
          Most Popular
        </span>
      )}
      <div className="flex items-center gap-3 md:gap-2.5 xl:items-start xl:gap-[14px] xl:pl-[3px]">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-9 md:w-9 xl:h-[41px] xl:w-[41px] ${featured ? "bg-lr-brand text-lr-on-brand" : "bg-lr-chip text-lr-ink shadow-[inset_0_0_0_1px_var(--lr-line),0_3px_8px_-3px_var(--lr-shadow)] dark:text-lr-green"}`}
        >
          <Svg name={icon} className="h-6 w-6 md:h-5 md:w-5 xl:h-[22px] xl:w-[22px]" />
        </span>
        <div className="min-w-0 xl:mt-[5px]">
          {/* 3-4 cards share a row from md to lg, so the title steps down there to fit "Reconditioned" */}
          <p className={`${CARD_TITLE} uppercase leading-tight text-lr-head`}>{row.condition}</p>
          <p className={`mt-1 ${LABEL} xl:mt-[6px]`}>Supply Only</p>
        </div>
      </div>

      <p className={`mt-4 whitespace-nowrap text-center ${STAT} tracking-[-0.01em] text-lr-head xl:mt-[16px]`}>{row.supplyOnly}</p>

      {/* phones: fitted + warranty side by side; md+: stacked like the reference */}
      <dl className="mt-4 grid grid-cols-2 border-t border-lr-line text-center md:grid-cols-1 xl:mt-[16px]">
        <div className="border-r border-lr-line px-1 pt-3 md:border-r-0 md:pb-3 xl:pb-[10px] xl:pt-[10px]">
          <dt className={LABEL}>Fitted (Indie)</dt>
          <dd className="mt-1 whitespace-nowrap text-[17px] font-medium text-lr-head md:text-[18px] xl:mt-[6px] xl:text-[20px] xl:leading-[24px]">{row.fittedIndie}</dd>
        </div>
        <div className="px-1 pt-3 md:border-t md:border-lr-line xl:pt-[11px]">
          <dt className={LABEL}>Warranty</dt>
          <dd className="mt-1 text-[15px] font-medium leading-snug md:text-[16px] xl:mt-[5px] xl:text-[17px] text-lr-ink dark:text-lr-green">{row.warranty}</dd>
        </div>
      </dl>
    </article>
  );
}

export default function CostGuide({ data, engineName = "" }) {
  const rows = data?.rows || [];
  if (rows.length === 0) return null;

  const title = `${engineName.replace(/<[^>]+>/g, "").replace(/^Land Rover\s+/i, "")} Engine Price Guide`;

  return (
    <section className="relative bg-lr-band text-lr-head" style={SANS}>
      <div className={`${CONTAINER} pb-12 pt-4 md:pb-16 md:pt-6 xl:pb-16 xl:pt-8`}>
        <div className="grid gap-3 rounded-2xl border border-lr-line bg-lr-card/55 p-3 sm:p-4 md:gap-4 md:p-5 lg:grid-cols-4 xl:-mx-[16px] xl:gap-[14px] xl:rounded-[12px] xl:px-[16px] xl:py-[16px]">
          {/* intro */}
          <div className="px-1 pb-1 pt-2 sm:px-2 lg:col-span-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-x-10 xl:px-0 xl:pb-2 xl:pt-4">
            <div className="xl:pl-[6px] xl:pt-[5px]">
              <p className={`flex items-center gap-3 ${EYEBROW} text-lr-ink xl:gap-[12px] dark:text-lr-gold`}>
                <span className="h-[2px] w-7 bg-lr-gold-line xl:w-[22px]" aria-hidden="true" />
                Cost Guide
              </p>
              <h2 className={`mt-2.5 ${H2} text-lr-ink xl:mt-[10px]`}>
                {title}
              </h2>
              <p className={`mt-2 ${BODY} text-lr-body xl:mt-[10px]`}>Real-world price ranges from UK specialists.</p>
            </div>
            <div className="mt-4 grid gap-2.5 lg:mt-0 xl:gap-[10px]">
              {data.labourEstimate && (
                <p className={`${NOTE} flex gap-3 px-3.5 py-3.5 md:px-4 xl:gap-[17px] xl:pb-[9px] xl:pl-[13px] xl:pr-[10px] xl:pt-[11px] [&_strong]:font-semibold [&_strong]:text-lr-head`}>
                  <Svg name="info" className="mt-0.5 h-7 w-7 shrink-0 md:h-8 md:w-8 xl:mt-[2px] xl:h-[28px] xl:w-[28px]" />
                  <span dangerouslySetInnerHTML={{ __html: richText(data.labourEstimate) }} />
                </p>
              )}
              {data.sharedCostNote && (
                <p className={`${NOTE} flex items-center gap-3 px-3.5 py-3 md:px-4 xl:gap-[20px] xl:pb-[9px] xl:pl-[15px] xl:pt-[9px]`}>
                  <span className="shrink-0 text-lr-ink dark:text-lr-green">
                    <ShieldIcon className="h-7 w-[23px] md:h-8 md:w-[26px] xl:h-[27px] xl:w-[22px]" />
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: richText(data.sharedCostNote) }} />
                </p>
              )}
            </div>
          </div>

          {/* price cards */}
          <div className="grid gap-3 md:grid-cols-3 md:gap-4 lg:col-span-3 xl:gap-[14px]">
            {rows.map((r) => (
              <PriceCard key={r.condition} row={r} />
            ))}
          </div>

          {/* compare prices */}
          <aside className="flex flex-col rounded-xl px-5 pb-5 pt-6 text-white shadow-[0_24px_44px_-28px_rgba(18,61,42,0.9)] md:flex-row md:items-center md:gap-6 md:px-7 lg:flex-col lg:items-stretch lg:gap-0 lg:px-5 xl:px-[23px] xl:pb-[16px] xl:pt-[18px]" style={{ background: "linear-gradient(160deg,#184a34 0%,#0f3323 100%)" }}>
            <ChartIcon className="h-11 w-12 shrink-0 md:h-12 md:w-14 lg:mx-auto lg:h-14 lg:w-16 xl:h-[55px] xl:w-[54px]" />
            <div className="mt-4 md:mt-0 md:flex-1 lg:mb-5 lg:mt-4 xl:mb-[15px] xl:mt-[9px]">
              <p className={H5}>Compare Prices from UK specialists</p>
              <p className={`mt-2 ${BODY_SM} text-white/85 xl:mt-[8px]`}>Get live pricing from trusted engine suppliers across the UK.</p>
            </div>
            <Link
              href="/quote"
              className="group mt-5 flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-white px-4 py-3 text-[14px] font-medium uppercase tracking-[0.04em] transition-colors hover:bg-[#f3efe4] md:mt-0 md:shrink-0 lg:mt-auto xl:h-[44px] xl:py-0 xl:text-[15px] xl:tracking-[0.03em]"
              style={{ color: INK }}
            >
              Compare Prices
              <Svg name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1 xl:h-[18px] xl:w-[18px]" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
