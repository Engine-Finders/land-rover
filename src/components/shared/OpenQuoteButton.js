"use client";

import { openQuoteModal } from "@/lib/quoteModal";

/** Drop-in replacement for quote Links — opens the sticky FreeQuote form modal. */
export default function OpenQuoteButton({
  className = "",
  children,
  reg = "",
  vehicle = null,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        openQuoteModal({
          reg: reg || undefined,
          vehicle: vehicle || undefined,
        });
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
