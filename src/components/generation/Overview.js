"use client";

import Image from "next/image";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";
import { useTheme } from "@/components/shared/themeProvider";

const HEADER_IMAGE = "/sec2-bg.webp";
const mobileTitleShadow =
  "[text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_10px_rgba(255,255,255,0.85)]";

const factIcons = ["vehicle", "getGuidance", "expertVerified", "engine"];
const factIconCircled = [false, true, true, false];

function HighlightedLine({ text = "" }) {
  const parts = text.split(/(\[[^\]]+\]|\b\d[\d,.]*\b)/g).filter(Boolean);
  return parts.map((part, i) => {
    const isTag = /^\[[^\]]+\]$/.test(part);
    const isNumber = /^\d[\d,.]*$/.test(part);
    if (isTag || isNumber) {
      return (
        <span key={i} className="font-semibold text-[var(--color-primary)]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function parseKeyFacts(keyFacts) {
  if (Array.isArray(keyFacts)) return keyFacts;
  if (typeof keyFacts !== "string" || !keyFacts.trim()) return [];

  return keyFacts
    .split(" • ")
    .map((chunk) => chunk.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((chunk) => {
      const separatorIndex = chunk.indexOf(":");
      if (separatorIndex === -1) return { label: chunk, value: "" };
      return {
        label: chunk.slice(0, separatorIndex).trim(),
        value: chunk.slice(separatorIndex + 1).trim(),
      };
    });
}

export default function Overview({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const keyFacts = parseKeyFacts(data.keyFacts);

  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";
  const cardDividerClass = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const factLabelClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const factValueClass = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const marketLineClass = isDark ? "text-white/85" : "text-[var(--color-text)]";

  const introParts = data.intro
    ? (() => {
        const text = data.intro.trim();
        const match = text.match(/^(.+?[.!?])(?:\s+)(.+)$/);
        if (match) return [match[1], match[2]];
        return [text];
      })()
    : [];

  const factItem = (fact, index) => (
    <div className="flex min-w-0 flex-1 flex-col gap-1 px-1">
      <div className="flex items-center gap-2">
        {factIconCircled[index % factIconCircled.length] ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
            <HomeIcon name={factIcons[index % factIcons.length]} size={18} className="h-[18px] w-[18px]" />
          </span>
        ) : (
          <span className="shrink-0 text-[var(--color-primary)]">
            <HomeIcon name={factIcons[index % factIcons.length]} size={28} className="h-7 w-7" />
          </span>
        )}
        <p className={`min-w-0 text-[0.8rem] font-semibold leading-[1.25] ${factLabelClass}`} dangerouslySetInnerHTML={{ __html: fact.label }} />
      </div>
      {fact.value ? (
        <p className={`w-full text-[0.74rem] leading-[1.3] ${factValueClass}`} dangerouslySetInnerHTML={{ __html: fact.value }} />
      ) : null}
    </div>
  );

  const keyFactsBlock = keyFacts.length > 0 ? (
    <div className="glass-panel mt-4 rounded-[8px] p-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
        Key Facts
      </p>

      {/* Mobile: 2-per-row */}
      <div className="mt-2 flex flex-col md:hidden">
        {Array.from({ length: Math.ceil(keyFacts.length / 2) }, (_, row) => {
          const pair = keyFacts.slice(row * 2, row * 2 + 2);
          return (
            <div
              key={row}
              className={`flex items-stretch py-2 first:pt-2 ${row > 0 ? `border-t ${cardDividerClass}` : ""}`}
            >
              {pair.map((fact, i) => {
                const index = row * 2 + i;
                return (
                  <div key={`kf-m-${index}`} className="flex flex-1 items-stretch">
                    {i > 0 ? (
                      <span
                        aria-hidden="true"
                        className={`mx-2 my-1 w-px shrink-0 self-center ${isDark ? "bg-white/15" : "bg-[var(--color-border)]"}`}
                        style={{ height: "70%" }}
                      />
                    ) : null}
                    {factItem(fact, index)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Desktop: 4-col */}
      <div className="mt-2 hidden grid-cols-4 md:grid">
        {keyFacts.map((fact, index) => (
          <div
            key={`kf-d-${index}`}
            className={`flex flex-col gap-1 border-l py-0 pl-3 first:border-l-0 first:pl-0 ${cardDividerClass}`}
          >
            <div className="flex items-center gap-2">
              {factIconCircled[index % factIconCircled.length] ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
                  <HomeIcon name={factIcons[index % factIcons.length]} size={18} className="h-[18px] w-[18px]" />
                </span>
              ) : (
                <span className="shrink-0 text-[var(--color-primary)]">
                  <HomeIcon name={factIcons[index % factIcons.length]} size={28} className="h-7 w-7" />
                </span>
              )}
              <p className={`min-w-0 text-[0.8rem] font-semibold leading-[1.25] ${factLabelClass}`} dangerouslySetInnerHTML={{ __html: fact.label }} />
            </div>
            {fact.value ? (
              <p className={`w-full text-[0.74rem] leading-[1.3] ${factValueClass}`} dangerouslySetInnerHTML={{ __html: fact.value }} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const marketIntelligenceBlock = data.marketIntelligenceLine ? (
    <div className="glass-panel relative mt-2.5 flex items-start gap-3 rounded-[8px] p-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white md:h-9 md:w-9">
        <HomeIcon name="trend" size={28} className="h-7 w-7 md:h-6 md:w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Market Intelligence
        </p>
        <p className={`mt-1 text-[0.8rem] leading-[1.4] ${marketLineClass}`}>
          <HighlightedLine text={data.marketIntelligenceLine} />
        </p>
      </div>
    </div>
  ) : null;

  return (
    <section
      className={`relative text-[var(--color-text)] ${sectionBgClass(band)}`}
      style={{ "--section-fade": rgb }}
    >
      {/* Header image sizes to headings only - same pattern as other gen sections */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={HEADER_IMAGE}
            alt={data.image?.alt || ""}
            fill
            className="object-cover object-[78%_center] md:object-[75%_center]"
            sizes="100vw"
            priority
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.78)_0%,rgba(var(--section-fade),0.55)_50%,rgba(var(--section-fade),1)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.96)_0%,rgba(var(--section-fade),0.72)_42%,rgba(var(--section-fade),0.15)_78%,rgba(var(--section-fade),0)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.55)_0%,rgba(var(--section-fade),0.32)_45%,rgba(var(--section-fade),1)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_44%,rgba(var(--section-fade),0.1)_78%,rgba(var(--section-fade),0)_100%)]"
            }
          />
          <div className="absolute inset-x-0 bottom-0 hidden h-16 bg-[linear-gradient(0deg,rgba(var(--section-fade),1)_0%,transparent_100%)] md:block" />
          <div
            className={`absolute inset-0 md:hidden ${
              isDark
                ? "bg-[radial-gradient(120%_85%_at_0%_18%,rgba(var(--section-fade),0.95)_0%,rgba(var(--section-fade),0.65)_45%,transparent_75%)]"
                : "bg-[radial-gradient(120%_85%_at_0%_18%,rgba(var(--section-fade),0.88)_0%,rgba(var(--section-fade),0.5)_45%,transparent_75%)]"
            }`}
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-7 pt-6 md:px-8 md:pb-10 md:pt-8">
          <HeadingEyebrow text="OVERVIEW" />
          <h2
            className={`mt-2 max-w-[720px] font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem] ${
              isDark
                ? "text-white md:text-[var(--color-text)]"
                : `text-black md:text-[var(--color-text)] ${mobileTitleShadow} md:[text-shadow:none]`
            }`}
            dangerouslySetInnerHTML={{ __html: data.h2 }}
          />
        </div>
      </div>

      {/* Intro + cards sit below the image - no fixed-height clip on desktop */}
      <div className="relative mx-auto w-full max-w-8xl px-4 pb-7 md:px-8 md:pb-10">
        {introParts.length > 0 ? (
          <div className={`flex flex-col gap-3 text-[0.9rem] leading-[1.5] md:max-w-[920px] md:text-[1.05rem] md:leading-[1.55] ${bodyTextClass}`}>
            {introParts.map((para, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
            ))}
          </div>
        ) : null}

        {keyFactsBlock}
        {marketIntelligenceBlock}
      </div>
    </section>
  );
}
