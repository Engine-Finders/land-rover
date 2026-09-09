"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


const verdictTone = {
  best: {
    shell: "border-[rgba(180,134,63,0.55)] bg-[#0d1c18] text-[var(--color-accent)]",
    darkShell: "border-[rgba(212,170,104,0.5)] bg-[rgba(13,28,24,0.95)] text-[var(--color-accent)]",
  },
  safe: {
    shell: "border-[rgba(47,128,92,0.55)] bg-[#0d1c18] text-[var(--color-accent-green)]",
    darkShell: "border-[rgba(123,195,154,0.45)] bg-[rgba(13,28,24,0.95)] text-[var(--color-accent-green)]",
  },
  avoid: {
    shell: "border-[rgba(169,59,67,0.55)] bg-[#0d1c18] text-[var(--color-accent-red)]",
    darkShell: "border-[rgba(238,124,130,0.5)] bg-[rgba(13,28,24,0.95)] text-[var(--color-accent-red)]",
  },
  watch: {
    shell: "border-[rgba(224,137,58,0.55)] bg-[#0d1c18] text-[#e0893a]",
    darkShell: "border-[rgba(224,137,58,0.5)] bg-[rgba(13,28,24,0.95)] text-[#e0893a]",
  },
  family: {
    shell: "border-[rgba(47,128,92,0.55)] bg-[#0d1c18] text-[var(--color-accent-green)]",
    darkShell: "border-[rgba(123,195,154,0.45)] bg-[rgba(13,28,24,0.95)] text-[var(--color-accent-green)]",
  },
};

function ordinal(n) {
  const value = Number(n) || 0;
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

function WarningIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4m0 4h.01M10.3 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L13.7 4.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function VerdictBadge({ verdict, isDark, compact = false }) {
  const tone = verdictTone[verdict.type] || verdictTone.best;
  const shell = isDark ? tone.darkShell : tone.shell;
  const showWarning = verdict.type === "avoid" || verdict.type === "watch";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1.5 ${shell} ${compact ? "min-w-[4.5rem] flex-col" : "min-w-[7.5rem]"}`}>
      <span className="flex items-center gap-1.5">
        {showWarning ? (
          <WarningIcon className="h-3.5 w-3.5" />
        ) : (
          <HomeIcon name={verdict.icon} size={18} tone="silver" className="h-3.5 w-3.5" />
        )}
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.04em]">{verdict.label}</span>
      </span>
      {!compact && verdict.sublabel ? (
        <span className="hidden text-[0.62rem] font-semibold opacity-90 md:inline">{verdict.sublabel}</span>
      ) : null}
    </span>
  );
}

function DesktopTable({ columns, rankings, isDark }) {
  return (
    <div
      className={`mt-6 hidden overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] md:block ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div
        className={`grid grid-cols-[minmax(200px,1.1fr)_minmax(180px,0.95fr)_minmax(280px,1.6fr)_minmax(140px,0.7fr)] gap-3 px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-white ${
          isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <span>{columns[0]}</span>
        <span>{columns[1]}</span>
        <span>{columns[2]}</span>
        <span>{columns[3]}</span>
      </div>

      {rankings.map((row, index) => (
        <div
          key={row.ranking}
          className={`relative grid grid-cols-[minmax(200px,1.1fr)_minmax(180px,0.95fr)_minmax(280px,1.6fr)_minmax(140px,0.7fr)] items-center gap-3 border-b px-5 py-3.5 last:border-b-0 ${
            isDark
              ? `border-[var(--color-border)] text-white ${index % 2 ? "bg-white/[0.03]" : ""}`
              : `border-[var(--color-border)] text-[var(--color-text)] ${index % 2 ? "bg-[var(--color-page-soft)]" : "bg-white"}`
          }`}
        >
          {row.href ? (
            <Link href={row.href} className="absolute inset-0 z-0" aria-label={row.ranking}>
              <span className="sr-only">{row.ranking}</span>
            </Link>
          ) : null}

          <div className="relative z-10 pointer-events-none">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.04em] opacity-70">{ordinal(row.rank)}</p>
            <p className="text-[0.9rem] font-bold leading-tight">{row.ranking}</p>
          </div>

          <div className="relative z-10 pointer-events-none flex items-center gap-3">
            <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded">
              <Image src={row.image?.src || "/right.webp"} alt={row.image?.alt || ""} fill className="object-cover" sizes="56px" />
            </span>
            <p className="font-lora text-[0.95rem] font-medium leading-tight text-[var(--color-primary)]">{row.winner}</p>
          </div>

          <p className={`relative z-10 pointer-events-none text-[0.8rem] leading-[1.4] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
            {row.why}
          </p>

          <div className="relative z-10 pointer-events-none">
            <VerdictBadge verdict={row.verdict} isDark={isDark} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileCards({ rankings, isDark }) {
  return (
    <ul className="mt-5 grid gap-3 md:hidden">
      {rankings.map((row) => (
        <li key={row.ranking}>
          <Link
            href={row.href || "#"}
            className={`flex items-center gap-2.5 rounded-xl border p-3 shadow-[0_10px_24px_var(--color-shadow)] ${
              isDark
                ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-white"
                : "border-[var(--color-border)] bg-white text-[var(--color-text)]"
            }`}
          >
            <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded">
              <Image src={row.image?.src || "/right.webp"} alt={row.image?.alt || ""} fill className="object-cover" sizes="56px" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[0.62rem] font-bold uppercase tracking-[0.04em] opacity-70">{ordinal(row.rank)}</span>
              <span className="mt-0.5 block text-[0.72rem] font-bold leading-tight">{row.ranking}</span>
              <span className="font-lora mt-0.5 block text-[0.92rem] font-medium leading-tight text-[var(--color-primary)]">
                {row.winner}
              </span>
              <span className={`mt-1 block text-[0.68rem] leading-[1.3] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
                {row.why}
              </span>
            </span>

            <VerdictBadge verdict={row.verdict} isDark={isDark} compact />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`relative mt-5 overflow-hidden rounded-md border px-4 py-4 md:mt-6 md:px-5 md:py-5 ${
        isDark ? "border-white/10 bg-[rgba(16,28,24,0.92)]" : "border-transparent bg-[var(--color-primary)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Image src="/sec2-bg.webp" alt="" fill className="object-cover object-right" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-primary)_0%,rgba(23,95,70,0.75)_55%,rgba(23,95,70,0.35)_100%)]" />
      </div>

      <div className="relative z-10 flex items-start gap-3 md:items-center md:gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10">
          <HomeIcon name={note.icon || "realData"} size={32} tone="silver" className="h-7 w-7" />
        </span>
        <p className="text-[0.82rem] leading-[1.45] text-white md:text-[0.9rem]">
          <strong className="font-bold">{note.title || "Data Note:"}</strong> {note.text}
        </p>
      </div>
    </div>
  );
}

export default function HomeSec4({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const rankings = data.rankings || [];
  const columns = data.columns || ["RANKING", "WINNER", "WHY", "VERDICT"];
  const headerImage = data.headerImage?.src || "/sec2-bg.webp";

  return (
    <section className={`relative overflow-hidden px-3 py-6 md:px-6 md:py-8 ${sectionBgClass(band)}`} style={{ "--section-fade": rgb }}>
      <div className="absolute inset-x-0 top-0 h-[260px] md:h-[320px]">
        <Image src={headerImage} alt={data.headerImage?.alt || ""} fill className="object-cover object-[78%_center] md:object-[75%_center]" sizes="100vw" />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.78)_0%,rgba(var(--section-fade),0.62)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.96)_0%,rgba(var(--section-fade),0.72)_42%,rgba(var(--section-fade),0.2)_80%)]"
              : "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.72)_0%,rgba(var(--section-fade),0.48)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_44%,rgba(var(--section-fade),0.12)_80%)]"
          }
        />
        {/* Mobile smoke behind header copy */}
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
            <HeadingEyebrow text={data.eyebrow || "SECTION 04"} />
            <h2
              className={`mt-3 text-[2.1rem] font-medium leading-[1.08] tracking-normal md:text-[3.2rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Land Rover &amp; Range Rover Ownership Rankings
            </h2>
            <p
              className={`mt-4 max-w-[640px] text-[0.9rem] leading-[1.45] md:text-[1.05rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>

        <DesktopTable columns={columns} rankings={rankings} isDark={isDark} />
        <MobileCards rankings={rankings} isDark={isDark} />
        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
