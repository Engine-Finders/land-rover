import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { serif } from "@/lib/guideFonts";

// Two palettes from one markup, as in the references: dark on phones / tablets, light from xl.
const THEME = [
  "[--mi-bg:#0b100e] [--mi-card:#0e1512] [--mi-border:rgba(255,255,255,0.13)] [--mi-head:#0f2219]",
  "[--mi-text:#f2f2ef] [--mi-muted:rgba(242,242,239,0.72)] [--mi-line:rgba(255,255,255,0.1)]",
  "[--mi-tag:#7fc49b] [--mi-accent:#8fbf9a] [--mi-bar:#4fae7e] [--mi-track:rgba(255,255,255,0.12)]",
  "[--mi-rank:#151d19] [--mi-rank-border:rgba(255,255,255,0.35)] [--mi-soft:rgba(79,174,126,0.12)]",
  "xl:[--mi-bg:#f7f7f5] xl:[--mi-card:#ffffff] xl:[--mi-border:rgba(0,0,0,0.07)] xl:[--mi-head:#0e2b20]",
  "xl:[--mi-text:#141414] xl:[--mi-muted:#4a4a4a] xl:[--mi-line:rgba(0,0,0,0.08)]",
  "xl:[--mi-tag:#1f5c3d] xl:[--mi-accent:#0e2b20] xl:[--mi-bar:#0e2b20] xl:[--mi-track:#e5e8e4]",
  "xl:[--mi-rank:#141414] xl:[--mi-rank-border:transparent] xl:[--mi-soft:#e6eee8]",
].join(" ");

const MEDAL = ["bg-[#c9963f] border-transparent", "bg-[#9aa0a6] border-transparent", "bg-[#7a4520] border-transparent"];

const SEVERITY = {
  catastrophic: { label: "Catastrophic", icon: "text-[#e04a3c]", pill: "border-[#8a2420] bg-[#3b1210] text-[#ff8a7e] xl:border-transparent xl:bg-[#fde9e7] xl:text-[#c0281c]", dot: "bg-[#e04a3c]" },
  monitor: { label: "Monitor", icon: "text-[#e0a32a]", pill: "border-[#8a6416] bg-[#3a2b0c] text-[#f3c766] xl:border-transparent xl:bg-[#fdf3df] xl:text-[#a86d0e]", dot: "bg-[#d99a1c]" },
};

function Card({ icon, title, sub, action, danger = false, className = "", children }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-(--mi-border) bg-(--mi-card) shadow-[0_10px_28px_-18px_rgba(0,0,0,0.5)] ${className}`}>
      <div className={`flex items-center gap-3.5 border-b border-(--mi-border) px-4 py-3 text-white sm:px-5 xl:border-transparent ${danger ? "bg-[#4a1310] xl:bg-[#7a1a14]" : "bg-(--mi-head)"}`}>
        <span className={danger ? "text-[#ff7b6e] xl:text-[#ffb3a9]" : ""}>
          <GuideIcon name={icon} className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[14px] font-medium uppercase tracking-[0.04em] sm:text-[15px] xl:text-[14px] xl:tracking-[0.02em]">{title}</span>
          {sub ? <span className="mt-0.5 block text-[11px] uppercase tracking-[0.03em] text-white/75 sm:text-[12px]">{sub}</span> : null}
        </span>
        {action ? (
          <Link href={action.href} className="hidden shrink-0 items-center gap-1.5 text-[12.5px] text-white/90 hover:text-white 2xl:inline-flex">
            {action.label} <Arrow className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
      {children}
      {action ? (
        <Link href={action.href} className="mt-auto flex items-center justify-center gap-2 border-t border-(--mi-line) py-3 text-[15px] text-(--mi-tag) hover:underline 2xl:hidden">
          {action.label} <Arrow className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function Rank({ n }) {
  return (
    <span
      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border text-[13px] font-medium text-white sm:h-8 sm:w-8 sm:text-[14px] ${
        MEDAL[n - 1] ?? "border-(--mi-rank-border) bg-(--mi-rank)"
      }`}
    >
      {n}
    </span>
  );
}

function Count({ value, tag }) {
  return (
    <span className="shrink-0 text-right leading-tight">
      <span className="block text-[17px] font-medium text-(--mi-text) sm:text-[18px]">{value.toLocaleString("en-GB")}</span>
      <span className="block text-[9.5px] tracking-[0.02em] text-(--mi-tag) sm:text-[10px]">{tag}</span>
    </span>
  );
}

function Engines({ data, tag }) {
  const max = Math.max(...data.items.map((i) => i.count));
  return (
    <Card icon="engine" title={data.title} action={data.cta}>
      <ol className="divide-y divide-(--mi-line) px-4 sm:px-5">
        {data.items.map((e, i) => (
          <li key={e.code}>
            <Link href={e.href} className="flex items-center gap-3 py-2.5 sm:gap-4">
              <Rank n={i + 1} />
              <span className="relative h-9 w-10 shrink-0 sm:h-10 sm:w-11">
                <Image src={data.image} alt="" fill className="object-contain" sizes="44px" />
              </span>
              <span className="w-[92px] min-w-0 shrink-0 leading-tight sm:w-[104px]">
                <span className="block text-[14.5px] font-semibold text-(--mi-text)">{e.code}</span>
                <span className="block text-[12.5px] text-(--mi-muted)">{e.name}</span>
              </span>
              <span className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-(--mi-track)" aria-hidden="true">
                <span className="block h-full rounded-full bg-(--mi-bar)" style={{ width: `${(e.count / max) * 100}%` }} />
              </span>
              <Count value={e.count} tag={tag} />
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function Models({ data, tag }) {
  return (
    <Card icon="car" title={data.title} action={data.cta}>
      <ol className="divide-y divide-(--mi-line) px-4 sm:px-5">
        {data.items.map((m, i) => (
          <li key={m.name}>
            <Link href={m.href} className="flex items-center gap-3 py-2 sm:gap-4">
              <Rank n={i + 1} />
              <span className="relative h-10 w-[66px] shrink-0 sm:h-11 sm:w-[74px]">
                <Image src={m.image} alt={m.name} fill className="object-contain" sizes="74px" />
              </span>
              <span className="min-w-0 flex-1 text-[14px] font-medium leading-snug text-(--mi-text) sm:text-[15px]">{m.name}</span>
              <Count value={m.count} tag={tag} />
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function Costs({ data, image }) {
  return (
    <Card icon="pound" title={data.title} sub={data.sub}>
      <ul className="divide-y divide-(--mi-line) px-4 sm:px-5">
        {data.items.map((c) => (
          <li key={c.code} className="flex items-center gap-3 py-3 sm:gap-4">
            <span className="relative h-10 w-11 shrink-0">
              <Image src={image} alt="" fill className="object-contain" sizes="44px" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[14.5px] font-semibold text-(--mi-text)">{c.code}</span>
              <span className="block text-[12.5px] text-(--mi-muted)">{c.name}</span>
            </span>
            <span className="shrink-0 text-[15px] font-semibold text-(--mi-tag) sm:text-[16px] xl:text-[#141414]">{c.range}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Risks({ data }) {
  return (
    <Card icon="alert" title={data.title} danger>
      <ul className="divide-y divide-(--mi-line) px-4 sm:px-5 xl:px-4">
        {data.items.map((r) => {
          const s = SEVERITY[r.severity];
          return (
            <li key={r.title} className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 py-3 sm:grid-cols-[auto_auto_minmax(0,1.2fr)_auto_minmax(0,1fr)] sm:gap-x-4 xl:gap-x-3">
              <span className={`row-span-2 sm:row-span-1 ${s.icon}`}>
                <GuideIcon name="alert" className="h-7 w-7 xl:h-6 xl:w-6" />
              </span>
              <span className="relative row-span-2 h-10 w-11 sm:row-span-1 xl:h-9 xl:w-9">
                <Image src={r.image} alt="" fill className="object-contain" sizes="44px" />
              </span>
              <span className="text-[14px] font-semibold leading-snug text-(--mi-text) xl:text-[13px]">
                {r.title}
                {r.sub ? <span className="block font-normal">{r.sub}</span> : null}
              </span>
              <span className="col-start-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:contents">
                <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] uppercase tracking-[0.03em] xl:px-2 xl:text-[10px] ${s.pill}`}>
                  <span className={`hidden h-1.5 w-1.5 rounded-full xl:inline-block ${s.dot}`} />
                  {s.label}
                </span>
                <span className="text-[12.5px] leading-snug text-(--mi-muted) xl:text-[11.5px]">{r.note}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Feed({ data }) {
  return (
    <Card icon="broadcast" title={<>{data.title} <span className="ml-2 hidden text-[12px] normal-case tracking-normal text-white/75 xl:inline">{data.sub}</span></>}>
      <ul className="relative px-4 py-1 sm:px-5">
        {/* timeline rail */}
        <span className="absolute bottom-5 left-[19px] top-5 w-px bg-(--mi-tag)/40 sm:left-[23px]" aria-hidden="true" />
        {data.items.map((f) => (
          <li key={f.vehicle} className="relative flex items-center gap-3 border-b border-(--mi-line) py-2.5 pl-4 last:border-b-0 xl:grid xl:grid-cols-[auto_minmax(0,1.45fr)_minmax(76px,0.8fr)_minmax(0,1.3fr)_auto] xl:gap-4">
            <span className="absolute left-[2px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-(--mi-tag) sm:left-[4px]" aria-hidden="true" />
            <span className="relative h-8 w-[52px] shrink-0 sm:h-9 sm:w-[58px]">
              <Image src={f.image} alt="" fill className="object-contain" sizes="58px" />
            </span>
            <span className="min-w-0 flex-1 leading-snug xl:contents">
              <span className="block text-[14px] text-(--mi-text) xl:text-[12.5px]">{f.vehicle}</span>
              <span className="block text-[12px] text-(--mi-muted) xl:hidden">
                {f.place} <span aria-hidden="true">•</span> {f.issue}
              </span>
              <span className="hidden text-[12.5px] text-(--mi-text) xl:block">{f.place}</span>
              <span className="hidden text-[12.5px] leading-snug text-(--mi-text) xl:block">{f.issue}</span>
            </span>
            <span className="shrink-0 text-[12px] text-(--mi-muted) xl:flex xl:items-center xl:gap-3 xl:text-[12.5px] xl:text-(--mi-text)">
              {f.when}
              <span className="hidden h-1.5 w-1.5 rounded-full bg-(--mi-text) xl:inline-block" aria-hidden="true" />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Insights({ data }) {
  return (
    <Card icon="trend" title={data.title}>
      <ul className="divide-y divide-(--mi-line) px-4 sm:px-5">
        {data.items.map((it, i) => (
          <li key={it.text} className="flex items-center gap-4 py-4 sm:gap-5">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-(--mi-border) sm:h-16 sm:w-16 ${
                i === 0 ? "bg-(--mi-soft) text-(--mi-tag) xl:text-[#0e2b20]" : "bg-[#c9963f]/15 text-[#e6c07a] xl:bg-[#f6ead2] xl:text-[#0e2b20]"
              }`}
            >
              <GuideIcon name={it.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <span className="text-[14px] leading-[1.55] text-(--mi-text) xl:text-[13px]">{it.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function HomeMarket({ data }) {
  const [a, b, c] = data.h2.split("|");

  return (
    <section lang="en-GB" className={`relative overflow-hidden bg-(--mi-bg) text-(--mi-text) ${THEME}`}>
      {/* desktop: light studio photo across the top right, left edge fading into the page */}
      <div
        className="absolute right-0 top-0 hidden h-[300px] w-[50%] [mask-image:linear-gradient(to_right,transparent,#000_28%)] xl:block 2xl:h-[330px] 2xl:w-[58%]"
        aria-hidden="true"
      >
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[60%_50%]" sizes="58vw" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 pb-10 pt-9 sm:px-6 lg:px-12 lg:pb-14 lg:pt-10 xl:px-[62px]">
        <div className="relative">
          <h2 className={`${serif.className} relative px-1 text-[clamp(30px,8.6vw,56px)] leading-[1.06] xl:text-[46px] 2xl:text-[56px] tracking-[-0.01em] sm:px-0`}>
            {a} <br className="xl:hidden" />
            {b}
            <br />
            <span className="text-(--mi-accent)">{c}</span>
          </h2>
          <p className="relative mt-3 px-1 text-[14px] leading-[1.6] text-(--mi-muted) sm:max-w-[620px] sm:px-0 sm:text-[15.5px] lg:mt-4 xl:max-w-[500px] xl:text-[15px] 2xl:max-w-[540px]">
            {data.subhead}
          </p>
        </div>

        {/* phones / tablets: the car gets its own full-width band under the intro (text never sits on it);
            top and bottom edges fade into the dark page through a mask */}
        <div
          className="relative -mx-3 mt-2 aspect-[1022/710] [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)] sm:-mx-6 sm:aspect-[16/7] lg:-mx-12 xl:hidden"
          aria-hidden="true"
        >
          <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover object-[50%_58%]" sizes="100vw" />
        </div>

        <div className="mt-2 grid gap-3.5 md:grid-cols-2 lg:mt-4 xl:mt-8 xl:grid-cols-[minmax(0,1.07fr)_minmax(0,0.98fr)_minmax(0,0.93fr)] xl:gap-5">
          <Engines data={data.engines} tag={data.tag} />
          <Models data={data.models} tag={data.tag} />
          <Costs data={data.costs} image={data.engines.image} />
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-2 xl:mt-4 xl:gap-5 2xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1.25fr)_minmax(0,0.7fr)]">
          <div className="lg:col-span-2 2xl:col-span-1">
            <Risks data={data.risks} />
          </div>
          <Feed data={data.feed} />
          <Insights data={data.insights} />
        </div>

        {/* data note */}
        <div className="mt-3.5 rounded-lg border border-(--mi-border) bg-(--mi-card) px-4 py-4 sm:px-6 xl:mt-4 xl:flex xl:items-center xl:gap-0 xl:rounded-md xl:border-transparent xl:bg-[#0e2b20] xl:py-4 xl:text-white">
          <div className="flex items-center gap-3.5 border-b border-(--mi-line) pb-3 xl:border-0 xl:pb-0">
            <span className="text-[#c9963f]">
              <GuideIcon name="database" className="h-8 w-8" />
            </span>
            <p className="text-[13.5px] leading-snug text-(--mi-text) xl:text-white 2xl:whitespace-nowrap">
              <span className="mr-2 font-semibold uppercase text-[#c9963f] sm:mr-5">{data.note.title}</span>
              {data.note.text}
            </p>
          </div>
          <dl className="mt-3 grid grid-cols-3 divide-x divide-(--mi-line) text-center xl:ml-6 xl:mt-0 xl:flex xl:divide-white/25">
            {data.note.stats.map((s) => (
              <div key={s.label} className="px-2 xl:flex xl:gap-1.5 xl:whitespace-nowrap xl:px-5 xl:text-[14px] 2xl:px-6">
                <dt className="text-[12.5px] text-(--mi-muted) xl:text-[14px] xl:text-white">{s.label}:</dt>
                <dd className="mt-0.5 text-[15px] text-(--mi-tag) xl:mt-0 xl:text-[14px] xl:text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
