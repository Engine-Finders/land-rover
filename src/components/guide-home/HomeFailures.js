"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

const SEVERITY = {
  catastrophic: { label: "Catastrophic", light: "bg-[#fde9e7] text-[#c0281c]", dot: "bg-[#d9302c]", dark: "border-[#8a2420] bg-[#3b1210]/80 text-white" },
  monitor: { label: "Monitor", light: "bg-[#fdf3df] text-[#a86d0e]", dot: "bg-[#d99a1c]", dark: "border-[#8a6416] bg-[#3a2b0c]/80 text-white" },
  immediate: { label: "Immediate", light: "bg-[#fdebe0] text-[#c4501a]", dot: "bg-[#e2662a]", dark: "border-[#8f3f18] bg-[#3b1a0c]/80 text-white" },
  low: { label: "Low", light: "bg-[#e5f1e9] text-[#1f6b45]", dot: "bg-[#1f6b45]", dark: "border-[#2f6b4c] bg-[#0f2a1e]/80 text-white" },
};

const pad = (n) => String(n).padStart(2, "0");

function Pill({ severity, dark = false, size = "md" }) {
  const s = SEVERITY[severity];
  const sz = size === "sm" ? "gap-1.5 px-2 py-[3px] text-[10.5px]" : "gap-2 px-3 py-1.5 text-[12.5px]";
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-md font-medium uppercase tracking-[0.03em] ${sz} ${dark ? `border ${s.dark}` : s.light}`}>
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
    { icon: "alert", label: "Common Symptom", value: item.symptom, tone: "text-[#d4a54c]" },
    { icon: "pound", label: "Repair Cost", value: item.cost },
  ];
  return (
    <div className="overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_20%_32%,#33463d_0%,rgba(20,48,36,0)_42%),linear-gradient(135deg,#163b2b_0%,#0f2c20_55%,#0a1f17_100%)] text-white shadow-[0_18px_36px_-18px_rgba(0,0,0,0.7)] ring-1 ring-[#2f6b4c]/50">
      <div className="grid grid-cols-[42%_1fr] sm:grid-cols-[40%_1fr]">
        {/* part photo, spot-lit by the card's own radial glow (no separate box) */}
        <div className="relative min-h-[170px]">
          <Image src={item.image} alt={item.title} fill className="object-contain p-2 drop-shadow-[0_14px_16px_rgba(0,0,0,0.6)]" sizes="(min-width: 640px) 40vw, 42vw" />
        </div>
        <div className="relative px-3.5 pb-3.5 pt-3.5 sm:px-6 sm:pt-5">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md border border-[#2f6b4c] px-2 py-0.5 text-[13px] text-[#9fd8b7]">{pad(n)}</span>
            <span className="text-[11.5px] uppercase tracking-[0.06em] text-white/85 sm:text-[13px]">{cat.itemLabel}</span>
          </div>
          <h3 className={`${serif.className} mt-2 text-[21px] leading-[1.12] sm:text-[28px]`}>{item.title}</h3>
          <p className="mt-1.5 text-[12.5px] leading-[1.5] text-white/85 sm:text-[15px]">{item.text}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <Pill severity={item.severity} dark />
            <button
              type="button"
              onClick={onClose}
              aria-label="Collapse"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4fae7e]/60 text-white transition-colors hover:bg-white/10 sm:h-11 sm:w-11"
            >
              <GuideIcon name="chevron-up" className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-3.5 grid grid-cols-3 border-t border-white/12 py-3 sm:mx-6 sm:py-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`flex min-w-0 flex-col gap-1 px-2 sm:flex-row sm:items-center sm:gap-3 sm:px-4 ${i > 0 ? "border-l border-white/12" : "pl-0 sm:pl-0"}`}>
            <span className={s.tone ?? "text-white"}>
              <GuideIcon name={s.icon} className="h-6 w-6 sm:h-8 sm:w-8" />
            </span>
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-[10.5px] text-white/70 sm:text-[13px]">{s.label}</span>
              <span className="block text-[13px] font-medium leading-snug sm:text-[16px]">{s.value}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-end px-3.5 pb-3 sm:px-6 sm:pb-4">
        <Link href={item.href} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#9fd8b7] hover:text-white">
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
      className="flex w-full items-center gap-2.5 rounded-xl border border-black/[0.07] bg-white px-2.5 py-2 text-left shadow-[0_4px_14px_-10px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#fbfbfa] sm:gap-4 sm:px-4"
    >
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md bg-[#eef1ee] text-[14px] text-[#1f3a2c] sm:h-10 sm:w-10 sm:text-[16px]">{pad(n)}</span>
      <span className="relative h-[52px] w-[64px] shrink-0 sm:h-[60px] sm:w-[80px]">
        <Image src={item.image} alt="" fill className="object-contain" sizes="80px" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium leading-snug text-[#141414] sm:text-[16px]">{item.title}</span>
        <span className="mt-1 block sm:hidden">
          <Pill severity={item.severity} size="sm" />
        </span>
      </span>
      <span className="hidden sm:block">
        <Pill severity={item.severity} />
      </span>
      <span className="shrink-0 text-[#1f1f1f]">
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
                on ? "border-[#0e2b20] bg-[#0e2b20] text-white shadow-[0_8px_18px_-10px_rgba(14,43,32,0.9)]" : "border-black/[0.08] bg-white text-[#141414] hover:bg-[#fbfbfa]"
              }`}
            >
              <GuideIcon name={c.icon} className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" />
              <span className="leading-tight">
                <span className="block text-[12.5px] font-semibold sm:text-[15px]">{c.name}</span>
                <span className={`block text-[11px] sm:text-[13px] ${on ? "text-white/80" : "text-[#555]"}`}>Failures ({c.items.length})</span>
              </span>
              {on ? <span className="absolute -bottom-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-[#0e2b20]" aria-hidden="true" /> : null}
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
      className="group flex flex-col rounded-md border border-black/[0.07] bg-white p-4 shadow-[0_6px_18px_-14px_rgba(0,0,0,0.4)] transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.45)]"
    >
      <div className="flex flex-1 gap-4">
        <span className={`relative shrink-0 ${wide ? "h-[96px] w-[130px]" : "h-[88px] w-[92px]"}`}>
          <Image src={item.image} alt="" fill className="object-contain" sizes="130px" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-2.5">
            <span className="mt-0.5 rounded bg-[#eef1ee] px-1.5 py-0.5 text-[13px] text-[#1f3a2c]">{pad(n)}</span>
            <span className="text-[15.5px] font-semibold leading-snug text-[#141414]">{item.title}</span>
          </span>
          <span className="mt-2 block text-[12.5px] leading-[1.55] text-[#3a3a3a]">{item.text}</span>
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Pill severity={item.severity} size="sm" />
        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#0e2b20] group-hover:underline">
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
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0e2b20] text-white">
              <GuideIcon name={c.icon} className="h-6 w-6" />
            </span>
            <h3 className="text-[17px] font-medium uppercase tracking-[0.02em] text-[#0e2b20]">{c.title}</h3>
            <span className="h-px flex-1 bg-black/15" />
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
    <section className="relative overflow-hidden bg-[#f7f7f5] text-[#141414]">
      <div className="mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-12 lg:pb-14 lg:pt-12 xl:px-[96px]">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-[#c9963f] sm:w-16" />
          <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#0e2b20] sm:text-[14px]">{data.eyebrow}</p>
          <span className="h-px w-12 bg-[#c9963f] sm:w-16" />
        </div>

        <h2 className={`${serif.className} mt-2.5 text-center text-[clamp(23px,6.2vw,46px)] leading-[1.1] tracking-[-0.01em]`}>
          <span className="whitespace-nowrap">{l1}</span> <br className="xl:hidden" />
          <span className="text-[#1f5c3d]">{l2}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[700px] text-center text-[14px] leading-[1.55] text-[#3a3a3a] sm:text-[15.5px]">{data.subhead}</p>

        <MobileDatabase categories={data.categories} />
        <DesktopDatabase categories={data.categories} />

        {/* data note */}
        <div className="relative mt-4 overflow-hidden rounded-xl border border-black/[0.08] bg-[#eef1ee] lg:mt-5 lg:rounded-md lg:bg-[#f1f2ef]">
          <div className="relative flex flex-wrap items-center gap-3.5 px-3.5 py-4 sm:flex-nowrap sm:gap-6 sm:px-6 lg:px-7">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0e2b20] text-white sm:h-[60px] sm:w-[60px]">
              <GuideIcon name="shield" className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold uppercase tracking-[0.02em] text-[#0e2b20] lg:inline lg:text-[14px]">{data.note.title}: </p>
              <p className="mt-0.5 text-[12.5px] leading-[1.55] text-[#3a3a3a] sm:text-[13.5px] lg:inline lg:text-[14px]">{data.note.text}</p>
            </div>
            {/* car line drawing: its own row under the text on phones, beside it (with a divider) from sm up */}
            <span className="flex w-full justify-end border-t border-black/10 pt-3 text-[#7f8a82] sm:w-auto sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <GuideIcon name="suv-outline" className="h-[74px] w-[202px] sm:h-[70px] sm:w-[190px] lg:h-[80px] lg:w-[218px]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
