"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";

function MobileCard({ item, isDark }) {
  return (
    <Link
      href={item.href || "#"}
      className={`flex items-start gap-3 rounded-xl border p-3 shadow-[0_10px_24px_var(--color-shadow)] ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[0.72rem] font-bold text-white ${
          isDark ? "bg-[var(--color-chrome)]" : "bg-[#0d1c18]"
        }`}
      >
        {item.id}
      </span>

      <span className="relative h-14 w-[4.25rem] shrink-0 overflow-hidden rounded-md">
        <Image src={item.image?.src || "/engine.webp"} alt={item.image?.alt || ""} fill className="object-cover" sizes="68px" />
      </span>

      <span className="min-w-0 flex-1">
        <span className={`block text-[0.95rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {item.title}
        </span>
        <span className={`mt-1 block text-[0.74rem] leading-[1.35] ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
          {item.preview}
        </span>
        <span
          className={`mt-2.5 flex items-center justify-end border-t pt-2 text-[0.78rem] font-semibold text-[var(--color-primary)] ${
            isDark ? "border-white/12" : "border-[var(--color-border)]"
          }`}
        >
          Read the verdict →
        </span>
      </span>
    </Link>
  );
}

function DesktopTable({ columns, comparisons, isDark }) {
  return (
    <div
      className={`mt-6 hidden overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] md:block ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div
        className={`grid grid-cols-[56px_minmax(220px,1.1fr)_minmax(280px,1.6fr)_minmax(140px,0.7fr)] gap-3 px-4 py-3 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-white ${
          isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <span>{columns[0]}</span>
        <span>{columns[1]}</span>
        <span>{columns[2]}</span>
        <span className="text-right">{columns[3]}</span>
      </div>

      {comparisons.map((item, index) => (
        <div
          key={item.id}
          className={`relative grid grid-cols-[56px_minmax(220px,1.1fr)_minmax(280px,1.6fr)_minmax(140px,0.7fr)] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${
            isDark
              ? `border-[var(--color-border)] text-white ${index % 2 ? "bg-white/[0.03]" : ""}`
              : `border-[var(--color-border)] text-[var(--color-text)] ${index % 2 ? "bg-[var(--color-page-soft)]" : "bg-white"}`
          }`}
        >
          <Link href={item.href || "#"} className="absolute inset-0 z-0" aria-label={item.title}>
            <span className="sr-only">{item.title}</span>
          </Link>

          <span className="relative z-10 pointer-events-none">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[0.72rem] font-bold text-white ${
                isDark ? "bg-[var(--color-chrome)]" : "bg-[#0d1c18]"
              }`}
            >
              {item.id}
            </span>
          </span>

          <div className="relative z-10 pointer-events-none flex items-center gap-3">
            <span className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-md">
              <Image src={item.image?.src || "/engine.webp"} alt={item.image?.alt || ""} fill className="object-cover" sizes="72px" />
            </span>
            <p className="text-[0.95rem] font-bold leading-tight">{item.title}</p>
          </div>

          <div className="relative z-10 pointer-events-none flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isDark ? "bg-white/10" : "bg-[var(--color-page-soft)]"
              }`}
            >
              <HomeIcon name={item.icon || "scale"} size={28} className="h-5 w-5" />
            </span>
            <p className={`text-[0.8rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
              {item.preview}
            </p>
          </div>

          <span className="relative z-10 pointer-events-none text-right text-[0.82rem] font-semibold text-[var(--color-primary)]">
            Read the verdict →
          </span>
        </div>
      ))}
    </div>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-md border px-4 py-4 md:mt-6 md:items-center md:gap-4 md:px-5 ${
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

export default function HomeSec5({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const comparisons = data.comparisons || [];
  const columns = data.columns || ["#", "COMPARISON", "VERDICT PREVIEW", "LINK"];
  const headerImage = data.headerImage?.src || "/sec2-bg.webp";

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
            <HeadingEyebrow text={data.eyebrow || "SECTION 07"} />
            <h2
              className={`mt-3 text-[2.1rem] font-medium leading-[1.08] tracking-normal md:text-[3.1rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Comparison Hub – Head-to-Head <span className="text-[var(--color-primary)]">Verdicts</span>
            </h2>
            <p
              className={`mt-4 max-w-[640px] text-[0.9rem] leading-[1.45] md:text-[1.02rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>

        <DesktopTable columns={columns} comparisons={comparisons} isDark={isDark} />

        <ul className="mt-5 grid gap-3 md:hidden">
          {comparisons.map((item) => (
            <li key={item.id}>
              <MobileCard item={item} isDark={isDark} />
            </li>
          ))}
        </ul>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
