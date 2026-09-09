"use client";

import Image from "next/image";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


const verdictStyles = {
  green: {
    light: "border-transparent bg-[var(--color-primary)] text-white",
    dark: "border-white/20 bg-[var(--color-chrome)] text-white",
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
  const colLine = isDark ? "md:border-l md:border-white/[0.06]" : "md:border-l md:border-black/[0.06]";

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
        className={`hidden grid-cols-[minmax(140px,1fr)_minmax(160px,1.2fr)_minmax(120px,0.9fr)] px-0 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.06em] md:grid ${
          isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
        }`}
      >
        {columns.map((column, index) => (
          <span key={column} className={`px-4 ${index > 0 ? colLine : ""}`}>
            {column}
          </span>
        ))}
      </div>

      <ul>
        {(brand.rows || []).map((row) => (
          <li
            key={row.model}
            className={`flex items-center gap-2 border-t px-2.5 py-2.5 md:grid md:grid-cols-[minmax(140px,1fr)_minmax(160px,1.2fr)_minmax(120px,0.9fr)] md:gap-0 md:px-0 md:py-0 ${
              isDark ? "border-white/[0.06]" : "border-black/[0.06]"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:px-4 md:py-3">
              <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded md:h-10 md:w-14">
                <Image src={row.image?.src || "/right.webp"} alt={row.image?.alt || ""} fill className="object-cover" sizes="56px" />
              </span>
              <div className="min-w-0">
                <p className={`truncate text-[0.82rem] font-bold md:text-[0.9rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {row.model}
                </p>
                <p className={`mt-0.5 text-[0.68rem] leading-tight md:hidden ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
                  {row.generations}
                </p>
              </div>
            </div>
            <p
              className={`hidden text-[0.78rem] leading-[1.35] md:flex md:items-center md:px-4 md:py-3 ${colLine} ${
                isDark ? "text-white/72" : "text-[var(--color-text-muted)]"
              }`}
            >
              {row.generations}
            </p>
            <div className={`shrink-0 md:flex md:items-center md:justify-end md:px-4 md:py-3 ${colLine}`}>
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
  const colLine = isDark ? "border-white/[0.08]" : "border-black/[0.06]";

  return (
    <div
      className={`mt-5 overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] md:mt-6 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Image — full height of the card on desktop */}
        <div className="relative min-h-[180px] md:min-h-full">
          <Image
            src={example.image?.src || "/right.webp"}
            alt={example.image?.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 260px"
          />
        </div>

        {/* Heading + insight cards — all to the right of the image */}
        <div className="flex min-w-0 flex-col">
          <div className="px-4 pt-5 md:px-5 md:pt-5 md:pb-2">
            <p className={`text-[0.68rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/55" : "text-[var(--color-text-muted)]"}`}>
              {example.eyebrow}
            </p>
            <h3 className={`mt-1 font-lora text-[1.65rem] font-medium leading-tight md:text-[2rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {example.title}
            </h3>
            <span className="mt-2 block h-px w-12 bg-[var(--color-accent)]" aria-hidden="true" />
          </div>

          <div className="grid flex-1 gap-0 sm:grid-cols-2 lg:grid-cols-5">
            {(example.points || []).map((point, index) => (
              <div
                key={point.title}
                className={`flex items-start gap-2.5 px-4 py-4 ${index > 0 ? `border-t sm:border-t-0 ${colLine}` : ""} ${
                  index % 2 === 1 ? `sm:border-l ${colLine}` : ""
                } ${index > 0 ? `lg:border-l ${colLine}` : ""} ${index >= 2 ? `sm:border-t ${colLine} lg:border-t-0` : ""}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10">
                  <HomeIcon name={point.icon} size={22} tone="auto" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[0.66rem] font-bold uppercase tracking-[0.05em] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
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
    </div>
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

export default function HomeSec11({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const headerImage = data.headerImage?.src || "/right.webp";

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
            className={`pointer-events-none absolute -inset-x-2 -top-3 bottom-0 rounded-lg md:hidden ${
              isDark
                ? "bg-[linear-gradient(90deg,rgba(var(--section-fade),0.88)_0%,rgba(var(--section-fade),0.55)_70%,transparent_100%)]"
                : "bg-[linear-gradient(90deg,rgba(var(--section-fade),0.92)_0%,rgba(var(--section-fade),0.62)_70%,transparent_100%)]"
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
