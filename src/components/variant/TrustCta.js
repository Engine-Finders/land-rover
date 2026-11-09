import Link from "next/link";
import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import { LOCH_BG } from "@/components/variant/PhotoScene";
import LrIcon from "@/components/shared/LrIcon";
import { carRatio } from "@/lib/carGeometry";
import { CONTAINER, H2, H5, H6, ICON_LG, ICON_MD } from "@/lib/typeScale";

// Variant section 9: why owners trust us, built to the approved reference (day + night) - a gold
// label and serif title (the site name in green), three trust cards, the closing banner card (the
// variant's car on the loch-side photo fading into the card, the final CTA, the engine on the right)
// and a five-point trust bar. Copy from the page's `trustCta` JSON. Icon discs are brand green by day
// and gold rings at night.

const SERIF = "font-[family-name:var(--font-serif-display)]";
const SANS = "font-[family-name:var(--font-instrument-sans)]";
const CARD = "rounded-lg border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)]";
const DISC = "flex shrink-0 items-center justify-center rounded-full bg-lr-brand text-white dark:border-[1.5px] dark:border-lr-gold-line/70 dark:bg-transparent dark:text-lr-gold";
const dash = (t = "") => String(t).replace(/ - /g, " — ");

const POINT_ICONS = ["genuine-failure-data", "scale", "uk-wide-delivery"];
const TRUST = [
  { icon: "best-used-buy-2", title: "100% Free", text: "No hidden fees" },
  { icon: "modern-choice", title: "No Obligation", text: "Get quotes with zero pressure" },
  { icon: "users", title: "UK Specialists", text: "Local experts nationwide" },
  { icon: "genuine-failure-data", title: "12-Month Warranty", text: "Minimum cover" },
  { icon: "uk-wide-delivery", title: "Nationwide Delivery", text: "Fast & secure" },
];

// the car cutout's width / height ("633 / 419" -> 1.51)
const carAspect = (src) => {
  const [w, h] = carRatio(src).split("/").map(Number);
  return +(w / h).toFixed(4);
};

// trust point text continues its title ("every garage ...") - shown as its own sentence
const sentence = (t = "") => dash(t.charAt(0).toUpperCase() + t.slice(1));

export default function TrustCta({ data, car = null, engine = "/variant/sec10_engine.webp" }) {
  if (!data) return null;
  const label = (data.ctaButton?.label || "Compare Engine Prices Now").replace(/\s*→\s*$/, "");
  // the final CTA copy is a headline sentence followed by supporting copy
  const finalCta = dash(data.finalCta || "");
  const stop = finalCta.indexOf(". ");
  const heading = stop === -1 ? finalCta : finalCta.slice(0, stop + 1);
  const rest = stop === -1 ? "" : finalCta.slice(stop + 2);
  // "... Owners Trust LandRoverEngine.uk" -> the site name in green
  const h2 = (data.h2 || "").replace(/(LandRoverEngine\.uk)/, `<span class="text-lr-ink dark:text-lr-green">$1</span>`);

  return (
    <section className={`relative overflow-hidden bg-lr-band text-lr-head ${SANS}`}>
      <div className={`relative ${CONTAINER} border-t border-lr-line pb-6 pt-6 md:pb-7 md:pt-6 lg:pt-7`}>
        <div className="flex items-center gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-lr-gold md:text-[14px] xl:text-[15px]">Why Choose Us</p>
          <span className="h-px w-10 bg-lr-gold-line md:w-14" aria-hidden="true" />
        </div>
        {data.h2 && <h2 className={`${H2} mt-3 max-w-[22em] text-lr-head`} dangerouslySetInnerHTML={{ __html: dash(h2) }} />}

        {/* trust cards */}
        {data.trustPoints?.length > 0 && (
          <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
            {data.trustPoints.map((c, i) => (
              <article key={c.title} className={`${CARD} flex gap-4 p-4 md:p-5 lg:gap-5`}>
                <span className={`${DISC} h-12 w-12 md:h-14 md:w-14`}>
                  <LrIcon name={POINT_ICONS[i % POINT_ICONS.length]} tone="current" className={ICON_MD} />
                </span>
                <div className="min-w-0">
                  <h3 className={`${H6} text-lr-head`} dangerouslySetInnerHTML={{ __html: dash(c.title) }} />
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-lr-body xl:text-[15px]" dangerouslySetInnerHTML={{ __html: sentence(c.text) }} />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* banner card: the car on the loch photo | final CTA | engine */}
        {(data.finalCta || data.ctaButton) && (
          <div className={`${CARD} relative mt-4 overflow-hidden md:mt-5`}>
            <div className="relative grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,0.6fr)]">
              {car && (
                // the car is sized by the band's height as well as its width (the band is only as tall
                // as the CTA copy beside it), so its roof always clears the card edge with room to spare
                <div className="relative aspect-[16/10] [container-type:size] sm:aspect-[16/8] md:aspect-auto md:min-h-[230px]" style={{ "--car-r": carAspect(car) }} aria-hidden="true">
                  <div className={`absolute inset-0 bg-[center_70%] ${LOCH_BG} [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] md:[mask-image:linear-gradient(to_right,#000_62%,transparent)]`} />
                  <div className="absolute bottom-[12%] left-1/2 w-[min(72%,calc(var(--car-r)*70cqh))] max-w-[420px] -translate-x-1/2 md:left-[46%] md:w-[min(84%,calc(var(--car-r)*70cqh))]">
                    <GroundedCar src={car} sceneByTheme sizes="(min-width: 768px) 34vw, 72vw" />
                  </div>
                </div>
              )}

              <div className="relative px-4 pb-5 pt-3 md:flex md:flex-col md:justify-center md:py-7 md:pl-2 md:pr-6 lg:pr-4">
                {heading && <h3 className={`${H5} text-lr-head`} dangerouslySetInnerHTML={{ __html: heading }} />}
                {rest && <p className="mt-2.5 text-[14.5px] leading-[1.6] text-lr-body xl:text-[15.5px]" dangerouslySetInnerHTML={{ __html: rest }} />}
                <Link
                  href="/quote"
                  className="group mt-4 flex w-full items-center justify-center gap-2.5 rounded-md bg-lr-brand px-4 py-3.5 text-[15px] font-medium leading-snug text-lr-on-brand shadow-[0_10px_30px_-14px_rgba(31,112,73,0.7)] transition-colors hover:bg-lr-brand-hover sm:w-fit sm:px-6 md:text-[16px] dark:border dark:border-lr-green/55 dark:bg-lr-brand/15 dark:text-lr-head dark:shadow-none dark:hover:bg-lr-brand/30"
                >
                  <span className="sm:hidden">Compare Engine Prices Now</span>
                  <span className="hidden sm:inline">{label}</span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className="relative hidden lg:block" aria-hidden="true">
                <span className="absolute inset-y-[8%] right-[6%] left-0">
                  <Image src={engine} alt="" fill sizes="260px" className="object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.3)]" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* trust bar */}
        <ul className={`${CARD} mt-3 grid grid-cols-2 gap-x-3 gap-y-4 p-4 sm:grid-cols-3 md:mt-4 lg:grid-cols-5 lg:divide-x lg:divide-lr-line lg:px-2 lg:py-4`}>
          {TRUST.map((t, i) => (
            <li key={t.title} className={`flex items-center gap-3 lg:justify-center lg:px-3 ${i === TRUST.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}>
              <LrIcon name={t.icon} tone="current" className={`${ICON_LG} text-lr-ink dark:text-lr-gold`} />
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-snug text-lr-head xl:text-[16px]">{t.title}</span>
                <span className="block text-[13px] leading-snug text-lr-body xl:text-[15px]">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
