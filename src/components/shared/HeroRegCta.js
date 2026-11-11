"use client";

import { useState } from "react";
import UkPlateInput from "@/components/shared/UkPlateInput";
import { openQuoteModal } from "@/lib/quoteModal";

function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Hero-only registration → opens sticky quote modal and looks up the vehicle.
 */
export default function HeroRegCta({
  buttonLabel = "Explore Engine Replacement Options",
  supportText = "",
  placeholder = "Your Reg",
  className = "",
  buttonClassName = "",
  plateClassName = "sm:min-w-[260px] sm:flex-[1.35]",
}) {
  const [reg, setReg] = useState("");

  function openWithReg(event) {
    event.preventDefault();
    const cleaned = reg.replace(/\s+/g, "").toUpperCase();
    openQuoteModal(cleaned ? { reg: cleaned, lookup: true } : {});
  }

  return (
    <form onSubmit={openWithReg} className={`w-full max-w-[640px] ${className}`}>
      {supportText ? (
        <p className="mb-2.5 text-[13px] leading-snug text-lr-body sm:text-[14px]">{supportText}</p>
      ) : null}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
        <UkPlateInput
          value={reg}
          onChange={setReg}
          placeholder={placeholder}
          className={plateClassName}
        />
        <button
          type="submit"
          className={`inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2.5 rounded-md bg-lr-brand px-4 text-[14px] font-semibold text-lr-on-brand shadow-[0_12px_28px_-14px_rgba(18,61,42,0.75)] transition-colors hover:bg-lr-brand-hover sm:min-h-14 sm:px-5 sm:text-[15px] dark:border dark:border-lr-gold-line/60 ${buttonClassName}`}
        >
          <span className="text-balance text-center leading-snug">{buttonLabel}</span>
          <Arrow className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        </button>
      </div>
    </form>
  );
}
