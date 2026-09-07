"use client";

import Image from "next/image";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";

const verdictStyles = {
  green: {
    light: "border-[rgba(13,28,24,0.35)] bg-[#0d1c18] text-white",
    dark: "border-white/20 bg-[rgba(13,28,24,0.95)] text-white",
  },
  gold: {
    light: "border-[rgba(180,134,63,0.45)] bg-[#c4a574] text-[#2a1c08]",
    dark: "border-[rgba(212,170,104,0.45)] bg-[rgba(196,165,116,0.28)] text-[#ffd473]",
  },
  amber: {
    light: "border-[rgba(210,180,130,0.55)] bg-[#e8d5b5] text-[#5b3a00]",
    dark: "border-[rgba(232,213,181,0.35)] bg-[rgba(232,213,181,0.16)] text-[#f0d9a8]",
  },
};

function VerdictBadge({ verdict, isDark, compact = false }) {
  const tone = verdictStyles[verdict.type] || verdictStyles.green;
  const shell = isDark ? tone.dark : tone.light;
  const iconTone = verdict.type === "green" || isDark ? "silver" : "auto";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-md border ${shell} ${
        compact ? "min-w-0 px-1.5 py-1" : "min-w-[7.5rem] gap-1.5 px-2.5 py-1.5"
      }`}
    >
      <HomeIcon name={verdict.icon} size={16} tone={iconTone} className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span className={`font-bold uppercase tracking-[0.04em] ${compact ? "text-[0.52rem] leading-tight" : "text-[0.62rem]"}`}>
        {verdict.text}
      </span>
    </span>
  );
}

function BrandTable({ brand, columns, isDark }) {
  if (!brand) return null;

  return (
    <div
      className={`overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div className={`flex items-center gap-2.5 px-4 py-3 text-white ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
        {brand.logo ? (
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/10">
            <Image src={brand.logo} alt="" fill className="object-contain p-1" sizes="32px" />
          </span>
        ) : null}
        <p className="text-[0.78rem] font-bold uppercase tracking-[0.08em]">{brand.name}</p>
      </div>

      <div
        className={`hidden grid-cols-[minmax(140px,1fr)_minmax(160px,1.2fr)_minmax(120px,0.9fr)] gap-2 px-4 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.06em] md:grid ${
          isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
        }`}
      >
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>

      <ul>
        {(brand.rows || []).map((row) => (
          <li
            key={row.model}
            className={`flex items-center gap-2 border-t px-2.5 py-2.5 md:grid md:grid-cols-[minmax(140px,1fr)_minmax(160px,1.2fr)_minmax(120px,0.9fr)] md:gap-2 md:px-4 md:py-3 ${
              isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none">
              <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded md:h-10 md:w-14">
                <Image src={row.image?.src || "/right.webp"} alt={row.image?.alt || ""} fill className="object-cover" sizes="56px" />
              </span>
              <div className="min-w-0 md:contents">
                <p className={`truncate text-[0.82rem] font-bold md:text-[0.9rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {row.model}
                </p>
                <p className={`mt-0.5 text-[0.68rem] leading-tight md:mt-0 md:hidden ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
                  {row.generations}
                </p>
              </div>
            </div>
            <p className={`hidden text-[0.78rem] leading-[1.35] md:block ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
              {row.generations}
            </p>
            <div className="shrink-0 md:flex md:justify-end">
              <span className="md:hidden">
                <VerdictBadge verdict={row.verdict} isDark={isDark} compact />
              </span>
              <span className="hidden md:inline-flex">
                <VerdictBadge verdict={row.verdict} isDark={isDark} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExampleVerdict({ example, isDark }) {
  if (!example) return null;

  return (
    <div className="mt-5 md:mt-6">
      <p className={`text-[0.68rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/55" : "text-[var(--color-text-muted)]"}`}>
        {example.eyebrow}
      </p>
      <h3 className={`mt-1 font-lora text-[1.65rem] font-medium leading-tight md:text-[2rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        {example.title}
      </h3>
      <span className="mt-2 block h-px w-16 bg-[var(--color-accent)]" aria-hidden="true" />

      <div
        className={`mt-4 overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] md:grid md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)] ${
          isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
        }`}
      >
        <div className="relative min-h-[160px] md:min-h-full md:self-stretch">
          <Image
            src={example.image?.src || "/right.webp"}
            alt={example.image?.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 md:gap-3 md:p-5 lg:grid-cols-5">
          {(example.points || []).map((point) => (
            <div key={point.title} className="flex items-start gap-3 md:block">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10">
                <HomeIcon name={point.icon} size={22} tone="auto" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 md:mt-2">
                <p className={`text-[0.68rem] font-bold uppercase tracking-[0.05em] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {point.title}
                </p>
                <p className={`mt-1 text-[0.74rem] leading-[1.4] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
                  {point.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-5 flex flex-col gap-3 overflow-hidden rounded-md border px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-5 ${
        isDark ? "border-white/10 bg-[rgba(16,28,24,0.92)]" : "border-transparent bg-[var(--color-primary)]"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 md:h-10 md:w-10">
          <HomeIcon name={note.icon || "database"} size={28} tone="silver" className="h-5 w-5 md:h-6 md:w-6" />
        </span>
        <p className="min-w-0 flex-1 text-[0.78rem] leading-[1.35] text-white md:text-[0.84rem]">
          <strong className="text-[var(--color-accent)]">{note.title}</strong> {note.text}
        </p>
      </div>
      {note.stats?.length ? (
        <div className="flex w-full items-center border-t border-white/15 pt-3 md:w-auto md:shrink-0 md:border-l md:border-t-0 md:pt-0 md:pl-1">
          {note.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 md:flex-none md:min-w-[7.5rem] md:justify-start md:px-3 ${
                index > 0 ? "border-l border-white/20" : ""
              }`}
            >
              {stat.icon ? <HomeIcon name={stat.icon} size={18} tone="silver" className="hidden h-4 w-4 md:block" /> : null}
              <div className="min-w-0 text-center md:text-left">
                <p className="text-[0.82rem] font-bold text-white md:text-[0.88rem]">{stat.value}</p>
                <p className="mt-0.5 text-[0.55rem] uppercase tracking-[0.04em] text-white/65 md:text-[0.58rem]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HomeSec11({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerImage = data.headerImage?.src || "/right.webp";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#0d1c18]" : "bg-[var(--color-page)]"}`}>
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
              ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(13,28,24,0.78)_0%,rgba(13,28,24,0.62)_40%,rgba(13,28,24,0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(13,28,24,0.96)_0%,rgba(13,28,24,0.72)_42%,rgba(13,28,24,0.2)_80%)]"
              : "absolute inset-0 bg-[linear-gradient(180deg,rgba(248,247,242,0.72)_0%,rgba(248,247,242,0.48)_40%,rgba(248,247,242,0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(248,247,242,0.97)_0%,rgba(248,247,242,0.82)_44%,rgba(248,247,242,0.12)_80%)]"
          }
        />
        <div
          className={`pointer-events-none absolute inset-0 md:hidden ${
            isDark
              ? "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(13,28,24,0.95)_0%,rgba(13,28,24,0.7)_42%,transparent_72%)]"
              : "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(248,247,242,0.97)_0%,rgba(248,247,242,0.82)_42%,transparent_72%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="relative max-w-[720px] text-left">
          <div
            className={`pointer-events-none absolute -inset-x-2 -top-3 bottom-0 rounded-lg md:hidden ${
              isDark
                ? "bg-[linear-gradient(90deg,rgba(13,28,24,0.88)_0%,rgba(13,28,24,0.55)_70%,transparent_100%)]"
                : "bg-[linear-gradient(90deg,rgba(248,247,242,0.92)_0%,rgba(248,247,242,0.62)_70%,transparent_100%)]"
            }`}
          />
          <div className="relative z-10">
            <HeadingEyebrow text={data.eyebrow || "SECTION 10"} />
            <h2
              className={`mt-3 text-[2rem] font-medium leading-[1.08] tracking-normal md:text-[3rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Every Model. Every Generation. Honestly Rated.
            </h2>
            <p
              className={`mt-4 max-w-[640px] text-[0.9rem] leading-[1.45] md:text-[1.02rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
            >
              {data.subHeadline}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:mt-8 lg:grid-cols-2">
          {(data.brands || []).map((brand) => (
            <BrandTable key={brand.id} brand={brand} columns={data.columns || ["MODEL", "GENERATIONS", "VERDICT"]} isDark={isDark} />
          ))}
        </div>

        <ExampleVerdict example={data.example} isDark={isDark} />
        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
