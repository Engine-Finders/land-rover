"use client";

import { useId, useState } from "react";
import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { Chevron, H2_MODEL, INTRO, SANS, Stars, parseRating, prose, splitHeading } from "@/components/models/modelKit";
import { cellHtml, splitTags, stripHtml } from "@/components/models/engineSections";
import { localHtml } from "@/components/models/generationsFaqLinks";
import { engineDbCar, genCode } from "./genKit";

// Generation page section 2 - the engine database, built to the approved Defender L316 references
// (day + night): the green eyebrow, the serif "… Engine Codes — / The Complete Database" headline
// and a two-line intro; on the right the Highland glen (a soft fade by day, a diagonal gold-edged cut
// at night, the green-and-gold stripe at the right edge by day) with the generation's own car
// standing on it; the ten-column engine table overlapping the photo's foot (fuel icon, stars with
// their data tag, the enquiry figure and recon cost with their tags underneath); then the "How
// confident are these ratings?" panel - shield, the rating tiers and the method note.
// Phones / tablets: the copy, the glen with the car full-bleed, one card per engine (four, then
// "View all"), and the panel stacked. Laptops (1280px+): the table.
// Keeps id="engine-database": the hero's Explore button scrolls here.

const KEYS = ["engineCode", "family", "fuel", "displacement", "power", "years", "variants", "reliability", "enquiries", "avgReconCost"];
const DEFAULT_LABELS = ["Engine Code", "Family", "Fuel", "Displacement", "Power", "Years", "Variants", "Reliability", "2025 Enquiries", "Avg. Recon Cost"];
// fixed-layout column widths (%), from the reference
const WIDTHS = [12, 10, 10, 9.5, 8.5, 9, 9, 10.5, 9.5, 12];
// cards shown before "View all": two rows of two on phones/tablets, two rows of three on small laptops
const LIMIT_CARDS = 4;
const LIMIT_WIDE = 6;

const LINKS = "[&_a]:font-[inherit] [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline";
const CODE_LINKS = "[&_a]:font-[inherit] [&_a]:text-lr-head [&_a]:no-underline hover:[&_a]:text-lr-green hover:[&_a]:underline";

// the Highland loch with the rocky foreground the car stands on (golden hour by day, storm at night)
const BG = "bg-[url(/home/hero-loch-day-m.webp)] sm:bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:dark:bg-[url(/home/hero-loch-night.webp)]";

const html = (raw) => localHtml(cellHtml(raw || ""));

// ------------------------------------------------------------------ cells

// "Diesel, common-rail turbo" -> { kind: "diesel", main: "Diesel", sub: "common-rail turbo" }
function splitFuel(raw = "") {
  const text = stripHtml(raw);
  const m = text.match(/^([^,\s]+)[,\s]*(.*)$/);
  return { kind: /diesel/i.test(text) ? "diesel" : "petrol", main: m ? m[1] : text, sub: m ? m[2] : "" };
}

function Fuel({ value, stacked = true }) {
  if (!value) return <span className="text-lr-muted">—</span>;
  const f = splitFuel(value);
  const tone = f.kind === "diesel" ? "text-lr-green" : "text-lr-warn";
  return (
    <span className="inline-flex flex-col items-center gap-0.5 leading-snug">
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-lr-head">
        <LrIcon name="petrol" tone="current" className={`h-[18px] w-[18px] shrink-0 xl:h-5 xl:w-5 ${tone}`} />
        {f.main}
      </span>
      {f.sub && stacked && <span className="text-[12.5px] text-lr-muted min-[1440px]:text-[13px]">{f.sub}</span>}
    </span>
  );
}

// "★★★☆☆ [PROVISIONAL - pending dedicated Engine Page]" -> stars + "PROVISIONAL"
function Rating({ value, inline = false }) {
  const r = parseRating(value);
  if (!r.stars) return <span className="text-lr-muted">—</span>;
  const tag = (r.rest.match(/\[([^\]]+)\]/)?.[1] || stripHtml(r.rest)).trim();
  const label = tag.split(/\s+[-–—]\s+/)[0];
  return (
    <span className={`inline-flex ${inline ? "flex-wrap items-center gap-x-2.5 gap-y-1" : "flex-col items-center gap-1"}`} title={tag || undefined}>
      <Stars full={r.full} half={r.half} empty={r.empty} size="h-4 w-4 xl:h-[17px] xl:w-[17px]" className="gap-0.5 dark:text-lr-gold!" />
      {label && <span className="text-[11.5px] font-medium uppercase leading-none tracking-[0.08em] text-lr-body dark:text-lr-muted">{label}</span>}
      {tag !== label && <span className="sr-only">{tag.slice(label.length).replace(/^\s*[-–—]\s*/, "")}</span>}
    </span>
  );
}

// "700 (JLR-wide) [EM-VERIFIED]" -> "700" over "(JLR-wide) [EM-VERIFIED]"; "- (pattern data)" -> "—" over "(pattern data)"
function Enquiries({ value }) {
  const raw = String(value || "").trim();
  if (!raw) return <span className="text-lr-muted">—</span>;
  const { main, tags } = splitTags(raw.replace(/^\[PATTERN DATA\]$/i, "- (pattern data)"));
  const text = main.replace(/\s+/g, " ").trim();
  const m = text.match(/^(—|[\d,]+\+?)\s*(.*)$/);
  const figure = m ? m[1] : text;
  const sub = m ? m[2] : "";
  return (
    <span className="inline-flex flex-col items-center gap-0.5 leading-snug">
      <span className={figure === "—" ? "text-lr-muted" : "font-semibold text-lr-head"} dangerouslySetInnerHTML={{ __html: figure }} />
      {(sub || tags.length > 0) && (
        <span className="text-[12.5px] text-lr-muted xl:text-[13px]">
          {sub && <span dangerouslySetInnerHTML={{ __html: sub }} />}
          {tags.map((t, i) => (
            <span key={i} className="block" dangerouslySetInnerHTML={{ __html: t }} />
          ))}
        </span>
      )}
    </span>
  );
}

function Cost({ value }) {
  const { main, tags } = splitTags(value || "");
  if (!main && !tags.length) return <span className="text-lr-muted">—</span>;
  return (
    <span className="inline-flex flex-col items-center gap-0.5 leading-snug">
      {main && <span className="whitespace-nowrap font-semibold text-lr-head" dangerouslySetInnerHTML={{ __html: main }} />}
      {tags.map((t, i) => (
        <span key={i} className="text-[12.5px] xl:text-[13px]" dangerouslySetInnerHTML={{ __html: t }} />
      ))}
    </span>
  );
}

function Plain({ value, className = "" }) {
  const v = html(value);
  return v ? <span className={`${LINKS} ${className}`} dangerouslySetInnerHTML={{ __html: v }} /> : <span className="text-lr-muted">—</span>;
}

function Cell({ field, engine }) {
  const v = engine[field];
  if (field === "engineCode") return <Plain value={v} className={`font-semibold text-lr-head ${CODE_LINKS}`} />;
  if (field === "fuel") return <Fuel value={v} />;
  if (field === "reliability") return <Rating value={v} />;
  if (field === "enquiries") return <Enquiries value={v} />;
  if (field === "avgReconCost") return <Cost value={v} />;
  return <Plain value={v} />;
}

// ------------------------------------------------------------------ phone / tablet card

function EngineCard({ engine, labels, className = "" }) {
  const label = (field) => labels[KEYS.indexOf(field)];
  const fuelSub = splitFuel(engine.fuel).sub;
  return (
    <li className={`min-w-0 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`text-[17px] font-semibold leading-snug text-lr-head md:text-[18px] ${CODE_LINKS}`} dangerouslySetInnerHTML={{ __html: html(engine.engineCode) || "—" }} />
          {(engine.family || fuelSub) && (
            <p className={`mt-0.5 text-[14px] leading-snug text-lr-body ${LINKS}`}>
              {engine.family && <span dangerouslySetInnerHTML={{ __html: html(engine.family) }} />}
              {fuelSub && <span className="text-lr-muted">{engine.family ? " · " : ""}{fuelSub}</span>}
            </p>
          )}
        </div>
        {engine.fuel && (
          <span className="shrink-0 rounded-full border border-lr-line bg-lr-panel/70 px-2.5 py-1.5 text-[13px] font-medium">
            <Fuel value={engine.fuel} stacked={false} />
          </span>
        )}
      </div>
      <div className="mt-3">
        <Rating value={engine.reliability} inline />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-lr-line pt-3 md:mt-3.5 md:gap-y-3 md:pt-3.5">
        {["displacement", "power", "years", "variants"].map((f) => (
          <div key={f} className="min-w-0">
            <dt className="text-[13px] leading-snug text-lr-muted">{label(f)}</dt>
            <dd className={`mt-0.5 text-[14px] font-medium leading-snug text-lr-head ${LINKS}`} dangerouslySetInnerHTML={{ __html: html(engine[f]) || "—" }} />
          </div>
        ))}
      </dl>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 border-t border-lr-line pt-3 md:mt-3.5 md:pt-3.5">
        <div className="min-w-0">
          <dt className="text-[13px] leading-snug text-lr-muted">{label("enquiries")}</dt>
          <dd className="mt-1 text-[14px] [&>span]:items-start">
            <Enquiries value={engine.enquiries} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[13px] leading-snug text-lr-muted">{label("avgReconCost")}</dt>
          <dd className="mt-1 text-[14px] [&>span]:items-start">
            <Cost value={engine.avgReconCost} />
          </dd>
        </div>
      </dl>
    </li>
  );
}

// ------------------------------------------------------------------ confidence panel

const VERB = "is|are|was|were|carries|carry|has|have|reflects?|remains?|suffers?|adds?|offers?|delivers?";
const capital = (s) => s.replace(/^(\s*(?:<[^>]+>)*\s*)([a-z])/, (_, a, b) => a + b.toUpperCase());

// The JSON's confidence copy as rating tiers: "306DT and 276DT: 95% confidence …" keeps its label;
// "The 200TDi is widely regarded …" is labelled by its subject; sentences about the ratings as a whole
// ("All ratings are provisional …", "Ratings are derived from …") form the method note.
function confidenceFromText(text = "") {
  const items = [];
  const general = [];
  const sentences = String(text)
    .trim()
    .split(/(?<=[.!?]["”]?)\s+(?=[A-Z0-9<])/)
    .filter(Boolean);
  for (const s of sentences) {
    const i = s.indexOf(": ");
    if (i > 0 && stripHtml(s.slice(0, i)).length <= 60) {
      items.push({ label: `${s.slice(0, i)}:`, body: capital(s.slice(i + 2)) });
      continue;
    }
    for (let clause of s.split(/;\s+/)) {
      clause = clause.trim().replace(/([^.!?"”])$/, "$1.");
      const m = clause.match(new RegExp(`^(?:the\\s+)?(.+?)\\s+(?:${VERB})\\b`, "i"));
      const subject = m ? m[1].replace(/\s+ratings?$/i, "") : "";
      const plain = stripHtml(subject);
      if (!subject || plain.length > 60 || /^(all|ratings?|these|our|each|this)\b/i.test(plain)) general.push(capital(clause));
      else items.push({ label: `${capital(subject)}:`, body: capital(clause) });
    }
  }
  return { items, note: general.join(" ") };
}

// no confidence copy in the JSON: one tier per star rating, from the table's own tags and figures
function confidenceFromTable(engines = [], code = "") {
  const bands = new Map();
  for (const e of engines) {
    const r = parseRating(e.reliability);
    if (!r.stars) continue;
    const score = r.full + r.half * 0.5;
    bands.set(score, [...(bands.get(score) || []), e]);
  }
  const sorted = [...bands.entries()].sort((a, b) => b[0] - a[0]);
  const gen = code ? `${code} ` : "";
  // engines are named by family ("Td5", "3.9 V8"); a family rated differently across its engines
  // ("Ingenium I4" in two tiers) names those engines by code instead
  const clean = (t) => stripHtml(t).replace(/\s*\([^)]*\)/g, "").trim();
  const family = (e) => clean(/\d/.test(stripHtml(e.family)) ? e.family : e.engineCode);
  const tiersOf = new Map();
  sorted.forEach(([score, rows]) => rows.forEach((e) => tiersOf.set(family(e), new Set([...(tiersOf.get(family(e)) || []), score]))));
  const nameOf = (e) => (tiersOf.get(family(e)).size > 1 ? clean(e.engineCode) : family(e));
  return sorted.map(([score, rows], i) => {
    const names = [...new Set(rows.map(nameOf))].filter(Boolean);
    const label = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0] || "";
    const verified = rows.filter((e) => /EM[-‑]VERIFIED/i.test(e.enquiries)).length;
    const inherited = rows.some((e) => /inherited from Model Page/i.test(e.reliability));
    const lead = sorted.length > 1 && i === 0 ? `The strongest-rated ${gen}engines. ` : sorted.length > 1 && i === sorted.length - 1 ? `The lowest-rated ${gen}engines. ` : "";
    const evidence =
      verified === rows.length ? "Backed by real UK enquiry volumes [EM-VERIFIED]" : verified ? "Partly backed by real UK enquiry volumes [EM-VERIFIED]" : "Rated from specialist and owner pattern data";
    const status = inherited ? "inherited from the Model Page" : "provisional until each dedicated Engine Page is built";
    return { label: `${label}:`, body: `${lead}${evidence}; ${status}.`, score };
  });
}

const DEFAULT_NOTE =
  "Each star rating here is derived from <strong>cross-referencing</strong> specialist/owner sources that consistently place these engines in this reliability range. We'll update after each engine page is built.";

function Ring({ children, className = "" }) {
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-lr-line-strong bg-lr-chip text-lr-ink xl:h-14 xl:w-14 dark:border-lr-gold-line/55 dark:bg-transparent dark:text-lr-gold ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] xl:h-7 xl:w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

const STAR_PATH = "M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.6l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8L12 3.2Z";
const TIER_ICONS = [
  <path key="c" d="m6.5 12.5 3.6 3.6 7.4-8.2" />,
  <g key="u">
    <circle cx="12" cy="8.4" r="3.6" />
    <path d="M5 19.5c1.1-3.6 3.8-5.4 7-5.4s5.9 1.8 7 5.4" />
  </g>,
  <path key="s" d={STAR_PATH} />,
  <path key="g" d="M4.5 19.5h15M7.5 16.5V11M12 16.5V7M16.5 16.5v-3.5" />,
];

function Tier({ item, index }) {
  return (
    <div className="flex gap-3.5 xl:gap-4">
      <Ring>{TIER_ICONS[index % TIER_ICONS.length]}</Ring>
      <div className="min-w-0 pt-0.5">
        <p className={`text-[16px] font-semibold leading-snug text-lr-green md:text-[17px] xl:text-[18px] ${LINKS}`} dangerouslySetInnerHTML={{ __html: localHtml(prose(item.label)) }} />
        {item.score ? (
          <span className="mt-1.5 block">
            <Stars full={Math.floor(item.score)} half={item.score % 1 ? 1 : 0} empty={5 - Math.ceil(item.score)} size="h-[15px] w-[15px]" className="gap-0.5 dark:text-lr-gold!" />
          </span>
        ) : null}
        <p className={`mt-1.5 text-[14px] leading-[1.6] text-lr-body xl:text-[15px] ${LINKS}`} dangerouslySetInnerHTML={{ __html: localHtml(prose(item.body)) }} />
      </div>
    </div>
  );
}

// the gold-rimmed green shield with a check (decorative)
function Shield({ className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 96 112" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6cf97" />
          <stop offset="0.5" stopColor="#b9995c" />
          <stop offset="1" stopColor="#6f5528" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f6e4b" />
          <stop offset="1" stopColor="#0f3423" />
        </linearGradient>
      </defs>
      <path d="M48 3 89 17v35c0 27-18 48-41 57C25 100 7 79 7 52V17Z" fill={`url(#${id}-rim)`} />
      <path d="M48 11.5 81 23v29c0 22.5-14.8 40.2-33 48.3C29.8 92.2 15 74.5 15 52V23Z" fill={`url(#${id}-face)`} />
      <path d="m31 55.5 11.5 11.5L66 42.5" fill="none" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#f4f3ed] dark:stroke-lr-gold-line" />
    </svg>
  );
}

function Confidence({ title, items, note }) {
  // four or more tiers: the method note drops to its own row under them, so no tier gets narrow
  const wide = items.length >= 4;
  const cols = `clamp(104px, 8.5vw, 140px) repeat(${items.length}, minmax(0, 1fr))${wide ? "" : " minmax(0, 1.2fr)"}`;
  const cell = "relative px-5 py-5 md:px-6 xl:px-6 xl:py-7 min-[1440px]:px-7";
  const rule = "xl:before:absolute xl:before:inset-y-7 xl:before:left-0 xl:before:w-px xl:before:bg-lr-line";
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_24px_60px_-42px_var(--lr-shadow)] md:mt-8 lg:rounded-2xl xl:mt-10 dark:bg-lr-card/60">
      <div className="grid md:grid-cols-2 xl:[grid-template-columns:var(--cols)]" style={{ "--cols": cols }}>
        <div className={`hidden items-start justify-center py-7 pl-4 xl:flex ${wide ? "xl:row-span-2" : ""}`}>
          <Shield className="h-auto w-[84px] min-[1440px]:w-[100px]" />
        </div>
        {/* phones/tablets: the title is its own row; laptops: it heads the first tier's cell */}
        <div className={`contents xl:block ${cell} ${rule}`}>
          <h3 className="col-span-full flex items-center gap-3.5 px-5 pt-5 text-[18px] font-semibold leading-snug text-lr-head md:px-6 md:text-[19px] xl:p-0 xl:text-[18px] min-[1440px]:text-[19px]">
            <Shield className="h-auto w-10 shrink-0 md:w-11 xl:hidden" />
            {title}
          </h3>
          {items[0] && (
            <div className="px-5 py-4 md:px-6 md:pb-5 xl:mt-5 xl:p-0">
              <Tier item={items[0]} index={0} />
            </div>
          )}
        </div>
        {items.slice(1).map((item, i) => (
          <div key={i} className={`${cell} border-t border-lr-line py-4 md:border-t-0 md:pb-5 md:pt-4 xl:border-t-0 xl:py-7 ${rule}`}>
            <Tier item={item} index={i + 1} />
          </div>
        ))}
        <div
          className={`${cell} col-span-full border-t border-lr-line bg-lr-panel/50 xl:bg-transparent ${
            wide ? "xl:col-start-2 xl:py-5" : `xl:col-span-1 xl:border-t-0 ${rule}`
          }`}
        >
          <div className="flex gap-3.5 xl:gap-4">
            <Ring>
              <path d="M7 3.5h7l4.5 4.5v12.5H7Z" />
              <path d="M14 3.5V8h4.5M9.8 12h5.8M9.8 15.2h5.8M9.8 18.4h3.6" />
            </Ring>
            <p
              className={`min-w-0 pt-0.5 text-[14px] leading-[1.65] text-lr-body xl:text-[15px] [&_strong]:font-semibold [&_strong]:text-lr-head ${LINKS}`}
              dangerouslySetInnerHTML={{ __html: localHtml(prose(note || DEFAULT_NOTE)) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ backdrop

// The glen behind the heading's right side, measured from the approved references (1536px wide):
// the box is anchored to the screen's right edge and the table's top, 380px tall (it runs up past
// the section's top, which clips it), so every line keeps its place whatever the heading's length.
// Widths are in vw, scaled from 1536px.
// Day: the photo fades in from the left and is cut by a white line, right of which run a pale band,
// a sage band, a gold line and a darker sage band (the stripe), with the page beyond.
// Night: the photo is cut on a diagonal edged with an olive line, the page to its left.
// The car: by day 18.6vw wide, 13.4vw from the right edge, standing on the table's top edge; at night
// 16.3vw wide near the right edge, 60px above the table.
function Glen({ car, className = "" }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 [clip-path:polygon(0_0,calc(100%-2.93vw)_0,calc(100%-17.5vw)_100%,0_100%)] [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.5)_28%,#000_52%)] dark:[clip-path:polygon(51.8%_0,100%_0,100%_100%,29.8%_100%)] dark:[mask-image:none]">
        <div className={`absolute inset-0 bg-cover bg-[center_17%] ${BG} brightness-[1.06] contrast-[.9] hue-rotate-[16deg] saturate-[.72] dark:filter-none`} />
        {/* day: the reference's pale haze over the hills, strongest behind the heading */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--sec-bg,var(--lr-band))_45%,transparent),color-mix(in_srgb,var(--sec-bg,var(--lr-band))_14%,transparent)_55%,transparent_82%)] dark:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sec-bg,var(--lr-band))_60%,transparent)_18%,transparent_56%)] dark:hidden" />
        {/* night: a touch of shade at the foot, into the table */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,transparent_62%,rgba(5,14,11,0.45))] dark:block" />
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full dark:block">
        <defs>
          <linearGradient id="ed-glen-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7d9255" />
            <stop offset="0.6" stopColor="#6e804b" />
            <stop offset="1" stopColor="#3e4f30" />
          </linearGradient>
        </defs>
        <line x1="51.8" y1="0" x2="29.8" y2="100" stroke="url(#ed-glen-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg viewBox="0 0 460 380" preserveAspectRatio="none" className="absolute bottom-0 right-0 h-full w-[29.95vw] dark:hidden">
        <defs>
          <linearGradient id="ed-glen-pale" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d5d7d1" />
            <stop offset="1" stopColor="#eceee8" />
          </linearGradient>
        </defs>
        <polygon points="418.5,0 483,0 259,380 194.5,380" fill="url(#ed-glen-pale)" />
        <polygon points="415,0 418.5,0 194.5,380 191,380" fill="#ffffff" />
        <polygon points="483,0 561,0 337,380 259,380" fill="#8c9589" />
        <polygon points="561,0 564.5,0 340.5,380 337,380" fill="#d4bb8c" />
        <polygon points="564.5,0 637,0 413,380 340.5,380" fill="#6c7662" />
      </svg>
      {/* night: at least 44px in from the screen edge (the glen runs to 100vw, which on Windows includes the
          scrollbar), so the car's tail and shadow are never cut off */}
      {car && (
        <div className="absolute bottom-[3px] right-[13.4vw] w-[18.6vw] max-w-[360px] dark:bottom-[60px] dark:right-[max(2.6vw,44px)] dark:w-[16vw] dark:max-w-[320px]">
          <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 19vw, 1px" />
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ section

export default function EngineDatabase({ data, hero = null, model = "" }) {
  const [showAll, setShowAll] = useState(false);
  const listId = useId().replace(/:/g, "");
  if (!data) return null;

  const engines = data.engines || [];
  const labels = KEYS.map((_, i) => String(data.columns?.[i] || DEFAULT_LABELS[i]).replace(/\s*\(badges\)\s*$/i, ""));
  const { lead, accent } = splitHeading(prose(data.h2 || ""));
  const [accentFirst, ...accentRest] = accent.split(" ");
  const intro = prose(localHtml(data.subHeadline || ""));
  const introCut = intro.indexOf(" — ");
  const code = genCode(`${hero?.h1 || ""} ${hero?.tagPill || ""} ${data.h2 || ""}`);
  const car = engineDbCar(hero || { h1: data.h2 }, model);

  const fromText = confidenceFromText(data.confidenceScore?.text || "");
  const tiers = fromText.items.length ? fromText.items : confidenceFromTable(engines, code);
  const note = fromText.note;
  const total = engines.length;

  return (
    <section id="engine-database" className={`relative scroll-mt-16 overflow-hidden bg-lr-band pb-6 text-lr-head md:scroll-mt-20 md:pb-7 xl:pb-8 ${SANS}`}>
      {/* the glen's top meets the section above softly */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-10 bg-[linear-gradient(180deg,var(--sec-bg,var(--lr-band)),transparent)] lg:block" aria-hidden="true" />
      <div className={`${CONTAINER} pt-6 md:pt-6 lg:pt-6 xl:pt-6`}>
        <div className="relative">
          {/* laptops: the glen, its lines and the car, from the screen's right edge to the table's top */}
          <Glen car={car} className="absolute bottom-[-16px] right-[calc(50%-50vw)] hidden h-[380px] w-[60vw] lg:block" />

          {/* the copy stops short of the glen: the heading and intro are capped at the night diagonal's
              position at their height (63vw / 57vw from the left), so a long heading wraps before it */}
          <div className="relative z-[2] max-w-[760px] lg:max-w-none">
            <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.08em] text-lr-green md:text-[14px] xl:text-[15px]">Engine Database</p>
            <h2 className={`${H2_MODEL} mt-3.5 text-lr-head md:mt-4 lg:mt-3.5 lg:max-w-[calc(63vw_-_56px)] lg:[text-wrap:pretty] xl:max-w-[calc(63vw_-_max(48px,50vw_-_752px)_-_16px)] xl:text-[44px]!`}>
              {lead}
              {accent && (
                <>
                  {" "}—<br />
                  <span className="dark:text-lr-green">{accentFirst}</span>
                  {accentRest.length > 0 && <span className="text-lr-green"> {accentRest.join(" ")}</span>}
                </>
              )}
            </h2>
            {intro && (
              <p className={`${INTRO} md:mt-5 lg:mt-4 lg:max-w-[min(40em,calc(57vw_-_56px))] xl:max-w-[min(40em,calc(57vw_-_max(48px,50vw_-_752px)_-_16px))] ${LINKS}`}>
                {introCut > 0 ? (
                  <>
                    <span dangerouslySetInnerHTML={{ __html: `${intro.slice(0, introCut)} —` }} />
                    <span className="lg:block" dangerouslySetInnerHTML={{ __html: ` ${intro.slice(introCut + 3)}` }} />
                  </>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: intro }} />
                )}
              </p>
            )}
          </div>
        </div>

        {/* phones / tablets: the glen with the car, full-bleed */}
        {car && (
          <div className="relative -mx-5 mt-5 aspect-[2/1] sm:-mx-6 sm:aspect-[5/2] md:-mx-10 md:aspect-[3/1] lg:hidden" aria-hidden="true">
            <div className={`absolute inset-0 bg-cover bg-[center_74%] ${BG} brightness-[1.06] contrast-[.9] hue-rotate-[16deg] saturate-[.72] dark:filter-none [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_78%,transparent)]`} />
            <div className="absolute bottom-[9%] left-1/2 w-[56%] max-w-[400px] -translate-x-1/2 sm:w-[44%] md:w-[34%]">
              <GroundedCar src={car} sceneByTheme sizes="(max-width: 640px) 56vw, 400px" />
            </div>
          </div>
        )}

        {total > 0 && (
          <>
            {/* phones / tablets: one card per engine */}
            <div className={`relative z-[2] xl:hidden ${car ? "-mt-6 sm:-mt-8 lg:mt-4" : "mt-6 lg:mt-4"}`}>
              <ul id={listId} className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {engines.map((e, i) => (
                  <EngineCard
                    key={`${stripHtml(e.engineCode)}-${i}`}
                    engine={e}
                    labels={labels}
                    className={showAll ? "" : i >= LIMIT_WIDE ? "hidden" : i >= LIMIT_CARDS ? "hidden lg:block" : ""}
                  />
                ))}
              </ul>
              {total > LIMIT_CARDS && (
                <div className={`mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-5 ${total <= LIMIT_WIDE ? "lg:hidden" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    aria-expanded={showAll}
                    aria-controls={listId}
                    className="flex h-12 items-center justify-between gap-4 rounded-xl border border-lr-line-strong bg-lr-card px-4 text-[15px] font-medium text-lr-ink outline-none transition-colors hover:border-lr-green focus-visible:ring-2 focus-visible:ring-lr-green sm:min-w-[270px] dark:text-lr-green"
                  >
                    <span className="flex items-center gap-3">
                      <LrIcon name="oem-references" tone="current" className="h-5 w-5" />
                      {showAll ? "Show fewer engine codes" : `View all ${total} engine codes`}
                    </span>
                    <Chevron className={`h-5 w-5 transition-transform ${showAll ? "rotate-180" : ""}`} />
                  </button>
                  <p className="text-[14px] text-lr-muted" aria-live="polite">
                    {showAll ? (
                      `Showing all ${total} engine codes`
                    ) : (
                      <>
                        <span className="lg:hidden">{`Showing ${LIMIT_CARDS} of ${total} engine codes`}</span>
                        <span className="hidden lg:inline">{`Showing ${Math.min(LIMIT_WIDE, total)} of ${total} engine codes`}</span>
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* laptops: the table, over the glen's foot */}
            <div className="relative z-[2] mt-4 hidden overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_28px_70px_-44px_var(--lr-shadow)] xl:block lg:rounded-2xl dark:bg-lr-card/85 dark:backdrop-blur-sm">
              <table className="w-full table-fixed border-collapse text-center">
                <caption className="sr-only">{stripHtml(data.h2)}</caption>
                <colgroup>
                  {WIDTHS.map((w, i) => (
                    <col key={i} style={{ width: `${w}%` }} />
                  ))}
                </colgroup>
                <thead className="border-b border-lr-line bg-lr-panel/60 dark:bg-transparent">
                  <tr>
                    {labels.map((l, i) => (
                      <th
                        key={l}
                        scope="col"
                        className={`border-r border-lr-line px-2.5 py-4 text-[14px] font-medium leading-snug text-lr-head last:border-r-0 min-[1440px]:px-3.5 min-[1440px]:text-[15px] dark:text-lr-green ${i === 0 ? "text-left min-[1440px]:pl-5" : ""}`}
                      >
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {engines.map((e, r) => (
                    <tr key={`${stripHtml(e.engineCode)}-${r}`} className="border-t border-lr-line transition-colors first:border-t-0 hover:bg-lr-panel/50">
                      {KEYS.map((k, i) => (
                        <td
                          key={k}
                          className={`border-r border-lr-line px-2.5 py-3 align-middle text-[14px] leading-snug text-lr-body last:border-r-0 min-[1440px]:px-3.5 min-[1440px]:text-[15px] ${i === 0 ? "text-left min-[1440px]:pl-5" : ""}`}
                        >
                          <Cell field={k} engine={e} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tiers.length > 0 && <Confidence title={data.confidenceScore?.title || "How confident are these ratings?"} items={tiers} note={note} />}
      </div>
    </section>
  );
}
