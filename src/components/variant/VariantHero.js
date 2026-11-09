"use client";

import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import HeroRegCta from "@/components/shared/HeroRegCta";
import { variantCtaCopy } from "@/lib/ctaCopy";
import { CONTAINER, H1, ICON_LG, ICON_MD } from "@/lib/typeScale";

const SANS = "font-[family-name:var(--font-instrument-sans)]";
const HERO_H1 = H1;
const HERO_SUB = "text-[15px] leading-[1.6] md:text-[16px] lg:text-[17px]";
const BG_DESKTOP = "bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night.webp)]";
const BG_MOBILE = "bg-[url(/home/hero-loch-day-m.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)]";
const PHOTO_FADE =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.55)_18%,#000_40%),linear-gradient(to_bottom,#000_70%,transparent)] [mask-composite:intersect]";

const MODEL_LABELS = {
  defender: "Defender", discovery: "Discovery", "discovery-sport": "Discovery Sport", freelander: "Freelander",
  "range-rover": "Range Rover", "range-rover-sport": "Range Rover Sport", "range-rover-evoque": "Range Rover Evoque",
  evoque: "Range Rover Evoque", "range-rover-velar": "Range Rover Velar", velar: "Range Rover Velar",
};

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

function splitPriceAnchor(priceAnchor = "") {
  const [headline, ...rest] = priceAnchor.split(" · ");
  const m = headline.match(/^(.*?)\s*[-–—]\s*from\s+(.+)$/i);
  return { headline, lead: m ? m[1] : headline, range: m ? m[2] : "", note: rest.join(" · ") };
}

function splitNote(note = "") {
  const i = note.indexOf(":");
  return i === -1 ? { label: "", value: note } : { label: note.slice(0, i + 1), value: note.slice(i + 1).trim() };
}

function Chevron({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function variantDisplayName(data, parent) {
  const pill = (data.tagPill || "").split(" • ").filter(Boolean);
  const modelLabel = MODEL_LABELS[parent] || "";
  const fromPill = (pill[0] || "").replace(/^Land Rover\s+/, "").trim();
  if (fromPill) return fromPill.startsWith(modelLabel) || !modelLabel ? fromPill : `${modelLabel} ${fromPill}`.replace(/\s+/g, " ").trim();
  const h1 = String(data.h1 || "").split(" - ")[0].replace(/\s+Engine Replacement.*$/i, "").replace(/^Land Rover\s+/, "").trim();
  return h1 || modelLabel || "Land Rover";
}

export default function VariantHero({ data, car = null, parent = "" }) {
  if (!data) return null;

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
  const sub = (data.subHeadline || "").replace(/ - /g, " — ");
  const cta = variantCtaCopy(variantDisplayName(data, parent));

  return (
    <section className={`relative overflow-hidden bg-lr-page text-lr-head ${SANS}`}>
      <div className="relative">
        <div className={`pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] bg-cover bg-[center_58%] lg:block xl:w-[64%] ${BG_DESKTOP} ${PHOTO_FADE}`} aria-hidden="true" />

        <div className={`relative ${CONTAINER} pt-4 md:pt-6 lg:pt-7`}>
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

          {car && (
            <div className="pointer-events-none absolute right-6 top-[96px] hidden w-[46%] max-w-[700px] lg:block xl:right-8 xl:top-[80px] xl:w-[45%]" aria-hidden="true">
              <GroundedCar src={car} priority sceneByTheme sizes="(min-width: 1024px) 52vw, 1px" />
            </div>
          )}

          {car && (
            <div className={`relative -mx-5 sm:-mx-6 mt-5 aspect-[4/3] bg-cover bg-bottom sm:aspect-[16/9] md:-mx-10 md:mt-7 lg:hidden ${BG_MOBILE} [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]`} aria-hidden="true">
              <div className="absolute bottom-[13%] left-1/2 w-[80%] max-w-[580px] -translate-x-1/2 sm:bottom-[11%] sm:w-[62%]">
                <GroundedCar src={car} priority sceneByTheme sizes="(min-width: 640px) 580px, 80vw" />
              </div>
            </div>
          )}

          <HeroRegCta
            className="relative mt-4 max-w-[560px] md:mt-5 lg:mt-6 lg:max-w-[68%] xl:max-w-[62%]"
            buttonLabel={cta.heroButton}
            plateClassName="sm:min-w-[200px] sm:flex-1"
          />

          {data.trustBadges?.length > 0 && (
            <ul className="relative mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:mt-5 lg:mt-6 lg:max-w-[68%] lg:gap-3 xl:max-w-[62%] xl:gap-3.5">
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

      {ticker.length > 0 && (
        <div className="relative border-y border-lr-line bg-lr-band">
          <div className="mx-auto w-full max-w-8xl overflow-hidden md:px-10 xl:px-12">
            <ul className="hero-ticker flex w-max items-center py-3.5 md:py-4">
              {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
                <li key={i} className={`flex shrink-0 items-center gap-2.5 pl-7 text-[13.5px] text-lr-body md:pl-10 md:text-[14px] xl:pl-12 xl:text-[15px] ${i >= ticker.length ? "ticker-copy" : ""}`} aria-hidden={i >= ticker.length || undefined}>
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
