import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

const pad = (n) => String(n).padStart(2, "0");

function VerdictIcon({ name, className = "" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#e6eee8] text-[#1f5c3d] ${className}`}>
      <GuideIcon name={name} className="h-[55%] w-[55%]" />
    </span>
  );
}

// the pair photo - both cars (or engines) side by side, already framed edge to edge. The box keeps the
// photo's own aspect ratio so nothing is cropped: wide crop for the desktop table, taller one for cards.
function PairImage({ item, mobile = false, sizes, className = "" }) {
  return (
    <span className={`relative block overflow-hidden rounded-md bg-[#e9ebe8] ${mobile ? "aspect-[522/212]" : "aspect-[806/192]"} ${className}`}>
      <Image src={mobile ? item.mobileImage : item.image} alt={item.title} fill quality={90} className="object-cover" sizes={sizes} />
    </span>
  );
}

// phones / tablets: number badge + pair photo on the left, title / verdict / link on the right
function MobileCard({ item, n, cta }) {
  return (
    <li>
      <Link
        href={item.href}
        className="group flex h-full items-start gap-2.5 rounded-lg border border-black/[0.07] bg-white p-2.5 shadow-[0_6px_18px_-14px_rgba(0,0,0,0.45)] sm:gap-4 sm:p-4"
      >
        <span className="relative w-[44%] shrink-0 sm:w-[46%]">
          <PairImage item={item} mobile sizes="(min-width: 640px) 22vw, 44vw" />
          <span className="absolute -left-1 -top-1 flex h-[26px] w-[26px] items-center justify-center rounded-md bg-[#0e2b20] text-[12.5px] font-medium text-white shadow-[0_2px_6px_rgba(0,0,0,0.3)] ring-2 ring-white sm:h-8 sm:w-8 sm:text-[14px]">
            {pad(n)}
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col self-stretch">
          <span className="block text-[14.5px] font-semibold leading-snug text-[#141414] sm:text-[17px]">{item.title}</span>
          <span className="mt-1 block text-[12px] leading-[1.45] text-[#3a3a3a] sm:text-[13.5px]">{item.text}</span>
          <span className="mt-auto border-t border-black/[0.08] pt-1.5 sm:pt-2.5">
            <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#1f5c3d] group-hover:underline sm:text-[15px]">
              {cta} <Arrow className="h-4 w-4" />
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

const COLS = "grid-cols-[72px_250px_minmax(0,0.8fr)_minmax(0,1.3fr)_180px] 2xl:grid-cols-[92px_320px_minmax(0,1fr)_minmax(0,1.25fr)_220px]";

export default function HomeCompare({ data }) {
  const [h1, h2, h3] = data.h2.split("|");

  return (
    <section className="relative bg-[#f7f7f5] text-[#141414]">
      <div className="mx-auto max-w-[1536px] px-3 pb-10 pt-6 sm:px-6 lg:px-12 lg:pb-14 lg:pt-8 xl:px-[76px]">
        <h2 className={`${serif.className} px-1 text-[clamp(30px,8.4vw,54px)] leading-[1.06] tracking-[-0.01em] sm:px-0`}>
          {h1}
          <br />
          {h2} <span className="text-[#1f5c3d]">{h3}</span>
        </h2>
        <p className="mt-3 max-w-[560px] px-1 text-[14px] leading-[1.6] text-[#3a3a3a] sm:px-0 sm:text-[15px]">{data.subhead}</p>

        {/* ===== phones / tablets: comparison cards ===== */}
        <ol className="mt-5 grid gap-2.5 lg:grid-cols-2 xl:hidden">
          {data.items.map((item, i) => (
            <MobileCard key={item.title} item={item} n={i + 1} cta={data.cta} />
          ))}
        </ol>

        {/* ===== desktop: comparison table ===== */}
        <div className="mt-6 hidden overflow-hidden rounded-md border border-black/[0.07] bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)] xl:block">
          <div className={`grid ${COLS} bg-[#0e2b20] py-3.5 text-[14.5px] font-medium uppercase tracking-[0.04em] text-white`}>
            <span className="text-center">{data.columns[0]}</span>
            <span className="col-span-2 pl-[60px] 2xl:pl-[76px]">{data.columns[1]}</span>
            <span className="pl-5 2xl:pl-9">{data.columns[2]}</span>
            <span className="text-center">{data.columns[3]}</span>
          </div>
          <ol>
            {data.items.map((item, i) => (
              <li key={item.title} className="border-t border-black/[0.07] first:border-t-0">
                <Link href={item.href} className={`group grid ${COLS} items-center py-2 transition-colors hover:bg-[#fafaf8]`}>
                  <span className="flex justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0e2b20] text-[15px] font-medium text-white">{pad(i + 1)}</span>
                  </span>
                  <PairImage item={item} sizes="(min-width: 1536px) 320px, 250px" />
                  <span className="border-r border-black/[0.08] py-4 pl-6 pr-5 text-[17px] font-medium leading-snug text-[#141414] 2xl:pl-8 2xl:pr-6 2xl:text-[19px]">{item.title}</span>
                  <span className="flex items-center gap-4 border-r border-black/[0.08] py-2 pl-5 pr-6 2xl:gap-5 2xl:pl-6 2xl:pr-8">
                    <VerdictIcon name={item.icon} className="h-[52px] w-[52px]" />
                    <span className="text-[13.5px] leading-[1.55] text-[#3a3a3a] 2xl:text-[14px] 2xl:leading-[1.6]">{item.text}</span>
                  </span>
                  <span className="flex justify-center">
                    <span className="inline-flex items-center gap-2 text-[16.5px] font-semibold text-[#1f5c3d] group-hover:underline">
                      {data.cta} <Arrow className="h-4.5 w-4.5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* data note */}
        <div className="mt-3 flex flex-wrap items-start gap-3.5 rounded-md border border-black/[0.07] bg-[#eceeeb] px-3.5 py-4 sm:flex-nowrap sm:items-center sm:gap-6 sm:px-6 lg:py-5">
          <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#0e2b20] text-white sm:h-16 sm:w-16">
            <GuideIcon name="chart-search" className="h-6 w-6 sm:h-8 sm:w-8" />
          </span>
          <p className="min-w-0 flex-1 text-[13px] leading-[1.6] text-[#3a3a3a] sm:text-[14.5px] lg:max-w-[720px]">
            <span className="font-semibold uppercase text-[#1f5c3d]">{data.note.title}</span> {data.note.text}
          </p>
          {/* two car line drawings: own row under the text on phones, beside it from sm */}
          <span className="flex w-full items-end justify-end border-t border-black/10 pt-2 text-[#8d968f] sm:ml-auto sm:w-auto sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 lg:pl-8">
            <span className="relative block aspect-[1164/284] w-[78%] max-w-[300px] sm:w-[260px] lg:w-[330px] 2xl:w-[400px]">
              <Image src={data.note.image} alt="" fill className="object-contain" sizes="(min-width: 1536px) 400px, 330px" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
