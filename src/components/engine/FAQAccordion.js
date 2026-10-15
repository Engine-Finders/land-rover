"use client";

import { useState } from "react";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

function cleanText(text = "") {
  return String(text)
    .replace(/\u00c2\u00a3|\u00a3/g, "\u00a3")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, "\u2022")
    .replace(/\s+/g, " ")
    .trim();
}

function renderTaggedText(text = "") {
  return cleanText(text).split(/(\[[^\]]+\])/g).map((part, index) => {
    if (/^\[[^\]]+\]$/.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-semibold text-[var(--color-primary)]">
          {part}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function ChevronIcon({ open = false, className = "h-5 w-5" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-primary-soft)]">
          <HomeIcon name="faq" size={36} className="h-9 w-9" />
        </span>
        <span className="flex-1 text-[0.92rem] font-semibold leading-snug text-[var(--color-text)]">
          {cleanText(item.question)}
        </span>
        <ChevronIcon open={isOpen} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
      </button>
      {isOpen ? (
        <p className="px-5 pb-4 pl-[60px] text-[0.85rem] leading-[1.55] text-[var(--color-text-muted)]">
          {renderTaggedText(item.answer)}
        </p>
      ) : null}
    </div>
  );
}

export default function FAQAccordion({ data, band = "soft" }) {
  const [openId, setOpenId] = useState(null);
  if (!data) return null;

  const items = data.items || [];
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <section className={`w-full py-8 text-[var(--color-text)] md:py-10 ${sectionBgClass(band)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <HeadingEyebrow text="FAQ" />
        <h2 className="mt-3 font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem]">
          FAQ
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-5">
          <div className="flex flex-col gap-3">
            {left.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {right.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
