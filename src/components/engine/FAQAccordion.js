"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTAINER, DARK, MINT, SANS } from "@/components/engine/engineTheme";

// Engine section: Frequently Asked Questions - heading, intro and engine photo on the left, the
// numbered questions on the right with every answer open by default (each one can be folded).
// Copy from the page's `faq` JSON. Fixed dark design. 2xl values are the reference design at
// 1536px; xl is the same layout scaled for 1280-1535px; lg narrows the photo panel; below lg the
// panel sits above the questions.

const dash = (t = "") => String(t).replace(/ - /g, " — ");
// source tags such as [EM-VERIFIED] in green
const tagged = (t = "") => dash(t).replace(/(\[[A-Z][A-Z -]*\])/g, `<span style="color:${MINT}">$1</span>`);

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-200 2xl:h-6 2xl:w-6 ${open ? "" : "-rotate-90"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 9 7 7 7-7" />
    </svg>
  );
}

function Question({ item, index, open, onToggle }) {
  const id = `engine-faq-${item.id ?? index}`;
  return (
    <li className="relative border-b border-[#232b28] last:border-b-0">
      {/* divider between the number column and the copy, as in the reference */}
      <span className="absolute inset-y-0 left-[79px] hidden w-px bg-[#1c2421] md:block xl:left-[77px] 2xl:left-[90px]" aria-hidden="true" />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="grid w-full grid-cols-[40px_minmax(0,1fr)_20px] items-start gap-x-3.5 px-4 py-4 text-left sm:px-5 md:grid-cols-[48px_minmax(0,1fr)_24px] md:gap-x-5 xl:grid-cols-[46px_minmax(0,1fr)_22px] xl:gap-x-[26px] xl:px-[18px] xl:py-[8px] 2xl:grid-cols-[54px_minmax(0,1fr)_24px] 2xl:gap-x-[31px] 2xl:pl-[21px] 2xl:pr-[34px] 2xl:py-[9px]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[#2b3531] bg-[#0b1012] text-[19px] font-medium leading-none md:h-12 md:w-12 md:text-[24px] xl:mt-[3px] xl:h-[45px] xl:w-[46px] xl:text-[24px] 2xl:mt-[4px] 2xl:h-[52px] 2xl:w-[54px] 2xl:text-[28px]" style={{ color: MINT }}>
          {index + 1}
        </span>
        <span className="min-w-0">
          <span className="block text-[15.5px] font-semibold leading-[1.35] text-white md:text-[17px] xl:pt-[3px] xl:text-[16.5px] xl:leading-[21px] 2xl:pt-[3px] 2xl:text-[19px] 2xl:leading-[24px]">{dash(item.question)}</span>
          {open && (
            <span id={id} className="mt-1.5 block max-w-[680px] text-[14px] leading-[1.55] text-[#c3cac6] md:text-[15px] xl:mt-[4px] xl:max-w-[566px] xl:text-[13.5px] xl:leading-[20px] 2xl:mt-[4.5px] 2xl:max-w-[652px] 2xl:text-[15.5px] 2xl:leading-[22.5px]" dangerouslySetInnerHTML={{ __html: tagged(item.answer) }} />
          )}
        </span>
        <span className="self-center text-white/90">
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
    <section className="relative overflow-hidden text-white" style={{ ...SANS, background: DARK }}>
      <div className={`${CONTAINER} pb-6 pt-10 md:pb-8 md:pt-14 xl:pb-[10px] xl:pt-[22px] 2xl:pb-[10px] 2xl:pt-[6px]`}>
        <div className="grid overflow-hidden rounded-2xl border border-[#262e2a] bg-[#0a0f11] lg:grid-cols-[minmax(0,452fr)_minmax(0,1015fr)] xl:-mx-[13px] xl:rounded-[14px] 2xl:-mx-[15px]">
          {/* heading + engine photo */}
          <div className="relative flex flex-col bg-[linear-gradient(180deg,#10161a_0%,#0b1012_100%)] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:flex lg:border-r lg:border-[#262e2a]">
            <div className="relative z-10 px-5 pb-5 pt-7 md:px-7 md:py-9 lg:pb-0 xl:px-[24px] xl:pt-[25px] 2xl:px-[28px] 2xl:pt-[29px]">
              <p className="flex items-center gap-3 text-[12.5px] font-medium uppercase leading-5 tracking-[0.06em] md:text-[14px] xl:text-[13px] 2xl:text-[15px] 2xl:tracking-[0.03em]" style={{ color: MINT }}>
                <span className="h-px w-7 xl:w-[22px] 2xl:w-[26px]" style={{ background: MINT }} aria-hidden="true" />
                FAQ
              </p>
              <h2 className="mt-2.5 text-[30px] leading-[1.15] text-white md:text-[36px] xl:mt-[9px] xl:text-[33px] xl:leading-[40px] 2xl:mt-[11px] 2xl:text-[38px] 2xl:leading-[46px]" style={{ ...SANS, fontWeight: 700 }}>
                Frequently Asked Questions
              </h2>
              <p className="mt-3 max-w-[340px] text-[15.5px] leading-[1.55] text-[#c3cac6] md:text-[16.5px] xl:mt-[10px] xl:max-w-[270px] xl:text-[15px] xl:leading-[23px] 2xl:mt-[12px] 2xl:max-w-[310px] 2xl:text-[17.5px] 2xl:leading-[26px]">
                Expert answers to the most common {engineFor} engine questions.
              </p>
            </div>
            <div className="relative mt-2 aspect-[447/373] w-full md:mt-0 md:aspect-auto md:min-h-[260px] lg:mt-auto lg:aspect-[447/373] lg:min-h-0" aria-hidden="true">
              <Image src={photo} alt="" fill sizes="(min-width: 1024px) 450px, (min-width: 768px) 45vw, 100vw" className="object-cover object-[55%_60%]" />
              <div className="absolute inset-x-0 top-0 h-[35%]" style={{ background: "linear-gradient(to bottom, #0f151a, transparent)" }} />
              <div className="absolute inset-y-0 left-0 hidden w-[25%] md:block lg:hidden" style={{ background: "linear-gradient(to right, #0e1418, transparent)" }} />
            </div>
          </div>

          {/* questions */}
          <ul className="border-t border-[#262e2a] bg-[#080c0d] lg:border-t-0">
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
