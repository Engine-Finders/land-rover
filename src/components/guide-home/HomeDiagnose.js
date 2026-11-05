import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { BODY, BODY_SM, CONTAINER, H2, H6, ICON_LG, ICON_MD, ICON_XS, LABEL, SMALL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens, and the Defender photo
// fades into the page through CSS masks (no colour overlays), so it blends with either background.

// desktop photo: left and bottom edges feathered into the page
const FADE_DESKTOP =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.55)_35%,#000_60%),linear-gradient(to_bottom,transparent,#000_14%,#000_62%,transparent)] [mask-composite:intersect]";
// phone photo: left, top and bottom edges feathered into the page
const FADE_MOBILE =
  "[mask-image:linear-gradient(to_right,transparent,#000_28%),linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)] [mask-composite:intersect]";

// the cost-column icon tones arrive from the JSON as fixed day colours; map them to theme-aware ones
// (blue and orange have no token, so they keep their day colour with a lighter night pair)
const TONES = {
  "text-[#2f7d55]": "text-lr-green",
  "text-[#2f6fb5]": "text-[#2f6fb5] dark:text-[#86b6ea]",
  "text-[#c9963f]": "text-lr-gold",
  "text-[#c8572e]": "text-[#c8572e] dark:text-[#ec8a4f]",
};
const tone = (t) => TONES[t] ?? t;

function Card({ title, className = "", children }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-lr-line bg-lr-card shadow-[0_8px_28px_-14px_var(--lr-shadow)] ${className}`}>
      <h3 className={`${H6} bg-lr-brand px-5 py-3 uppercase tracking-[0.03em] text-lr-on-brand lg:py-3.5`}>{title}</h3>
      {children}
    </div>
  );
}

function HowItWorks({ steps }) {
  return (
    <Card title={steps.title} className="order-1">
      <ol className="flex flex-1 flex-col divide-y divide-lr-line px-4 xl:px-4">
        {steps.items.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3 py-3.5 sm:gap-4 xl:py-5">
            {/* number + icon disc; on wide desktop the number badge overlaps the disc like the reference */}
            <span className="flex shrink-0 items-start gap-3 sm:gap-5 xl:relative xl:gap-0 xl:pl-2">
              <span className={`${SMALL} mt-1.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-lr-brand font-semibold text-lr-on-brand xl:absolute xl:-left-1 xl:-top-1 xl:z-10 xl:mt-0 xl:ring-2 xl:ring-lr-card`}>
                {i + 1}
              </span>
              <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-lr-brand text-lr-gold-line sm:h-16 sm:w-16 xl:ml-5 dark:bg-lr-chip dark:text-lr-gold">
                <GuideIcon name={s.icon} className={ICON_MD} />
              </span>
            </span>
            <span className="min-w-0 pt-1">
              <span className={`${H6} block text-lr-head`}>{s.title}</span>
              <span className={`${BODY_SM} mt-1 block text-lr-body`}>{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="px-4 pb-4 pt-1 xl:pb-6">
        <QuoteLink
          href={steps.cta.href}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-lr-brand py-3.5 text-[15.5px] font-semibold uppercase tracking-[0.04em] text-lr-on-brand shadow-[0_8px_18px_-8px_var(--lr-shadow)] transition-colors hover:bg-lr-brand-hover xl:py-4"
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
      <span className={tone(col.tone)}>
        <GuideIcon name={col.icon} className={ICON_XS} />
      </span>
      <span className={`${SMALL} text-lr-head`}>{value}</span>
    </span>
  );
}

function CostTable({ costs }) {
  const { columns, rows } = costs;
  return (
    <Card title={costs.title} className="order-2 md:order-3 md:col-span-2">
      {/* mobile: accordion rows */}
      <ul className="divide-y divide-lr-line px-2 md:hidden">
        {rows.map((r) => (
          <li key={r.name}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 py-2.5 pl-1 pr-1 [&::-webkit-details-marker]:hidden">
                <span className="text-lr-head transition-transform group-open:rotate-180">
                  <GuideIcon name="chevron-down" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`${BODY_SM} block font-semibold text-lr-head`}>{r.name}</span>
                  <span className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 min-[480px]:grid-cols-4">
                    {columns.map((c) => (
                      <Value key={c.key} col={c} value={r[c.key]} />
                    ))}
                  </span>
                </span>
                <span className="text-lr-muted">
                  <GuideIcon name="chevron-right" className="h-4 w-4" />
                </span>
              </summary>
              <div className={`${BODY_SM} pb-3 pl-7 pr-2 text-lr-body`}>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {columns.map((c) => (
                    <div key={c.key}>
                      <dt className={`${LABEL} text-lr-muted`}>{c.label}</dt>
                      <dd className="font-medium text-lr-head">{r[c.key]}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={r.href} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-lr-ink underline-offset-2 hover:underline">
                  Read the engine guide <Arrow className="h-4 w-4" />
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ul>
      {/* legend */}
      <div className="flex flex-wrap justify-around gap-x-4 gap-y-2 border-t border-lr-line px-3 py-3 md:hidden">
        {columns.map((c) => (
          <span key={c.key} className={`${SMALL} flex items-center gap-1.5 text-lr-body`}>
            <span className={tone(c.tone)}>
              <GuideIcon name={c.icon} className={ICON_XS} />
            </span>
            {c.label}
          </span>
        ))}
      </div>

      {/* tablet / desktop: real table */}
      <div className="hidden flex-1 p-3 md:block">
        <table className={`${BODY_SM} h-full w-full border-collapse border border-lr-line text-lr-head`}>
          <thead>
            <tr className="bg-lr-panel">
              <th scope="col" className="px-2.5 py-4 text-left font-semibold">Failure Type</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="border-l border-lr-line px-2 py-4 font-semibold leading-snug">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-lr-line transition-colors hover:bg-lr-panel/60">
                <th scope="row" className="whitespace-nowrap px-2.5 py-3.5 text-left font-semibold">
                  <Link href={r.href} className="font-semibold hover:text-lr-green">
                    {r.name}
                  </Link>
                </th>
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap border-l border-lr-line px-2 py-3.5 text-center">
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
    <Card title={trust.title} className="order-3 md:order-2">
      <ul className="flex flex-1 flex-col divide-y divide-lr-line px-4 xl:px-5">
        {trust.items.map((t) => (
          <li key={t.title} className="flex items-center gap-3.5 py-3 xl:items-start xl:gap-5 xl:py-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-lr-brand text-lr-gold-line xl:h-[58px] xl:w-[58px] dark:bg-lr-chip dark:text-lr-gold">
              <GuideIcon name={t.icon} className={ICON_MD} />
            </span>
            <span className="min-w-0">
              <span className={`${H6} block uppercase tracking-[0.01em] text-lr-head`}>{t.title}</span>
              <span className={`${BODY_SM} mt-0.5 block text-lr-body xl:mt-1.5`}>{t.text}</span>
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
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      {/* tablet / desktop: Defender photo top right, fading into the page on the left
          (phones get their own photo next to the intro text, never behind it) */}
      <div className={`absolute right-0 top-0 hidden h-[420px] w-[62%] xl:block ${FADE_DESKTOP}`} aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[62%_50%] dark:brightness-[0.82]" sizes="62vw" />
      </div>

      <div className={`${CONTAINER} relative pb-10 pt-8 lg:pb-16 lg:pt-14`}>
        <div className="xl:min-h-[330px]">
          <p className={`${LABEL} text-lr-ink`}>{data.eyebrow}</p>
          <span className="mt-2 block h-[2px] w-8 bg-lr-gold-line lg:w-9" />

          <h2 className={`${H2} mt-3 text-balance text-lr-head`}>
            {l1}
            <br />
            {l2} <span className="text-lr-green">{l3}</span>
          </h2>

          <div className="relative mt-3 sm:min-h-[40vw] lg:mt-5 xl:min-h-0">
            {/* phone photo: a background layer behind the section (no box), bleeding off the right edge and
                fading into the page on its left/top/bottom - positioned beside the paragraph so no text
                ever sits on the car */}
            <div className={`pointer-events-none absolute -right-6 top-1/2 aspect-[510/382] w-[53%] -translate-y-1/2 sm:top-0 sm:w-[44%] sm:translate-y-0 md:-right-10 xl:hidden ${FADE_MOBILE}`} aria-hidden="true">
              <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover dark:brightness-[0.82]" sizes="60vw" />
            </div>
            <p className={`${BODY} relative w-[52%] text-lr-body sm:w-[47%] xl:w-auto xl:max-w-[580px]`}>
              {data.subhead}
            </p>
          </div>
        </div>

        {/* trust stats - mobile / tablet only, as in the mobile reference */}
        <div className="relative mt-5 grid grid-cols-4 rounded-xl border border-lr-line bg-lr-card px-1 py-4 shadow-[0_16px_30px_-14px_var(--lr-shadow)] sm:py-5 xl:hidden">
          {data.stats.map((s, i) => (
            <div key={s.text} className={`flex flex-col items-center px-1.5 text-center ${i > 0 ? "border-l border-lr-line" : ""}`}>
              <span className="text-lr-gold">
                <GuideIcon name={s.icon} className={ICON_LG} />
              </span>
              <span className={`${SMALL} mt-2 text-lr-body`}>{s.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid items-stretch gap-4 md:grid-cols-2 xl:mt-0 xl:gap-5">
          <HowItWorks steps={data.steps} />
          <CostTable costs={data.costs} />
          <WhyTrust trust={data.trust} />
        </div>
      </div>
    </section>
  );
}
