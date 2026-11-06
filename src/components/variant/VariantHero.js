"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GroundedCar from "@/components/variant/GroundedCar";
import ArrowIcon from "@/components/variant/VariantIcons";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H1, ICON_LG, ICON_MD } from "@/lib/typeScale";

// Variant hero, built to the approved reference: a segmented breadcrumb, a bold sans headline (the
// accent after the dash in green), the sub-headline, four trust badges, the price anchor with its
// engine code, the reg search and a ticker band - all from the page's `hero` JSON. The variant's own
// car stands on the Highland loch-side hillside (golden hour by day, a storm at night): on desktop the
// photo fills the right of the band and feathers into the page towards the copy and the reg search;
// on phones and tablets it is a full-bleed banner between the sub-headline and the badges.
// `car` comes from src/data/variant-design/variantCars.json.

const SANS = "font-[family-name:var(--font-instrument-sans)]";
const HERO_H1 = H1; // the shared H1 (same as the home and engine heroes)
const HERO_SUB = "text-[15px] leading-[1.6] md:text-[16px] lg:text-[17px]";
const BG_DESKTOP = "bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night.webp)]";
const BG_MOBILE = "bg-[url(/home/hero-loch-day-m.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)]";
// desktop photo: feathered into the page towards the copy (left) and the reg search (bottom)
const PHOTO_FADE =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.55)_18%,#000_40%),linear-gradient(to_bottom,#000_70%,transparent)] [mask-composite:intersect]";

const MODEL_LABELS = {
  defender: "Defender", discovery: "Discovery", "discovery-sport": "Discovery Sport", freelander: "Freelander",
  "range-rover": "Range Rover", "range-rover-sport": "Range Rover Sport", "range-rover-evoque": "Range Rover Evoque",
  evoque: "Range Rover Evoque", "range-rover-velar": "Range Rover Velar", velar: "Range Rover Velar",
};

// trust badge emoji -> brand icon (supply & fit, warranty, delivery, specialists)
const BADGE_ICON_BY_EMOJI = { "🔧": "commercial", "✅": "genuine-failure-data", "🚚": "uk-wide-delivery", "👥": "users" };

function parseBadge(badge = "") {
  const [emoji, ...rest] = badge.split(" ");
  const label = BADGE_ICON_BY_EMOJI[emoji] ? rest.join(" ") : badge;
  const cut = label.lastIndexOf(" ");
  return {
    icon: BADGE_ICON_BY_EMOJI[emoji] || "genuine-failure-data",
    lines: cut > 0 ? [label.slice(0, cut), label.slice(cut + 1)] : [label],
  };
}

// "Land Rover Defender 200Tdi Engines - from £800 to £4,500 · Engine code: 11L"
// -> { lead: "Land Rover Defender 200Tdi Engines", range: "£800 to £4,500", note: "Engine code: 11L" }
function splitPriceAnchor(priceAnchor = "") {
  const [headline, ...rest] = priceAnchor.split(" · ");
  const m = headline.match(/^(.*?)\s*[-–—]\s*from\s+(.+)$/i);
  return { headline, lead: m ? m[1] : headline, range: m ? m[2] : "", note: rest.join(" · ") };
}

// "Engine code: 204DTD (2020–2021)" -> label + value, so the value can be highlighted
function splitNote(note = "") {
  const i = note.indexOf(":");
  return i === -1 ? { label: "", value: note } : { label: note.slice(0, i + 1), value: note.slice(i + 1).trim() };
}


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

function Chevron({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function VariantHero({ data, car = null, parent = "" }) {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState("");
  const [region, setRegion] = useState("GB");

  if (!data) return null;

  function goToQuoteWithReg(event) {
    event.preventDefault();
    const cleaned = regNumber.replace(/\s+/g, "").toUpperCase();
    const params = new URLSearchParams();
    if (cleaned) params.set("reg", cleaned);
    if (cleaned && region !== "GB") params.set("region", region);
    const qs = params.toString();
    router.push(qs ? `/quote?${qs}` : "/quote");
  }

  const pill = (data.tagPill || "").split(" • ").filter(Boolean);
  const modelLabel = MODEL_LABELS[parent] || "";
  const variantLabel = (pill[0] || "").replace(/^Land Rover\s+/, "").replace(modelLabel ? new RegExp(`^${modelLabel}\\s*`) : /^$/, "").trim();
  const genCrumb = pill.find((p) => /generation/i.test(p));
  const crumbs = [
    { label: "Land Rover Engine", href: "/" },
    modelLabel && { label: modelLabel, href: `/${parent}` },
    variantLabel && { label: variantLabel },
    genCrumb && { label: genCrumb },
  ].filter(Boolean);

  const dash = (data.h1 || "").indexOf(" - ");
  const lead = dash === -1 ? data.h1 : data.h1.slice(0, dash);
  const accent = dash === -1 ? "" : data.h1.slice(dash + 3);
  const price = splitPriceAnchor(data.priceAnchor);
  const note = splitNote(price.note);
  const ticker = (data.ticker || "").replace(/^●\s*/, "").split(" · ").filter(Boolean);
  const ctaLabel = (data.registrationInput?.cta?.label || "Get My Free Engine Quotes Now").replace(/\s*→\s*$/, "");
  const placeholder = (data.registrationInput?.placeholder || "Enter your reg").replace(/ - /g, " — ");
  const sub = (data.subHeadline || "").replace(/ - /g, " — ");

  return (
    <section className={`relative overflow-hidden bg-lr-page text-lr-head ${SANS}`}>
      <div className="relative">
        {/* desktop: the loch photo fills the right of the band, feathered towards the copy and the reg search */}
        <div className={`pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] bg-cover bg-[center_58%] lg:block xl:w-[64%] ${BG_DESKTOP} ${PHOTO_FADE}`} aria-hidden="true" />

        <div className={`relative ${CONTAINER} pt-4 md:pt-6 lg:pt-7`}>
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="-mx-5 sm:-mx-6 overflow-x-auto px-5 sm:px-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
            <ol className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-lr-line bg-lr-card/90 px-3 py-1.5 text-[12.5px] font-medium text-lr-green backdrop-blur-sm md:gap-2 md:px-3.5 md:py-2 md:text-[13.5px] lg:text-[14px] xl:text-[15px]">
              {crumbs.map((c, i) => (
                <li key={c.label} className={`inline-flex items-center gap-1.5 md:gap-2 ${i === 3 ? "max-[409px]:hidden" : ""}`}>
                  {i > 0 && <Chevron className="h-3 w-3 text-lr-muted md:h-3.5 md:w-3.5" />}
                  {c.href ? (
                    <a href={c.href} className="font-medium text-lr-green no-underline hover:underline">{c.label}</a>
                  ) : (
                    <span aria-current={i === crumbs.length - 1 ? "page" : undefined}>{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="relative z-10 lg:max-w-[50%] xl:max-w-[52%]">
            <h1 className={`${HERO_H1} mt-5 text-lr-head md:mt-7 lg:mt-9`}>
              <span dangerouslySetInnerHTML={{ __html: accent ? `${lead} — ` : lead }} />
              {accent && <span className="text-lr-ink dark:text-lr-green" dangerouslySetInnerHTML={{ __html: accent }} />}
            </h1>
            {sub && (
              <p
                className={`${HERO_SUB} mt-3.5 max-w-[32em] text-lr-body md:mt-5 [&_a]:font-semibold [&_a]:text-lr-ink [&_a]:no-underline hover:[&_a]:underline dark:[&_a]:text-lr-green`}
                dangerouslySetInnerHTML={{ __html: sub }}
              />
            )}
          </div>

          {/* desktop car: standing on the hillside on the right of the band */}
          {car && (
            <div className="pointer-events-none absolute right-6 top-[96px] hidden w-[46%] max-w-[700px] lg:block xl:right-8 xl:top-[80px] xl:w-[45%]" aria-hidden="true">
              <GroundedCar src={car} priority sceneByTheme sizes="(min-width: 1024px) 52vw, 1px" />
            </div>
          )}

          {/* phones / tablets: the car on the hillside, full-bleed between the copy and the badges */}
          {car && (
            <div className={`relative -mx-5 sm:-mx-6 mt-5 aspect-[4/3] bg-cover bg-bottom sm:aspect-[16/9] md:-mx-10 md:mt-7 lg:hidden ${BG_MOBILE} [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]`} aria-hidden="true">
              <div className="absolute bottom-[13%] left-1/2 w-[80%] max-w-[580px] -translate-x-1/2 sm:bottom-[11%] sm:w-[62%]">
                <GroundedCar src={car} priority sceneByTheme sizes="(min-width: 640px) 580px, 80vw" />
              </div>
            </div>
          )}

          {/* trust badges */}
          {data.trustBadges?.length > 0 && (
            <ul className="relative mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:mt-6 lg:mt-9 lg:max-w-[68%] lg:gap-3 xl:max-w-[62%] xl:gap-3.5">
              {data.trustBadges.map((badge) => {
                const { icon, lines } = parseBadge(badge);
                return (
                  <li key={badge} className="flex items-center gap-2.5 rounded-lg border border-lr-line bg-lr-card/95 px-3 py-3 shadow-[0_10px_24px_-22px_var(--lr-shadow)] backdrop-blur-sm md:gap-3 md:px-3.5 md:py-3.5 lg:gap-2.5 lg:px-3 xl:gap-3 xl:px-4 xl:py-4">
                    <LrIcon name={icon} tone="current" className={`${ICON_LG} text-lr-ink dark:text-lr-green`} />
                    <span className="whitespace-nowrap text-[13.5px] font-medium leading-snug text-lr-head md:text-[14px] xl:text-[15px]">
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
            <div className="relative mt-2.5 flex flex-col rounded-lg border border-lr-line bg-lr-card/95 shadow-[0_10px_24px_-22px_var(--lr-shadow)] backdrop-blur-sm sm:flex-row sm:items-stretch md:mt-3.5 lg:max-w-[68%] xl:max-w-[62%]">
              <div className="flex flex-1 items-center gap-3.5 px-4 py-3.5 md:gap-4 md:px-5 md:py-4">
                <LrIcon name="best-used-buy-2" tone="current" className={`${ICON_MD} text-lr-ink dark:text-lr-green`} />
                <p className="text-[15px] font-semibold leading-snug text-lr-head md:text-[16px] lg:text-[17px]">
                  {price.range ? (
                    <>
                      {price.lead} —<br />
                      <span className="font-normal">from </span>
                      <span className="whitespace-nowrap font-semibold text-lr-ink dark:text-lr-green">{price.range}</span>
                    </>
                  ) : (
                    price.headline
                  )}
                </p>
              </div>
              {price.note && (
                <p className="flex items-center border-t border-lr-line px-4 py-3 text-[14.5px] text-lr-body sm:min-w-[34%] sm:justify-center sm:border-l sm:border-t-0 sm:px-6 md:text-[15px] lg:text-[16px]">
                  {note.label && <span>{note.label}&nbsp;</span>}
                  <span className="font-semibold text-lr-head" dangerouslySetInnerHTML={{ __html: note.value }} />
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* reg search -> /quote?reg= */}
      {data.registrationInput && (
        <div className={`relative ${CONTAINER} pb-5 md:pb-8 lg:pb-10`}>
          <form onSubmit={goToQuoteWithReg} className="mt-3 grid grid-cols-[96px_minmax(0,1fr)] gap-2 rounded-lg border border-lr-line bg-lr-card p-2.5 shadow-[0_10px_24px_-22px_var(--lr-shadow)] sm:grid-cols-[112px_minmax(0,1fr)] md:mt-4 md:grid-cols-[124px_minmax(0,1fr)_auto] md:gap-3 md:p-3.5 lg:mt-5 lg:grid-cols-[132px_minmax(0,1fr)_minmax(0,1.3fr)] lg:p-4">
            <label className="relative flex h-12 items-center rounded-md border border-lr-line-strong bg-lr-card md:h-[54px] lg:h-[58px]">
              <span className="sr-only">Registration region</span>
              <UkFlagIcon className="pointer-events-none absolute left-3 h-4 w-6 md:left-3.5 md:h-[18px] md:w-7" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-full w-full cursor-pointer appearance-none rounded-md bg-transparent pl-11 pr-7 text-[15px] font-semibold text-lr-head outline-none md:pl-12 md:text-[16px] lg:text-[17px]"
              >
                <option value="GB">GB</option>
                <option value="NI">NI</option>
              </select>
              <Chevron className="pointer-events-none absolute right-2.5 h-4 w-4 rotate-90 text-lr-head md:right-3" />
            </label>
            <input
              type="text"
              name="reg"
              value={regNumber}
              onChange={(event) => setRegNumber(event.target.value.toUpperCase())}
              placeholder={placeholder}
              autoComplete="off"
              aria-label="Vehicle registration"
              className="h-12 min-w-0 rounded-md border border-lr-line-strong bg-lr-card px-3.5 text-[15px] uppercase text-lr-head outline-none transition-colors placeholder:normal-case placeholder:text-lr-muted focus:border-lr-green md:h-[54px] md:px-4 md:text-[16px] lg:h-[58px] lg:px-5 lg:text-[17px]"
            />
            <button
              type="submit"
              className="col-span-2 flex h-12 items-center justify-center gap-2.5 rounded-md bg-lr-brand px-4 text-[15px] font-semibold text-lr-on-brand shadow-[0_8px_24px_-12px_rgba(31,112,73,0.7)] transition-colors hover:bg-lr-brand-hover md:col-span-1 md:h-[54px] md:px-6 md:text-[16px] lg:h-[58px] lg:text-[18px]"
            >
              <span className="truncate">
                <span className="sm:hidden">Get My Free Quotes Now</span>
                <span className="hidden sm:inline">{ctaLabel}</span>
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0 md:h-6 md:w-6" strokeWidth={2} />
            </button>
          </form>
        </div>
      )}

      {/* ticker band: scrolls on phones (list rendered twice), one static row from lg */}
      {ticker.length > 0 && (
        <div className="relative border-y border-lr-line bg-lr-band">
          <div className="mx-auto w-full max-w-8xl overflow-hidden md:px-10 xl:px-12">
            <ul className="hero-ticker flex w-max items-center py-3.5 md:py-4 lg:w-full lg:justify-between lg:gap-4">
              {[...ticker, ...ticker].map((t, i) => (
                <li key={i} className={`flex shrink-0 items-center gap-2.5 pl-7 text-[13.5px] text-lr-body md:text-[14px] lg:pl-0 xl:text-[15px] ${i >= ticker.length ? "lg:hidden" : ""}`} aria-hidden={i >= ticker.length || undefined}>
                  <span className="h-1 w-1 rounded-full bg-lr-head/70" />
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
