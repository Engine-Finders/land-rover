import Image from "next/image";
import Link from "next/link";
import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { serif } from "@/lib/guideFonts";

const TONES = {
  gold: "text-[#d4a54c]",
  green: "text-[#5fae7c]",
  orange: "text-[#e8793a]",
};

function GroupHeader({ group }) {
  return (
    <div className="flex h-15 items-center gap-6 border-b border-white/10 bg-linear-to-r from-[#0f2a1e] via-[#0d2219] to-[#0b1814] px-5 lg:h-16 lg:px-7">
      {group.brand === "landRover" ? (
        <>
          <LandRoverLogo crop className="h-8.5 w-15.5 lg:h-9.5 lg:w-17.5" />
          <h3 className="text-[15px] font-medium uppercase tracking-[0.3em] text-white lg:text-[18px]">{group.label}</h3>
        </>
      ) : (
        // Range Rover's wordmark is a very wide, spaced capital - approximated with tracking
        <h3 className="py-1 text-[16px] font-semibold uppercase tracking-[0.62em] text-white lg:text-[18px]">{group.label}</h3>
      )}
    </div>
  );
}

function ModelRow({ m }) {
  return (
    <Link
      href={m.href}
      className="group flex items-center gap-2.5 py-3 pl-2.5 pr-3 transition-colors hover:bg-white/[0.03] sm:gap-5 lg:hover:bg-[#0d1517] sm:px-5 sm:py-3 lg:gap-0 lg:rounded-lg lg:border lg:border-white/[0.07] lg:bg-[#0a1113] lg:px-3 lg:py-1.5 lg:hover:border-white/15"
    >
      <span className="relative h-[50px] w-[92px] shrink-0 sm:h-[68px] sm:w-[125px] lg:h-[82px] lg:w-[150px] 2xl:h-[92px] 2xl:w-[170px]">
        <Image src={m.image} alt={`Land Rover ${m.name}`} fill className="object-contain" sizes="(min-width: 1536px) 170px, (min-width: 1024px) 150px, (min-width: 640px) 124px, 92px" />
      </span>

      <span className="min-w-0 flex-1 lg:ml-4 lg:border-l lg:border-white/10 lg:py-3 lg:pl-5">
        <span className={`${serif.className} block text-[16.5px] leading-[1.12] text-[#f2efe9] sm:text-[21px] 2xl:text-[24px]`}>{m.name}</span>
        <span className="mt-1 block whitespace-nowrap text-[12.5px] text-white/70 sm:text-[15px]">{m.generations}</span>
      </span>

      <span className="flex w-[100px] shrink-0 items-center gap-2 border-l min-[420px]:w-[132px] min-[420px]:whitespace-nowrap border-white/10 py-1.5 pl-2.5 sm:w-[170px] sm:gap-3 sm:pl-5 lg:w-[172px] 2xl:w-[188px]">
        <span className={TONES[m.tone]}>
          <GuideIcon name={m.icon} className="h-[22px] w-[22px] sm:h-6 sm:w-6 2xl:h-7 2xl:w-7" />
        </span>
        <span className={`text-[12.5px] font-medium leading-[1.2] sm:text-[14px] 2xl:text-[15px] ${TONES[m.tone]}`}>{m.badge}</span>
      </span>

      <span className="shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5 lg:pr-1">
        <GuideIcon name="chevron-right" className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </span>
    </Link>
  );
}

export default function HomeFindVehicle({ data }) {
  const [h2a, h2b] = data.h2.split("|");
  const { help } = data;

  return (
    <section className="relative overflow-hidden bg-[#0a0f0d] text-white">
      {/* faint green glow, top right */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#1d4a35]/25 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1536px] px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pb-16 lg:pt-12 xl:px-[70px]">
        <h2 className={`${serif.className} text-[40px] leading-[1.05] tracking-[-0.01em] text-[#f2efe9] sm:text-[52px] lg:text-[64px]`}>
          {h2a} <span className="text-[#3a8a5f]">{h2b}</span>
        </h2>
        <p className="mt-3 max-w-[520px] text-[16px] leading-[1.55] text-white/80 lg:text-[18px]">{data.subhead}</p>

        {/* model groups */}
        <div className="mt-7 grid gap-4 xl:grid-cols-2 xl:gap-[22px]">
          {data.groups.map((g) => (
            <div key={g.label} className="overflow-hidden rounded-[10px] border border-white/12 bg-[#0b1210] shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]">
              <GroupHeader group={g} />
              <div className="divide-y divide-white/10 lg:flex lg:flex-col lg:gap-2.5 lg:divide-y-0 lg:p-2.5">
                {g.models.map((m) => (
                  <ModelRow key={m.name} m={m} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* help banner */}
        <div className="relative mt-5 overflow-hidden rounded-[10px] border border-white/12 bg-[#0b1210]">
          {/* road photo, right side */}
          <div className="absolute inset-y-0 right-0 w-[46%] lg:w-[40%]" aria-hidden="true">
            <Image src={help.mobileImage} alt="" fill className="object-cover lg:hidden" sizes="45vw" />
            <Image src={help.image} alt="" fill className="hidden object-cover lg:block" sizes="40vw" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0b1210] via-[#0b1210]/25 via-35% to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-[#0b1210]/50 to-transparent lg:hidden" />
          </div>

          <div className="relative grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-3.5 px-3 pb-3.5 pt-3 sm:gap-x-4 sm:p-6 lg:flex lg:items-center lg:gap-7 lg:px-8 lg:py-7">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#d4a54c]/60 bg-[#0b1210]/60 text-white sm:h-16 sm:w-16 lg:h-[76px] lg:w-[76px]">
              <GuideIcon name="shield" className="h-[22px] w-[22px] sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
            </span>

            <div className="max-w-[420px] lg:max-w-[400px]">
              <h3 className="text-[clamp(14px,3.85vw,19px)] font-semibold leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{help.title}</h3>
              <p className="mt-0.5 max-w-[86%] text-[13.5px] leading-[1.45] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:max-w-none sm:text-[15px] lg:mt-1">{help.text}</p>
            </div>

            <span className="hidden h-[70px] w-px bg-white/15 lg:block" aria-hidden="true" />

            <QuoteLink
              href={help.cta.href}
              className="col-span-2 flex w-max min-w-[66%] sm:min-w-0 items-center justify-center gap-6 whitespace-nowrap rounded-[4px] border border-[#2f6b4c] bg-[#0f2a1e]/90 px-6 py-3 text-[14.5px] font-medium uppercase tracking-[0.03em] text-white transition-colors hover:bg-[#15392a] sm:w-max sm:px-10 lg:border-[#a8925a]/70 lg:bg-[#0f1a15]/80 lg:px-7"
            >
              {help.cta.label}
              <Arrow className="h-5 w-5 text-[#d4a54c] lg:text-white" />
            </QuoteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
