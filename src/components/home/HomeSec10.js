"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


const riskStyles = {
  catastrophic: {
    badge: "border-[#f0b8bc] bg-[#fff0f1] text-[#c42430]",
    darkBadge: "border-[rgba(238,124,130,0.4)] bg-[rgba(238,124,130,0.14)] text-[#ff9aa0]",
    icon: "text-[#df232a]",
  },
  monitor: {
    badge: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]",
    darkBadge: "border-[rgba(222,177,65,0.4)] bg-[rgba(222,177,65,0.14)] text-[#ffd473]",
    icon: "text-[#e0893a]",
  },
};

const rowBorder = (isDark) => (isDark ? "border-white/[0.06]" : "border-black/[0.06]");

function PanelShell({ children, isDark, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      } ${className}`}
    >
      {children}
    </section>
  );
}

function PanelHeader({ title, subtitle, icon, isDark, tone = "green" }) {
  const bar =
    tone === "danger"
      ? isDark
        ? "bg-[#6b2a2e]"
        : "bg-[#7a3034]"
      : isDark
        ? "bg-[var(--color-chrome)]"
        : "bg-[var(--color-primary)]";

  return (
    <div className={`flex items-center gap-2.5 px-3 py-3 text-white ${bar}`}>
      {icon ? <HomeIcon name={icon} size={22} tone="silver" className="h-5 w-5" /> : null}
      <div className="min-w-0">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.07em]">{title}</p>
        {subtitle ? <p className="text-[0.62rem] font-semibold uppercase tracking-[0.05em] text-white/75">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function VerifiedTag() {
  return <span className="text-[0.58rem] font-bold uppercase tracking-[0.04em] text-[var(--color-accent-green)]">[EM-VERIFIED]</span>;
}

function WarningIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 9v4m0 4h.01M10.3 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L13.7 4.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function EnginesCard({ data, isDark }) {
  if (!data) return null;

  return (
    <PanelShell isDark={isDark}>
      <PanelHeader title={data.title} icon={data.icon || "engine"} isDark={isDark} />
      <ul>
        {(data.rows || []).map((row) => (
          <li
            key={row.code}
            className={`flex items-center gap-2.5 border-b px-3 py-2 last:border-b-0 ${rowBorder(isDark)}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[0.68rem] font-bold text-white">
              {row.rank}
            </span>
            <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded">
              <Image src="/engine.webp" alt="" fill className="object-cover" sizes="48px" />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[0.8rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {row.code} <span className={`font-semibold ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>{row.label}</span>
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-page-soft)]">
                <div className="h-full rounded-full bg-[var(--color-accent-green)]" style={{ width: `${row.pct || 50}%` }} />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-[0.82rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.enquiries}</p>
              <VerifiedTag />
            </div>
          </li>
        ))}
      </ul>
      {data.footerLabel ? (
        <Link href={data.footerHref || "#"} className={`block border-t px-3 py-2.5 text-[0.78rem] font-semibold text-[var(--color-primary)] ${rowBorder(isDark)}`}>
          {data.footerLabel}
        </Link>
      ) : null}
    </PanelShell>
  );
}

function ModelsCard({ data, isDark }) {
  if (!data) return null;

  return (
    <PanelShell isDark={isDark}>
      <PanelHeader title={data.title} icon={data.icon || "vehicle"} isDark={isDark} />
      <ul>
        {(data.rows || []).map((row) => (
          <li
            key={row.model}
            className={`flex items-center gap-2.5 border-b px-3 py-2 last:border-b-0 ${rowBorder(isDark)}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold text-white ${
                isDark ? "bg-[var(--color-chrome)]" : "bg-[#0d1c18]"
              }`}
            >
              {row.rank}
            </span>
            <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded">
              <Image src="/right.webp" alt="" fill className="object-cover" sizes="48px" />
            </span>
            <p className={`min-w-0 flex-1 text-[0.8rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {row.model}
            </p>
            <div className="shrink-0 text-right">
              <p className={`text-[0.82rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.enquiries}</p>
              <VerifiedTag />
            </div>
          </li>
        ))}
      </ul>
      {data.footerLabel ? (
        <Link href={data.footerHref || "#"} className={`block border-t px-3 py-2.5 text-[0.78rem] font-semibold text-[var(--color-primary)] ${rowBorder(isDark)}`}>
          {data.footerLabel}
        </Link>
      ) : null}
    </PanelShell>
  );
}

function CostsCard({ data, isDark }) {
  if (!data) return null;

  return (
    <PanelShell isDark={isDark}>
      <PanelHeader title={data.title} subtitle={data.subtitle} icon={data.icon || "checkValue"} isDark={isDark} />
      <ul>
        {(data.rows || []).map((row) => (
          <li
            key={row.code}
            className={`flex items-center gap-2.5 border-b px-3 py-3.5 last:border-b-0 ${rowBorder(isDark)}`}
          >
            <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded">
              <Image src="/engine.webp" alt="" fill className="object-cover" sizes="48px" />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[0.8rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.code}</p>
              <p className={`text-[0.68rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>{row.label}</p>
            </div>
            <p className={`shrink-0 text-[0.82rem] font-bold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.cost}</p>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function FailuresCard({ data, isDark }) {
  if (!data) return null;

  return (
    <PanelShell isDark={isDark}>
      <PanelHeader title={data.title} icon={data.icon || "symptoms"} isDark={isDark} tone="danger" />
      <ul>
        {(data.rows || []).map((row) => {
          const tone = riskStyles[row.risk?.type] || riskStyles.monitor;
          return (
            <li
              key={row.failure}
              className={`flex items-start gap-2.5 border-b px-3 py-2.5 last:border-b-0 ${rowBorder(isDark)}`}
            >
              <span className={`mt-1 shrink-0 ${tone.icon}`}>
                <WarningIcon className="h-4 w-4" />
              </span>
              <span className="relative mt-0.5 h-9 w-12 shrink-0 overflow-hidden rounded">
                <Image src="/engine.webp" alt="" fill className="object-cover" sizes="48px" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[0.8rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.failure}</p>
                <p className={`mt-1 text-[0.7rem] leading-[1.3] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>{row.note}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.62rem] font-bold uppercase ${isDark ? tone.darkBadge : tone.badge}`}>
                {row.risk?.label}
              </span>
            </li>
          );
        })}
      </ul>
    </PanelShell>
  );
}

function LiveFeedCard({ data, isDark }) {
  if (!data) return null;

  return (
    <PanelShell isDark={isDark}>
      <PanelHeader title={data.title} icon={data.icon || "realEnquiries"} isDark={isDark} />
      <ul className="relative px-3 py-2">
        <span className={`absolute bottom-4 left-[1.35rem] top-4 w-px ${isDark ? "bg-white/[0.08]" : "bg-black/[0.06]"}`} />
        {(data.rows || []).map((row) => (
          <li key={`${row.vehicle}-${row.timestamp}`} className="relative flex items-start gap-3 py-2.5 pl-5">
            <span className="absolute left-[5px] top-4 h-2.5 w-2.5 rounded-full bg-[var(--color-accent-green)]" />
            <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded">
              <Image src="/right.webp" alt="" fill className="object-cover" sizes="48px" />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[0.8rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.vehicle}</p>
              <p className={`mt-0.5 text-[0.7rem] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
                {row.location} • {row.issue}
              </p>
            </div>
            <span className={`shrink-0 text-[0.66rem] ${isDark ? "text-white/50" : "text-[var(--color-text-soft)]"}`}>{row.timestamp}</span>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function InsightsCard({ data, isDark }) {
  if (!data) return null;

  const iconShell = {
    green: isDark ? "bg-[rgba(123,195,154,0.18)]" : "bg-[#e7f3eb]",
    orange: isDark ? "bg-[rgba(224,137,58,0.18)]" : "bg-[#f3e8dc]",
  };

  return (
    <PanelShell isDark={isDark}>
      <PanelHeader title={data.title} icon={data.icon || "trend"} isDark={isDark} />
      <ul>
        {(data.items || []).map((item) => (
          <li
            key={item.title || item.text}
            className={`flex items-start gap-3 border-b px-3 py-3.5 last:border-b-0 ${rowBorder(isDark)}`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                iconShell[item.tone] || iconShell.green
              }`}
            >
              <HomeIcon name={item.icon || "trend"} size={22} tone="auto" className="h-5 w-5" />
            </span>
            <p className={`min-w-0 flex-1 text-[0.78rem] leading-[1.45] ${isDark ? "text-white/80" : "text-[var(--color-text)]"}`}>
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-5 flex flex-col gap-2.5 overflow-hidden rounded-md border px-3 py-3 md:flex-row md:items-center md:gap-3 md:overflow-x-auto md:px-5 ${
        isDark ? "border-white/10 bg-[rgba(16,28,24,0.92)]" : "border-transparent bg-[var(--color-primary)]"
      }`}
    >
      <div className="flex min-w-0 items-start gap-2.5 md:items-center md:gap-3">
        <HomeIcon name={note.icon || "database"} size={22} tone="silver" className="mt-0.5 h-5 w-5 shrink-0 md:mt-0" />
        <p className="min-w-0 text-[0.72rem] leading-[1.35] text-white/90 md:flex md:items-center md:gap-3 md:text-[0.8rem]">
          <strong className="shrink-0 whitespace-nowrap text-[var(--color-accent)]">{note.title}</strong>
          <span className="mt-0.5 block md:mt-0">{note.text}</span>
        </p>
      </div>
      {note.stats?.length ? (
        <div className="flex flex-wrap items-center gap-y-1 border-t border-white/15 pt-2.5 md:flex-nowrap md:border-l md:border-t-0 md:pt-0 md:pl-0">
          {note.stats.map((stat) => (
            <span key={stat.label} className="flex shrink-0 items-center border-l border-white/20 px-2.5 first:border-l-0 first:pl-0 md:gap-3 md:pl-3 md:first:border-l md:first:pl-3">
              <span className="whitespace-nowrap text-[0.68rem] text-white/90 md:text-[0.8rem]">
                {stat.label}: {stat.value}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HomeSec10({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const headerImage = data.headerImage?.src || "/sec2-bg.webp";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${sectionBgClass(band)}`} style={{ "--section-fade": rgb }}>
      <div className="absolute inset-x-0 top-0 h-[240px] md:h-[300px]">
        <Image
          src={headerImage}
          alt={data.headerImage?.alt || ""}
          fill
          className="object-cover object-[78%_center] md:object-[75%_center]"
          sizes="100vw"
        />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.78)_0%,rgba(var(--section-fade),0.62)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.96)_0%,rgba(var(--section-fade),0.72)_42%,rgba(var(--section-fade),0.2)_80%)]"
              : "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.72)_0%,rgba(var(--section-fade),0.48)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_44%,rgba(var(--section-fade),0.12)_80%)]"
          }
        />
        <div
          className={`pointer-events-none absolute inset-0 md:hidden ${
            isDark
              ? "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(var(--section-fade),0.95)_0%,rgba(var(--section-fade),0.7)_42%,transparent_72%)]"
              : "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_42%,transparent_72%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="relative max-w-[720px] text-left">
          <div
            className={`pointer-events-none absolute -inset-x-2 -top-3 -bottom-4 md:hidden ${
              isDark
                ? "bg-[linear-gradient(180deg,rgba(var(--section-fade),0.9)_0%,rgba(var(--section-fade),0.55)_55%,transparent_100%)]"
                : "bg-[linear-gradient(180deg,rgba(var(--section-fade),0.94)_0%,rgba(var(--section-fade),0.6)_55%,transparent_100%)]"
            }`}
          />
          <div className="relative z-10">
            <HeadingEyebrow text={data.eyebrow || "SECTION 09"} />
            <h2
              className={`mt-3 text-[2rem] font-medium leading-[1.08] tracking-normal md:text-[3rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Land Rover &amp; Range Rover Market Intelligence
            </h2>
            <p
              className={`mt-4 max-w-[640px] text-[0.9rem] leading-[1.45] md:text-[1.02rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:mt-8 lg:grid-cols-3">
          <EnginesCard data={data.engines} isDark={isDark} />
          <ModelsCard data={data.models} isDark={isDark} />
          <CostsCard data={data.replacementCosts} isDark={isDark} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <FailuresCard data={data.failures} isDark={isDark} />
          <LiveFeedCard data={data.liveFeed} isDark={isDark} />
          <InsightsCard data={data.insights} isDark={isDark} />
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
