import Image from "next/image";
import Link from "next/link";
import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import RangeRoverBadge from "@/components/guide-home/RangeRoverBadge";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import QuoteLink from "@/components/guide-home/QuoteLink";
import { BODY, BODY_SM, CONTAINER, H2, H6, ICON_LG, SMALL } from "@/lib/typeScale";

// Follows the site theme (day / night): every colour comes from the --lr-* tokens, apart from the
// orange "Most Enquired" badge, which has no token (a day / night pair in the same orange).
const TONES = {
  gold: "text-lr-gold",
  green: "text-lr-green",
  orange: "text-[#c4561c] dark:text-[#ec8a4f]",
};

function GroupHeader({ group }) {
  return (
    <div className="flex h-15 items-center gap-6 border-b border-lr-line bg-lr-brand px-5 text-lr-on-brand lg:h-16 lg:px-7 dark:border-lr-line dark:bg-linear-to-r dark:from-lr-chip dark:to-lr-card">
      {group.brand === "landRover" ? (
        <>
          <LandRoverLogo crop className="h-8.5 w-15.5 lg:h-9.5 lg:w-17.5" />
          <h3 className={`${H6} uppercase tracking-[0.3em]`}>{group.label}</h3>
        </>
      ) : (
        <>
          <RangeRoverBadge className="h-8.5 w-15.5 lg:h-9.5 lg:w-17.5" />
          <h3 className={`${H6} uppercase tracking-[0.3em]`}>{group.label}</h3>
        </>
      )}
    </div>
  );
}

// the model renders were cut out against a near-black backdrop that is baked into their edges; the
// "-cut" files are transparent cut-outs of the same renders, so the cars sit on either theme's card
const cutout = (src = "") => src.replace(/-rt\.webp$/, "-rt-cut.webp");

function ModelRow({ m }) {
  return (
    <Link
      href={m.href}
      className="group flex items-center gap-2 py-3 pl-2.5 pr-3 font-normal transition-colors hover:bg-lr-panel sm:gap-5 sm:px-5 sm:py-3 lg:gap-0 lg:rounded-lg lg:border lg:border-lr-line lg:bg-lr-card lg:px-3 lg:py-1.5 lg:hover:border-lr-line-strong lg:hover:bg-lr-panel dark:lg:bg-lr-page/40"
    >
      <span className="relative h-[44px] w-[78px] shrink-0 max-[374px]:h-[36px] max-[374px]:w-[62px] min-[420px]:h-[50px] min-[420px]:w-[92px] sm:h-[68px] sm:w-[125px] lg:h-[82px] lg:w-[150px]">
        <Image src={cutout(m.image)} alt={`Land Rover ${m.name}`} fill className="object-contain" sizes="(min-width: 1024px) 150px, (min-width: 640px) 124px, 92px" />
      </span>

      <span className="min-w-0 flex-1 lg:ml-4 lg:border-l lg:border-lr-line lg:py-3 lg:pl-5">
        <span className="block font-[family-name:var(--font-serif-display)] text-[17px] font-normal leading-[1.2] tracking-[-0.01em] text-lr-head max-[374px]:text-[16px] min-[420px]:text-[18px] sm:text-[21px] lg:text-[22px] xl:text-[24px]">{m.name}</span>
        <span className={`${SMALL} mt-1 block whitespace-nowrap text-lr-muted`}>{m.generations}</span>
      </span>

      <span className="flex w-[100px] shrink-0 items-center gap-2 border-l max-[374px]:w-[90px] max-[374px]:gap-1.5 max-[374px]:pl-2 max-[359px]:w-[36px] min-[420px]:w-[132px] min-[420px]:whitespace-nowrap border-lr-line py-1.5 pl-2.5 sm:w-[170px] sm:gap-3 sm:pl-5 lg:w-[180px]">
        <span className={`flex shrink-0 ${TONES[m.tone]}`}>
          <GuideIcon name={m.icon} className="h-5 w-5 max-[374px]:h-[18px] max-[374px]:w-[18px] sm:h-6 sm:w-6 lg:h-[26px] lg:w-[26px] xl:h-7 xl:w-7" />
        </span>
        <span className={`${SMALL} font-medium leading-[1.2] max-[359px]:sr-only ${TONES[m.tone]}`}>{m.badge}</span>
      </span>

      <span className="shrink-0 text-lr-muted transition-transform group-hover:translate-x-0.5 lg:pr-1">
        <GuideIcon name="chevron-right" className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </span>
    </Link>
  );
}

export default function HomeFindVehicle({ data }) {
  const [h2a, h2b] = data.h2.split("|");
  const { help } = data;

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      {/* faint green glow, top right */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-lr-green/[0.06] blur-[120px] dark:bg-lr-brand/25" aria-hidden="true" />

      <div className={`${CONTAINER} relative pb-6 pt-6 lg:pb-8 lg:pt-6`}>
        <h2 className={`${H2} text-lr-head`}>
          {h2a} <span className="text-lr-green">{h2b}</span>
        </h2>
        <p className={`${BODY} mt-3 max-w-[640px] text-lr-body`}>{data.subhead}</p>

        {/* model groups */}
        <div className="mt-7 grid gap-4 xl:grid-cols-2 xl:gap-[22px]">
          {data.groups.map((g) => (
            <div key={g.label} className="overflow-hidden rounded-[10px] border border-lr-line bg-lr-card shadow-[0_20px_50px_-25px_var(--lr-shadow)]">
              <GroupHeader group={g} />
              <div className="divide-y divide-lr-line lg:flex lg:flex-col lg:gap-2.5 lg:divide-y-0 lg:p-2.5">
                {g.models.map((m) => (
                  <ModelRow key={m.name} m={m} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* help banner */}
        <div className="relative mt-5 overflow-hidden rounded-[10px] border border-lr-line bg-lr-card shadow-[0_20px_50px_-30px_var(--lr-shadow)]">
          {/* road photo, right side: its left edge fades into the card through a mask (blends with either theme);
              on the day theme phones also wash it out behind the text so the dark copy stays readable */}
          <div
            className="absolute inset-y-0 right-0 w-[46%] [mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.75)_35%,#000_60%)] lg:w-[40%]"
            aria-hidden="true"
          >
            <Image src={help.mobileImage} alt="" fill className="object-cover lg:hidden" sizes="45vw" />
            <Image src={help.image} alt="" fill className="hidden object-cover lg:block" sizes="40vw" />
            <div className="absolute inset-0 bg-linear-to-r from-lr-card/85 via-lr-card/45 via-55% to-transparent lg:hidden dark:from-lr-card/40 dark:via-transparent" />
          </div>

          <div className="relative grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-3.5 px-3 pb-3.5 pt-3 sm:gap-x-4 sm:p-6 lg:flex lg:items-center lg:gap-7 lg:px-8 lg:py-7">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-lr-gold-line/60 bg-lr-chip/70 text-lr-green sm:h-14 sm:w-14 lg:h-[52px] lg:w-[52px]">
              <GuideIcon name="shield" className={ICON_LG} />
            </span>

            <div className="max-w-[420px] lg:max-w-[440px]">
              <h3 className={`${H6} text-lr-head dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>{help.title}</h3>
              <p className={`${BODY_SM} mt-0.5 max-w-[86%] text-lr-body dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:max-w-none lg:mt-1`}>{help.text}</p>
            </div>

            <span className="hidden h-[70px] w-px bg-lr-line lg:block" aria-hidden="true" />

            <QuoteLink
              href={help.cta.href}
              className="col-span-2 flex w-max min-w-[66%] sm:min-w-0 items-center justify-center gap-6 whitespace-nowrap rounded-[4px] border border-lr-brand bg-lr-brand px-6 py-3 text-[14.5px] font-medium uppercase tracking-[0.03em] text-lr-on-brand xl:text-[15px] transition-colors hover:bg-lr-brand-hover sm:w-max sm:px-10 lg:border-lr-gold-line/70 lg:px-7"
            >
              {help.cta.label}
              <Arrow className="h-5 w-5 text-lr-gold-line lg:text-lr-on-brand" />
            </QuoteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
