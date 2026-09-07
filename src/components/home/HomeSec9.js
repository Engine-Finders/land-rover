"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";

const severityStyles = {
  catastrophic: {
    badge: "border-[#f0b8bc] bg-[#fff0f1] text-[#c42430]",
    darkBadge: "border-[rgba(238,124,130,0.4)] bg-[rgba(238,124,130,0.14)] text-[#ff9aa0]",
    dot: "bg-[#df232a]",
  },
  immediate: {
    badge: "border-[#f5d0a8] bg-[#fff6ea] text-[#d97810]",
    darkBadge: "border-[rgba(224,137,58,0.4)] bg-[rgba(224,137,58,0.14)] text-[#ffba6c]",
    dot: "bg-[#e0893a]",
  },
  monitor: {
    badge: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]",
    darkBadge: "border-[rgba(222,177,65,0.4)] bg-[rgba(222,177,65,0.14)] text-[#ffd473]",
    dot: "bg-[#d4aa68]",
  },
  low: {
    badge: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkBadge: "border-[rgba(123,195,154,0.4)] bg-[rgba(123,195,154,0.14)] text-[#7bc39a]",
    dot: "bg-[#2f805c]",
  },
};

function SeverityBadge({ severity, isDark }) {
  const tone = severityStyles[severity?.type] || severityStyles.monitor;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.04em] ${
        isDark ? tone.darkBadge : tone.badge
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
      {severity?.label}
    </span>
  );
}

function CategoryHeading({ category, isDark }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:rounded-md ${
          isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <HomeIcon name={category.icon} size={28} tone="silver" className="h-6 w-6" />
      </span>
      <h3 className={`shrink-0 text-[0.92rem] font-bold uppercase tracking-[0.06em] ${isDark ? "text-white" : "text-[var(--color-primary)]"}`}>
        {category.title}
      </h3>
      <span className={`h-px min-w-0 flex-1 ${isDark ? "bg-[var(--color-border)]" : "bg-[var(--color-border)]"}`} />
    </div>
  );
}

function MobileRow({ item, isDark }) {
  return (
    <Link
      href={item.href || "#"}
      className={`grid grid-cols-[56px_26px_minmax(0,1fr)_auto] items-center gap-2 border-b py-2 last:border-b-0 ${
        isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"
      }`}
    >
      <span className="relative h-11 w-14 overflow-hidden rounded">
        <Image src={item.image?.src || "/engine.webp"} alt={item.image?.alt || ""} fill className="object-cover" sizes="56px" />
      </span>

      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.64rem] font-bold ${
          isDark ? "bg-white/10 text-white/70" : "bg-[var(--color-page-soft)] text-[var(--color-text-soft)]"
        }`}
      >
        {item.id}
      </span>

      <span className="min-w-0">
        <span className={`block text-[0.86rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {item.title}
        </span>
        <span className={`mt-0.5 block text-[0.7rem] leading-[1.3] ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
          {item.description}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-1">
        <SeverityBadge severity={item.severity} isDark={isDark} />
        <span className="text-[0.68rem] font-semibold text-[var(--color-primary)]">Read more →</span>
      </span>
    </Link>
  );
}

function DesktopCard({ item, isDark }) {
  return (
    <Link
      href={item.href || "#"}
      className={`relative flex h-full flex-col rounded-xl border p-3.5 shadow-[0_10px_28px_var(--color-shadow)] transition hover:border-[var(--color-primary)] ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <span
        className={`absolute left-3 top-3 z-10 rounded px-1.5 py-0.5 text-[0.68rem] font-bold ${
          isDark ? "bg-white/10 text-white/70" : "bg-[var(--color-page-soft)] text-[var(--color-text-soft)]"
        }`}
      >
        {item.id}
      </span>

      <div className="flex items-start gap-3 pt-1">
        <span className="relative mt-5 h-16 w-[4.5rem] shrink-0 overflow-hidden rounded">
          <Image src={item.image?.src || "/engine.webp"} alt={item.image?.alt || ""} fill className="object-cover" sizes="72px" />
        </span>
        <div className="min-w-0 pt-5">
          <h4 className={`text-[0.95rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {item.title}
          </h4>
          <p className={`mt-1.5 text-[0.74rem] leading-[1.4] ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <SeverityBadge severity={item.severity} isDark={isDark} />
        <span className="text-[0.78rem] font-semibold text-[var(--color-primary)]">Read more →</span>
      </div>
    </Link>
  );
}

function CategoryBlock({ category, isDark }) {
  const items = category.items || [];

  return (
    <section>
      <CategoryHeading category={category} isDark={isDark} />

      <div className="md:hidden">
        {items.map((item) => (
          <MobileRow key={`${category.id}-${item.id}`} item={item} isDark={isDark} />
        ))}
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <DesktopCard key={`${category.id}-${item.id}`} item={item} isDark={isDark} />
        ))}
      </div>
    </section>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-2 flex items-start gap-3 rounded-md border px-4 py-4 md:items-center md:gap-4 md:px-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <HomeIcon name={note.icon || "realData"} size={28} tone="silver" className="h-6 w-6" />
      </span>
      <p className={`text-[0.8rem] leading-[1.45] md:text-[0.88rem] ${isDark ? "text-white/82" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.title}</strong> {note.text}
      </p>
    </div>
  );
}

export default function HomeSec9({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const categories = data.categories || [];

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-9 ${isDark ? "bg-[#0d1c18]" : "bg-[var(--color-page)]"}`}>
      <div className="relative mx-auto w-full max-w-8xl">
        <div className="mx-auto max-w-[780px] text-center">
          <HeadingEyebrow text={data.eyebrow || "FAILURE DATABASE"} align="center" />
          <h2
            className={`mt-3 text-[2rem] font-medium leading-[1.12] tracking-normal md:text-[3rem] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            The Land Rover &amp; Range Rover <span className="text-[var(--color-primary)]">Failure Database</span>
          </h2>
          <p
            className={`mx-auto mt-4 max-w-[640px] text-[0.9rem] leading-[1.5] md:text-[1.02rem] ${
              isDark ? "text-white/78" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />
        </div>

        <div className="mt-7 grid gap-6 md:mt-9 md:gap-8">
          {categories.map((category) => (
            <CategoryBlock key={category.id} category={category} isDark={isDark} />
          ))}
          <DataNote note={data.dataNote} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
