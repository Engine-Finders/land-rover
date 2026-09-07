"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";

const toneText = {
  gold: "text-[var(--color-accent)]",
  green: "text-[var(--color-accent-green)]",
  orange: "text-[#e0893a]",
};

function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function spacedTitle(title) {
  return title.split("").join(" ");
}

function BrandHeader({ brand, isDark }) {
  const title = brand.spacedTitle ? spacedTitle(brand.title) : brand.title;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 text-white ${
        isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
      }`}
    >
      {brand.logo ? (
        <Image
          src="/land-rover-logo.png"
          alt=""
          width={124}
          height={63}
          className="h-auto w-[56px] object-contain md:w-[68px]"
        />
      ) : null}
      <p className="text-[0.82rem] font-bold uppercase tracking-[0.18em] md:text-[0.9rem] md:tracking-[0.22em]">
        {title}
      </p>
    </div>
  );
}

function VerdictBadge({ verdict }) {
  const color = toneText[verdict.tone] || toneText.green;

  return (
    <span className={`inline-flex items-center gap-1.5 ${color}`}>
      <HomeIcon name={verdict.icon} size={28} className="h-6 w-6 shrink-0 md:h-7 md:w-7" />
      <span className="text-[0.72rem] font-semibold leading-tight md:text-[0.8rem]">{verdict.text}</span>
    </span>
  );
}

function ModelRow({ item, isDark }) {
  return (
    <Link
      href={item.href || "#"}
      className={`grid grid-cols-[64px_minmax(0,1fr)_auto_18px] items-center gap-3 border-b px-3 py-3 last:border-b-0 md:grid-cols-[72px_minmax(0,1.1fr)_minmax(130px,0.9fr)_20px] md:gap-4 md:px-4 md:py-3.5 ${
        isDark
          ? "border-white/10 text-white hover:bg-white/5"
          : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"
      }`}
    >
      <div className="relative h-11 w-16 overflow-hidden rounded md:h-12 md:w-[4.5rem]">
        <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" sizes="80px" />
      </div>

      <div className="min-w-0">
        <p className="font-lora text-[1rem] font-medium leading-tight md:text-[1.15rem]">{item.model}</p>
        <p className={`mt-0.5 text-[0.72rem] md:text-[0.8rem] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
          {item.generations}
        </p>
      </div>

      <div className="justify-self-end md:justify-self-start">
        <VerdictBadge verdict={item.verdict} />
      </div>

      <span className={`justify-self-end ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
        <ChevronIcon className="h-4 w-4 md:h-5 md:w-5" />
      </span>
    </Link>
  );
}

function BrandColumn({ brand, isDark }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_14px_36px_var(--color-shadow)] ${
        isDark
          ? "border-[rgba(105,181,138,0.22)] bg-[rgba(16,28,24,0.88)]"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <BrandHeader brand={brand} isDark={isDark} />
      <div>
        {(brand.models || []).map((item) => (
          <ModelRow key={item.model} item={item} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function IdentifyCta({ cta, isDark }) {
  if (!cta) return null;

  return (
    <div
      className={`mt-5 overflow-hidden rounded-xl border md:mt-6 ${
        isDark ? "border-white/10 bg-[rgba(16,28,24,0.92)]" : "border-transparent bg-[var(--color-primary)]"
      }`}
    >
      <div className="relative flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6 md:py-5">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] md:block">
          <Image
            src="/Section-2-Bg-light.webp"
            alt=""
            fill
            className="object-cover object-right opacity-45 mix-blend-luminosity"
            sizes="40vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-primary)_0%,rgba(23,95,70,0.55)_55%,transparent_100%)]" />
        </div>

        <div className="relative z-10 flex items-start gap-3 md:max-w-[52%] md:items-center md:gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10">
            <HomeIcon name={cta.icon || "check"} size={36} tone="silver" className="h-8 w-8" />
          </span>
          <div>
            <p className="font-lora text-[1.05rem] font-medium leading-tight text-white md:text-[1.2rem]">
              {cta.title}
            </p>
            <p className="mt-1 text-[0.78rem] leading-[1.4] text-white/82 md:text-[0.88rem]">{cta.text}</p>
          </div>
        </div>

        <Link
          href={cta.href || "/quote"}
          className="btn-cta relative z-10 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[var(--color-accent)] px-5 py-3 text-[0.82rem] font-bold tracking-[0.06em] text-white md:w-auto md:min-w-[240px]"
        >
          <span>{cta.buttonLabel}</span>
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function HomeSec2({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionBg = "/sec2-bg.webp";
  const brands = data.brands || [];

  return (
    <section className="find-your-vehicle relative overflow-hidden bg-[var(--color-page)] px-3 py-6 md:px-6 md:py-8">
      <div className="absolute inset-0">
        <Image src={sectionBg} alt="" fill className="object-cover object-[top_right]" sizes="100vw" />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(180deg,rgba(13,28,24,0.94)_0%,rgba(13,28,24,0.88)_40%,rgba(13,28,24,0.94)_100%)]"
              : "bg-[linear-gradient(180deg,rgba(248,247,242,0.96)_0%,rgba(248,247,242,0.9)_40%,rgba(248,247,242,0.94)_100%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[640px]">
          <HeadingEyebrow text={data.eyebrow || "FIND YOUR VEHICLE"} />
          <h2
            className={`mt-3 text-[2.35rem] font-medium leading-[1.05] tracking-normal md:text-[3.2rem] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            Find Your <span className="text-[var(--color-primary)]">Vehicle</span>
          </h2>
          <p
            className={`mt-3 max-w-[520px] text-[0.9rem] leading-[1.45] md:text-[1.05rem] ${
              isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />
        </div>

        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-5">
          {brands.map((brand) => (
            <BrandColumn key={brand.id} brand={brand} isDark={isDark} />
          ))}
        </div>

        <IdentifyCta cta={data.cta} isDark={isDark} />
      </div>
    </section>
  );
}
