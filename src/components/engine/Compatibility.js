import Image from "next/image";
import { CONTAINER, GOLD, INK, SANS, SERIF_BOLD } from "@/components/engine/engineTheme";

// Engine section: Compatible Land Rover Models - heading, cross-brand badge, production timeline,
// one card per compatibility row (side-profile photo of that generation, generation pill, badge,
// years) plus a "Compatibility Verified" card, and the engine on a cream disc. Copy from the
// page's `compatibility` JSON; the timeline uses the At a Glance "Years Produced" value when given.
// Fixed light design. 2xl values are the reference design at 1672px; xl is the same layout scaled
// for 1280-1535px; below xl the engine moves beside / above the heading.

const SERIF = SERIF_BOLD;

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

function ShieldIcon({ className }) {
  return (
    <svg viewBox="3 1.6 18 20.8" className={className} aria-hidden="true">
      <path {...line} strokeWidth="1.8" d="M12 2.6 19.6 5.6v6c0 4.7-3.2 8-7.6 9.8-4.4-1.8-7.6-5.1-7.6-9.8v-6z" style={{ color: INK }} />
      <path fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m8.6 12 2.4 2.4 4.5-4.7" />
    </svg>
  );
}

function DocCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...line} d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h4.8M14 3l4 4M14 3v4h4v4.5" />
      <path {...line} d="M9 10.5h5M9 13.5h3.5M9 16.5h2.5" />
      <circle cx="17" cy="17.2" r="4" fill={INK} />
      <path fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="m15.2 17.3 1.2 1.2 2.4-2.5" />
    </svg>
  );
}

// side-profile studio photo for a model + generation (public/engine-compat/*.webp, white background)
const CAR_RULES = [
  [/defender/i, /l663/i, "defender-l663"],
  [/defender/i, null, "defender-classic"],
  [/discovery sport/i, null, "discovery-sport"],
  [/discovery/i, /series 1|\blj\b/i, "discovery-1"],
  [/discovery/i, /series 2|l318/i, "discovery-2"],
  [/discovery/i, /series 4/i, "discovery-4"],
  [/discovery/i, /series 5|l462/i, "discovery-5"],
  [/discovery/i, /series 3|l319/i, "discovery-3"],
  [/evoque/i, /l538/i, "evoque-l538"],
  [/evoque/i, null, "evoque-l551"],
  [/velar/i, null, "velar"],
  [/freelander/i, /series 2|l359/i, "freelander-2"],
  [/freelander/i, null, "freelander-1"],
  [/range rover sport/i, /l320/i, "rrs-l320"],
  [/range rover sport/i, /l494/i, "rrs-l494"],
  [/range rover sport/i, /l461/i, "rrs-l461"],
  [/range rover/i, /classic/i, "rr-classic"],
  [/range rover/i, /p38/i, "rr-p38a"],
  [/range rover/i, /l322/i, "rr-l322"],
  [/range rover/i, /l405/i, "rr-l405"],
  [/range rover/i, /l460/i, "rr-l460"],
];
function carFor(model = "", generation = "") {
  const hit = CAR_RULES.find(([m, g]) => m.test(model) && (!g || g.test(generation)));
  return hit ? `/engine-compat/${hit[2]}.webp` : null;
}

const modelName = (model = "") => model.replace(/^Land Rover\s+/i, "");
const tidy = (t = "") => t.replace(/\s*→\s*\[[^\]]*\]/g, "").replace(/ - /g, " — ").trim();

// "200Tdi: 1989–1994 · 300Tdi: 1994–2006" -> { start: 1989, end: 2006 }; "2017–present" -> end "Present"
function productionSpan(text = "") {
  const years = (text.match(/\b(19|20)\d{2}\b/g) || []).map(Number);
  if (years.length === 0) return null;
  const start = Math.min(...years);
  return /present/i.test(text) ? { start, end: "Present", label: `In production since ${start}` } : { start, end: Math.max(...years), label: `${Math.max(...years) - start} years of production` };
}

function crossBrand(note = "") {
  if (/^exclusive to land rover\s*[-–—]\s*no cross-brand fitment\.?$/i.test(note.trim())) {
    return { title: "Land Rover Exclusive Engine", text: "This engine is exclusive to Land Rover. No cross-brand fitment." };
  }
  const title = /^exclusive/i.test(note) ? "Land Rover Exclusive Engine" : /jaguar/i.test(note) ? "Shared with Jaguar" : /bmw/i.test(note) ? "Shared with BMW" : "Cross-Brand Fitment";
  return { title, text: tidy(note) };
}

// static class maps so Tailwind sees every span the verified card can take
const SPAN = { 1: "col-span-1", 2: "col-span-2" };
const SPAN_SM = { 1: "sm:col-span-1", 2: "sm:col-span-2", 3: "sm:col-span-3" };
const SPAN_LG = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };
const fill = (n, cols) => cols - (n % cols);

/* ---------- production timeline ---------- */
function Track() {
  return (
    <span className="relative h-px min-w-3 flex-1 bg-[#9fb2a6]" aria-hidden="true">
      <span className="absolute inset-x-[4%] -top-[3.5px] hidden h-2 bg-[repeating-linear-gradient(to_right,#9fb2a6_0_1px,transparent_1px_58px)] md:block" />
    </span>
  );
}

function Dot() {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#8a7346] bg-[#f6f1e4] md:h-[11px] md:w-[11px]" aria-hidden="true" />;
}

const YEAR = "shrink-0 text-[20px] font-medium leading-none tabular-nums text-[#1b1d1a] md:text-[24px] xl:text-[23px] 2xl:text-[27px]";

function Timeline({ span }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5 sm:flex-nowrap md:gap-x-0">
      {/* small phones: the pill sits above the line; sm+: inline, a little right of centre as in the reference */}
      <span className="flex basis-full justify-center sm:order-3 sm:basis-auto md:ml-[10px] md:mr-[7px] 2xl:ml-[12px] 2xl:mr-[8px]">
        <span className="shrink-0 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.04em] text-white md:px-5 md:py-[10px] md:text-[13px] xl:px-[21px] xl:py-[10px] xl:text-[12.5px] 2xl:px-[24px] 2xl:py-[12px] 2xl:text-[14px] 2xl:tracking-normal" style={{ background: INK }}>
          {span.label}
        </span>
      </span>
      <span className={`order-1 ${YEAR}`}>{span.start}</span>
      <span className="order-2 flex flex-1 items-center gap-2 md:ml-[17px] md:flex-[1.37] md:gap-0 2xl:ml-[20px]">
        <Dot />
        <Track />
      </span>
      <span className="order-4 flex flex-1 items-center gap-2 max-sm:hidden md:gap-0">
        <Track />
      </span>
      <span className="order-5 flex items-center md:mr-[15px] 2xl:mr-[17px]">
        <Dot />
      </span>
      <span className={`order-6 ${YEAR}`}>{span.end}</span>
    </div>
  );
}

const CARD = "rounded-xl border border-[#e8e4da] bg-white shadow-[0_14px_30px_-24px_rgba(31,42,34,0.4)]";

export default function Compatibility({ data, engineName = "", years = "", slug = "" }) {
  const rows = data?.rows || [];
  if (rows.length === 0) return null;

  const span = productionSpan(years) || productionSpan(rows.map((r) => r.years).join(" "));
  const brand = crossBrand(data.crossBrandNote || "");
  const plainName = engineName.replace(/<[^>]+>/g, "");
  const fittedName = /\(/.test(plainName) ? plainName : plainName.replace(" / ", " and ");
  const n = rows.length;
  const engine = /tdi/.test(slug) ? "/variant/sec2_engine.webp" : "/engine-glance/engine.webp";
  // three models + the verified card is the reference layout: the verified card is a little narrower
  const desktopCols = n % 4 === 3 ? "xl:grid-cols-[repeat(3,minmax(0,1.25fr))_minmax(0,1fr)]" : "xl:grid-cols-4";

  return (
    <section className="relative overflow-hidden bg-[#fbf9f5] text-[#1b1d1a]" style={SANS}>
      <div className={`relative ${CONTAINER} grid grid-cols-[minmax(0,1fr)] gap-y-5 pb-6 pt-10 [grid-template-areas:'head'_'engine'_'badge'_'timeline'_'cards'] md:grid-cols-[minmax(0,1fr)_240px] md:gap-x-6 md:gap-y-6 md:pb-8 md:pt-14 md:[grid-template-areas:'head_engine'_'badge_engine'_'timeline_timeline'_'cards_cards'] lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,766fr)_minmax(0,425fr)_minmax(0,385fr)] xl:gap-x-0 xl:gap-y-0 xl:pb-[16px] xl:pt-[19px] xl:[grid-template-areas:'head_badge_engine'_'timeline_timeline_engine'_'cards_cards_engine'] 2xl:pb-[19px] 2xl:pt-[22px]`}>
        {/* heading */}
        <header className="[grid-area:head]">
          <p className="flex items-center gap-3 text-[12.5px] font-semibold uppercase leading-5 tracking-[0.04em] md:text-[14px] xl:gap-[10px] xl:text-[13px] 2xl:gap-[12px] 2xl:text-[15px] 2xl:tracking-[0.01em]" style={{ color: INK }}>
            <span className="h-[2px] w-7 xl:w-[24px] 2xl:w-[28px]" style={{ background: GOLD }} aria-hidden="true" />
            Compatibility
          </p>
          <h2 className="mt-2 text-[28px] leading-[1.15] text-[#141613] md:text-[34px] xl:mt-[7px] xl:text-[31px] 2xl:mt-[8px] 2xl:text-[36px]" style={SERIF}>
            Compatible Land Rover Models
          </h2>
          <p className="mt-2.5 max-w-[470px] text-[15px] leading-[1.55] text-[#2b2c29] md:text-[16px] xl:mt-[11px] xl:max-w-[405px] xl:text-[14px] xl:leading-[20px] 2xl:mt-[13px] 2xl:max-w-[470px] 2xl:text-[16px] 2xl:leading-[23px]">
            {fittedName} engines are fitted across {n} iconic Land Rover {n === 1 ? "model" : "models"}.
          </p>
        </header>

        {/* cross-brand badge */}
        <aside className={`${CARD} flex items-start gap-4 self-start px-4 py-4 [grid-area:badge] md:max-w-[440px] md:px-5 md:py-5 xl:w-[83%] xl:max-w-none xl:gap-[21px] xl:pb-[17px] xl:pl-[19px] xl:pr-[14px] xl:pt-[17px] 2xl:gap-[25px] 2xl:pb-[20px] 2xl:pl-[22px] 2xl:pr-[16px] 2xl:pt-[20px]`}>
          <ShieldIcon className="h-11 w-9 shrink-0 md:h-[52px] md:w-[43px] xl:mt-[3px] xl:h-[52px] xl:w-[43px] 2xl:mt-[4px] 2xl:h-[61px] 2xl:w-[50px]" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase leading-[1.3] md:text-[14.5px] xl:text-[12.5px] xl:leading-[16px] 2xl:text-[14.5px] 2xl:leading-[18px]" style={{ color: INK }}>{brand.title}</p>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[#2b2c29] md:text-[14px] xl:mt-[10px] xl:text-[12px] xl:leading-[20px] 2xl:mt-[12px] 2xl:text-[13.5px] 2xl:leading-[23px]">{brand.text}</p>
          </div>
        </aside>

        {/* engine on a cream disc */}
        <div className="relative mx-auto aspect-square w-full max-w-[260px] [grid-area:engine] md:mx-0 md:max-w-none md:self-start xl:aspect-auto xl:self-stretch" aria-hidden="true">
          <span className="absolute inset-[2%] rounded-full bg-[radial-gradient(circle_at_45%_40%,#f1efe8_0%,#eeebe3_60%,#ebe7dd_100%)] xl:inset-auto xl:left-[60%] xl:top-[49%] xl:aspect-square xl:w-[130%] xl:-translate-x-1/2 xl:-translate-y-1/2 xl:bg-[radial-gradient(circle,#eeece5_0%,#f0eee8_62%,rgba(240,238,232,0)_70.7%)]" />
          <span className="absolute -inset-[2%] xl:inset-auto xl:left-[57%] xl:top-[45%] xl:aspect-square xl:w-[114%] xl:-translate-x-1/2 xl:-translate-y-1/2">
            <Image src={engine} alt="" fill sizes="(min-width: 1280px) 420px, 280px" className="object-contain drop-shadow-[0_24px_26px_rgba(31,32,28,0.28)]" />
          </span>
        </div>

        {/* production timeline */}
        {span && (
          <div className="[grid-area:timeline] xl:mt-[12px] 2xl:mt-[14px]">
            <Timeline span={span} />
          </div>
        )}

        {/* model cards + verified card */}
        <div className={`grid grid-cols-2 gap-3 [grid-area:cards] sm:grid-cols-3 lg:grid-cols-4 xl:mt-[16px] xl:gap-[11px] 2xl:mt-[19px] 2xl:gap-[13px] ${desktopCols}`}>
          {rows.map((r, i) => {
            const car = carFor(r.model, r.generation);
            return (
              <article key={`${r.generation}-${i}`} className={`${CARD} flex flex-col px-3 pb-3 pt-4 sm:px-3.5 xl:px-[10px] xl:pb-[8px] xl:pt-[15px] 2xl:px-[12px] 2xl:pb-[9px] 2xl:pt-[17px]`}>
                <h3 className="min-h-[2.5em] pl-1 text-[13.5px] font-semibold uppercase leading-[1.25] text-[#141613] sm:text-[15px] xl:min-h-0 xl:pl-[14px] xl:text-[16.5px] xl:leading-[21px] 2xl:pl-[16px] 2xl:text-[19.5px] 2xl:leading-[24px]">{modelName(r.model)}</h3>
                <div className="relative mx-auto mt-1.5 aspect-[2/1] w-[92%] xl:mt-[4px] xl:aspect-auto xl:h-[103px] xl:w-[87%] 2xl:mt-[5px] 2xl:h-[120px]">
                  {car && <Image src={car} alt={`${modelName(r.model)} ${r.generation}`} fill sizes="(min-width: 1280px) 250px, (min-width: 640px) 30vw, 45vw" className="object-contain object-bottom mix-blend-multiply" />}
                </div>
                <span className="mx-auto mt-2.5 max-w-full truncate rounded-full px-3 py-1 text-center text-[11px] font-medium leading-[1.4] text-white sm:text-[12px] xl:mt-[10px] xl:px-[20px] xl:py-0 xl:text-[12.5px] xl:leading-[20px] 2xl:mt-[12px] 2xl:px-[24px] 2xl:text-[14.5px] 2xl:leading-[23px]" style={{ background: INK }}>
                  {r.generation}
                </span>
                <p className="mt-1.5 text-center text-[12px] leading-snug text-[#2b2c29] sm:text-[13px] xl:mt-[5px] xl:text-[12.5px] xl:leading-[18px] 2xl:mt-[6px] 2xl:text-[14px] 2xl:leading-[20px]">{r.variantBadge}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 pt-3 xl:pr-[16px] xl:pt-[9px] 2xl:pr-[19px] 2xl:pt-[11px]">
                  <span className="whitespace-nowrap rounded-md border border-[#cdb27a] bg-[#fbf6ea] px-2 py-0.5 text-[11px] font-medium leading-[1.4] text-[#6b5630] xl:px-[7px] xl:text-[11px] 2xl:px-[8px] 2xl:py-[2px] 2xl:text-[12.5px]">{r.years}</span>
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.04em] xl:text-[9px] 2xl:text-[10px]" style={{ color: INK }}>Core Model</span>
                </div>
              </article>
            );
          })}

          <article className={`${CARD} flex flex-col p-4 xl:pb-[16px] xl:pl-[20px] xl:pr-[12px] xl:pt-[14px] 2xl:pb-[19px] 2xl:pl-[23px] 2xl:pr-[14px] 2xl:pt-[16px] ${SPAN[fill(n, 2)]} ${SPAN_SM[fill(n, 3)]} ${SPAN_LG[fill(n, 4)]}`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f2ee] shadow-[inset_0_0_0_1px_#e7e5de,0_3px_8px_-3px_rgba(0,0,0,0.12)] xl:h-[56px] xl:w-[56px] 2xl:h-[66px] 2xl:w-[66px]" style={{ color: INK }}>
              <DocCheckIcon className="h-6 w-6 xl:h-[30px] xl:w-[30px] 2xl:h-[36px] 2xl:w-[36px]" />
            </span>
            <p className="mt-3 text-[13px] font-semibold uppercase leading-[1.3] text-[#141613] xl:mt-[13px] xl:text-[13px] xl:leading-[17px] 2xl:mt-[15px] 2xl:text-[15px] 2xl:leading-[19px]">Compatibility Verified</p>
            <p className="mt-1.5 max-w-[340px] text-[13px] leading-[1.6] text-[#2b2c29] xl:mt-[8px] xl:max-w-[132px] xl:text-[12px] xl:leading-[19px] 2xl:mt-[9px] 2xl:max-w-[152px] 2xl:text-[13.5px] 2xl:leading-[22px]">All compatibility data verified from model catalogues and specialist databases.</p>
            <p className="mt-auto pt-3 text-[12px] font-semibold leading-4 tracking-[0.02em] xl:pt-[13px] xl:text-[11px] 2xl:pt-[15px] 2xl:text-[12px]" style={{ color: "#2f7a4c" }}>[EM-VERIFIED]</p>
          </article>
        </div>
      </div>
    </section>
  );
}
