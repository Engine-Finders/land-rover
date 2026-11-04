import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { CONTAINER, H2, H6, BODY, BODY_SM, SMALL, LABEL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens.

const pad = (n) => String(n).padStart(2, "0");

// the two engine-pair renders were shot on a light studio grey (a pale box on the night theme); their
// "-cut" files are transparent cut-outs of the same renders, so the engines sit on the panel colour in
// either theme. The car pairs are full scenic photos and stay as they are.
const CUTOUTS = ["/ingenium-vs-tdv6", "/tdv6-vs-sdv6"];
const pairSrc = (src = "") => (CUTOUTS.some((k) => src.includes(k)) ? src.replace(/\.webp$/, "-cut.webp") : src);

function VerdictIcon({ name, className = "" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-lr-chip text-lr-green ${className}`}>
      <GuideIcon name={name} className="h-[55%] w-[55%]" />
    </span>
  );
}

// the pair photo - both cars (or engines) side by side, already framed edge to edge. The box keeps the
// photo's own aspect ratio so nothing is cropped: wide crop for the desktop table, taller one for cards.
function PairImage({ item, mobile = false, sizes, className = "" }) {
  return (
    <span className={`relative block overflow-hidden rounded-md bg-lr-panel ${mobile ? "aspect-[522/212]" : "aspect-[806/192]"} ${className}`}>
      <Image src={pairSrc(mobile ? item.mobileImage : item.image)} alt={item.title} fill quality={90} className="object-cover" sizes={sizes} />
    </span>
  );
}

// phones / tablets: number badge + pair photo on the left, title / verdict / link on the right
function MobileCard({ item, n, cta }) {
  return (
    <li>
      <Link
        href={item.href}
        className="group flex h-full items-start gap-2.5 rounded-lg border font-normal border-lr-line bg-lr-card p-2.5 shadow-[0_6px_18px_-14px_var(--lr-shadow)] sm:gap-4 sm:p-4"
      >
        <span className="relative w-[44%] shrink-0 sm:w-[46%]">
          <PairImage item={item} mobile sizes="(min-width: 640px) 22vw, 44vw" />
          <span className={`${SMALL} absolute -left-1 -top-1 flex h-[26px] w-[26px] items-center justify-center rounded-md bg-lr-brand font-medium text-lr-on-brand shadow-[0_2px_6px_var(--lr-shadow)] ring-2 ring-lr-card sm:h-8 sm:w-8`}>
            {pad(n)}
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col self-stretch">
          <span className={`${H6} block text-lr-head`}>{item.title}</span>
          <span className={`${BODY_SM} mt-1 block text-lr-body`}>{item.text}</span>
          <span className="mt-auto border-t border-lr-line pt-1.5 sm:pt-2.5">
            <span className={`${SMALL} inline-flex items-center gap-1.5 font-semibold text-lr-green group-hover:underline`}>
              {cta} <Arrow className="h-4 w-4" />
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

const COLS = "grid-cols-[72px_240px_minmax(0,0.8fr)_minmax(0,1.3fr)_190px]";

export default function HomeCompare({ data }) {
  const [h1, h2, h3] = data.h2.split("|");

  return (
    <section className="relative bg-lr-band text-lr-head">
      <div className={`${CONTAINER} pb-10 pt-6 lg:pb-14 lg:pt-8`}>
        <h2 className={`${H2} text-balance`}>
          {h1}
          <br />
          {h2} <span className="text-lr-green">{h3}</span>
        </h2>
        <p className={`${BODY} mt-3 max-w-[640px] text-lr-body`}>{data.subhead}</p>

        {/* ===== phones / tablets: comparison cards ===== */}
        <ol className="mt-5 grid gap-2.5 lg:grid-cols-2 xl:hidden">
          {data.items.map((item, i) => (
            <MobileCard key={item.title} item={item} n={i + 1} cta={data.cta} />
          ))}
        </ol>

        {/* ===== desktop: comparison table ===== */}
        <div className="mt-6 hidden overflow-hidden rounded-md border border-lr-line bg-lr-card shadow-[0_10px_30px_-18px_var(--lr-shadow)] xl:block">
          <div className={`${LABEL} grid ${COLS} bg-lr-brand py-3.5 text-lr-on-brand`}>
            <span className="text-center">{data.columns[0]}</span>
            <span className="col-span-2 pl-[60px]">{data.columns[1]}</span>
            <span className="pl-5">{data.columns[2]}</span>
            <span className="text-center">{data.columns[3]}</span>
          </div>
          <ol>
            {data.items.map((item, i) => (
              <li key={item.title} className="border-t border-lr-line first:border-t-0">
                <Link href={item.href} className={`group grid ${COLS} items-center py-2 font-normal transition-colors hover:bg-lr-panel/60`}>
                  <span className="flex justify-center">
                    <span className={`${SMALL} flex h-10 w-10 items-center justify-center rounded-md bg-lr-brand font-medium text-lr-on-brand`}>{pad(i + 1)}</span>
                  </span>
                  <PairImage item={item} sizes="240px" />
                  <span className={`${H6} flex items-center self-stretch border-r border-lr-line py-4 pl-6 pr-5 text-lr-head`}>{item.title}</span>
                  <span className="flex items-center gap-4 self-stretch border-r border-lr-line py-3 pl-5 pr-6">
                    <VerdictIcon name={item.icon} className="h-[48px] w-[48px]" />
                    <span className={`${BODY_SM} text-lr-body`}>{item.text}</span>
                  </span>
                  <span className="flex justify-center">
                    <span className="inline-flex items-center gap-2 text-[16.5px] font-semibold text-lr-green group-hover:underline">
                      {data.cta} <Arrow className="h-4.5 w-4.5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* data note */}
        <div className="mt-3 flex flex-wrap items-start gap-3.5 rounded-md border border-lr-line bg-lr-panel px-3.5 py-4 sm:flex-nowrap sm:items-center sm:gap-6 sm:px-6 lg:py-5">
          <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-lr-brand text-lr-on-brand sm:h-16 sm:w-16">
            <GuideIcon name="chart-search" className="h-6 w-6 sm:h-8 sm:w-8" />
          </span>
          <p className={`${BODY_SM} min-w-0 flex-1 text-lr-body lg:max-w-[760px]`}>
            <span className="font-semibold uppercase text-lr-green">{data.note.title}</span> {data.note.text}
          </p>
          {/* two car line drawings: own row under the text on phones, beside it from sm */}
          <span className="flex w-full items-end justify-end border-t border-lr-line pt-2 text-lr-muted sm:ml-auto sm:w-auto sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 lg:pl-8">
            <span className="relative block aspect-[1164/284] w-[78%] max-w-[300px] sm:w-[260px] lg:w-[330px]">
              <Image src={data.note.image} alt="" fill className="object-contain" sizes="330px" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
