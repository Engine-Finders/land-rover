"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const verdictStyles = {
  best: "border-[#f6d98a] bg-[#fff7e3] text-[#5b3a00]",
  success: "border-[#cdebd3] bg-[#f0fbf3] text-[#0b5c2c]",
  fire: "border-[#f8cfae] bg-[#fff2e8] text-[#9a3c00]",
  watch: "border-[#f5d8ab] bg-[#fff8ec] text-[#7a4a00]",
  crown: "border-[#f3d58a] bg-[#fff8e3] text-[#6b4a00]",
  diamond: "border-[#dcd1f7] bg-[#f5f1ff] text-[#46348a]",
};

const iconPaths = {
  insight: <path d="M4 20h16M7 16V9m5 7V5m5 11v-4m-9 8 4-4 3 3 5-7" />,
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {iconPaths[name] || iconPaths.insight}
    </svg>
  );
}

function HeaderImage({ data, isDark }) {
  return (
    <div className={`relative mt-5 overflow-hidden rounded-md border shadow-[0_12px_28px_rgba(10,26,43,0.06)] md:mt-0 md:h-[308px] md:rounded-none md:border-0 md:bg-transparent md:shadow-none ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="relative h-[220px] sm:h-[250px] md:h-full">
        <Image
          src={data.headerImage.src}
          alt={data.headerImage.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 48vw"
        />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(13,28,24,0.14)_0%,rgba(13,28,24,0.32)_100%)] md:hidden" : "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.06)_100%)] md:hidden"} />
        <div className={`absolute left-[-28px] top-0 hidden h-full w-18 skew-x-[-22deg] md:block ${isDark ? "bg-[#0d1c18]" : "bg-white"}`} />
        <div className="absolute left-[-10px] top-0 hidden h-full w-2 skew-x-[-22deg] bg-[var(--color-primary)] md:block" />
      </div>
    </div>
  );
}

function DesktopHeader({ data, isDark }) {
  return (
    <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_48%] md:items-start">
      <div className="relative z-10 max-w-[640px] pt-6">
        <h2 className={`text-[3.35rem] font-bold leading-[1.05] tracking-normal ${isDark ? "text-white" : "text-[#071827]"}`}>Every Model. Every Generation. Honestly Rated.</h2>
        <div className="mt-4">
          <MStripe />
        </div>
        <p className={`mt-5 max-w-[520px] text-[0.96rem] leading-[1.55] ${isDark ? "text-white/78" : "text-[#172334]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
      </div>
      <HeaderImage data={data} isDark={isDark} />
    </div>
  );
}

function MobileHeader({ data, isDark }) {
  return (
    <div className="md:hidden">
      <h2 className={`mt-3 text-[2rem] font-bold leading-[1.06] tracking-normal sm:text-[2.35rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Every Model. Every Generation. Honestly Rated.</h2>
      <div className="mt-4">
        <MStripe />
      </div>
      <p className={`mt-4 max-w-[380px] text-[0.94rem] leading-[1.5] sm:text-[0.98rem] ${isDark ? "text-white/78" : "text-[#172334]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
      <HeaderImage data={data} isDark={isDark} />
    </div>
  );
}

function VerdictBadge({ verdict }) {
  return (
    <span className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[0.76rem] font-bold md:gap-3 md:px-3 md:py-2 md:text-[0.9rem] ${verdictStyles[verdict.type] || verdictStyles.best}`}>
      <span>{verdict.icon}</span>
      <span>{verdict.text}</span>
    </span>
  );
}

function DesktopTable({ data, isDark }) {
  return (
    <div className={`hidden overflow-hidden rounded-md border shadow-[0_14px_36px_rgba(10,26,43,0.06)] md:block ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px] bg-[var(--color-chrome)] text-white">
        {data.columns.map((column) => (
          <div key={column} className="border-r border-white/18 px-8 py-3 text-center text-[1rem] font-bold uppercase last:border-r-0">
            {column}
          </div>
        ))}
      </div>

      {data.rows.map((row) => (
        <div key={row.model} className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px] items-center border-b last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e7ebf0]"}`}>
          <p className={`px-6 py-4 text-[1.05rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{row.model}</p>
          <p className={`border-l px-6 py-4 text-[1rem] font-medium ${isDark ? "border-[var(--color-border)] text-white/84" : "border-[#e7ebf0] text-[#172334]"}`}>{row.generations}</p>
          <div className="flex justify-center border-l px-4 py-4">
            <VerdictBadge verdict={row.verdict} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileTable({ data, isDark }) {
  return (
    <div className="mt-4 grid gap-3 md:hidden">
      {data.rows.map((row) => (
        <article key={row.model} className={`rounded-md border px-4 py-4 shadow-[0_10px_24px_rgba(10,26,43,0.05)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className={`text-[1rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{row.model}</h3>
            <VerdictBadge verdict={row.verdict} />
          </div>
          <p className={`mt-2 text-[0.86rem] leading-[1.4] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{row.generations}</p>
        </article>
      ))}
    </div>
  );
}

function ExampleVerdict({ text, isDark }) {
  return (
    <div className={`mt-4 rounded-md border px-4 py-4 shadow-[0_12px_28px_rgba(10,26,43,0.04)] md:mt-4 md:px-8 md:py-5 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[#dfe5ed] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]"}`}>
      <div className="grid gap-4 md:grid-cols-[92px_1fr] md:items-center">
        <span className={`flex h-15 w-15 items-center justify-center rounded-md text-white shadow-[0_12px_26px_rgba(7,95,216,0.2)] md:h-16 md:w-16 ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
          <Icon name="insight" className="h-9 w-9 md:h-8 md:w-8" strokeWidth={2.2} />
        </span>
        <p className={`text-[0.9rem] leading-[1.52] md:text-[1.02rem] ${isDark ? "text-white/84" : "text-[#172334]"}`}>
          <span className="mr-2 font-bold uppercase text-[var(--color-primary)]">Example Verdict — Land Rover Discovery</span>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </p>
      </div>
    </div>
  );
}

export default function HomeSec11({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-4 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#0d1c18]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[318px] md:block">
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,#0d1c18_0%,rgba(13,28,24,0.96)_44%,rgba(13,28,24,0)_70%)]" : "absolute inset-0 bg-[linear-gradient(90deg,white_0%,rgba(255,255,255,0.96)_44%,rgba(255,255,255,0)_70%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <DesktopHeader data={data} isDark={isDark} />
        <MobileHeader data={data} isDark={isDark} />
        <div className="mt-6">
          <DesktopTable data={data} isDark={isDark} />
          <MobileTable data={data} isDark={isDark} />
        </div>
        <ExampleVerdict text={data.exampleVerdict} isDark={isDark} />
      </div>
    </section>
  );
}
