"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

const ITEM_ICONS = [
  "symptoms",
  "note",
  "checkWatch",
  "airSuspension",
  "drivetrain",
  "engine",
  "expensiveFailure",
  "genuineFailureData",
];

function splitItem(item = "") {
  const clean = item.replace(/^\*\s*/, "");
  const dashIndex = clean.indexOf(" - ");
  if (dashIndex === -1) return { label: clean, text: "" };
  return { label: clean.slice(0, dashIndex), text: clean.slice(dashIndex + 3) };
}

function TrustCard({ className = "", isDark }) {
  const cardBorder = isDark ? "border-white/10" : "border-[var(--color-border)]/75";
  const cardBg = isDark ? "bg-[rgba(2,7,17,0.75)]" : "bg-[var(--color-surface)]";
  const titleClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <div className={`flex w-full max-w-[360px] items-center gap-3 rounded-[8px] border ${cardBorder} ${cardBg} p-3.5 shadow-sm backdrop-blur ${className}`}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
        <HomeIcon name="safestBuy" size={36} className="h-9 w-9" />
      </span>
      <div className="min-w-0">
        <p className={`text-[0.92rem] font-bold leading-tight ${titleClass}`}>Buy smart. Drive with confidence.</p>
        <p className={`mt-1 text-[0.8rem] leading-[1.4] ${bodyClass}`}>
          A few checks today can save thousands tomorrow. Use this checklist to avoid the most common pitfalls.
        </p>
      </div>
    </div>
  );
}

export default function BuyingChecklist({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/320d/checklist_dark.webp" : "/320d/checklist_light.webp";
  const imageMobile = isDark ? "/320d/checklist_mobile_dark.webp" : "/320d/checklist_mobile_light.webp";
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <section className={`relative w-full overflow-hidden text-[var(--color-text)] ${sectionBgClass(band)}`}>
      <div className="relative h-[220px] w-full bg-[var(--color-page)] md:hidden">
        <Image src={imageMobile} alt="" fill className="object-cover" sizes="100vw" />
        {isDark ? (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(0,0,0,0.85)_0%,transparent_100%)]" />
        ) : (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
        )}
      </div>

      <div className="absolute inset-0 hidden md:block">
        <Image src={image} alt="" fill className="object-cover object-right" sizes="100vw" />
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.95)_0%,rgba(2,7,17,0.75)_38%,rgba(2,7,17,0.25)_75%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(2,7,17,0.85)_0%,transparent_100%)]" />
          </>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 py-8 md:px-8 md:py-10 lg:pr-[400px]">
        <div className="flex flex-col gap-5 lg:max-w-[720px]">
          <div>
            <HeadingEyebrow text="BUYING CHECKLIST" />
            <h2 className={`mt-3 font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem] ${headingClass}`}>
              Buying Checklist
            </h2>
            {data.intro ? (
              <p className={`mt-4 max-w-[560px] text-[0.88rem] leading-[1.5] md:text-[1rem] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: data.intro }} />
            ) : null}
          </div>

          {data.items?.length > 0 ? (
            <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
              {data.items.map((item, index) => {
                const { label, text } = splitItem(item);
                return (
                  <div
                    key={item}
                    className="relative flex flex-col items-center gap-2 rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-4 text-center shadow-[0_14px_40px_var(--color-shadow)]"
                  >
                    <span className="absolute left-3 top-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-[0.7rem] font-bold text-white">
                      {index + 1}
                    </span>
                    <HomeIcon name={ITEM_ICONS[index % ITEM_ICONS.length]} size={40} className="mt-2 h-10 w-10" />
                    <p className="text-[0.92rem] font-bold leading-tight text-[var(--color-text)]">{label}</p>
                    {text ? <p className="text-[0.8rem] leading-[1.4] text-[var(--color-text-muted)]">{text}</p> : null}
                  </div>
                );
              })}

              <div className="absolute bottom-0 left-full ml-6 hidden w-[340px] lg:block">
                <TrustCard isDark={isDark} />
              </div>
            </div>
          ) : null}

          <TrustCard className="lg:hidden" isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
