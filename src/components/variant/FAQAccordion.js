import VIcon from "@/components/variant/VariantIcons";
import { BODY_SM, CONTAINER, H2, H6, LABEL, SMALL } from "@/lib/typeScale";

// Variant section: FAQ accordion (native <details>, no client JS) from the page's `faq` JSON,
// split into two columns, plus the pricing disclaimer. Follows the site theme (day / night).
const SERIF = { fontFamily: "var(--font-serif-display), Georgia, 'Times New Roman', serif" };

function FaqItem({ item, n, open }) {
  return (
    <details open={open} className="group border-b border-lr-line last:border-b-0">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 md:gap-4 md:px-5 [&::-webkit-details-marker]:hidden">
        <span className={`${SMALL} flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-lr-green/60 bg-lr-green/10 font-semibold text-lr-green md:h-8 md:w-8`}>
          {n}
        </span>
        <span className={`${H6} flex-1 pt-0.5 text-lr-head`} dangerouslySetInnerHTML={{ __html: item.question }} />
        <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 text-lr-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p className={`${BODY_SM} -mt-1 pb-4 pl-[56px] pr-4 text-lr-body md:pl-[68px] md:pr-8 [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2`} dangerouslySetInnerHTML={{ __html: item.answer }} />
    </details>
  );
}

export default function FAQAccordion({ data }) {
  const items = data?.items || [];
  if (!items.length) return null;
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)].filter((c) => c.length);

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      <div className={`relative ${CONTAINER} py-10 md:py-14`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={`${LABEL} text-lr-gold`}>Your Questions Answered</p>
            <h2 className={`${H2} mt-3 text-lr-head`}>Frequently Asked Questions</h2>
          </div>
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-lr-gold-line text-[28px] text-lr-gold sm:flex md:h-16 md:w-16" style={SERIF} aria-hidden="true">
            ?
          </span>
        </div>

        <div className="mt-6 grid items-start gap-3 md:gap-4 lg:grid-cols-2">
          {columns.map((col, c) => (
            <div key={c} className="overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)]">
              {col.map((item, i) => (
                <FaqItem key={item.id || item.question} item={item} n={c * half + i + 1} open={c === 0 && i === 0} />
              ))}
            </div>
          ))}
        </div>

        {data.disclaimer && (
          <div className="mt-4 flex items-start gap-3.5 rounded-xl border border-lr-line bg-lr-panel p-4 md:items-center md:gap-5 md:p-5">
            <VIcon name="shield" className="h-8 w-8 shrink-0 text-lr-gold md:h-10 md:w-10" />
            <p className={`${BODY_SM} text-lr-body`} dangerouslySetInnerHTML={{ __html: data.disclaimer }} />
          </div>
        )}
      </div>
    </section>
  );
}
