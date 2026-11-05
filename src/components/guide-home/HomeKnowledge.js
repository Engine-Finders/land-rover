import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import { BODY, BODY_SM, CONTAINER, H2, H6, ICON_LG, ICON_XL, LABEL, STAT_LG } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens; the data-note photo fades
// into its card through CSS masks, so it blends with either theme's card.

const pad = (n) => String(n).padStart(2, "0");

function Centre({ item, n, cta }) {
  return (
    <Link
      href={item.href}
      className="group flex overflow-hidden rounded-md border font-normal border-lr-line bg-lr-card shadow-[0_6px_18px_-14px_var(--lr-shadow)] transition-shadow hover:shadow-[0_10px_24px_-12px_var(--lr-shadow)]"
    >
      {/* number block */}
      <span className={`${STAT_LG} flex w-[58px] shrink-0 items-center justify-center bg-lr-brand text-lr-gold-line sm:w-[72px] xl:w-[80px] dark:bg-lr-chip dark:text-lr-gold`}>
        {pad(n)}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:gap-5 sm:px-5 xl:gap-6 xl:px-6 xl:py-4">
        <span className="shrink-0 text-lr-head">
          <GuideIcon name={item.icon} className={ICON_XL} />
        </span>
        <span className="min-w-0 flex-1 xl:pl-2">
          <span className={`${H6} block text-lr-head`}>{item.title}</span>
          <span className={`${BODY_SM} mt-1 block text-lr-body xl:mt-1.5`}>{item.text}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 self-stretch sm:border-l sm:border-lr-line sm:pl-5 xl:pl-6">
          <span className="hidden text-[16px] font-medium text-lr-head sm:inline">{cta}</span>
          <span className="text-lr-head transition-transform group-hover:translate-x-0.5 group-hover:text-lr-green">
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
    <section className="relative bg-lr-band text-lr-head">
      <div className={`${CONTAINER} pb-10 pt-9 lg:pb-14 lg:pt-12`}>
        <h2 className={H2}>
          {h1} <span className="text-lr-green">{h2}</span>
        </h2>
        <p className={`${BODY} mt-3 max-w-[760px] text-lr-body lg:mt-5`}>{data.subhead}</p>

        <div className="mt-6 grid gap-2 lg:mt-7 xl:grid-flow-col xl:grid-cols-2 xl:grid-rows-4 xl:gap-x-6 xl:gap-y-1.5">
          {data.items.map((item, i) => (
            <Centre key={item.title} item={item} n={i + 1} cta={data.cta} />
          ))}
        </div>

        {/* data note */}
        <div className="relative mt-5 overflow-hidden rounded-md border border-lr-line bg-lr-card text-lr-head shadow-[0_14px_30px_-18px_var(--lr-shadow)] lg:mt-6">
          {/* desktop: wide landscape photo filling the right side. The box takes the photo's own aspect ratio
              from the panel height so the whole Defender stays in frame (capped at 48% and centred below xl).
              Its left edge blends into the panel with a transparency mask over the first 14% - landscape only,
              the car starts further in - so no colour is ever painted over the car itself. */}
          <div
            className="absolute inset-y-0 right-0 hidden w-[48%] [mask-image:linear-gradient(to_right,transparent,#000_14%)] lg:block xl:aspect-[976/375] xl:w-auto xl:max-w-[48%]"
            aria-hidden="true"
          >
            <Image src={note.wideImage} alt="" fill quality={90} className="object-cover object-center" sizes="(min-width: 1024px) 620px, 0px" />
          </div>
          <div className="relative flex items-start gap-4 px-4 pb-5 pt-5 sm:items-center sm:gap-6 sm:px-7 lg:min-h-[230px] lg:max-w-[52%] lg:py-8">
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-lr-gold-line/70 bg-lr-chip text-lr-gold sm:h-[78px] sm:w-[78px]">
              <GuideIcon name="shield" className={ICON_LG} />
            </span>
            <div className="min-w-0">
              <p className={`${LABEL} text-lr-gold`}>{note.title}</p>
              <p className={`${BODY_SM} mt-1.5 text-lr-body`}>
                {note.before}
                <span className="whitespace-nowrap text-lr-green">{note.tag}</span>
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
