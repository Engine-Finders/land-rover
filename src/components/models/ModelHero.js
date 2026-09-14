"use client";

import Image from "next/image";
import Link from "next/link";
import { Lora } from "next/font/google";
import { HomeIcon, HOME_ICON_FILES } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionButton, sectionDescription, sectionH1 } from "@/components/models/sectionTypography";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const STAT_ICONS = ["realEnquiries", "repairVsReplace", "knowledgeCentre", "engineFinders"];

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function MetaIcon({ type }) {
  const path =
    type === "engine" ? (
      <path d="M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6" />
    ) : (
      <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
    );

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="2">
      {path}
    </svg>
  );
}

function MetaSeparator() {
  return (
    <span aria-hidden="true" className="text-[var(--color-text-muted)]">
      {"\u2022"}
    </span>
  );
}

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return {
    model: parts[0] || "",
    years: parts[1] || "",
    generations: parts[2] || "",
    engines: parts.slice(3).join(" • "),
  };
}

function splitStat(label = "") {
  const [main, ...detailParts] = label.split(/\s*[—–]\s*/);
  const detail = detailParts.join(" — ").trim();
  const match = main.match(/^(\d+\+?)\s+(.+)$/);

  if (match) {
    return { value: match[1], label: match[2], detail };
  }

  return { value: "", label: main.trim(), detail };
}

function highlightVerified(text = "") {
  return text.replace(
    /\[EM-VERIFIED\]/g,
    '<span class="font-semibold text-[var(--color-primary)]">[EM-VERIFIED]</span>'
  );
}

function HeroTitle({ title, isDark }) {
  const guideMarker = "The Complete UK Guide";
  const guideIndex = title.indexOf(guideMarker);
  const base = `${lora.className} max-w-[760px] font-medium tracking-normal ${sectionH1}`;

  if (guideIndex === -1) {
    return <h1 className={`${base} ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{title}</h1>;
  }

  return (
    <h1 className={`${base} ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
      {title.slice(0, guideIndex)}
      <span className="text-[var(--color-primary)]">{title.slice(guideIndex)}</span>
    </h1>
  );
}

function StatIcon({ name, isDark }) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-16 md:w-16 ${
        isDark
          ? "border border-white/35 bg-transparent"
          : "bg-[var(--color-primary)]"
      }`}
    >
      <HomeIcon name={name} size={52} tone="silver" className="h-8 w-8 md:h-11 md:w-11" />
    </span>
  );
}

function StatCard({ item, index, isDark }) {
  const iconName = HOME_ICON_FILES[item.icon] ? item.icon : STAT_ICONS[index] || STAT_ICONS[0];
  const stat = splitStat(item.label || item.text || "");
  const isPartOf = /^part of\b/i.test(stat.label);

  return (
    <li
      className={`flex min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-2.5 text-center md:min-h-0 md:flex-row md:items-center md:justify-start md:gap-3.5 md:px-4 md:py-4 md:text-left ${
        index > 0 ? (isDark ? "border-l border-white/12" : "border-l border-[var(--color-border)]") : ""
      }`}
    >
      <StatIcon name={iconName} isDark={isDark} />
      <div className="min-w-0 flex-1">
        {isPartOf ? (
          <p className={`leading-[1.25] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            <span className="block text-[0.55rem] font-medium opacity-80 md:text-[0.78rem]">Part of</span>
            <strong className="text-[0.62rem] font-bold md:text-[1.05rem]">Engine Finders</strong>
          </p>
        ) : (
          <>
            <p className={`leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {stat.value ? (
                <>
                  <span className="block text-[0.85rem] font-bold text-[var(--color-primary)] md:inline md:text-[1.35rem]">{stat.value}</span>{" "}
                  <span
                    className="text-[0.52rem] font-semibold md:text-[0.84rem]"
                    dangerouslySetInnerHTML={{ __html: highlightVerified(stat.label) }}
                  />
                </>
              ) : (
                <span
                  className="text-[0.58rem] font-semibold md:text-[0.88rem]"
                  dangerouslySetInnerHTML={{ __html: highlightVerified(stat.label) }}
                />
              )}
            </p>
            {stat.detail ? (
              <p className={`mt-0.5 hidden text-[0.72rem] leading-[1.3] md:mt-1 md:block ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
                {stat.detail}
              </p>
            ) : null}
          </>
        )}
      </div>
    </li>
  );
}

export default function ModelHero({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const meta = splitTagPill(data.tagPill);
  const ctaLabel = (data.primaryCta?.label || "").replace(/\s*(?:→|â†’|->)\s*$/, "");

  return (
    <section
      className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden text-[var(--color-text)] md:min-h-[620px] ${sectionBgClass(band)}`}
    >
      <div className="absolute inset-0">
        <Image
          src="/model/Hero-bg-image.webp"
          alt=""
          fill
          className="object-cover object-[62%_center] md:object-center"
          sizes="100vw"
          priority
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(100deg,rgba(13,28,24,0.97)_0%,rgba(13,28,24,0.9)_40%,rgba(13,28,24,0.28)_68%,rgba(13,28,24,0.1)_100%)]"
              : "bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,rgba(248,247,242,0.92)_34%,rgba(248,247,242,0.28)_66%,rgba(248,247,242,0)_100%)]"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-[48%] hidden w-14 -skew-x-[18deg] md:block ${
            isDark ? "bg-[rgba(105,181,138,0.18)]" : "bg-[rgba(23,95,70,0.14)]"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-36 md:h-44 ${
            isDark
              ? "bg-[linear-gradient(0deg,rgba(13,28,24,1)_0%,transparent_100%)]"
              : "bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-3 md:min-h-[620px] md:px-8 md:pb-7 md:pt-11">
        <div className="max-w-[650px]">
          <div
            className={`inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 rounded-md border px-3 py-2 text-[13px] leading-[1.35] md:max-w-[680px] md:px-4 md:py-2.5 md:text-[15px] md:leading-[1.45] ${
              isDark
                ? "border-white/25 bg-[rgba(13,28,24,0.55)] text-white/88"
                : "border-[var(--color-border)] bg-white/70 text-[var(--color-text-muted)]"
            }`}
          >
            <MetaIcon />
            <strong className="font-semibold text-[var(--color-primary)]">{meta.model}</strong>
            <MetaSeparator />
            <span>{meta.years}</span>
            <MetaSeparator />
            <span>{meta.generations}</span>
            <MetaSeparator />
            <MetaIcon type="engine" />
            <span>{meta.engines}</span>
          </div>

          <div className="mt-6 md:mt-8">
            <HeroTitle title={data.h1} isDark={isDark} />
          </div>

          <p
            className={`mt-4 max-w-[610px] ${sectionDescription} ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}
            dangerouslySetInnerHTML={{ __html: highlightVerified(data.subHeadline) }}
          />

          {data.primaryCta ? (
            <Link
              href={data.primaryCta.href && data.primaryCta.href !== "#" ? data.primaryCta.href : "/quote"}
              className={`btn-cta mt-8 inline-flex min-h-10 items-center justify-center gap-3 rounded-md px-4 py-2 font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] ${sectionButton} md:mt-5 md:min-h-11 md:px-5 ${
                isDark
                  ? "border border-[var(--color-accent)] bg-[rgba(13,28,24,0.88)]"
                  : "bg-[var(--color-primary)]"
              }`}
            >
              <span>{ctaLabel}</span>
              <ArrowIcon className={isDark ? "h-5 w-5 text-[var(--color-accent)]" : "h-5 w-5"} />
            </Link>
          ) : null}
        </div>

        {data.trustStrip?.length > 0 ? (
          <ul
            className={`mt-5 grid w-full grid-cols-4 gap-0 overflow-hidden rounded-lg border shadow-[0_14px_36px_var(--color-shadow)] md:mt-6 md:w-[92%] md:max-w-[78rem] md:self-start ${
              isDark
                ? "border-white/12 bg-[rgba(16,28,24,0.72)]"
                : "border-[var(--color-border)] bg-white/92"
            }`}
          >
            {data.trustStrip.map((item, index) => (
              <StatCard key={item.label || item.text || index} item={item} index={index} isDark={isDark} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
