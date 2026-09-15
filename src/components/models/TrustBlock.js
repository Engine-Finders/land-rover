import Image from "next/image";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";
import { sectionDescription } from "@/components/models/sectionTypography";

function cleanText(text = "") {
  return text
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "BMWEngines.uk";
  const index = clean.indexOf(marker);

  if (index === -1) return { before: clean, accent: "" };

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function signalIconName(item = {}) {
  const value = `${item.icon || ""} ${item.title || ""}`.toLowerCase();
  if (value.includes("heart") || value.includes("💚") || value.includes("tell you") || value.includes("not to repair")) return "genuineFailureData";
  if (value.includes("wrench") || value.includes("specialist") || value.includes("🔧")) return "vettedSpecialists";
  if (value.includes("part of") || value.includes("trophy") || value.includes("🏆") || value.includes("engine finders")) return "engineFinders";
  // graph / chart / real data
  return "realData";
}

function SignalIcon({ item }) {
  const name = signalIconName(item);

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[var(--color-page-soft)] md:h-16 md:w-16">
      <HomeIcon name={name} size={44} className="h-10 w-10 md:h-11 md:w-11" />
    </span>
  );
}

export default function TrustBlock({ data, band = "page" }) {
  if (!data) return null;

  const title = splitTitle(data.h2);
  const signals = data.signals || [];

  return (
    <section className={`px-3 py-6 md:px-6 md:py-7 ${sectionBgClass(band)}`}>
      <div className="mx-auto w-full max-w-8xl overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3.5 text-[var(--color-text)] shadow-[0_10px_30px_var(--color-shadow)] md:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:items-center">
        <div>
          <HeadingEyebrow text="TRUST & PROOF" />
          <h2 className="mt-3 max-w-[650px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
            <span dangerouslySetInnerHTML={{ __html: title.before }} />
            {title.accent ? (
              <>
                <br />
                <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
              </>
            ) : null}
          </h2>

          <div className="mt-4">
            {signals.map((item) => (
              <article key={item.title} className="flex gap-3.5 border-b border-[var(--color-border)] py-3.5 first:pt-0 last:border-b-0 last:pb-0 md:gap-4 md:py-3.5">
                <SignalIcon item={item} />
                <p className="text-[var(--color-text)] text-[15px] leading-[1.42] md:text-[16px]">
                  <strong className="font-bold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: cleanText(item.title) }} />
                  {" - "}
                  <span dangerouslySetInnerHTML={{ __html: cleanText(item.text) }} />
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[340px] lg:block">
          <div className="absolute right-8 top-0 h-[230px] w-[390px] opacity-30">
            <svg aria-hidden="true" viewBox="0 0 430 260" className="h-full w-full text-[var(--color-primary)]" fill="none">
              <path d="M12 220h400" stroke="currentColor" strokeOpacity=".25" />
              {[40, 85, 130, 175, 220, 265, 310, 355, 400].map((x) => (
                <path key={x} d={`M${x} 30v190`} stroke="currentColor" strokeOpacity=".12" />
              ))}
              <path d="M22 180 70 178 120 150 165 115 210 82 260 100 315 55" stroke="currentColor" strokeWidth="3" />
              {[22, 70, 120, 165, 210, 260, 315].map((x, index) => (
                <circle key={x} cx={x} cy={[180, 178, 150, 115, 82, 100, 55][index]} r="6" fill="var(--color-surface)" stroke="currentColor" strokeWidth="3" />
              ))}
              {[190, 220, 250, 285, 330, 370, 405].map((x, index) => (
                <rect key={x} x={x} y={190 - index * 15} width="16" height={30 + index * 15} fill="currentColor" opacity=".18" />
              ))}
            </svg>
          </div>
          <div className="absolute left-0 top-10 h-[220px] w-[220px] opacity-25">
            <svg aria-hidden="true" viewBox="0 0 240 240" className="h-full w-full text-[var(--color-primary)]">
              {Array.from({ length: 210 }).map((_, index) => {
                const x = 30 + ((index * 29) % 170);
                const y = 20 + ((index * 47) % 190);
                return <circle key={index} cx={x} cy={y} r="1.8" fill="currentColor" />;
              })}
            </svg>
          </div>
          <Image src="/model/Section 2-bg.webp" alt="" fill className="relative z-10 object-contain object-right-bottom" sizes="(min-width: 1024px) 48vw, 100vw" />
        </div>
      </div>
      </div>
    </section>
  );
}
