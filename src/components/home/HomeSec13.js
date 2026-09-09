"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function TrustpilotMark({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="#00b67a">
      <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
    </svg>
  );
}

function StarBox({ faded = false }) {
  return (
    <span className={`flex h-5 w-5 items-center justify-center text-white md:h-6 md:w-6 ${faded ? "bg-[#9ed9c0]" : "bg-[#00b67a]"}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
      </svg>
    </span>
  );
}

function QuoteMark({ className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="#00b67a">
      <path d="M7.2 18c-1.9 0-3.4-.6-4.4-1.8C1.6 14.8 1 13 1 10.8 1 6.8 3.2 3.7 7.6 1.5l1.2 1.8C6.2 4.8 4.8 6.6 4.4 8.8c.6-.4 1.4-.6 2.4-.6 1.2 0 2.2.4 3 1.2.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.8-1.8 1.2-2.8 1.2Zm12 0c-1.9 0-3.4-.6-4.4-1.8-1.2-1.4-1.8-3.2-1.8-5.4 0-4 2.2-7.1 6.6-9.3l1.2 1.8c-2.6 1.5-4 3.3-4.4 5.5.6-.4 1.4-.6 2.4-.6 1.2 0 2.2.4 3 1.2.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.8-1.8 1.2-2.6 1.2Z" />
    </svg>
  );
}

function StatItem({ stat, isDark, compact = false }) {
  return (
    <div
      className={
        compact
          ? `rounded-md border px-3 py-3 text-center ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"}`
          : "flex items-center gap-2.5"
      }
    >
      <HomeIcon name={stat.icon} size={compact ? 28 : 22} tone="auto" className={compact ? "mx-auto h-7 w-7" : "h-5 w-5 shrink-0"} />
      <div className={compact ? "mt-2" : "min-w-0"}>
        <p className={`text-[0.88rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-primary)]"}`}>{stat.value}</p>
        <p className={`text-[0.72rem] leading-tight ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>{stat.label}</p>
      </div>
    </div>
  );
}

function CtaCard({ cta, variant = "primary", isDark }) {
  if (!cta) return null;
  const dark = variant === "primary";

  return (
    <Link
      href={cta.href || "#"}
      className={`flex items-center gap-3 rounded-md px-4 py-4 transition-opacity hover:opacity-95 md:gap-4 md:px-5 md:py-5 ${
        dark
          ? isDark
            ? "bg-[var(--color-chrome)] text-white"
            : "bg-[var(--color-primary)] text-white"
          : isDark
            ? "border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
            : "border border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border md:h-14 md:w-14 ${
          dark ? "border-[var(--color-accent)]/50 bg-white/5" : isDark ? "border-white/15 bg-white/5" : "border-[var(--color-border)] bg-white"
        }`}
      >
        <HomeIcon name={cta.icon} size={28} tone={dark ? "silver" : "auto"} className="h-7 w-7" />
      </span>

      <span className="min-w-0 flex-1">
        <span className={`block text-[0.68rem] font-bold uppercase tracking-[0.08em] ${dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"}`}>
          {cta.eyebrow}
        </span>
        <span
          className={`mt-1 block font-lora text-[1.05rem] font-medium leading-tight md:text-[1.2rem] ${
            dark ? "text-white" : isDark ? "text-white" : "text-[var(--color-text)]"
          }`}
        >
          {cta.title}
        </span>
      </span>

      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border md:h-11 md:w-11 ${
          dark
            ? "border-[var(--color-accent)] text-[var(--color-accent)]"
            : isDark
              ? "border-white/30 text-white"
              : "border-[var(--color-primary)] text-[var(--color-primary)]"
        }`}
      >
        <ArrowIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}

function TrustBar({ review, isDark }) {
  if (!review) return null;

  return (
    <div
      className={`mt-4 overflow-hidden rounded-md border px-3 py-3 md:px-4 md:py-4 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      {/* Desktop: one row */}
      <div className="hidden items-center gap-4 lg:flex lg:gap-6">
        <div className="flex shrink-0 items-center gap-1.5">
          <TrustpilotMark className="h-5 w-5" />
          <span className={`text-[0.95rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{review.brand}</span>
        </div>
        <div className="flex shrink-0 gap-0.5">
          {Array.from({ length: review.stars || 5 }).map((_, index) => (
            <StarBox key={index} faded={index === (review.stars || 5) - 1} />
          ))}
        </div>
        <p className={`shrink-0 text-[0.88rem] ${isDark ? "text-white/80" : "text-[var(--color-text)]"}`}>
          <strong>{review.score}</strong> {review.reviews}
        </p>
        <div className={`flex min-w-0 flex-1 items-center gap-2 border-l pl-4 ${isDark ? "border-white/15" : "border-[var(--color-border)]"}`}>
          <QuoteMark className="h-5 w-5 shrink-0" />
          <p className={`font-lora text-[0.9rem] italic leading-snug ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
            {review.quote}
          </p>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="lg:hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1.5">
            <TrustpilotMark className="h-5 w-5" />
            <span className={`text-[0.88rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{review.brand}</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: review.stars || 5 }).map((_, index) => (
              <StarBox key={index} faded={index === (review.stars || 5) - 1} />
            ))}
          </div>
          <p className={`text-[0.8rem] ${isDark ? "text-white/80" : "text-[var(--color-text)]"}`}>
            <strong>{review.score}</strong> {review.reviews}
          </p>
        </div>
        <div className={`mt-3 flex items-start gap-2 border-t pt-3 ${isDark ? "border-white/12" : "border-[var(--color-border)]"}`}>
          <QuoteMark className="mt-0.5 h-5 w-5 shrink-0" />
          <p className={`font-lora text-[0.82rem] italic leading-snug ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
            {review.quote}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomeSec13({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const headerImage = data.headerImage?.src || "/right.webp";
  const stats = data.stats || [];

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${sectionBgClass(band)}`} style={{ "--section-fade": rgb }}>
      <div className="absolute inset-x-0 top-0 hidden h-[320px] md:block">
        <Image
          src={headerImage}
          alt={data.headerImage?.alt || ""}
          fill
          className="object-cover object-[72%_center]"
          sizes="100vw"
        />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.78)_44%,rgba(var(--section-fade),0.18)_82%)]"
              : "absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--section-fade),0.98)_0%,rgba(var(--section-fade),0.84)_44%,rgba(var(--section-fade),0.12)_82%)]"
          }
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="relative max-w-[640px]">
          <HeadingEyebrow text={data.eyebrow || "FINAL CTA"} />
          <h2
            className={`mt-3 text-[2rem] font-medium leading-[1.08] tracking-normal md:text-[3rem] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            Get the Right Answer.{" "}
            <span className={isDark ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"}>Not Just Any Answer.</span>
          </h2>
          <p className={`mt-4 text-[0.95rem] leading-[1.45] md:text-[1.05rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
            {data.subHeadline}
          </p>
        </div>

        {/* Desktop stats: one row */}
        <div
          className={`mt-6 hidden grid-cols-4 gap-0 overflow-hidden rounded-md border md:grid ${
            isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={`${stat.value}-${stat.label}`}
              className={`px-4 py-4 ${index > 0 ? (isDark ? "border-l border-white/10" : "border-l border-[var(--color-border)]") : ""}`}
            >
              <StatItem stat={stat} isDark={isDark} />
            </div>
          ))}
        </div>

        {/* Mobile stats: 2x2 cards in one visual block */}
        <div className="mt-5 grid grid-cols-2 gap-2 md:hidden">
          {stats.map((stat) => (
            <StatItem key={`${stat.value}-${stat.label}`} stat={stat} isDark={isDark} compact />
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:mt-5 md:grid-cols-2">
          <CtaCard cta={data.primaryCta} variant="primary" isDark={isDark} />
          <CtaCard cta={data.secondaryCta} variant="secondary" isDark={isDark} />
        </div>

        <TrustBar review={data.review} isDark={isDark} />
      </div>
    </section>
  );
}
