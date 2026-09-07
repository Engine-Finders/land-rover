"use client";

import Image from "next/image";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";

function TrustCard({ item, isDark }) {
  return (
    <article
      className={`rounded-md border p-3 shadow-[0_10px_24px_var(--color-shadow)] md:p-4 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border md:h-11 md:w-11 ${
            isDark ? "border-white/15 bg-white/5" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
          }`}
        >
          <HomeIcon name={item.icon} size={24} tone="auto" className="h-5 w-5 md:h-6 md:w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-[0.88rem] font-bold leading-tight md:text-[0.92rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {item.title}
          </h3>
          <span className="mt-1.5 block h-px w-10 bg-[var(--color-accent)]" aria-hidden="true" />
        </div>
      </div>
      <p className={`mt-2.5 w-full text-[0.74rem] leading-[1.4] md:text-[0.78rem] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
        {item.description}
      </p>
    </article>
  );
}

function CommitmentCard({ data, isDark }) {
  if (!data) return null;

  return (
    <div className="relative mt-5 min-h-[280px] overflow-hidden rounded-md md:min-h-[320px]">
      <Image
        src={data.image?.src || "/right.webp"}
        alt={data.image?.alt || ""}
        fill
        className="object-cover object-[70%_center]"
        sizes="100vw"
      />
      <div
        className={
          isDark
            ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,15,0.96)_0%,rgba(8,18,15,0.82)_48%,rgba(8,18,15,0.35)_100%)]"
            : "absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,15,0.94)_0%,rgba(8,18,15,0.78)_48%,rgba(8,18,15,0.28)_100%)]"
        }
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <HomeIcon name={data.icon || "expertVerified"} size={22} tone="silver" className="h-5 w-5" />
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--color-accent)]">{data.eyebrow}</p>
          </div>
          <h3 className="mt-4 max-w-[520px] font-lora text-[1.35rem] font-medium leading-[1.2] text-white md:text-[1.65rem]">
            {data.title}
          </h3>
          <p className="mt-3 max-w-[540px] text-[0.86rem] leading-[1.5] text-white/80">{data.text}</p>
        </div>
        <div className="mt-6">
          <p className="font-lora text-[1.15rem] italic text-white">{data.signature}</p>
          <p className="mt-0.5 text-[0.72rem] text-white/70">— {data.signatureRole}</p>
        </div>
      </div>
    </div>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-4 flex flex-col gap-3 overflow-hidden rounded-md border px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-5 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <HomeIcon name={note.icon || "expertVerified"} size={22} tone="auto" className="h-5 w-5 shrink-0" />
        <p className={`min-w-0 flex-1 text-[0.78rem] leading-[1.4] md:text-[0.8rem] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
          <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.title}</strong> {note.text}{" "}
          {note.verified ? <span className="font-bold text-[var(--color-accent-green)]">{note.verified}</span> : null}
        </p>
      </div>
      {note.stats?.length ? (
        <div
          className={`flex w-full items-center justify-between gap-2 border-t pt-3 text-[0.68rem] md:w-auto md:shrink-0 md:justify-start md:gap-3 md:border-l md:border-t-0 md:pt-0 md:pl-4 md:text-[0.72rem] ${
            isDark ? "border-white/15 text-white/75" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
          }`}
        >
          {note.stats.map((stat, index) => (
            <span key={stat.label} className="min-w-0 text-center md:whitespace-nowrap md:text-left">
              {index > 0 ? <span className="mr-2 hidden opacity-40 md:mr-3 md:inline">•</span> : null}
              {stat.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HomeSec12({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#0d1c18]" : "bg-[var(--color-page)]"}`}>
      <div className="relative mx-auto w-full max-w-8xl">
        <div className="mx-auto max-w-[760px] text-center">
          <HeadingEyebrow text={data.eyebrow || "TRUST"} align="center" />
          <h2
            className={`mt-3 text-[2rem] font-medium leading-[1.08] tracking-normal md:text-[3rem] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            Why Land Rover Owners{" "}
            <span className={isDark ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"}>Trust This Site</span>
          </h2>
          <p
            className={`mt-4 text-[0.9rem] leading-[1.5] md:text-[1.02rem] ${
              isDark ? "text-white/78" : "text-[var(--color-text-muted)]"
            }`}
          >
            {data.subHeadline}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-8 lg:grid-cols-3">
          {(data.signals || []).map((item) => (
            <TrustCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <CommitmentCard data={data.commitment} isDark={isDark} />
        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
