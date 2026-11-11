"use client";

import Link from "next/link";
import { isQuoteHref, openQuoteModal } from "@/lib/quoteModal";

// Quote CTAs open the sticky FreeQuote form modal instead of navigating to /quote.
export default function QuoteLink({ href, children, ...rest }) {
  if (isQuoteHref(href)) {
    return (
      <button
        type="button"
        {...rest}
        onClick={(event) => {
          event.preventDefault();
          openQuoteModal();
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
