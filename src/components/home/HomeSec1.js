"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";

import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function TrustStrip({ items, isDark }) {
  // Mobile strip sits on the dark hero wash — keep a dark glass shell there.
  const shell = isDark
    ? "border-white/14 bg-[rgba(16,28,24,0.55)]"
    : "border-white/18 bg-[rgba(12,22,18,0.55)] md:border-[var(--color-glass-border)] md:bg-[var(--color-surface-glass)]";
  const cellBorder = isDark
    ? "border-white/12"
    : "border-white/14 md:border-[var(--color-border)]";
  const valueClass = isDark
    ? "text-white"
    : "text-white md:text-[var(--color-text)]";
  const textClass = isDark
    ? "text-white/78"
    : "text-white/82 md:text-[var(--color-text-muted)]";

  return (
    <ul
      className={`grid grid-cols-4 overflow-hidden rounded-2xl border shadow-[0_14px_34px_var(--color-shadow)] backdrop-blur-xl ${shell}`}
    >
      {items.map((item) => (
        <li
          key={`${item.value}-${item.text}`}
          className={`flex flex-col items-center gap-1.5 border-r px-1.5 py-3.5 text-center last:border-r-0 md:flex-row md:items-start md:gap-3 md:px-4 md:py-5 md:text-left ${cellBorder}`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center md:mt-0.5 md:h-14 md:w-14">
            {/* Mobile: always Silver icons (day + night). Desktop: theme auto. */}
            <HomeIcon name={item.icon} size={56} tone="silver" className="h-10 w-10 md:hidden" />
            <HomeIcon
              name={item.icon}
              size={64}
              tone={isDark ? "silver" : "black"}
              className="hidden h-14 w-14 md:block"
            />
          </span>
          <span className="min-w-0">
            {item.value ? (
              <strong className={`block text-[0.72rem] font-bold leading-tight md:text-[1.1rem] ${valueClass}`}>
                {item.value}
              </strong>
            ) : null}
            <span className={`mt-0.5 block text-[0.58rem] leading-[1.2] md:hidden ${textClass}`}>
              {item.mobileText || item.text}
            </span>
            <span className={`mt-0.5 hidden text-[0.84rem] leading-[1.28] md:block ${textClass}`}>
              {item.text}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function BridgeEyebrow({ text }) {
  if (!text) return null;

  return (
    <p className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)] md:text-[0.72rem]">
      {text}
    </p>
  );
}

function BridgeHeading({ isDark }) {
  return (
    <div className="mt-3 flex w-full items-center justify-center gap-3 md:gap-5">
      <span className="hidden h-px w-14 shrink-0 bg-[var(--color-accent)] sm:block md:w-24 lg:w-32" aria-hidden="true" />
      <h2
        className={`max-w-[18rem] text-center text-[1.55rem] font-medium leading-[1.15] tracking-normal sm:max-w-none md:text-[2.5rem] ${
          isDark ? "text-white" : "text-[var(--color-text)]"
        }`}
      >
        Real Data. Real Experts.{" "}
        <span className={isDark ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"}>Real Trust.</span>
      </h2>
      <span className="hidden h-px w-14 shrink-0 bg-[var(--color-accent)] sm:block md:w-24 lg:w-32" aria-hidden="true" />
    </div>
  );
}

function BridgeSection({ bridge, isDark }) {
  if (!bridge?.badges?.length) return null;

  return (
    <div className={`relative ${sectionBgClass("page")}`}>
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.14] ${
          isDark
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(180,134,63,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(105,181,138,0.12),transparent_45%)]"
            : "bg-[radial-gradient(circle_at_18%_20%,rgba(23,95,70,0.08),transparent_42%),radial-gradient(circle_at_82%_70%,rgba(180,134,63,0.1),transparent_46%)]"
        }`}
      />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-8 pt-5 md:px-8 md:pb-10 md:pt-6">
        <BridgeEyebrow text={bridge.eyebrow} />
        <BridgeHeading isDark={isDark} />

        <ul className="mt-6 grid grid-cols-2 gap-0 lg:grid-cols-4">
          {bridge.badges.map((badge, index) => (
            <li
              key={badge.title}
              className={`flex flex-col items-center px-3 py-5 text-center md:px-5 md:py-2 ${
                index % 2 === 1
                  ? isDark
                    ? "border-l border-white/12"
                    : "border-l border-[var(--color-border)]"
                  : ""
              } ${
                index >= 2
                  ? isDark
                    ? "border-t border-white/12 lg:border-t-0"
                    : "border-t border-[var(--color-border)] lg:border-t-0"
                  : ""
              } ${
                index > 0
                  ? isDark
                    ? "lg:border-l lg:border-white/12"
                    : "lg:border-l lg:border-[var(--color-border)]"
                  : ""
              }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full border md:h-16 md:w-16 ${
                  isDark
                    ? "border-[rgba(180,134,63,0.45)] bg-[rgba(20,39,33,0.7)]"
                    : "border-[rgba(23,95,70,0.35)] bg-white/80"
                }`}
              >
                <HomeIcon name={badge.icon} size={48} tone={isDark ? "silver" : "black"} className="h-10 w-10 md:h-12 md:w-12" />
              </span>
              <p className={`mt-4 text-[0.92rem] font-bold leading-[1.25] md:text-[1rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {badge.title}
              </p>
              <p className={`mt-2 max-w-[240px] text-[0.8rem] leading-[1.4] md:text-[0.86rem] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
                {badge.text}
              </p>
              <span className="mt-4 block h-px w-10 bg-[var(--color-accent)]" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HomeSec1({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const heroImageSrc = isDark ? "/Hero-dark.webp" : "/hero-day.webp";
  const ctaHref = data.cta?.href && data.cta.href !== "#" ? data.cta.href : "/quote";
  const trustStrip = data.trustStrip || [];
  const badge = data.independentBadge;

  return (
    <section className={`relative overflow-hidden ${sectionBgClass(band)} text-[var(--color-text)]`} style={{ "--section-fade": rgb }}>
      {/* Hero + trust bridge (same section) */}
      <div className="relative md:min-h-[640px]">
        <div className="absolute inset-0">
          <Image
            src={heroImageSrc}
            alt={data.image?.alt || ""}
            fill
            className="object-cover object-[62%_center] md:object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,14,0.9)_0%,rgba(8,16,14,0.72)_45%,rgba(8,16,14,0.55)_72%,rgba(8,16,14,0.9)_100%)] md:hidden" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_38%,transparent_74%)] md:block" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_22%)] md:block" />
        </div>

        <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-8 pt-7 md:min-h-[640px] md:justify-center md:px-8 md:pb-6 md:pt-12">
          <div className="relative flex w-full flex-col items-stretch gap-4 text-left md:max-w-[720px] md:items-start md:gap-5">
            <HeadingEyebrow text={data.eyebrow} />

            <h1
              className="max-w-[34rem] text-[1.85rem] font-medium leading-[1.12] tracking-normal text-white md:max-w-[700px] md:text-[3rem] md:leading-[1.05] md:text-[var(--color-text)]"
            >
              The UK&apos;s Most Trusted Land Rover &amp; Range Rover{" "}
              <span className="text-[var(--color-primary)]">Ownership Guide</span>
            </h1>

            <p
              className="max-w-[34rem] text-[0.86rem] leading-[1.5] text-white/88 md:max-w-[620px] md:text-[1.05rem] md:text-[var(--color-text-muted)]"
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />

            <div className="mt-[30vh] w-[min(100%,26rem)] self-center md:hidden">
              <TrustStrip items={trustStrip} isDark={isDark} />
            </div>

            <div className="mt-1 flex w-full flex-col items-center gap-4 self-center sm:flex-row sm:items-center md:w-auto md:self-start md:justify-start">
              <Link
                href={ctaHref}
                className="btn-cta inline-flex min-h-12 w-full max-w-[26rem] items-center justify-center gap-3 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-[0.86rem] font-bold tracking-[0.06em] text-white shadow-[0_12px_28px_var(--color-shadow)] md:w-fit md:rounded-md md:tracking-[0.04em]"
              >
                <span>{data.cta?.label || "START YOUR RESEARCH"}</span>
                <ArrowIcon className="h-4 w-4" />
              </Link>

              {badge ? (
                <div className="hidden items-center gap-3 md:flex">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                    <HomeIcon
                      name={badge.icon || "check"}
                      size={48}
                      tone={isDark ? "silver" : "black"}
                      className="h-11 w-11"
                    />
                  </span>
                  <p className={`text-[0.82rem] leading-[1.35] ${isDark ? "text-white/82" : "text-[var(--color-text-muted)]"}`}>
                    {(badge.lines || []).map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Desktop trust strip — 54rem so copy wraps to ~2 lines */}
          <div className="mt-8 hidden w-[min(100%,54rem)] md:block">
            <TrustStrip items={trustStrip} isDark={isDark} />
          </div>
        </div>
      </div>

      <BridgeSection bridge={data.bridge} isDark={isDark} />
    </section>
  );
}
