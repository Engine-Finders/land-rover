import Link from "next/link";
import PhotoScene, { EnginePlate } from "@/components/variant/PhotoScene";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, CONTAINER, H2, H4, H6, ICON_LG, ICON_MD, LABEL, SMALL } from "@/lib/typeScale";

// Variant section: why owners trust us - three trust cards, a feature banner (the variant's car on
// the dusk highland photo, the final CTA and, on desktop, the engine as a studio product plate) and
// a five-point trust bar. Copy from the page's `trustCta` JSON. Follows the site theme: by day the
// banner is a white card with the photo as a clean split panel; at night the photo fades into the
// card (CSS masks, so it blends with any background).

// night theme: feather the photo into the banner under the copy (below it on phones, beside it from md)
const FADE = "dark:[mask-image:linear-gradient(to_top,transparent,#000_22%)] md:dark:[mask-image:linear-gradient(to_left,transparent,#000_22%)]";

/* ---------- icons: brand icon set ---------- */
const POINT_ICONS = ["genuine-failure-data", "scale", "uk-wide-delivery"];

const TRUST = [
  { icon: "best-used-buy-2", title: "100% Free", text: "No hidden fees" },
  { icon: "modern-choice", title: "No Obligation", text: "Get quotes with zero pressure" },
  { icon: "users", title: "UK Specialists", text: "20+ vetted experts" },
  { icon: "genuine-failure-data", title: "12-Month Warranty", text: "As standard" },
  { icon: "uk-wide-delivery", title: "Nationwide Delivery", text: "Supply & fit available" },
];

// trust point text continues its title ("every garage ...") - shown as its own sentence
const sentence = (t = "") => t.charAt(0).toUpperCase() + t.slice(1);

export default function TrustCta({ data, car = null, engine = "/variant/sec10_engine.webp", engineCode = "", engineDesc = "" }) {
  if (!data) return null;
  const label = (data.ctaButton?.label || "Compare Engine Prices Now").replace(/\s*→\s*$/, "");
  // the final CTA copy is a headline sentence followed by supporting copy
  const finalCta = data.finalCta || "";
  const stop = finalCta.indexOf(". ");
  const heading = stop === -1 ? finalCta : finalCta.slice(0, stop + 1);
  const rest = stop === -1 ? "" : finalCta.slice(stop + 2);

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      <div className={`relative ${CONTAINER} py-10 md:py-14`}>
        <div className="flex items-center gap-3">
          <p className={`${LABEL} text-lr-gold`}>Why Choose Us</p>
          <span className="h-px w-10 bg-lr-gold-line md:w-14" aria-hidden="true" />
        </div>
        {data.h2 && (
          <h2 className={`${H2} mt-3 text-lr-head`}>
            {data.h2}
          </h2>
        )}

        {/* trust cards */}
        {data.trustPoints?.length > 0 && (
          <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
            {data.trustPoints.map((c, i) => (
              <article key={c.title} className="flex gap-4 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:p-5 lg:gap-5 lg:p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lr-brand md:h-16 md:w-16 lg:h-[72px] lg:w-[72px]">
                  <LrIcon name={POINT_ICONS[i % POINT_ICONS.length]} className={ICON_LG} />
                </span>
                <div className="min-w-0">
                  <h3 className={`${H6} text-lr-head`} dangerouslySetInnerHTML={{ __html: c.title }} />
                  <p className={`${BODY_SM} mt-2 text-lr-body`} dangerouslySetInnerHTML={{ __html: sentence(c.text) }} />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* banner: feature card - car on the dusk highland photo, the final CTA, engine plate */}
        {(data.finalCta || data.ctaButton) && (
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-lr-line bg-lr-card text-lr-head shadow-[0_30px_60px_-34px_var(--lr-shadow)] md:mt-5">
            <div className="relative grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.55fr)]">
              <div className={`relative aspect-[16/11] sm:aspect-[16/9] md:aspect-auto md:min-h-[320px] ${FADE}`}>
                <PhotoScene car={car} ground={10} carClass="left-1/2 w-[78%] -translate-x-1/2 md:w-[84%]" position="20% 62%" sizes="(min-width: 768px) 45vw, 100vw" />
              </div>

              <div className="relative px-5 pb-7 pt-3 max-md:pt-5 md:flex md:flex-col md:justify-center md:py-10 md:pl-8 md:pr-8 lg:pr-6 max-md:dark:pt-3 md:dark:pl-4">
                {heading && (
                  <h3 className={`${H4} text-lr-head`} dangerouslySetInnerHTML={{ __html: heading }} />
                )}
                {rest && <p className={`${BODY} mt-3 text-lr-body`} dangerouslySetInnerHTML={{ __html: rest }} />}
                <Link
                  href="/quote"
                  className="group mt-5 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg lg:whitespace-normal lg:text-left border border-lr-brand bg-lr-brand px-4 py-3.5 text-[15px] font-medium text-lr-on-brand shadow-[0_12px_30px_-12px_rgba(31,112,73,0.7)] transition-colors hover:border-lr-brand-hover hover:bg-lr-brand-hover sm:w-auto sm:self-start sm:justify-start md:mt-6 md:text-[16px]"
                >
                  <span className="lg:hidden">Compare Engine Prices Now</span>
                  <span className="hidden lg:inline">{label}</span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className="hidden border-l border-lr-line p-4 lg:block">
                <EnginePlate engine={engine} code={engineCode} desc={engineDesc} vertical className="h-full" />
              </div>
            </div>
          </div>
        )}

        {/* trust bar */}
        <ul className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] min-[380px]:grid-cols-2 sm:grid-cols-3 md:mt-5 lg:grid-cols-5 lg:divide-x lg:divide-lr-line lg:px-2 lg:py-4">
          {TRUST.map((t, i) => (
            <li key={t.title} className={`flex items-center gap-3 lg:justify-center lg:px-3 ${i === TRUST.length - 1 ? "min-[380px]:col-span-2 sm:col-span-1" : ""}`}>
              <LrIcon name={t.icon} className={ICON_MD} />
              <span className="min-w-0">
                <span className={`${SMALL} block font-semibold text-lr-head`}>{t.title}</span>
                <span className={`${SMALL} block text-lr-body`}>{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
