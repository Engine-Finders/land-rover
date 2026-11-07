import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { BODY, BODY_SM, CONTAINER, H2, H5, H6, ICON_MD, ICON_SM, ICON_XL, ICON_XS, LABEL, SMALL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens. The note-type cards (our
// commitment, the expert-advice call and the data note) are deep green in both themes, like every data
// note on the page; their dark photos fade into that green through long, soft CSS masks.
const ICON_DISC = "flex shrink-0 items-center justify-center rounded-full bg-lr-chip text-lr-ink";
const NOTE_CARD = "border-[#0c2a1f] bg-[#0c2a1f] text-white shadow-[0_14px_30px_-18px_rgba(6,24,17,0.55)] dark:border-lr-line dark:bg-[#0a1c15]";
const GOLD = "text-[#d4aa68]";

// phones / tablets: icon left, title + gold rule + text right (mobile reference)
function MobileCard({ c }) {
  return (
    <li className="flex gap-4 rounded-lg border border-lr-line bg-lr-card p-4 shadow-[0_6px_18px_-14px_var(--lr-shadow)] sm:gap-5 sm:p-5">
      <span className={`${ICON_DISC} h-[56px] w-[56px] sm:h-[66px] sm:w-[66px]`}>
        <GuideIcon name={c.icon} className={ICON_MD} />
      </span>
      <span className="min-w-0">
        <span className={`${H6} block text-lr-head`}>{c.title}</span>
        <span className="mt-2 block h-[2px] w-7 bg-lr-gold-line" />
        <span className={`${BODY_SM} mt-2.5 block text-lr-body`}>{c.text}</span>
      </span>
    </li>
  );
}

// desktop: centred card (desktop reference)
function DesktopCard({ c }) {
  return (
    <li className="flex flex-col items-center rounded-lg border border-lr-line bg-lr-card px-4 pb-6 pt-5 text-center shadow-[0_6px_18px_-14px_var(--lr-shadow)]">
      <span className={`${ICON_DISC} h-[60px] w-[60px]`}>
        <GuideIcon name={c.icon} className={ICON_MD} />
      </span>
      <span className={`${H6} mt-4 block text-lr-head`}>{c.title}</span>
      <span className="mt-3 block h-[2px] w-9 bg-lr-gold-line" />
      <span className={`${BODY_SM} mt-3 block text-lr-body`}>{c.text}</span>
    </li>
  );
}

function Commitment({ c }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border ${NOTE_CARD}`}>
      {/* sm+: photo on the right, its left edge fading softly into the green (mask - no tint on the car) */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[50%] [mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.45)_20%,rgba(0,0,0,0.85)_34%,#000_46%)] sm:block"
        aria-hidden="true"
      >
        <Image src={c.image} alt="" fill quality={90} className="object-cover object-[35%_55%]" sizes="(min-width: 1280px) 420px, 50vw" />
      </div>

      <div className="relative px-5 pb-5 pt-5 sm:w-[57%] sm:px-7 sm:py-7 xl:w-[57%] xl:px-8 xl:py-8">
        <p className={`${LABEL} flex items-center gap-3 ${GOLD}`}>
          <GuideIcon name="shield" tone="current" className={ICON_XS} />
          {c.eyebrow}
        </p>
        <h3 className={`${H5} mt-3 text-white`}>{c.title}</h3>
        <span className="mt-4 hidden h-[2px] w-9 bg-[#c9a35d] xl:block" />
        <p className={`${BODY_SM} mt-3 text-white/85 xl:mt-5`}>{c.text}</p>
        <p className={`${SMALL} mt-4 flex items-center gap-3 font-medium text-white xl:mt-6`}>
          <GuideIcon name="signature" className="h-7 w-[72px] text-white/80" />
          {c.sign}
        </p>
      </div>

      {/* phones: the car gets its own band under the text, fading into the panel at the top */}
      <div className="relative aspect-[580/440] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6)_14%,#000_30%)] sm:hidden" aria-hidden="true">
        <Image src={c.image} alt="" fill quality={90} className="object-cover object-[50%_55%]" sizes="100vw" />
      </div>
    </div>
  );
}

function Faq({ faq }) {
  const firstMobile = faq.items.findIndex((it) => it.show === "mobile");
  return (
    <div className="rounded-lg border border-lr-line bg-lr-card px-4 shadow-[0_6px_18px_-14px_var(--lr-shadow)] sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-lr-line py-3.5 sm:flex-nowrap sm:py-4">
        <GuideIcon name="question" className={ICON_SM} />
        <h3 className={`${H6} min-w-0 flex-1 basis-[220px] uppercase tracking-[0.03em] text-lr-ink sm:basis-auto`}>{faq.title}</h3>
        <Link href={faq.cta.href} className={`${SMALL} ml-9 inline-flex shrink-0 items-center gap-1.5 font-medium text-lr-ink hover:underline sm:ml-0`}>
          {faq.cta.label} <Arrow className="h-4 w-4" />
        </Link>
      </div>
      <ul className="divide-y divide-lr-line">
        {faq.items.map((it, i) => {
          const open = i === firstMobile;
          return (
            <li key={it.q} className={it.show === "mobile" ? "xl:hidden" : "hidden xl:block"}>
              <details className="group" open={open}>
                <summary className={`${BODY_SM} flex cursor-pointer list-none items-center gap-4 py-3 text-lr-head hover:text-lr-green xl:py-[15px] [&::-webkit-details-marker]:hidden`}>
                  <span className="min-w-0 flex-1 font-medium xl:font-normal">{it.q}</span>
                  <GuideIcon name="chevron-down" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className={`${BODY_SM} pb-3.5 pr-8 text-lr-body`}>{it.a}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Cta({ cta }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border ${NOTE_CARD}`}>
      {/* laptops: the three cars on the right, fading softly into the green on their left */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[40%] [mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.5)_14%,rgba(0,0,0,0.9)_26%,#000_34%)] lg:block"
        aria-hidden="true"
      >
        <Image src={cta.image} alt="" fill quality={90} className="object-cover" sizes="40vw" />
      </div>
      <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-7 lg:w-[64%] lg:py-6 xl:w-[60%]">
        <div className="flex items-start gap-4 sm:min-w-0 sm:flex-1 sm:items-center">
          <span className={`shrink-0 ${GOLD}`}>
            <GuideIcon name="shield" tone="current" className={ICON_XL} />
          </span>
          <span className="min-w-0">
            <span className={`${H5} block text-white`}>{cta.title}</span>
            <span className={`${BODY_SM} mt-1.5 block text-white/85`}>{cta.text}</span>
          </span>
        </div>
        <div className="shrink-0">
          <QuoteLink
            href={cta.href}
            className="flex items-center justify-center gap-3 whitespace-nowrap rounded-[4px] bg-[#c9a35d] px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.03em] text-[#0c2a1f] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.6)] transition-colors hover:bg-[#d8b574] xl:text-[15px]"
          >
            {cta.label} <Arrow className="h-4 w-4" />
          </QuoteLink>
          <p className={`${SMALL} mt-2 flex items-center justify-center gap-2 text-white/70 sm:justify-start`}>
            <GuideIcon name="lock" tone="current" className={ICON_XS} />
            {cta.small}
          </p>
        </div>
      </div>
      {/* phones / tablets: the three cars as a band at the bottom, fading up into the panel */}
      <div className="relative -mt-2 aspect-[711/156] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6)_20%,#000_42%)] lg:hidden" aria-hidden="true">
        <Image src={cta.image} alt="" fill quality={90} className="object-cover" sizes="100vw" />
      </div>
    </div>
  );
}

export default function HomeTrust({ data }) {
  const [h1, h2] = data.h2.split("|");
  const [s1, s2] = data.subhead.split("|");
  const { note } = data;

  return (
    <section lang="en-GB" className="relative bg-lr-page text-lr-head">
      <div className={`${CONTAINER} pb-6 pt-6 lg:pb-7 lg:pt-6`}>
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-lr-gold-line sm:w-12" />
          <p className={`${LABEL} text-lr-ink`}>{data.eyebrow}</p>
          <span className="h-px w-10 bg-lr-gold-line sm:w-12" />
        </div>
        <h2 className={`${H2} mt-3 text-balance text-center`}>
          {h1} <br className="xl:hidden" />
          <span className="text-lr-ink">{h2}</span>
        </h2>
        <p className={`${BODY} mx-auto mt-3 max-w-[800px] text-center text-lr-body`}>
          {s1} <br className="hidden sm:block" />
          {s2}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:hidden">
          {data.mobileCards.map((c) => (
            <MobileCard key={c.title} c={c} />
          ))}
        </ul>
        <ul className="mt-7 hidden grid-cols-6 gap-3 xl:grid">
          {data.desktopCards.map((c) => (
            <DesktopCard key={c.title} c={c} />
          ))}
        </ul>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <Commitment c={data.commitment} />
          <Faq faq={data.faq} />
        </div>

        <div className="mt-4">
          <Cta cta={data.cta} />
        </div>

        {/* data note */}
        {/* data note: the same deep green bar as the other sections */}
        <div className={`mt-4 flex gap-4 rounded-lg border px-4 py-4 max-sm:flow-root sm:px-6 xl:items-center xl:rounded-md xl:px-7 xl:py-4 ${NOTE_CARD}`}>
          <span className={`shrink-0 max-sm:float-left max-sm:mb-1 max-sm:mr-3 ${GOLD}`}>
            <GuideIcon name="shield" tone="current" className={ICON_MD} />
          </span>
          <div className="min-w-0 xl:flex xl:flex-1 xl:items-center xl:gap-8">
            <p className={`${BODY_SM} text-white/90 xl:flex-1`}>
              <span className={`font-semibold uppercase tracking-[0.02em] ${GOLD}`}>{note.title}</span> <span className="break-words">{note.text}</span>
            </p>
            <ul className={`${SMALL} mt-2 flex flex-wrap gap-x-5 gap-y-1 text-white xl:mt-0 xl:shrink-0 xl:items-center xl:border-l xl:border-white/20 xl:pl-8`}>
              <li className={`hidden xl:block ${GOLD}`}>
                <GuideIcon name="star" tone="current" className={ICON_XS} />
              </li>
              {note.stats.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7bc49a]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
