import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import { BODY, CONTAINER, H2, H6, LABEL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens. The data note is a deep green
// card in both themes; its photo fades into the card through CSS masks.

const pad = (n) => String(n).padStart(2, "0");

// serif gold numbers, as in the reference
const NUM_FONT = "font-[family-name:var(--font-serif-display)] font-normal leading-none tracking-[-0.01em]";

function Centre({ item, n, cta }) {
  return (
    <Link
      href={item.href}
      className="group flex overflow-hidden rounded-md border font-normal border-lr-line bg-lr-card shadow-[0_6px_18px_-14px_var(--lr-shadow)] transition-shadow hover:shadow-[0_10px_24px_-12px_var(--lr-shadow)] xl:min-h-[104px]"
    >
      {/* number block */}
      <span className={`${NUM_FONT} flex w-[46px] shrink-0 items-center justify-center bg-lr-brand text-[26px] text-lr-gold-line sm:w-[72px] sm:text-[34px] xl:text-[36px] 2xl:w-[80px] 2xl:text-[40px] dark:bg-lr-chip dark:text-lr-gold`}>
        {pad(n)}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-2.5 py-3 pl-2.5 pr-3 sm:gap-4 sm:py-3 sm:pl-3 sm:pr-5 xl:py-3.5 xl:pr-4 2xl:gap-5 2xl:pr-6">
        {/* the icon gets its own column, large, as in the reference (narrower on phones and 1280-1535px laptops, where the title needs the room) */}
        <span className="flex w-[32px] shrink-0 justify-center sm:w-[64px] lg:w-[72px] xl:w-[64px] 2xl:w-[96px]">
          <GuideIcon name={item.icon} className="h-8 w-8 sm:h-11 sm:w-11 lg:h-12 lg:w-12 2xl:h-[60px] 2xl:w-[60px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`${H6} block font-medium text-lr-head xl:text-[18px]!`}>{item.title}</span>
          <span className="mt-1 block text-[14px] leading-[1.55] text-lr-body md:text-[15px] xl:mt-1.5 xl:text-[14px]!">{item.text}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 self-stretch sm:border-l sm:border-lr-line sm:pl-5 2xl:gap-3.5 2xl:pl-8">
          <span className="hidden text-[16px] font-medium text-lr-head sm:inline xl:text-[17px]">{cta}</span>
          <span className="text-lr-head transition-transform group-hover:translate-x-0.5 group-hover:text-lr-green">
            <GuideIcon name="arrow-circle" className="h-[30px] w-[30px] sm:h-9 sm:w-9 xl:h-10 xl:w-10" />
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
    <section className="relative bg-lr-band text-lr-head">
      <div className={`${CONTAINER} pb-6 pt-6 lg:pb-6 lg:pt-6`}>
        <h2 className={H2}>
          {h1} <span className="text-lr-green">{h2}</span>
        </h2>
        <p className={`${BODY} mt-3 max-w-[760px] text-lr-body lg:mt-3 lg:max-w-[900px] xl:max-w-[960px]`}>{data.subhead}</p>

        <div className="mt-5 grid gap-2 lg:mt-6 xl:grid-flow-col xl:grid-cols-2 xl:grid-rows-4 xl:gap-x-6 xl:gap-y-2">
          {data.items.map((item, i) => (
            <Centre key={item.title} item={item} n={i + 1} cta={data.cta} />
          ))}
        </div>

        {/* data note: a deep green card in both themes - gold shield and label, light text, the
            [EM-VERIFIED] tag in green, and the Defender photo fading in from the right */}
        <div className="relative mt-4 overflow-hidden rounded-md border border-[#0c2a1f] bg-[#0c2a1f] text-white shadow-[0_18px_36px_-20px_rgba(6,24,17,0.55)] lg:mt-4 dark:border-lr-line dark:bg-[#0a1c15]">
          {/* laptops: the photo fills the right side at its own aspect ratio (from the panel height) so the
              whole Defender stays in frame; its left edge fades into the card through a mask */}
          <div
            className="absolute inset-y-0 right-0 hidden w-[50%] [mask-image:linear-gradient(to_right,transparent,#000_26%)] lg:block xl:aspect-[976/375] xl:w-auto xl:max-w-[52%]"
            aria-hidden="true"
          >
            <Image src={note.wideImage} alt="" fill quality={90} className="object-cover object-center" sizes="(min-width: 1024px) 620px, 0px" />
          </div>
          {/* phones: the shield floats left so the text wraps under it */}
          <div className="relative flex items-start gap-4 px-4 py-4 max-sm:flow-root sm:items-center sm:gap-5 sm:px-6 lg:min-h-[150px] lg:max-w-[56%] lg:py-5 xl:gap-6 xl:px-7 2xl:min-h-[160px]">
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#c9a35d] text-[#d4aa68] max-sm:float-left max-sm:mb-1.5 max-sm:mr-3.5 sm:h-14 sm:w-14 xl:h-16 xl:w-16">
              <GuideIcon name="shield" tone="current" className="h-7 w-7 sm:h-8 sm:w-8 xl:h-10 xl:w-10" />
            </span>
            <div className="min-w-0">
              <p className={`${LABEL} text-[#d4aa68]`}>{note.title}</p>
              <p className="mt-2 text-[14px] leading-[1.7] text-white/90 md:text-[15px] xl:text-[16px]">
                {note.before}
                <span className="whitespace-nowrap text-[#7bc49a]">{note.tag}</span>
                {note.after}
              </p>
            </div>
          </div>
          {/* phones / tablets: photo below the text, again at its own aspect ratio so the car is complete */}
          <div className="relative aspect-[796/484] w-full sm:aspect-auto sm:h-[240px] lg:hidden" aria-hidden="true">
            {/* masks fade only the sky edge on top and, from sm, the landscape edge on the left into the
                card - both stop before the car (roof at ~12% height, nose at ~12% width) */}
            <div className="absolute inset-y-0 right-0 w-full [mask-image:linear-gradient(to_bottom,transparent,#000_14%)] sm:w-auto sm:aspect-[796/484]">
              <div className="absolute inset-0 sm:[mask-image:linear-gradient(to_right,transparent,#000_12%)]">
                <Image src={note.image} alt="" fill quality={90} className="object-cover" sizes="(min-width: 640px) 400px, 100vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
