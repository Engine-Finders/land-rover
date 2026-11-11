"use client";

import OpenQuoteButton from "@/components/shared/OpenQuoteButton";

function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Compact mid-section quote CTA — opens the sticky FreeQuote form modal.
 */
export default function SectionQuoteCta({
  label = "Get an Engine Replacement Quote",
  supportText = "",
  className = "",
  tone = "default",
}) {
  const shell =
    tone === "on-dark"
      ? "border-white/15 bg-white/5 text-white"
      : "border-lr-line bg-lr-card/90 text-lr-head shadow-[0_12px_28px_-20px_var(--lr-shadow)]";
  const support = tone === "on-dark" ? "text-white/75" : "text-lr-body";
  const btn =
    tone === "on-dark"
      ? "bg-lr-green text-white hover:brightness-110"
      : "bg-lr-brand text-lr-on-brand hover:bg-lr-brand-hover dark:border dark:border-lr-gold-line/60";

  return (
    <div className={`mt-6 rounded-xl border px-4 py-4 sm:mt-7 sm:px-5 sm:py-5 md:flex md:items-center md:justify-between md:gap-6 ${shell} ${className}`}>
      <div className="min-w-0 md:flex-1">
        {supportText ? (
          <p className={`text-[14px] leading-snug sm:text-[15px] ${support}`}>{supportText}</p>
        ) : null}
      </div>
      <OpenQuoteButton
        className={`mt-3 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2.5 rounded-md px-4 text-[14px] font-semibold transition-colors sm:min-h-[3.25rem] sm:text-[15px] md:mt-0 md:w-auto md:min-w-[240px] md:px-5 ${btn}`}
      >
        <span className="text-balance text-center leading-snug">{label}</span>
        <Arrow className="h-4 w-4 shrink-0" />
      </OpenQuoteButton>
    </div>
  );
}
