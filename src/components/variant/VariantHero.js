"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GroundedCar from "@/components/variant/GroundedCar";
import VIcon from "@/components/variant/VariantIcons";

// Variant hero: the variant's own car standing on a dusk highland photo (CC0 Poly Haven
// "Champagne Castle", graded), with the tag pill, headline, trust badges, price anchor, reg
// search and ticker from the page's `hero` JSON. Fixed dark design; `car` comes from
// src/data/variant-design/variantCars.json (null when no clean cutout exists for the generation).

const GREEN = "#7f9f4f";
const SANS = { fontFamily: "var(--font-instrument-sans), Arial, sans-serif" };

const BADGE_ICON_BY_EMOJI = { "🔧": "wrench", "✅": "shield", "🚚": "truck", "👥": "users" };

function parseBadge(badge = "") {
  const [emoji, ...rest] = badge.split(" ");
  const label = BADGE_ICON_BY_EMOJI[emoji] ? rest.join(" ") : badge;
  const cut = label.lastIndexOf(" ");
  return {
    icon: BADGE_ICON_BY_EMOJI[emoji] || "shield",
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

const highlightPrice = (html = "") => html.replace(/(£[\d,]+(?:\s*(?:to|–|-)\s*£[\d,]+)?)/, `<span style="color:${GREEN};white-space:nowrap">$1</span>`);

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

function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M11.2 2.5H20a1.5 1.5 0 0 1 1.5 1.5v8.8a1.5 1.5 0 0 1-.44 1.06l-7.7 7.7a1.5 1.5 0 0 1-2.12 0L2.44 12.76a1.5 1.5 0 0 1 0-2.12l7.7-7.7a1.5 1.5 0 0 1 1.06-.44z" />
      <circle cx="16.6" cy="7.4" r="1.7" fill="#0d100c" />
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
    <section className="relative overflow-hidden bg-[#0b0d0a] text-white">
      {/* ---------- top band: copy on the left, the car on the highland photo on the right ---------- */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] lg:block" aria-hidden="true">
          <Image src="/variant/hero-landscape-v3.webp" alt="" fill priority sizes="68vw" className="object-cover object-[0%_45%]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0b0d0a 0%, rgba(11,13,10,0.75) 8%, rgba(11,13,10,0.3) 20%, transparent 34%)" }} />
          <div className="absolute inset-x-0 top-0 h-[22%]" style={{ background: "linear-gradient(to bottom, rgba(11,13,10,0.7), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: "linear-gradient(to top, #0b0d0a, transparent)" }} />
        </div>

        <div className="relative mx-auto max-w-8xl px-4 pt-4 sm:px-6 md:px-8 md:pt-6 lg:pb-10">
          {pill.length > 0 && (
            <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-white/20 px-3 py-2 text-[12px] leading-snug min-[390px]:text-[12.5px] md:px-4 md:py-2.5 md:text-[13px] [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-2 hover:[&_a]:text-white">
              {pill.map((part, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-white/35" aria-hidden="true">•</span>}
                  <span className={i === 0 ? "font-medium" : "text-white/90"} style={i === 0 ? { color: GREEN } : undefined} dangerouslySetInnerHTML={{ __html: part }} />
                </span>
              ))}
            </p>
          )}

          <div className="lg:grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-x-4">
            <div>
              <h1 className="mt-5 text-[29px] font-semibold leading-[1.12] tracking-[-0.02em] text-white min-[375px]:text-[32px] sm:text-[42px] md:mt-8 md:text-[50px] lg:mt-9 lg:text-[46px] xl:text-[54px] 2xl:text-[60px]" style={SANS}>
                <span dangerouslySetInnerHTML={{ __html: accent ? `${lead} — ` : lead }} />
                {accent && <span style={{ color: GREEN }} dangerouslySetInnerHTML={{ __html: accent }} />}
              </h1>
              {data.subHeadline && (
                <p className="mt-3 max-w-[540px] text-[15px] leading-[1.65] text-white/85 md:mt-5 md:text-[17px] md:leading-[1.7] [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-2" dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
              )}
            </div>

            {/* vehicle - desktop: large, standing on the hillside in the photo */}
            {car && (
              <div className="relative hidden lg:block" aria-hidden="true">
                <div className="relative ml-auto mt-10 w-[88%] max-w-[760px] translate-x-[3%]">
                  <GroundedCar src={car} priority sizes="(min-width: 1024px) 55vw, 1px" />
                </div>
              </div>
            )}
          </div>

          {/* vehicle - mobile/tablet: the photo scene between the copy and the badges */}
          {car && (
            <div className="relative -mx-4 mt-4 aspect-[16/11] overflow-hidden sm:-mx-6 sm:aspect-[16/9] md:-mx-8 lg:hidden" aria-hidden="true">
              <Image src="/variant/hero-landscape-m-v3.webp" alt="" fill priority sizes="100vw" className="object-cover object-[18%_55%]" />
              <div className="absolute inset-x-0 top-0 h-[28%]" style={{ background: "linear-gradient(to bottom, #0b0d0a, transparent)" }} />
              <div className="absolute inset-x-0 bottom-0 h-[18%]" style={{ background: "linear-gradient(to top, #0b0d0a, transparent)" }} />
              <div className="absolute bottom-[7%] left-1/2 w-[72%] max-w-[540px] -translate-x-[46%]">
                <GroundedCar src={car} priority sizes="(min-width: 640px) 540px, 72vw" />
              </div>
            </div>
          )}

          {/* trust badges */}
          {data.trustBadges?.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:mt-6 lg:mt-7 lg:max-w-[66%] lg:gap-3 xl:max-w-[62%]">
              {data.trustBadges.map((badge) => {
                const { icon, lines } = parseBadge(badge);
                return (
                  <li key={badge} className="flex items-center gap-2.5 rounded-lg border border-white/20 bg-[#0b0d0a]/55 px-3 py-3 md:py-4 lg:gap-3 lg:px-3.5 xl:px-4">
                    <VIcon name={icon} className="h-7 w-7 shrink-0 md:h-9 md:w-9" style={{ color: GREEN }} />
                    <span className="text-[13px] leading-[1.35] text-white md:text-[14px] xl:text-[15px]">
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
            <div className="mt-2.5 flex flex-col rounded-xl border border-white/15 bg-[#0b0d0a]/70 sm:flex-row sm:items-center md:mt-4 lg:max-w-[66%] xl:max-w-[62%]">
              <div className="flex flex-1 items-center gap-3.5 px-4 py-4 md:px-5 md:py-5">
                <TagIcon className="h-8 w-8 shrink-0 -scale-x-100 text-[#a89a6c] md:h-9 md:w-9" />
                <p className="text-[15px] font-semibold leading-snug text-white md:text-[17px]" dangerouslySetInnerHTML={{ __html: highlightPrice(price.headline) }} />
              </div>
              {price.note && (
                <p className="border-t border-white/15 px-4 py-3 text-[14px] text-white/85 sm:border-l sm:border-t-0 sm:px-6 sm:py-1 md:text-[15px] xl:px-10">
                  {note.label && <>{note.label} </>}
                  <span className="font-semibold" style={{ color: GREEN }} dangerouslySetInnerHTML={{ __html: note.value }} />
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* reg search -> /quote?reg= */}
      {data.registrationInput && (
        <div className="relative mx-auto max-w-8xl px-4 pb-5 sm:px-6 md:px-8 md:pb-10">
          <form onSubmit={goToQuoteWithReg} className="mt-3 grid grid-cols-[88px_minmax(0,1fr)] gap-2 rounded-xl border border-white/15 bg-white/[0.02] p-3 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-2.5 md:mt-4 md:grid-cols-[120px_minmax(0,1fr)] md:gap-4 md:p-5 lg:grid-cols-[120px_minmax(0,0.75fr)_minmax(0,1fr)]">
            <span className="flex h-13 items-center justify-center gap-2 rounded-lg border border-white/20 bg-black/40 text-[15px] font-medium text-white md:h-[58px] md:gap-3 md:text-[17px]">
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
              className="h-13 min-w-0 rounded-lg border border-white/20 bg-black/40 px-3.5 text-[15px] uppercase text-white outline-none transition-colors placeholder:normal-case placeholder:text-white/45 focus:border-[#7f9f4f] md:h-[58px] md:px-5 md:text-[17px]"
            />
            <button
              type="submit"
              className="col-span-2 flex h-13 items-center justify-center gap-2.5 rounded-lg border border-[#5a7a3c] bg-[#3e5a2c] px-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(90,122,60,0.8)] transition-colors hover:bg-[#4a6a35] md:h-[58px] md:text-[18px] lg:col-span-1"
            >
              <span className="truncate">
                <span className="md:hidden">Get My Free Quotes Now</span>
                <span className="hidden md:inline">{ctaLabel}</span>
              </span>
              <VIcon name="arrow" className="h-5 w-5 shrink-0" strokeWidth={2} />
            </button>
          </form>
        </div>
      )}

      {/* ticker: scrolls on mobile (list rendered twice), static row on lg+ */}
      {ticker.length > 0 && (
        <div className="relative border-y border-white/10 bg-[#0d110c]">
          <div className="mx-auto max-w-8xl overflow-hidden md:px-8">
            <ul className="hero-ticker flex w-max items-center py-3.5 md:py-4 lg:w-full lg:justify-between lg:gap-4">
              {[...ticker, ...ticker].map((t, i) => (
                <li key={i} className={`flex shrink-0 items-center gap-2.5 pl-7 text-[13px] text-white/85 lg:pl-0 lg:text-[14px] ${i >= ticker.length ? "lg:hidden" : ""}`} aria-hidden={i >= ticker.length || undefined}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
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
