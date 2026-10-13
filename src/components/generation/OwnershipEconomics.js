"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";

const HEADER_IMAGE = "/sec2-bg.webp";
const mobileTitleShadow =
  "[text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_10px_rgba(255,255,255,0.85)]";

const verdictStyles = {
  warning: { icon: "expensiveFailure", light: "text-[#d97517]", dark: "text-[#ffb05a]" },
  success: { icon: "check", light: "text-[#13884a]", dark: "text-[#67d99a]" },
  danger: { icon: "expensiveFailure", light: "text-[#db2e2e]", dark: "text-[#ff8b90]" },
  info: { icon: "note", light: "text-[var(--color-primary)]", dark: "text-[var(--color-text)]" },
};

function VerdictPill({ verdictType, text, isDark }) {
  const style = verdictStyles[verdictType] || verdictStyles.info;
  const iconColor = isDark ? style.dark : style.light;
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <span className={`inline-flex items-start gap-2 text-[0.78rem] leading-[1.25] ${textColor}`}>
      <HomeIcon name={style.icon} size={32} className={`mt-0.5 h-8 w-8 shrink-0 ${iconColor}`} />
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </span>
  );
}

function DesktopRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid grid-cols-[110px_100px_1fr_130px_150px_1.4fr] items-center gap-px ${rowClass} px-5 py-3.5 text-[0.85rem] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <div className="pl-3">
        <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
      </div>
    </div>
  );
}

const MOBILE_COLS = "grid-cols-[90px_90px_140px_110px_120px_220px]";

function MobileRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid ${MOBILE_COLS} items-center gap-px ${rowClass} px-3 py-3 text-[0.72rem] leading-[1.3] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <div className="pl-2">
        <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
      </div>
    </div>
  );
}

const takeawayIcons = ["flagshipChoice", "trend", "topChoice"];
const COLUMN_ICONS = ["engine", "checkWatch", "expensiveFailure", "repairVsReplace", "repairVsReplace", "safestBuy"];

export default function OwnershipEconomics({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const headerBg = isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  return (
    <section
      className={`relative text-[var(--color-text)] ${sectionBgClass(band)}`}
      style={{ "--section-fade": rgb }}
    >
      {/* Image sizes to heading block — headings only */}
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
          <HeadingEyebrow text="OWNERSHIP ECONOMICS" />
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

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-6 md:px-8 md:pb-8">
        <div className="mt-6 hidden overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid grid-cols-[110px_100px_1fr_130px_150px_1.4fr] gap-px ${headerBg} px-5 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`flex items-center gap-2 px-3 border-r ${headerDivider} last:border-r-0`}>
                <HomeIcon name={COLUMN_ICONS[index]} size={32} className="h-8 w-8 shrink-0" />
                {col}
              </span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row) => (
              <DesktopRow key={row.engine} row={row} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[8px] border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:hidden">
          <div className="min-w-[850px]">
            <div className={`grid ${MOBILE_COLS} gap-px ${headerBg} px-3 py-2.5 text-[0.7rem] font-semibold leading-[1.2] text-white`}>
              {data.columns?.map((col, index) => (
                <span key={col} className={`flex items-center gap-1.5 px-2 border-r ${headerDivider} last:border-r-0`}>
                  <HomeIcon name={COLUMN_ICONS[index]} size={28} className="h-7 w-7 shrink-0" />
                  {col}
                </span>
              ))}
            </div>
            <div className={bodyWrapperBg}>
              {data.rows?.map((row) => (
                <MobileRow key={row.engine} row={row} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[0.85fr_1.15fr]">
          {data.economicsRule ? (
            <>
              {/* Mobile: floated icon — title beside it, description wraps under the icon */}
              <div className="rounded-[8px] border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-3.5 md:hidden">
                <span className="mr-3 flex h-14 w-14 float-left items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <HomeIcon name="scale" size={36} className="h-9 w-9" />
                </span>
                <p
                  className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]"
                  dangerouslySetInnerHTML={{ __html: data.economicsRule.title }}
                />
                <p
                  className="mt-2 text-[0.85rem] leading-[1.5] text-[var(--color-text)]"
                  dangerouslySetInnerHTML={{ __html: data.economicsRule.text }}
                />
                {data.economicsRule.highlight ? (
                  <p
                    className="mt-2 text-[0.9rem] font-bold text-[var(--color-primary)]"
                    dangerouslySetInnerHTML={{ __html: data.economicsRule.highlight }}
                  />
                ) : null}
                <div className="clear-both" />
              </div>

              {/* Desktop: icon beside copy, vertically centered */}
              <div className="hidden items-center gap-4 rounded-[8px] border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-3.5 md:flex">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <HomeIcon name="scale" size={44} className="h-11 w-11" />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]"
                    dangerouslySetInnerHTML={{ __html: data.economicsRule.title }}
                  />
                  <p
                    className="mt-2 text-[0.85rem] leading-[1.5] text-[var(--color-text)]"
                    dangerouslySetInnerHTML={{ __html: data.economicsRule.text }}
                  />
                  {data.economicsRule.highlight ? (
                    <p
                      className="mt-2 text-[0.9rem] font-bold text-[var(--color-primary)]"
                      dangerouslySetInnerHTML={{ __html: data.economicsRule.highlight }}
                    />
                  ) : null}
                </div>
              </div>
            </>
          ) : null}

          {data.keyTakeaways?.length > 0 ? (
            <div className="glass-panel rounded-[8px] p-3.5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Key Takeaways
              </p>
              <ul className="mt-2.5 flex flex-col gap-2.5">
                {data.keyTakeaways.map((item, index) => (
                  <li key={item.question} className="flex items-start gap-3 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                      <HomeIcon name={takeawayIcons[index % takeawayIcons.length]} size={28} className="h-7 w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.85rem] font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.question }} />
                      <p className="text-[0.8rem] leading-[1.4] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
