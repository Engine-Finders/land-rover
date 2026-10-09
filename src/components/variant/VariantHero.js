"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MStripe from "@/components/reusableComponents/MStripe";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";
import { useTheme } from "@/components/shared/themeProvider";

const BADGE_ICON_BY_EMOJI = {
  "🔧": "vettedSpecialists",
  "✅": "check",
  "🚚": "ukDelivery",
  "👥": "users",
};

function parseBadge(badge = "") {
  const [emoji, ...rest] = badge.split(" ");
  return { icon: BADGE_ICON_BY_EMOJI[emoji] || "check", label: rest.join(" ") };
}

function splitPriceAnchor(priceAnchor = "") {
  const [headline, ...rest] = priceAnchor.split(" · ");
  return { headline, note: rest.join(" · ") };
}

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return { model: parts[0] || "", body: parts[1] || "", years: parts[2] || "" };
}

function HeroHeadline({ h1 = "" }) {
  const dashIndex = h1.indexOf(" - ");
  if (dashIndex === -1) return <span dangerouslySetInnerHTML={{ __html: h1 }} />;

  const lead = h1.slice(0, dashIndex);
  const accent = h1.slice(dashIndex + 3);
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: `${lead} - ` }} />
      <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: accent }} />
    </>
  );
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

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function TickerTrack({ items, isDark, bodyTextClass, compact = false }) {
  const row = (
    <>
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-1.5 px-3">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-[#189454]" : isDark ? "bg-white/40" : "bg-[var(--color-border-strong)]"}`}
            aria-hidden="true"
          />
          {item}
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden">
      <div className={`ticker-marquee items-center ${compact ? "text-[0.65rem]" : "text-[0.72rem] md:text-[0.8rem]"} ${bodyTextClass}`}>
        <div className="flex items-center">{row}</div>
        <div className="flex items-center" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}

export default function VariantHero({ data, band = "page" }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [regNumber, setRegNumber] = useState("");

  if (!data) return null;

  function goToQuoteWithReg(event) {
    event.preventDefault();
    const cleaned = regNumber.replace(/\s+/g, "").toUpperCase();
    if (!cleaned) {
      router.push("/quote");
      return;
    }
    router.push(`/quote?reg=${encodeURIComponent(cleaned)}`);
  }

  const isDark = theme === "dark";
  const heroImage = isDark ? "/320d/hero_dark.webp" : "/320d/hero_light.webp";
  const heroImageMobile = isDark ? "/320d/hero_mobile_dark1.webp" : "/320d/hero_mobile_light1.webp";
  const price = splitPriceAnchor(data.priceAnchor);
  const pill = splitTagPill(data.tagPill);
  const tickerItems = (data.ticker || "").replace(/^●\s*/, "").split(" · ").filter(Boolean);

  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/85" : "text-[var(--color-text-muted)]";
  const cardBorderClass = isDark ? "border-white/20" : "border-[var(--color-border)]";
  const cardBgClass = isDark ? "bg-[rgba(2,7,17,0.45)]" : "bg-[rgba(255,255,255,0.7)]";
  const innerBgClass = isDark ? "bg-[rgba(2,7,17,0.5)]" : "bg-[rgba(255,255,255,0.85)]";
  const tagPillClass = isDark ? "border-white/30 bg-[rgba(2,7,17,0.5)] text-white" : "border-[rgba(11,103,220,0.4)] bg-[rgba(255,255,255,0.75)] text-[var(--color-text)]";
  const dividerClass = isDark ? "bg-white/35" : "bg-[rgba(7,24,39,0.25)]";
  const dividerBorderClass = isDark ? "border-white/35" : "border-[rgba(7,24,39,0.25)]";
  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";

  const desktopTrustBadges = data.trustBadges?.length > 0 ? (
    <div className={`hidden rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-3.5 backdrop-blur-sm md:block`}>
      <div className="flex items-stretch py-1">
        {data.trustBadges.map((badge, index) => {
          const { icon, label } = parseBadge(badge);
          return (
            <div key={badge} className="flex flex-1 items-stretch">
              {index > 0 ? (
                <span aria-hidden="true" className={`mx-4 my-1 w-px shrink-0 self-center ${dividerClass}`} style={{ height: "70%" }} />
              ) : null}
              <div className="flex w-full items-center gap-2.5 text-left">
                <HomeIcon name={icon} size={44} className="h-11 w-11 shrink-0" />
                <span className={`text-[0.88rem] leading-[1.3] ${badgeTextClass}`}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  const mobileTrustBadges = data.trustBadges?.length > 0 ? (
    <div className={`rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-2 backdrop-blur-sm md:hidden`}>
      <div className="grid grid-cols-4 gap-x-1 text-center">
        {data.trustBadges.map((badge, index) => {
          const { icon, label } = parseBadge(badge);
          return (
            <div
              key={badge}
              className={`flex flex-col items-center gap-1 px-0.5 ${index > 0 ? `border-l ${dividerBorderClass}` : ""}`}
            >
              <HomeIcon name={icon} size={32} className="h-8 w-8 shrink-0" />
              <span className={`text-[0.58rem] leading-tight ${badgeTextClass}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  const priceRow = data.priceAnchor ? (
    <div className="flex flex-wrap items-center gap-2 text-[0.74rem] md:text-[0.92rem]">
      <HomeIcon name="quote" size={32} className="h-7 w-7 shrink-0 md:h-8 md:w-8" />
      <span className={`font-semibold ${headingClass}`} dangerouslySetInnerHTML={{ __html: price.headline }} />
      {price.note ? (
        <span className={`hidden md:inline ${bodyTextClass}`}>
          · <span dangerouslySetInnerHTML={{ __html: price.note }} />
        </span>
      ) : null}
    </div>
  ) : null;

  const registrationRow = data.registrationInput ? (
    <form
      onSubmit={goToQuoteWithReg}
      className="flex w-full flex-col gap-1.5 md:flex-row md:items-center md:gap-3"
    >
      <div className="flex w-full items-center gap-1.5 md:flex-1 md:gap-3">
        <span className={`flex shrink-0 items-center gap-1.5 rounded-[8px] border ${cardBorderClass} ${innerBgClass} px-2.5 py-2 text-[0.8rem] font-semibold md:py-3 md:text-[0.92rem] ${headingClass}`}>
          <UkFlagIcon />
          GB
        </span>
        <input
          type="text"
          name="reg"
          value={regNumber}
          onChange={(event) => setRegNumber(event.target.value.toUpperCase())}
          placeholder={data.registrationInput.placeholder}
          autoComplete="off"
          className={`min-w-0 flex-1 rounded-[8px] border ${cardBorderClass} ${innerBgClass} px-2.5 py-2 text-[0.8rem] uppercase focus:outline-none md:py-3 md:text-[0.92rem] ${headingClass} ${isDark ? "placeholder:text-white/50" : "placeholder:text-[var(--color-text-soft)]"}`}
        />
      </div>
      {data.registrationInput.cta ? (
        <button
          type="submit"
          className="btn-cta flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-[var(--color-primary)] px-2 py-2 text-center text-[0.68rem] font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] md:w-auto md:px-6 md:py-3 md:text-[0.9rem]"
        >
          {data.registrationInput.cta.label.replace(/\s*→\s*$/, "")}
          <ArrowIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
        </button>
      ) : null}
    </form>
  ) : null;

  const mobileEngineSummaryCard = data.priceAnchor ? (
    <div className={`mt-1.5 flex w-full items-center gap-3 rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-2.5 backdrop-blur-sm md:hidden`}>
      <HomeIcon name="quote" size={28} className="h-7 w-7 shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className={`text-[0.74rem] font-semibold ${headingClass}`} dangerouslySetInnerHTML={{ __html: price.headline }} />
        {price.note ? <span className={`text-[0.7rem] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: price.note }} /> : null}
      </div>
    </div>
  ) : null;

  const mobileQuoteWidget = data.registrationInput ? (
    <div className={`mt-1.5 flex w-full flex-col gap-2 rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-2.5 backdrop-blur-sm md:hidden`}>
      {registrationRow}
    </div>
  ) : null;

  const desktopQuoteWidget = data.priceAnchor || data.registrationInput ? (
    <div className={`hidden w-full flex-col gap-3 rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-4 backdrop-blur-sm md:flex`}>
      {priceRow}
      {registrationRow}
    </div>
  ) : null;

  return (
    <>
      <section
        className={`relative overflow-hidden text-[var(--color-text)] ${sectionBgClass(band)} ${headingClass}`}
      >
        {/* Image sits on the right only (like model/generation heroes) — not a full-bleed viewport crop */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[58%]">
          <Image
            src={heroImageMobile}
            alt=""
            fill
            className="object-cover object-[70%_center] md:hidden"
            sizes="100vw"
            priority
          />
          <Image
            src={heroImage}
            alt=""
            fill
            className="hidden object-cover object-[62%_center] md:block"
            sizes="58vw"
            priority
          />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,28,24,0.94)_0%,rgba(13,28,24,0.55)_42%,rgba(13,28,24,0.92)_100%)] md:hidden" />
              <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(13,28,24,1)_0%,rgba(13,28,24,0.82)_28%,rgba(13,28,24,0.2)_68%,rgba(13,28,24,0.05)_100%)] md:block" />
              <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(0deg,rgba(13,28,24,1)_0%,transparent_100%)] md:block" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,247,242,0.97)_0%,rgba(248,247,242,0.72)_36%,rgba(248,247,242,0.2)_62%,rgba(248,247,242,0.85)_100%)] md:hidden" />
              <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(248,247,242,0.92)_22%,rgba(248,247,242,0.35)_55%,rgba(248,247,242,0)_100%)] md:block" />
              <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] md:block" />
            </>
          )}
        </div>

        <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-3 md:px-8 md:pb-6 md:pt-8">
          <div className="flex w-full max-w-[640px] flex-col gap-1.5 md:gap-2">
            <span className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[8px] border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-2.5 md:py-1.5 md:text-[0.78rem] ${tagPillClass}`}>
              <HomeIcon name="vehicle" size={22} className="h-5.5 w-5.5 shrink-0" />
              <strong className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: pill.model }} />
              {pill.body ? (
                <>
                  <span aria-hidden="true" className="opacity-50">•</span>
                  <span dangerouslySetInnerHTML={{ __html: pill.body }} />
                </>
              ) : null}
              {pill.years ? (
                <>
                  <span aria-hidden="true" className="opacity-50">•</span>
                  <span dangerouslySetInnerHTML={{ __html: pill.years }} />
                </>
              ) : null}
            </span>

            <h1 className={`font-lora text-[32px] font-medium leading-[0.95] tracking-normal md:text-[50px] md:leading-[1.08] ${headingClass}`}>
              <HeroHeadline h1={data.h1} />
            </h1>

            <MStripe />

            <p
              className={`max-w-[78%] text-[0.88rem] leading-[1.42] md:max-w-[560px] md:text-[17px] md:leading-[1.45] ${bodyTextClass}`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>

          <div className="mt-4 flex w-full max-w-[820px] flex-col gap-2.5 md:mt-4 md:gap-3">
            {desktopTrustBadges}
            {mobileTrustBadges}
            {mobileEngineSummaryCard}
            {mobileQuoteWidget}
            {desktopQuoteWidget}
          </div>
        </div>
      </section>

      {tickerItems.length > 0 ? (
        <>
          {/* Mobile: full-bleed ticker */}
          <div
            className={`relative left-1/2 w-screen -translate-x-1/2 border-y border-[var(--color-border)] py-2.5 md:hidden ${isDark ? "bg-black/70" : "bg-[var(--color-surface)]"}`}
          >
            <TickerTrack items={tickerItems} isDark={isDark} bodyTextClass={bodyTextClass} compact />
          </div>
          {/* Desktop: full viewport width, not constrained to max-w-8xl */}
          <div
            className={`relative left-1/2 hidden w-screen -translate-x-1/2 border-b border-[var(--color-border)] py-3 md:block ${sectionBgClass(band === "soft" ? "page" : "soft")}`}
          >
            <TickerTrack items={tickerItems} isDark={isDark} bodyTextClass="text-[var(--color-text-muted)]" />
          </div>
        </>
      ) : null}
    </>
  );
}
