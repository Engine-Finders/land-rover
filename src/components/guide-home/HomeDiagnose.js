import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { serif } from "@/lib/guideFonts";

const BG = "#f5f5f3";

function Card({ title, className = "", children }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-black/[0.06] bg-white shadow-[0_8px_28px_-14px_rgba(0,0,0,0.35)] ${className}`}>
      <h3 className="bg-[#0e2b20] px-5 py-3 text-[15px] font-semibold uppercase tracking-[0.03em] text-white lg:py-3.5 lg:text-[16px]">{title}</h3>
      {children}
    </div>
  );
}

function HowItWorks({ steps }) {
  return (
    <Card title={steps.title} className="order-1">
      <ol className="flex flex-1 flex-col divide-y divide-black/10 px-4 xl:px-4">
        {steps.items.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3 py-3.5 sm:gap-4 xl:py-5">
            {/* number + icon disc; on wide desktop the number badge overlaps the disc like the reference */}
            <span className="flex shrink-0 items-start gap-3 sm:gap-5 xl:relative xl:gap-0 xl:pl-2">
              <span className="mt-1.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#0e2b20] text-[13px] font-semibold text-white xl:absolute xl:-left-1 xl:-top-1 xl:z-10 xl:mt-0 xl:ring-2 xl:ring-white">
                {i + 1}
              </span>
              <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#0e2b20] text-[#d4a54c] sm:h-16 sm:w-16 xl:ml-5">
                <GuideIcon name={s.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
            </span>
            <span className="min-w-0 pt-1">
              <span className="block text-[15.5px] font-semibold leading-snug text-[#141414] xl:text-[15px]">{s.title}</span>
              <span className="mt-1 block text-[13.5px] leading-[1.5] text-[#4a4a4a] xl:text-[12.5px] xl:leading-[1.6]">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="px-4 pb-4 pt-1 xl:pb-6">
        <QuoteLink
          href={steps.cta.href}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-[#0e2b20] py-3.5 text-[15.5px] font-semibold uppercase tracking-[0.04em] text-white shadow-[0_8px_18px_-8px_rgba(14,43,32,0.8)] transition-colors hover:bg-[#15392a] xl:py-4"
        >
          {steps.cta.label}
          <Arrow className="h-5 w-5" />
        </QuoteLink>
      </div>
    </Card>
  );
}

function Value({ col, value, className = "" }) {
  return (
    <span className={`flex items-center gap-1.5 whitespace-nowrap ${className}`}>
      <span className={col.tone}>
        <GuideIcon name={col.icon} className="h-4 w-4" />
      </span>
      <span className="text-[12.5px] text-[#1f1f1f]">{value}</span>
    </span>
  );
}

function CostTable({ costs }) {
  const { columns, rows } = costs;
  return (
    <Card title={costs.title} className="order-2 md:order-3 md:col-span-2 2xl:order-2 2xl:col-span-1">
      {/* mobile: accordion rows */}
      <ul className="divide-y divide-black/10 px-2 md:hidden">
        {rows.map((r) => (
          <li key={r.name}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 py-2.5 pl-1 pr-1 [&::-webkit-details-marker]:hidden">
                <span className="text-[#1f1f1f] transition-transform group-open:rotate-180">
                  <GuideIcon name="chevron-down" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold text-[#141414]">{r.name}</span>
                  <span className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 min-[480px]:grid-cols-4">
                    {columns.map((c) => (
                      <Value key={c.key} col={c} value={r[c.key]} />
                    ))}
                  </span>
                </span>
                <span className="text-[#8a8a8a]">
                  <GuideIcon name="chevron-right" className="h-4 w-4" />
                </span>
              </summary>
              <div className="pb-3 pl-7 pr-2 text-[13px] leading-relaxed text-[#4a4a4a]">
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {columns.map((c) => (
                    <div key={c.key}>
                      <dt className="text-[11.5px] uppercase tracking-wide text-[#777]">{c.label}</dt>
                      <dd className="font-medium text-[#1f1f1f]">{r[c.key]}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={r.href} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#0e2b20] underline-offset-2 hover:underline">
                  Read the engine guide <Arrow className="h-4 w-4" />
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ul>
      {/* legend */}
      <div className="flex flex-wrap justify-around gap-x-4 gap-y-2 border-t border-black/10 px-3 py-3 md:hidden">
        {columns.map((c) => (
          <span key={c.key} className="flex items-center gap-1.5 text-[12.5px] text-[#333]">
            <span className={c.tone}>
              <GuideIcon name={c.icon} className="h-4.5 w-4.5" />
            </span>
            {c.label}
          </span>
        ))}
      </div>

      {/* tablet / desktop: real table */}
      <div className="hidden flex-1 p-3 md:block 2xl:p-2.5">
        <table className="h-full w-full border-collapse border border-black/10 text-[12.5px] text-[#1f1f1f] 2xl:text-[13px]">
          <thead>
            <tr className="bg-[#fafaf9]">
              <th scope="col" className="px-2.5 py-5 text-left font-semibold">Failure Type</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="border-l border-black/10 px-2 py-5 font-semibold leading-snug">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-black/10 transition-colors hover:bg-[#f7f7f5]">
                <th scope="row" className="whitespace-nowrap px-2.5 py-4 text-left font-semibold">
                  <Link href={r.href} className="hover:text-[#2f7d55]">
                    {r.name}
                  </Link>
                </th>
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap border-l border-black/10 px-2 py-4 text-center">
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function WhyTrust({ trust }) {
  return (
    <Card title={trust.title} className="order-3 md:order-2 2xl:order-3">
      <ul className="flex flex-1 flex-col divide-y divide-black/10 px-4 xl:px-5">
        {trust.items.map((t) => (
          <li key={t.title} className="flex items-center gap-3.5 py-3 xl:items-start xl:gap-5 xl:py-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0e2b20] text-[#d4a54c] xl:h-[58px] xl:w-[58px]">
              <GuideIcon name={t.icon} className="h-6 w-6 xl:h-8 xl:w-8" />
            </span>
            <span className="min-w-0">
              <span className="block text-[14.5px] font-semibold uppercase leading-snug tracking-[0.01em] text-[#141414] xl:text-[15px]">{t.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-[#4a4a4a] xl:mt-1.5 xl:text-[12.5px] xl:leading-[1.6]">{t.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function HomeDiagnose({ data }) {
  const [l1, l2, l3] = data.h1.split("|");

  return (
    <section className="relative overflow-hidden text-[#141414]" style={{ background: BG }}>
      {/* tablet / desktop: Defender photo top right, fading into the page on the left
          (phones get their own photo next to the intro text, never behind it) */}
      <div className="absolute right-0 top-0 hidden h-[420px] w-[62%] xl:block" aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[62%_50%]" sizes="62vw" />
        <div className="absolute inset-0 bg-linear-to-r from-[#f5f5f3] via-[#f5f5f3]/45 via-35% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#f5f5f3] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 pb-10 pt-8 sm:px-6 lg:px-12 lg:pb-16 lg:pt-14">
        <div className="px-1 sm:px-0 xl:min-h-[330px]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0e2b20] lg:text-[14px]">{data.eyebrow}</p>
          <span className="mt-2 block h-[2px] w-8 bg-[#c9963f] lg:w-9" />

          <h2 className={`${serif.className} mt-3 whitespace-nowrap text-[clamp(22px,7vw,54px)] leading-[1.1] tracking-[-0.01em] text-[#141414]`}>
            {l1}
            <br />
            {l2} <span className="text-[#1f5c3d]">{l3}</span>
          </h2>

          <div className="relative mt-3 sm:min-h-[40vw] lg:mt-5 xl:min-h-0">
            {/* phone photo: a background layer behind the section (no box), bleeding off the right edge and
                fading into the page on its left/top/bottom - positioned beside the paragraph so no text
                ever sits on the car */}
            <div className="pointer-events-none absolute -right-6 top-1/2 aspect-[510/382] w-[53%] -translate-y-1/2 sm:-right-10 sm:top-0 sm:w-[44%] sm:translate-y-0 lg:-right-14 xl:hidden" aria-hidden="true">
              <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover" sizes="60vw" />
              <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-[#f5f5f3] to-transparent" />
              <div className="absolute inset-x-0 top-0 h-1/5 bg-linear-to-b from-[#f5f5f3] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-t from-[#f5f5f3] to-transparent" />
            </div>
            <p className="relative w-[43.5%] text-[13px] leading-[1.5] text-[#2a2a2a] sm:w-[44%] sm:text-[16px] xl:w-auto xl:max-w-[560px] xl:text-[17px] xl:leading-[1.6]">
              {data.subhead}
            </p>
          </div>
        </div>

        {/* trust stats - mobile / tablet only, as in the mobile reference */}
        <div className="relative mt-5 grid grid-cols-4 rounded-xl bg-linear-to-b from-[#143a2a] to-[#0b2219] px-1 py-4 shadow-[0_16px_30px_-14px_rgba(0,0,0,0.6)] sm:py-5 xl:hidden">
          {data.stats.map((s, i) => (
            <div key={s.text} className={`flex flex-col items-center px-1.5 text-center ${i > 0 ? "border-l border-white/20" : ""}`}>
              <span className="text-[#d4a54c]">
                <GuideIcon name={s.icon} className="h-[30px] w-[30px] sm:h-9 sm:w-9" />
              </span>
              <span className="mt-2 text-[12.5px] leading-[1.3] text-white sm:text-[14px]">{s.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid items-stretch gap-4 md:grid-cols-2 xl:mt-0 2xl:grid-cols-[342fr_646fr_405fr] 2xl:gap-5">
          <HowItWorks steps={data.steps} />
          <CostTable costs={data.costs} />
          <WhyTrust trust={data.trust} />
        </div>
      </div>
    </section>
  );
}
