"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { CONTAINER, H2, H5, H6, BODY, BODY_SM, SMALL, LABEL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens. The severity pills keep
// their own red / amber / orange / green scale - soft tinted pills by day, deep tinted pills with a
// coloured ring and light text at night - so each level stays recognisable in both themes.
const SEVERITY = {
  catastrophic: { label: "Catastrophic", pill: "bg-[#fde9e7] text-[#c0281c] dark:bg-[#3b1210]/80 dark:text-[#ff9b90] dark:ring-[#8a2420]", dot: "bg-[#d9302c] dark:bg-[#ff6b5e]" },
  monitor: { label: "Monitor", pill: "bg-[#fdf3df] text-[#a86d0e] dark:bg-[#3a2b0c]/80 dark:text-[#f3c766] dark:ring-[#8a6416]", dot: "bg-[#d99a1c]" },
  immediate: { label: "Immediate", pill: "bg-[#fdebe0] text-[#c4501a] dark:bg-[#3b1a0c]/80 dark:text-[#ffab7a] dark:ring-[#8f3f18]", dot: "bg-[#e2662a]" },
  low: { label: "Low", pill: "bg-[#e5f1e9] text-[#1f6b45] dark:bg-[#0f2a1e]/80 dark:text-[#8fd3ab] dark:ring-[#2f6b4c]", dot: "bg-[#1f6b45] dark:bg-[#4fae7e]" },
};

const pad = (n) => String(n).padStart(2, "0");

function Pill({ severity, size = "md" }) {
  const s = SEVERITY[severity];
  const sz = size === "sm" ? "gap-1.5 px-2 py-[3px]" : "gap-2 px-3 py-1.5";
  return (
    <span className={`${SMALL} inline-flex shrink-0 items-center whitespace-nowrap rounded-md font-medium uppercase tracking-[0.03em] ring-inset ring-transparent dark:ring-1 ${sz} ${s.pill}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* phones / tablets: category tabs + featured card + accordion rows    */
/* ------------------------------------------------------------------ */

function Featured({ cat, item, n, onClose }) {
  const stats = [
    { icon: "engine", label: cat.codeLabel, value: item.code },
    { icon: "alert", label: "Common Symptom", value: item.symptom, tone: "text-lr-gold" },
    { icon: "pound", label: "Repair Cost", value: item.cost },
  ];
  return (
    <div className="overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_20%_32%,var(--lr-chip)_0%,transparent_42%),linear-gradient(135deg,var(--lr-card)_0%,var(--lr-card)_55%,var(--lr-panel)_100%)] text-lr-head shadow-[0_18px_36px_-18px_var(--lr-shadow)] ring-1 ring-lr-line-strong">
      <div className="grid grid-cols-[42%_1fr] sm:grid-cols-[40%_1fr]">
        {/* part photo, spot-lit by the card's own radial glow (no separate box) */}
        <div className="relative min-h-[170px]">
          <Image src={item.image} alt={item.title} fill className="object-contain p-2 drop-shadow-[0_14px_16px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_14px_16px_rgba(0,0,0,0.6)]" sizes="(min-width: 640px) 40vw, 42vw" />
        </div>
        <div className="relative px-3.5 pb-3.5 pt-3.5 sm:px-6 sm:pt-5">
          <div className="flex items-center gap-2.5">
            <span className={`${SMALL} rounded-md border border-lr-line-strong px-2 py-0.5 text-lr-green`}>{pad(n)}</span>
            <span className={`${LABEL} text-lr-muted`}>{cat.itemLabel}</span>
          </div>
          <h3 className={`${H5} mt-2 text-lr-head`}>{item.title}</h3>
          <p className={`${BODY_SM} mt-1.5 text-lr-body`}>{item.text}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <Pill severity={item.severity} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Collapse"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-lr-green/50 text-lr-head transition-colors hover:bg-lr-panel sm:h-11 sm:w-11"
            >
              <GuideIcon name="chevron-up" className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-3.5 grid grid-cols-3 border-t border-lr-line py-3 sm:mx-6 sm:py-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`flex min-w-0 flex-col gap-1 px-2 sm:flex-row sm:items-center sm:gap-3 sm:px-4 ${i > 0 ? "border-l border-lr-line" : "pl-0 sm:pl-0"}`}>
            <span className={s.tone ?? "text-lr-green"}>
              <GuideIcon name={s.icon} className="h-6 w-6 sm:h-8 sm:w-8" />
            </span>
            <span className="min-w-0">
              <span className={`${SMALL} block text-lr-muted`}>{s.label}</span>
              <span className={`${BODY_SM} block font-medium leading-snug text-lr-head`}>{s.value}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-end px-3.5 pb-3 sm:px-6 sm:pb-4">
        <Link href={item.href} className={`${SMALL} inline-flex items-center gap-1.5 font-medium text-lr-green hover:text-lr-head`}>
          Read the full breakdown <Arrow className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Row({ item, n, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-2.5 rounded-xl border border-lr-line bg-lr-card px-2.5 py-2 text-left shadow-[0_4px_14px_-10px_var(--lr-shadow)] transition-colors hover:bg-lr-panel sm:gap-4 sm:px-4"
    >
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md bg-lr-chip text-[14px] text-lr-ink sm:h-10 sm:w-10 sm:text-[16px]">{pad(n)}</span>
      <span className="relative h-[52px] w-[64px] shrink-0 sm:h-[60px] sm:w-[80px]">
        <Image src={item.image} alt="" fill className="object-contain" sizes="80px" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`${H6} block text-lr-head`}>{item.title}</span>
        <span className="mt-1 block sm:hidden">
          <Pill severity={item.severity} size="sm" />
        </span>
      </span>
      <span className="hidden sm:block">
        <Pill severity={item.severity} />
      </span>
      <span className="shrink-0 text-lr-head">
        <GuideIcon name="chevron-down" className="h-5 w-5" />
      </span>
    </button>
  );
}

function MobileDatabase({ categories }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(0);
  const cat = categories[active];

  return (
    <div className="lg:hidden">
      {/* category tabs */}
      <div role="tablist" className="mt-5 grid grid-cols-4 gap-1.5 sm:gap-3">
        {categories.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.key}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => {
                setActive(i);
                setOpen(0);
              }}
              className={`relative flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 text-center transition-colors min-[480px]:flex-row min-[480px]:gap-2.5 min-[480px]:px-3 min-[480px]:text-left ${
                on ? "border-lr-brand bg-lr-brand text-lr-on-brand shadow-[0_8px_18px_-10px_var(--lr-shadow)]" : "border-lr-line bg-lr-card text-lr-head hover:bg-lr-panel"
              }`}
            >
              <GuideIcon name={c.icon} className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" />
              <span className="leading-tight">
                <span className={`${SMALL} block font-semibold`}>{c.name}</span>
                <span className={`${SMALL} block ${on ? "text-lr-on-brand/80" : "text-lr-muted"}`}>Failures ({c.items.length})</span>
              </span>
              {on ? <span className="absolute -bottom-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-lr-brand" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-5 flex flex-col gap-2.5">
        {cat.items.map((item, i) =>
          i === open ? (
            <Featured key={item.title} cat={cat} item={item} n={i + 1} onClose={() => setOpen(-1)} />
          ) : (
            <Row key={item.title} item={item} n={i + 1} onOpen={() => setOpen(i)} />
          ),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* desktop: every category as a card grid                             */
/* ------------------------------------------------------------------ */

function DesktopCard({ item, n, wide }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-col rounded-md border border-lr-line bg-lr-card p-4 font-normal shadow-[0_6px_18px_-14px_var(--lr-shadow)] transition-shadow hover:shadow-[0_10px_24px_-12px_var(--lr-shadow)]"
    >
      {/* desktop rows (xl, three or four cards) are too narrow for photo + text side by side, so the photo sits above the text */}
      <div className="flex flex-1 gap-4 xl:flex-col xl:gap-3">
        <span className={`relative shrink-0 ${wide ? "h-[96px] w-[130px]" : "h-[88px] w-[92px] xl:h-[92px] xl:w-[120px]"}`}>
          <Image src={item.image} alt="" fill className="object-contain" sizes="130px" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-2.5">
            <span className={`${SMALL} mt-0.5 rounded bg-lr-chip px-1.5 py-0.5 text-lr-ink`}>{pad(n)}</span>
            <span className={`${H6} text-lr-head`}>{item.title}</span>
          </span>
          <span className={`${BODY_SM} mt-2 block text-lr-body`}>{item.text}</span>
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Pill severity={item.severity} size="sm" />
        <span className={`${SMALL} inline-flex items-center gap-1.5 font-medium text-lr-ink group-hover:underline`}>
          Read more <Arrow className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function DesktopDatabase({ categories }) {
  return (
    <div className="mt-8 hidden flex-col gap-5 lg:flex">
      {categories.map((c) => (
        <div key={c.key}>
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-lr-brand text-lr-on-brand">
              <GuideIcon name={c.icon} className="h-6 w-6" />
            </span>
            <h3 className={`${H6} uppercase tracking-[0.02em] text-lr-ink`}>{c.title}</h3>
            <span className="h-px flex-1 bg-lr-line-strong" />
          </div>
          <div className={`mt-3 grid gap-3 lg:grid-cols-2 ${c.items.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
            {c.items.map((item, i) => (
              <DesktopCard key={item.title} item={item} n={i + 1} wide={c.items.length !== 4} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeFailures({ data }) {
  const [l1, l2] = data.h2.split("|");

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      <div className={`${CONTAINER} pb-10 pt-9 lg:pb-14 lg:pt-12`}>
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-lr-gold-line sm:w-16" />
          <p className={`${LABEL} text-lr-ink`}>{data.eyebrow}</p>
          <span className="h-px w-12 bg-lr-gold-line sm:w-16" />
        </div>

        <h2 className={`${H2} mt-2.5 text-balance text-center`}>
          <span>{l1}</span> <br className="xl:hidden" />
          <span className="whitespace-nowrap text-lr-green">{l2}</span>
        </h2>
        <p className={`${BODY} mx-auto mt-3 max-w-[760px] text-center text-lr-body`}>{data.subhead}</p>

        <MobileDatabase categories={data.categories} />
        <DesktopDatabase categories={data.categories} />

        {/* data note */}
        <div className="relative mt-4 overflow-hidden rounded-xl border border-lr-line bg-lr-panel lg:mt-5 lg:rounded-md">
          <div className="relative flex flex-wrap items-center gap-3.5 px-3.5 py-4 sm:flex-nowrap sm:gap-6 sm:px-6 lg:px-7">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-lr-brand text-lr-on-brand sm:h-[60px] sm:w-[60px]">
              <GuideIcon name="shield" className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`${SMALL} font-semibold uppercase tracking-[0.02em] text-lr-ink lg:inline`}>{data.note.title}: </p>
              <p className={`${BODY_SM} mt-0.5 text-lr-body lg:inline`}>{data.note.text}</p>
            </div>
            {/* car line drawing: its own row under the text on phones, beside it (with a divider) from sm up */}
            <span className="flex w-full justify-end border-t border-lr-line pt-3 text-lr-muted sm:w-auto sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <GuideIcon name="suv-outline" className="h-[74px] w-[202px] sm:h-[70px] sm:w-[190px] lg:h-[80px] lg:w-[218px]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
