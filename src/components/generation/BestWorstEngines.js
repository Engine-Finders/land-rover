"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose } from "@/components/models/modelKit";
import { keyEngines, stripHtml } from "@/components/models/engineSections";
import { localHtml } from "@/components/models/generationsFaqLinks";

// Generation page section 4 - best & worst engines, built to the approved Defender L316 reference:
// the eyebrow and "Best & Worst Engines" headline; a carousel of verdict cards (best diesel, best
// petrol, highest risk, most expensive failure, best value), each with its coloured icon and label,
// the engine name over its code and years beside an engine shot, the verdict quote, "Who it's for"
// and a coloured foot; prev / next arrows; then the wide "Most overlooked" card.
// Phones: swipe through the cards (the next one peeks in), the wide card stacked. Pages with one
// "Thin-Data Summary" show it as the wide card; pages with none hide the section.

// slot -> accent (light / night) and icon
const SLOTS = {
  "Best Diesel Overall": { tone: "text-[#1d6b3c] dark:text-[#7fd1a0]", bar: "border-b-[#1d6b3c] dark:border-b-[#5fbf86]", icon: "check" },
  "Best Petrol Overall": { tone: "text-[#2346a0] dark:text-[#8eaaf5]", bar: "border-b-[#2346a0] dark:border-b-[#6d8fe6]", icon: "star" },
  "Highest Risk": { tone: "text-[#c62828] dark:text-[#ff8f8f]", bar: "border-b-[#c62828] dark:border-b-[#e25b5b]", icon: "warn" },
  "Most Expensive Failure": { tone: "text-[#d9771e] dark:text-[#ffb36b]", bar: "border-b-[#d9771e] dark:border-b-[#e8913f]", icon: "pound" },
  "Best Value": { tone: "text-[#163f27] dark:text-[#9fd8b4]", bar: "border-b-[#163f27] dark:border-b-[#4f9a6d]", icon: "tag" },
  "Most Overlooked": { tone: "text-[#1f3f8f] dark:text-[#8eaaf5]", bar: "border-b-[#1f3f8f] dark:border-b-[#6d8fe6]", icon: "shield" },
};
const FALLBACK = { tone: "text-lr-ink dark:text-lr-green", bar: "border-b-lr-ink dark:border-b-lr-green", icon: "info" };

// "2.4 Td4 (DT244(PUMA), 2007–2012)" -> { name: "2.4 Td4", code: "(DT244(PUMA))", years: "2007–2012" }
function splitEngine(raw = "") {
  const text = String(raw).trim();
  const open = text.indexOf("(");
  if (open === -1 || !text.endsWith(")")) return { name: text, code: "", years: "" };
  const name = text.slice(0, open).trim();
  const inner = text.slice(open + 1, -1).trim();
  const m = inner.match(/^(.*?),\s*((?:\d{4}|c\.\s?\d{4})[^,()]*)$/);
  return m ? { name, code: m[1] ? `(${m[1]})` : "", years: m[2] } : { name, code: `(${inner})`, years: "" };
}

// Some pages hold the verdict inside the engine field ("306DT D350 – \"The 350 PS version …\"", with an
// empty quote) or the engine's common name after a dash ("224DT (DW12BTED4) - 2.2 TD4/SD4"): split
// them so the card reads name / code / quote like the rest.
function normalise(item) {
  const raw = String(item.engine || "");
  const m = raw.match(/^(.*?)\s+[-–]\s+(.+)$/s);
  const capital = (t) => String(t || "").trim().replace(/^[a-z]/, (c) => c.toUpperCase());
  let { engine, quote } = item;
  if (m) {
    const tail = m[2].trim();
    if (tail.length > 40 && !String(quote || "").trim()) {
      engine = m[1].trim();
      quote = tail.replace(/^["“]|["”]$/g, "");
    } else if (tail.length <= 40) {
      engine = `${tail} (${m[1].trim()})`;
    }
  }
  return { ...item, engine, quote, whoItsFor: capital(item.whoItsFor) };
}

const html = (raw) => localHtml(prose(raw || ""));
const quoted = (raw) => {
  const t = html(raw).trim();
  return t ? `“${t.replace(/^["“]|["”]$/g, "")}”` : "";
};

function SlotIcon({ icon, className = "" }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
      {icon === "warn" ? (
        <g {...p} strokeWidth="2">
          <path d="M14.2 4.6 2.8 24.4A2 2 0 0 0 4.6 27.4h22.8a2 2 0 0 0 1.8-3L17.8 4.6a2 2 0 0 0-3.6 0Z" />
          <path d="M16 12v6.5M16 22.6h.01" />
        </g>
      ) : (
        <g {...p}>
          <circle cx="16" cy="16" r="13.5" />
          {icon === "check" && <path d="m10 16.4 4 4 8-8.6" strokeWidth="2.2" />}
          {icon === "star" && <path d="m16 8.6 2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L16 8.6Z" />}
          {icon === "pound" && <path d="M19.5 10.4a3.6 3.6 0 0 0-6.3 2.4v8.6M11 16.4h6.4M11 21.4h9.6" strokeWidth="2" />}
          {icon === "tag" && (
            <>
              <path d="M9.4 15.8V10a.6.6 0 0 1 .6-.6h5.8l7 7a1.2 1.2 0 0 1 0 1.7l-4.7 4.7a1.2 1.2 0 0 1-1.7 0l-7-7Z" />
              <circle cx="13" cy="13" r="1.2" />
            </>
          )}
          {icon === "info" && <path d="M16 14.6v7M16 10.4h.01" strokeWidth="2.2" />}
        </g>
      )}
    </svg>
  );
}

// the navy shield with the Land Rover-green emblem of the "Most overlooked" card
function Shield({ className = "" }) {
  return (
    <svg viewBox="0 0 80 92" className={className} aria-hidden="true">
      <path d="M40 3 75 15v28c0 22-15 39.5-35 46C20 82.5 5 65 5 43V15Z" className="fill-[#16295c] dark:fill-[#1e3a7a]" />
      <path d="M40 11 67 20.5V43c0 17.5-11.5 31.5-27 37-15.5-5.5-27-19.5-27-37V20.5Z" className="fill-[#2a56b8] dark:fill-[#3a68cf]" />
      <path d="M40 28c-4.6 0-7.4 3.6-6.6 7.6-4 .4-6.4 3.8-5.6 7.6.8 4 4.6 5.8 8.2 5v5.6h8v-5.6c3.6.8 7.4-1 8.2-5 .8-3.8-1.6-7.2-5.6-7.6.8-4-2-7.6-6.6-7.6Z" fill="#9cc2ff" fillOpacity="0.85" />
    </svg>
  );
}

function EngineShot({ src, alt, className = "" }) {
  if (!src) return null;
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 140px, 120px" className="object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.22)] dark:brightness-[.92]" />
    </span>
  );
}

function EngineName({ engine, size = "card" }) {
  return (
    <div className="min-w-0">
      <h3
        className={`font-semibold leading-tight tracking-[-0.01em] text-lr-head ${size === "card" ? "text-[24px] xl:text-[26px]" : "text-[24px] xl:text-[28px]"} [&_a]:text-inherit [&_a]:no-underline`}
        dangerouslySetInnerHTML={{ __html: html(engine.name) }}
      />
      {engine.code && <p className="mt-1.5 text-[14px] leading-snug text-lr-body xl:text-[15px] [&_a]:text-inherit [&_a]:no-underline" dangerouslySetInnerHTML={{ __html: html(engine.code) }} />}
      {engine.years && <p className="mt-1.5 text-[14px] leading-snug text-lr-body xl:text-[15px]">{engine.years}</p>}
    </div>
  );
}

function Who({ text, tone }) {
  if (!text) return null;
  return (
    <div className="mt-5 border-t border-lr-line pt-4">
      <p className={`text-[15px] font-semibold leading-snug ${tone}`}>Who it&rsquo;s for:</p>
      <p className="mt-1.5 text-[14px] leading-[1.6] text-lr-body xl:text-[15px]" dangerouslySetInnerHTML={{ __html: html(text) }} />
    </div>
  );
}

function Card({ item, shot }) {
  const s = SLOTS[item.slot] || FALLBACK;
  const engine = splitEngine(item.engine);
  return (
    <li className={`flex min-w-0 shrink-0 snap-start flex-col rounded-xl border border-lr-line border-b-[5px] bg-lr-card p-5 shadow-[0_18px_44px_-36px_var(--lr-shadow)] xl:p-6 ${s.bar} basis-[84%] sm:basis-[58%] md:basis-[calc((100%-16px)/2.1)] lg:basis-[calc((100%-32px)/3)] xl:basis-[calc((100%-48px)/4)] 2xl:basis-[calc((100%-64px)/5)]`}>
      <p className={`flex items-center gap-3 text-[15px] font-semibold leading-snug ${s.tone}`}>
        <SlotIcon icon={s.icon} className="h-9 w-9 xl:h-10 xl:w-10" />
        {item.slot}
      </p>
      <div className="mt-4 flex items-start justify-between gap-3">
        <EngineName engine={engine} />
        <EngineShot src={shot} alt={`${stripHtml(engine.name)} engine`} className="-mr-1 -mt-2 h-[96px] w-[108px] xl:h-[106px] xl:w-[120px]" />
      </div>
      <p className="mt-4 text-[14px] leading-[1.62] text-lr-body" dangerouslySetInnerHTML={{ __html: quoted(item.quote) }} />
      <div className="mt-auto">
        <Who text={item.whoItsFor} tone={s.tone} />
      </div>
    </li>
  );
}

// the wide card: "Most overlooked", or a page's single thin-data summary
function WideCard({ item, shot }) {
  const s = SLOTS[item.slot] || FALLBACK;
  const engine = splitEngine(item.engine);
  const hasEngine = Boolean(engine.name);
  return (
    <div className={`mt-5 grid overflow-hidden rounded-xl border border-lr-line border-b-[5px] bg-lr-card shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:mt-6 ${s.bar} ${hasEngine ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.55fr)_minmax(0,0.85fr)]" : ""}`}>
      <div className="flex items-start gap-4 p-5 sm:items-center xl:gap-6 xl:px-8 xl:py-6">
        {item.slot === "Most Overlooked" ? (
          <Shield className="h-auto w-14 shrink-0 sm:w-16 xl:w-[76px]" />
        ) : (
          <SlotIcon icon={s.icon} className={`h-12 w-12 ${s.tone}`} />
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-[15px] font-semibold leading-snug xl:text-[16px] ${s.tone}`}>{item.slot}</p>
          {hasEngine && (
            <div className="mt-1.5">
              <EngineName engine={engine} size="wide" />
            </div>
          )}
        </div>
        {hasEngine && <EngineShot src={shot} alt={`${stripHtml(engine.name)} engine`} className="h-[72px] w-[82px] sm:h-[96px] sm:w-[110px] xl:h-[118px] xl:w-[134px]" />}
      </div>
      <div className={`relative border-t border-lr-line px-5 py-5 lg:flex lg:items-center lg:border-t-0 xl:px-8 ${hasEngine ? "lg:before:absolute lg:before:inset-y-6 lg:before:left-0 lg:before:w-px lg:before:bg-lr-line" : "lg:pt-0"}`}>
        <p className="text-[14px] leading-[1.65] text-lr-body xl:text-[15px]" dangerouslySetInnerHTML={{ __html: hasEngine ? quoted(item.quote) : html(item.quote) }} />
      </div>
      {item.whoItsFor && (
        <div className="relative border-t border-lr-line px-5 py-5 lg:flex lg:flex-col lg:justify-center lg:border-t-0 lg:before:absolute lg:before:inset-y-6 lg:before:left-0 lg:before:w-px lg:before:bg-lr-line xl:px-8">
          <p className={`text-[15px] font-semibold leading-snug ${s.tone}`}>Who it&rsquo;s for:</p>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-lr-body xl:text-[15px]" dangerouslySetInnerHTML={{ __html: html(item.whoItsFor) }} />
        </div>
      )}
    </div>
  );
}

function ArrowButton({ dir, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir < 0 ? "Previous engines" : "Next engines"}
      className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border outline-none transition focus-visible:ring-2 focus-visible:ring-lr-green disabled:cursor-default disabled:opacity-45 md:flex xl:h-[52px] xl:w-[52px] ${
        dir < 0
          ? "-left-5 border-lr-line-strong bg-lr-card text-lr-head shadow-[0_10px_24px_-14px_var(--lr-shadow)] hover:enabled:border-lr-green xl:-left-7"
          : "-right-5 border-transparent bg-lr-brand text-lr-on-brand shadow-[0_12px_26px_-14px_rgba(18,61,42,0.8)] hover:enabled:bg-lr-brand-hover xl:-right-7"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir < 0 ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"} />
      </svg>
    </button>
  );
}

export default function BestWorstEngines({ data }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  // re-check the ends whenever the track or its cards change size (window resize, fonts, images)
  useEffect(() => {
    const el = track.current;
    update();
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const items = (data?.items || []).map(normalise);
  if (!items.length) return null;

  const wide = items.find((i) => i.slot === "Most Overlooked") || (items.length === 1 ? items[0] : null);
  const cards = items.filter((i) => i !== wide);

  // one engine shot per engine name, never the same shot for two different engines where avoidable
  const names = [...new Set(items.map((i) => stripHtml(splitEngine(i.engine).name)).filter(Boolean))];
  const shots = Object.fromEntries(keyEngines(names.join(", ")).map((e, i) => [names[i], e.shot]));
  const shotOf = (item) => shots[stripHtml(splitEngine(item.engine).name)] || "";

  const go = (dir) => {
    const el = track.current;
    const card = el?.firstElementChild;
    if (!card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  return (
    <section className={`bg-lr-page py-10 text-lr-head md:py-14 xl:py-16 ${SANS}`}>
      <div className={CONTAINER}>
        <p className="flex items-center gap-3 text-[13px] font-semibold uppercase leading-none tracking-[0.08em] text-lr-ink md:text-[14px] xl:text-[15px] dark:text-lr-green">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          Best &amp; Worst Engines
        </p>
        <h2 className={`${H2_MODEL} mt-3.5 text-lr-head md:mt-4`}>Best &amp; Worst Engines</h2>

        {cards.length > 0 && (
          <div className="relative mt-6 md:mt-8 xl:mt-9">
            <ul
              ref={track}
              onScroll={update}
              className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
              aria-label="Best and worst engines"
            >
              {cards.map((item, i) => (
                <Card key={`${item.slot}-${i}`} item={item} shot={shotOf(item)} />
              ))}
            </ul>
            {!(edge.start && edge.end) && (
              <>
                <ArrowButton dir={-1} disabled={edge.start} onClick={() => go(-1)} />
                <ArrowButton dir={1} disabled={edge.end} onClick={() => go(1)} />
              </>
            )}
          </div>
        )}

        {wide && <WideCard item={wide} shot={shotOf(wide)} />}
      </div>
    </section>
  );
}
