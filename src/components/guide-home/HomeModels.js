import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import { serif } from "@/lib/guideFonts";

const BADGE = {
  dark: "bg-[#0e2b20] text-white",
  gold: "bg-[#c98a3a] text-white",
  light: "bg-[#f1e3c9] text-[#1f1f1f] ring-1 ring-inset ring-[#e2cfa8]",
};

// phones: model | verdict (generations sit under the name); sm+: model | generations | verdict as in the references
const ROW = "grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto]";

function Verdict({ m }) {
  return (
    <span
      className={`inline-flex w-[124px] items-center gap-2 rounded-md px-2.5 py-2 text-[10.5px] font-semibold uppercase leading-tight tracking-[0.02em] shadow-[0_3px_8px_-4px_rgba(0,0,0,0.35)] sm:w-[148px] sm:gap-2.5 sm:px-3 sm:text-[12px] xl:w-auto xl:min-w-[132px] ${BADGE[m.tone]}`}
    >
      <GuideIcon name={m.icon} className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" />
      {m.verdict}
    </span>
  );
}

function ModelTable({ group, columns }) {
  return (
    <div className="overflow-hidden rounded-md border border-black/[0.07] bg-white shadow-[0_10px_28px_-18px_rgba(0,0,0,0.4)]">
      <h3 className="flex items-center gap-5 bg-[#0e2b20] px-5 py-3 text-[16px] font-medium uppercase tracking-[0.06em] text-white sm:px-6 sm:text-[17px]">
        {group.brand === "landRover" ? <LandRoverLogo crop className="h-[26px] w-[48px] shrink-0" /> : null}
        {group.label}
      </h3>
      <div className={`${ROW} items-center gap-x-3 border-b border-black/[0.08] px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.03em] text-[#1f1f1f] sm:gap-x-4 sm:px-6 sm:text-[13px]`}>
        <span>{columns[0]}</span>
        <span className="hidden sm:block">{columns[1]}</span>
        <span className="w-[124px] pl-1 sm:w-[148px] xl:w-auto xl:min-w-[132px]">{columns[2]}</span>
      </div>
      <ul className="divide-y divide-black/[0.08] px-4 sm:px-6">
        {group.models.map((m) => (
          <li key={m.name}>
            <Link href={m.href} className={`group ${ROW} items-center gap-x-3 py-2.5 sm:gap-x-4`}>
              <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span className="relative h-[38px] w-[64px] shrink-0 sm:h-[46px] sm:w-[84px]">
                  <Image src={m.image} alt={m.name} fill className="object-contain" sizes="84px" />
                </span>
                <span className="min-w-0 leading-snug">
                  <span className="block text-[14.5px] font-medium text-[#141414] group-hover:text-[#1f5c3d] sm:text-[15.5px]">{m.name}</span>
                  <span className="block text-[12px] text-[#555] sm:hidden">
                    {m.count} {m.gens}
                  </span>
                </span>
              </span>
              <span className="hidden border-l border-black/[0.08] py-1 pl-4 text-[14px] leading-snug text-[#2a2a2a] sm:block">
                {m.count}
                <br />
                {m.gens}
              </span>
              <Verdict m={m} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// One sharp portrait photo (car at the top, real rocky ground below). Desktop pins it to the top so a wider /
// shorter box only trims ground; phones show it at its natural shape so nothing is cropped.
function Example({ ex }) {
  return (
    <div className="overflow-hidden rounded-md border border-black/[0.07] bg-white shadow-[0_10px_28px_-18px_rgba(0,0,0,0.4)] xl:grid xl:grid-cols-[326px_minmax(0,1fr)]">
      <div className="relative hidden xl:block">
        <Image src={ex.image} alt={ex.imageAlt} fill quality={90} className="object-cover object-top" sizes="326px" />
      </div>

      <div className="grid grid-cols-[35%_minmax(0,1fr)] sm:grid-cols-[34%_minmax(0,1fr)] xl:block xl:px-8 xl:pb-6 xl:pt-5">
        {/* phones / tablets (mobile reference): eyebrow + title, then the photo filling the rest of the left column */}
        <div className="flex flex-col xl:block">
          <div className="px-3 pb-3 pt-3.5 sm:px-5 sm:pt-4 xl:p-0">
            <p className="text-[10.5px] font-medium uppercase leading-snug tracking-[0.03em] text-[#1f1f1f] sm:text-[12.5px] xl:text-[13px]">{ex.eyebrow}</p>
            <Link href={ex.href} className={`${serif.className} mt-1 block text-[21px] leading-tight text-[#141414] hover:text-[#1f5c3d] min-[420px]:text-[24px] sm:text-[32px] xl:text-[36px]`}>
              {ex.title}
            </Link>
            <span className="mt-2 block h-px w-full bg-black/10 xl:mt-3">
              <span className="block h-px w-6 bg-[#c9963f]" />
            </span>
          </div>
          <div className="relative aspect-[253/326] w-full xl:hidden">
            <Image src={ex.mobileImage} alt={ex.imageAlt} fill quality={90} className="object-cover" sizes="(min-width: 640px) 34vw, 35vw" />
          </div>
        </div>

        <ul className="divide-y divide-black/[0.08] border-l border-black/[0.08] px-3 sm:px-6 xl:mt-4 xl:grid xl:grid-cols-5 xl:divide-x xl:divide-y-0 xl:border-0 xl:px-0">
          {ex.items.map((it) => (
            <li key={it.title} className="flex gap-2.5 py-2.5 sm:gap-4 sm:py-3 xl:block xl:px-5 xl:py-1 xl:first:pl-0 xl:last:pr-0">
              <span className={`shrink-0 ${it.icon === "alert" ? "text-[#c98a3a]" : "text-[#1f1f1f]"}`}>
                <GuideIcon name={it.icon} className="h-6 w-6 sm:h-8 sm:w-8" />
              </span>
              <span className="min-w-0 xl:mt-1 xl:block">
                <span className="block text-[11.5px] font-semibold uppercase leading-snug tracking-[0.02em] text-[#141414] sm:text-[13.5px] xl:text-[12.5px]">{it.title}</span>
                <span className="mt-0.5 block text-[11.5px] leading-[1.45] text-[#3a3a3a] sm:mt-1 sm:text-[13.5px] xl:mt-2.5 xl:text-[12.5px] xl:leading-[1.6]">{it.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HomeModels({ data }) {
  const [h1, h2, h3] = data.h2.split("|");
  const { note } = data;

  return (
    <section id="models" lang="en-GB" className="relative scroll-mt-20 overflow-hidden bg-[#f7f7f5] text-[#141414]">
      {/* desktop: model line-up across the top right, left edge fading into the page (mask, not a tint) */}
      <div className="absolute right-0 top-0 hidden aspect-[1808/604] w-[57%] [mask-image:linear-gradient(to_right,transparent,#000_3%)] xl:block" aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover" sizes="57vw" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-12 lg:pb-14 lg:pt-12 xl:px-[46px]">
        <h2 className={`${serif.className} px-1 text-[clamp(30px,8.4vw,46px)] leading-[1.08] xl:text-[38px] 2xl:text-[46px] tracking-[-0.01em] sm:px-0`}>
          {h1} <br className="sm:hidden" />
          {h2}
          <br />
          <span className="text-[#0e2b20]">{h3}</span>
        </h2>
        <p className="mt-3 px-1 text-[14px] leading-[1.6] text-[#2a2a2a] sm:max-w-[640px] sm:px-0 sm:text-[15px] xl:mt-5 xl:max-w-[470px] xl:text-[14.5px] 2xl:max-w-[540px]">
          {data.subhead}
        </p>

        {/* phones / tablets: the line-up as its own photo below the intro, so no text ever sits on the cars */}
        <div className="relative mt-4 aspect-[777/206] overflow-hidden rounded-md shadow-[0_10px_24px_-16px_rgba(0,0,0,0.5)] xl:hidden" aria-hidden="true">
          <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover" sizes="100vw" />
        </div>

        <div className="mt-3 grid gap-3 xl:mt-7 xl:grid-cols-2 xl:gap-4">
          {data.groups.map((g) => (
            <ModelTable key={g.label} group={g} columns={data.columns} />
          ))}
        </div>

        <div className="mt-3 xl:mt-4">
          <Example ex={data.example} />
        </div>

        {/* data note */}
        <div className="mt-3 flex flex-col gap-3 rounded-md bg-[#0e2b20] px-4 py-4 text-white shadow-[0_10px_24px_-16px_rgba(0,0,0,0.6)] min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-5 sm:px-6 xl:mt-4 xl:py-3.5">
          <div className="flex items-start gap-3.5 min-[420px]:flex-1 xl:items-center xl:gap-6">
            <span className="shrink-0 text-[#c9963f]">
              <GuideIcon name="database" className="h-8 w-8" />
            </span>
            <p className="text-[13px] leading-snug text-white/90 xl:text-[13.5px]">
              <span className="block text-[15px] font-semibold uppercase text-[#c9963f] xl:mr-6 xl:inline xl:text-[13.5px]">{note.title}</span>
              {note.text}
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 border-t border-white/15 pt-3 min-[420px]:border-l min-[420px]:border-t-0 min-[420px]:pl-5 min-[420px]:pt-0 xl:flex-row xl:gap-0 xl:divide-x xl:divide-white/25 xl:border-l-0 xl:pl-0">
            {note.stats.map((s) => (
              <li key={s.label} className="flex items-center gap-3 whitespace-nowrap text-[14px] xl:px-6 xl:text-[13.5px]">
                <GuideIcon name={s.icon} className="h-5 w-5 shrink-0 text-white/85 xl:hidden" />
                {s.label}: {s.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
