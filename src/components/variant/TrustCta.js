"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";

const POINT_ICONS = ["safestBuy", "scale", "ukDelivery"];

const TICKER_ITEMS = [
  { icon: "quote", title: "100% Free", text: "No hidden fees" },
  { icon: "check", title: "No Obligation", text: "Get quotes with zero pressure" },
  { icon: "users", title: "UK Specialists", text: "20+ vetted experts" },
  { icon: "safestBuy", title: "12-Month Warranty", text: "As standard" },
  { icon: "ukDelivery", title: "Nationwide Delivery", text: "Supply & fit available" },
];

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function TrustCta({ data, band = "page" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/320d/trust_dark.webp" : "/320d/trust_light.webp";
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";

  return (
    <section className={`w-full py-8 text-[var(--color-text)] md:py-10 ${sectionBgClass(band)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <HeadingEyebrow text="TRUST & PROOF" />
        <h2 className="mt-3 max-w-[720px] font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem]">{data.h2}</h2>

        {data.trustPoints?.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.trustPoints.map((point, index) => (
              <li key={point.title} className="flex items-start gap-4 rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-5 shadow-sm">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
                  <HomeIcon name={POINT_ICONS[index % POINT_ICONS.length]} size={40} className="h-10 w-10" />
                </span>
                <div className="min-w-0">
                  <p className="text-[1.02rem] font-bold leading-snug text-[var(--color-text)]">{point.title}</p>
                  <p className="mt-2.5 text-[0.85rem] leading-relaxed text-[var(--color-text-muted)] md:text-[0.9rem]" dangerouslySetInnerHTML={{ __html: point.text }} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {data.finalCta || data.ctaButton ? (
          <div className="relative mt-6 overflow-hidden rounded-[8px] border border-[var(--color-border)]/75">
            <div className="absolute inset-0">
              <Image src={image} alt="" fill className="object-cover" sizes="100vw" />
            </div>

            <div className="relative flex w-full flex-col items-center gap-4 p-5 text-center md:min-h-[200px] md:flex-row md:justify-center md:p-8">
              <div className="flex max-w-[520px] flex-col items-center gap-3">
                {data.finalCta ? (
                  <p className={`text-[1rem] font-bold leading-[1.4] md:text-[1.2rem] ${headingClass}`} dangerouslySetInnerHTML={{ __html: data.finalCta }} />
                ) : null}
                {data.ctaButton ? (
                  <a
                    href="/quote"
                    className="btn-cta flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-[#189454] px-4 py-2.5 text-center text-[0.74rem] font-bold text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:w-auto md:px-6 md:py-3 md:text-[0.8rem]"
                  >
                    <HomeIcon name="quote" size={28} className="h-7 w-7 shrink-0" />
                    {data.ctaButton.label.replace(/\s*→\s*$/, "")}
                    <ArrowIcon className="h-4 w-4 shrink-0" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-4">
          <div className="flex flex-col lg:hidden">
            {Array.from({ length: Math.ceil(TICKER_ITEMS.length / 2) }, (_, row) => {
              const pair = TICKER_ITEMS.slice(row * 2, row * 2 + 2);
              return (
                <div
                  key={row}
                  className={`flex items-stretch py-2.5 first:pt-0 last:pb-0 ${row > 0 ? "border-t border-[var(--color-border)]/55" : ""}`}
                >
                  {pair.map((item, i) => (
                    <div key={item.title} className="flex flex-1 items-stretch">
                      {i > 0 ? (
                        <span aria-hidden="true" className="mx-3 my-1 w-px shrink-0 self-center bg-[var(--color-border)]/55" style={{ height: "70%" }} />
                      ) : null}
                      <div className="flex flex-1 items-center gap-2.5">
                        <HomeIcon name={item.icon} size={32} className="h-8 w-8 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[0.8rem] font-semibold leading-tight text-[var(--color-text)]">{item.title}</p>
                          <p className="text-[0.7rem] leading-tight text-[var(--color-text-muted)]">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex lg:items-stretch">
            {TICKER_ITEMS.map((item, index) => (
              <div key={item.title} className="flex flex-1 items-stretch">
                {index > 0 ? (
                  <span aria-hidden="true" className="mx-3 my-1 w-px shrink-0 self-center bg-[var(--color-border)]/55" style={{ height: "70%" }} />
                ) : null}
                <div className="flex items-center gap-2.5">
                  <HomeIcon name={item.icon} size={32} className="h-8 w-8 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[0.8rem] font-semibold leading-tight text-[var(--color-text)]">{item.title}</p>
                    <p className="text-[0.7rem] leading-tight text-[var(--color-text-muted)]">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
