"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function splitHeadline(headline = "") {
  const cleaned = headline.replace(/\s*→\s*$/, "");
  const qIndex = cleaned.indexOf("? ");
  if (qIndex === -1) return { title: cleaned, subtitle: "" };
  return { title: cleaned.slice(0, qIndex + 1), subtitle: cleaned.slice(qIndex + 2) };
}

export default function QuotesCta({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/320d/compare_dark.webp" : "/320d/compare_light.webp";
  const { title, subtitle } = splitHeadline(data.headline);
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <section className={`w-full py-8 text-[var(--color-text)] md:py-10 ${sectionBgClass(band)}`}>
      <div className="mx-auto w-full max-w-8xl px-4 md:px-8">
        <HeadingEyebrow text="COMPARE QUOTES" />
        <div className="relative mt-3 overflow-hidden rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-6 md:bg-[var(--color-page)] md:p-10">
          <div className="absolute inset-0 hidden md:block">
            <Image src={image} alt="" fill className="object-cover object-right" sizes="100vw" />
            {isDark ? (
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.95)_0%,rgba(2,7,17,0.75)_45%,rgba(2,7,17,0.15)_85%)]" />
            ) : null}
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-col gap-3 md:max-w-[55%]">
              <div>
                <h2 className={`font-lora text-[1.6rem] font-medium leading-[1.15] md:text-[2.1rem] ${headingClass}`}>{title}</h2>
                {subtitle ? (
                  <p className="mt-1 flex items-center gap-1.5 text-[0.95rem] font-semibold leading-[1.3] text-[var(--color-primary)] md:text-[1.1rem]">
                    {subtitle}
                    <ArrowIcon className="h-4 w-4 shrink-0" />
                  </p>
                ) : null}
              </div>

              {data.supportingLine ? (
                <p className={`text-[0.88rem] leading-[1.5] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: data.supportingLine }} />
              ) : null}

              {data.button ? (
                <a
                  href="/quote"
                  className="btn-cta mt-1 flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-[#189454] px-4 py-2.5 text-center text-[0.76rem] font-bold text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:w-fit md:px-6 md:py-3.5 md:text-[0.85rem]"
                >
                  <HomeIcon name="quote" size={36} className="h-9 w-9 shrink-0" />
                  {data.button.label.replace(/\s*→\s*$/, "")}
                  <ArrowIcon className="h-4 w-4 shrink-0" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
