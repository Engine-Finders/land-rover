"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
  users: <path d="M16 21v-2a4 4 0 0 0-8 0v2m12 0v-2.5a3.5 3.5 0 0 0-3-3.45M4 21v-2.5a3.5 3.5 0 0 1 3-3.45M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a3 3 0 1 0 0-6M6 10a3 3 0 1 1 0-6" />,
  clipboard: <path d="M9 4h6l1 2h3v15H5V6h3l1-2Zm1 7h4m-4 4h6m-6 4h5" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  drop: <path d="M12 3s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12Z" />,
  thermometer: <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0ZM5 14h3m-3-4h3" />,
  disc: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />,
  smoke: <path d="M7 17c0-2 1.2-3.1 2.6-4.2C11 11.6 12 10.7 12 9.2A2.9 2.9 0 0 0 9.1 6c-1.2 0-2.2.6-3 1.8M14 18c0-1.5.8-2.4 2-3.4 1.2-.9 2-1.8 2-3.2A2.4 2.4 0 0 0 15.6 9c-.8 0-1.5.3-2.1 1" />,
  bolt: <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />,
  question: <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7M12 17h.01" />,
  warning: <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
};

const emojiIconMap = {
  "📊": "chart",
  "🔧": "wrench",
  "📖": "book",
  "🏆": "trophy",
  "🛡️": "shield",
  "⚙️": "gear",
  "👥": "users",
  "🛢️": "drop",
  "🌡️": "thermometer",
  "⏱️": "disc",
  "💨": "smoke",
  "🔋": "bolt",
  "🚙": "car",
  "🔊": "warning",
  "❓": "question",
};

const stepIcons = ["clipboard", "car", "shield"];
const whyTrustIcons = ["shield", "gear", "users", "trophy"];
const costKeys = ["failure", "reconditioned", "rebuilt", "used", "dealer"];
const costDotColors = ["#2aa3a0", "#3b82f6", "#c59d5f", "#e24b4b"];

const severityMeta = {
  catastrophic: { label: "Catastrophic", className: "border-[#f7c8cc] bg-[#fff0f1] text-[#c42430]", darkClassName: "border-[rgba(255,90,100,0.34)] bg-[rgba(255,45,53,0.14)] text-[#ff9aa0]" },
  immediate: { label: "Immediate", className: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]", darkClassName: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]" },
  monitor: { label: "Monitor", className: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]", darkClassName: "border-[rgba(222,177,65,0.34)] bg-[rgba(222,177,65,0.13)] text-[#ffd473]" },
  low: { label: "Low Risk", className: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]", darkClassName: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]" },
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 1.8 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.question}
    </svg>
  );
}

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

function iconFrom(value, fallback) {
  if (iconPaths[value]) return value;
  return emojiIconMap[value] || fallback || "question";
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

  let decision = "exit";
  let title = "Proceed carefully or walk away";
  let text = "Projected spend is too close to the car's value. A specialist inspection should decide whether it is still worth saving.";

  if (repairPct <= 0.32 + ageAdjustment / 2 || diagnosis.severity === "low") {
    decision = "repair";
    title = "Repair it";
    text = "Repair cost is proportionate to the car's value. Replacement does not improve the maths enough to justify an engine change.";
  } else if (replacePct <= 0.68 + ageAdjustment) {
    decision = "replace";
    title = "Replace the engine";
    text = "Replacement looks commercially stronger than major repair on the numbers provided, especially given this diagnosis risk profile.";
  }

  return {
    decision,
    title,
    text,
    repairPct: Math.round(repairPct * 100),
    replacePct: Math.round(replacePct * 100),
  };
}

function TrustStrip({ items, isDark }) {
  return (
    <ul className={`mt-6 grid grid-cols-2 overflow-hidden rounded-md border shadow-[0_14px_34px_rgba(10,26,43,0.08)] md:grid-cols-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"}`}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className={`flex items-center gap-3 border-b px-3 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${isDark ? "border-[var(--color-border)]" : "border-[#d7dde6]"}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Icon name={iconFrom(item.icon, "chart")} className="h-5 w-5" />
          </span>
          <span className={`min-w-0 text-[0.78rem] leading-[1.35] font-semibold ${isDark ? "text-white" : "text-[#071827]"}`}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function PanelHeader({ title, isDark }) {
  return (
    <div className={`px-4 py-3 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-white ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
      {title}
    </div>
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
                    : "border-[#d7dde6] text-[#607085]"
              }`}
            >
              {done ? "✓" : stepNumber}
            </span>
            <span className={`truncate text-[0.68rem] font-semibold uppercase tracking-[0.06em] ${done || active ? "text-[var(--color-primary)]" : isDark ? "text-white/55" : "text-[#607085]"}`}>
              {label}
            </span>
            {index < labels.length - 1 ? <span className={`h-px flex-1 ${done ? "bg-[var(--color-primary)]" : isDark ? "bg-[var(--color-border)]" : "bg-[#d7dde6]"}`} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function HowItWorks({ data, isDark }) {
  return (
    <section className={`overflow-hidden rounded-md border shadow-[0_12px_32px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"}`}>
      <PanelHeader title="How It Works" isDark={isDark} />
      <ol className="grid gap-3 p-4">
        {(data.steps || []).map((step, index) => (
          <li key={step.step || step.title} className="flex items-start gap-3">
            <span className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
              <Icon name={iconFrom(step.icon, stepIcons[index])} className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[0.62rem] font-bold text-white">
                {step.step || index + 1}
              </span>
            </span>
            <div>
              <p className={`text-[0.92rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{step.title}</p>
              <p className={`mt-1 text-[0.78rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function WhyTrust({ data, isDark }) {
  const signals = data.signals || data.items || [];

  return (
    <section className={`overflow-hidden rounded-md border shadow-[0_12px_32px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"}`}>
      <PanelHeader title="Why Trust This Diagnosis?" isDark={isDark} />
      <ul className="grid gap-3 p-4">
        {signals.map((item, index) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-white">
              <Icon name={iconFrom(item.icon, whyTrustIcons[index])} className="h-5 w-5" />
            </span>
            <div>
              <p className={`text-[0.82rem] font-bold uppercase leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</p>
              <p className={`mt-1 text-[0.76rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{item.text}</p>
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

  return (
    <section className={`mt-5 overflow-hidden rounded-md border shadow-[0_12px_32px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"}`}>
      <PanelHeader title={data.title} isDark={isDark} />
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className={`text-[0.68rem] font-bold uppercase ${isDark ? "bg-[var(--color-surface)] text-white/80" : "bg-[#f8faf8] text-[#071827]"}`}>
              {columns.map((column) => (
                <th key={column} className={`border-b px-4 py-3 ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.failure} className={isDark ? "text-white" : "text-[#071827]"}>
                {costKeys.map((key) => (
                  <td key={key} className={`border-b px-4 py-3 text-[0.82rem] ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
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
            <div key={row.failure} className={`border-b last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
              <button type="button" onClick={() => setOpenRow(open ? "" : row.failure)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left">
                <span className={`text-[0.88rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{row.failure}</span>
                <ChevronIcon open={open} />
              </button>
              {open ? (
                <ul className="grid gap-2 px-4 pb-4">
                  {columns.slice(1).map((column, index) => (
                    <li key={column} className={`flex items-center justify-between gap-3 text-[0.78rem] ${isDark ? "text-white" : "text-[#071827]"}`}>
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: costDotColors[index] }} />
                        <span className={isDark ? "text-white/64" : "text-[#607085]"}>{column}</span>
                      </span>
                      <strong>{row[costKeys[index + 1]]}</strong>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CalculatorFlow({ calculator, isDark, onResetRequest, stage, setStage, selectedId, setSelectedId, selectedAgeId, setSelectedAgeId, carValue, setCarValue }) {
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
    <section id="diagnostic-calculator" className={`overflow-hidden rounded-md border shadow-[0_12px_32px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"}`}>
      <PanelHeader title={stepCopy.label || `STEP ${stage} OF 3`} isDark={isDark} />
      <div className="p-4">
        <StepIndicator labels={calculator.stepLabels || ["Symptoms", "Vehicle", "Diagnosis"]} stage={stage} isDark={isDark} />

        <h3 className={`mt-4 text-[1.15rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{stepCopy.title}</h3>
        <p className={`mt-2 text-[0.8rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{stepCopy.instruction}</p>

        {stage === 1 ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
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
                          : "border-[#d7dde6] bg-white hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${selected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
                      <Icon name={iconFrom(symptom.icon, "gear")} className="h-4 w-4" />
                    </span>
                    <span className={`text-[0.78rem] font-semibold leading-tight ${selected || !isDark ? "text-[#071827]" : "text-white"}`}>{symptom.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!selectedId}
              onClick={() => setStage(2)}
              className="btn-cta mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span>{stepCopy.cta || "CONTINUE TO STEP 2"}</span>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </>
        ) : null}

        {stage === 2 ? (
          <>
            <p className={`mt-4 text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[#607085]"}`}>Vehicle age</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ageOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAgeId(item.id)}
                  className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold ${selectedAgeId === item.id ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : isDark ? "border-[var(--color-border)] bg-[var(--color-surface)] text-white" : "border-[#d7dde6] bg-white text-[#071827]"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className={`mt-6 text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[#607085]"}`}>Estimated current value</p>
            <div className={`mt-3 rounded-xl border px-5 py-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[#d7dde6] bg-[#fbfdff]"}`}>
              <strong className={`block text-[2rem] leading-none ${isDark ? "text-white" : "text-[#071827]"}`}>{fmtCurrency(carValue)}</strong>
              <span className={`mt-1 block text-[0.76rem] ${isDark ? "text-white/64" : "text-[#607085]"}`}>What would the car roughly sell for in its current condition?</span>
              <input
                type="range"
                min={0}
                max={valueSteps.length - 1}
                step={1}
                value={valueIndex}
                onChange={(event) => setCarValue(valueSteps[Number(event.target.value)])}
                className="mt-4 w-full accent-[var(--color-primary)]"
              />
              <div className={`mt-3 flex justify-between gap-2 text-[0.66rem] ${isDark ? "text-white/56" : "text-[#607085]"}`}>
                {valueSteps.map((step) => (
                  <span key={step}>{formatStepValue(step)}</span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setStage(1)} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[#607085]"}`}>
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
            <h4 className={`mt-3 text-[1.25rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.fault}</h4>
            <p className={`mt-2 text-[0.8rem] leading-[1.45] ${isDark ? "text-white/74" : "text-[#27384a]"}`}>{diagnosis.summary}</p>
            <p className={`mt-2 text-[0.76rem] ${isDark ? "text-white/62" : "text-[#607085]"}`}>
              Matched from <strong className={isDark ? "text-white" : "text-[#071827]"}>{selectedSymptom?.label}</strong> · Common on {diagnosis.commonOn}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className={`rounded-md border p-3 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[#d7dde6] bg-[#fbfdff]"}`}>
                <p className={`text-[0.68rem] font-bold uppercase ${isDark ? "text-white/60" : "text-[#607085]"}`}>Repair</p>
                <p className={`mt-1 text-[0.95rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{fmtCurrency(diagnosis.repairLow)} – {fmtCurrency(diagnosis.repairHigh)}</p>
                <p className={`text-[0.72rem] ${isDark ? "text-white/60" : "text-[#607085]"}`}>{verdict.repairPct}% of car value</p>
              </div>
              <div className="rounded-md border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-3">
                <p className="text-[0.68rem] font-bold uppercase text-[var(--color-primary)]">Replace</p>
                <p className="mt-1 text-[0.95rem] font-bold text-[#071827]">{fmtCurrency(diagnosis.replaceLow)} – {fmtCurrency(diagnosis.replaceHigh)}</p>
                <p className="text-[0.72rem] text-[#27384a]">{verdict.replacePct}% of car value</p>
              </div>
            </div>

            <div className={`mt-4 rounded-md border p-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[#d7dde6] bg-white"}`}>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Verdict</p>
              <p className={`mt-1 text-[1.05rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{verdict.title}</p>
              <p className={`mt-1 text-[0.78rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{verdict.text}</p>
            </div>

            <div className={`mt-4 overflow-hidden rounded-md border ${isDark ? "border-[var(--color-border)]" : "border-[#d7dde6]"}`}>
              {(diagnosis.oemParts || []).map((part) => (
                <div key={part.part} className={`flex justify-between gap-3 border-b px-3 py-2.5 text-[0.78rem] last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
                  <span className={isDark ? "text-white/70" : "text-[#607085]"}>{part.label}</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-[#071827]"}`}>{part.part}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link href="/quote?from=calculator" className="btn-cta flex min-h-12 items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold text-white">
                <span>Get a specialist quote</span>
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <button type="button" onClick={onResetRequest} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[#607085]"}`}>
                Start again
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default function HomeSec3({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const calculator = data.calculator || {};
  const valueSteps = calculator.valueSteps || [4000, 8000, 12000, 18000, 25000, 35000];
  const [stage, setStage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [selectedAgeId, setSelectedAgeId] = useState("");
  const [carValue, setCarValue] = useState(valueSteps[2] ?? valueSteps[0] ?? 12000);
  const heroImage = data.headerImage || {
    src: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=900&q=80",
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
    document.getElementById("diagnostic-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#0d1c18]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[320px] md:block">
        <Image src={heroImage.src} alt={heroImage.alt} fill className="object-cover object-center" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(13,28,24,0.95)_0%,rgba(13,28,24,0.72)_36%,rgba(13,28,24,0.2)_78%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_42%,rgba(255,255,255,0.12)_80%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#0d1c18_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[780px]">
          <h2 className={`text-[2.35rem] font-bold leading-[0.98] tracking-normal md:text-[3.45rem] ${isDark ? "text-white" : "text-[#071827]"}`}>
            Diagnose Your Land Rover or Range Rover <span className="text-[var(--color-primary)]">Problem</span>
          </h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[700px] text-[0.92rem] leading-[1.48] md:text-[1.04rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        </div>

        <TrustStrip items={data.trustStrip || []} isDark={isDark} />

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)_minmax(0,0.95fr)] lg:items-start">
          <HowItWorks data={data.howItWorks || {}} isDark={isDark} />
          <CalculatorFlow
            calculator={calculator}
            isDark={isDark}
            onResetRequest={resetFlow}
            stage={stage}
            setStage={setStage}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedAgeId={selectedAgeId}
            setSelectedAgeId={setSelectedAgeId}
            carValue={carValue}
            setCarValue={setCarValue}
          />
          <WhyTrust data={data.whyTrust || {}} isDark={isDark} />
        </div>

        {stage === 3 && data.costTable ? <CostTable data={data.costTable} isDark={isDark} /> : null}

        {data.bottomCta ? (
          <div className={`mt-5 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center md:justify-between ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"}`}>
            <div>
              <p className={`text-[1.05rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{data.bottomCta.title}</p>
              <p className={`mt-1 text-[0.82rem] leading-[1.4] ${isDark ? "text-white/74" : "text-[#27384a]"}`}>{data.bottomCta.text}</p>
              {data.bottomCta.trustLine ? (
                <p className="mt-2 text-[0.72rem] font-semibold text-[var(--color-accent)]">{data.bottomCta.trustLine}</p>
              ) : null}
            </div>
            <button type="button" onClick={startDiagnosis} className="btn-cta inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-5 py-3 text-[0.82rem] font-bold text-white">
              <span>{data.bottomCta.buttonLabel}</span>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
