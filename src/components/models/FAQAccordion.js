"use client";

import { useId, useRef, useState } from "react";
import { BODY_SM, CONTAINER } from "@/lib/typeScale";
import { Arrow, BAND_PAGE, Chevron, EyebrowPill, IconChip, SANS, SECTION_Y, SectionTitle, prose } from "@/components/models/modelKit";
import { comparePage, localHtml } from "@/components/models/generationsFaqLinks";

// Model page section 13 (FAQ), built to the approved reference: numbered questions in two columns
// on large screens (one on phones and tablets), each opening its answer in place, and the
// "Need a head-to-head comparison?" bar - built from the FAQ's own "A vs B" question and linked to
// that comparison guide (or, without one, to the answer itself). Answers stay in the HTML when
// folded, so the page keeps its FAQ content for search.

function Item({ item, number, open, onToggle, refFor }) {
  const id = useId();
  return (
    <div
      ref={refFor}
      className={`scroll-mt-28 rounded-xl border bg-lr-card shadow-[0_10px_30px_-26px_var(--lr-shadow)] transition-colors ${open ? "border-lr-ink/35 dark:border-lr-green/40" : "border-lr-line"}`}
    >
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lr-green/60 md:gap-4 md:px-5 md:py-4"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-lr-brand text-[14px] font-semibold leading-none text-lr-on-brand md:h-8 md:w-8 md:text-[15px] dark:border dark:border-lr-green/45 dark:bg-lr-brand/35">
            {number}
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-lr-head md:text-[16px] xl:text-[17px]" dangerouslySetInnerHTML={{ __html: prose(item.question) }} />
          <Chevron className={`h-5 w-5 text-lr-head transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`${BODY_SM} border-t border-lr-line px-4 pb-4 pt-3.5 text-lr-body md:px-5 md:pb-5 md:pl-[4.25rem] [&_a]:font-medium [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline`}
            dangerouslySetInnerHTML={{ __html: localHtml(prose(item.answer)) }}
          />
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ data }) {
  const [open, setOpen] = useState(() => new Set());
  const refs = useRef({});
  if (!data) return null;

  const items = (data.items || []).map((item, i) => ({ ...item, number: item.id || i + 1 }));
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  const toggle = (n) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  // the head-to-head bar: the FAQ's own "A vs B" question
  const vsItem = items.find((item) => /\svs\.?\s/i.test(item.question));
  const pair = vsItem ? vsItem.question.split(/\s+[-–-]\s+/)[0].trim() : "";
  const guide = vsItem ? comparePage(vsItem.question) : null;
  const showAnswer = () => {
    if (!vsItem) return;
    setOpen((prev) => new Set(prev).add(vsItem.number));
    refs.current[vsItem.number]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="faq" className={`${BAND_PAGE} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <EyebrowPill>FAQ</EyebrowPill>
        <SectionTitle h2={data.h2} accent="Frequently Asked Questions" className="mt-3 md:mt-4" />

        <div className="mt-6 grid gap-3 md:mt-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
          {columns.map((column, c) => (
            <div key={c} className="flex flex-col gap-3">
              {column.map((item) => (
                <Item
                  key={item.number}
                  item={item}
                  number={item.number}
                  open={open.has(item.number)}
                  onToggle={() => toggle(item.number)}
                  refFor={(el) => {
                    refs.current[item.number] = el;
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {vsItem && (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-lr-line bg-lr-panel p-4 sm:p-5 md:flex-row md:items-center md:justify-between md:gap-6 lg:mt-6 xl:px-7 xl:py-6">
            <div className="flex items-center gap-4">
              <IconChip name="oem-references" className="h-12 w-12 md:h-14 md:w-14" iconClass="h-6 w-6 md:h-7 md:w-7" />
              <div className="min-w-0">
                <p className="text-[17px] font-semibold leading-snug text-lr-head md:text-[18px] xl:text-[19px]">Need a head-to-head comparison?</p>
                <p className={`${BODY_SM} mt-0.5 text-lr-body`}>
                  Read our in-depth <span className="font-medium text-lr-head">{pair}</span> reliability guide.
                </p>
              </div>
            </div>
            {guide ? (
              <a
                href={guide.href}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-lg bg-lr-brand px-6 text-[15px] font-semibold text-lr-on-brand no-underline shadow-[0_12px_26px_-16px_rgba(18,61,42,0.85)] transition-colors hover:bg-lr-brand-hover md:h-[54px] md:text-[16px] lg:min-w-[300px] xl:text-[17px] dark:border dark:border-lr-green/45 dark:bg-lr-brand/35 dark:hover:bg-lr-brand/55"
              >
                Read the Full Head-to-Head
                <Arrow className="h-5 w-5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={showAnswer}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-lg bg-lr-brand px-6 text-[15px] font-semibold text-lr-on-brand transition-colors hover:bg-lr-brand-hover md:h-[54px] md:text-[16px] dark:border dark:border-lr-green/45 dark:bg-lr-brand/35"
              >
                Read the answer
                <Arrow className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
