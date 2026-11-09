import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import GroundedCar from "@/components/variant/GroundedCar";
import GuideIcon from "@/components/guide-home/GuideIcon";
import HeroRegCta from "@/components/shared/HeroRegCta";
import { HOME_CTA } from "@/lib/ctaCopy";
import { BODY, BODY_SM, CONTAINER, H1, H4_SERIF, H6, ICON_LG, ICON_MD, ICON_SM, ICON_XL, LABEL, NUM, SMALL, STAT } from "@/lib/typeScale";

// Follows the site theme (navbar day / night button). The hero stands the Defender on a Highland
// loch-side hillside: golden hour on the day theme, a storm at night. The landscape is a CSS
// background picked by theme and screen size, so each visitor downloads only the one they see.
// Desktop: full-bleed behind the band, washed in the page colour behind the headline and fading
// into the page at the bottom. Phones / tablets: a banner under the headline with the car in it.

const CAR = "/home/hero-defender-cut.webp";
// stats whose second line also shows on the phone card ("Vetted JLR / Specialists", "Generation, / Honestly Rated")
const TWO_LINE = ["wrench", "book"];
const BG_DESKTOP = "bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night.webp)]";
const BG_MOBILE = "bg-[url(/home/hero-loch-day-m.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)]";
// the band's height: the car stands on the foreground, its wheels ~78% down
const BAND = "h-[640px] xl:h-[680px] min-[1400px]:h-[700px]";
// page-coloured wash behind the headline column (measured from the container's left edge at any
// width), so the copy reads cleanly while the loch and the car show on the right
const WASH = {
  background:
    "linear-gradient(90deg, var(--lr-page) 0px, color-mix(in srgb, var(--lr-page) 92%, transparent) calc(max(0px, 50vw - 704px) + 500px), color-mix(in srgb, var(--lr-page) 60%, transparent) calc(max(0px, 50vw - 704px) + 720px), transparent calc(max(0px, 50vw - 704px) + 980px))",
};

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

            {/* phones: three lines as in the reference - the size follows the screen width so the longest
                line ("Land Rover & Range Rover") always fits on one line */}
            <h1 className={`${H1} mt-3 text-balance max-sm:text-[min(34px,calc(7.7vw-3px))]! max-sm:leading-[1.12]`}>
              <span className="text-lr-head max-sm:block max-sm:whitespace-nowrap sm:block">{line1}</span>{" "}
              <span className="text-lr-head max-sm:block max-sm:whitespace-nowrap sm:block">{line2}</span>
              <span className="block text-lr-green">{line3}</span>
            </h1>

            <p className={`${BODY} mx-auto mt-3 max-w-120 text-lr-body`}>{hero.subhead}</p>

            {/* stats card */}
            <div className="mt-5 grid grid-cols-4 rounded-[20px] border border-lr-line bg-lr-card/80 px-1 py-3.5 shadow-[0_10px_40px_-10px_var(--lr-shadow)] backdrop-blur-md max-sm:-mx-1 max-sm:mt-4 max-sm:px-0 max-sm:py-3 dark:bg-lr-card/50">
              {hero.stats.map((s, i) => (
                <div key={s.value} className={`flex flex-col items-center px-1 max-sm:px-0.5 ${i > 0 ? "border-l border-lr-line" : ""}`}>
                  <GuideIcon name={s.icon} className={ICON_LG} />
                  <p className={`${NUM} mt-2 text-lr-head max-sm:mt-1.5`}>{s.value}</p>
                  {/* "Vetted JLR / Specialists" and "Generation, / Honestly Rated" keep both lines; each line stays
                      whole on phones, the size following the screen so the widest ("Honestly Rated") fits */}
                  <p className={`${SMALL} mt-0.5 text-lr-body max-sm:text-[min(13px,calc(3.6vw-1.8px))]! max-sm:leading-[1.35]`}>
                    <span className="block max-sm:whitespace-nowrap">{s.label}</span>
                    {TWO_LINE.includes(s.icon) ? <span className="block max-sm:whitespace-nowrap">{s.detail}</span> : null}
                  </p>
                </div>
              ))}
            </div>

            <HeroRegCta
              className="mx-auto mt-6 max-w-[640px] max-sm:mt-4"
              buttonLabel={HOME_CTA.heroButton}
              buttonClassName="rounded-xl border border-lr-brand uppercase tracking-[0.04em] dark:border-lr-green/45"
            />
            </div>
          </div>

          {/* the Defender on the loch-side hillside - top edge feathered into the page */}
          <div className="relative mt-6 w-full max-sm:-mt-5">
            <div className={`relative mx-auto aspect-[4/3] w-full max-w-200 bg-cover bg-bottom sm:aspect-[16/9] ${BG_MOBILE} [mask-image:linear-gradient(to_bottom,transparent,#000_20%)]`} role="img" aria-label={hero.imageAlt}>
              <div className="absolute bottom-[19%] left-1/2 w-[70%] max-w-[520px] -translate-x-1/2 sm:bottom-[15%] sm:w-[56%]">
                <GroundedCar src={CAR} priority sceneByTheme sizes="(max-width: 640px) 74vw, 520px" />
              </div>
            </div>
          </div>

          {/* trust card, overlapping only the ground below the car */}
          <div className="relative mx-auto -mt-8 max-w-160 px-0 pb-6 sm:px-4">
            <div className="relative rounded-t-[26px] border-t border-lr-line bg-linear-to-b from-lr-card/95 to-lr-page px-3 pb-2 pt-10 shadow-[0_-20px_40px_-20px_var(--lr-shadow)] backdrop-blur-md sm:rounded-[26px] sm:border">
              {/* logo tab */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[60%]">
                <div className="flex h-12 w-30 items-center justify-center rounded-t-[22px] border border-b-0 border-lr-line bg-lr-card">
                  <LandRoverLogo crop className="h-8 w-[58px]" />
                </div>
              </div>

              <h2 className={`${H4_SERIF} text-center text-lr-head`}>
                {mh2a} <span className="text-lr-green">{mh2b}</span>
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {hero.trust.items.map((t) => (
                  <div key={t.title} className="flex items-center gap-2.5 rounded-2xl border border-lr-line bg-lr-panel/60 p-2.5 sm:gap-3 sm:p-3">
                    <span className="flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-lr-green/35 bg-lr-chip text-lr-green dark:bg-[radial-gradient(circle_at_50%_35%,#1d4a35,#0d2219)] dark:shadow-[0_0_14px_-2px_rgba(70,180,120,0.35)]">
                      <GuideIcon name={t.icon} className={ICON_SM} />
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
          {/* the loch landscape behind the band, fading into the page at the bottom */}
          <div className={`pointer-events-none absolute inset-x-0 top-0 ${BAND} bg-cover bg-[center_62%] ${BG_DESKTOP} [mask-image:linear-gradient(to_bottom,#000_74%,transparent)]`} aria-hidden="true" />
          <div className={`pointer-events-none absolute inset-x-0 top-0 ${BAND}`} style={WASH} aria-hidden="true" />
          {/* the Defender on the foreground - width steps with the screen so it always clears the headline */}
          <div className={`pointer-events-none absolute inset-x-0 top-0 ${BAND}`}>
            <div className={`${CONTAINER} relative h-full`}>
              <div className="absolute bottom-[22%] right-8 w-[34%] xl:w-[40%] min-[1400px]:w-[45%]">
                <GroundedCar src={CAR} priority sceneByTheme sizes="(min-width: 1024px) 46vw, 1px" />
              </div>
            </div>
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

              <HeroRegCta
                className="mt-6 max-w-[640px]"
                buttonLabel={HOME_CTA.heroButton}
                buttonClassName="rounded-[3px] border border-lr-brand uppercase tracking-[0.04em] dark:border-lr-green/40"
              />
            </div>

            {/* stats bar */}
            <div className="relative mt-7 grid grid-cols-4 rounded-md border border-lr-line bg-lr-card/90 py-5 shadow-[0_24px_60px_-34px_var(--lr-shadow)] backdrop-blur-sm dark:bg-lr-card/80">
              {hero.stats.map((s, i) => (
                <div key={s.value} className={`flex items-center justify-center gap-5 px-4 ${i > 0 ? "border-l border-lr-line" : ""}`}>
                  <span className="shrink-0 text-lr-gold">
                    <GuideIcon name={s.icon} className={ICON_XL} />
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
            <div className="pb-7 pt-8 text-center">
              <p className={`${LABEL} text-lr-gold`}>{hero.trust.eyebrow}</p>
              <div className="mt-1 flex items-center justify-center gap-5">
                <span className="h-px w-24 bg-linear-to-r from-transparent to-lr-gold-line" />
                <h2 className={`${H4_SERIF} text-lr-head`}>
                  {h2a} <span className="text-lr-green">{h2b}</span>
                </h2>
                <span className="h-px w-24 bg-linear-to-l from-transparent to-lr-gold-line" />
              </div>

              <div className="mt-6 grid grid-cols-4">
                {hero.trust.items.map((t, i) => (
                  <div key={t.title} className={`flex flex-col items-center px-8 ${i > 0 ? "border-l border-lr-line" : ""}`}>
                    <span className="flex h-13 w-13 items-center justify-center rounded-full border border-lr-gold-line/55 bg-lr-chip text-lr-gold">
                      <GuideIcon name={t.icon} className={ICON_MD} />
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
