"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";
import { useTheme } from "@/components/shared/themeProvider";

const STAT_ICONS = ["realEnquiries", "repairVsReplace", "safestBuy", "topChoice"];

function normalizeText(value = "") {
  return value
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, " \u2022 ")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a0\u00e2\u201e\u00a2|\u00e2\u2020\u2019|\u2192/g, "\u2192")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTagPill(tagPill = "") {
  return normalizeText(tagPill)
    .split(" \u2022 ")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitStatLabel(label = "") {
  const clean = normalizeText(label);
  const match = clean.match(/^([0-9,/+.]+)\s+(.+)$/);

  if (!match) {
    return { value: "", lines: [clean] };
  }

  const [, value, rest] = match;
  return {
    value,
    lines: rest.split(" ").reduce(
      (acc, word) => {
        if (acc[0].length <= acc[1].length) {
          acc[0] = acc[0] ? `${acc[0]} ${word}` : word;
        } else {
          acc[1] = acc[1] ? `${acc[1]} ${word}` : word;
        }
        return acc;
      },
      ["", ""],
    ),
  };
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function StatIcon({ name, isDark }) {
  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-[var(--color-primary)] md:h-14 md:w-14 ${
        isDark
          ? "border-white/14 bg-[radial-gradient(circle_at_30%_30%,rgba(31,90,185,0.24),rgba(4,12,26,0.92)_72%)]"
          : "border-[rgba(11,103,220,0.18)] bg-[radial-gradient(circle_at_30%_30%,rgba(220,234,255,0.95),rgba(255,255,255,0.98)_72%)]"
      }`}
    >
      <HomeIcon name={name} size={36} className="h-8 w-8 md:h-9 md:w-9" />
    </span>
  );
}

function StatCard({ item, index, isDark }) {
  const stat = splitStatLabel(item.label);

  return (
    <li
      className={`flex min-h-[108px] items-center gap-2 rounded-[8px] border px-3 py-0 shadow-[0_20px_48px_rgba(0,0,0,0.22)] md:min-h-[82px] md:rounded-none md:border-0 md:border-r md:bg-transparent md:px-3 md:py-1.5 md:shadow-none md:last:border-r-0 ${
        isDark
          ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.88)_0%,rgba(3,10,23,0.96)_100%)] md:border-white/14"
          : "border-[rgba(11,103,220,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(239,245,252,0.96)_100%)] md:border-[rgba(11,103,220,0.16)]"
      }`}
    >
      <StatIcon name={STAT_ICONS[index % STAT_ICONS.length]} isDark={isDark} />
      <div className="min-w-0">
        {stat.value ? (
          <p className={`text-[21px] font-bold leading-none md:text-[20px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {stat.value}
          </p>
        ) : null}
        <div className={`${stat.value ? "mt-0.5" : ""} space-y-0`}>
          {stat.lines.filter(Boolean).map((line) => (
            <p
              key={line}
              className={`text-[11px] font-medium uppercase leading-[1.02] md:text-[11px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </li>
  );
}

function HeroTitle({ title, headingClass, accentText }) {
  const cleanTitle = normalizeText(title);
  const accent = accentText && cleanTitle.includes(accentText) ? accentText : "Replacement Cost";
  const accentIndex = cleanTitle.indexOf(accent);

  if (accentIndex === -1) {
    return (
      <h1 className={`mt-2 max-w-[700px] font-lora text-[32px] font-medium leading-[0.95] tracking-normal md:text-[50px] md:leading-[1.08] ${headingClass}`}>
        {cleanTitle}
      </h1>
    );
  }

  return (
    <h1 className={`mt-2 max-w-[700px] font-lora text-[32px] font-medium leading-[0.95] tracking-normal md:text-[50px] md:leading-[1.08] ${headingClass}`}>
      {cleanTitle.slice(0, accentIndex)}
      <span className="text-[var(--color-primary)]">{accent}</span>
      {cleanTitle.slice(accentIndex + accent.length)}
    </h1>
  );
}

export default function EngineHero({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const metaItems = splitTagPill(data.tagPill);
  const accentToken = metaItems[1] || "";
  const description = normalizeText(data.subHeadline);
  const ctaLabel = data.primaryCta?.label ? normalizeText(data.primaryCta.label).replace(/\s*\u2192$/, "") : "";

  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const tagPillClass = isDark
    ? "border-white/30 bg-[rgba(2,7,17,0.5)] text-white"
    : "border-[rgba(11,103,220,0.4)] bg-[rgba(255,255,255,0.75)] text-[var(--color-text)]";
  const cardBorderClass = isDark ? "border-white/20" : "border-[var(--color-border)]";
  const cardBgClass = isDark ? "bg-[rgba(2,7,17,0.45)]" : "bg-[rgba(255,255,255,0.7)]";
  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";
  const heroImage = isDark ? "/320d/hero_dark.webp" : "/320d/hero_light.webp";
  const heroImageMobile = isDark ? "/320d/hero_mobile_dark1.webp" : "/320d/hero_mobile_light1.webp";

  return (
    <section className={`relative overflow-hidden text-[var(--color-text)] ${sectionBgClass(band)} ${headingClass}`}>
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
          {metaItems.length > 0 ? (
            <span className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[8px] border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-2.5 md:py-1.5 md:text-[0.78rem] ${tagPillClass}`}>
              <HomeIcon name="engine" size={28} className="h-7 w-7 shrink-0 md:h-5.5 md:w-5.5" />
              {metaItems.map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-x-2">
                  {index > 0 ? <span aria-hidden="true" className="opacity-50">•</span> : null}
                  <span className={index === 1 ? "font-semibold text-[var(--color-primary)]" : ""}>{item}</span>
                </span>
              ))}
            </span>
          ) : null}

          <HeroTitle title={data.h1} headingClass={headingClass} accentText={accentToken} />
          <span
            className="mt-2 block h-px w-[7.5rem] md:w-[9rem]"
            style={{
              background: "linear-gradient(to right, var(--color-accent) 0 38%, var(--color-border) 38% 100%)",
            }}
            aria-hidden="true"
          />

          <p
            className={`max-w-[78%] text-[0.88rem] leading-[1.42] md:max-w-[620px] md:text-[17px] md:leading-[1.45] ${
              isDark
                ? "text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] md:text-white/85 md:[text-shadow:none]"
                : "text-black/90 [text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_10px_rgba(255,255,255,0.85)] md:text-[var(--color-text-muted)] md:[text-shadow:none]"
            }`}
          >
            {description.split("[BMW-VERIFIED]").map((part, index, array) => (
              <span key={`${part}-${index}`}>
                {part}
                {index < array.length - 1 ? <span className="text-[var(--color-primary)]">[BMW-VERIFIED]</span> : null}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-4 flex w-full flex-col gap-2.5 md:mt-4 md:gap-3">
          {data.primaryCta ? (
            <Link
              href="/quote"
              className="btn-cta flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 py-3 text-[0.85rem] font-bold text-white no-underline shadow-[0_12px_28px_var(--color-shadow)] md:w-fit md:px-6 md:py-3.5 md:text-[0.95rem]"
            >
              <span>{ctaLabel}</span>
              <ArrowIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
            </Link>
          ) : null}

          {data.trustStrip?.length > 0 ? (
            <>
              {/* Mobile: all 4 badges in one row */}
              <div className={`rounded-[8px] border ${cardBorderClass} ${cardBgClass} p-2 backdrop-blur-sm md:hidden`}>
                <div className="grid grid-cols-4 items-stretch gap-x-1">
                  {data.trustStrip.map((item, index) => {
                    const stat = splitStatLabel(item.label);
                    const label = (stat.lines || []).filter(Boolean).join(" ") || "";
                    return (
                      <div
                        key={`${item.label}-${index}`}
                        className={`flex flex-col items-center justify-center gap-1 px-0.5 text-center ${index > 0 ? `border-l ${isDark ? "border-white/35" : "border-[rgba(7,24,39,0.25)]"}` : ""}`}
                      >
                        <HomeIcon name={STAT_ICONS[index % STAT_ICONS.length]} size={44} className="h-11 w-11 shrink-0" />
                        {stat.value ? (
                          <strong className={`w-full text-center text-[0.78rem] font-bold leading-none ${headingClass}`}>{stat.value}</strong>
                        ) : null}
                        <span className={`w-full text-center text-[0.58rem] leading-tight ${badgeTextClass}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop: original badge cards */}
              <ul
                className={`relative z-10 hidden w-full max-w-[980px] grid-cols-4 gap-0 overflow-hidden rounded-[8px] border shadow-[0_22px_56px_rgba(0,0,0,0.24)] md:grid ${
                  isDark
                    ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.74)_0%,rgba(3,10,23,0.86)_100%)]"
                    : "border-[rgba(11,103,220,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(239,245,252,0.94)_100%)]"
                }`}
              >
                {data.trustStrip.map((item, index) => (
                  <StatCard key={`${item.label}-${index}`} item={item} index={index} isDark={isDark} />
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
