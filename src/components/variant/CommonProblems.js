"use client";

import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

const ACCENT_BY_INDEX = ["#e03232", "#da7a12", "#075fd8"];
const URGENCY_TONE = {
  "🔴": { light: "text-[#db2e2e] bg-[#fff0f0]", dark: "text-[#ff8b90] bg-[rgba(255,45,53,0.15)]" },
  "🟠": { light: "text-[#da7a12] bg-[#fff5ea]", dark: "text-[#ffb66a] bg-[rgba(218,122,18,0.15)]" },
  "🟡": { light: "text-[#a3860f] bg-[#fffbe6]", dark: "text-[#e6c94d] bg-[rgba(214,180,20,0.15)]" },
};

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

function ProblemBody({ problem, isDark }) {
  const urgencyTone = URGENCY_TONE[problem.urgency?.icon] || URGENCY_TONE["🟠"];
  const urgencyClass = isDark ? urgencyTone.dark : urgencyTone.light;

  return (
    <div className="flex flex-col gap-2.5 text-[0.8rem] leading-[1.4]">
      {problem.symptoms ? (
        <p className="flex items-start gap-2 text-[var(--color-text-muted)]">
          <HomeIcon name="symptoms" size={28} className="mt-0.5 h-7 w-7 shrink-0" />
          <span>
            <span className="font-semibold text-[var(--color-text)]">Symptoms: </span>
            <span dangerouslySetInnerHTML={{ __html: problem.symptoms }} />
          </span>
        </p>
      ) : null}
      {problem.typicalMileage ? (
        <p className="flex items-start gap-2 text-[var(--color-text-muted)]">
          <HomeIcon name="checkWatch" size={28} className="mt-0.5 h-7 w-7 shrink-0" />
          <span>
            <span className="font-semibold text-[var(--color-text)]">Typical mileage: </span>
            {problem.typicalMileage}
          </span>
        </p>
      ) : null}
      {problem.repairCost ? (
        <p className="flex items-start gap-2 text-[var(--color-text-muted)]">
          <HomeIcon name="vettedSpecialists" size={28} className="mt-0.5 h-7 w-7 shrink-0" />
          <span>
            <span className="font-semibold text-[var(--color-text)]">Repair cost: </span>
            {problem.repairCost}
          </span>
        </p>
      ) : null}
      {problem.replacementCost ? (
        <p className="flex items-start gap-2 text-[var(--color-text-muted)]">
          <HomeIcon name="engine" size={28} className="mt-0.5 h-7 w-7 shrink-0" />
          <span>
            <span className="font-semibold text-[var(--color-text)]">Replacement cost: </span>
            {problem.replacementCost}
          </span>
        </p>
      ) : null}
      {problem.urgency ? (
        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${urgencyClass}`}>
          {problem.urgency.icon} {problem.urgency.label} - <span dangerouslySetInnerHTML={{ __html: problem.urgency.text }} />
        </span>
      ) : null}
      {problem.recommendation ? (
        <div className="border-t border-[var(--color-border)]/55 pt-2.5 text-[0.8rem] leading-[1.45]">
          <p className="font-semibold text-[var(--color-text)]">Our recommendation:</p>
          <p className="mt-1 text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.recommendation }} />
        </div>
      ) : null}
      {problem.failureLink?.href ? (
        <a href={problem.failureLink.href} className="mt-1 flex items-center gap-1.5 text-[0.78rem] font-semibold text-[var(--color-primary)] no-underline">
          {problem.failureLink.label || "Learn more"}
          <ArrowIcon className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : null}
    </div>
  );
}

function ProblemDetail({ problem, index, isDark }) {
  const accent = ACCENT_BY_INDEX[index % ACCENT_BY_INDEX.length];

  return (
    <div className="glass-panel flex h-full flex-col gap-3 overflow-hidden rounded-[8px] p-4" style={{ borderLeft: `4px solid ${accent}` }}>
      <div className="flex items-start gap-3">
        <HomeIcon name="expensiveFailure" size={36} className="h-9 w-9 shrink-0" />
        <h3 className="font-lora min-w-0 text-[0.95rem] font-medium leading-tight text-[var(--color-text)] md:text-[1.05rem]">
          {index + 1}. {problem.title}
        </h3>
      </div>
      <ProblemBody problem={problem} isDark={isDark} />
    </div>
  );
}

function ProblemAccordion({ problem, index, isOpen, onToggle, isDark }) {
  const accent = ACCENT_BY_INDEX[index % ACCENT_BY_INDEX.length];

  return (
    <div
      className={`overflow-hidden rounded-[8px] border bg-[var(--color-surface)] shadow-sm ${
        isOpen ? "border-2 border-[var(--color-primary)]" : "border-[var(--color-border)]/75"
      }`}
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <HomeIcon name="expensiveFailure" size={36} className="h-9 w-9 shrink-0" />
          <h3 className="font-lora min-w-0 text-[0.92rem] font-medium leading-tight text-[var(--color-text)]">
            {index + 1}. {problem.title}
          </h3>
        </div>
        <ChevronIcon open={isOpen} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
      </button>
      {isOpen ? (
        <div className="border-t border-[var(--color-border)]/55 px-4 pb-4 pt-3">
          <ProblemBody problem={problem} isDark={isDark} />
        </div>
      ) : null}
    </div>
  );
}

export default function CommonProblems({ data, band = "soft" }) {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  if (!data) return null;

  const isDark = theme === "dark";
  const problems = data.problems || [];

  return (
    <section className={`w-full py-6 text-[var(--color-text)] md:py-8 ${sectionBgClass(band)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <HeadingEyebrow text="COMMON PROBLEMS" />
        <h2 className="mt-2 font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem]">
          {data.h2 || "Common Problems"}
        </h2>

        <div className="mt-4 flex flex-col gap-3 md:hidden">
          {problems.map((problem, index) => (
            <ProblemAccordion
              key={problem.id}
              problem={problem}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              isDark={isDark}
            />
          ))}
        </div>

        <div className="mt-4 hidden gap-4 md:grid md:grid-cols-3">
          {problems.map((problem, index) => (
            <ProblemDetail key={problem.id} problem={problem} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
