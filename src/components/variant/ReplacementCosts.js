"use client";

import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

const ROW_ICONS = ["quote", "engine", "vettedSpecialists", "flagshipChoice"];
const DESKTOP_COLS = "grid-cols-[1.2fr_1fr_1fr_0.9fr_1.4fr]";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ open = false, className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function DesktopRow({ row, icon, isDark }) {
  const rowClass = isDark ? "bg-black text-white" : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]/55";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]/55";

  return (
    <div className={`grid ${DESKTOP_COLS} items-center gap-px ${rowClass} px-2 py-3 text-[0.82rem] border-b ${borderBottom} last:border-b-0`}>
      <span className="flex items-center gap-2.5 px-2 font-semibold">
        <HomeIcon name={icon} size={32} className="h-8 w-8 shrink-0" />
        <span dangerouslySetInnerHTML={{ __html: row.engineType }} />
      </span>
      <span className={`px-2 border-l ${cellDivider} ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.supplyOnly }} />
      <span className={`px-2 border-l ${cellDivider} ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.fittedIndie }} />
      <span className={`flex items-center gap-2 px-2 border-l ${cellDivider}`}>
        <HomeIcon name="safestBuy" size={28} className="h-7 w-7 shrink-0" />
        <span dangerouslySetInnerHTML={{ __html: row.warranty }} />
      </span>
      <span className={`px-2 border-l ${cellDivider} ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.bestFor }} />
    </div>
  );
}

function AccordionRow({ row, icon, isOpen, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-[8px] border shadow-sm ${
        isOpen ? "border-2 border-[var(--color-primary)]" : "border-[var(--color-border)]/75"
      } bg-[var(--color-surface)]`}
    >
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <HomeIcon name={icon} size={36} className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-[0.92rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.engineType }} />
            <p className="mt-0.5 truncate text-[0.74rem] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: row.bestFor }} />
          </div>
        </div>
        <ChevronIcon open={isOpen} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-2.5 px-4 pb-4 text-[0.84rem]">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)]/55 pt-2.5">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <HomeIcon name="quote" size={28} className="h-7 w-7 shrink-0" />
              Supply Only
            </span>
            <span className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: row.supplyOnly }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)]/55 pt-2.5">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <HomeIcon name="vettedSpecialists" size={28} className="h-7 w-7 shrink-0" />
              Fitted (Indie)
            </span>
            <span className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: row.fittedIndie }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)]/55 pt-2.5">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <HomeIcon name="safestBuy" size={28} className="h-7 w-7 shrink-0" />
              Warranty
            </span>
            <span className="font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.warranty }} />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)]/55 pt-2.5">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <HomeIcon name="users" size={28} className="h-7 w-7 shrink-0" />
              Best For
            </span>
            <span className="text-right text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.bestFor }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ReplacementCosts({ data, band = "page" }) {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(1);
  if (!data) return null;

  const isDark = theme === "dark";
  const headerBg = isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/18";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  return (
    <section className={`w-full py-8 text-[var(--color-text)] md:py-10 ${sectionBgClass(band)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <HeadingEyebrow text="REPLACEMENT COSTS" />
        <h2 className="mt-3 font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem]">{data.h2}</h2>

        <div className="mt-6 flex flex-col gap-3 md:hidden">
          {data.rows?.map((row, index) => (
            <AccordionRow
              key={row.engineType}
              row={row}
              icon={ROW_ICONS[index % ROW_ICONS.length]}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid ${DESKTOP_COLS} gap-px ${headerBg} px-2 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`px-2 text-center ${index > 0 ? `border-l ${headerDivider}` : ""}`}>
                {col}
              </span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row, index) => (
              <DesktopRow key={row.engineType} row={row} icon={ROW_ICONS[index % ROW_ICONS.length]} isDark={isDark} />
            ))}
          </div>
        </div>

        {data.figuresNote ? (
          <div className="glass-panel mt-6 flex gap-3 rounded-[8px] p-4">
            <HomeIcon name="note" size={36} className="mt-0.5 h-9 w-9 shrink-0" />
            <p className="text-[0.82rem] leading-[1.5] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: data.figuresNote }} />
          </div>
        ) : null}

        {data.labourEstimate ? (
          <div className="mt-4 flex items-center gap-4 rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-4 shadow-sm md:hidden">
            <HomeIcon name="vettedSpecialists" size={40} className="h-10 w-10 shrink-0" />
            <p className="text-[0.82rem] leading-[1.45] text-[var(--color-text)]">
              <span className="font-bold">Labour estimate: </span>
              <span dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />
            </p>
          </div>
        ) : null}

        {data.labourEstimate || data.cta?.label ? (
          <div className="mt-4 hidden items-center gap-4 rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-4 shadow-sm md:flex">
            {data.labourEstimate ? (
              <>
                <HomeIcon name="vettedSpecialists" size={40} className="h-10 w-10 shrink-0" />
                <p className="flex-1 text-[0.82rem] leading-[1.45] text-[var(--color-text)]">
                  <span className="font-bold">Labour estimate: </span>
                  <span dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />
                </p>
              </>
            ) : null}
            {data.cta?.label ? (
              <a
                href="/quote"
                className="btn-cta flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-[var(--color-primary)] px-4 py-2.5 text-[0.8rem] font-bold text-white no-underline shadow-[0_12px_28px_var(--color-shadow)]"
              >
                <ArrowIcon className="h-4 w-4 shrink-0" />
                {data.cta.label}
              </a>
            ) : null}
          </div>
        ) : null}

        {data.cta?.label ? (
          <a
            href="/quote"
            className="btn-cta mt-4 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-3 py-2.5 text-white no-underline shadow-[0_12px_28px_var(--color-shadow)] md:hidden"
          >
            <ArrowIcon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap text-center text-[0.78rem] font-bold md:text-[0.9rem]">{data.cta.label}</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
