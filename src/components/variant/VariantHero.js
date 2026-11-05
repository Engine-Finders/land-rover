"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GroundedCar from "@/components/variant/GroundedCar";
import ArrowIcon from "@/components/variant/VariantIcons";
import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, CONTAINER, H1, ICON_LG, NUM, SMALL } from "@/lib/typeScale";

// Variant hero: the variant's own car standing on a dusk highland photo (CC0 Poly Haven
// "Champagne Castle", graded), with the tag pill, headline, trust badges, price anchor, reg
// search and ticker from the page's `hero` JSON. Follows the site theme: on the day theme the car
// stands in a framed photo on white; on the night theme the photo fades into the green page (CSS
// masks, so it blends with any background). `car` comes from src/data/variant-design/variantCars.json
// (null when no clean cutout exists for the generation).

// night theme: feather the photo's edges into the page
const FADE_DESKTOP = "dark:[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.25)_8%,rgba(0,0,0,0.7)_20%,#000_34%),linear-gradient(to_bottom,rgba(0,0,0,0.3),#000_22%,#000_70%,transparent)] dark:[mask-composite:intersect]";
const FADE_MOBILE = "dark:[mask-image:linear-gradient(to_bottom,transparent,#000_28%,#000_82%,transparent)]";

// trust badge emoji -> brand icon (supply & fit, warranty, delivery, specialists)
const BADGE_ICON_BY_EMOJI = { "🔧": "expert-verified", "✅": "genuine-failure-data", "🚚": "uk-wide-delivery", "👥": "users" };

function parseBadge(badge = "") {
  const [emoji, ...rest] = badge.split(" ");
  const label = BADGE_ICON_BY_EMOJI[emoji] ? rest.join(" ") : badge;
  const cut = label.lastIndexOf(" ");
  return {
    icon: BADGE_ICON_BY_EMOJI[emoji] || "genuine-failure-data",
    lines: cut > 0 ? [label.slice(0, cut), label.slice(cut + 1)] : [label],
  };
}

function splitPriceAnchor(priceAnchor = "") {
  const [headline, ...rest] = priceAnchor.split(" · ");
  return { headline, note: rest.join(" · ") };
}

// "Engine code: 204DTD (2020–2021)" -> label + value, so the value can be highlighted
function splitNote(note = "") {
  const i = note.indexOf(":");
  return i === -1 ? { label: "", value: note } : { label: note.slice(0, i + 1), value: note.slice(i + 1).trim() };
}

const highlightPrice = (html = "") => html.replace(/(£[\d,]+(?:\s*(?:to|–|-)\s*£[\d,]+)?)/, `<span class="whitespace-nowrap text-lr-green">$1</span>`);

function UkFlagIcon({ className = "h-4 w-5" }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="2.4" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4" />
      <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.4" />
    </svg>
  );
}

export default function VariantHero({ data, car = null }) {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState("");

  if (!data) return null;

  function goToQuoteWithReg(event) {
    event.preventDefault();
    const cleaned = regNumber.replace(/\s+/g, "").toUpperCase();
    router.push(cleaned ? `/quote?reg=${encodeURIComponent(cleaned)}` : "/quote");
  }

  const pill = (data.tagPill || "").split(" • ").filter(Boolean);
  const dash = (data.h1 || "").indexOf(" - ");
  const lead = dash === -1 ? data.h1 : data.h1.slice(0, dash);
  const accent = dash === -1 ? "" : data.h1.slice(dash + 3);
  const price = splitPriceAnchor(data.priceAnchor);
  const note = splitNote(price.note);
  const ticker = (data.ticker || "").replace(/^●\s*/, "").split(" · ").filter(Boolean);
  const ctaLabel = (data.registrationInput?.cta?.label || "Get My Free Engine Quotes Now").replace(/\s*→\s*$/, "");

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      {/* ---------- top band: copy on the left, the car on the highland photo on the right ---------- */}
      <div className="relative">
        {/* night theme: the photo fills the right of the band, feathered into the page */}
        <div className={`pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] dark:lg:block ${FADE_DESKTOP}`} aria-hidden="true">
          <Image src="/variant/hero-landscape-v3.webp" alt="" fill priority sizes="68vw" className="object-cover object-[0%_45%]" />
        </div>

        <div className={`relative ${CONTAINER} pt-4 md:pt-6 lg:pb-10`}>
          {pill.length > 0 && (
            <p className={`${SMALL} inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-lr-line-strong px-3 py-2 md:px-4 md:py-2.5 [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2 hover:[&_a]:text-lr-head`}>
              {pill.map((part, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-lr-muted/70" aria-hidden="true">•</span>}
                  <span className={i === 0 ? "font-medium text-lr-green" : "text-lr-body"} dangerouslySetInnerHTML={{ __html: part }} />
                </span>
              ))}
            </p>
          )}

          <div className="lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-x-4">
            <div>
              <h1 className={`${H1} mt-5 text-lr-head md:mt-8 lg:mt-9`}>
                <span dangerouslySetInnerHTML={{ __html: accent ? `${lead} — ` : lead }} />
                {accent && <span className="text-lr-green" dangerouslySetInnerHTML={{ __html: accent }} />}
              </h1>
              {data.subHeadline && (
                <p className={`${BODY} mt-3 max-w-[560px] text-lr-body md:mt-5 [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
              )}
            </div>

            {/* vehicle - desktop: large, standing on the hillside in the photo (day theme: the photo is
                a framed card around the car; night theme: the feathered photo behind the band) */}
            {car && (
              <div className="relative hidden lg:block" aria-hidden="true">
                <div className="relative ml-auto mr-[5%] mt-12 w-[86%] max-w-[700px] dark:mr-0 dark:w-[96%] dark:max-w-[760px] dark:translate-x-[3%]">
                  <div className="absolute -inset-x-[5%] -bottom-[12%] -top-[14%] overflow-hidden rounded-2xl border border-lr-line shadow-[0_30px_60px_-34px_var(--lr-shadow)] dark:hidden">
                    <Image src="/variant/hero-landscape-v3.webp" alt="" fill priority sizes="45vw" className="object-cover object-[30%_62%]" />
                  </div>
                  <GroundedCar src={car} priority sizes="(min-width: 1024px) 55vw, 1px" />
                </div>
              </div>
            )}
            {/* no cutout for this generation: the landscape on its own (framed by day; at night the
                feathered photo behind the band already shows it) */}
            {!car && (
              <div className="relative hidden lg:block dark:lg:hidden" aria-hidden="true">
                <div className="relative ml-auto mt-12 aspect-[16/10] w-[94%] max-w-[700px] overflow-hidden rounded-2xl border border-lr-line shadow-[0_30px_60px_-34px_var(--lr-shadow)]">
                  <Image src="/variant/hero-landscape-v3.webp" alt="" fill priority sizes="45vw" className="object-cover object-[30%_55%]" />
                </div>
              </div>
            )}
          </div>

          {/* vehicle - mobile/tablet: the photo scene between the copy and the badges */}
          {car && (
            <div className="relative mt-4 aspect-[16/11] overflow-hidden rounded-xl border border-lr-line sm:aspect-[16/9] lg:hidden dark:-mx-4 dark:rounded-none dark:border-0 md:dark:-mx-8" aria-hidden="true">
              <div className={`absolute inset-0 ${FADE_MOBILE}`}>
                <Image src="/variant/hero-landscape-m-v3.webp" alt="" fill priority sizes="100vw" className="object-cover object-[18%_55%]" />
              </div>
              <div className="absolute bottom-[7%] left-1/2 w-[72%] max-w-[540px] -translate-x-[46%]">
                <GroundedCar src={car} priority sizes="(min-width: 640px) 540px, 72vw" />
              </div>
            </div>
          )}

          {/* trust badges */}
          {data.trustBadges?.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:mt-6 lg:mt-7 lg:max-w-[70%] lg:gap-3 xl:max-w-[66%]">
              {data.trustBadges.map((badge) => {
                const { icon, lines } = parseBadge(badge);
                return (
                  <li key={badge} className="flex items-center gap-2.5 rounded-lg border border-lr-line bg-lr-card/85 px-3 py-3 shadow-[0_14px_30px_-26px_var(--lr-shadow)] md:py-4 lg:gap-3 lg:px-3.5 xl:px-4">
                    <LrIcon name={icon} className={ICON_LG} />
                    <span className={`${SMALL} text-lr-head`}>
                      {lines.map((l) => (
                        <span key={l} className="block">{l}</span>
                      ))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* price anchor + engine code */}
          {data.priceAnchor && (
            <div className="mt-2.5 flex flex-col rounded-xl border border-lr-line bg-lr-card/90 shadow-[0_20px_44px_-34px_var(--lr-shadow)] sm:flex-row sm:items-center md:mt-4 lg:max-w-[70%] xl:max-w-[66%]">
              <div className="flex flex-1 items-center gap-3.5 px-4 py-4 md:px-5 md:py-5">
                <LrIcon name="best-used-buy-2" className={ICON_LG} />
                <p className={`${NUM} text-lr-head`} dangerouslySetInnerHTML={{ __html: highlightPrice(price.headline) }} />
              </div>
              {price.note && (
                <p className={`${BODY_SM} border-t border-lr-line px-4 py-3 text-lr-body sm:border-l sm:border-t-0 sm:px-6 sm:py-1 xl:px-8`}>
                  {note.label && <>{note.label} </>}
                  <span className="font-semibold text-lr-green" dangerouslySetInnerHTML={{ __html: note.value }} />
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* reg search -> /quote?reg= */}
      {data.registrationInput && (
        <div className={`relative ${CONTAINER} pb-5 md:pb-10`}>
          <form onSubmit={goToQuoteWithReg} className="mt-3 grid grid-cols-[88px_minmax(0,1fr)] gap-2 rounded-xl border border-lr-line bg-lr-card p-3 shadow-[0_20px_44px_-34px_var(--lr-shadow)] sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-2.5 md:mt-4 md:grid-cols-[120px_minmax(0,1fr)] md:gap-4 md:p-5 lg:grid-cols-[120px_minmax(0,0.75fr)_minmax(0,1fr)] xl:grid-cols-[120px_minmax(0,0.6fr)_minmax(0,1fr)]">
            <span className="flex h-13 items-center justify-center gap-2 rounded-lg border border-lr-line-strong bg-lr-panel text-[15px] font-medium text-lr-head md:h-[58px] md:gap-3 md:text-[17px]">
              <UkFlagIcon className="h-4 w-6 md:h-5 md:w-7" />
              GB
            </span>
            <input
              type="text"
              name="reg"
              value={regNumber}
              onChange={(event) => setRegNumber(event.target.value.toUpperCase())}
              placeholder={data.registrationInput.placeholder || "Enter your reg"}
              autoComplete="off"
              aria-label="Vehicle registration"
              className="h-13 min-w-0 rounded-lg border border-lr-line-strong bg-lr-panel px-3.5 text-[15px] uppercase text-lr-head outline-none transition-colors placeholder:normal-case placeholder:text-lr-muted focus:border-lr-green md:h-[58px] md:px-5 md:text-[17px]"
            />
            <button
              type="submit"
              className="col-span-2 flex h-13 items-center justify-center gap-2.5 rounded-lg border border-lr-brand bg-lr-brand px-4 text-[15px] font-semibold text-lr-on-brand shadow-[0_8px_24px_-10px_rgba(31,112,73,0.7)] transition-colors hover:border-lr-brand-hover hover:bg-lr-brand-hover md:h-[58px] md:text-[16px] lg:col-span-1 xl:text-[17px]"
            >
              <span className="truncate">
                {/* short label on phones and in the narrower lg column, the full one where it fits */}
                <span className="md:hidden lg:inline xl:hidden">Get My Free Quotes Now</span>
                <span className="hidden md:inline lg:hidden xl:inline">{ctaLabel}</span>
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0" strokeWidth={2} />
            </button>
          </form>
        </div>
      )}

      {/* ticker: scrolls on mobile (list rendered twice), static row on lg+ */}
      {ticker.length > 0 && (
        <div className="relative border-y border-lr-line bg-lr-band">
          <div className="mx-auto w-full max-w-8xl overflow-hidden md:px-8">
            <ul className="hero-ticker flex w-max items-center py-3.5 md:py-4 lg:w-full lg:justify-between lg:gap-4">
              {[...ticker, ...ticker].map((t, i) => (
                <li key={i} className={`${SMALL} flex shrink-0 items-center gap-2.5 pl-7 text-lr-body lg:pl-0 ${i >= ticker.length ? "lg:hidden" : ""}`} aria-hidden={i >= ticker.length || undefined}>
                  <span className="h-1.5 w-1.5 rounded-full bg-lr-green" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
