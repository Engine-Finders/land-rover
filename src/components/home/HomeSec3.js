"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


const costKeys = ["failure", "reconditioned", "rebuilt", "used", "dealer"];

const legendTone = {
  green: "bg-[var(--color-accent-green)]",
  blue: "bg-[#3b82f6]",
  gold: "bg-[var(--color-accent)]",
  red: "bg-[var(--color-accent-red)]",
};

const severityMeta = {
  catastrophic: {
    label: "Catastrophic",
    className: "border-[#f7c8cc] bg-[#fff0f1] text-[#c42430]",
    darkClassName: "border-[rgba(255,90,100,0.34)] bg-[rgba(255,45,53,0.14)] text-[#ff9aa0]",
  },
  immediate: {
    label: "Immediate",
    className: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]",
    darkClassName: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]",
  },
  monitor: {
    label: "Monitor",
    className: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]",
    darkClassName: "border-[rgba(222,177,65,0.34)] bg-[rgba(222,177,65,0.13)] text-[#ffd473]",
  },
  low: {
    label: "Low Risk",
    className: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkClassName: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]",
  },
};

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function fmtCurrency(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}

function formatStepValue(value) {
  if (value >= 1000) return `£${value / 1000}k`;
  return `£${value}`;
}

function getVerdict(diagnosis, carValue, ageId) {
  const repairMid = (diagnosis.repairLow + diagnosis.repairHigh) / 2;
  const replaceMid = (diagnosis.replaceLow + diagnosis.replaceHigh) / 2;
  const repairPct = carValue ? repairMid / carValue : 0;
  const replacePct = carValue ? replaceMid / carValue : 0;
  const ageAdjustments = { under5: 0.08, "5to10": 0.04, "10to15": 0, over15: -0.08 };
  const ageAdjustment = ageAdjustments[ageId] || 0;

  let title = "Proceed carefully or walk away";
  let text = "Projected spend is too close to the car's value. A specialist inspection should decide whether it is still worth saving.";

  if (repairPct <= 0.32 + ageAdjustment / 2 || diagnosis.severity === "low") {
    title = "Repair it";
    text = "Repair cost is proportionate to the car's value. Replacement does not improve the maths enough to justify an engine change.";
  } else if (replacePct <= 0.68 + ageAdjustment) {
    title = "Replace the engine";
    text = "Replacement looks commercially stronger than major repair on the numbers provided, especially given this diagnosis risk profile.";
  }

  return {
    title,
    text,
    repairPct: Math.round(repairPct * 100),
    replacePct: Math.round(replacePct * 100),
  };
}

function PanelHeader({ title, isDark }) {
  return (
    <div className={`px-4 py-3 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-white ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
      {title}
    </div>
  );
}

function panelShell(isDark) {
  return `overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] ${
    isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
  }`;
}

function TrustStrip({ items, isDark }) {
  return (
    <ul
      className={`mt-5 grid grid-cols-2 overflow-hidden rounded-md border md:grid-cols-4 ${
        isDark
          ? "border-white/12 bg-[rgba(16,28,24,0.92)]"
          : "border-transparent bg-[var(--color-primary)]"
      }`}
    >
      {items.map((item) => (
        <li
          key={item.label}
          className={`flex items-center gap-2.5 border-b px-3 py-3.5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${
            isDark ? "border-white/12" : "border-white/18"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center">
            <HomeIcon name={item.icon} size={36} tone="silver" className="h-8 w-8" />
          </span>
          <span className="min-w-0 text-[0.72rem] leading-[1.3] font-semibold text-white md:text-[0.78rem]">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function HowItWorks({ data, isDark, onStart }) {
  return (
    <section className={panelShell(isDark)}>
      <PanelHeader title={data.title || "How It Works"} isDark={isDark} />
      <div className="p-4">
        <ol className="grid gap-4">
          {(data.steps || []).map((step, index) => (
            <li key={step.title} className="flex items-start gap-3">
              <span
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                  isDark ? "border-white/14 bg-[rgba(20,39,33,0.9)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
                }`}
              >
                <HomeIcon name={step.icon} size={40} className="h-8 w-8" />
                <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[0.62rem] font-bold text-white">
                  {step.step || index + 1}
                </span>
              </span>
              <div className="min-w-0 pt-0.5">
                <p className={`text-[0.92rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {step.title}
                </p>
                <p className={`mt-1 text-[0.78rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onStart}
          className="btn-cta mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold tracking-[0.04em] text-white"
        >
          <span>{data.ctaLabel || "START DIAGNOSIS"}</span>
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function WhyTrust({ data, isDark }) {
  return (
    <section className={panelShell(isDark)}>
      <PanelHeader title={data.title || "Why Trust This Diagnosis?"} isDark={isDark} />
      <ul className="grid gap-4 p-4">
        {(data.signals || []).map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border ${
                isDark ? "border-[rgba(180,134,63,0.4)] bg-[rgba(20,39,33,0.9)]" : "border-[rgba(180,134,63,0.35)] bg-[var(--color-page-soft)]"
              }`}
            >
              <HomeIcon name={item.icon} size={36} className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className={`text-[0.8rem] font-bold uppercase leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {item.title}
              </p>
              <p className={`mt-1 text-[0.76rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CostTable({ data, isDark }) {
  const [openRow, setOpenRow] = useState(data.rows?.[0]?.failure || "");
  const columns = data.columns || [];
  const rows = data.rows || [];
  const legend = data.legend || [];

  return (
    <section className={panelShell(isDark)}>
      <PanelHeader title={data.title} isDark={isDark} />

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className={`text-[0.68rem] font-bold uppercase ${isDark ? "bg-[var(--color-surface)] text-white/80" : "bg-[var(--color-page-soft)] text-[var(--color-text)]"}`}>
              {columns.map((column) => (
                <th key={column} className={`border-b px-3 py-3 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.failure} className={isDark ? "text-white" : "text-[var(--color-text)]"}>
                {costKeys.map((key) => (
                  <td key={key} className={`border-b px-3 py-3 text-[0.8rem] ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {rows.map((row) => {
          const open = openRow === row.failure;
          return (
            <div key={row.failure} className={`border-b last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
              <button type="button" onClick={() => setOpenRow(open ? "" : row.failure)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
                <span className={`text-[0.88rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.failure}</span>
                <ChevronIcon open={open} />
              </button>
              {open ? (
                <ul className="grid gap-2 px-4 pb-4">
                  {legend.map((item) => (
                    <li key={item.key} className={`flex items-center justify-between gap-3 text-[0.78rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${legendTone[item.tone] || legendTone.green}`} />
                        <span className={isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}>{item.label}</span>
                      </span>
                      <strong>{row[item.key]}</strong>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
        {legend.length ? (
          <div className={`flex flex-wrap gap-x-4 gap-y-2 border-t px-4 py-3 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
            {legend.map((item) => (
              <span key={item.key} className={`inline-flex items-center gap-1.5 text-[0.68rem] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
                <span className={`h-2 w-2 rounded-full ${legendTone[item.tone] || legendTone.green}`} />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StepIndicator({ labels, stage, isDark }) {
  return (
    <div className="flex items-center gap-2">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === stage;
        const done = stepNumber < stage;

        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.72rem] font-bold ${
                done || active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : isDark
                    ? "border-[var(--color-border)] text-white/60"
                    : "border-[var(--color-border)] text-[var(--color-text-soft)]"
              }`}
            >
              {done ? "✓" : stepNumber}
            </span>
            <span className={`truncate text-[0.68rem] font-semibold uppercase tracking-[0.06em] ${done || active ? "text-[var(--color-primary)]" : isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
              {label}
            </span>
            {index < labels.length - 1 ? (
              <span className={`h-px flex-1 ${done ? "bg-[var(--color-primary)]" : isDark ? "bg-[var(--color-border)]" : "bg-[var(--color-border)]"}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function CalculatorFlow({
  calculator,
  isDark,
  onExit,
  stage,
  setStage,
  selectedId,
  setSelectedId,
  selectedAgeId,
  setSelectedAgeId,
  carValue,
  setCarValue,
}) {
  const steps = calculator.steps || [];
  const stepCopy = steps[stage - 1] || steps[0] || {};
  const symptoms = calculator.symptoms || [];
  const ageOptions = calculator.ageOptions || [];
  const valueSteps = calculator.valueSteps || [8000, 12000, 18000];
  const diagnoses = calculator.diagnoses || {};
  const diagnosis = diagnoses[selectedId] || null;
  const selectedSymptom = symptoms.find((item) => item.id === selectedId);
  const verdict = diagnosis ? getVerdict(diagnosis, carValue, selectedAgeId) : null;
  const severity = diagnosis ? severityMeta[diagnosis.severity] || severityMeta.monitor : null;
  const valueIndex = Math.max(0, valueSteps.indexOf(carValue));

  return (
    <section id="diagnostic-calculator" className={panelShell(isDark)}>
      <PanelHeader title={stepCopy.label || `STEP ${stage} OF 3`} isDark={isDark} />
      <div className="p-4 md:p-5">
        <StepIndicator labels={calculator.stepLabels || ["Symptoms", "Vehicle", "Diagnosis"]} stage={stage} isDark={isDark} />

        <h3 className={`mt-4 text-[1.15rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {stepCopy.title}
        </h3>
        <p className={`mt-2 text-[0.8rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
          {stepCopy.instruction}
        </p>

        {stage === 1 ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
              {symptoms.map((symptom) => {
                const selected = selectedId === symptom.id;
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => setSelectedId(symptom.id)}
                    className={`flex min-h-16 items-center gap-2.5 rounded-md border px-3 py-3 text-left transition ${
                      selected
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                        : isDark
                          ? "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]"
                          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                      <HomeIcon name={symptom.icon} size={32} className="h-7 w-7" />
                    </span>
                    <span className={`text-[0.78rem] font-semibold leading-tight ${isDark && !selected ? "text-white" : "text-[var(--color-text)]"}`}>
                      {symptom.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={onExit} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                Back to overview
              </button>
              <button
                type="button"
                disabled={!selectedId}
                onClick={() => setStage(2)}
                className="btn-cta flex min-h-12 flex-1 items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{stepCopy.cta || "CONTINUE TO STEP 2"}</span>
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : null}

        {stage === 2 ? (
          <>
            <p className={`mt-4 text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[var(--color-text-soft)]"}`}>
              Vehicle age
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ageOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAgeId(item.id)}
                  className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold ${
                    selectedAgeId === item.id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : isDark
                        ? "border-[var(--color-border)] bg-[var(--color-surface)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-text)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className={`mt-6 text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[var(--color-text-soft)]"}`}>
              Estimated current value
            </p>
            <div className={`mt-3 rounded-xl border px-5 py-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"}`}>
              <strong className={`block text-[2rem] leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {fmtCurrency(carValue)}
              </strong>
              <span className={`mt-1 block text-[0.76rem] ${isDark ? "text-white/64" : "text-[var(--color-text-muted)]"}`}>
                What would the car roughly sell for in its current condition?
              </span>
              <input
                type="range"
                min={0}
                max={valueSteps.length - 1}
                step={1}
                value={valueIndex}
                onChange={(event) => setCarValue(valueSteps[Number(event.target.value)])}
                className="mt-4 w-full accent-[var(--color-primary)]"
              />
              <div className={`mt-3 flex justify-between gap-2 text-[0.66rem] ${isDark ? "text-white/56" : "text-[var(--color-text-soft)]"}`}>
                {valueSteps.map((step) => (
                  <span key={step}>{formatStepValue(step)}</span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setStage(1)} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                Back to symptoms
              </button>
              <button
                type="button"
                disabled={!selectedAgeId}
                onClick={() => setStage(3)}
                className="btn-cta flex min-h-12 flex-1 items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{stepCopy.cta || "CONTINUE TO STEP 3"}</span>
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : null}

        {stage === 3 && diagnosis && verdict ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] ${isDark ? severity.darkClassName : severity.className}`}>
                {severity.label}
              </span>
              <span className="text-[0.78rem] font-semibold text-[var(--color-accent-green)]">{diagnosis.likelihood}</span>
            </div>
            <h4 className={`mt-3 text-[1.25rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {diagnosis.fault}
            </h4>
            <p className={`mt-2 text-[0.8rem] leading-[1.45] ${isDark ? "text-white/74" : "text-[var(--color-text-muted)]"}`}>
              {diagnosis.summary}
            </p>
            <p className={`mt-2 text-[0.76rem] ${isDark ? "text-white/62" : "text-[var(--color-text-soft)]"}`}>
              Matched from <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{selectedSymptom?.label}</strong> · Common on {diagnosis.commonOn}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className={`rounded-md border p-3 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"}`}>
                <p className={`text-[0.68rem] font-bold uppercase ${isDark ? "text-white/60" : "text-[var(--color-text-soft)]"}`}>Repair</p>
                <p className={`mt-1 text-[0.95rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {fmtCurrency(diagnosis.repairLow)} – {fmtCurrency(diagnosis.repairHigh)}
                </p>
                <p className={`text-[0.72rem] ${isDark ? "text-white/60" : "text-[var(--color-text-soft)]"}`}>{verdict.repairPct}% of car value</p>
              </div>
              <div className="rounded-md border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-3">
                <p className="text-[0.68rem] font-bold uppercase text-[var(--color-primary)]">Replace</p>
                <p className="mt-1 text-[0.95rem] font-bold text-[var(--color-text)]">
                  {fmtCurrency(diagnosis.replaceLow)} – {fmtCurrency(diagnosis.replaceHigh)}
                </p>
                <p className="text-[0.72rem] text-[var(--color-text-muted)]">{verdict.replacePct}% of car value</p>
              </div>
            </div>

            <div className={`mt-4 rounded-md border p-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-white"}`}>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Verdict</p>
              <p className={`mt-1 text-[1.05rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{verdict.title}</p>
              <p className={`mt-1 text-[0.78rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>{verdict.text}</p>
            </div>

            <div className={`mt-4 overflow-hidden rounded-md border ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
              {(diagnosis.oemParts || []).map((part) => (
                <div key={part.part} className={`flex justify-between gap-3 border-b px-3 py-2.5 text-[0.78rem] last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  <span className={isDark ? "text-white/70" : "text-[var(--color-text-soft)]"}>{part.label}</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{part.part}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link href="/quote?from=calculator" className="btn-cta flex min-h-12 items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold text-white">
                <span>Get a specialist quote</span>
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <button type="button" onClick={onExit} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                Back to overview
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default function HomeSec3({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const calculator = data.calculator || {};
  const valueSteps = calculator.valueSteps || [4000, 8000, 12000, 18000, 25000, 35000];
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [selectedAgeId, setSelectedAgeId] = useState("");
  const [carValue, setCarValue] = useState(valueSteps[2] ?? valueSteps[0] ?? 12000);
  const heroImage = data.headerImage || {
    src: "/sec2-bg.webp",
    alt: "Land Rover diagnostic calculator",
  };

  function resetFlow() {
    setStage(1);
    setSelectedId("");
    setSelectedAgeId("");
    setCarValue(valueSteps[2] ?? valueSteps[0] ?? 12000);
  }

  function startDiagnosis() {
    resetFlow();
    setStarted(true);
    window.setTimeout(() => {
      document.getElementById("diagnostic-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function exitDiagnosis() {
    resetFlow();
    setStarted(false);
  }

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${sectionBgClass(band)}`} style={{ "--section-fade": rgb }}>
      <div className="absolute inset-x-0 top-0 h-[280px] md:h-[340px]">
        <Image src={heroImage.src} alt={heroImage.alt || ""} fill className="object-cover object-[78%_center] md:object-center" sizes="100vw" />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.78)_0%,rgba(var(--section-fade),0.62)_45%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.96)_0%,rgba(var(--section-fade),0.72)_40%,rgba(var(--section-fade),0.18)_78%)]"
              : "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.72)_0%,rgba(var(--section-fade),0.48)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_42%,rgba(var(--section-fade),0.12)_80%)]"
          }
        />
        {/* Mobile smoke behind header copy */}
        <div
          className={`pointer-events-none absolute inset-0 md:hidden ${
            isDark
              ? "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(var(--section-fade),0.95)_0%,rgba(var(--section-fade),0.7)_42%,transparent_72%)]"
              : "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_42%,transparent_72%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="relative max-w-[760px] text-left">
          <div
            className={`pointer-events-none absolute -inset-x-2 -top-3 bottom-0 rounded-lg md:hidden ${
              isDark
                ? "bg-[linear-gradient(90deg,rgba(var(--section-fade),0.88)_0%,rgba(var(--section-fade),0.55)_70%,transparent_100%)]"
                : "bg-[linear-gradient(90deg,rgba(var(--section-fade),0.92)_0%,rgba(var(--section-fade),0.62)_70%,transparent_100%)]"
            }`}
          />
          <div className="relative z-10">
            <HeadingEyebrow text={data.eyebrow || "DIAGNOSTIC CALCULATOR"} />
            <h2
              className={`mt-3 text-[2.1rem] font-medium leading-[1.05] tracking-normal md:text-[3.2rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Diagnose Your Land Rover or Range Rover <span className="text-[var(--color-primary)]">Problem</span>
            </h2>
            <p
              className={`mt-4 max-w-[680px] text-[0.9rem] leading-[1.48] md:text-[1.05rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>

        <TrustStrip items={data.trustStrip || []} isDark={isDark} />

        {!started ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)_minmax(0,0.95fr)] lg:items-start">
            <HowItWorks data={data.howItWorks || {}} isDark={isDark} onStart={startDiagnosis} />
            <CostTable data={data.costTable || {}} isDark={isDark} />
            <WhyTrust data={data.whyTrust || {}} isDark={isDark} />
          </div>
        ) : (
          <div className="mt-6">
            <CalculatorFlow
              calculator={calculator}
              isDark={isDark}
              onExit={exitDiagnosis}
              stage={stage}
              setStage={setStage}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              selectedAgeId={selectedAgeId}
              setSelectedAgeId={setSelectedAgeId}
              carValue={carValue}
              setCarValue={setCarValue}
            />
          </div>
        )}
      </div>
    </section>
  );
}
