import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { serif } from "@/lib/guideFonts";

const ICON_DISC = "flex shrink-0 items-center justify-center rounded-full bg-[#e9efe9] text-[#0e2b20]";

// phones / tablets: icon left, title + gold rule + text right (mobile reference)
function MobileCard({ c }) {
  return (
    <li className="flex gap-4 rounded-lg border border-black/[0.07] bg-white p-4 shadow-[0_6px_18px_-14px_rgba(0,0,0,0.35)] sm:gap-5 sm:p-5">
      <span className={`${ICON_DISC} h-[56px] w-[56px] sm:h-[66px] sm:w-[66px]`}>
        <GuideIcon name={c.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>
      <span className="min-w-0">
        <span className="block text-[16.5px] font-medium leading-snug text-[#141414] sm:text-[18px]">{c.title}</span>
        <span className="mt-2 block h-[2px] w-7 bg-[#c9963f]" />
        <span className="mt-2.5 block text-[13.5px] leading-[1.55] text-[#3a3a3a]">{c.text}</span>
      </span>
    </li>
  );
}

// desktop: centred card (desktop reference)
function DesktopCard({ c }) {
  return (
    <li className="flex flex-col items-center rounded-lg border border-black/[0.07] bg-white px-5 pb-6 pt-5 text-center shadow-[0_6px_18px_-14px_rgba(0,0,0,0.35)]">
      <span className={`${ICON_DISC} h-[60px] w-[60px]`}>
        <GuideIcon name={c.icon} className="h-8 w-8" />
      </span>
      <span className="mt-4 block text-[15px] font-medium leading-snug text-[#141414]">{c.title}</span>
      <span className="mt-4 block h-[2px] w-9 bg-[#c9963f]" />
      <span className="mt-4 block text-[12.5px] leading-[1.6] text-[#3a3a3a]">{c.text}</span>
    </li>
  );
}

function Commitment({ c }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#0b120f] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.7)]">
      {/* sm+: photo on the right, its left edge fading into the dark panel (mask - no tint on the car) */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[46%] [mask-image:linear-gradient(to_right,transparent,#000_22%)] sm:block"
        aria-hidden="true"
      >
        <Image src={c.image} alt="" fill quality={90} className="object-cover object-[35%_55%]" sizes="(min-width: 1280px) 420px, 50vw" />
      </div>

      <div className="relative px-5 pb-5 pt-5 sm:w-[57%] sm:px-7 sm:py-7 xl:w-[57%] xl:px-8 xl:py-8">
        <p className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.04em] text-[#c9963f]">
          <GuideIcon name="shield" className="h-6 w-6" />
          {c.eyebrow}
        </p>
        <h3 className={`${serif.className} mt-3 text-[22px] leading-[1.18] sm:text-[24px] xl:text-[26px]`}>{c.title}</h3>
        <span className="mt-4 hidden h-[2px] w-9 bg-[#c9963f] xl:block" />
        <p className="mt-3 text-[14px] leading-[1.6] text-white/88 xl:mt-5 xl:text-[13px] xl:leading-[1.7]">{c.text}</p>
        <p className="mt-4 flex items-center gap-3 text-[14px] font-medium xl:mt-6 xl:text-[13px]">
          <GuideIcon name="signature" className="h-7 w-[72px] text-white/90" />
          {c.sign}
        </p>
      </div>

      {/* phones: the car gets its own band under the text, fading into the panel at the top */}
      <div className="relative aspect-[580/440] [mask-image:linear-gradient(to_bottom,transparent,#000_18%)] sm:hidden" aria-hidden="true">
        <Image src={c.image} alt="" fill quality={90} className="object-cover object-[50%_55%]" sizes="100vw" />
      </div>
    </div>
  );
}

function Faq({ faq }) {
  const firstMobile = faq.items.findIndex((it) => it.show === "mobile");
  return (
    <div className="rounded-lg border border-black/[0.07] bg-white px-4 shadow-[0_6px_18px_-14px_rgba(0,0,0,0.35)] sm:px-6">
      <div className="flex items-center gap-3 border-b border-black/[0.08] py-3.5 sm:py-4">
        <GuideIcon name="question" className="h-6 w-6 shrink-0 text-[#0e2b20]" />
        <h3 className="min-w-0 flex-1 text-[14px] font-medium uppercase tracking-[0.04em] text-[#0e2b20] sm:text-[15px]">{faq.title}</h3>
        <Link href={faq.cta.href} className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-[#0e2b20] hover:underline">
          {faq.cta.label} <Arrow className="h-4 w-4" />
        </Link>
      </div>
      <ul className="divide-y divide-black/[0.08]">
        {faq.items.map((it, i) => {
          const open = i === firstMobile;
          return (
            <li key={it.q} className={it.show === "mobile" ? "xl:hidden" : "hidden xl:block"}>
              <details className="group" open={open}>
                <summary className="flex cursor-pointer list-none items-center gap-4 py-3 text-[15px] text-[#141414] hover:text-[#1f5c3d] xl:py-[17px] xl:text-[14px] [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1 font-medium xl:font-normal">{it.q}</span>
                  <GuideIcon name="chevron-down" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-3.5 pr-8 text-[13.5px] leading-[1.55] text-[#3a3a3a]">{it.a}</p>
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
    <div className="relative overflow-hidden rounded-lg bg-[#0b1f17] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.7)]">
      <div
        className="absolute inset-y-0 right-0 hidden w-[36%] [mask-image:linear-gradient(to_right,transparent,#000_14%)] lg:block"
        aria-hidden="true"
      >
        <Image src={cta.image} alt="" fill quality={90} className="object-cover" sizes="40vw" />
      </div>
      <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-7 lg:w-[66%] lg:py-6">
        <div className="flex items-start gap-4 sm:min-w-0 sm:flex-1 sm:items-center">
          <span className="shrink-0 text-[#c9963f]">
            <GuideIcon name="shield" className="h-12 w-12 sm:h-14 sm:w-14" />
          </span>
          <span className="min-w-0">
            <span className={`${serif.className} block text-[21px] leading-[1.15] sm:text-[23px] 2xl:whitespace-nowrap 2xl:text-[24px]`}>{cta.title}</span>
            <span className="mt-1.5 block text-[13.5px] leading-snug text-white/85">{cta.text}</span>
          </span>
        </div>
        <div className="shrink-0">
          <QuoteLink
            href={cta.href}
            className="flex items-center justify-center gap-3 rounded-[4px] bg-white px-5 py-3 text-[14px] font-medium uppercase tracking-[0.03em] text-[#0e2b20] transition-colors hover:bg-[#eef3ef]"
          >
            {cta.label} <Arrow className="h-4 w-4" />
          </QuoteLink>
          <p className="mt-2 flex items-center justify-center gap-2 text-[12.5px] text-white/85 sm:justify-start">
            <GuideIcon name="lock" className="h-3.5 w-3.5" />
            {cta.small}
          </p>
        </div>
      </div>
      {/* phones / tablets: the three cars as a band at the bottom, fading up into the panel */}
      <div className="relative -mt-2 aspect-[711/156] [mask-image:linear-gradient(to_bottom,transparent,#000_30%)] lg:hidden" aria-hidden="true">
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
    <section lang="en-GB" className="relative bg-[#fafaf8] text-[#141414]">
      <div className="mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-12 lg:pb-14 lg:pt-10 xl:px-[88px]">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#c9963f] sm:w-12" />
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#0e2b20] sm:text-[14px]">{data.eyebrow}</p>
          <span className="h-px w-10 bg-[#c9963f] sm:w-12" />
        </div>
        <h2 className={`${serif.className} mt-3 text-center text-[clamp(30px,8.6vw,50px)] leading-[1.08] tracking-[-0.01em]`}>
          {h1} <br className="xl:hidden" />
          <span className="text-[#0e2b20]">{h2}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[720px] text-center text-[14.5px] leading-[1.6] text-[#2a2a2a] sm:text-[16px]">
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
        <div className="mt-4 flex gap-4 rounded-lg border border-black/[0.08] bg-white px-4 py-4 sm:px-6 xl:items-center xl:py-3.5">
          <GuideIcon name="shield" className="h-7 w-7 shrink-0 text-[#0e2b20]" />
          <div className="min-w-0 xl:flex xl:flex-1 xl:items-center xl:gap-8">
            <p className="text-[13.5px] leading-[1.55] text-[#3a3a3a] xl:flex-1 xl:text-[13px]">
              <span className="font-semibold text-[#141414]">{note.title}</span> <span className="break-words">{note.text}</span>
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-[#3a3a3a] xl:mt-0 xl:shrink-0 xl:items-center xl:border-l xl:border-black/10 xl:pl-8 xl:text-[13px]">
              <li className="hidden xl:block">
                <GuideIcon name="star" className="h-5 w-5 text-[#3a3a3a]" />
              </li>
              {note.stats.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1f6b45] xl:bg-[#3a3a3a]" />
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
