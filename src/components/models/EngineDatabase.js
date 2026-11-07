"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import {
  Arrow,
  BAND_PAGE,
  CARD,
  Chevron,
  EyebrowPill,
  SANS,
  SECTION_Y,
  SectionTitle,
  Stars,
  parseRating,
  prose,
  INTRO,
} from "@/components/models/modelKit";
import {
  cellHtml,
  enginePage,
  generationCount,
  heroEnquiries,
  reconRange,
  splitTags,
  stripHtml,
  yearSpan,
} from "@/components/models/engineSections";

// Model page section 5 — the engine codes database, built to the approved Velar reference: the
// eyebrow and "… Engine Codes — / The Complete Database" headline with four stat cards (all derived
// from the page data), the engine table (sortable, info tooltips on the rated columns, stars for
// reliability, data tags in green), a "View all" toggle past eight engines, the rating legend, and
// the confidence / data-note / method cards. Below 1280px the table becomes one card per engine.
// Keeps id="engine-database": the hero's Explore button scrolls here.

const LIMIT = 8;
// phones and tablets show fewer engine cards before "View all" (each card is a full screen-third)
const LIMIT_CARDS = 4;

// data column label -> engine field
const FIELDS = {
  "Engine Code": "engineCode",
  Family: "family",
  Fuel: "fuel",
  "Disp.": "displacement",
  Power: "power",
  Years: "years",
  "Gen.": "model",
  Reliability: "reliability",
  "2025 Enquiries": "enquiries",
  "Avg. Recon Cost": "avgRebuildCost",
};
const DEFAULT_COLUMNS = ["Engine Code", "Family", "Fuel", "Disp.", "Power", "Years", "Reliability", "2025 Enquiries", "Avg. Recon Cost"];
const CENTRED = new Set(["family", "fuel", "displacement", "power", "years", "model"]);
// column widths (%) for the fixed-layout table, with and without the generation column
const WIDTHS = {
  9: { engineCode: 14, family: 8.5, fuel: 9.5, displacement: 5.5, power: 9.5, years: 10, reliability: 12.5, enquiries: 15, avgRebuildCost: 15.5 },
  10: { engineCode: 13, family: 9.5, fuel: 7.5, displacement: 6, power: 9, years: 9, model: 8, reliability: 12.5, enquiries: 13, avgRebuildCost: 12.5 },
};

const INFO = {
  reliability: "Rated out of five from our 2025 enquiry data and documented failure patterns. How confident we are in each rating is explained below the table.",
  enquiries: "UK engine enquiries in 2025. “JLR-wide” counts every model that uses the engine; “—” means too few enquiries for a figure, so the rating rests on documented patterns.",
  avgRebuildCost: "Typical price of a reconditioned engine, supply only. Fitting is extra.",
};

// ------------------------------------------------------------------ sorting

const firstNumber = (html, re) => {
  const m = stripHtml(html).match(re);
  return m ? Number(m[1].replace(/,/g, "")) : null;
};
const score = (raw) => {
  const r = parseRating(String(raw || "").split(/\s+\/\s+/)[0]);
  return r.stars ? r.full + r.half * 0.5 : null;
};

// key -> value getter and the direction of a first click (1 = ascending)
const SORTS = {
  engineCode: { get: (e) => stripHtml(e.engineCode).toLowerCase(), first: 1 },
  years: { get: (e) => yearSpan(e.years)?.[0] ?? null, first: -1 },
  reliability: { get: (e) => score(e.reliability), first: -1 },
  enquiries: { get: (e) => firstNumber(e.enquiries, /^([\d,]+)/), first: -1 },
  avgRebuildCost: { get: (e) => firstNumber(e.avgRebuildCost, /£\s?([\d,]+)/), first: 1 },
};

// options for the phone/tablet sort menu
const SORT_MENU = [
  { id: "", label: "Default order" },
  { id: "engineCode:1", label: "Engine code A–Z" },
  { id: "years:-1", label: "Newest first" },
  { id: "reliability:-1", label: "Most reliable first" },
  { id: "enquiries:-1", label: "Most enquired first" },
  { id: "avgRebuildCost:1", label: "Lowest recon cost first" },
];

function sortEngines(engines, sort) {
  const rows = engines.map((e, i) => ({ e, i }));
  if (!sort.key) return rows.map((r) => r.e);
  const { get } = SORTS[sort.key];
  return rows
    .sort((a, b) => {
      const va = get(a.e);
      const vb = get(b.e);
      // rows without a value always sink to the bottom
      if (va === null && vb === null) return a.i - b.i;
      if (va === null) return 1;
      if (vb === null) return -1;
      const d = typeof va === "string" ? va.localeCompare(vb, "en", { numeric: true }) : va - vb;
      return d * sort.dir || a.i - b.i;
    })
    .map((r) => r.e);
}

// ------------------------------------------------------------------ cells

const LINKS = "[&_a]:font-[inherit] [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline";

function Html({ html, className = "", as: Tag = "span" }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// engine code, linked to its engine page when the data doesn't already link it
const CODE_LINKS = "[&_a]:font-[inherit] [&_a]:text-lr-head [&_a]:no-underline hover:[&_a]:text-lr-green hover:[&_a]:underline";

function Code({ value, className = "" }) {
  const html = cellHtml(value);
  const href = /<a\s/i.test(html) ? "" : enginePage(value);
  if (!href) return <Html html={html} className={`${CODE_LINKS} underline-offset-4 ${className}`} />;
  return (
    <Link href={href} className={`text-lr-head no-underline decoration-lr-green underline-offset-4 hover:text-lr-green hover:underline ${className}`}>
      <Html html={html} />
    </Link>
  );
}

// "★★★☆☆ (pre-2019) / ★★★★☆ (2019+)" -> two star groups with their labels
function Reliability({ value, size = "h-4 w-4 xl:h-[17px] xl:w-[17px]" }) {
  const parts = String(value || "")
    .split(/\s+\/\s+/)
    .map(parseRating);
  return (
    <span className="flex flex-col gap-1">
      {parts.map((p, i) =>
        p.stars ? (
          <span key={i} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Stars full={p.full} half={p.half} empty={p.empty} size={size} className="gap-0.5" />
            {p.rest && <span className="text-[13px] leading-snug text-lr-muted xl:text-[14px]">{p.rest}</span>}
          </span>
        ) : (
          <Html key={i} html={cellHtml(p.rest)} />
        ),
      )}
    </span>
  );
}

// figure on the first line, its data tags (green) underneath
function Tagged({ value, mainClass = "", tagClass = "" }) {
  const { main, tags } = splitTags(value);
  const none = /^—/.test(stripHtml(main));
  return (
    <span className="flex flex-col gap-0.5">
      {main && <Html html={main} className={`${LINKS} ${none ? "font-normal text-lr-muted" : mainClass}`} />}
      {tags.map((t, i) => (
        <Html key={i} html={t} className={`leading-snug ${tagClass}`} />
      ))}
    </span>
  );
}

function Cell({ field, engine }) {
  const v = engine[field];
  if (field === "engineCode") return <Code value={v} className="font-semibold" />;
  if (field === "reliability") return <Reliability value={v} />;
  if (field === "enquiries" || field === "avgRebuildCost")
    return <Tagged value={v} mainClass={field === "avgRebuildCost" ? "font-medium text-lr-head" : "text-lr-head"} tagClass="text-[13px] xl:text-[14px]" />;
  return <Html html={cellHtml(v)} className={LINKS} />;
}

// ------------------------------------------------------------------ header pieces

function InfoTip({ id, label, text }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-describedby={id}
        className="flex h-6 w-6 items-center justify-center rounded-full text-lr-muted outline-none transition-colors hover:text-lr-green focus-visible:ring-2 focus-visible:ring-lr-green"
      >
        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9.2" />
          <path d="M12 11v5.2M12 7.6h.01" strokeLinecap="round" />
        </svg>
      </button>
      <span
        role="tooltip"
        id={id}
        className="pointer-events-none invisible absolute right-0 top-[calc(100%+6px)] z-20 w-60 rounded-lg border border-lr-line bg-lr-card p-3 text-left text-[13px] font-normal normal-case leading-snug text-lr-body opacity-0 shadow-[0_16px_40px_-18px_var(--lr-shadow)] transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function SortIcon({ dir }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 9 4-4 4 4" className={dir === -1 ? "opacity-30" : ""} />
      <path d="m16 15-4 4-4-4" className={dir === 1 ? "opacity-30" : ""} />
    </svg>
  );
}

function HeadCell({ label, field, sort, onSort, tipId, nowrap = false }) {
  const sortable = Boolean(SORTS[field]);
  const active = sort.key === field;
  const ariaSort = active ? (sort.dir === 1 ? "ascending" : "descending") : sortable ? "none" : undefined;
  const align = CENTRED.has(field) ? "justify-center text-center" : "justify-start";
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className="border-r border-lr-line px-3 py-3.5 align-middle text-[14px] font-semibold text-lr-head last:border-r-0 xl:py-4 xl:text-[15px] min-[1440px]:px-4"
    >
      <span className={`flex items-center gap-1.5 ${nowrap ? "min-[1440px]:whitespace-nowrap" : ""} ${align}`}>
        {sortable ? (
          <button
            type="button"
            onClick={() => onSort(field)}
            className={`group/sort -mx-1 inline-flex items-center gap-1.5 rounded px-1 outline-none transition-colors hover:text-lr-green focus-visible:ring-2 focus-visible:ring-lr-green ${active ? "text-lr-ink dark:text-lr-green" : ""}`}
          >
            {label}
            <span className={field === "engineCode" || active ? "" : "opacity-0 transition-opacity group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100"}>
              <SortIcon dir={active ? sort.dir : 0} />
            </span>
            <span className="sr-only">, sort</span>
          </button>
        ) : (
          label
        )}
        {INFO[field] && <InfoTip id={`${tipId}-${field}`} label={label} text={INFO[field]} />}
      </span>
    </th>
  );
}

function PoundIcon({ className = "" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full border-[1.8px] border-current font-[family-name:var(--font-serif-display)] leading-none ${className}`} aria-hidden="true">
      £
    </span>
  );
}

// phones: icon above the figure, so a range such as "£2.5K–£9.5K" gets the card's full width (beside the
// icon it ran out of its card); from sm the icon sits beside it
function StatCard({ icon, value, label }) {
  return (
    <li className={`${CARD} flex min-w-0 items-center gap-3 p-3.5 max-sm:flex-col max-sm:items-start max-sm:gap-2 sm:p-4 xl:gap-3.5 xl:px-5 xl:py-6 min-[1440px]:px-4`}>
      {icon === "pound" ? (
        <PoundIcon className="h-8 w-8 text-[17px] text-lr-ink md:h-9 md:w-9 md:text-[19px] xl:h-10 xl:w-10 xl:text-[21px] dark:text-lr-green" />
      ) : (
        <LrIcon name={icon} tone="current" className="h-8 w-8 shrink-0 text-lr-ink md:h-9 md:w-9 xl:h-10 xl:w-10 dark:text-lr-green" />
      )}
      <p className="min-w-0 max-sm:w-full">
        <span className="block whitespace-nowrap text-[19px] font-semibold leading-tight tracking-[-0.01em] text-lr-head max-[359px]:whitespace-normal max-[359px]:text-[18px] md:text-[21px] md:max-[819px]:text-[19px]! xl:text-[25px] min-[1440px]:text-[22px]">{value}</span>
        <span className="mt-1 block text-[13px] leading-snug text-lr-body md:text-[14px] xl:text-[15px] min-[1440px]:text-[14px]">{label}</span>
      </p>
    </li>
  );
}

// ------------------------------------------------------------------ notes

// "A ratings: 93% confidence - …. B: Expert tier - …." -> paragraphs with the label before ": " in
// bold. Numbered notes ("1. … 2. …") are split into their items first, so a list number never
// trails the previous paragraph; a short line ending in ":" ("TWO CORRECTIONS APPLIED, verify at
// source:") is a heading on its own.
function labelledParagraphs(text = "", splitNumbered = false) {
  const items = splitNumbered ? String(text).trim().split(/\s+(?=\d\.\s)/) : [String(text).trim()];
  return items
    .flatMap((p) => p.split(/(?<=[^\d\s]\.)\s+(?=[A-Z0-9(][^.:]{1,80}:\s)/))
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p.length <= 80 && p.endsWith(":")) return { label: cellHtml(p), body: "" };
      const i = p.indexOf(": ");
      const head = i > 0 ? p.slice(0, i) : "";
      const label = head && stripHtml(head).length <= 80 && !/<a\s[^>]*$/i.test(head) ? `${head}:` : "";
      return { label: label ? cellHtml(label) : "", body: cellHtml(label ? p.slice(i + 2) : p) };
    });
}

function confidenceParts(text = "") {
  const at = String(text).search(/Data note \(internal\)/i);
  if (at === -1) return { main: labelledParagraphs(text), note: [] };
  const note = text
    .slice(at)
    .replace(/^Data note \(internal\)\s*(?:[-–—:]\s*)?:?\s*/i, "")
    .trim();
  return { main: labelledParagraphs(text.slice(0, at)), note: labelledParagraphs(note, true) };
}

function Paragraphs({ items }) {
  return (
    <div className={`mt-3 space-y-3 text-[14px] leading-[1.6] text-lr-body md:text-[15px] ${LINKS}`}>
      {items.map((p, i) => (
        <p key={i}>
          {p.label && <strong className="font-semibold text-lr-head" dangerouslySetInnerHTML={{ __html: `${p.label} ` }} />}
          <span dangerouslySetInnerHTML={{ __html: p.body }} />
        </p>
      ))}
    </div>
  );
}

function WarnIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.2v4.6M12 17.2h.01" strokeLinecap="round" />
    </svg>
  );
}

function correctionText(c) {
  if (typeof c === "string") return c;
  if (c && typeof c === "object") return Object.values(c).filter((v) => typeof v === "string").join(" — ");
  return "";
}

// ------------------------------------------------------------------ section

export default function EngineDatabase({ data, page }) {
  const tipId = useId().replace(/:/g, "");
  const listId = `${tipId}-engines`;
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [showAll, setShowAll] = useState(false);
  const engines = useMemo(() => data?.engines || [], [data]);
  const sorted = useMemo(() => sortEngines(engines, sort), [engines, sort]);

  if (!data) return null;

  const columns = (data.columns?.length ? data.columns : DEFAULT_COLUMNS)
    .map((label) => ({ label, field: FIELDS[label] }))
    .filter((c) => c.field);
  const widths = WIDTHS[columns.length] || {};
  const visible = showAll ? sorted : sorted.slice(0, LIMIT);
  const visibleCards = showAll ? sorted : sorted.slice(0, LIMIT_CARDS);
  const total = engines.length;
  const hasMore = total > LIMIT;
  const hasMoreCards = total > LIMIT_CARDS;
  const mobileFields = ["family", "displacement", "power", "years", "model"].filter((f) => columns.some((c) => c.field === f));
  const labelOf = (field) => columns.find((c) => c.field === field)?.label || field;

  const gens = generationCount(page);
  const enquiries = heroEnquiries(page);
  const range = reconRange(engines);
  const stats = [
    { icon: "engine", value: total, label: "Engine Codes Tracked" },
    gens && { icon: "genuine-failure-data", value: gens, label: gens === 1 ? "Generation Covered" : "Generations Covered" },
    enquiries && { icon: "real-inquiries", value: enquiries.value, label: enquiries.label },
    range && { icon: "pound", value: range, label: "Typical Recon Cost Range" },
  ].filter(Boolean);

  const { main: confidence, note } = confidenceParts(data.confidenceScore?.text || "");
  const corrections = (data.dataCorrections || []).map(correctionText).filter(Boolean);

  function onSort(field) {
    setSort((s) => {
      if (s.key !== field) return { key: field, dir: SORTS[field].first };
      if (s.dir === SORTS[field].first) return { key: field, dir: -s.dir };
      return { key: null, dir: 1 };
    });
  }
  const menuValue = sort.key ? `${sort.key}:${sort.dir}` : "";

  return (
    <section id="engine-database" className={`${BAND_PAGE} scroll-mt-16 text-lr-head md:scroll-mt-20 ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        {/* heading + four stats from the page data */}
        <div className="grid gap-6 md:gap-8 min-[1440px]:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] min-[1440px]:items-start min-[1440px]:gap-8">
          <div className="min-w-0">
            <EyebrowPill icon="database">Engine Codes</EyebrowPill>
            {/* 46px beside the stats from 1440px, so "… — / The Complete Database" holds two lines */}
            <SectionTitle h2={data.h2} className="mt-3 md:mt-4" />
            {data.subHeadline && (
              <p
                className={`${INTRO} ${LINKS}`}
                dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }}
              />
            )}
          </div>
          {stats.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-3.5 min-[1440px]:mt-2">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </ul>
          )}
        </div>

        {/* phones / tablets: sort menu + one card per engine */}
        <div className="mt-7 xl:hidden">
          <div className="flex items-center justify-between gap-3 text-[14px] text-lr-body">
            <p className="font-medium text-lr-head">
              {total} engine code{total === 1 ? "" : "s"}
            </p>
            <span className="relative">
              <select
                aria-label="Sort engine codes"
                value={menuValue}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(":");
                  setSort(key ? { key, dir: Number(dir) } : { key: null, dir: 1 });
                }}
                className="h-10 appearance-none rounded-lg border border-lr-line-strong bg-lr-card pl-3 pr-9 text-[14px] font-medium text-lr-head outline-none focus:border-lr-green"
              >
                {SORT_MENU.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Chevron className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lr-muted" />
            </span>
          </div>
          <ul id={`${listId}-cards`} className="mt-3 grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {visibleCards.map((e) => (
              <li key={stripHtml(e.engineCode)} className={`${CARD} min-w-0 p-4 md:p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 text-[17px] font-semibold leading-snug md:text-[18px]">
                    <Code value={e.engineCode} />
                  </h3>
                  {e.fuel && (
                    <span className="shrink-0 rounded-full bg-lr-chip px-2.5 py-1 text-[13px] font-medium leading-none text-lr-ink dark:text-lr-green">{stripHtml(e.fuel)}</span>
                  )}
                </div>
                <div className="mt-2.5">
                  <Reliability value={e.reliability} size="h-[17px] w-[17px]" />
                </div>
                <dl className="mt-3.5 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-lr-line pt-3.5">
                  {mobileFields.map((f) => (
                    <div key={f} className={`min-w-0 ${f === "family" ? "col-span-2" : ""}`}>
                      <dt className="text-[13px] leading-snug text-lr-muted">{labelOf(f)}</dt>
                      <dd className={`mt-0.5 text-[14px] font-medium leading-snug text-lr-head ${LINKS}`} dangerouslySetInnerHTML={{ __html: cellHtml(e[f]) || "—" }} />
                    </div>
                  ))}
                </dl>
                <dl className="mt-3.5 grid grid-cols-2 gap-3 border-t border-lr-line pt-3.5">
                  {["enquiries", "avgRebuildCost"].map((f) => (
                    <div key={f} className="min-w-0">
                      <dt className="text-[13px] leading-snug text-lr-muted">{labelOf(f)}</dt>
                      <dd className="mt-0.5 text-[14px] leading-snug">
                        <Tagged value={e[f]} mainClass={f === "avgRebuildCost" ? "font-semibold text-lr-head" : "font-medium text-lr-head"} tagClass="text-[13px]" />
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </div>

        {/* laptops and up: the table */}
        <div className={`${CARD} mt-10 hidden overflow-hidden xl:block`}>
          <table id={`${listId}-table`} className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">{stripHtml(prose(data.h2))}</caption>
            <colgroup>
              {columns.map((c) => (
                <col key={c.field} style={{ width: `${widths[c.field] || 10}%` }} />
              ))}
            </colgroup>
            <thead className="border-b border-lr-line bg-lr-card">
              <tr>
                {columns.map((c) => (
                  <HeadCell key={c.field} label={c.label} field={c.field} sort={sort} onSort={onSort} tipId={tipId} nowrap={columns.length <= 9} />
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={stripHtml(e.engineCode)} className="border-t border-lr-line transition-colors first:border-t-0 hover:bg-lr-panel/60">
                  {columns.map((c) => (
                    <td
                      key={c.field}
                      className={`border-r border-lr-line px-3 py-3.5 align-middle text-[14px] leading-snug text-lr-body last:border-r-0 xl:py-4 xl:text-[15px] min-[1440px]:px-4 ${
                        CENTRED.has(c.field) ? "text-center" : ""
                      } ${c.field === "engineCode" ? "text-lr-head" : ""}`}
                    >
                      <Cell field={c.field} engine={e} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* view all + legend */}
        <div className="mt-4 flex flex-col gap-3 md:mt-5 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-5">
            {hasMoreCards && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                aria-controls={`${listId}-cards ${listId}-table`}
                className={`flex h-12 items-center justify-between gap-4 rounded-xl border border-lr-line-strong bg-lr-card px-4 text-[15px] font-medium text-lr-ink outline-none transition-colors hover:border-lr-green focus-visible:ring-2 focus-visible:ring-lr-green sm:min-w-[270px] dark:text-lr-green ${hasMore ? "" : "xl:hidden"}`}
              >
                <span className="flex items-center gap-3">
                  <LrIcon name="oem-references" tone="current" className="h-5 w-5" />
                  {showAll ? "Show fewer engine codes" : `View all ${total} engine codes`}
                </span>
                <Chevron className={`h-5 w-5 transition-transform ${showAll ? "rotate-180" : ""}`} />
              </button>
            )}
            <p className="text-[14px] text-lr-muted md:text-[15px]" aria-live="polite">
              <span className="xl:hidden">{hasMoreCards && !showAll ? `Showing ${visibleCards.length} of ${total} engine codes` : `Showing all ${total} engine codes`}</span>
              <span className="hidden xl:inline">{hasMore && !showAll ? `Showing ${visible.length} of ${total} engine codes` : `Showing all ${total} engine codes`}</span>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl border border-lr-line bg-lr-card px-4 py-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-7 lg:ml-auto lg:px-5" aria-label="Reliability rating key">
            {[
              [1, "Poor"],
              [3, "Average"],
              [4, "Good"],
              [5, "Excellent"],
            ].map(([n, label]) => (
              // small phones: stars above the label (side by side they ran out of the two-column key)
              <li key={label} className="flex items-center gap-2.5 text-[14px] text-lr-head max-[419px]:flex-col max-[419px]:items-start max-[419px]:gap-1 md:text-[15px]">
                <Stars full={n} empty={5 - n} size="h-[15px] w-[15px]" className="gap-0.5" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* confidence, data note and method */}
        <div className="mt-8 grid gap-4 md:mt-10 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.72fr)] xl:gap-5">
          {confidence.length > 0 && (
            <article className={`${CARD} p-5 md:p-6`}>
              <h3 className="flex items-center gap-3 text-[17px] font-semibold leading-snug text-lr-ink md:text-[18px] xl:text-[19px] dark:text-lr-green">
                <LrIcon name="genuine-failure-data" tone="current" className="h-6 w-6 xl:h-7 xl:w-7" />
                {data.confidenceScore?.title || "How confident are these ratings?"}
              </h3>
              <Paragraphs items={confidence} />
            </article>
          )}
          {(note.length > 0 || corrections.length > 0) && (
            <article className={`${CARD} p-5 md:p-6`}>
              <h3 className="flex items-center gap-3 text-[17px] font-semibold leading-snug text-lr-head md:text-[18px] xl:text-[19px]">
                <WarnIcon className="h-6 w-6 text-lr-warn xl:h-7 xl:w-7" />
                Data note (internal):
              </h3>
              {note.length > 0 && <Paragraphs items={note} />}
              {corrections.length > 0 && (
                <ul className={`mt-3 list-disc space-y-2 pl-5 text-[14px] leading-[1.6] text-lr-body md:text-[15px] ${LINKS}`}>
                  {corrections.map((c, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: cellHtml(c) }} />
                  ))}
                </ul>
              )}
            </article>
          )}
          <aside className={`${CARD} flex flex-col gap-4 p-5 md:p-6 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between xl:col-span-1 xl:flex-col xl:items-start xl:justify-start`}>
            <p className="flex gap-3 text-[14px] leading-[1.6] text-lr-body md:text-[15px]">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-lr-muted" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="12" cy="12" r="9.2" />
                <path d="M12 11v5.2M12 7.6h.01" strokeLinecap="round" />
              </svg>
              <span>
                <span className="block">All enquiries are from 2025 (to date) and verified via our internal system.</span>
                <span className="mt-3 block">Recon costs are supply only and exclude fitting.</span>
              </span>
            </p>
            <Link
              href="/about/data-verification"
              className="inline-flex shrink-0 items-center gap-2.5 text-[15px] font-semibold text-lr-ink no-underline hover:underline xl:mt-auto dark:text-lr-green"
            >
              How we collect engine data
              <Arrow className="h-5 w-5" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
