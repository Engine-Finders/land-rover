"use client";

import Image from "next/image";
import Link from "next/link";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";

const HEADER_IMAGE = "/sec2-bg.webp";
const mobileTitleShadow =
  "[text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_10px_rgba(255,255,255,0.85)]";

function VariantPanel({ title, variants, tone, isDark }) {
  if (!variants?.length) return null;
  const isDiesel = tone === "diesel";
  const labelToneClass = isDiesel ? "text-[var(--color-primary)]" : "text-[#189454]";
  const blockToneClass = isDiesel ? "bg-[var(--color-primary)]" : "bg-[#189454]";
  const textClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const separatorClass = isDark ? "text-white/50" : "text-[var(--color-text-soft)]";

  return (
    <div className="glass-panel flex items-stretch overflow-hidden rounded-[8px]">
      <span
        className={`flex w-16 shrink-0 items-center justify-center text-white ${blockToneClass}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
      >
        <HomeIcon name="engine" size={40} className="h-10 w-10" />
      </span>
      <div className="min-w-0 flex-1 py-4 pl-3 pr-4">
        <p className={`text-[0.76rem] font-semibold uppercase tracking-wide ${labelToneClass}`}>
          {title}
        </p>
        <p className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.98rem] font-bold leading-snug ${textClass}`}>
          {variants.map((variant, index) => (
            <span key={variant.url || variant.name || index} className="inline-flex items-center">
              <Link
                href={variant.url || "#"}
                className={`cursor-pointer rounded-sm px-1 py-0.5 transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none active:text-[var(--color-primary)] ${textClass}`}
                dangerouslySetInnerHTML={{ __html: variant.name }}
              />
              {index < variants.length - 1 ? (
                <span aria-hidden="true" className={separatorClass}>
                  •
                </span>
              ) : null}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default function CoreVariants({ data, band = "soft" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const scopeNoteTextClass = isDark ? "text-white/85" : "text-[var(--color-text-muted)]";
  const scopeNoteStrongClass = isDark ? "text-white" : "text-[var(--color-text)]";

  const scopeNoteBlock = data.scopeNote ? (
    <div className="glass-panel flex gap-3 rounded-[8px] p-4">
      <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
        <HomeIcon name="note" size={28} className="h-7 w-7" />
      </span>
      <p className={`text-[0.82rem] leading-[1.5] ${scopeNoteTextClass}`}>
        <span className={`font-semibold ${scopeNoteStrongClass}`}>Scope note: </span>
        <span dangerouslySetInnerHTML={{ __html: data.scopeNote }} />
      </p>
    </div>
  ) : null;

  return (
    <section
      className={`relative text-[var(--color-text)] ${sectionBgClass(band)}`}
      style={{ "--section-fade": rgb }}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={HEADER_IMAGE}
            alt=""
            fill
            className="object-cover object-[78%_center] md:object-[75%_center]"
            sizes="100vw"
            priority
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.78)_0%,rgba(var(--section-fade),0.55)_50%,rgba(var(--section-fade),0.98)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.96)_0%,rgba(var(--section-fade),0.72)_42%,rgba(var(--section-fade),0.2)_80%)]"
                : "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.55)_0%,rgba(var(--section-fade),0.32)_45%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_44%,rgba(var(--section-fade),0.12)_80%)]"
            }
          />
          <div
            className={`absolute inset-0 md:hidden ${
              isDark
                ? "bg-[radial-gradient(120%_85%_at_0%_18%,rgba(var(--section-fade),0.95)_0%,rgba(var(--section-fade),0.65)_45%,transparent_75%)]"
                : "bg-[radial-gradient(120%_85%_at_0%_18%,rgba(var(--section-fade),0.88)_0%,rgba(var(--section-fade),0.5)_45%,transparent_75%)]"
            }`}
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-7 pt-6 md:px-8 md:pb-10 md:pt-8">
          <HeadingEyebrow text="CORE VARIANTS" />
          <h2
            className={`mt-2 font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem] ${
              isDark
                ? "text-white md:text-[var(--color-text)]"
                : `text-black md:text-[var(--color-text)] ${mobileTitleShadow} md:[text-shadow:none]`
            }`}
          >
            {data.h2 || "Core Variants"}
          </h2>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-8 md:px-8 md:pb-10">
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <VariantPanel
            title="Diesel Variants"
            variants={data.dieselVariants}
            tone="diesel"
            isDark={isDark}
          />
          <VariantPanel
            title="Petrol Variants"
            variants={data.petrolVariants}
            tone="petrol"
            isDark={isDark}
          />
        </div>
        {scopeNoteBlock ? <div className="mt-4">{scopeNoteBlock}</div> : null}
      </div>
    </section>
  );
}
