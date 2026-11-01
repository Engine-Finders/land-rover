import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

const pad = (n) => String(n).padStart(2, "0");

function Centre({ item, n, cta }) {
  return (
    <Link
      href={item.href}
      className="group flex overflow-hidden rounded-md border border-black/[0.07] bg-white shadow-[0_6px_18px_-14px_rgba(0,0,0,0.45)] transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)]"
    >
      {/* number block */}
      <span className={`${serif.className} flex w-[58px] shrink-0 items-center justify-center bg-[#0e2b20] text-[27px] text-[#d4a54c] sm:w-[72px] sm:text-[32px] xl:w-[80px] xl:text-[38px]`}>
        {pad(n)}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:gap-5 sm:px-5 xl:gap-7 xl:px-7 xl:py-4">
        <span className="shrink-0 text-[#1c1c1c]">
          <GuideIcon name={item.icon} className="h-[34px] w-[34px] sm:h-11 sm:w-11 xl:h-[60px] xl:w-[60px]" />
        </span>
        <span className="min-w-0 flex-1 xl:pl-6">
          <span className="block text-[15px] font-semibold leading-snug text-[#141414] sm:text-[16.5px] xl:text-[18px]">{item.title}</span>
          <span className="mt-1 block text-[12.5px] leading-[1.5] text-[#444] sm:text-[13.5px] xl:mt-1.5 xl:max-w-[260px] xl:text-[13px] 2xl:max-w-[280px]">{item.text}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 self-stretch sm:border-l sm:border-black/10 sm:pl-5 xl:pl-8">
          <span className="hidden text-[16px] font-medium text-[#141414] sm:inline">{cta}</span>
          <span className="text-[#141414] transition-transform group-hover:translate-x-0.5">
            <GuideIcon name="arrow-circle" className="h-[30px] w-[30px] sm:h-9 sm:w-9" />
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function HomeKnowledge({ data }) {
  const [h1, h2] = data.h2.split("|");
  const { note } = data;

  return (
    <section className="relative bg-[#f7f7f5] text-[#141414]">
      <div className="mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-12 lg:pb-14 lg:pt-12">
        <h2 className={`${serif.className} px-1 text-[clamp(36px,10vw,60px)] leading-[1.05] tracking-[-0.01em] sm:px-0`}>
          {h1} <span className="text-[#1f5c3d]">{h2}</span>
        </h2>
        <p className="mt-3 max-w-[700px] px-1 text-[14px] leading-[1.6] text-[#3a3a3a] sm:px-0 sm:text-[15px] lg:mt-5">{data.subhead}</p>

        <div className="mt-6 grid gap-2 lg:mt-7 xl:grid-flow-col xl:grid-cols-2 xl:grid-rows-4 xl:gap-x-6 xl:gap-y-1.5">
          {data.items.map((item, i) => (
            <Centre key={item.title} item={item} n={i + 1} cta={data.cta} />
          ))}
        </div>

        {/* data note */}
        <div className="relative mt-5 overflow-hidden rounded-md bg-[#0e2b20] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.6)] lg:mt-6">
          {/* desktop: wide landscape photo filling the right side. The box takes the photo's own aspect ratio
              from the panel height so the whole Defender stays in frame (capped at 48% and centred below xl).
              Its left edge blends into the panel with a transparency mask over the first 14% - landscape only,
              the car starts further in - so no green is ever painted over the car itself. */}
          <div
            className="absolute inset-y-0 right-0 hidden w-[48%] [mask-image:linear-gradient(to_right,transparent,#000_14%)] lg:block xl:aspect-[976/375] xl:w-auto xl:max-w-[48%]"
            aria-hidden="true"
          >
            <Image src={note.wideImage} alt="" fill quality={90} className="object-cover object-center" sizes="(min-width: 1024px) 620px, 0px" />
          </div>
          <div className="relative flex items-start gap-4 px-4 pb-5 pt-5 sm:items-center sm:gap-6 sm:px-7 lg:min-h-[230px] lg:max-w-[52%] lg:py-8">
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-[#d4a54c]/70 text-[#d4a54c] sm:h-[78px] sm:w-[78px]">
              <GuideIcon name="shield" className="h-7 w-7 sm:h-10 sm:w-10" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium uppercase tracking-[0.12em] text-[#d4a54c] sm:text-[15px]">{note.title}</p>
              <p className="mt-1.5 text-[13px] leading-[1.7] text-white/90 sm:text-[14.5px] lg:leading-[1.85]">
                {note.before}
                <span className="whitespace-nowrap text-[#4fae7e]">{note.tag}</span>
                {note.after}
              </p>
            </div>
          </div>
          {/* phones / tablets: photo below the text, again at its own aspect ratio so the car is complete */}
          <div className="relative aspect-[796/484] w-full sm:aspect-auto sm:h-[240px] lg:hidden" aria-hidden="true">
            {/* masks (not green overlays) soften only the sky edge on top and, from sm, the landscape edge on the
                left - both stop before the car (roof at ~12% height, nose at ~12% width) so it stays untinted */}
            <div className="absolute inset-y-0 right-0 w-full [mask-image:linear-gradient(to_bottom,transparent,#000_8%)] sm:w-auto sm:aspect-[796/484]">
              <div className="absolute inset-0 sm:[mask-image:linear-gradient(to_right,transparent,#000_9%)]">
                <Image src={note.image} alt="" fill quality={90} className="object-cover" sizes="(min-width: 640px) 400px, 100vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
