import Link from "next/link";
import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import VIcon from "@/components/variant/VariantIcons";
import { BODY, CONTAINER, H2, H5, LABEL } from "@/lib/typeScale";

// Variant section: "Ready to Compare?" card - the variant's car on the dusk highland photo
// beside the headline, supporting line and quote button from the page's `quotesCta` JSON.
// Sits straight under Common Problems (same band). Follows the site theme: on the day theme the
// photo is a framed panel inside the white card; on the night theme it fills the car's side and
// fades into the card before the copy (CSS masks, so it blends with any background).

const FADE_DESKTOP = "dark:[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.3)_14%,rgba(0,0,0,0.8)_32%,#000_48%),linear-gradient(to_bottom,rgba(0,0,0,0.4),#000_22%,#000_78%,rgba(0,0,0,0.25))] dark:[mask-composite:intersect]";
const FADE_MOBILE = "dark:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.35),#000_22%,#000_70%,transparent)]";

function splitHeadline(headline = "") {
  const cleaned = headline.replace(/\s*→\s*$/, "");
  const qIndex = cleaned.indexOf("? ");
  if (qIndex === -1) return { title: cleaned, subtitle: "" };
  return { title: cleaned.slice(0, qIndex + 1), subtitle: cleaned.slice(qIndex + 2) };
}

export default function QuotesCta({ data, car = null }) {
  if (!data) return null;
  const { title, subtitle } = splitHeadline(data.headline);
  const label = (data.button?.label || "Get My Free Quotes Now").replace(/\s*→\s*$/, "");

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      <div className={`relative ${CONTAINER} pb-10 md:pb-14`}>
        <div className="relative overflow-hidden rounded-2xl border border-lr-line bg-lr-card shadow-[0_30px_60px_-34px_var(--lr-shadow)]">
          {/* desktop: the dusk highland photo behind the car half - a framed panel inside the car's
              column by day, fading into the card under the copy at night */}
          <div className={`pointer-events-none absolute inset-y-3 right-3 hidden w-[43%] overflow-hidden rounded-xl md:block dark:inset-y-0 dark:right-0 dark:w-[54%] dark:rounded-none ${FADE_DESKTOP}`} aria-hidden="true">
            <Image src="/variant/hero-landscape-v3.webp" alt="" fill sizes="54vw" className="object-cover object-[8%_58%]" />
          </div>

          <div className="relative grid items-center md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-6">
            {car && (
              <div className="relative order-first flex aspect-[16/10] items-end justify-center overflow-hidden pb-[6%] md:order-last md:aspect-auto md:min-h-[300px] md:overflow-visible md:px-6 md:pb-[9%] md:pt-10" aria-hidden="true">
                {/* phones: the photo fills the car's own block - framed by day, fading into the card above
                    the copy at night */}
                <div className={`absolute inset-x-3 bottom-0 top-3 overflow-hidden rounded-xl md:hidden dark:inset-0 dark:rounded-none ${FADE_MOBILE}`}>
                  <Image src="/variant/hero-landscape-m-v3.webp" alt="" fill sizes="100vw" className="object-cover object-[22%_62%]" />
                </div>
                <div className="relative w-[74%] max-w-[340px] md:w-full md:max-w-[440px]">
                  <GroundedCar src={car} sizes="(min-width: 768px) 36vw, 74vw" />
                </div>
              </div>
            )}

            <div className={`px-5 pb-6 md:py-9 md:pl-8 lg:pl-10 ${car ? "pt-1" : "pt-6"}`}>
              <span className={`${LABEL} inline-block rounded bg-lr-chip px-2.5 py-1 text-lr-green`}>
                Compare Quotes
              </span>
              <h2 className={`${H2} mt-3 text-lr-head`}>
                {title}
              </h2>
              {subtitle && (
                <p className={`${H5} mt-2 text-lr-green`}>
                  {subtitle} <span aria-hidden="true">→</span>
                </p>
              )}
              {data.supportingLine && (
                <p className={`${BODY} mt-3 max-w-[520px] text-lr-body`} dangerouslySetInnerHTML={{ __html: data.supportingLine }} />
              )}
              <Link
                href="/quote"
                className="group mt-5 flex w-full items-center justify-center gap-2.5 rounded-lg border border-lr-brand bg-lr-brand px-5 py-3.5 text-[15px] font-medium text-lr-on-brand shadow-[0_10px_30px_-12px_rgba(31,112,73,0.7)] transition-colors hover:border-lr-brand-hover hover:bg-lr-brand-hover sm:w-fit sm:justify-start md:text-[16px]"
              >
                <span className="lg:hidden">Get My Free Quotes Now</span>
                <span className="hidden lg:inline">{label}</span>
                <VIcon name="arrow" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
