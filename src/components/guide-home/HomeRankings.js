import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

// verdict badge styles: icon + colour of the label
const VERDICTS = {
  best: { icon: "trophy", iconTone: "text-[#d4a54c]", labelTone: "text-[#d4a54c]" },
  safe: { icon: "shield", iconTone: "text-[#4fae7e]", labelTone: "text-white" },
  avoid: { icon: "alert", iconTone: "text-[#ef4b4b]", labelTone: "text-[#ef4b4b]" },
  watch: { icon: "alert", iconTone: "text-[#d4a54c]", labelTone: "text-[#d4a54c]" },
  family: { icon: "people", iconTone: "text-[#4fae7e]", labelTone: "text-white" },
};

function Verdict({ row, desktop = false }) {
  const v = VERDICTS[row.verdict];
  if (desktop) {
    return (
      <span className="inline-flex min-w-[150px] items-center gap-3 rounded-md bg-[#0e2b20] py-2 pl-3 pr-4 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)]">
        <span className={v.iconTone}>
          <GuideIcon name={v.icon} className="h-7 w-7" />
        </span>
        <span className="leading-tight">
          <span className={`block text-[14px] font-bold uppercase ${v.labelTone}`}>{row.verdictLabel}</span>
          <span className="block whitespace-nowrap text-[12.5px] text-white/90">{row.verdictSub}</span>
        </span>
      </span>
    );
  }
  const label = row.mobileLabel ?? row.verdictLabel;
  return (
    <span className="flex w-[62px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg bg-[#0e2b20] px-1.5 py-2 text-center shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)] sm:w-[118px] sm:flex-row sm:gap-2.5 sm:px-2 sm:py-3 sm:text-left">
      <span className={v.iconTone}>
        <GuideIcon name={v.icon} className="h-[22px] w-[22px] sm:h-7 sm:w-7" />
      </span>
      <span className={`text-[11.5px] font-bold uppercase leading-[1.15] tracking-[0.02em] sm:text-[14px] sm:font-semibold ${v.labelTone}`}>{label}</span>
    </span>
  );
}

function MobileRow({ row, n }) {
  return (
    <li>
      <Link
        href={row.href}
        className="flex items-start gap-2 rounded-lg border border-black/[0.06] bg-white px-2.5 py-3 shadow-[0_4px_14px_-10px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#fbfbfa] sm:gap-4 sm:px-4"
      >
        {/* phones: number badge tucked into the top-left corner so the car can be shown larger;
            sm+: number and car side by side */}
        <span className="relative h-[72px] w-[92px] shrink-0 sm:flex sm:h-auto sm:w-auto sm:items-start sm:gap-4">
          <span className="absolute left-0 top-0 z-10 flex h-[26px] w-[26px] items-center justify-center rounded-md bg-[#0e2b20] text-[14px] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] sm:static sm:mt-0.5 sm:h-9 sm:w-9 sm:text-[18px] sm:shadow-none">
            {n}
          </span>
          <span className="absolute bottom-0 right-0 h-[52px] w-[88px] sm:relative sm:h-[66px] sm:w-[112px]">
            <Image src={row.image} alt={row.imageAlt} fill className="object-contain" sizes="(min-width: 640px) 112px, 88px" />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold leading-snug text-[#141414] sm:text-[15px]">{row.category}</span>
          <span className="block text-[13.5px] font-semibold leading-snug text-[#1f6b45] sm:text-[15px]">{row.winner}</span>
          <span className="mt-0.5 block text-[12px] leading-[1.42] text-[#4a4a4a] sm:text-[13.5px]">{row.why}</span>
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
    <section className="relative overflow-hidden bg-[#f5f5f3] text-[#141414]">
      {/* tablet / desktop: Defender photo top right, fading into the page on the left */}
      <div className="absolute right-0 top-0 hidden h-[370px] w-[58%] xl:block" aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[60%_45%]" sizes="58vw" />
        <div className="absolute inset-0 bg-linear-to-r from-[#f5f5f3] via-[#f5f5f3]/40 via-30% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-[#f5f5f3] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-[88px] lg:pb-14 lg:pt-10">
        <h2 className={`${serif.className} px-1 text-[clamp(30px,8.4vw,56px)] leading-[1.05] tracking-[-0.01em] text-[#141414] sm:px-0 lg:mt-4`}>
          {h1} <br className="xl:hidden" />
          {h2}
          <br />
          <span className="text-[#1f5c3d]">{h3}</span> {h4}
        </h2>

        <div className="relative mt-3 min-h-[40vw] px-1 sm:min-h-[37vw] sm:px-0 xl:min-h-0">
          {/* phone photo: background layer beside the paragraph, never behind text */}
          <div className="pointer-events-none absolute -right-[62px] top-0 aspect-[620/370] w-[64%] sm:-right-[86px] sm:w-[58%] lg:-right-[110px] xl:hidden" aria-hidden="true">
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover" sizes="60vw" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-[#f5f5f3] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/5 bg-linear-to-b from-[#f5f5f3] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-t from-[#f5f5f3] to-transparent" />
          </div>
          <p className="relative w-[38%] text-[13px] leading-[1.5] text-[#3a3a3a] sm:w-[42%] sm:text-[15.5px] xl:w-auto xl:max-w-[560px] xl:leading-[1.55]">
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
        <div className="relative mt-6 hidden overflow-hidden rounded-md border border-black/[0.07] bg-white shadow-[0_10px_30px_-16px_rgba(0,0,0,0.35)] xl:block">
          <div className="grid grid-cols-[24%_27%_1fr_200px] 2xl:grid-cols-[296px_356px_1fr_220px] bg-[#0e2b20] text-[14px] font-semibold uppercase tracking-[0.04em] text-white">
            {data.columns.map((c, i) => (
              <span key={c} className={`py-3.5 ${i === 0 ? "pl-7" : i === 3 ? "pl-8" : "pl-6"}`}>
                {c}
              </span>
            ))}
          </div>
          <ol>
            {data.rows.map((r) => (
              <li key={r.rank} className="border-t border-black/[0.07] first:border-t-0">
                <Link
                  href={r.href}
                  className="grid grid-cols-[24%_27%_1fr_200px] 2xl:grid-cols-[296px_356px_1fr_220px] items-center transition-colors hover:bg-[#fafaf8]"
                >
                  <span className="flex items-center border-r border-black/[0.07] py-4 pl-7">
                    <span className="w-[60px] shrink-0 text-[17px] font-medium text-[#141414] 2xl:w-[82px]">{r.rank}</span>
                    <span className="text-[15px] font-medium text-[#141414]">{r.category}</span>
                  </span>
                  <span className="flex items-center gap-4 border-r border-black/[0.07] py-1.5 pl-5 pr-4 2xl:gap-6 2xl:pl-6">
                    <span className="relative h-[50px] w-[96px] shrink-0">
                      <Image src={r.image} alt={r.imageAlt} fill className="object-contain" sizes="96px" />
                    </span>
                    <span className="text-[15.5px] font-semibold leading-snug text-[#1f6b45]">{r.winner}</span>
                  </span>
                  <span className="py-3 pl-7 pr-6 text-[13px] leading-[1.5] text-[#3a3a3a] 2xl:pl-9 2xl:pr-8">{r.why}</span>
                  <span className="flex justify-start py-2.5 pl-4 2xl:pl-6">
                    <Verdict row={r} desktop />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* data note */}
        <div className="relative mt-4 overflow-hidden rounded-lg bg-[#0e2b20] text-white shadow-[0_10px_30px_-16px_rgba(0,0,0,0.5)] xl:mt-5 xl:rounded-md">
          <div className="absolute inset-y-0 right-0 hidden w-[36%] sm:block" aria-hidden="true">
            <Image src={note.image} alt="" fill quality={90} className="object-cover" sizes="36vw" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0e2b20] via-[#0e2b20]/40 to-transparent" />
          </div>
          <div className="relative flex items-start gap-3.5 px-3.5 py-4 sm:items-center sm:gap-6 sm:px-6 sm:py-6 lg:px-5">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[#d4a54c]/70 sm:h-[68px] sm:w-[68px]">
              <GuideIcon name="shield" className="h-7 w-7 sm:h-9 sm:w-9" />
            </span>
            <div className="min-w-0 sm:max-w-[62%] lg:max-w-[720px]">
              <p className="text-[16px] font-semibold">{note.title}</p>
              <p className="mt-1 text-[13px] leading-[1.55] text-white/90 sm:text-[13.5px] lg:text-[13px]">{note.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
