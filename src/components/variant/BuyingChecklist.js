import Image from "next/image";
import VIcon from "@/components/variant/VariantIcons";
import { carRatio } from "@/lib/carGeometry";
import { stripBullet, topicIcon } from "@/components/variant/variantText";

// Variant section: buying checklist - numbered check cards from the page's `buyingChecklist`
// JSON, the vehicle, and a "Buy smart" reassurance card. Fixed dark design.

const INK = "#a9c47e";
const SERIF = { fontFamily: "var(--font-serif-display), Georgia, 'Times New Roman', serif" };

// "* Cold Start - Listen for rattle ..." -> label + text
function splitItem(item = "") {
  const clean = stripBullet(item);
  const dash = clean.indexOf(" - ");
  return dash === -1 ? { label: clean, text: "" } : { label: clean.slice(0, dash), text: clean.slice(dash + 3) };
}

function checkIcon(label = "") {
  const t = label.toLowerCase();
  if (/cold start|listen|noise/.test(t)) return "ear";
  if (/coolant|cooling/.test(t)) return "tank";
  if (/turbo|boost/.test(t)) return "turbo";
  if (/oil/.test(t)) return "oilcan";
  if (/smoke|exhaust/.test(t)) return "smoke";
  if (/warning|light|diagnos|fault/.test(t)) return "engine";
  if (/mot/.test(t)) return "docsearch";
  return topicIcon(label);
}

export default function BuyingChecklist({ data, car = null }) {
  if (!data?.items?.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0b0d0a] text-white">
      {/* soft studio backdrop behind the vehicle */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 45% 60% at 82% 28%, rgba(92,110,84,0.32) 0%, rgba(40,48,36,0.15) 48%, transparent 76%)" }}
      />

      <div className="relative mx-auto grid max-w-8xl border-t border-white/10 px-4 py-10 sm:px-6 md:px-8 md:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-x-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#c9a24a] md:text-[13px]">Before You Buy</p>
          <h2 className="mt-2 text-[32px] uppercase leading-[1.05] tracking-[0.01em] text-white sm:text-[40px] lg:text-[50px]" style={SERIF}>
            Buying Checklist
          </h2>
          {data.intro && <p className="mt-3 max-w-[560px] text-[15px] leading-[1.6] text-white/80 md:text-[17px]" dangerouslySetInnerHTML={{ __html: data.intro }} />}
        </div>

        {/* vehicle */}
        {car && (
          <div className="relative mt-4 flex justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:items-start" aria-hidden="true">
            <div className="relative w-[84%] max-w-[400px] sm:max-w-[460px] lg:mt-2 lg:w-full lg:max-w-[560px]" style={{ aspectRatio: carRatio(car) }}>
              <div className="absolute inset-x-[10%] bottom-[1%] h-[10%] rounded-[50%] bg-black/85 blur-xl" />
              <Image src={car} alt="" fill sizes="(min-width: 1024px) 36vw, 84vw" className="object-fill drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]" />
            </div>
          </div>
        )}

        {/* checklist cards */}
        <ol className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3 lg:col-start-1 lg:row-start-2 lg:mt-7">
          {data.items.map((item, i) => {
            const { label, text } = splitItem(item);
            return (
              <li key={item} className="relative flex flex-col items-center rounded-xl border border-white/12 bg-white/[0.03] px-3 pb-4 pt-9 text-center md:px-3.5 md:pt-10">
                <span className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded text-[12px] font-semibold text-white md:h-7 md:w-7 md:text-[13px]" style={{ background: "#3e5a2c" }}>
                  {i + 1}
                </span>
                <VIcon name={checkIcon(label)} className="h-10 w-10 md:h-12 md:w-12" style={{ color: INK }} strokeWidth={1.4} />
                <h3 className="mt-2.5 text-[14.5px] font-semibold leading-tight text-white md:text-[16px]" dangerouslySetInnerHTML={{ __html: label }} />
                {text && <p className="mt-1.5 text-[12.5px] leading-[1.5] text-white/65 md:text-[13px]" dangerouslySetInnerHTML={{ __html: text }} />}
              </li>
            );
          })}
        </ol>

        {/* buy smart */}
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#7f9f4f]/30 bg-[#0f130e]/90 p-4 backdrop-blur-sm md:gap-6 md:p-6 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-end">
          <svg viewBox="0 0 64 72" className="h-16 w-14 shrink-0 md:h-24 md:w-20" aria-hidden="true">
            <defs>
              <linearGradient id="bc-rim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e9ece8" />
                <stop offset="1" stopColor="#9aa29a" />
              </linearGradient>
              <linearGradient id="bc-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2f5a35" />
                <stop offset="1" stopColor="#173219" />
              </linearGradient>
            </defs>
            <path d="M32 2 60 12v20c0 18-12 30-28 38C16 62 4 50 4 32V12z" fill="url(#bc-rim)" />
            <path d="M32 7 55 15.5v16.5c0 15-10 25-23 32C19 57 9 47 9 32V15.5z" fill="url(#bc-fill)" />
            <path d="m21 35 8 8 15-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <h3 className="text-[20px] leading-tight text-white md:text-[26px]" style={SERIF}>Buy smart. Drive with confidence.</h3>
            <p className="mt-1.5 text-[14px] leading-[1.55] text-white/80 md:text-[16px]">
              A few checks today can save thousands tomorrow. Use this checklist to avoid the most common pitfalls.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
