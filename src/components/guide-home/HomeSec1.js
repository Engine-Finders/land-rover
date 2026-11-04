import Image from "next/image";
import Link from "next/link";
import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

const GOLD = "#d4a54c";
const GREEN = "#4fae7e";

export default function HomeSec1({ hero }) {
  const [line1, line2, line3] = hero.h1.split("|");
  const [h2a, h2b] = hero.trust.h2.split("|");
  const [mh2a, mh2b] = hero.trust.mobileH2.split("|");

  return (
    <section id="find-my-landrover" className="relative z-10 overflow-hidden bg-[#0a0f0d] text-white">
      {/* ===== mobile + tablet ===== */}
      <div className="lg:hidden">
        <div className="relative">
          {/* stormy sky behind the headline: the hero photo's cloud band, blurred and dimmed */}
          <div
            className="absolute inset-x-0 top-0 h-[620px]"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(60% 30% at 15% 20%, rgba(120,128,124,0.22), transparent 70%), radial-gradient(55% 28% at 85% 35%, rgba(110,118,114,0.2), transparent 70%), radial-gradient(70% 25% at 50% 75%, rgba(150,140,120,0.16), transparent 70%), linear-gradient(180deg, #0c1210 0%, #121a17 45%, #0a0f0d 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-160 px-4 pt-6 text-center sm:px-8">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#d4a54c]/70" />
              <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] sm:text-sm" style={{ color: GOLD }}>
                {hero.eyebrow}
              </p>
              <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#d4a54c]/70" />
            </div>

            <h1 className={`${serif.className} mt-3 whitespace-nowrap text-[clamp(25px,7.6vw,50px)] leading-[1.08] tracking-[-0.01em]`}>
              <span className="block text-[#f2efe9]">{line1}</span>
              <span className="block text-[#f2efe9]">{line2}</span>
              <span className="block" style={{ color: GREEN }}>{line3}</span>
            </h1>

            <p className="mx-auto mt-3 max-w-120 text-[15px] leading-[1.5] text-white/85 sm:text-base">{hero.subhead}</p>

            {/* stats card */}
            <div className="mt-5 grid grid-cols-4 rounded-[20px] border border-white/15 bg-white/[0.04] px-1 py-3.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
              {hero.stats.map((s, i) => (
                <div key={s.value} className={`flex flex-col items-center px-1 ${i > 0 ? "border-l border-white/15" : ""}`}>
                  <GuideIcon name={s.icon} className="h-7 w-7 text-[#bfe3cf]" />
                  <p className="mt-2 text-[15px] font-semibold leading-tight text-white">{s.value}</p>
                  <p className="text-[12px] leading-tight text-white/80">
                    {s.icon === "book" ? (
                      <>
                        {s.label}
                        <br />
                        {s.detail}
                      </>
                    ) : (
                      s.label
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={hero.cta.href}
              className="relative mx-auto mt-6 flex w-[82%] max-w-100 items-center justify-center gap-3 rounded-xl border border-[#5fd19a]/45 bg-linear-to-b from-[#1f7a52] via-[#155e3e] to-[#0e4730] py-4 text-[17px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_0_28px_-4px_rgba(60,190,125,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              {hero.cta.label}
              <Arrow />
              {/* bottom edge light */}
              <span className="pointer-events-none absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#8ff0bf] to-transparent" />
            </Link>
          </div>

          {/* Defender photo */}
          <div className="relative mt-1 w-full">
            <div className="relative mx-auto aspect-16/11 w-full max-w-200 sm:aspect-887/464">
              <Image src={hero.mobileImage} alt={hero.imageAlt} fill priority quality={90} className="object-cover object-[62%_55%]" sizes="(max-width: 800px) 100vw, 800px" />
              <div className="absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-[#0a0f0d] to-transparent" />
              <div className="absolute inset-y-0 left-0 w-6 bg-linear-to-r from-[#0a0f0d]/70 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-6 bg-linear-to-l from-[#0a0f0d]/70 to-transparent" />
            </div>
          </div>

          {/* trust card, overlapping the bottom of the photo */}
          <div className="relative mx-auto -mt-10 max-w-160 px-0 pb-8 sm:px-4">
            <div className="relative rounded-t-[26px] border-t border-white/15 bg-linear-to-b from-[#0f1a16]/95 to-[#0a0f0d] px-3 pb-2 pt-10 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md sm:rounded-[26px] sm:border">
              {/* logo tab */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[60%]">
                <div className="flex h-12 w-30 items-center justify-center rounded-t-[22px] border border-b-0 border-white/15 bg-[#0f1a16]">
                  <LandRoverLogo crop className="h-8 w-[58px]" />
                </div>
              </div>

              <h2 className={`${serif.className} whitespace-nowrap text-center text-[clamp(19px,5.6vw,34px)] leading-tight text-[#f2efe9]`}>
                {mh2a} <span style={{ color: GREEN }}>{mh2b}</span>
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {hero.trust.items.map((t) => (
                  <div key={t.title} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.035] p-2.5 sm:gap-3 sm:p-3">
                    <span className="flex h-11 w-11 shrink-0 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-[#3c8d64]/60 bg-[radial-gradient(circle_at_50%_35%,#1d4a35,#0d2219)] text-[#cfeedd] shadow-[0_0_14px_-2px_rgba(70,180,120,0.35)]">
                      <GuideIcon name={t.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <p className="text-[12.5px] sm:text-[14px] leading-snug text-white/90">
                      <span className="font-semibold text-white">{t.mobileTitle}</span>
                      {t.mobileText && (
                        <>
                          {" "}
                          <span className="block text-white/80">{t.mobileText}</span>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== desktop ===== */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* photo, anchored right and faded into the dark left column */}
          <div className="absolute right-0 top-0 h-[620px] w-[66%] xl:h-[640px]">
            <Image src={hero.image} alt={hero.imageAlt} fill priority quality={90} className="object-cover object-center" sizes="66vw" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a0f0d] via-[#0a0f0d]/35 via-25% to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#0a0f0d] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#0a0f0d]/70 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-[1440px] px-10 pt-12 xl:px-20">
            <div className="max-w-[600px]">
              <p className="text-[13px] font-medium uppercase tracking-[0.08em]" style={{ color: GOLD }}>
                {hero.eyebrow}
              </p>
              <div className="mt-2 flex h-px w-[370px]">
                <span className="w-[120px] bg-[#d4a54c]" />
                <span className="w-[50px] bg-white/80" />
                <span className="flex-1 bg-white/25" />
              </div>

              <h1 className={`${serif.className} mt-6 whitespace-nowrap text-[clamp(44px,3.9vw,60px)] leading-[1.02] tracking-[-0.01em] text-[#f2efe9]`}>
                {line1.replace(" Trusted", "")}
                <br />
                Trusted {line2.split(" & ")[0]} &amp;
                <br />
                {line2.split(" & ")[1]}
                <br />
                <span style={{ color: "#2f7d55" }}>{line3}</span>
              </h1>

              <p className="mt-5 max-w-[400px] text-[17px] leading-[1.55] text-white/85">{hero.subhead}</p>

              <div className="mt-6 flex items-center gap-10">
                <Link
                  href={hero.cta.href}
                  className="inline-flex items-center gap-4 rounded-[3px] border border-[#2f6b4c] bg-[#0f2a1e] px-7 py-4 text-[17px] font-semibold uppercase tracking-[0.04em] text-white transition-colors hover:bg-[#15392a]"
                >
                  {hero.cta.label}
                  <Arrow className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <GuideIcon name="shield" className="h-9 w-9 text-white/90" />
                  <p className="text-[13px] leading-[1.6] text-white/90">
                    <span className="block font-medium">{hero.independent.title}</span>
                    {hero.independent.text}
                  </p>
                </div>
              </div>
            </div>

            {/* stats bar */}
            <div className="mt-7 grid grid-cols-4 rounded-md border border-white/15 bg-[#0c1311]/85 py-5 backdrop-blur-sm">
              {hero.stats.map((s, i) => (
                <div key={s.value} className={`flex items-center justify-center gap-5 px-4 ${i > 0 ? "border-l border-white/15" : ""}`}>
                  <span className="shrink-0" style={{ color: GOLD }}>
                    <GuideIcon name={s.icon} className="h-12 w-12" />
                  </span>
                  <div>
                    <p className="text-[24px] leading-tight text-white">{s.value}</p>
                    <p className="text-[16px] leading-snug text-white/85">{s.label}</p>
                    <p className="text-[16px] leading-snug text-white/85">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* trust row */}
            <div className="pb-14 pt-8 text-center">
              <p className="text-[13px] font-medium uppercase tracking-[0.12em]" style={{ color: GOLD }}>
                {hero.trust.eyebrow}
              </p>
              <div className="mt-1 flex items-center justify-center gap-5">
                <span className="h-px w-24 bg-linear-to-r from-transparent to-[#d4a54c]" />
                <h2 className={`${serif.className} text-[34px] leading-tight text-[#f2efe9]`}>
                  {h2a} <span style={{ color: "#2f7d55" }}>{h2b}</span>
                </h2>
                <span className="h-px w-24 bg-linear-to-l from-transparent to-[#d4a54c]" />
              </div>

              <div className="mt-6 grid grid-cols-4">
                {hero.trust.items.map((t, i) => (
                  <div key={t.title} className={`flex flex-col items-center px-8 ${i > 0 ? "border-l border-white/15" : ""}`}>
                    <span className="flex h-15 w-15 items-center justify-center rounded-full border border-[#d4a54c]/55 bg-[#0d1714]" style={{ color: GOLD }}>
                      <GuideIcon name={t.icon} className="h-7 w-7" />
                    </span>
                    <h3 className="mt-4 max-w-[220px] text-[16px] font-semibold leading-snug text-white">{t.title}</h3>
                    <p className="mt-2 max-w-[230px] text-[14px] leading-[1.6] text-white/75">{t.text}</p>
                    <span className="mt-5 h-px w-8 bg-[#d4a54c]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
