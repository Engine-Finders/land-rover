"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";
import { useTheme } from "@/components/shared/themeProvider";

const STRIP_ICON_BY_EMOJI = {
  "📊": "realEnquiries",
  "🔧": "vettedSpecialists",
  "📖": "knowledgeCentre",
  "🏆": "topChoice",
};

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return { model: parts[0] || "", body: parts[1] || "", years: parts[2] || "" };
}

function splitStat(label = "") {
  const tagMatch = label.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const text = tagMatch ? label.slice(0, tagMatch.index) : label;
  const [first, ...rest] = text.split(" ");
  const hasValue = /[0-9]/.test(first);
  return {
    value: hasValue ? first : "",
    label: hasValue ? rest.join(" ") : text,
    tag,
  };
}

function stripIcon(icon = "") {
  return STRIP_ICON_BY_EMOJI[icon] || "check";
}

export default function ModelHero({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  // Same images as variant hero for now
  const heroImage = isDark ? "/320d/hero_dark.webp" : "/320d/hero_light.webp";
  const heroImageMobile = isDark ? "/320d/hero_mobile_dark1.webp" : "/320d/hero_mobile_light1.webp";

  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/85" : "text-[var(--color-text-muted)]";
  const cardBorderClass = isDark ? "border-white/20" : "border-[var(--color-border)]";
  const cardBgClass = isDark ? "bg-[rgba(2,7,17,0.45)]" : "bg-[rgba(255,255,255,0.7)]";
  const tagPillClass = isDark
    ? "border-white/30 bg-[rgba(2,7,17,0.5)] text-white"
    : "border-[rgba(11,103,220,0.4)] bg-[rgba(255,255,255,0.75)] text-[var(--color-text)]";
  const dividerClass = isDark ? "bg-white/35" : "bg-[rgba(7,24,39,0.25)]";
  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";

  return (
    <section className={`relative overflow-hidden text-[var(--color-text)] ${sectionBgClass(band)} ${headingClass}`}>
      {/* Full-bleed hero image — left fades to page bg, right stays visible */}
      <div className="pointer-events-none absolute inset-0">
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
          className="hidden object-cover object-[72%_center] md:block"
          sizes="100vw"
          priority
        />
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,28,24,0.94)_0%,rgba(13,28,24,0.55)_42%,rgba(13,28,24,0.92)_100%)] md:hidden" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(13,28,24,1)_0%,rgba(13,28,24,0.92)_28%,rgba(13,28,24,0.45)_52%,rgba(13,28,24,0.08)_78%,transparent_100%)] md:block" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(0deg,rgba(13,28,24,1)_0%,transparent_100%)] md:block" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,247,242,0.97)_0%,rgba(248,247,242,0.72)_36%,rgba(248,247,242,0.2)_62%,rgba(248,247,242,0.85)_100%)] md:hidden" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(248,247,242,0.96)_26%,rgba(248,247,242,0.55)_48%,rgba(248,247,242,0.12)_72%,transparent_100%)] md:block" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] md:block" />
          </>
        )}
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-3 md:px-8 md:pb-6 md:pt-8">
        <div className="flex w-full max-w-[720px] flex-col gap-1.5 md:gap-2">
          <span className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[8px] border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-2.5 md:py-1.5 md:text-[0.78rem] ${tagPillClass}`}>
            <HomeIcon name="vehicle" size={28} className="h-7 w-7 shrink-0 md:h-5.5 md:w-5.5" />
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

          <h1
            className={`mt-2 font-lora text-[32px] font-medium leading-[0.95] tracking-normal md:text-[50px] md:leading-[1.08] ${headingClass}`}
            dangerouslySetInnerHTML={{ __html: data.h1 }}
          />

          <p
            className={`max-w-[78%] text-[0.88rem] leading-[1.42] md:max-w-[620px] md:text-[17px] md:leading-[1.45] ${
              isDark
                ? "text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] md:text-white/85 md:[text-shadow:none]"
                : "text-black/90 [text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_10px_rgba(255,255,255,0.85)] md:text-[var(--color-text-muted)] md:[text-shadow:none]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />
        </div>

        <div className="mt-4 flex w-full max-w-[820px] flex-col gap-2.5 md:gap-3">
          {data.trustStrip?.length > 0 ? (
            <>
              <div className={`rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-2 backdrop-blur-sm md:hidden`}>
                <div className="grid grid-cols-4 gap-x-1 text-center">
                  {data.trustStrip.map((item, index) => {
                    const stat = splitStat(item.label);
                    return (
                      <div
                        key={item.label}
                        className={`flex flex-col items-center gap-1 px-0.5 ${index > 0 ? `border-l ${isDark ? "border-white/35" : "border-[rgba(7,24,39,0.25)]"}` : ""}`}
                      >
                        <HomeIcon name={stripIcon(item.icon)} size={44} className="h-11 w-11 shrink-0" />
                        {stat.value ? (
                          <strong className={`text-[0.78rem] font-bold leading-none ${headingClass}`}>{stat.value}</strong>
                        ) : null}
                        <span className={`text-[0.58rem] leading-tight ${badgeTextClass}`}>{stat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`hidden rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-3.5 backdrop-blur-sm md:block`}>
                <div className="flex items-stretch py-1">
                  {data.trustStrip.map((item, index) => {
                    const stat = splitStat(item.label);
                    return (
                      <div key={item.label} className="flex flex-1 items-stretch">
                        {index > 0 ? (
                          <span aria-hidden="true" className={`mx-4 my-1 w-px shrink-0 self-center ${dividerClass}`} style={{ height: "70%" }} />
                        ) : null}
                        <div className="flex w-full items-center gap-2.5 text-left">
                          <HomeIcon name={stripIcon(item.icon)} size={44} className="h-11 w-11 shrink-0" />
                          <div className="min-w-0">
                            {stat.value ? (
                              <strong className={`block text-[1.05rem] font-bold leading-none ${headingClass}`}>{stat.value}</strong>
                            ) : null}
                            <span className={`text-[0.82rem] leading-[1.3] ${badgeTextClass}`}>{stat.label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {data.primaryCta ? (
            <Link
              href="/quote"
              className="btn-cta flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 py-3 text-[0.85rem] font-bold text-white no-underline shadow-[0_12px_28px_var(--color-shadow)] md:w-fit md:px-6 md:py-3.5 md:text-[0.95rem]"
            >
              <HomeIcon name="quote" size={36} className="h-9 w-9 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*→\s*$/, "") }} />
              <ArrowIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
