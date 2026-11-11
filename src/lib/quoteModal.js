/** Open the shared sticky quote modal from anywhere on the site. */

export const QUOTE_MODAL_EVENT = "lr:open-quote";

/**
 * @param {{ reg?: string, vehicle?: object }} [detail]
 */
export function openQuoteModal(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(QUOTE_MODAL_EVENT, { detail }));
}

export function isQuoteHref(href = "") {
  if (!href || href === "#quote-form" || href === "#") return true;
  try {
    const path = href.startsWith("http") ? new URL(href).pathname : String(href).split("?")[0];
    return /^\/quotes?\/?$/i.test(path);
  } catch {
    return false;
  }
}
