"use client";

import { useState, useSyncExternalStore } from "react";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose } from "@/components/models/modelKit";
import { localHtml } from "@/components/models/generationsFaqLinks";

// Generation page section 10 - FAQ, built to the approved Defender L316 reference: the eyebrow,
// "FAQ — <generation>" headline with a short rule and a one-line intro; the questions as numbered
// cards in two columns (1–5 on the left, 6–10 on the right), each with its chevron toggle.
// Laptops open every answer, as in the reference; phones and tablets open the first and let the
// rest expand on tap, so the page stays short on mobile. The open state is set by CSS until the
// visitor toggles a question, so nothing jumps after the page loads.

const html = (raw) => localHtml(prose(raw || ""));

function Chevron({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 transition-transform duration-200 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// whether the laptop layout (every answer open by default) is showing; null while server rendering
const WIDE = "(min-width: 1024px)";
const subscribe = (cb) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useWide = () => useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => null);

function Item({ item, index, open, wide, onToggle }) {
  const id = `gen-faq-${index}`;
  // open: true / false once toggled (or set for this screen size); null = the CSS default
  const shown = open === null ? (index === 0 ? "grid" : "hidden lg:grid") : open ? "grid" : "hidden";
  const turned = open === null ? (index === 0 ? "rotate-180" : "lg:rotate-180") : open ? "rotate-180" : "";
  return (
    <li className="rounded-xl border border-lr-line bg-lr-card shadow-[0_18px_44px_-38px_var(--lr-shadow)] transition-colors hover:border-lr-line-strong">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open === null ? Boolean(wide) || index === 0 : open}
          aria-controls={id}
          className="flex w-full items-start gap-3.5 rounded-xl px-4 pb-3 pt-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-lr-green sm:px-5 xl:gap-4"
        >
          <span className="mt-0.5 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-lr-brand px-1.5 text-[14px] font-bold leading-none text-lr-on-brand xl:h-8 xl:min-w-8 xl:text-[15px]">{index + 1}</span>
          <span className="min-w-0 flex-1 text-[16px] font-semibold leading-snug text-lr-head xl:text-[17px]" dangerouslySetInnerHTML={{ __html: html(item.question) }} />
          <Chevron className={`mt-1 text-lr-head ${turned}`} />
        </button>
      </h3>
      <div id={id} className={`${shown} px-4 pb-4 pl-[60px] sm:px-5 sm:pb-5 sm:pl-[66px] xl:pl-[70px]`}>
        <p className="text-[14px] leading-[1.6] text-lr-body xl:text-[15px] [&_a]:font-medium [&_a]:text-lr-ink [&_a]:underline dark:[&_a]:text-lr-green" dangerouslySetInnerHTML={{ __html: html(item.answer) }} />
      </div>
    </li>
  );
}

export default function FAQAccordion({ data, name = "" }) {
  const items = data?.items || [];
  const [open, setOpen] = useState(() => items.map(() => null));
  const wide = useWide();

  if (!items.length) return null;
  const short = name.replace(/^Land Rover\s+/, "");
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  // a question still on the CSS default flips from what is showing: open on laptops, first only below
  const toggle = (i) => setOpen((prev) => prev.map((v, j) => (j === i ? !(v ?? (Boolean(wide) || i === 0)) : v)));

  return (
    <section id="faq" className={`scroll-mt-16 bg-lr-band py-6 text-lr-head md:scroll-mt-20 md:py-7 xl:py-8 ${SANS}`}>
      <div className={CONTAINER}>
        <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">Questions &amp; Answers</p>
        <h2 className={`${H2_MODEL} mt-3.5 text-balance text-lr-head md:mt-4`}>{name ? `FAQ — ${name}` : "FAQ"}</h2>
        <span className="mt-4 block h-[3px] w-12 rounded-full bg-lr-ink md:mt-5 dark:bg-lr-green" aria-hidden="true" />
        <p className="mt-4 max-w-[40em] text-[15px] leading-[1.6] text-lr-body md:mt-5 md:text-[16px] xl:text-[17px]">
          Everything you need to know about {short || "these"} engines, reliability, replacement costs and common issues — answered by UK specialists.
        </p>

        <div className="mt-6 grid gap-3 md:mt-8 lg:grid-cols-2 lg:items-start lg:gap-4 xl:gap-5">
          {columns.map((col, c) => (
            <ul key={c} className="grid gap-3 lg:gap-4 xl:gap-5">
              {col.map((item, k) => {
                const i = c * half + k;
                return <Item key={item.id ?? i} item={item} index={i} open={open[i] ?? null} wide={wide} onToggle={() => toggle(i)} />;
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
