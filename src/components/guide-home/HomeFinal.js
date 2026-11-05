import Image from "next/image";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { serif } from "@/lib/guideFonts";
import { BODY, CONTAINER, H2, H5, ICON_MD, ICON_SM, ICON_XL, LABEL, NUM, SMALL, STAT } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens; Trustpilot's own green
// stays as their brand colour. The Range Rover photo fades into the page through CSS masks; at night
// the pale sky and the white fade it was shot with are masked away too (and the photo dimmed a touch).
const TP_GREEN = "#00b67a";

// desktop photo: left + bottom edges by day; night also fades the pale sky at the top
const FADE_DESKTOP =
  "[mask-image:linear-gradient(to_right,transparent,#000_20%),linear-gradient(to_bottom,#000_78%,transparent)] [mask-composite:intersect] dark:[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.6)_16%,#000_30%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6)_18%,#000_32%,#000_74%,transparent)]";
// phone / tablet photo: same idea
const FADE_MOBILE =
  "[mask-image:linear-gradient(to_right,transparent,#000_11%),linear-gradient(to_bottom,#000_80%,transparent)] [mask-composite:intersect] dark:[mask-image:linear-gradient(to_right,transparent,#000_20%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6)_18%,#000_32%,#000_76%,transparent)]";

function Stat({ s }) {
  return (
    <li className="flex flex-col items-center rounded-lg border border-lr-line bg-lr-card px-1.5 pb-4 pt-4 text-center shadow-[0_6px_18px_-14px_var(--lr-shadow)] sm:px-3 lg:rounded-none lg:border-0 lg:border-l lg:border-lr-line lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none lg:first:border-l-0">
      <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lr-chip text-lr-ink sm:h-14 sm:w-14 lg:h-[62px] lg:w-[62px]">
        <GuideIcon name={s.icon} className={ICON_MD} />
      </span>
      <span className="mt-3 flex min-h-[64px] flex-col justify-center sm:min-h-[70px] lg:min-h-0">
        {s.value ? <span className={`${NUM} block text-lr-ink`}>{s.value}</span> : null}
        <span className={`${SMALL} mt-1 block text-lr-body`}>{s.label}</span>
      </span>
    </li>
  );
}

// shared layout for the two action cards: icon disc | divider | eyebrow + title | arrow. `dark` is the
// emphasised card (a design variant, not the theme): brand green by day, a deep chip green with a gold
// hairline at night; the other card is a plain card in either theme.
function ActionCard({ dark, icon, eyebrow, title, href, label }) {
  const Tag = href.startsWith("#") ? QuoteLink : "a";
  return (
    <Tag
      href={href}
      aria-label={label}
      className={`group flex items-center gap-3.5 rounded-lg px-4 py-5 font-normal shadow-[0_14px_30px_-18px_var(--lr-shadow)] transition-transform hover:-translate-y-0.5 sm:gap-6 sm:px-7 sm:py-7 lg:px-9 ${
        dark
          ? "lr-on-brand bg-linear-to-br from-lr-brand to-lr-brand-hover text-lr-on-brand dark:from-lr-chip dark:to-lr-card dark:ring-1 dark:ring-inset dark:ring-lr-gold-line/35"
          : "border border-lr-line bg-lr-card text-lr-head"
      }`}
    >
      <span
        className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full sm:h-[86px] sm:w-[86px] lg:h-[110px] lg:w-[110px] ${
          dark ? "border border-lr-gold-line/45 text-lr-gold-line" : "bg-lr-chip text-lr-ink"
        }`}
      >
        <GuideIcon name={icon} className={ICON_XL} />
      </span>
      <span className={`self-stretch border-l ${dark ? "border-lr-on-brand/15" : "border-lr-line"}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className={`${LABEL} block ${dark ? "text-lr-gold-line" : "text-lr-ink"}`}>{eyebrow}</span>
        <span className={`mt-1.5 block h-px w-6 ${dark ? "bg-lr-gold-line/70" : "bg-lr-gold-line"}`} />
        <span className={`${H5} mt-2 block`}>{title}</span>
      </span>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform group-hover:translate-x-0.5 sm:h-14 sm:w-14 lg:h-[60px] lg:w-[60px] ${
          dark ? "border-lr-gold-line text-lr-gold-line" : "border-lr-ink text-lr-ink"
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
        <span key={i} className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10 lg:h-[42px] lg:w-[42px]" style={{ background: TP_GREEN }}>
          <GuideIcon name="star-solid" className="h-[70%] w-[70%] text-white" />
        </span>
      ))}
    </span>
  );
}

function Trustpilot({ tp }) {
  return (
    <div className="rounded-lg border border-lr-line bg-lr-card px-4 py-5 shadow-[0_8px_22px_-16px_var(--lr-shadow)] sm:px-8 xl:flex xl:items-center xl:gap-0 xl:bg-lr-panel xl:px-10 xl:py-7">
      <div className="flex items-center justify-between gap-3 xl:contents">
        <span className="flex items-center gap-2 text-[23px] font-semibold tracking-[-0.01em] text-lr-head sm:text-[28px] xl:shrink-0 xl:border-r xl:border-lr-line-strong xl:pr-8 xl:text-[30px]">
          <span style={{ color: TP_GREEN }}>
            <GuideIcon name="star-solid" className="h-7 w-7 sm:h-9 sm:w-9 xl:h-10 xl:w-10" />
          </span>
          Trustpilot
        </span>
        <span className="xl:shrink-0 xl:px-8">
          <Stars />
        </span>
      </div>
      <div className="mt-5 grid grid-cols-[48%_52%] items-center border-t border-lr-line pt-5 sm:grid-cols-[40%_60%] xl:contents">
        <div className="border-r border-lr-line pr-2 text-center sm:pr-3 xl:shrink-0 xl:whitespace-nowrap xl:border-r-0 xl:pr-8 xl:text-left">
          <p className={`${STAT} whitespace-nowrap tracking-[-0.01em] text-lr-head`}>{tp.rating}</p>
          <p className={`${SMALL} mt-1.5 text-lr-body`}>{tp.reviews}</p>
        </div>
        <div className="flex gap-2.5 pl-4 xl:ml-auto xl:max-w-[380px] xl:border-l xl:border-lr-line-strong xl:pl-8">
          <GuideIcon name="quote" className={`mt-1 ${ICON_SM}`} />
          <p className={`${serif.className} ${BODY} italic text-lr-body`}>{tp.quote}</p>
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
    <section lang="en-GB" className="relative overflow-hidden bg-lr-page text-lr-head">
      {/* desktop: Range Rover on the right half, fading into the page on its left and bottom edges */}
      <div className={`absolute right-0 top-0 hidden aspect-[764/490] w-[52%] lg:block ${FADE_DESKTOP}`} aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover dark:brightness-[0.85]" sizes="52vw" />
      </div>

      <div className={`${CONTAINER} relative pb-10 pt-8 lg:pb-14 lg:pt-16`}>
        {/* tablets: heading on the left, the car beside it on the right (car never under text). Phones: the
            heading needs the full width at its size, so the car follows as a band bleeding off the right edge */}
        <div className="relative lg:hidden">
          <div className="relative z-10 sm:w-[44%]">
            <h2 className={H2}>
              {m1}
              <br className="hidden sm:block" />{" "}
              {m2}
              <br />
              <span className="text-lr-ink">
                {m3}
                <br className="hidden sm:block" />{" "}
                {m4}
              </span>
            </h2>
            <p className={`${BODY} mt-3 text-lr-body`}>
              {s1}
              <br />
              {s2}
            </p>
          </div>
          <div
            className={`pointer-events-none relative -right-4 -mt-6 ml-auto aspect-[660/524] w-[78%] sm:absolute sm:-top-2 sm:mt-0 sm:w-[58%] md:-right-8 ${FADE_MOBILE}`}
            aria-hidden="true"
          >
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover dark:brightness-[0.85]" sizes="(min-width: 640px) 58vw, 78vw" />
          </div>
        </div>

        {/* desktop heading */}
        <div className="hidden lg:block lg:max-w-[52%]">
          <h2 className={H2}>
            {d1}
            <br />
            <span className="text-lr-ink">{d2}</span>
          </h2>
          <p className={`${BODY} mt-5 text-lr-body`}>
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
