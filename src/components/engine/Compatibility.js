import Image from "next/image";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, H2, H6, ICON_LG, ICON_MD, LABEL, SMALL } from "@/lib/typeScale";

// Engine section: Compatible Land Rover Models - heading, cross-brand badge, production timeline,
// one card per compatibility row (side-profile photo of that generation, generation pill, badge,
// years) plus a "Compatibility Verified" card, and the engine on a cream disc. Copy from the
// page's `compatibility` JSON; the timeline uses the At a Glance "Years Produced" value when given.
// Fixed light design. 2xl values are the reference design at 1672px; xl is the same layout scaled
// for 1280-1535px; below xl the engine moves beside / above the heading.


// side-profile studio photo for a model + generation (public/engine-compat/*.webp, transparent cut-outs)
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
    <span className="relative h-px min-w-3 flex-1 bg-lr-line-strong" aria-hidden="true">
      <span className="absolute inset-x-[4%] -top-[3.5px] hidden h-2 bg-[repeating-linear-gradient(to_right,var(--lr-line-strong)_0_1px,transparent_1px_58px)] md:block" />
    </span>
  );
}

function Dot() {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-lr-gold-line bg-lr-card md:h-[11px] md:w-[11px]" aria-hidden="true" />;
}

const YEAR = "shrink-0 text-[18px] font-medium leading-none tabular-nums text-lr-head md:text-[19px] xl:text-[20px]";

function Timeline({ span }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5 sm:flex-nowrap md:gap-x-0">
      {/* small phones: the pill sits above the line; sm+: inline, a little right of centre as in the reference */}
      <span className="flex basis-full justify-center sm:order-3 sm:basis-auto md:ml-[10px] md:mr-[7px]">
        <span className="shrink-0 rounded-full px-4 py-1.5 text-[12px] font-medium uppercase leading-none tracking-[0.04em] bg-lr-brand text-lr-on-brand md:px-5 md:py-[10px] md:text-[14px] xl:px-[21px] xl:py-[11px] xl:text-[15px]">
          {span.label}
        </span>
      </span>
      <span className={`order-1 ${YEAR}`}>{span.start}</span>
      <span className="order-2 flex flex-1 items-center gap-2 md:ml-[17px] md:flex-[1.37] md:gap-0">
        <Dot />
        <Track />
      </span>
      <span className="order-4 flex flex-1 items-center gap-2 max-sm:hidden md:gap-0">
        <Track />
      </span>
      <span className="order-5 flex items-center md:mr-[15px]">
        <Dot />
      </span>
      <span className={`order-6 ${YEAR}`}>{span.end}</span>
    </div>
  );
}

const CARD = "rounded-xl border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)]";

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
    <section className="relative overflow-hidden bg-lr-band text-lr-head" style={SANS}>
      <div className={`relative ${CONTAINER} grid grid-cols-[minmax(0,1fr)] gap-y-5 pb-6 pt-10 [grid-template-areas:'head'_'engine'_'badge'_'timeline'_'cards'] md:grid-cols-[minmax(0,1fr)_240px] md:gap-x-6 md:gap-y-6 md:pb-8 md:pt-14 md:[grid-template-areas:'head_engine'_'badge_engine'_'timeline_timeline'_'cards_cards'] lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)_minmax(0,300px)] xl:gap-x-0 xl:gap-y-0 xl:pb-8 xl:pt-16 xl:[grid-template-areas:'head_badge_engine'_'timeline_timeline_engine'_'cards_cards_engine']`}>
        {/* heading */}
        <header className="[grid-area:head]">
          <p className={`flex items-center gap-3 ${LABEL} text-lr-ink xl:gap-[10px] dark:text-lr-gold`}>
            <span className="h-[2px] w-7 bg-lr-gold-line xl:w-[24px]" aria-hidden="true" />
            Compatibility
          </p>
          <h2 className={`mt-2 ${H2} text-lr-ink xl:mt-[7px]`}>
            Compatible Land Rover Models
          </h2>
          <p className={`mt-2.5 max-w-[470px] ${BODY} text-lr-body xl:mt-[11px]`}>
            {fittedName} engines are fitted across {n} iconic Land Rover {n === 1 ? "model" : "models"}.
          </p>
        </header>

        {/* cross-brand badge */}
        <aside className={`${CARD} flex items-start gap-4 self-start px-4 py-4 [grid-area:badge] md:max-w-[440px] md:px-5 md:py-5 xl:mr-6 xl:max-w-none xl:gap-[21px] xl:pb-[17px] xl:pl-[19px] xl:pr-[14px] xl:pt-[17px]`}>
          <LrIcon name="independent-and-impartial" className={`${ICON_LG} xl:mt-[3px]`} />
          <div className="min-w-0">
            <p className={`${LABEL} text-lr-ink dark:text-lr-green`}>{brand.title}</p>
            <p className={`mt-1.5 ${SMALL} leading-[1.55] text-lr-body xl:mt-[8px]`}>{brand.text}</p>
          </div>
        </aside>

        {/* engine on a cream disc */}
        <div className="relative mx-auto aspect-square w-full max-w-[260px] [grid-area:engine] md:mx-0 md:max-w-none md:self-start xl:aspect-auto xl:self-stretch" aria-hidden="true">
          <span className="absolute inset-[2%] rounded-full bg-[radial-gradient(circle_at_45%_40%,#f1efe8_0%,#eeebe3_60%,#ebe7dd_100%)] dark:bg-[radial-gradient(circle_at_45%_40%,#21423a_0%,#1a362e_60%,#163027_100%)] xl:inset-auto xl:left-[60%] xl:top-[49%] xl:aspect-square xl:w-[130%] xl:-translate-x-1/2 xl:-translate-y-1/2 xl:bg-[radial-gradient(circle,#eeece5_0%,#f0eee8_62%,rgba(240,238,232,0)_70.7%)] xl:dark:bg-[radial-gradient(circle,#21423a_0%,#1a362e_62%,rgba(26,54,46,0)_70.7%)]" />
          <span className="absolute -inset-[2%] xl:inset-auto xl:left-[57%] xl:top-[45%] xl:aspect-square xl:w-[114%] xl:-translate-x-1/2 xl:-translate-y-1/2">
            <Image src={engine} alt="" fill sizes="(min-width: 1280px) 420px, 280px" className="object-contain drop-shadow-[0_24px_26px_rgba(31,32,28,0.28)]" />
          </span>
        </div>

        {/* production timeline */}
        {span && (
          <div className="[grid-area:timeline] xl:mt-[12px] xl:pr-6">
            <Timeline span={span} />
          </div>
        )}

        {/* model cards + verified card */}
        <div className={`grid grid-cols-2 gap-3 [grid-area:cards] sm:grid-cols-3 lg:grid-cols-4 xl:mt-[16px] xl:gap-[11px] xl:pr-6 ${desktopCols}`}>
          {rows.map((r, i) => {
            const car = carFor(r.model, r.generation);
            return (
              <article key={`${r.generation}-${i}`} className={`${CARD} flex flex-col px-3 pb-3 pt-4 sm:px-3.5 xl:px-[10px] xl:pb-[8px] xl:pt-[15px]`}>
                <h3 className={`min-h-[2.5em] pl-1 ${H6} uppercase leading-[1.25] text-lr-head xl:pl-[14px]`}>{modelName(r.model)}</h3>
                <div className="relative mx-auto mt-1.5 aspect-[2/1] w-[92%] xl:mt-[4px] xl:aspect-auto xl:h-[103px] xl:w-[87%]">
                  {car && <Image src={car} alt={`${modelName(r.model)} ${r.generation}`} fill sizes="(min-width: 1280px) 250px, (min-width: 640px) 30vw, 45vw" className="object-contain object-bottom" />}
                </div>
                <span className="mx-auto mt-2.5 max-w-full truncate rounded-full px-3 py-1 text-center text-[12px] font-medium leading-[1.4] bg-lr-brand text-lr-on-brand md:text-[14px] xl:mt-[10px] xl:px-[18px] xl:py-[2px] xl:text-[15px]">
                  {r.generation}
                </span>
                <p className={`mt-1.5 text-center ${SMALL} text-lr-body xl:mt-[6px]`}>{r.variantBadge}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 pt-3 xl:pr-[16px] xl:pt-[9px]">
                  <span className="whitespace-nowrap rounded-md border border-lr-gold-line/70 bg-lr-gold-line/10 px-2 py-0.5 text-[12px] font-medium leading-[1.4] text-lr-gold md:text-[13px] xl:px-[7px] xl:text-[15px]">{r.years}</span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.04em] md:text-[13px] xl:text-[15px] text-lr-ink dark:text-lr-green">Core Model</span>
                </div>
              </article>
            );
          })}

          <article className={`${CARD} flex flex-col p-4 xl:pb-[16px] xl:pl-[20px] xl:pr-[12px] xl:pt-[14px] ${SPAN[fill(n, 2)]} ${SPAN_SM[fill(n, 3)]} ${SPAN_LG[fill(n, 4)]}`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lr-chip text-lr-ink shadow-[inset_0_0_0_1px_var(--lr-line),0_3px_8px_-3px_var(--lr-shadow)] xl:h-[48px] xl:w-[48px] dark:text-lr-green">
              <LrIcon name="oem-references" className={ICON_MD} />
            </span>
            <p className={`mt-3 ${H6} uppercase leading-[1.25] text-lr-head xl:mt-[13px]`}>Compatibility Verified</p>
            <p className={`mt-1.5 max-w-[340px] ${BODY_SM} text-lr-body xl:mt-[8px]`}>All compatibility data verified from model catalogues and specialist databases.</p>
            <p className={`mt-auto pt-3 ${SMALL} font-medium tracking-[0.02em] text-lr-green xl:pt-[13px]`}>[EM-VERIFIED]</p>
          </article>
        </div>
      </div>
    </section>
  );
}
