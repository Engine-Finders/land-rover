"use client";

import { useId, useRef, useState } from "react";
import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { BODY_SM, CONTAINER } from "@/lib/typeScale";
import {
  Arrow,
  BAND_SOFT,
  CARD,
  Chevron,
  EyebrowPill,
  IconTile,
  SANS,
  SECTION_Y,
  SERIF,
  SectionTitle,
  SoftTile,
  Stars,
  generationCar,
  parseRating,
  prose,
  INTRO,
} from "@/components/models/modelKit";
import { comparePage, localHref, localHtml } from "@/components/models/generationsFaqLinks";

// Model page section 4 (Generations), built to the approved reference: one card per generation -
// car tile, serif title, the enquiry badge, years and engines (engine links in green), the star
// rating beside the generation's own car, and the verdict behind an accordion chevron - plus the
// question card ("The Classic vs L663 Question") as a pick diagram, the "… - The Line That Matters"
// table and the "Read the full comparison" row.
//
// Layout: phones stack the cards (the first open, the rest folded to title, badge and stars);
// tablets use two columns (an odd last card spans both); from 1280px up to three cards share one
// row weighted like the reference (the open card widest, the question card narrowest), and four or
// more cards (Discovery, Range Rover) run in rows of three with the last row sharing the width.
// Inside each card a container query puts the car beside the copy once the card is wide enough.

const TITLE = `${SERIF} text-[21px] leading-[1.2] text-lr-head md:text-[23px] xl:text-[26px]`;
const PRIMARY =
  "bg-lr-brand text-lr-on-brand shadow-[0_12px_26px_-16px_rgba(18,61,42,0.85)] hover:bg-lr-brand-hover dark:border dark:border-lr-green/45 dark:bg-lr-brand/35 dark:hover:bg-lr-brand/55";
const OUTLINE =
  "border border-lr-line-strong bg-lr-card text-lr-ink hover:border-lr-ink/50 dark:border-lr-gold-line/55 dark:bg-transparent dark:text-lr-gold dark:hover:bg-lr-gold/10";
const LINKS = "[&_a]:font-medium [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline";

const isQuestion = (card) => !String(card?.verdict || "").trim();
// the badge's leading emoji (🔥) gets its own breathing room
const badgeHtml = (badge = "") =>
  prose(badge).replace(/^(\p{Extended_Pictographic}\uFE0F?)\s*/u, '<span class="mr-1.5" aria-hidden="true">$1</span>');
const stripArrow = (s = "") => String(s).replace(/\s*(?:→|->)\s*$/, "").trim();
// "Range Rover Velar (L560)" -> "L560", "Evoque L538" -> "L538", "Discovery 4 (L319)" -> "Discovery 4"
function shortName(title = "") {
  const t = String(title);
  const code = t.match(/\b(L\d{3}|P38A?|D\d)\b/i);
  if (/Discovery \d/i.test(t)) return t.match(/Discovery \d/i)[0];
  return code ? code[1] : t;
}

// Folding region: grid-rows 0fr <-> 1fr animates the height; `phones` folds only below md.
function Fold({ open, phones = false, className = "", innerClass = "", children, ...rest }) {
  const shut = phones ? "grid-rows-[1fr] max-md:invisible max-md:grid-rows-[0fr]" : "invisible grid-rows-[0fr]";
  return (
    <div className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : shut} ${className}`} {...rest}>
      <div className={`min-h-0 overflow-hidden ${innerClass}`}>{children}</div>
    </div>
  );
}

function GenerationCard({ card, slug, index, open, onToggle, cardRef, className = "" }) {
  const id = useId();
  const rating = parseRating(String(card.rating || "").replace(/\uFE0F/g, ""));
  const car = generationCar(card.title, slug);
  const href = localHref(card.cta?.href);
  const label = stripArrow(card.cta?.label);
  const primary = index === 0;

  return (
    <article
      ref={cardRef}
      className={`${CARD} flex scroll-mt-24 flex-col p-4 transition-colors sm:p-5 xl:p-6 ${open ? "border-lr-ink/45! dark:border-lr-green/45!" : ""} ${className}`}
    >
      {/* header: the whole row toggles the verdict */}
      <div className="relative flex items-start gap-3.5 md:gap-4">
        <IconTile name="vehicle" />
        <div className="min-w-0 flex-1 pr-8">
          <h3 className={TITLE}>
            <button
              type="button"
              id={`${id}-btn`}
              aria-expanded={open}
              aria-controls={`${id}-verdict`}
              onClick={onToggle}
              className="rounded-sm text-left after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-lr-green/60"
            >
              {card.title}
            </button>
          </h3>
          {card.badge && (
            <p className="mt-1.5 text-[13.5px] leading-snug text-lr-head md:text-[14px] xl:text-[15px]" dangerouslySetInnerHTML={{ __html: badgeHtml(card.badge) }} />
          )}
        </div>
        <Chevron className={`pointer-events-none absolute right-0 top-1 h-6 w-6 text-lr-ink transition-transform duration-300 dark:text-lr-green ${open ? "rotate-180" : ""}`} />
      </div>

      {/* years + engines, stars, the car, the verdict and the button share one grid: stacked in
          narrow cards, the car beside the copy in wider ones, and in a full-width card (a single
          generation) the car stands beside the whole column */}
      <div className={`@container flex flex-1 flex-col md:mt-5 ${open ? "mt-4" : "mt-2.5"}`}>
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_minmax(0,50%)] grid-rows-[auto_auto_auto_1fr] gap-x-3 [grid-template-areas:'meta_meta'_'rating_car'_'verdict_verdict'_'cta_cta'] @min-[26rem]:grid-cols-[minmax(0,1fr)_minmax(0,46%)] @min-[26rem]:gap-x-5 @min-[26rem]:[grid-template-areas:'meta_car'_'rating_car'_'verdict_verdict'_'cta_cta'] @min-[48rem]:grid-cols-[minmax(0,1fr)_minmax(0,36%)] @min-[48rem]:gap-x-10 @min-[48rem]:[grid-template-areas:'meta_car'_'rating_car'_'verdict_car'_'cta_car']">
          {card.meta && (
            <Fold open={open} phones className="[grid-area:meta]">
              <p className={`text-[15px] leading-[1.6] text-lr-head md:text-[15.5px] xl:text-[16px] ${LINKS}`} dangerouslySetInnerHTML={{ __html: localHtml(prose(card.meta)) }} />
            </Fold>
          )}
          {rating.stars && (
            <div className={`self-end pb-1 [grid-area:rating] md:pt-3 @min-[26rem]:pt-4 @min-[48rem]:self-start ${open ? "pt-3" : "pt-1"}`}>
              <Stars {...rating} size="h-5 w-5 @min-[26rem]:h-6 @min-[26rem]:w-6 @min-[34rem]:h-7 @min-[34rem]:w-7" className="gap-1 @min-[26rem]:gap-1.5" />
            </div>
          )}
          {car && (
            <Fold open={open} phones className="self-end [grid-area:car] @min-[48rem]:self-center" innerClass="pb-2 pt-2">
              <div className="ml-auto w-full max-w-[300px] @min-[48rem]:mx-auto @min-[48rem]:max-w-[360px]">
                <GroundedCar src={car} studio sizes="(min-width: 1280px) 360px, (min-width: 768px) 40vw, 50vw" />
              </div>
            </Fold>
          )}

          {/* the verdict folds at every size */}
          <Fold open={open} id={`${id}-verdict`} role="region" aria-labelledby={`${id}-btn`} className="[grid-area:verdict]">
            <div className="mt-4 border-t border-lr-line pt-4 md:mt-5 md:pt-5">
              <p className="text-[15px] font-semibold text-lr-ink md:text-[16px] dark:text-lr-green">Our Verdict:</p>
              <p className={`${BODY_SM} mt-1.5 text-lr-body ${LINKS}`} dangerouslySetInnerHTML={{ __html: localHtml(prose(card.verdict)) }} />
            </div>
          </Fold>

          {label && href && (
            <Fold open={open} phones className="self-end [grid-area:cta]">
              <div className="pt-5">
                <a
                  href={href}
                  className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-lg px-4 text-[15px] font-semibold no-underline transition-colors md:text-[16px] xl:h-[52px] ${primary ? PRIMARY : OUTLINE}`}
                >
                  {label}
                  <Arrow className="h-5 w-5" />
                </a>
              </div>
            </Fold>
          )}
        </div>
      </div>
    </article>
  );
}

// "The Classic vs L663 Question" -> Classic ? L663; a "Pre-2021 Pick" meta labels the two sides of
// that year; with neither, the line runs between the generations on the other cards.
function pickDiagram(card, others) {
  const title = String(card.title || "").replace(/\s+[-–—]\s+.*$/, "");
  const meta = String(card.meta || "").trim();
  const vs = title.match(/^(?:the\s+)?(.+?)\s+vs\.?\s+(.+?)(?:\s+question)?\s*\??$/i);
  const pre = meta.match(/^pre-(\d{4})\s+pick$/i);
  const year = title.match(/:\s*(\d{4})\s*$/);
  if (vs) return { left: vs[1], right: vs[2], leftSub: pre ? meta : "", rightSub: pre ? `${pre[1]}+ Pick` : "", center: "?" };
  if (pre) return { left: meta, right: `${pre[1]}+ Pick`, center: "?" };
  const names = others.filter((c) => !isQuestion(c)).map((c) => shortName(c.title));
  if (names.length >= 2) return { left: names[0], right: names[names.length - 1], center: year ? year[1] : "?" };
  return null;
}

function DiagramNode({ name, sub }) {
  return (
    <span className="flex max-w-[7rem] flex-col items-center text-center">
      <span className="text-[15px] font-medium leading-snug text-lr-head max-[359px]:text-[14px] md:text-[16px]">{name}</span>
      {sub && <span className="mt-1 text-[13px] leading-snug text-lr-muted">{sub}</span>}
    </span>
  );
}

function QuestionCard({ card, others, linkTaken, className = "" }) {
  const diagram = pickDiagram(card, others);
  const meta = String(card.meta || "").trim();
  const paragraph = meta && !/^pre-\d{4}\s+pick$/i.test(meta) ? meta : "";
  // match the guide on the card's own title: its paragraph can name other models in passing
  const guide = comparePage(String(card.title || ""));
  const link = guide && guide.href !== linkTaken ? guide : null;

  return (
    <article className={`${CARD} flex min-w-0 flex-col p-4 sm:p-5 xl:p-6 ${className}`}>
      <div className="flex items-start gap-3.5 md:gap-4">
        <IconTile name="scale" />
        <h3 className={`${TITLE} min-w-0 flex-1 pt-0.5`} dangerouslySetInnerHTML={{ __html: prose(card.title) }} />
      </div>
      {diagram && (
        <div className={`flex items-center justify-center ${paragraph ? "pb-1 pt-6 md:pt-7" : "flex-1 py-7 md:py-9"}`} aria-label={`${diagram.left} or ${diagram.right}`} role="img">
          {/* the smallest phones tighten the dashes, gaps and circle so "Freelander 1 ? Freelander 2" fits the card */}
          <div className="flex items-center gap-2 max-[359px]:gap-1.5 sm:gap-3">
            <DiagramNode name={diagram.left} sub={diagram.leftSub} />
            <span className="w-6 border-t-2 border-dashed border-lr-line-strong max-[359px]:w-3 sm:w-9" aria-hidden="true" />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lr-brand text-[19px] font-semibold max-[359px]:h-11 max-[359px]:w-11 text-lr-on-brand shadow-[0_10px_24px_-14px_rgba(18,61,42,0.9)] md:h-14 md:w-14 md:text-[21px] dark:border dark:border-lr-green/45 dark:bg-lr-brand/35" aria-hidden="true">
              {diagram.center}
            </span>
            <span className="w-6 border-t-2 border-dashed border-lr-line-strong max-[359px]:w-3 sm:w-9" aria-hidden="true" />
            <DiagramNode name={diagram.right} sub={diagram.rightSub} />
          </div>
        </div>
      )}
      {paragraph && (
        <p className={`${BODY_SM} text-lr-body ${diagram ? "mt-5 border-t border-lr-line pt-5" : "mt-4"} ${LINKS}`} dangerouslySetInnerHTML={{ __html: localHtml(prose(paragraph)) }} />
      )}
      {link && (
        <div className="mt-auto pt-2">
          <a href={link.href} className={`flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg px-4 py-2.5 text-center text-[15px] font-semibold leading-snug no-underline transition-colors md:text-[16px] xl:min-h-[52px] ${OUTLINE}`}>
            <span>{link.label}</span>
            <Arrow className="h-5 w-5" />
          </a>
        </div>
      )}
    </article>
  );
}

// ----------------------------------------------------------------- "The Line That Matters" table

const CAUTION = /caveat|risk|fail|tensioner|avoid/i;
const GOOD = /revised|recommend|improved|update|stiffer|hybrid-ready/i;

function rowIcon(label = "") {
  if (/diesel|petrol|fuel|hybrid/i.test(label)) return "petrol";
  if (/platform|chassis|body|architecture/i.test(label)) return "chassis";
  if (/position|verdict|recommend/i.test(label)) return "independent-star";
  if (/engine/i.test(label)) return "engine";
  return "specific-knowledge";
}

const isPosition = (row) => /our position/i.test(row?.model || "");
const rowValues = (row, count) => [row.engineCode, row.power, row.induction, row.years, row.notes].slice(0, count);

// "2015–2019 (pre-facelift)" -> ["2015–2019", "(pre-facelift)"]
function splitHead(text = "") {
  const m = String(text).match(/^(.*?)\s*(\(.+\))$/);
  return m ? [m[1], m[2]] : [text, ""];
}

function Calendar({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 text-lr-ink dark:text-lr-green ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

// the part before the dash in the cell's own words: red when it names a caveat, green when it
// names the fix (the reference's red pre-facelift / green facelift engine codes)
function Cell({ value, position, avoid = false }) {
  const html = localHtml(prose(value || ""));
  if (!html) return <span className="text-lr-muted">—</span>;
  if (position) return <span className="font-semibold text-lr-ink dark:text-lr-green" dangerouslySetInnerHTML={{ __html: html }} />;
  let cut = html.indexOf(" — ");
  if (cut > 0 && (html.slice(0, cut).match(/\(/g) || []).length !== (html.slice(0, cut).match(/\)/g) || []).length) cut = -1;
  if (avoid && cut <= 0) return <span className="font-medium text-lr-bad" dangerouslySetInnerHTML={{ __html: html }} />;
  if (cut > 0) {
    const tone = avoid || CAUTION.test(html) ? "text-lr-bad" : GOOD.test(html) ? "text-lr-good" : "text-lr-head";
    return (
      <>
        <span className={`font-medium ${tone}`} dangerouslySetInnerHTML={{ __html: html.slice(0, cut) }} />
        <span dangerouslySetInnerHTML={{ __html: html.slice(cut) }} />
      </>
    );
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function CompareRow({ link }) {
  const raw = String(link?.label || "");
  const lead = raw.match(/^(read the full [^:]+:)\s*/i);
  const label = stripArrow(lead ? raw.slice(lead[0].length) : raw).replace(/\s+-\s+/g, " — ");
  if (!label) return null;
  const href = localHref(link.href) || comparePage(label)?.href || "";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-4 sm:px-5 xl:px-6">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lr-chip">
        <LrIcon name="two-cars" tone="current" className="h-5 w-5 text-lr-ink dark:text-lr-green" />
      </span>
      <span className="text-[15px] text-lr-body md:text-[16px]">{lead ? lead[1].replace(/^read/i, "Read") : "Read the full comparison:"}</span>
      {href ? (
        <a href={href} className="inline-flex items-center gap-2 text-[15px] font-semibold text-lr-ink no-underline hover:underline md:text-[16px] dark:text-lr-green">
          {label}
          <Arrow className="h-[18px] w-[18px]" />
        </a>
      ) : (
        <span className="text-[15px] font-semibold text-lr-head md:text-[16px]">{label}</span>
      )}
    </div>
  );
}

function RangeTable({ table, link }) {
  const columns = table.columns || [];
  const rows = table.rows || [];
  const eras = columns.slice(1);
  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="flex items-center gap-3 px-4 pt-4 sm:px-5 sm:pt-5 xl:px-6 xl:pt-6">
        <SoftTile name="scale" className="h-10 w-10 md:h-11 md:w-11" iconClass="h-5 w-5 md:h-[22px] md:w-[22px]" />
        <h3 className={`${SERIF} min-w-0 text-[19px] leading-[1.25] text-lr-head md:text-[21px] xl:text-[24px]`} dangerouslySetInnerHTML={{ __html: prose(table.title) }} />
      </div>

      {/* tablets and up: the comparison table */}
      <div className="hidden px-5 pt-4 md:block xl:px-6 xl:pt-5">
        <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-lr-line text-left">
          <thead>
            <tr className="bg-lr-panel">
              <th scope="col" className="w-[22%] border-b border-lr-line px-4 py-3.5 text-[14px] font-medium text-lr-muted xl:px-5 xl:text-[15px]">
                {columns[0]}
              </th>
              {eras.map((col) => {
                const [main, sub] = splitHead(col);
                return (
                  <th key={col} scope="col" className="border-b border-l border-lr-line px-4 py-3.5 align-top xl:px-5">
                    <span className="flex items-start gap-2.5">
                      {/\d{4}/.test(col) && <Calendar className="mt-0.5 h-5 w-5" />}
                      <span className="text-[15px] leading-snug xl:text-[16px]">
                        <span className="block font-semibold text-lr-head">{main}</span>
                        {sub && <span className="block font-normal text-lr-body">{sub}</span>}
                      </span>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => {
              const position = isPosition(row);
              const last = r === rows.length - 1;
              return (
                <tr key={row.model || r} className={position ? "bg-lr-chip/80 dark:bg-lr-chip/60" : ""}>
                  <th scope="row" className={`px-4 py-3.5 align-middle xl:px-5 ${last ? "" : "border-b border-lr-line"}`}>
                    <span className="flex items-center gap-3">
                      <LrIcon name={rowIcon(row.model)} tone="current" className="h-5 w-5 text-lr-ink dark:text-lr-green" />
                      <span className={`text-[15px] leading-snug xl:text-[16px] ${position ? "font-semibold text-lr-ink dark:text-lr-green" : "font-medium text-lr-head"}`}>{row.model}</span>
                    </span>
                  </th>
                  {rowValues(row, eras.length).map((value, c) => (
                    <td key={c} className={`border-l border-lr-line px-4 py-3.5 align-middle text-[15px] leading-snug text-lr-body xl:px-5 xl:text-[15.5px] ${last ? "" : "border-b"}`}>
                      <Cell value={value} position={position} avoid={/avoid/i.test(eras[c] || "")} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* phones: one block per row (the driving need / aspect), each column's answer under it with
          the column named, "our position" highlighted - read top to bottom like a chooser */}
      <div className="space-y-3 px-4 pt-4 sm:px-5 md:hidden">
        {rows.map((row, r) => {
          const position = isPosition(row);
          const values = rowValues(row, eras.length);
          return (
            <div key={row.model || r} className={`overflow-hidden rounded-xl border ${position ? "border-lr-ink/25 bg-lr-chip/80 dark:border-lr-green/30 dark:bg-lr-chip/60" : "border-lr-line"}`}>
              <p className={`flex items-center gap-2.5 px-4 py-3 ${position ? "" : "bg-lr-panel"}`}>
                <LrIcon name={rowIcon(row.model)} tone="current" className="h-[18px] w-[18px] shrink-0 text-lr-ink dark:text-lr-green" />
                <span className={`text-[15px] font-semibold leading-snug ${position ? "text-lr-ink dark:text-lr-green" : "text-lr-head"}`}>{row.model}</span>
              </p>
              <dl className={`divide-y ${position ? "divide-lr-ink/15 dark:divide-lr-green/20" : "divide-lr-line"}`}>
                {eras.map((col, c) => {
                  const [main, sub] = splitHead(col);
                  return (
                    <div key={col} className="grid grid-cols-[minmax(0,38%)_minmax(0,1fr)] gap-3 px-4 py-2.5">
                      <dt className="flex items-start gap-1.5 text-[13px] font-medium leading-snug text-lr-muted">
                        {/\d{4}/.test(col) && <Calendar className="mt-px h-3.5 w-3.5" />}
                        <span>
                          {main}
                          {sub && <span className="block font-normal">{sub}</span>}
                        </span>
                      </dt>
                      <dd className="text-[14.5px] leading-snug text-lr-body">
                        <Cell value={values[c]} position={position} avoid={/avoid/i.test(col)} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>

      {link?.label ? (
        <div className="mt-2 md:mt-1">
          <CompareRow link={link} />
        </div>
      ) : (
        <div className="h-4 sm:h-5 xl:h-6" />
      )}
    </div>
  );
}

// ----------------------------------------------------------------- layout

// per-card span classes and the xl column template for the weighted single row
function layout(cards, openIndex) {
  const n = cards.length;
  const spans = cards.map((_, i) => {
    let cls = n % 2 === 1 && i === n - 1 ? "md:col-span-2" : "";
    if (n <= 3) cls += " xl:col-span-1";
    else if (n === 4) cls += " xl:col-span-1";
    else {
      const r = n % 3;
      const lastRowStart = r === 0 ? n - 3 : n - r;
      cls += i < lastRowStart || r === 0 ? " xl:col-span-2" : r === 2 ? " xl:col-span-3" : " xl:col-span-6";
    }
    return cls;
  });
  let grid = "md:grid-cols-2";
  let cols = "";
  if (n <= 3) {
    grid += " xl:[grid-template-columns:var(--gen-cols)] xl:transition-[grid-template-columns] xl:duration-500 xl:ease-out";
    cols = cards
      .map((c, i) => (isQuestion(c) ? (String(c.meta || "").length > 120 ? "1fr" : "0.78fr") : i === openIndex ? "1.4fr" : "1fr"))
      .map((w) => `minmax(0,${w})`)
      .join(" ");
  } else if (n === 4) grid += " xl:grid-cols-2";
  else grid += " xl:grid-cols-6";
  return { spans, grid, cols };
}

export default function GenerationsGrid({ data, slug = "" }) {
  const [openIndex, setOpenIndex] = useState(0);
  const cardRefs = useRef([]);
  if (!data) return null;

  // On phones the card that opens can be pushed up as the open one above it folds: once the fold
  // has run, bring the newly opened card's top back into view.
  const toggle = (i) => {
    const opening = openIndex !== i;
    setOpenIndex(opening ? i : -1);
    if (!opening || typeof window === "undefined" || window.innerWidth >= 768) return;
    window.setTimeout(() => {
      const el = cardRefs.current[i];
      if (el && el.getBoundingClientRect().top < 72) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
  };

  const cards = data.cards || [];
  const table = data.rangeTable?.rows?.length ? data.rangeTable : null;
  const link = data.comparisonLink?.label ? data.comparisonLink : null;
  const linkHref = link ? localHref(link.href) || comparePage(link.label)?.href || "" : "";
  const { spans, grid, cols } = layout(cards, openIndex);

  return (
    <section id="generations" className={`${BAND_SOFT} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <EyebrowPill icon="scale">Generations</EyebrowPill>
        <SectionTitle h2={data.h2} className="mt-3 md:mt-4" />
        {data.subHeadline && <p className={`${INTRO} max-w-[34em]!`} dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }} />}

        {cards.length > 0 && (
          <div className={`mt-6 grid gap-4 md:mt-8 md:gap-5 ${grid}`} style={cols ? { "--gen-cols": cols } : undefined}>
            {cards.map((card, i) =>
              isQuestion(card) ? (
                <QuestionCard key={card.title || i} card={card} others={cards} linkTaken={linkHref} className={spans[i]} />
              ) : (
                <GenerationCard
                  key={card.title || i}
                  card={card}
                  slug={slug}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => toggle(i)}
                  cardRef={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={spans[i]}
                />
              ),
            )}
          </div>
        )}

        {table ? (
          <div className="mt-5 md:mt-6">
            <RangeTable table={table} link={link} />
          </div>
        ) : (
          link && <div className={`${CARD} mt-5 md:mt-6`}><CompareRow link={link} /></div>
        )}
      </div>
    </section>
  );
}
