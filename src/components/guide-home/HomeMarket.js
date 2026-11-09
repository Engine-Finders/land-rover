import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import SectionQuoteCta from "@/components/shared/SectionQuoteCta";
import { HOME_CTA } from "@/lib/ctaCopy";
import { BODY, BODY_SM, CONTAINER, H2, ICON_LG, ICON_MD, SMALL } from "@/lib/typeScale";

// Follows the site theme (day / night). The section's local palette (--mi-*) maps onto the site's
// --lr-* tokens, so every card follows the navbar day / night button; only the bar fill and the plain
// rank discs take a different token at night. The medal discs (gold / silver / bronze), the red risk
// header and the severity pills keep their own colours, with a night pair where needed.
const THEME = [
  "[--mi-bg:var(--lr-page)] [--mi-card:var(--lr-card)] [--mi-border:var(--lr-line)] [--mi-head:var(--lr-brand)]",
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

// "View all engines" -> "View all" where the header is too narrow for the full label
const shortLabel = (label = "") => label.split(" ").slice(0, 2).join(" ");

// card: dark header (icon, title, optional sub-line and the "View all" link on the right, as in the
// reference); on phones / tablets and 1280-1439px laptops (three narrow cards across, where the link would
// push the title onto two lines) that link sits under the list instead. Lists fill the card,
// so cards side by side end on the same line.
function Card({ icon, title, sub, action, danger = false, className = "", children }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-(--mi-border) bg-(--mi-card) shadow-[0_10px_28px_-18px_var(--lr-shadow)] ${className}`}>
      <div className={`lr-on-brand flex items-center gap-3 px-4 py-3 text-lr-on-brand sm:px-5 xl:min-h-[54px] xl:gap-3.5 xl:py-2.5 ${danger ? "bg-[#7a1a14] dark:bg-[#5a1712]" : "bg-(--mi-head)"}`}>
        <span className={`shrink-0 ${danger ? "text-[#ffb3a9] dark:text-[#ff8a7e]" : ""}`}>
          <GuideIcon name={icon} tone={danger ? "current" : undefined} className={ICON_MD} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[15px] font-medium uppercase tracking-[0.02em] xl:max-2xl:text-[14px] 2xl:max-[1679px]:text-[15px] min-[1680px]:text-[16px]">{title}</span>
          {sub ? <span className="mt-0.5 block text-[12px] uppercase tracking-[0.03em] text-lr-on-brand/75 2xl:text-[13px]">{sub}</span> : null}
        </span>
        {action ? (
          <Link href={action.href} className="hidden shrink-0 items-center gap-1.5 text-[13px] font-normal text-lr-on-brand/90 hover:text-lr-on-brand hover:underline lg:flex xl:max-[1439px]:hidden! 2xl:text-[14px]">
            <span className="min-[1680px]:hidden">{shortLabel(action.label)}</span>
            <span className="hidden min-[1680px]:inline">{action.label}</span>
            <Arrow className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      {children}
      {action ? (
        <Link href={action.href} className="mt-auto flex items-center justify-center gap-2 border-t border-(--mi-line) py-3 text-[15px] font-normal text-(--mi-tag) hover:underline lg:hidden xl:max-[1439px]:flex!">
          {action.label} <Arrow className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

// rank disc: gold / silver / bronze for the top three engines; the model list uses plain discs throughout
function Rank({ n, plain = false }) {
  return (
    <span
      className={`${SMALL} flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border font-medium text-lr-on-brand sm:h-8 sm:w-8 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 ${
        (!plain && MEDAL[n - 1]) || "border-(--mi-rank-border) bg-(--mi-rank)"
      }`}
    >
      {n}
    </span>
  );
}

function Count({ value, tag }) {
  return (
    <span className="shrink-0 text-right leading-tight">
      <span className="block text-[17px] font-semibold leading-tight text-(--mi-text) 2xl:text-[19px]">{value.toLocaleString("en-GB")}</span>
      <span className="block text-[9.5px] tracking-[0.02em] text-(--mi-tag) sm:text-[10px] 2xl:text-[11px]">{tag}</span>
    </span>
  );
}

// list that fills its card: rows share the spare height, so neighbouring cards end level
const LIST = "flex flex-1 flex-col divide-y divide-(--mi-line) px-4 sm:px-5";
const ROW = "flex flex-1";

function Engines({ data, tag }) {
  const max = Math.max(...data.items.map((i) => i.count));
  return (
    <Card icon="engine" title={data.title} action={data.cta}>
      <ol className={LIST}>
        {data.items.map((e, i) => (
          <li key={e.code} className={ROW}>
            <Link href={e.href} className="flex w-full items-center gap-3 py-2.5 font-normal sm:gap-4 xl:gap-3 2xl:gap-4">
              <Rank n={i + 1} />
              <span className="relative h-9 w-10 shrink-0 sm:h-10 sm:w-11 xl:w-9 2xl:w-11">
                <Image src={data.image} alt="" fill className="object-contain" sizes="44px" />
              </span>
              <span className="w-[92px] min-w-0 shrink-0 leading-tight sm:w-[104px] xl:w-[88px] 2xl:w-[110px]">
                <span className={`${BODY_SM} block font-semibold leading-tight text-(--mi-text) xl:text-[15px]!`}>{e.code}</span>
                <span className={`${SMALL} block text-(--mi-muted) xl:text-[13px]!`}>{e.name}</span>
              </span>
              <span className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full bg-(--mi-track)" aria-hidden="true">
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
      <ol className={LIST}>
        {data.items.map((m, i) => (
          <li key={m.name} className={ROW}>
            <Link href={m.href} className="flex w-full items-center gap-3 py-2 font-normal max-[359px]:gap-2 sm:gap-4 xl:gap-3 2xl:gap-4">
              <Rank n={i + 1} plain />
              <span className="relative h-10 w-[66px] shrink-0 max-[359px]:w-[50px] sm:h-11 sm:w-[74px] xl:w-[62px] 2xl:w-[74px]">
                <Image src={m.image} alt={m.name} fill className="object-contain" sizes="74px" />
              </span>
              <span className={`${BODY_SM} min-w-0 flex-1 font-medium leading-snug text-(--mi-text) xl:text-[14.5px]! 2xl:text-[15.5px]!`}>{m.name}</span>
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
      <ul className={LIST}>
        {data.items.map((c) => (
          <li key={c.code} className="flex flex-1 items-center gap-3 py-3 max-[359px]:gap-2 sm:gap-4 xl:gap-3 2xl:gap-4">
            <span className="relative h-10 w-11 shrink-0 max-[359px]:w-9 xl:w-9 2xl:w-11">
              <Image src={image} alt="" fill className="object-contain" sizes="44px" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className={`${BODY_SM} block font-semibold leading-tight text-(--mi-text) xl:text-[15px]!`}>{c.code}</span>
              <span className={`${SMALL} block text-(--mi-muted) [overflow-wrap:anywhere] xl:text-[13px]!`}>{c.name}</span>
            </span>
            {/* a short divider before the price, as in the reference */}
            <span className="h-8 w-px shrink-0 bg-(--mi-line)" aria-hidden="true" />
            <span className="w-[46%] shrink-0 text-right text-[17px] font-semibold leading-tight text-(--mi-text) max-[359px]:w-[42%] max-[359px]:text-[15px] sm:w-[42%] 2xl:text-[19px]">{c.range}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// phones, and the narrow one-third card on 1280-1535px laptops: severity and note under the title;
// tablets and wide laptops: everything on one line
function Risks({ data, className = "" }) {
  return (
    <Card icon="alert" title={data.title} danger className={className}>
      <ul className={`${LIST} xl:px-4`}>
        {data.items.map((r) => {
          const s = SEVERITY[r.severity];
          return (
            <li
              key={r.title}
              className="grid flex-1 grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 py-3 sm:grid-cols-[auto_auto_minmax(0,1.2fr)_auto_minmax(0,1fr)] sm:gap-x-4 xl:grid-cols-[auto_auto_minmax(0,1fr)] xl:gap-x-3 2xl:grid-cols-[auto_auto_minmax(0,1.35fr)_auto_minmax(0,1fr)] 2xl:gap-x-2.5"
            >
              <span className={`row-span-2 sm:row-span-1 xl:row-span-2 2xl:row-span-1 ${s.icon}`}>
                <GuideIcon name="alert" tone="current" className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </span>
              <span className="relative row-span-2 h-10 w-11 sm:row-span-1 xl:row-span-2 xl:h-9 xl:w-9 2xl:row-span-1 2xl:h-10 2xl:w-10">
                <Image src={r.image} alt="" fill className="object-contain" sizes="44px" />
              </span>
              <span className={`${BODY_SM} font-semibold leading-snug text-(--mi-text) xl:text-[14px]! 2xl:text-[13.5px]!`}>
                {r.title}
                {r.sub ? <span className="block font-normal">{r.sub}</span> : null}
              </span>
              <span className="col-start-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:contents xl:flex 2xl:contents">
                <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2 py-[3px] text-[11px] uppercase tracking-[0.03em] sm:text-[12px] xl:text-[11px] 2xl:px-1.5 2xl:text-[10.5px] ${s.pill}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
                <span className={`${SMALL} text-(--mi-muted) xl:text-[12.5px]! xl:leading-snug 2xl:text-[12px]!`}>{r.note}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// timeline of the latest enquiries: compact two-line rows until the card is wide enough (1536px) for
// vehicle / place / issue / time in their own columns
function Feed({ data }) {
  return (
    <Card icon="broadcast" title={<>{data.title} <span className="ml-2 hidden text-[12.5px] font-normal normal-case tracking-normal text-lr-on-brand/75 xl:inline 2xl:text-[13px]">{data.sub}</span></>}>
      <ul className="relative flex flex-1 flex-col px-4 py-1 sm:px-5">
        {/* timeline rail */}
        <span className="absolute bottom-5 left-[19px] top-5 w-px bg-(--mi-tag)/40 sm:left-[23px]" aria-hidden="true" />
        {data.items.map((f) => (
          <li key={f.vehicle} className="relative flex flex-1 items-center gap-3 border-b border-(--mi-line) py-2.5 pl-4 last:border-b-0 2xl:grid 2xl:grid-cols-[auto_minmax(0,1.5fr)_minmax(80px,0.7fr)_minmax(0,1.3fr)_auto] 2xl:gap-3.5">
            <span className="absolute left-[2px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-(--mi-tag) sm:left-[4px]" aria-hidden="true" />
            <span className="relative h-8 w-[52px] shrink-0 sm:h-9 sm:w-[58px]">
              <Image src={f.image} alt="" fill className="object-contain" sizes="58px" />
            </span>
            <span className="min-w-0 flex-1 leading-snug 2xl:contents">
              <span className={`${BODY_SM} block leading-snug text-(--mi-text) xl:text-[14px]! 2xl:text-[13.5px]!`}>{f.vehicle}</span>
              <span className={`${SMALL} block text-(--mi-muted) xl:text-[13px]! 2xl:hidden`}>
                {f.place} <span aria-hidden="true">•</span> {f.issue}
              </span>
              <span className="hidden text-[13px] text-(--mi-text) 2xl:block">{f.place}</span>
              <span className="hidden text-[13px] leading-snug text-(--mi-text) 2xl:block">{f.issue}</span>
            </span>
            <span className={`${SMALL} flex shrink-0 items-center gap-2.5 text-(--mi-muted) xl:text-[13px]! 2xl:gap-3 2xl:text-(--mi-text)`}>
              {f.when}
              <span className="hidden h-1.5 w-1.5 rounded-full bg-(--mi-text) sm:inline-block" aria-hidden="true" />
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
      <ul className={LIST}>
        {data.items.map((it, i) => (
          <li key={it.text} className="flex flex-1 items-center gap-4 py-4 sm:gap-5 xl:gap-4 2xl:gap-5">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 ${
                i === 0 ? "bg-(--mi-soft) text-(--mi-tag)" : "bg-lr-gold-line/15 text-lr-gold"
              }`}
            >
              <GuideIcon name={it.icon} className={ICON_LG} />
            </span>
            <span className={`${BODY_SM} text-(--mi-text) xl:text-[14px]! xl:leading-[1.55]`}>{it.text}</span>
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

      <div className={`${CONTAINER} relative pb-6 pt-6 lg:pb-7 lg:pt-6`}>
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
        <div className="relative -mx-5 sm:-mx-6 mt-2 md:-mx-10 xl:hidden" aria-hidden="true">
          <div className={`relative aspect-[2/1] sm:aspect-[16/7] dark:hidden ${FADE_BAND}`}>
            <Image src={data.image} alt="" fill quality={90} className="object-cover object-[50%_60%]" sizes="100vw" />
          </div>
          <div className={`relative hidden aspect-[1022/710] sm:aspect-[16/7] dark:block ${FADE_BAND}`}>
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover object-[50%_58%]" sizes="100vw" />
          </div>
        </div>

        <div className="mt-2 grid gap-3.5 md:grid-cols-2 lg:mt-4 xl:mt-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)] xl:gap-4 2xl:gap-5">
          <Engines data={data.engines} tag={data.tag} />
          <Models data={data.models} tag={data.tag} />
          <Costs data={data.costs} image={data.engines.image} />
        </div>

        <SectionQuoteCta
          label={HOME_CTA.marketButton}
          supportText={HOME_CTA.marketSupport}
          className="border-(--mi-line) bg-(--mi-card,var(--lr-card))"
        />

        {/* lower row: risks full width over feed + insights on tablets; all three side by side from 1280px */}
        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-2 xl:mt-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.78fr)] xl:gap-4 2xl:gap-5">
          <Risks data={data.risks} className="lg:col-span-2 xl:col-span-1" />
          <Feed data={data.feed} />
          <Insights data={data.insights} />
        </div>

        {/* data note: a deep green bar in both themes - gold icon and label, light text and stats */}
        <div className="mt-3.5 rounded-lg border border-[#0c2a1f] bg-[#0c2a1f] px-4 py-4 text-white shadow-[0_14px_30px_-18px_rgba(6,24,17,0.55)] sm:px-6 xl:mt-4 xl:flex xl:items-center xl:rounded-md xl:px-7 xl:py-4 dark:border-lr-line dark:bg-[#0a1c15]">
          <div className="flex min-w-0 items-center gap-3.5 border-b border-white/15 pb-3 max-sm:flow-root xl:flex-1 xl:gap-5 xl:border-0 xl:pb-0">
            <span className="shrink-0 text-[#d4aa68] max-sm:float-left max-sm:mb-1 max-sm:mr-3 max-sm:mt-0.5">
              <GuideIcon name="database" tone="current" className={ICON_LG} />
            </span>
            <p className="min-w-0 text-[14px] leading-snug text-white/90 md:text-[15px] 2xl:text-[16px]">
              <span className="mr-2 font-semibold uppercase tracking-[0.02em] text-[#d4aa68] sm:mr-5">{data.note.title}</span>
              {data.note.text}
            </p>
          </div>
          <dl className="mt-3 grid grid-cols-3 divide-x divide-white/20 text-center xl:ml-4 xl:mt-0 xl:flex xl:shrink-0 xl:border-l xl:border-white/20">
            {data.note.stats.map((s) => (
              <div key={s.label} className="px-2 xl:flex xl:gap-1.5 xl:whitespace-nowrap xl:px-5 2xl:px-7">
                <dt className="text-[12.5px] text-white/70 xl:text-[15px] xl:text-white 2xl:text-[16px]">{s.label}:</dt>
                <dd className="mt-0.5 text-[15px] leading-snug text-white xl:mt-0 2xl:text-[16px]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
