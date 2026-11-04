import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { CONTAINER, H2, H6, BODY, BODY_SM, NUM, SMALL, LABEL } from "@/lib/typeScale";

// Follows the site theme (day / night). The section's local palette (--mi-*) maps onto the site's
// --lr-* tokens, so every card follows the navbar day / night button; only the bar fill and the plain
// rank discs take a different token at night. The medal discs (gold / silver / bronze), the red risk
// header and the severity pills keep their own colours, with a night pair where needed.
const THEME = [
  "[--mi-bg:var(--lr-band)] [--mi-card:var(--lr-card)] [--mi-border:var(--lr-line)] [--mi-head:var(--lr-brand)]",
  "[--mi-text:var(--lr-head)] [--mi-muted:var(--lr-body)] [--mi-line:var(--lr-line)]",
  "[--mi-tag:var(--lr-green)] [--mi-accent:var(--lr-green)] [--mi-bar:var(--lr-brand)] [--mi-track:var(--lr-line)]",
  "[--mi-rank:var(--lr-head)] [--mi-rank-border:transparent] [--mi-soft:var(--lr-chip)]",
  "dark:[--mi-bar:var(--lr-green)] dark:[--mi-rank:var(--lr-panel)] dark:[--mi-rank-border:var(--lr-line-strong)]",
].join(" ");

const MEDAL = ["bg-[#c9963f] border-transparent", "bg-[#9aa0a6] border-transparent", "bg-[#7a4520] border-transparent"];

const SEVERITY = {
  catastrophic: { label: "Catastrophic", icon: "text-lr-bad", pill: "border-transparent bg-[#fde9e7] text-[#c0281c] dark:border-[#8a2420] dark:bg-[#3b1210] dark:text-[#ff8a7e]", dot: "bg-[#e04a3c]" },
  monitor: { label: "Monitor", icon: "text-lr-warn", pill: "border-transparent bg-[#fdf3df] text-[#a86d0e] dark:border-[#8a6416] dark:bg-[#3a2b0c] dark:text-[#f3c766]", dot: "bg-[#d99a1c]" },
};

// desktop photo (top right): left edge into the page; at night the bottom edge too
const FADE_DESKTOP = "[mask-image:linear-gradient(to_right,transparent,#000_28%)]";
const FADE_DESKTOP_NIGHT =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.6)_22%,#000_40%),linear-gradient(to_bottom,transparent,#000_16%,#000_72%,transparent)] [mask-composite:intersect]";
// phone / tablet band under the intro: top and bottom edges into the page
const FADE_BAND = "[mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]";

function Card({ icon, title, sub, action, danger = false, className = "", children }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-(--mi-border) bg-(--mi-card) shadow-[0_10px_28px_-18px_var(--lr-shadow)] ${className}`}>
      <div className={`flex items-center gap-3.5 border-b border-transparent px-4 py-3 text-lr-on-brand sm:px-5 ${danger ? "bg-[#7a1a14] dark:bg-[#5a1712]" : "bg-(--mi-head)"}`}>
        <span className={danger ? "text-[#ffb3a9] dark:text-[#ff8a7e]" : ""}>
          <GuideIcon name={icon} className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className={`${H6} block uppercase tracking-[0.02em]`}>{title}</span>
          {sub ? <span className={`${LABEL} mt-0.5 block text-lr-on-brand/75`}>{sub}</span> : null}
        </span>
      </div>
      {children}
      {action ? (
        <Link href={action.href} className="mt-auto flex items-center justify-center gap-2 border-t border-(--mi-line) py-3 text-[15px] font-normal text-(--mi-tag) hover:underline">
          {action.label} <Arrow className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function Rank({ n }) {
  return (
    <span
      className={`${SMALL} flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border font-medium text-lr-on-brand sm:h-8 sm:w-8 xl:h-7 xl:w-7 ${
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
      <span className={`${NUM} block text-(--mi-text)`}>{value.toLocaleString("en-GB")}</span>
      <span className="block text-[9.5px] tracking-[0.02em] text-(--mi-tag) sm:text-[10px] xl:text-[15px]">{tag}</span>
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
            <Link href={e.href} className="flex items-center gap-3 py-2.5 font-normal sm:gap-4 xl:gap-3">
              <Rank n={i + 1} />
              <span className="relative h-9 w-10 shrink-0 sm:h-10 sm:w-11 xl:w-9">
                <Image src={data.image} alt="" fill className="object-contain" sizes="44px" />
              </span>
              <span className="w-[92px] min-w-0 shrink-0 leading-tight sm:w-[104px]">
                <span className={`${BODY_SM} block font-semibold leading-tight text-(--mi-text)`}>{e.code}</span>
                <span className={`${SMALL} block text-(--mi-muted)`}>{e.name}</span>
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
            <Link href={m.href} className="flex items-center gap-3 py-2 font-normal sm:gap-4 xl:gap-3">
              <Rank n={i + 1} />
              <span className="relative h-10 w-[66px] shrink-0 sm:h-11 sm:w-[74px] xl:w-[60px]">
                <Image src={m.image} alt={m.name} fill className="object-contain" sizes="74px" />
              </span>
              <span className={`${BODY_SM} min-w-0 flex-1 font-medium leading-snug text-(--mi-text)`}>{m.name}</span>
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
          <li key={c.code} className="flex items-center gap-3 py-3 sm:gap-4 xl:gap-3">
            <span className="relative h-10 w-11 shrink-0 xl:w-9">
              <Image src={image} alt="" fill className="object-contain" sizes="44px" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className={`${BODY_SM} block font-semibold leading-tight text-(--mi-text)`}>{c.code}</span>
              <span className={`${SMALL} block text-(--mi-muted)`}>{c.name}</span>
            </span>
            <span className={`${NUM} shrink-0 text-(--mi-text)`}>{c.range}</span>
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
              <span className={`${BODY_SM} font-semibold leading-snug text-(--mi-text)`}>
                {r.title}
                {r.sub ? <span className="block font-normal">{r.sub}</span> : null}
              </span>
              <span className="col-start-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:contents">
                <span className={`${SMALL} inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2.5 py-1 uppercase tracking-[0.03em] xl:px-2 ${s.pill}`}>
                  <span className={`hidden h-1.5 w-1.5 rounded-full xl:inline-block ${s.dot}`} />
                  {s.label}
                </span>
                <span className={`${SMALL} text-(--mi-muted)`}>{r.note}</span>
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
    <Card icon="broadcast" title={<>{data.title} <span className={`${SMALL} ml-2 hidden normal-case tracking-normal text-lr-on-brand/75 xl:inline`}>{data.sub}</span></>}>
      <ul className="relative px-4 py-1 sm:px-5">
        {/* timeline rail */}
        <span className="absolute bottom-5 left-[19px] top-5 w-px bg-(--mi-tag)/40 sm:left-[23px]" aria-hidden="true" />
        {data.items.map((f) => (
          <li key={f.vehicle} className="relative flex items-center gap-3 border-b border-(--mi-line) py-2.5 pl-4 last:border-b-0 xl:grid xl:grid-cols-[auto_minmax(0,1.4fr)_minmax(92px,0.8fr)_minmax(0,1.3fr)_auto] xl:gap-3.5">
            <span className="absolute left-[2px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-(--mi-tag) sm:left-[4px]" aria-hidden="true" />
            <span className="relative h-8 w-[52px] shrink-0 sm:h-9 sm:w-[58px]">
              <Image src={f.image} alt="" fill className="object-contain" sizes="58px" />
            </span>
            <span className="min-w-0 flex-1 leading-snug xl:contents">
              <span className={`${BODY_SM} block leading-snug text-(--mi-text)`}>{f.vehicle}</span>
              <span className={`${SMALL} block text-(--mi-muted) xl:hidden`}>
                {f.place} <span aria-hidden="true">•</span> {f.issue}
              </span>
              <span className={`${SMALL} hidden text-(--mi-text) xl:block`}>{f.place}</span>
              <span className={`${SMALL} hidden text-(--mi-text) xl:block`}>{f.issue}</span>
            </span>
            <span className={`${SMALL} shrink-0 text-(--mi-muted) xl:flex xl:items-center xl:gap-3 xl:text-(--mi-text)`}>
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
                i === 0 ? "bg-(--mi-soft) text-(--mi-tag)" : "bg-lr-gold-line/15 text-lr-gold"
              }`}
            >
              <GuideIcon name={it.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <span className={`${BODY_SM} text-(--mi-text)`}>{it.text}</span>
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
      {/* desktop: studio photo across the top right, left edge fading into the page - the light studio
          shot on the day theme, the same car in the dark studio at night */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
        <div className={`absolute right-0 top-0 h-[300px] w-[50%] dark:hidden ${FADE_DESKTOP}`}>
          <Image src={data.image} alt="" fill quality={90} className="object-cover object-[60%_50%]" sizes="58vw" />
        </div>
        <div className={`absolute right-0 top-0 hidden h-[300px] w-[50%] dark:block ${FADE_DESKTOP_NIGHT}`}>
          <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover object-[50%_45%]" sizes="58vw" />
        </div>
      </div>

      <div className={`${CONTAINER} relative pb-10 pt-9 lg:pb-14 lg:pt-10`}>
        <div className="relative">
          <h2 className={`${H2} relative text-balance`}>
            {a} <br className="xl:hidden" />
            {b}
            <br />
            <span className="text-(--mi-accent)">{c}</span>
          </h2>
          <p className={`${BODY} relative mt-3 text-(--mi-muted) sm:max-w-[620px] lg:mt-4 xl:max-w-[560px]`}>
            {data.subhead}
          </p>
        </div>

        {/* phones / tablets: the car gets its own full-width band under the intro (text never sits on it);
            top and bottom edges fade into the page through a mask. Day: the light studio shot (a wider band,
            so the whole car fits); night: the same car in the dark studio */}
        <div className="relative -mx-4 mt-2 md:-mx-8 xl:hidden" aria-hidden="true">
          <div className={`relative aspect-[2/1] sm:aspect-[16/7] dark:hidden ${FADE_BAND}`}>
            <Image src={data.image} alt="" fill quality={90} className="object-cover object-[50%_60%]" sizes="100vw" />
          </div>
          <div className={`relative hidden aspect-[1022/710] sm:aspect-[16/7] dark:block ${FADE_BAND}`}>
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover object-[50%_58%]" sizes="100vw" />
          </div>
        </div>

        <div className="mt-2 grid gap-3.5 md:grid-cols-2 lg:mt-4 xl:mt-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)] xl:gap-5">
          <Engines data={data.engines} tag={data.tag} />
          <Models data={data.models} tag={data.tag} />
          <Costs data={data.costs} image={data.engines.image} />
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-2 xl:mt-4 xl:gap-5">
          <div className="lg:col-span-2">
            <Risks data={data.risks} />
          </div>
          <Feed data={data.feed} />
          <Insights data={data.insights} />
        </div>

        {/* data note */}
        <div className="mt-3.5 rounded-lg border border-(--mi-border) bg-lr-panel px-4 py-4 sm:px-6 xl:mt-4 xl:flex xl:items-center xl:gap-0 xl:rounded-md xl:py-4">
          <div className="flex items-center gap-3.5 border-b border-(--mi-line) pb-3 xl:border-0 xl:pb-0">
            <span className="text-lr-gold">
              <GuideIcon name="database" className="h-8 w-8" />
            </span>
            <p className={`${BODY_SM} leading-snug text-(--mi-text)`}>
              <span className="mr-2 font-semibold uppercase text-lr-gold sm:mr-5">{data.note.title}</span>
              {data.note.text}
            </p>
          </div>
          <dl className="mt-3 grid grid-cols-3 divide-x divide-(--mi-line) text-center xl:ml-6 xl:mt-0 xl:flex xl:divide-lr-line-strong">
            {data.note.stats.map((s) => (
              <div key={s.label} className="px-2 xl:flex xl:gap-1.5 xl:whitespace-nowrap xl:px-5">
                <dt className={`${SMALL} text-(--mi-muted)`}>{s.label}:</dt>
                <dd className="mt-0.5 text-[15px] leading-snug text-(--mi-tag) xl:mt-0">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
