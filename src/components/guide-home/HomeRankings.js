import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import { BODY, BODY_SM, CONTAINER, H2, H6, ICON_LG, ICON_SM, LABEL, NUM, SMALL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens, and the Defender photos
// fade into the page through CSS masks (no colour overlays), so they blend with either background.

// desktop photo: left and bottom edges feathered into the page
const FADE_DESKTOP =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.6)_30%,#000_55%),linear-gradient(to_bottom,transparent,#000_14%,#000_70%,transparent)] [mask-composite:intersect]";
// phone photo: left, top and bottom edges feathered into the page
const FADE_MOBILE =
  "[mask-image:linear-gradient(to_right,transparent,#000_28%),linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)] [mask-composite:intersect]";

// verdict badge: a dark green pill in both themes (brand green by day, a deep chip green with a ring at
// night), so the green / red accents below - fixed colours tuned for a dark surface - read on either
const BADGE = "bg-lr-brand text-lr-on-brand dark:bg-lr-chip dark:ring-1 dark:ring-inset dark:ring-lr-line-strong";
const VERDICTS = {
  best: { icon: "trophy", iconTone: "text-lr-gold-line", labelTone: "text-lr-gold-line" },
  safe: { icon: "shield", iconTone: "text-[#4fae7e]", labelTone: "text-lr-on-brand" },
  avoid: { icon: "alert", iconTone: "text-[#ef5b5b]", labelTone: "text-[#ef5b5b]" },
  watch: { icon: "alert", iconTone: "text-lr-gold-line", labelTone: "text-lr-gold-line" },
  family: { icon: "people", iconTone: "text-[#4fae7e]", labelTone: "text-lr-on-brand" },
};

function Verdict({ row, desktop = false }) {
  const v = VERDICTS[row.verdict];
  if (desktop) {
    return (
      <span className={`inline-flex min-w-[150px] items-center gap-2.5 rounded-md py-2 pl-3 pr-3.5 shadow-[0_4px_10px_-4px_var(--lr-shadow)] ${BADGE}`}>
        <span className={v.iconTone}>
          <GuideIcon name={v.icon} tone="current" className={ICON_SM} />
        </span>
        <span className="leading-tight">
          <span className={`${SMALL} block font-semibold uppercase tracking-[0.02em] ${v.labelTone}`}>{row.verdictLabel}</span>
          <span className={`${SMALL} block whitespace-nowrap text-lr-on-brand/90`}>{row.verdictSub}</span>
        </span>
      </span>
    );
  }
  const label = row.mobileLabel ?? row.verdictLabel;
  return (
    <span className={`flex w-[66px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-center shadow-[0_4px_10px_-4px_var(--lr-shadow)] sm:w-[124px] sm:flex-row sm:gap-2.5 sm:px-2 sm:py-3 sm:text-left ${BADGE}`}>
      <span className={v.iconTone}>
        <GuideIcon name={v.icon} tone="current" className={ICON_SM} />
      </span>
      <span className={`${SMALL} font-semibold uppercase leading-[1.15] tracking-[0.02em] ${v.labelTone}`}>{label}</span>
    </span>
  );
}

function MobileRow({ row, n }) {
  return (
    <li>
      <Link
        href={row.href}
        className="flex items-start gap-2 rounded-lg border border-lr-line font-normal bg-lr-card px-2.5 py-3 shadow-[0_4px_14px_-10px_var(--lr-shadow)] transition-colors hover:bg-lr-panel sm:gap-4 sm:px-4"
      >
        {/* phones: number badge tucked into the top-left corner so the car can be shown larger;
            sm+: number and car side by side */}
        <span className="relative h-[72px] w-[92px] shrink-0 sm:flex sm:h-auto sm:w-auto sm:items-start sm:gap-4">
          <span className="absolute left-0 top-0 z-10 flex h-[26px] w-[26px] items-center justify-center rounded-md bg-lr-brand text-[14px] font-semibold text-lr-on-brand shadow-[0_2px_6px_var(--lr-shadow)] sm:static sm:mt-0.5 sm:h-9 sm:w-9 sm:text-[18px] sm:shadow-none">
            {n}
          </span>
          <span className="absolute bottom-0 right-0 h-[52px] w-[88px] sm:relative sm:h-[66px] sm:w-[112px]">
            <Image src={row.image} alt={row.imageAlt} fill className="object-contain" sizes="(min-width: 640px) 112px, 88px" />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className={`${BODY_SM} block font-semibold leading-snug text-lr-head`}>{row.category}</span>
          <span className={`${H6} block text-lr-green`}>{row.winner}</span>
          <span className={`${BODY_SM} mt-0.5 block text-lr-body`}>{row.why}</span>
        </span>
        <span className="self-center">
          <Verdict row={row} />
        </span>
      </Link>
    </li>
  );
}

export default function HomeRankings({ data }) {
  const [h1, h2, h3, h4] = data.h2.split("|");
  const { note } = data;

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      {/* tablet / desktop: Defender photo top right, fading into the page on the left */}
      <div className={`absolute right-0 top-0 hidden h-[370px] w-[58%] xl:block ${FADE_DESKTOP}`} aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[60%_45%] dark:brightness-[0.82]" sizes="58vw" />
      </div>

      <div className={`${CONTAINER} relative pb-10 pt-9 lg:pb-14 lg:pt-10`}>
        <h2 className={`${H2} text-balance text-lr-head lg:mt-4`}>
          {h1} <br className="xl:hidden" />
          {h2}
          <br />
          <span className="text-lr-green">{h3}</span> {h4}
        </h2>

        <div className="relative mt-3 min-h-[40vw] sm:min-h-[37vw] xl:min-h-0">
          {/* phone photo: background layer beside the paragraph, never behind text */}
          <div className={`pointer-events-none absolute -right-[62px] top-0 aspect-[620/370] w-[64%] sm:-right-[86px] sm:w-[58%] lg:-right-[110px] xl:hidden ${FADE_MOBILE}`} aria-hidden="true">
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover dark:brightness-[0.82]" sizes="60vw" />
          </div>
          <p className={`${BODY} relative w-[52%] text-lr-body sm:w-[44%] xl:w-auto xl:max-w-[600px]`}>
            {data.subhead}
          </p>
        </div>

        {/* ===== phones / tablets: ranked cards ===== */}
        <ol className="relative mt-4 flex flex-col gap-1.5 xl:hidden">
          {data.rows.map((r, i) => (
            <MobileRow key={r.rank} row={r} n={i + 1} />
          ))}
        </ol>

        {/* ===== desktop: ranking table ===== */}
        <div className="relative mt-6 hidden overflow-hidden rounded-md border border-lr-line bg-lr-card shadow-[0_10px_30px_-16px_var(--lr-shadow)] xl:block">
          <div className={`${LABEL} grid grid-cols-[25%_27%_1fr_236px] bg-lr-brand text-lr-on-brand`}>
            {data.columns.map((c, i) => (
              <span key={c} className={`py-3.5 ${i === 0 ? "pl-7" : i === 3 ? "pl-8" : "pl-6"}`}>
                {c}
              </span>
            ))}
          </div>
          <ol>
            {data.rows.map((r) => (
              <li key={r.rank} className="border-t border-lr-line first:border-t-0">
                <Link
                  href={r.href}
                  className="grid grid-cols-[25%_27%_1fr_236px] items-center font-normal transition-colors hover:bg-lr-panel/60"
                >
                  <span className="flex items-center self-stretch border-r border-lr-line py-4 pl-7">
                    <span className={`${NUM} w-[60px] shrink-0 text-lr-head`}>{r.rank}</span>
                    <span className={`${H6} pr-4 text-lr-head`}>{r.category}</span>
                  </span>
                  <span className="flex items-center gap-4 self-stretch border-r border-lr-line py-1.5 pl-5 pr-4">
                    <span className="relative h-[50px] w-[96px] shrink-0">
                      <Image src={r.image} alt={r.imageAlt} fill className="object-contain" sizes="96px" />
                    </span>
                    <span className={`${H6} text-lr-green`}>{r.winner}</span>
                  </span>
                  <span className={`${BODY_SM} py-3 pl-7 pr-6 text-lr-body`}>{r.why}</span>
                  <span className="flex justify-start py-2.5 pl-4">
                    <Verdict row={r} desktop />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* data note */}
        <div className="relative mt-4 overflow-hidden rounded-lg border border-lr-line bg-lr-card text-lr-head shadow-[0_10px_30px_-16px_var(--lr-shadow)] xl:mt-5 xl:rounded-md">
          {/* photo on the right, its left edge fading into the card (mask - blends with either theme) */}
          <div className="absolute inset-y-0 right-0 hidden w-[36%] [mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.6)_30%,#000_60%)] sm:block" aria-hidden="true">
            <Image src={note.image} alt="" fill quality={90} className="object-cover" sizes="36vw" />
          </div>
          <div className="relative flex items-start gap-3.5 px-3.5 py-4 sm:items-center sm:gap-6 sm:px-6 sm:py-6 lg:px-5">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-lr-gold-line/70 bg-lr-chip text-lr-gold sm:h-[68px] sm:w-[68px]">
              <GuideIcon name="shield" className={ICON_LG} />
            </span>
            <div className="min-w-0 sm:max-w-[62%] lg:max-w-[720px]">
              <p className={`${H6} text-lr-head`}>{note.title}</p>
              <p className={`${BODY_SM} mt-1 text-lr-body`}>{note.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
