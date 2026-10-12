"use client";

import Image from "next/image";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

const GEN_TO_HOME = {
  warning: "expensiveFailure",
  wrench: "repairVsReplace",
  car: "vehicle",
  gauge: "trend",
  chart: "trend",
  shield: "safestBuy",
  clock: "checkWatch",
  tag: "quote",
  engine: "engine",
  refresh: "checkWatch",
  dollar: "checkValue",
  pin: "ukDelivery",
  drum: "engine",
  info: "note",
};

function toHomeIcon(name) {
  return GEN_TO_HOME[name] || "note";
}

const COLUMN_ICONS = ["car", "engine", "tag", "refresh", "shield", "clock"];

function DesktopRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const codeText = isDark ? "text-[var(--color-text)]" : "text-[var(--color-primary)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid grid-cols-[1.3fr_1fr_1fr_1.1fr_1fr_0.8fr] items-center gap-px ${rowClass} px-5 py-3.5 text-[0.85rem] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.variant }} />
      <span className={`px-3 ${codeText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engineCode }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.usedSupply }} />
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.reconditionedSupply }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.rebuiltSupply }} />
      <span className={`px-3 ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.labourHours }} />
    </div>
  );
}

const METRIC_ROWS = [
  { key: "usedSupply", label: "Used (Supply)", icon: "tag" },
  { key: "reconditionedSupply", label: "Reconditioned (Supply)", icon: "refresh" },
  { key: "rebuiltSupply", label: "Rebuilt (Supply)", icon: "shield" },
  { key: "labourHours", label: "Labour Hours", icon: "clock" },
];

function FuelTable({ title, icon, rows, isDark, tone }) {
  if (!rows?.length) return null;

  const toneBg = tone === "diesel" ? "bg-[var(--color-primary)]" : "bg-[#189454]";
  const tabBg = isDark ? (tone === "diesel" ? "bg-[var(--color-chrome)]" : "bg-[#0f3b28]") : toneBg;
  const rowBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const rowText = isDark ? "text-white" : "text-[var(--color-text)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const labelBg = isDark ? "bg-white/[0.03]" : "bg-[var(--color-page-soft)]";
  const gridCols = `120px repeat(${rows.length}, 130px)`;

  return (
    <div className={`overflow-hidden rounded-[8px] border ${cellDivider} ${rowBg} shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur`}>
      <div className={`flex items-center gap-2 ${tabBg} px-4 py-2.5 text-[0.78rem] font-semibold uppercase tracking-wide text-white`}>
        <HomeIcon name={toHomeIcon(icon)} size={24} className="h-6 w-6" />
        {title}
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: `calc(120px + ${rows.length} * 130px)` }}>
          <div className={`grid border-b ${cellDivider}`} style={{ gridTemplateColumns: gridCols }}>
            <div className={labelBg} />
            {rows.map((row, index) => (
              <div
                key={row.engineCode}
                className={`flex flex-col items-center justify-center gap-1 border-l px-2 py-3 text-center ${cellDivider} ${
                  index === 0 ? `${toneBg} text-white` : `${rowBg} ${rowText}`
                }`}
                style={
                  index === 0
                    ? { clipPath: "polygon(0 0, 100% 0, 100% 78%, 88% 100%, 0 100%)" }
                    : undefined
                }
              >
                <HomeIcon name={tone === "diesel" ? "engine" : "vehicle"} size={24} className="h-6 w-6" />
                <span className="text-[0.72rem] font-bold leading-tight" dangerouslySetInnerHTML={{ __html: row.variant }} />
                <span
                  className={`text-[0.66rem] leading-tight ${index === 0 ? "text-white/80" : "text-[var(--color-primary)]"}`}
                  dangerouslySetInnerHTML={{ __html: row.engineCode }}
                />
              </div>
            ))}
          </div>

          {METRIC_ROWS.map((metric, metricIndex) => (
            <div
              key={metric.key}
              className={`grid ${metricIndex === METRIC_ROWS.length - 1 ? "" : `border-b ${cellDivider}`}`}
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className={`flex items-center gap-1.5 border-r px-2 py-3 text-[0.68rem] font-semibold uppercase tracking-wide ${cellDivider} ${labelBg} ${mutedText}`}>
                <HomeIcon name={toHomeIcon(metric.icon)} size={20} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                {metric.label}
              </div>
              {rows.map((row) => (
                <div
                  key={row.engineCode}
                  className={`flex items-center justify-center border-l px-2 py-3 text-center text-[0.78rem] ${cellDivider} ${rowText}`}
                  dangerouslySetInnerHTML={{ __html: row[metric.key] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReplacementCosts({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const headerBg = isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  const petrolRows = data.rows?.filter((row) => row.fuelType === "petrol") || [];
  const dieselRows = data.rows?.filter((row) => row.fuelType === "diesel") || [];
  const headerImage = isDark ? "/e90/engine_replacement_dark.webp" : "/e90/engine_replacement_light.webp";
  const headerImageMobile = isDark ? "/e90/engine_replacement_mobile_dark.webp" : "/e90/engine_replacement_mobile_light.webp";
  const headerHeadingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const headerSubClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <section className={`w-full py-8 text-[var(--color-text)] md:py-10 ${sectionBgClass(band)}`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          <Image src={headerImage} alt="" fill className="object-cover" sizes="100vw" priority />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.9)_0%,rgba(2,7,11,0.72)_32%,transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(2,7,17,0.65)_0%,transparent_100%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.72)_32%,transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(255,255,255,0.65)_0%,transparent_100%)]" />
            </>
          )}
        </div>

        <div className="relative -mb-px h-[200px] w-full overflow-hidden md:hidden">
          <Image src={headerImageMobile} alt="" fill className="object-cover" sizes="100vw" priority />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(180deg,transparent_55%,rgba(2,7,17,1)_97%)]"
                : "bg-[linear-gradient(180deg,transparent_55%,rgba(255,255,255,1)_97%)]"
            }`}
          />
          <div className={`absolute inset-x-0 bottom-0 h-3 ${sectionBgClass(band)}`} />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 py-6 md:px-8 md:py-10">
          <HeadingEyebrow text="REPLACEMENT COSTS" />
          <h2
            className={`mt-2 max-w-[720px] font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem] ${headerHeadingClass}`}
            dangerouslySetInnerHTML={{ __html: data.h2 }}
          />
          {data.subHeadline ? (
            <p
              className={`mt-4 max-w-[560px] text-[0.88rem] leading-[1.4] md:mt-5 md:text-[1.08rem] md:leading-[1.42] ${headerSubClass}`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          ) : null}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="mt-6 hidden overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid grid-cols-[1.3fr_1fr_1fr_1.1fr_1fr_0.8fr] gap-px ${headerBg} px-5 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`flex items-center gap-2 px-3 border-r ${headerDivider} last:border-r-0`}>
                <HomeIcon name={toHomeIcon(COLUMN_ICONS[index])} size={24} className="h-6 w-6 shrink-0" />
                {col}
              </span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row) => (
              <DesktopRow key={row.engineCode} row={row} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:hidden">
          <FuelTable title="Petrol Engines" icon="tag" rows={petrolRows} isDark={isDark} tone="petrol" />
          <FuelTable title="Diesel Engines" icon="engine" rows={dieselRows} isDark={isDark} tone="diesel" />
        </div>

        {data.trustStrip?.length > 0 ? (
          <div className="glass-panel mt-6 rounded-[8px] p-3 md:flex md:items-stretch md:gap-0 md:p-5">
            <div className="flex flex-col md:hidden">
              {Array.from({ length: Math.ceil(data.trustStrip.length / 2) }, (_, row) => {
                const pair = data.trustStrip.slice(row * 2, row * 2 + 2);
                return (
                  <div
                    key={row}
                    className={`flex items-stretch py-3 first:pt-0 last:pb-0 ${row > 0 ? `border-t ${isDark ? "border-white/15" : "border-[var(--color-border)]"}` : ""}`}
                  >
                    {pair.map((item, i) => (
                      <div key={item.title} className="flex flex-1 items-stretch">
                        {i > 0 ? (
                          <span
                            aria-hidden="true"
                            className={`mx-3 my-1 w-px shrink-0 self-center ${isDark ? "bg-white/15" : "bg-[var(--color-border)]"}`}
                            style={{ height: "70%" }}
                          />
                        ) : null}
                        <div className="flex flex-1 items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                            <HomeIcon name={toHomeIcon(item.icon)} size={40} className="h-10 w-10" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[0.85rem] font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.title }} />
                            <p className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.text }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {data.trustStrip.map((item, index) => (
              <div key={item.title} className="hidden items-stretch md:flex">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className={`mx-3 my-1 w-px shrink-0 self-center ${isDark ? "bg-white/15" : "bg-[var(--color-border)]"}`}
                    style={{ height: "70%" }}
                  />
                ) : null}
                <div className="flex flex-1 items-start gap-3 pl-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <HomeIcon name={toHomeIcon(item.icon)} size={40} className="h-10 w-10" />
                  </span>
                  <div>
                    <p className="text-[0.85rem] font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <p className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.text }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {data.note ? <p className="mt-4 text-[0.78rem] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: data.note }} /> : null}
      </div>
    </section>
  );
}
