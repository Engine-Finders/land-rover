import { H1 } from "@/lib/typeScale";
import { SANS } from "@/components/models/modelKit";

// Legal pages (privacy, terms, cookies): the shared H1 and the site's theme colours, a reading-width
// column, and serif sub-headings one step under the section H2s.
export default function LegalPage({ title, updated, children }) {
  return (
    <main className={`mx-auto w-full max-w-3xl px-5 py-10 text-lr-head sm:px-6 md:px-10 md:py-14 xl:py-16 ${SANS}`}>
      <h1 className={`${H1} text-balance text-lr-head`}>{title}</h1>
      <span className="mt-5 flex h-[3px] w-20 overflow-hidden rounded-full" aria-hidden="true">
        <span className="w-[60%] bg-lr-ink dark:bg-lr-green" />
        <span className="flex-1 bg-lr-gold-line" />
      </span>
      {updated ? <p className="mt-4 text-[14px] text-lr-muted md:text-[15px]">Last updated: {updated}</p> : null}
      <div className="mt-8 space-y-4 text-[15px] leading-[1.7] text-lr-body md:text-[16px] [&_a]:text-lr-ink [&_a]:underline dark:[&_a]:text-lr-green [&_h2]:mt-10 [&_h2]:font-[family-name:var(--font-serif-display)] [&_h2]:text-[24px] [&_h2]:font-normal [&_h2]:leading-snug [&_h2]:text-lr-head md:[&_h2]:text-[28px] [&_strong]:text-lr-head [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
