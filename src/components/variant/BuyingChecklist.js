import Image from "next/image";
import { carRatio } from "@/lib/carGeometry";
import { stripBullet, topicIcon } from "@/components/variant/variantText";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, CONTAINER, H2, H5, H6, ICON_LG, LABEL, SMALL } from "@/lib/typeScale";

// Variant section: buying checklist - numbered check cards from the page's `buyingChecklist`
// JSON, the vehicle, and a "Buy smart" reassurance card. Follows the site theme (day / night).

// "* Cold Start - Listen for rattle ..." -> label + text
function splitItem(item = "") {
  const clean = stripBullet(item);
  const dash = clean.indexOf(" - ");
  return dash === -1 ? { label: clean, text: "" } : { label: clean.slice(0, dash), text: clean.slice(dash + 3) };
}

function checkIcon(label = "") {
  const t = label.toLowerCase();
  if (/cold start|listen|noise/.test(t)) return "engine";
  if (/coolant|cooling/.test(t)) return "cooling-system-2";
  if (/turbo|boost/.test(t)) return "turbo";
  if (/oil/.test(t)) return "oil-leaks";
  if (/smoke|exhaust/.test(t)) return "exhaust-and-emission";
  if (/warning|light|diagnos|fault/.test(t)) return "check-watch";
  if (/mot/.test(t)) return "symptoms";
  return topicIcon(label);
}

export default function BuyingChecklist({ data, car = null }) {
  if (!data?.items?.length) return null;

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      {/* soft studio backdrop behind the vehicle */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 45% 60% at 82% 28%, color-mix(in srgb, var(--lr-line) 75%, transparent) 0%, color-mix(in srgb, var(--lr-line) 30%, transparent) 48%, transparent 76%)" }}
      />

      <div className={`relative ${CONTAINER} grid border-t border-transparent py-10 md:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-x-10`}>
        <div className="lg:col-start-1 lg:row-start-1">
          <p className={`${LABEL} text-lr-gold`}>Before You Buy</p>
          <h2 className={`${H2} mt-3 text-lr-head`}>
            Buying Checklist
          </h2>
          {data.intro && <p className={`${BODY} mt-3 max-w-[600px] text-lr-body`} dangerouslySetInnerHTML={{ __html: data.intro }} />}
        </div>

        {/* vehicle */}
        {car && (
          <div className="relative mt-4 flex justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:items-center" aria-hidden="true">
            <div className="relative w-[84%] max-w-[400px] sm:max-w-[460px] lg:w-full lg:max-w-[560px]" style={{ aspectRatio: carRatio(car) }}>
              <div className="absolute inset-x-[10%] bottom-[1%] h-[10%] rounded-[50%] bg-black/35 blur-xl dark:bg-black/85" />
              <Image src={car} alt="" fill sizes="(min-width: 1024px) 36vw, 84vw" className="object-fill drop-shadow-[0_24px_30px_rgba(24,40,31,0.28)] dark:drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]" />
            </div>
          </div>
        )}

        {/* checklist cards: full width under the header and vehicle on desktop */}
        <ol className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3 lg:col-span-2 lg:row-start-3 lg:mt-8 lg:gap-4">
          {data.items.map((item, i) => {
            const { label, text } = splitItem(item);
            return (
              <li key={item} className="relative flex flex-col items-center rounded-xl border border-lr-line bg-lr-card px-3 pb-4 pt-9 text-center shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:px-4 md:pt-10 xl:px-5 xl:pb-5">
                <span className={`${SMALL} absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded bg-lr-brand font-semibold text-lr-on-brand md:h-7 md:w-7`}>
                  {i + 1}
                </span>
                <LrIcon name={checkIcon(label)} className={ICON_LG} />
                <h3 className={`${H6} mt-2.5 text-lr-head`} dangerouslySetInnerHTML={{ __html: label }} />
                {text && <p className={`${BODY_SM} mt-1.5 text-lr-body`} dangerouslySetInnerHTML={{ __html: text }} />}
              </li>
            );
          })}
        </ol>

        {/* buy smart: under the intro on desktop */}
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-lr-green/30 bg-lr-card/90 p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] backdrop-blur-sm md:gap-6 md:p-6 lg:col-start-1 lg:row-start-2 lg:mt-6 lg:self-start">
          <svg viewBox="0 0 64 72" className="h-16 w-14 shrink-0 md:h-24 md:w-20" aria-hidden="true">
            <defs>
              {/* silver rim: a touch darker by day so it holds its edge on the white card */}
              <linearGradient id="bc-rim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" className="[stop-color:#d3d8d1] dark:[stop-color:#e9ece8]" />
                <stop offset="1" className="[stop-color:#87908a] dark:[stop-color:#9aa29a]" />
              </linearGradient>
              <linearGradient id="bc-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--lr-brand)" }} />
                <stop offset="1" style={{ stopColor: "var(--lr-brand-hover)" }} />
              </linearGradient>
            </defs>
            <path d="M32 2 60 12v20c0 18-12 30-28 38C16 62 4 50 4 32V12z" fill="url(#bc-rim)" />
            <path d="M32 7 55 15.5v16.5c0 15-10 25-23 32C19 57 9 47 9 32V15.5z" fill="url(#bc-fill)" />
            <path d="m21 35 8 8 15-17" fill="none" stroke="var(--lr-on-brand)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <h3 className={`${H5} text-lr-head`}>Buy smart. Drive with confidence.</h3>
            <p className={`${BODY_SM} mt-1.5 text-lr-body`}>
              A few checks today can save thousands tomorrow. Use this checklist to avoid the most common pitfalls.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
