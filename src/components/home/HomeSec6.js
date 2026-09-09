"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@/components/home/homeIcons";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBgClass, sectionRgb } from "@/components/home/sectionBand";


const verdictTone = {
  watch: {
    label: "text-[#e0893a]",
    darkLabel: "text-[#ffba6c]",
    icon: "warning",
  },
  scrap: {
    label: "text-[var(--color-accent-red)]",
    darkLabel: "text-[#ff9aa0]",
    icon: "x",
  },
  safe: {
    label: "text-[var(--color-accent-green)]",
    darkLabel: "text-[#7bc39a]",
    icon: "check",
  },
};

function PanelHeader({ title, icon, isDark }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-white ${
        isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
      }`}
    >
      {icon ? <HomeIcon name={icon} size={22} tone="silver" className="h-5 w-5" /> : null}
      <span>{title}</span>
    </div>
  );
}

function VerdictIcon({ type }) {
  if (type === "safe") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }
  if (type === "scrap") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 9v4m0 4h.01M10.3 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L13.7 4.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function VerdictCell({ verdict, isDark }) {
  const tone = verdictTone[verdict?.type] || verdictTone.watch;

  return (
    <div className="min-w-0">
      <p className={`inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.04em] ${isDark ? tone.darkLabel : tone.label}`}>
        <VerdictIcon type={verdict?.type} />
        {verdict?.label}
      </p>
      <p className={`mt-1 text-[0.72rem] leading-[1.35] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
        {verdict?.text}
      </p>
    </div>
  );
}

function MatrixPanel({ matrix, isDark }) {
  if (!matrix) return null;
  const rows = matrix.rows || [];
  const columns = matrix.columns || [];

  return (
    <section
      className={`overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <PanelHeader title={matrix.title || "THE DECISION MATRIX"} icon={matrix.icon} isDark={isDark} />

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className={`text-[0.66rem] font-bold uppercase tracking-[0.05em] ${isDark ? "bg-[var(--color-surface)] text-white/75" : "bg-[var(--color-page-soft)] text-[var(--color-text-soft)]"}`}>
              {columns.map((column) => (
                <th key={column} className={`border-b px-3 py-2.5 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.model} className={isDark ? "text-white" : "text-[var(--color-text)]"}>
                <td className={`border-b px-3 py-2.5 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded">
                      <Image src={row.image?.src || "/right.webp"} alt={row.image?.alt || ""} fill className="object-cover" sizes="56px" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.86rem] font-bold leading-tight">{row.model}</p>
                      {row.engine ? (
                        <p className={`mt-0.5 text-[0.68rem] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>({row.engine})</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className={`border-b px-3 py-2.5 text-[0.82rem] font-semibold ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  {row.vehicleValue}
                </td>
                <td className={`border-b px-3 py-2.5 text-[0.82rem] font-semibold ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  {row.replacementCost}
                </td>
                <td className={`border-b px-3 py-2.5 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                  <VerdictCell verdict={row.verdict} isDark={isDark} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        {rows.map((row) => (
          <div key={row.model} className={`border-b px-3 py-3 last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
            <div className="flex items-center gap-2.5">
              <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded">
                <Image src={row.image?.src || "/right.webp"} alt={row.image?.alt || ""} fill className="object-cover" sizes="56px" />
              </span>
              <div className="min-w-0">
                <p className={`text-[0.9rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.model}</p>
                {row.engine ? (
                  <p className={`mt-0.5 text-[0.68rem] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>({row.engine})</p>
                ) : null}
              </div>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[0.74rem]">
              <div>
                <p className={`font-bold uppercase tracking-[0.04em] ${isDark ? "text-white/50" : "text-[var(--color-text-soft)]"}`}>Vehicle value</p>
                <p className={`mt-0.5 font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.vehicleValue}</p>
              </div>
              <div>
                <p className={`font-bold uppercase tracking-[0.04em] ${isDark ? "text-white/50" : "text-[var(--color-text-soft)]"}`}>Replacement</p>
                <p className={`mt-0.5 font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{row.replacementCost}</p>
              </div>
            </div>
            <div className="mt-2.5">
              <VerdictCell verdict={row.verdict} isDark={isDark} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RuleOfThumb({ rule, isDark }) {
  if (!rule) return null;

  return (
    <section
      className={`overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <PanelHeader title={rule.title || "THE RULE OF THUMB"} icon={rule.icon || "scale"} isDark={isDark} />
      <div className="flex items-stretch gap-3 p-4 md:gap-4">
        <div className="shrink-0 text-center">
          <p className={`font-lora text-[2.6rem] font-medium leading-none md:text-[3rem] ${isDark ? "text-white" : "text-[var(--color-primary)]"}`}>
            {rule.percent}
          </p>
          <p className={`mt-1 text-[0.62rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
            {rule.percentLabel}
          </p>
        </div>
        <span className="w-px shrink-0 bg-[var(--color-accent)]" />
        <p className={`text-[0.8rem] leading-[1.45] md:text-[0.84rem] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
          {rule.text}
        </p>
      </div>
    </section>
  );
}

function DeeperLinks({ deeper, isDark }) {
  if (!deeper?.items?.length) return null;

  return (
    <section
      className={`overflow-hidden rounded-md border shadow-[0_12px_32px_var(--color-shadow)] ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <PanelHeader title={deeper.title || "DEEPER ANALYSIS LINKS"} icon={deeper.icon || "knowledgeCentre"} isDark={isDark} />
      <ul>
        {deeper.items.map((item) => (
          <li key={item.id} className={`border-b last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
            <Link
              href={item.href || "#"}
              className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "text-white hover:bg-white/5" : "text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold text-white ${
                  isDark ? "bg-[var(--color-chrome)]" : "bg-[#0d1c18]"
                }`}
              >
                {item.id}
              </span>
              <span className="min-w-0 flex-1 text-[0.82rem] font-semibold leading-tight">{item.label}</span>
              <span className="text-[var(--color-primary)]">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-md border px-4 py-4 md:items-center md:gap-4 md:px-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <HomeIcon name={note.icon || "realData"} size={28} tone="silver" className="h-6 w-6" />
      </span>
      <div className={`border-l-2 border-[var(--color-accent)] pl-3 ${isDark ? "text-white/82" : "text-[var(--color-text-muted)]"}`}>
        <p className="text-[0.8rem] leading-[1.45] md:text-[0.88rem]">
          <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.title}</strong> {note.text}
        </p>
      </div>
    </div>
  );
}

export default function HomeSec6({ data, band = "page" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = sectionRgb(band, isDark);
  const headerImage = data.headerImage?.src || "/sec2-bg.webp";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${sectionBgClass(band)}`} style={{ "--section-fade": rgb }}>
      <div className="absolute inset-x-0 top-0 h-[240px] md:h-[300px]">
        <Image
          src={headerImage}
          alt={data.headerImage?.alt || ""}
          fill
          className="object-cover object-[78%_center] md:object-[75%_center]"
          sizes="100vw"
        />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.78)_0%,rgba(var(--section-fade),0.62)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.96)_0%,rgba(var(--section-fade),0.72)_42%,rgba(var(--section-fade),0.2)_80%)]"
              : "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--section-fade),0.72)_0%,rgba(var(--section-fade),0.48)_40%,rgba(var(--section-fade),0.96)_100%)] md:bg-[linear-gradient(90deg,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_44%,rgba(var(--section-fade),0.12)_80%)]"
          }
        />
        <div
          className={`pointer-events-none absolute inset-0 md:hidden ${
            isDark
              ? "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(var(--section-fade),0.95)_0%,rgba(var(--section-fade),0.7)_42%,transparent_72%)]"
              : "bg-[radial-gradient(120%_85%_at_0%_20%,rgba(var(--section-fade),0.97)_0%,rgba(var(--section-fade),0.82)_42%,transparent_72%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="relative max-w-[720px] text-left">
          <div
            className={`pointer-events-none absolute -inset-x-2 -top-3 -bottom-4 md:hidden ${
              isDark
                ? "bg-[linear-gradient(180deg,rgba(var(--section-fade),0.9)_0%,rgba(var(--section-fade),0.55)_55%,transparent_100%)]"
                : "bg-[linear-gradient(180deg,rgba(var(--section-fade),0.94)_0%,rgba(var(--section-fade),0.6)_55%,transparent_100%)]"
            }`}
          />
          <div className="relative z-10">
            <HeadingEyebrow text={data.eyebrow || "SECTION 08"} />
            <h2
              className={`mt-3 text-[2.1rem] font-medium leading-[1.08] tracking-normal md:text-[3.1rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              The Ownership Economics Centre
            </h2>
            <p
              className={`mt-4 max-w-[640px] text-[0.9rem] leading-[1.45] md:text-[1.02rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[minmax(0,1.95fr)_minmax(250px,0.78fr)] lg:items-start lg:gap-5">
          <MatrixPanel matrix={data.matrix} isDark={isDark} />
          <div className="grid gap-4">
            <RuleOfThumb rule={data.ruleOfThumb} isDark={isDark} />
            <DeeperLinks deeper={data.deeperLinks} isDark={isDark} />
          </div>
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
