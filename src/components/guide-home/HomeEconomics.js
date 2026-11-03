import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

const pad = (n) => String(n).padStart(2, "0");

const VERDICT = {
  watch: { icon: "alert", tone: "text-[#c9861e]" },
  scrap: { icon: "x-circle", tone: "text-[#c0281c]" },
  safe: { icon: "check-circle", tone: "text-[#0e2b20]" },
};

// matrix grid: compact 4-column table on phones, roomier from sm, desktop widths from lg
const COLS =
  "grid-cols-[minmax(0,1.25fr)_minmax(0,0.82fr)_minmax(0,0.82fr)_minmax(0,1.5fr)] sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.4fr)] lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]";

function Panel({ icon, title, className = "", children }) {
  return (
    <div className={`overflow-hidden rounded-md border border-black/[0.07] bg-white shadow-[0_10px_28px_-18px_rgba(0,0,0,0.4)] ${className}`}>
      <h3 className="flex items-center gap-4 bg-[#0e2b20] px-5 py-3.5 text-[15px] font-medium uppercase tracking-[0.06em] text-white sm:px-7 sm:text-[16px] lg:py-4">
        <GuideIcon name={icon} className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
        {title}
      </h3>
      {children}
    </div>
  );
}

// "£6,000 – £18,000": stacked on two lines until there is room for one
function Range({ value }) {
  const [a, b] = value.split(" – ");
  return (
    <>
      {a} –<br className="lg:hidden" /> {b}
    </>
  );
}

function Matrix({ matrix }) {
  return (
    <Panel icon="chart" title={matrix.title}>
      <div className={`grid ${COLS} items-end gap-x-1.5 border-b border-black/[0.08] px-2.5 py-3 text-[10px] hyphens-auto font-medium uppercase leading-tight tracking-[0.02em] text-[#1f1f1f] sm:gap-x-4 sm:px-6 sm:text-[12px] lg:px-8 lg:text-[13px]`}>
        {matrix.columns.map((c, i) => (
          <span key={c} className={i === 1 || i === 2 ? "text-center lg:text-left" : i === 3 ? "pl-6 sm:pl-9 lg:pl-[66px]" : ""}>
            {c}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-black/[0.08] px-2.5 sm:px-6 lg:px-8">
        {matrix.rows.map((r) => {
          const v = VERDICT[r.verdict];
          return (
            <li key={r.name} className={`grid ${COLS} items-center gap-x-1.5 py-3 sm:gap-x-4 sm:py-3.5 lg:py-2.5`}>
              <span className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-4 lg:gap-4">
                <span className="relative h-[32px] w-[56px] shrink-0 sm:h-[46px] sm:w-[78px] lg:h-[50px] lg:w-[86px]">
                  <Image src={r.image} alt={r.name} fill className="object-contain" sizes="(min-width: 1024px) 94px, (min-width: 640px) 78px, 56px" />
                </span>
                <span className="min-w-0 text-[12px] font-medium leading-[1.3] text-[#141414] sm:text-[14px] sm:leading-snug lg:text-[15px]">
                  {r.name}
                  {r.sub ? <span className="block font-normal">{r.sub}</span> : null}
                </span>
              </span>
              <span className="border-l border-black/[0.08] py-1 text-center text-[11.5px] leading-snug text-[#1f1f1f] sm:text-[14px] lg:py-3 lg:pl-5 lg:text-left lg:text-[14.5px]">
                <Range value={r.value} />
              </span>
              <span className="border-l border-black/[0.08] py-1 text-center text-[11.5px] leading-snug text-[#1f1f1f] sm:text-[14px] lg:py-3 lg:pl-5 lg:text-left lg:text-[14.5px]">
                <Range value={r.cost} />
              </span>
              <span className="flex items-start gap-1 border-l border-black/[0.08] py-1 pl-1.5 sm:gap-3 sm:pl-4 lg:pl-6">
                <span className={`shrink-0 ${v.tone}`}>
                  <GuideIcon name={v.icon} className="h-[18px] w-[18px] sm:h-7 sm:w-7" />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[11px] font-semibold uppercase leading-tight sm:text-[14px] ${v.tone}`}>{r.label}</span>
                  <span className="mt-0.5 block text-[10.5px] leading-[1.35] text-[#3a3a3a] sm:text-[12.5px]">{r.note}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Rule({ rule }) {
  return (
    <Panel icon="scale" title={rule.title}>
      <div className="flex items-center gap-5 px-5 py-6 sm:gap-8 sm:px-8 lg:py-7">
        <span className={`${serif.className} w-[38%] shrink-0 text-center text-[clamp(44px,13vw,64px)] leading-none text-[#0e2b20] xl:w-[34%] xl:text-[50px] 2xl:text-[64px]`}>{rule.figure}</span>
        <span className="self-stretch border-l border-[#c9963f]/70" aria-hidden="true" />
        <p className="text-[13.5px] leading-[1.6] text-[#2a2a2a] sm:text-[15px]">{rule.text}</p>
      </div>
    </Panel>
  );
}

function Links({ links }) {
  return (
    <Panel icon="book" title={links.title}>
      <ol className="divide-y divide-black/[0.08] px-4 py-1 sm:px-7">
        {links.items.map((l, i) => (
          <li key={l.label}>
            <Link href={l.href} className="group flex items-center gap-4 py-2.5 sm:gap-6 sm:py-3">
              <span className="flex h-8 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#0e2b20] text-[13px] font-medium text-white sm:h-9 sm:w-10 sm:text-[14px]">{pad(i + 1)}</span>
              <span className="min-w-0 flex-1 text-[14px] text-[#141414] group-hover:text-[#1f5c3d] sm:text-[15.5px]">{l.label}</span>
              <Arrow className="h-5 w-5 shrink-0 text-[#141414] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function Tagged({ item }) {
  return (
    <>
      {item.text}
      {item.tag ? (
        <>
          {" "}
          <span className="whitespace-nowrap text-[#1f6b45]">{item.tag}</span>
        </>
      ) : null}
    </>
  );
}

export default function HomeEconomics({ data }) {
  const [h1, h2] = data.h2.split("|");

  return (
    <section lang="en-GB" className="relative overflow-hidden bg-[#f7f7f5] text-[#141414]">
      {/* desktop: photo across the top right, faded into the page on its left edge (mask, not a tint) */}
      <div
        className="absolute right-0 top-0 hidden h-[286px] w-[60%] [mask-image:linear-gradient(to_right,transparent,#000_24%)] xl:block xl:h-[300px]"
        aria-hidden="true"
      >
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[70%_50%]" sizes="60vw" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-12 lg:pb-14 lg:pt-10">
        <div className="relative">
          {/* phones / tablets: the photo is a backdrop behind the whole heading block, as in the mobile design -
              soft sky behind the heading, the car bottom-right beside the paragraph (never under it), and the
              left edge fading into the page through a mask (no tint on the car) */}
          {/* phones: tighter crop so the car is larger - sized to fill the gap between the paragraph and the screen edge */}
          <div
            className="pointer-events-none absolute -right-[29px] bottom-0 aspect-[1050/1105] w-[62%] [mask-image:linear-gradient(to_right,transparent,#000_8%)] min-[480px]:hidden"
            aria-hidden="true"
          >
            <Image src={data.phoneImage} alt="" fill quality={90} className="object-cover" sizes="62vw" />
          </div>
          <div
            className="pointer-events-none absolute -right-6 bottom-0 hidden aspect-[1460/1536] w-[60%] [mask-image:linear-gradient(to_right,transparent,#000_34%)] min-[480px]:block lg:-right-12 xl:hidden"
            aria-hidden="true"
          >
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover" sizes="60vw" />
          </div>

          <h2 className={`${serif.className} relative px-1 text-[clamp(30px,8.6vw,58px)] leading-[1.06] tracking-[-0.01em] sm:px-0`}>
            {h1}
            <br />
            <span className="text-[#0e2b20]">{h2}</span>
          </h2>

          <p className="relative mt-3 w-[49%] px-1 text-[13.5px] leading-[1.55] text-[#2a2a2a] sm:w-[42%] sm:px-0 sm:text-[15.5px] lg:mt-5 xl:w-auto xl:max-w-[520px]">
            {data.subhead}
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:mt-8 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] xl:gap-5">
          <Matrix matrix={data.matrix} />
          <div className="grid gap-4 lg:grid-cols-2 xl:flex xl:flex-col">
            <Rule rule={data.rule} />
            <Links links={data.links} />
          </div>
        </div>

        {/* data note */}
        <div className="mt-4 flex gap-4 rounded-md border border-black/[0.07] bg-[#eef0ed] px-4 py-4 sm:gap-6 sm:px-6 lg:mt-5 lg:items-center lg:px-9 lg:py-5">
          <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#0e2b20] text-white lg:h-auto lg:w-auto lg:rounded-none lg:bg-transparent lg:text-[#1f5c3d]">
            <GuideIcon name="document" className="h-6 w-6 lg:h-10 lg:w-10" />
          </span>
          <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-8">
            <p className="text-[14px] font-semibold uppercase tracking-[0.02em] text-[#0e2b20] lg:shrink-0 lg:text-[15px]">{data.note.title}</p>
            <ul className="mt-1.5 flex flex-col gap-2 lg:mt-0 lg:flex-1 lg:flex-row lg:gap-0">
              {data.note.items.map((it) => (
                <li
                  key={it.text}
                  className="border-l border-black/15 pl-3 text-[13px] leading-[1.5] text-[#2a2a2a] sm:text-[14px] lg:flex-1 lg:border-l-0 lg:px-8 lg:[&:not(:first-child)]:border-l"
                >
                  <Tagged item={it} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
