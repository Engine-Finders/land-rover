import Link from "next/link";
import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import VIcon from "@/components/variant/VariantIcons";

// Variant section: "Ready to Compare?" card - the variant's car on the dusk highland photo
// beside the headline, supporting line and quote button from the page's `quotesCta` JSON.
// Sits straight under Common Problems (same dark band). The photo only fills the car's side
// and fades out before the copy.

const GREEN = "#7f9f4f";
const SANS = { fontFamily: "var(--font-instrument-sans), Arial, sans-serif" };

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
    <section className="relative overflow-hidden bg-[#0b0d0a] text-white">
      <div className="relative mx-auto max-w-8xl px-4 pb-10 sm:px-6 md:px-8 md:pb-14">
        <div className="relative overflow-hidden rounded-2xl border border-[#7f9f4f]/30 bg-[#0d110c]">
          {/* desktop: the dusk highland photo behind the car half, fading into the card under the copy */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] md:block" aria-hidden="true">
            <Image src="/variant/hero-landscape-v3.webp" alt="" fill sizes="54vw" className="object-cover object-[8%_58%]" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0d110c 0%, rgba(13,17,12,0.7) 14%, rgba(13,17,12,0.2) 32%, transparent 48%)" }} />
            <div className="absolute inset-x-0 top-0 h-[22%]" style={{ background: "linear-gradient(to bottom, rgba(13,17,12,0.6), transparent)" }} />
            <div className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: "linear-gradient(to top, rgba(13,17,12,0.75), transparent)" }} />
          </div>

          <div className="relative grid items-center md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-6">
            {car && (
              <div className="relative order-first flex aspect-[16/10] items-end justify-center overflow-hidden pb-[6%] md:order-last md:aspect-auto md:min-h-[300px] md:overflow-visible md:px-6 md:pb-[9%] md:pt-10" aria-hidden="true">
                {/* phones: the photo fills the car's own block and fades into the card above the copy */}
                <div className="absolute inset-0 md:hidden">
                  <Image src="/variant/hero-landscape-m-v3.webp" alt="" fill sizes="100vw" className="object-cover object-[22%_62%]" />
                  <div className="absolute inset-x-0 top-0 h-[22%]" style={{ background: "linear-gradient(to bottom, rgba(13,17,12,0.65), transparent)" }} />
                  <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: "linear-gradient(to top, #0d110c, transparent)" }} />
                </div>
                <div className="relative w-[74%] max-w-[340px] md:w-full md:max-w-[440px]">
                  <GroundedCar src={car} sizes="(min-width: 768px) 36vw, 74vw" />
                </div>
              </div>
            )}

            <div className={`px-5 pb-6 md:py-9 md:pl-8 lg:pl-10 ${car ? "pt-1" : "pt-6"}`}>
              <span className="inline-block rounded bg-[#1d2a18] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#a9c47e] md:text-[11px]">
                Compare Quotes
              </span>
              <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px] lg:text-[38px]" style={SANS}>
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-[17px] font-medium leading-snug md:text-[21px] lg:text-[23px]" style={{ color: GREEN }}>
                  {subtitle} <span aria-hidden="true">→</span>
                </p>
              )}
              {data.supportingLine && (
                <p className="mt-3 max-w-[480px] text-[14px] leading-relaxed text-white/85 md:text-[16px]" dangerouslySetInnerHTML={{ __html: data.supportingLine }} />
              )}
              <Link
                href="/quote"
                className="group mt-5 flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#5a7a3c] bg-[#3e5a2c] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(90,122,60,0.8)] transition-colors hover:bg-[#4a6a35] sm:w-auto sm:justify-start md:text-[16px]"
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
