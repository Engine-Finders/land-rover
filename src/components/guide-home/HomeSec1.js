import Image from "next/image";
import Link from "next/link";
import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { CONTAINER, H1, H4, H6, BODY, BODY_SM, NUM, SMALL, LABEL, STAT } from "@/lib/typeScale";

// Follows the site theme (navbar day / night button). Day: white page, the Defender photo framed as a
// rounded card beside the headline (desktop) or under the CTA (phones). Night: the photo bleeds off the
// right edge and feathers into the green page through CSS masks (no colour overlays, so it blends with
// any background).

// night theme: feather the desktop photo's left / top / bottom edges into the page
const FADE_DESKTOP =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.65)_25%,#000_46%),linear-gradient(to_bottom,rgba(0,0,0,0.3),#000_10%,#000_66%,transparent)] [mask-composite:intersect]";
// night theme: feather the phone photo's top and side edges
const FADE_MOBILE =
  "dark:[mask-image:linear-gradient(to_bottom,transparent,#000_25%),linear-gradient(to_right,rgba(0,0,0,0.3),#000_6%,#000_94%,rgba(0,0,0,0.3))] dark:[mask-composite:intersect]";

export default function HomeSec1({ hero }) {
  const [line1, line2, line3] = hero.h1.split("|");
  const [h2a, h2b] = hero.trust.h2.split("|");
  const [mh2a, mh2b] = hero.trust.mobileH2.split("|");

  return (
    <section id="find-my-landrover" className="relative z-10 overflow-hidden bg-lr-page text-lr-head">
      {/* ===== mobile + tablet ===== */}
      <div className="lg:hidden">
        <div className="relative">
          {/* night theme: stormy sky behind the headline - the hero photo's cloud band, blurred and dimmed */}
          <div
            className="absolute inset-x-0 top-0 hidden h-[620px] dark:block"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(60% 30% at 15% 20%, rgba(120,128,124,0.16), transparent 70%), radial-gradient(55% 28% at 85% 35%, rgba(110,118,114,0.14), transparent 70%), radial-gradient(70% 25% at 50% 75%, rgba(150,140,120,0.1), transparent 70%)",
            }}
          />

          <div className={`${CONTAINER} relative z-10 pt-6 text-center`}>
            <div className="mx-auto max-w-160">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-lr-gold-line/70" />
              <p className={`${LABEL} whitespace-nowrap text-lr-gold`}>{hero.eyebrow}</p>
              <span className="h-px flex-1 bg-linear-to-l from-transparent to-lr-gold-line/70" />
            </div>

            <h1 className={`${H1} mt-3 text-balance`}>
              <span className="text-lr-head sm:block">{line1}</span>{" "}
              <span className="text-lr-head sm:block">{line2}</span>
              <span className="block text-lr-green">{line3}</span>
            </h1>

            <p className={`${BODY} mx-auto mt-3 max-w-120 text-lr-body`}>{hero.subhead}</p>

            {/* stats card */}
            <div className="mt-5 grid grid-cols-4 rounded-[20px] border border-lr-line bg-lr-card/80 px-1 py-3.5 shadow-[0_10px_40px_-10px_var(--lr-shadow)] backdrop-blur-md dark:bg-lr-card/50">
              {hero.stats.map((s, i) => (
                <div key={s.value} className={`flex flex-col items-center px-1 ${i > 0 ? "border-l border-lr-line" : ""}`}>
                  <GuideIcon name={s.icon} className="h-7 w-7 text-lr-green" />
                  <p className={`${NUM} mt-2 text-lr-head`}>{s.value}</p>
                  <p className={`${SMALL} mt-0.5 text-lr-body`}>
                    {s.icon === "book" ? (
                      <>
                        {s.label}
                        <br />
                        {s.detail}
                      </>
                    ) : (
                      s.label
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={hero.cta.href}
              className="relative mx-auto mt-6 flex w-[82%] max-w-100 items-center justify-center gap-3 rounded-xl border border-lr-brand bg-lr-brand py-4 text-[17px] font-semibold uppercase tracking-[0.06em] text-lr-on-brand shadow-[0_12px_28px_-12px_var(--lr-shadow),inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:bg-lr-brand-hover dark:border-lr-green/45 dark:shadow-[0_0_28px_-4px_rgba(60,190,125,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              {hero.cta.label}
              <Arrow />
              {/* night theme: bottom edge light */}
              <span className="pointer-events-none absolute -bottom-px left-1/2 hidden h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-lr-green to-transparent dark:block" />
            </Link>
            </div>
          </div>

          {/* Defender photo: a framed card on the day theme, full-bleed and feathered into the page at night */}
          <div className="relative mt-7 w-full px-4 md:px-8 dark:mt-1 dark:px-0">
            <div
              className={`relative mx-auto aspect-16/11 w-full max-w-200 overflow-hidden rounded-2xl border border-lr-line shadow-[0_20px_44px_-30px_var(--lr-shadow)] sm:aspect-887/464 dark:rounded-none dark:border-0 dark:shadow-none ${FADE_MOBILE}`}
            >
              <Image src={hero.mobileImage} alt={hero.imageAlt} fill priority quality={90} className="object-cover object-[62%_55%]" sizes="(max-width: 800px) 100vw, 800px" />
            </div>
          </div>

          {/* trust card, overlapping the bottom of the photo */}
          <div className="relative mx-auto -mt-10 max-w-160 px-0 pb-8 sm:px-4">
            <div className="relative rounded-t-[26px] border-t border-lr-line bg-linear-to-b from-lr-card/95 to-lr-page px-3 pb-2 pt-10 shadow-[0_-20px_40px_-20px_var(--lr-shadow)] backdrop-blur-md sm:rounded-[26px] sm:border">
              {/* logo tab */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[60%]">
                <div className="flex h-12 w-30 items-center justify-center rounded-t-[22px] border border-b-0 border-lr-line bg-lr-card">
                  <LandRoverLogo crop className="h-8 w-[58px]" />
                </div>
              </div>

              <h2 className={`${H4} text-center text-lr-head`}>
                {mh2a} <span className="text-lr-green">{mh2b}</span>
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {hero.trust.items.map((t) => (
                  <div key={t.title} className="flex items-center gap-2.5 rounded-2xl border border-lr-line bg-lr-panel/60 p-2.5 sm:gap-3 sm:p-3">
                    <span className="flex h-11 w-11 shrink-0 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-lr-green/35 bg-lr-chip text-lr-green dark:bg-[radial-gradient(circle_at_50%_35%,#1d4a35,#0d2219)] dark:shadow-[0_0_14px_-2px_rgba(70,180,120,0.35)]">
                      <GuideIcon name={t.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <p className={`${SMALL} text-lr-body`}>
                      <span className="font-semibold text-lr-head">{t.mobileTitle}</span>
                      {t.mobileText && (
                        <>
                          {" "}
                          <span className="block text-lr-body">{t.mobileText}</span>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== desktop ===== */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* day theme: the photo as a framed card beside the headline */}
          <div className="pointer-events-none absolute inset-x-0 top-0 dark:hidden" aria-hidden="true">
            <div className={`${CONTAINER} relative`}>
              <div className="absolute right-8 top-12 aspect-[3/2] w-[40%] overflow-hidden rounded-2xl border border-lr-line shadow-[0_30px_60px_-34px_var(--lr-shadow)] xl:w-[47%]">
                <Image src={hero.image} alt="" fill priority quality={90} className="object-cover object-center" sizes="66vw" />
              </div>
            </div>
          </div>
          {/* night theme: the photo anchored right, feathered into the page */}
          <div className={`absolute right-0 top-0 hidden h-[620px] w-[66%] dark:block xl:h-[640px] ${FADE_DESKTOP}`}>
            <Image src={hero.image} alt={hero.imageAlt} fill priority quality={90} className="object-cover object-center" sizes="66vw" />
          </div>

          <div className={`${CONTAINER} relative pt-12`}>
            <div className="max-w-[660px]">
              <p className={`${LABEL} text-lr-gold`}>{hero.eyebrow}</p>
              <div className="mt-2 flex h-px w-[370px]">
                <span className="w-[120px] bg-lr-gold-line" />
                <span className="w-[50px] bg-lr-head/70" />
                <span className="flex-1 bg-lr-line-strong" />
              </div>

              <h1 className={`${H1} mt-6 whitespace-nowrap text-lr-head`}>
                {line1.replace(" Trusted", "")}
                <br />
                Trusted {line2.split(" & ")[0]}{" "}&amp;
                <br />
                {line2.split(" & ")[1]}
                <br />
                <span className="text-lr-green">{line3}</span>
              </h1>

              <p className={`${BODY} mt-5 max-w-[440px] text-lr-body`}>{hero.subhead}</p>

              <div className="mt-6 flex items-center gap-10">
                <Link
                  href={hero.cta.href}
                  className="inline-flex items-center gap-4 rounded-[3px] border border-lr-brand bg-lr-brand px-7 py-4 text-[17px] font-semibold uppercase tracking-[0.04em] text-lr-on-brand transition-colors hover:bg-lr-brand-hover dark:border-lr-green/40"
                >
                  {hero.cta.label}
                  <Arrow className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <GuideIcon name="shield" className="h-9 w-9 text-lr-green" />
                  <p className={`${SMALL} text-lr-body`}>
                    <span className="block font-medium text-lr-head">{hero.independent.title}</span>
                    {hero.independent.text}
                  </p>
                </div>
              </div>
            </div>

            {/* stats bar */}
            <div className="relative mt-7 grid grid-cols-4 rounded-md border border-lr-line bg-lr-card/90 py-5 shadow-[0_24px_60px_-34px_var(--lr-shadow)] backdrop-blur-sm dark:bg-lr-card/80">
              {hero.stats.map((s, i) => (
                <div key={s.value} className={`flex items-center justify-center gap-5 px-4 ${i > 0 ? "border-l border-lr-line" : ""}`}>
                  <span className="shrink-0 text-lr-gold">
                    <GuideIcon name={s.icon} className="h-12 w-12" />
                  </span>
                  <div>
                    <p className={`${STAT} text-lr-head`}>{s.value}</p>
                    <p className={`${BODY_SM} mt-1.5 leading-snug text-lr-body`}>{s.label}</p>
                    <p className={`${BODY_SM} leading-snug text-lr-body`}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* trust row */}
            <div className="pb-14 pt-8 text-center">
              <p className={`${LABEL} text-lr-gold`}>{hero.trust.eyebrow}</p>
              <div className="mt-1 flex items-center justify-center gap-5">
                <span className="h-px w-24 bg-linear-to-r from-transparent to-lr-gold-line" />
                <h2 className={`${H4} text-lr-head`}>
                  {h2a} <span className="text-lr-green">{h2b}</span>
                </h2>
                <span className="h-px w-24 bg-linear-to-l from-transparent to-lr-gold-line" />
              </div>

              <div className="mt-6 grid grid-cols-4">
                {hero.trust.items.map((t, i) => (
                  <div key={t.title} className={`flex flex-col items-center px-8 ${i > 0 ? "border-l border-lr-line" : ""}`}>
                    <span className="flex h-15 w-15 items-center justify-center rounded-full border border-lr-gold-line/55 bg-lr-chip text-lr-gold">
                      <GuideIcon name={t.icon} className="h-7 w-7" />
                    </span>
                    <h3 className={`${H6} mt-4 max-w-[260px] text-lr-head`}>{t.title}</h3>
                    <p className={`${BODY_SM} mt-2 max-w-[270px] text-lr-muted`}>{t.text}</p>
                    <span className="mt-5 h-px w-8 bg-lr-gold-line" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
