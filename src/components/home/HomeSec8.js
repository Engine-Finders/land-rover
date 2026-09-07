"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function CentreCard({ item, isDark }) {
  return (
    <Link
      href={item.href || "#"}
      className={`group flex min-h-[5.5rem] overflow-hidden rounded-xl border shadow-[0_10px_28px_var(--color-shadow)] transition hover:border-[var(--color-primary)] ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <span
        className={`flex w-14 shrink-0 items-center justify-center text-[1.15rem] font-bold tracking-[0.04em] md:w-16 md:text-[1.25rem] ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-accent)]" : "bg-[#0d1c18] text-[var(--color-accent)]"
        }`}
      >
        {item.id}
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 md:gap-4 md:px-4 md:py-3.5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center md:h-16 md:w-16">
          <HomeIcon name={item.icon} size={72} className="h-12 w-12 md:h-14 md:w-14" />
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block text-[0.95rem] font-bold leading-tight md:text-[1.05rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {item.title}
          </span>
          <span className={`mt-1 block text-[0.74rem] leading-[1.35] md:text-[0.8rem] ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
            {item.description}
          </span>
        </span>

        <span
          className={`hidden shrink-0 items-center gap-2 border-l pl-4 text-[0.86rem] font-semibold text-[var(--color-primary)] sm:inline-flex ${
            isDark ? "border-white/12" : "border-[var(--color-border)]"
          }`}
        >
          Explore
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${
              isDark ? "border-white/20" : "border-[var(--color-border)]"
            }`}
          >
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </span>

        <span className="inline-flex shrink-0 text-[var(--color-primary)] sm:hidden">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </span>
    </Link>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-6 flex items-start gap-3 overflow-hidden rounded-md border px-4 py-4 md:mt-7 md:items-center md:gap-4 md:px-5 ${
        isDark ? "border-white/10 bg-[rgba(16,28,24,0.92)]" : "border-transparent bg-[var(--color-primary)]"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10">
        <HomeIcon name={note.icon || "realData"} size={36} tone="silver" className="h-8 w-8" />
      </span>
      <p className="text-[0.82rem] leading-[1.45] text-white md:text-[0.9rem]">
        <strong className="text-[var(--color-accent)]">{note.title}</strong>{" "}
        <span className="text-white/90">{note.text}</span>
      </p>
    </div>
  );
}

export default function HomeSec8({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const centres = data.centres || [];
  const headerImage = data.headerImage?.src || "/sec2-bg.webp";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-9 ${isDark ? "bg-[#0d1c18]" : "bg-[var(--color-page)]"}`}>
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
            <HeadingEyebrow text={data.eyebrow || "SECTION 06"} />
            <h2
              className={`mt-3 text-[2.2rem] font-medium leading-[1.08] tracking-normal md:text-[3.1rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Knowledge Centres
            </h2>
            <p
              className={`mt-4 max-w-[640px] text-[0.9rem] leading-[1.5] md:text-[1.02rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-2 md:gap-4">
          {centres.map((item) => (
            <CentreCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
