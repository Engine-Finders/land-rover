"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


function Chevron({ open, className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TrustCard({ item, isDark }) {
  return (
    <article
      className={`flex h-full flex-col items-center rounded-md border p-3 text-center shadow-[0_10px_24px_var(--color-shadow)] md:p-3.5 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full border ${
          isDark ? "border-white/15 bg-white/5" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
        }`}
      >
        <HomeIcon name={item.icon} size={26} tone="auto" className="h-6 w-6" />
      </span>
      <h3 className={`mt-3 text-[0.82rem] font-bold leading-tight md:text-[0.86rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        {item.title}
      </h3>
      <p className={`mt-2 text-[0.7rem] font-normal leading-[1.4] md:text-[0.72rem] ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>
        {item.description}
      </p>
    </article>
  );
}

function CommitmentCard({ data, isDark }) {
  if (!data) return null;

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-md">
      <Image
        src={data.image?.src || "/right.webp"}
        alt={data.image?.alt || ""}
        fill
        className="object-cover object-[70%_center]"
        sizes="(max-width: 1024px) 100vw, 50vw"
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
          <h3 className="mt-4 max-w-[420px] font-lora text-[1.35rem] font-medium leading-[1.2] text-white md:text-[1.55rem]">
            {data.title}
          </h3>
          <p className="mt-3 max-w-[440px] text-[0.86rem] leading-[1.5] text-white/80">{data.text}</p>
        </div>
        <div className="mt-6">
          <p className="font-lora text-[1.15rem] italic text-white">{data.signature}</p>
          <p className="mt-0.5 text-[0.72rem] text-white/70">— {data.signatureRole}</p>
        </div>
      </div>
    </div>
  );
}

function FaqPanel({ faq, isDark }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faq) return null;

  return (
    <div
      className={`h-full rounded-md border p-4 shadow-[0_10px_24px_var(--color-shadow)] md:p-5 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
          }`}
        >
          <HomeIcon name={faq.icon || "faq"} size={22} tone="silver" className="h-5 w-5" />
        </span>
        <p className={`min-w-0 flex-1 text-[0.78rem] font-bold uppercase tracking-[0.07em] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {faq.title}
        </p>
        {faq.viewAllLabel ? (
          <Link href={faq.viewAllHref || "#"} className="shrink-0 text-[0.72rem] font-semibold text-[var(--color-primary)]">
            {faq.viewAllLabel}
          </Link>
        ) : null}
      </div>

      <ul className="mt-3">
        {(faq.items || []).map((item, index) => {
          const open = openIndex === index;
          return (
            <li key={item.question} className={`border-t ${isDark ? "border-white/[0.08]" : "border-black/[0.06]"}`}>
              <button
                type="button"
                className="flex w-full items-start gap-3 py-3.5 text-left"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
              >
                <span className={`min-w-0 flex-1 text-[0.9rem] font-semibold leading-snug ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {item.question}
                </span>
                <Chevron open={open} className={`mt-1 h-4 w-4 shrink-0 ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`} />
              </button>
              {open ? (
                <p className={`pb-3.5 pr-8 text-[0.82rem] leading-[1.5] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
                  {item.answer}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CtaBanner({ cta, isDark }) {
  if (!cta) return null;

  return (
    <div className={`relative mt-5 overflow-hidden rounded-md ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
      <div className="absolute inset-y-0 right-0 hidden w-[42%] md:block">
        <Image src={cta.image?.src || "/right.webp"} alt={cta.image?.alt || ""} fill className="object-cover object-center" sizes="42vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,28,24,1)_0%,rgba(13,28,24,0.55)_45%,rgba(13,28,24,0.15)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:gap-6 md:px-6 md:py-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <HomeIcon name={cta.icon || "expertVerified"} size={28} tone="silver" className="mt-0.5 h-7 w-7 shrink-0" />
          <div>
            <p className="font-lora text-[1.2rem] font-medium leading-tight text-white md:text-[1.35rem]">{cta.title}</p>
            <p className="mt-1.5 text-[0.82rem] leading-[1.4] text-white/78">{cta.text}</p>
          </div>
        </div>

        <div className="shrink-0 md:text-center">
          <Link
            href={cta.buttonHref || "/quote"}
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-[0.78rem] font-bold uppercase tracking-[0.05em] text-[var(--color-primary)]"
          >
            {cta.buttonLabel}
          </Link>
          <p className="mt-2 text-[0.68rem] text-white/70">{cta.note}</p>
        </div>
      </div>
    </div>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-4 flex flex-col gap-2.5 overflow-hidden rounded-md border px-3 py-3 md:flex-row md:items-center md:gap-4 md:overflow-x-auto md:px-5 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <div className="flex min-w-0 items-start gap-2.5 md:items-center md:gap-3">
        <HomeIcon name={note.icon || "expertVerified"} size={22} tone="auto" className="mt-0.5 h-5 w-5 shrink-0 md:mt-0" />
        <p className={`min-w-0 text-[0.72rem] leading-[1.35] md:text-[0.8rem] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
          <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.title}</strong> {note.text}{" "}
          {note.verified ? <span className="font-bold text-[var(--color-accent-green)]">{note.verified}</span> : null}
        </p>
      </div>
      {note.stats?.length ? (
        <div
          className={`flex flex-wrap items-center gap-2 border-t pt-2.5 text-[0.62rem] md:flex-nowrap md:gap-3 md:border-l md:border-t-0 md:pt-0 md:pl-4 md:text-[0.72rem] ${
            isDark ? "border-white/15 text-white/75" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
          }`}
        >
          {note.stats.map((stat, index) => (
            <span key={stat.label} className="whitespace-nowrap">
              {index > 0 ? <span className="mr-2 opacity-40 md:mr-3">•</span> : null}
              {stat.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HomeSec12({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${sectionBgClass(band)}`} style={{ "--section-fade": rgb }}>
      <div className="relative mx-auto w-full max-w-8xl">
        <div className="mx-auto max-w-[760px] text-center">
          <HeadingEyebrow text={data.eyebrow || "TRUST & FAQ"} align="center" />
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

        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-3 xl:grid-cols-6">
          {(data.signals || []).map((item) => (
            <TrustCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <CommitmentCard data={data.commitment} isDark={isDark} />
          <FaqPanel faq={data.faq} isDark={isDark} />
        </div>

        <CtaBanner cta={data.cta} isDark={isDark} />
        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
