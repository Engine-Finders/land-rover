import Image from "next/image";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { serif } from "@/lib/guideFonts";

const TP_GREEN = "#00b67a";

function Stat({ s }) {
  return (
    <li className="flex flex-col items-center rounded-lg border border-black/[0.06] bg-white px-1.5 pb-4 pt-4 text-center shadow-[0_6px_18px_-14px_rgba(0,0,0,0.35)] sm:px-3 lg:rounded-none lg:border-0 lg:border-l lg:border-black/10 lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none lg:first:border-l-0">
      <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#e9efe9] text-[#0e2b20] sm:h-14 sm:w-14 lg:h-[62px] lg:w-[62px]">
        <GuideIcon name={s.icon} className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
      </span>
      <span className="mt-3 flex min-h-[64px] flex-col justify-center sm:min-h-[70px] lg:min-h-0">
        {s.value ? <span className="block text-[17px] font-semibold leading-tight text-[#0e2b20] sm:text-[20px] lg:text-[22px]">{s.value}</span> : null}
        <span className="mt-1 block text-[12px] leading-snug text-[#1f1f1f] sm:text-[14px] lg:text-[15px]">{s.label}</span>
      </span>
    </li>
  );
}

// shared layout for the two action cards: icon disc | divider | eyebrow + title | arrow
function ActionCard({ dark, icon, eyebrow, title, href, label }) {
  const Tag = href.startsWith("#") ? QuoteLink : "a";
  return (
    <Tag
      href={href}
      aria-label={label}
      className={`group flex items-center gap-3.5 rounded-lg px-4 py-5 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-0.5 sm:gap-6 sm:px-7 sm:py-7 lg:px-9 ${
        dark ? "bg-linear-to-br from-[#0f3a28] via-[#0c2a1e] to-[#0a2018] text-white" : "border border-black/[0.08] bg-white text-[#141414]"
      }`}
    >
      <span
        className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full sm:h-[86px] sm:w-[86px] lg:h-[110px] lg:w-[110px] ${
          dark ? "border border-[#c9963f]/45 text-[#e0a83a]" : "bg-[#e9efe9] text-[#0e2b20]"
        }`}
      >
        <GuideIcon name={icon} className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
      </span>
      <span className={`self-stretch border-l ${dark ? "border-white/15" : "border-black/10"}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className={`block text-[11.5px] font-medium uppercase tracking-[0.08em] sm:text-[13px] ${dark ? "text-[#e0a83a]" : "text-[#0e2b20]"}`}>{eyebrow}</span>
        <span className={`mt-1.5 block h-px w-6 ${dark ? "bg-[#e0a83a]/70" : "bg-[#c9963f]"}`} />
        <span className={`${serif.className} mt-2 block text-[21px] leading-[1.18] sm:text-[27px] lg:text-[30px]`}>{title}</span>
      </span>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform group-hover:translate-x-0.5 sm:h-14 sm:w-14 lg:h-[60px] lg:w-[60px] ${
          dark ? "border-[#e0a83a] text-[#e0a83a]" : "border-[#0e2b20] text-[#0e2b20]"
        }`}
      >
        <Arrow className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
    </Tag>
  );
}

function Stars() {
  return (
    <span className="flex gap-1" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10 lg:h-[42px] lg:w-[42px] 2xl:h-[50px] 2xl:w-[50px]" style={{ background: TP_GREEN }}>
          <GuideIcon name="star-solid" className="h-[70%] w-[70%] text-white" />
        </span>
      ))}
    </span>
  );
}

function Trustpilot({ tp }) {
  return (
    <div className="rounded-lg border border-black/[0.07] bg-white px-4 py-5 shadow-[0_8px_22px_-16px_rgba(0,0,0,0.35)] sm:px-8 xl:flex xl:items-center xl:gap-0 xl:bg-[#f2f3f1] xl:px-10 xl:py-7 2xl:px-14 2xl:py-8">
      <div className="flex items-center justify-between gap-3 xl:contents">
        <span className="flex items-center gap-2 text-[23px] font-semibold tracking-[-0.01em] text-[#191919] sm:text-[28px] xl:shrink-0 xl:border-r xl:border-black/10 xl:pr-8 xl:text-[30px] 2xl:pr-14 2xl:text-[36px]">
          <span style={{ color: TP_GREEN }}>
            <GuideIcon name="star-solid" className="h-7 w-7 sm:h-9 sm:w-9 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12" />
          </span>
          Trustpilot
        </span>
        <span className="xl:shrink-0 xl:px-8 2xl:px-14">
          <Stars />
        </span>
      </div>
      <div className="mt-5 grid grid-cols-[40%_60%] items-center border-t border-black/[0.06] pt-5 xl:contents">
        <div className="border-r border-black/10 pr-3 text-center xl:shrink-0 xl:whitespace-nowrap xl:border-r-0 xl:pr-8 xl:text-left 2xl:pr-14">
          <p className="text-[22px] font-medium leading-tight text-[#141414] sm:text-[30px] xl:text-[28px] 2xl:text-[30px]">{tp.rating}</p>
          <p className="mt-1 text-[12.5px] text-[#2a2a2a] sm:text-[16px] 2xl:text-[18px]">{tp.reviews}</p>
        </div>
        <div className="flex gap-2.5 pl-4 xl:ml-auto xl:max-w-[340px] xl:border-l xl:border-black/10 xl:pl-8 2xl:pl-12">
          <GuideIcon name="quote" className="mt-1 h-5 w-7 shrink-0 text-[#1f6b45] sm:h-6 sm:w-8" />
          <p className={`${serif.className} text-[15px] italic leading-[1.45] text-[#2a2a2a] sm:text-[18px]`}>{tp.quote}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFinal({ data }) {
  const [d1, d2] = data.h2.split("|");
  const [m1, m2, m3, m4] = data.mobileH2.split("|");
  const [s1, s2] = data.subhead.split("|");

  return (
    <section lang="en-GB" className="relative overflow-hidden bg-[#f7f7f5] text-[#141414]">
      {/* desktop: Range Rover on the right half, fading into the page on its left and bottom edges */}
      <div
        className="absolute right-0 top-0 hidden aspect-[764/490] w-[52%] [mask-image:linear-gradient(to_right,transparent,#000_20%),linear-gradient(to_bottom,#000_78%,transparent)] [mask-composite:intersect] lg:block"
        aria-hidden="true"
      >
        <Image src={data.image} alt="" fill quality={90} className="object-cover" sizes="52vw" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 pb-10 pt-8 sm:px-6 lg:px-12 lg:pb-14 lg:pt-16 xl:px-[78px]">
        {/* phones / tablets: heading on the left, the car beside it on the right (car never under text) */}
        <div className="relative lg:hidden">
          <div
            className="pointer-events-none absolute -right-3 -top-2 aspect-[660/524] w-[58%] [mask-image:linear-gradient(to_right,transparent,#000_11%),linear-gradient(to_bottom,#000_80%,transparent)] [mask-composite:intersect] sm:-right-6"
            aria-hidden="true"
          >
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover" sizes="58vw" />
          </div>
          <div className="relative w-[44%] px-1 sm:px-0">
            <h2 className={`${serif.className} text-[clamp(23px,6.3vw,46px)] leading-[1.1] tracking-[-0.01em]`}>
              {m1}
              <br />
              {m2}
              <br />
              <span className="text-[#0e2b20]">
                {m3}
                <br />
                {m4}
              </span>
            </h2>
            <p className="mt-3 text-[13px] leading-[1.55] text-[#1f1f1f] sm:text-[17px]">
              {s1}
              <br />
              {s2}
            </p>
          </div>
        </div>

        {/* desktop heading */}
        <div className="hidden lg:block lg:max-w-[50%]">
          <h2 className={`${serif.className} text-[clamp(40px,4.3vw,66px)] leading-[1.08] tracking-[-0.01em]`}>
            {d1}
            <br />
            <span className="text-[#0e2b20]">{d2}</span>
          </h2>
          <p className="mt-5 text-[19px] text-[#1f1f1f]">
            {s1} {s2}
          </p>
        </div>

        <ul className="relative mt-6 grid grid-cols-4 gap-2 sm:gap-3 lg:mt-10 lg:max-w-[52%] lg:gap-0">
          {data.stats.map((s) => (
            <Stat key={s.label} s={s} />
          ))}
        </ul>

        <div className="relative mt-6 grid gap-3.5 lg:mt-10 lg:grid-cols-2 lg:gap-7">
          <ActionCard dark icon="headset" eyebrow={data.guidance.eyebrow} title={data.guidance.title} href={data.guidance.href} label={data.guidance.title} />
          <ActionCard
            icon="phone"
            eyebrow={data.call.eyebrow}
            title={data.call.title}
            href={data.call.href}
            label={`${data.call.title} – call ${data.call.phone}`}
          />
        </div>

        <div className="relative mt-4 lg:mt-7">
          <Trustpilot tp={data.trustpilot} />
        </div>
      </div>
    </section>
  );
}
