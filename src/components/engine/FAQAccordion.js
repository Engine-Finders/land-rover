"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";
import { BODY, BODY_SM, H2, H6, LABEL } from "@/lib/typeScale";

// Engine section: Frequently Asked Questions - heading, intro and engine photo on the left, the
// numbered questions on the right with every answer open by default (each one can be folded).
// Copy from the page's `faq` JSON. Follows the site theme; the engine photo panel stays a dark
// photo in both. lg narrows the photo panel; below lg the panel sits above the questions.

const dash = (t = "") => String(t).replace(/ - /g, " - ");
// source tags such as [EM-VERIFIED] in green
const tagged = (t = "") => dash(t).replace(/(\[[A-Z][A-Z -]*\])/g, `<span class="text-lr-green">$1</span>`);

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 9 7 7 7-7" />
    </svg>
  );
}

function Question({ item, index, open, onToggle }) {
  const id = `engine-faq-${item.id ?? index}`;
  return (
    <li className="relative border-b border-lr-line last:border-b-0">
      {/* divider between the number column and the copy, as in the reference */}
      <span className="absolute inset-y-0 left-[79px] hidden w-px bg-lr-line md:block xl:left-[77px]" aria-hidden="true" />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="grid w-full grid-cols-[40px_minmax(0,1fr)_20px] items-start gap-x-3.5 px-4 py-4 text-left sm:px-5 md:grid-cols-[48px_minmax(0,1fr)_24px] md:gap-x-5 xl:grid-cols-[46px_minmax(0,1fr)_22px] xl:gap-x-[26px] xl:px-[18px] xl:py-[8px]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-lr-line bg-lr-chip text-[17px] font-medium leading-none text-lr-green md:h-12 md:w-12 md:text-[19px] xl:mt-[3px] xl:h-[46px] xl:w-[46px] xl:text-[20px]">
          {index + 1}
        </span>
        <span className="min-w-0">
          <span className={`block ${H6} text-lr-head xl:pt-[6px]`}>{dash(item.question)}</span>
          {open && (
            <span id={id} className={`mt-1.5 block max-w-[720px] ${BODY_SM} text-lr-body xl:mt-[6px]`} dangerouslySetInnerHTML={{ __html: tagged(item.answer) }} />
          )}
        </span>
        <span className="self-center text-lr-muted">
          <Chevron open={open} />
        </span>
      </button>
    </li>
  );
}

export default function FAQAccordion({ data, engineName = "", slug = "" }) {
  const items = data?.items || [];
  // every answer starts open (they are the page's best answers); a tap folds or unfolds one
  const [closed, setClosed] = useState(() => new Set());
  if (items.length === 0) return null;

  const toggle = (key) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const name = engineName.replace(/<[^>]+>/g, "").replace(/^Land Rover\s+/i, "");
  const engineFor = (/\(/.test(name) ? name : name.replace(" / ", " & ")) || "engine";
  const photo = /tdi/.test(slug) ? "/engine-faq/engine-tdi.webp" : "/engine-hero/scene.webp";

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head" style={SANS}>
      <div className={`${CONTAINER} pb-6 pt-10 md:pb-8 md:pt-14 xl:pb-8 xl:pt-16`}>
        <header className="mb-6 md:mb-8">
          <p className={`flex items-center gap-3 ${LABEL} text-lr-green`}>
            <span className="h-px w-7 bg-current xl:w-[24px]" aria-hidden="true" />
            FAQ
          </p>
          <h2 className={`mt-2.5 ${H2} text-lr-head xl:mt-3`}>Frequently Asked Questions</h2>
          <p className={`mt-3 max-w-[640px] ${BODY} text-lr-body`}>Expert answers to the most common {engineFor} engine questions.</p>
        </header>

        <div className="grid overflow-hidden rounded-2xl border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)] lg:grid-cols-[minmax(0,400fr)_minmax(0,1015fr)] xl:-mx-[13px] xl:rounded-[14px]">
          {/* engine photo */}
          <div className="relative aspect-[16/9] w-full bg-[#0b1012] sm:aspect-[21/9] lg:aspect-auto lg:min-h-full lg:border-r lg:border-lr-line" aria-hidden="true">
            <Image src={photo} alt="" fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover object-[55%_60%]" />
            <div className="absolute inset-x-0 top-0 h-[30%]" style={{ background: "linear-gradient(to bottom, #0b1012, transparent)" }} />
          </div>

          {/* questions */}
          <ul className="border-t border-lr-line bg-lr-card lg:border-t-0">
            {items.map((item, i) => {
              const key = item.id ?? i;
              return <Question key={key} item={item} index={i} open={!closed.has(key)} onToggle={() => toggle(key)} />;
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
