"use client";

import Image from "next/image";
import { useState } from "react";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, CONTAINER, H2, H6, ICON_MD, LABEL, SMALL } from "@/lib/typeScale";

const DESKTOP_COLS = "grid-cols-[100px_98px_1.1fr_1.2fr_1.1fr_1.6fr] lg:grid-cols-[130px_110px_1.3fr_1.2fr_1.1fr_1.8fr]";

// Variant section: era map - one row per generation (years, engine code, reliability, recon cost,
// era note) from the page's `eraMap` JSON. Follows the site theme (day / night); `band` picks the
// page or the alternate section background.

// brand icons (outline family): cost data, verified reliability, experts, updated
const TRUST_POINTS = [
  { icon: "honest-repair-vs-replace", label: "Real UK Cost Data" },
  { icon: "genuine-failure-data", label: "Verified Reliability" },
  { icon: "users", label: "Expert Insights" },
  { icon: "gearbox-problem", label: "Updated for 2025" },
];

function splitBracketTag(value = "") {
  const match = value.match(/^(.*?)\s*\[([^\]]+)\]\s*$/);
  if (!match) return { main: value, tag: "" };
  return { main: match[1].trim(), tag: match[2] };
}

// gold eyebrow + short two-tone rule (same look as HeadingEyebrow, on the shared label size)
function Eyebrow({ text }) {
  return (
    <div className="w-fit max-w-full">
      <p className={`${LABEL} text-lr-gold`}>{text}</p>
      <span
        className="mt-2 block h-px w-full"
        style={{ background: "linear-gradient(to right, var(--lr-gold-line) 0 38%, var(--lr-line) 38% 100%)" }}
        aria-hidden="true"
      />
    </div>
  );
}

function GenerationBadge({ generation, className = "" }) {
  return (
    <span
      className={`${SMALL} absolute left-0 top-0 flex h-full w-14 items-start justify-start bg-lr-brand pl-1 pt-1 font-semibold text-lr-on-brand ${className}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 45% 100%, 0 100%)" }}
    >
      {generation}
    </span>
  );
}

// `car` is the variant's own Land Rover cutout (null when there is no clean cutout for it)
function GenerationThumb({ generation, car }) {
  return (
    <div className="relative h-16 w-full">
      <GenerationBadge generation={generation} />
      {car && <Image src={car} alt="" fill className="relative z-10 object-contain" sizes="130px" />}
    </div>
  );
}

// a table cell; the HTML sits in its own span so inline links stay in the text flow
function Cell({ className = "", html }) {
  return (
    <span className={`flex items-center px-3 ${className}`}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </span>
  );
}

function DesktopRow({ row, car }) {
  const cellDivider = "border-lr-line";
  const mutedText = "text-lr-body";

  return (
    <div className={`${BODY_SM} grid ${DESKTOP_COLS} items-stretch gap-px border-b border-lr-line bg-lr-card text-lr-head last:border-b-0`}>
      <div className="flex items-center px-2 py-2">
        <GenerationThumb generation={row.generation} car={car} />
      </div>
      <Cell className={`border-r ${cellDivider}`} html={row.years} />
      <Cell className={`${mutedText} border-r ${cellDivider}`} html={row.engineCode} />
      <Cell className={`font-semibold text-lr-green border-r ${cellDivider}`} html={row.reliability} />
      <Cell className={`font-semibold border-r ${cellDivider}`} html={row.reconCost} />
      <Cell className={`py-3 ${mutedText}`} html={row.eraNote} />
    </div>
  );
}

function MobileCard({ row, car, isOpen, onToggle }) {
  const reliability = splitBracketTag(row.reliability);
  const reconCost = splitBracketTag(row.reconCost);

  return (
    <div className={`overflow-hidden rounded-[8px] border ${isOpen ? "border-lr-green" : "border-lr-line"} bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)]`}>
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="relative grid w-full grid-cols-[104px_1fr_1fr] p-3 text-left">
        <span className={`absolute right-3 top-3 text-lr-green transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>

        <div className="flex flex-col items-center gap-0.5 pr-2.5">
          <span className="w-full rounded-[8px] bg-lr-brand px-2 py-0.5 text-center text-[12px] font-semibold leading-tight text-lr-on-brand">{row.generation}</span>
          <span className="text-center text-[11.5px] leading-tight text-lr-body" dangerouslySetInnerHTML={{ __html: row.years }} />
          {car && (
            <div className="relative h-20 w-full">
              <Image src={car} alt="" fill className="object-contain" sizes="104px" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1 border-l border-lr-line px-2.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-lr-muted">Engine Code</p>
          <p className="text-[14px] font-semibold leading-tight text-lr-head" dangerouslySetInnerHTML={{ __html: row.engineCode }} />
        </div>

        <div className="flex min-w-0 flex-col gap-2 border-l border-lr-line px-2.5 pr-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-lr-muted">Reliability</p>
            <p className="text-[14px] font-semibold leading-tight text-lr-green" dangerouslySetInnerHTML={{ __html: reliability.main }} />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-lr-muted">Recon Cost (Guide)</p>
            <p className="text-[13.5px] font-semibold leading-tight text-lr-green" dangerouslySetInnerHTML={{ __html: reconCost.main }} />
          </div>
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-lr-line px-3.5 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-lr-muted">Era Note</p>
          <p className={`${BODY_SM} mt-0.5 text-lr-body`} dangerouslySetInnerHTML={{ __html: row.eraNote }} />
        </div>
      ) : null}
    </div>
  );
}

export default function EraMap({ data, band = "soft", car = null }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!data) return null;

  const rows = data.rows || [];

  return (
    <section className={`w-full py-6 text-lr-head md:py-8 ${band === "soft" ? "bg-lr-band" : "bg-lr-page"}`}>
      <div className={`relative ${CONTAINER}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Eyebrow text="ERA MAP" />
            <h2 className={`${H2} mt-3 text-lr-head`}>{data.title}</h2>
            <p className={`${BODY} mt-2 max-w-[720px] text-lr-body`}>
              Four generations. Four eras. One guide to reliability, costs and what really matters.
            </p>
          </div>
        </div>

        {rows.length > 0 ? (
          <>
            <div className="mt-4 flex flex-col gap-3 md:hidden">
              {rows.map((row, index) => (
                <MobileCard
                  key={row.generation}
                  row={row}
                  car={car}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>

            <div className="mt-4 hidden overflow-hidden rounded-[8px] border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:block">
              <div className={`${SMALL} grid ${DESKTOP_COLS} gap-px bg-lr-brand px-2 py-3 font-medium text-lr-on-brand`}>
                {data.columns?.map((col) => (
                  <span key={col} className="flex items-center justify-center border-r border-lr-on-brand/25 px-3 text-center last:border-r-0">
                    {col}
                  </span>
                ))}
              </div>
              <div className="bg-lr-card">
                {rows.map((row) => (
                  <DesktopRow key={row.generation} row={row} car={car} />
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-4 flex flex-col items-start gap-6 rounded-[8px] border border-lr-line bg-lr-card p-5 shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:p-7 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex min-w-0 flex-1 items-start gap-4 lg:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-lr-green/20 bg-lr-chip">
              <LrIcon name="generation-honest-rated" className={ICON_MD} />
            </span>
            <div>
              <p className={`${H6} text-lr-head`}>Why use this era map?</p>
              <p
                className={`${BODY_SM} mt-1 text-lr-body`}
                dangerouslySetInnerHTML={{
                  __html:
                    data.sourceNote ||
                    "Every cost guide, reliability rating and engine code on this page is aligned to the data above. This keeps everything consistent and trustworthy.",
                }}
              />
            </div>
          </div>

          <span aria-hidden="true" className="hidden h-12 w-px shrink-0 bg-lr-line lg:block" />

          <ul className="grid w-full grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 lg:w-auto lg:shrink-0 lg:grid-cols-2 lg:gap-x-8">
            {TRUST_POINTS.map((point) => (
              <li key={point.label} className="flex items-center gap-2.5">
                <LrIcon name={point.icon} className={ICON_MD} />
                <span className={`${SMALL} font-medium text-lr-head lg:whitespace-nowrap`}>{point.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.dataNote ? (
          <p className={`${SMALL} mt-4 text-lr-muted`} dangerouslySetInnerHTML={{ __html: data.dataNote }} />
        ) : null}
      </div>
    </section>
  );
}
