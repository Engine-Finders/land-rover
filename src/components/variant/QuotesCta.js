import Link from "next/link";
import GroundedCar from "@/components/variant/GroundedCar";
import { LochBand, LochBanner } from "@/components/variant/PhotoScene";
import VIcon from "@/components/variant/VariantIcons";
import { CHIP } from "@/components/variant/ReplacementCosts";
import { CONTAINER, H2, H5 } from "@/lib/typeScale";

// Variant section: "Ready to Compare?" - the variant's car standing on the Highland loch-side hillside
// beside the headline, supporting line and quote button from the page's `quotesCta` JSON. Like the
// heroes: the landscape spans the band (golden hour by day, storm at night) and is washed in the band
// colour behind the copy; phones show it as a banner above the copy.

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
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      {/* desktop: the loch across the band, washed behind the copy; the car stands on the right */}
      {car && <LochBand copy="left" tone="page" from="md" solid={440} half={660} clear={900} position="center 72%" />}
      <div className={`relative ${CONTAINER} pb-6 md:pb-7 md:pt-4`}>
        <div className="relative grid items-center md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-6">
          {car && <LochBanner car={car} className="order-first md:hidden" sizes="78vw" />}
          {car && (
            <div className="relative order-last hidden md:block" aria-hidden="true">
              <div className="ml-auto w-full max-w-[500px] pb-6 pt-12 lg:pb-8">
                <GroundedCar src={car} sceneByTheme sizes="(min-width: 768px) 36vw, 1px" />
              </div>
            </div>
          )}

          <div className={`pb-2 md:py-6 ${car ? "pt-2" : "pt-6"}`}>
            <span className={CHIP}>Compare Quotes</span>
            <h2 className={`${H2} mt-3 text-lr-head`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`${H5} mt-2 text-lr-ink dark:text-lr-green`}>
                {subtitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="whitespace-nowrap">{subtitle.split(" ").slice(-1)[0]} <span aria-hidden="true">→</span></span>
              </p>
            )}
            {data.supportingLine && (
              <p className="mt-3 max-w-[30em] font-[family-name:var(--font-instrument-sans)] text-[15px] leading-relaxed text-lr-body md:text-[16px] lg:text-[17px]" dangerouslySetInnerHTML={{ __html: data.supportingLine }} />
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
    </section>
  );
}
