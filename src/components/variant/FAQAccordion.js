import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H2, H6, ICON_LG } from "@/lib/typeScale";

// Variant section 8: FAQ, built to the approved reference (day + night) - a gold label, serif title
// with the "?" ring, then the questions as separate cards in two columns (one on phones), every answer
// open as in the reference (each folds on tap - native <details>, no client JS), and the pricing
// disclaimer. Copy from the page's `faq` JSON. Follows the site theme.

const SERIF = "font-[family-name:var(--font-serif-display)]";
const SANS = "font-[family-name:var(--font-instrument-sans)]";
const dash = (t = "") => String(t).replace(/ - /g, " - ");

function FaqItem({ item, n }) {
  return (
    <details open className="group rounded-lg border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)]">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 pb-2 pt-4 md:gap-4 md:px-5 md:pt-5 [&::-webkit-details-marker]:hidden">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lr-brand text-[13.5px] font-semibold text-white md:h-8 md:w-8 md:text-[14px] dark:border-[1.5px] dark:border-lr-green/70 dark:bg-transparent dark:text-lr-green xl:text-[15px]">
          {n}
        </span>
        <span className={`${H6} flex-1 pt-0.5 text-lr-head`} dangerouslySetInnerHTML={{ __html: dash(item.question) }} />
        <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 -rotate-90 text-lr-body transition-transform group-open:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p
        className="pb-4 pl-[56px] pr-4 text-[14.5px] leading-[1.6] text-lr-body md:pb-5 md:pl-[68px] md:pr-8 xl:text-[15px] [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2"
        dangerouslySetInnerHTML={{ __html: dash(item.answer) }}
      />
    </details>
  );
}

export default function FAQAccordion({ data }) {
  const items = data?.items || [];
  if (!items.length) return null;
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)].filter((c) => c.length);

  return (
    <section className={`relative overflow-hidden bg-lr-page text-lr-head ${SANS}`}>
      <div className={`relative ${CONTAINER} border-t border-lr-line py-6 md:py-6 lg:py-7`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-lr-gold md:text-[14px] xl:text-[15px]">Your Questions Answered</p>
              <span className="h-px w-10 bg-lr-gold-line md:w-14" aria-hidden="true" />
            </div>
            <h2 className={`${H2} mt-3 text-lr-head`}>Frequently Asked Questions</h2>
          </div>
          <span className={`${SERIF} flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-line-strong text-[24px] text-lr-body md:h-14 md:w-14 md:text-[28px] dark:border-lr-gold-line dark:text-lr-gold`} aria-hidden="true">
            ?
          </span>
        </div>

        <div className="mt-5 grid items-start gap-3 md:mt-6 md:gap-4 lg:grid-cols-2">
          {columns.map((col, c) => (
            <div key={c} className="grid gap-3 md:gap-4">
              {col.map((item, i) => (
                <FaqItem key={item.id || item.question} item={item} n={c * half + i + 1} />
              ))}
            </div>
          ))}
        </div>

        {data.disclaimer && (
          <div className="mt-3 flex items-start gap-3.5 rounded-lg border border-lr-line bg-lr-card p-4 md:mt-4 md:items-center md:gap-5 md:px-6">
            <LrIcon name="genuine-failure-data" tone="current" className={`${ICON_LG} text-lr-head dark:text-lr-gold`} />
            <p className="text-[13.5px] leading-relaxed text-lr-body md:text-[14px] xl:text-[15px]" dangerouslySetInnerHTML={{ __html: dash(data.disclaimer) }} />
          </div>
        )}
      </div>
    </section>
  );
}
