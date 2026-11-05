import Image from "next/image";
import Link from "next/link";
import GuideIcon, { Arrow } from "@/components/guide-home/GuideIcon";
import { BODY, BODY_SM, CONTAINER, H2, H6, ICON_LG, ICON_SM, SMALL, STAT_LG } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens. The photos fade into the
// page through CSS masks; at night the misty white sky the day photos were shot with is masked away
// as well (and the photo dimmed a touch), so only the car and road show against the green page.

const pad = (n) => String(n).padStart(2, "0");

// desktop photo: left edge into the page by day; night adds the bottom edge
const FADE_DESKTOP =
  "[mask-image:linear-gradient(to_right,transparent,#000_24%)] dark:[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.6)_26%,#000_48%),linear-gradient(to_bottom,transparent,#000_18%,#000_70%,transparent)] dark:[mask-composite:intersect]";
// phone / tablet backdrops sit behind the heading: night masks out their white sky (top) too
const SKY_FADE =
  "dark:[mask-image:linear-gradient(to_right,transparent,#000_30%),linear-gradient(to_bottom,transparent_38%,#000_72%)] dark:[mask-composite:intersect]";

const VERDICT = {
  watch: { icon: "alert", tone: "text-lr-warn" },
  scrap: { icon: "x-circle", tone: "text-lr-bad" },
  safe: { icon: "check-circle", tone: "text-lr-good" },
};

// matrix grid: compact 4-column table on phones, roomier from sm, desktop widths from lg
const COLS =
  "grid-cols-[minmax(0,1.25fr)_minmax(0,0.82fr)_minmax(0,0.82fr)_minmax(0,1.5fr)] sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.4fr)] lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.55fr)]";

function Panel({ icon, title, className = "", children }) {
  return (
    <div className={`overflow-hidden rounded-md border border-lr-line bg-lr-card shadow-[0_10px_28px_-18px_var(--lr-shadow)] ${className}`}>
      <h3 className={`${H6} flex items-center gap-4 bg-lr-brand px-5 py-3.5 uppercase tracking-[0.04em] text-lr-on-brand sm:px-7 lg:py-4`}>
        <GuideIcon name={icon} className={ICON_SM} />
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
      <div className={`grid ${COLS} items-end gap-x-1.5 border-b border-lr-line px-2.5 py-3 text-[10px] hyphens-auto font-medium uppercase leading-tight tracking-[0.02em] text-lr-head sm:gap-x-4 sm:px-6 sm:text-[12px] lg:px-8 lg:text-[13px] xl:text-[15px]`}>
        {matrix.columns.map((c, i) => (
          <span key={c} className={i === 1 || i === 2 ? "text-center lg:text-left" : i === 3 ? "pl-6 sm:pl-9 lg:pl-[66px] xl:pl-[56px]" : ""}>
            {c}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-lr-line px-2.5 sm:px-6 lg:px-8">
        {matrix.rows.map((r) => {
          const v = VERDICT[r.verdict];
          return (
            <li key={r.name} className={`grid ${COLS} items-center gap-x-1.5 py-3 sm:gap-x-4 sm:py-3.5 lg:py-2.5`}>
              <span className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-4 lg:gap-4">
                <span className="relative h-[32px] w-[56px] shrink-0 sm:h-[46px] sm:w-[78px] lg:h-[50px] lg:w-[86px] xl:h-[44px] xl:w-[72px]">
                  <Image src={r.image} alt={r.name} fill className="object-contain" sizes="(min-width: 1024px) 94px, (min-width: 640px) 78px, 56px" />
                </span>
                <span className="min-w-0 text-[12px] font-medium leading-[1.3] text-lr-head sm:text-[14px] sm:leading-snug lg:text-[15px] xl:text-[16px]">
                  {r.name}
                  {r.sub ? <span className="block font-normal">{r.sub}</span> : null}
                </span>
              </span>
              <span className="border-l border-lr-line py-1 text-center text-[11.5px] leading-snug text-lr-head sm:text-[14px] lg:py-3 lg:pl-5 lg:text-left lg:text-[15px] xl:pl-4 xl:text-[16px]">
                <Range value={r.value} />
              </span>
              <span className="border-l border-lr-line py-1 text-center text-[11.5px] leading-snug text-lr-head sm:text-[14px] lg:py-3 lg:pl-5 lg:text-left lg:text-[15px] xl:pl-4 xl:text-[16px]">
                <Range value={r.cost} />
              </span>
              <span className="flex items-start gap-1 border-l border-lr-line py-1 pl-1.5 sm:gap-3 sm:pl-4 lg:pl-6 xl:pl-4">
                <span className={`shrink-0 ${v.tone}`}>
                  <GuideIcon name={v.icon} tone="current" className={ICON_SM} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[11px] font-semibold uppercase leading-tight sm:text-[14px] xl:text-[15px] ${v.tone}`}>{r.label}</span>
                  <span className="mt-0.5 block text-[10.5px] leading-[1.35] text-lr-body sm:text-[12.5px] xl:text-[15px]">{r.note}</span>
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
        <span className={`${STAT_LG} w-[30%] shrink-0 text-center text-lr-ink xl:w-[26%]`}>{rule.figure}</span>
        <span className="self-stretch border-l border-lr-gold-line/70" aria-hidden="true" />
        <p className={`${BODY_SM} text-lr-body`}>{rule.text}</p>
      </div>
    </Panel>
  );
}

function Links({ links }) {
  return (
    <Panel icon="book" title={links.title}>
      <ol className="divide-y divide-lr-line px-4 py-1 sm:px-7">
        {links.items.map((l, i) => (
          <li key={l.label}>
            <Link href={l.href} className="group flex items-center gap-4 py-2.5 font-normal sm:gap-6 sm:py-3">
              <span className={`${SMALL} flex h-8 w-9 shrink-0 items-center justify-center rounded-[4px] bg-lr-brand font-medium text-lr-on-brand sm:h-9 sm:w-10`}>{pad(i + 1)}</span>
              <span className={`${BODY_SM} min-w-0 flex-1 font-medium text-lr-head group-hover:text-lr-green`}>{l.label}</span>
              <Arrow className="h-5 w-5 shrink-0 text-lr-head transition-transform group-hover:translate-x-0.5" />
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
          <span className="whitespace-nowrap text-lr-green">{item.tag}</span>
        </>
      ) : null}
    </>
  );
}

export default function HomeEconomics({ data }) {
  const [h1, h2] = data.h2.split("|");

  return (
    <section lang="en-GB" className="relative overflow-hidden bg-lr-page text-lr-head">
      {/* desktop: photo across the top right, faded into the page on its left edge (mask, not a tint) */}
      <div
        className={`absolute right-0 top-0 hidden h-[286px] w-[60%] xl:block xl:h-[300px] ${FADE_DESKTOP}`}
        aria-hidden="true"
      >
        <Image src={data.image} alt="" fill quality={90} className="object-cover object-[70%_50%] dark:brightness-[0.82]" sizes="60vw" />
      </div>

      <div className={`${CONTAINER} relative pb-10 pt-9 lg:pb-14 lg:pt-10`}>
        <div className="relative">
          {/* phones / tablets: the photo is a backdrop behind the whole heading block, as in the mobile design -
              soft sky behind the heading, the car bottom-right beside the paragraph (never under it), and the
              left edge fading into the page through a mask (no tint on the car) */}
          {/* phones: tighter crop so the car is larger - sized to fill the gap between the paragraph and the screen edge */}
          <div
            className={`pointer-events-none absolute -right-[33px] bottom-0 aspect-[1050/1105] w-[56%] [mask-image:linear-gradient(to_right,transparent,#000_8%)] min-[480px]:hidden ${SKY_FADE}`}
            aria-hidden="true"
          >
            <Image src={data.phoneImage} alt="" fill quality={90} className="object-cover dark:brightness-[0.82]" sizes="62vw" />
          </div>
          <div
            className={`pointer-events-none absolute -right-7 bottom-0 hidden aspect-[1460/1536] w-[60%] [mask-image:linear-gradient(to_right,transparent,#000_34%)] min-[480px]:block sm:-right-4 md:-right-8 xl:hidden ${SKY_FADE}`}
            aria-hidden="true"
          >
            <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover dark:brightness-[0.82]" sizes="60vw" />
          </div>

          <h2 className={`${H2} relative text-balance`}>
            {h1}
            <br />
            <span className="text-lr-ink">{h2}</span>
          </h2>

          <p className={`${BODY} relative mt-3 w-[52%] text-lr-body min-[480px]:w-[48%] sm:w-[44%] lg:mt-5 xl:w-auto xl:max-w-[560px]`}>
            {data.subhead}
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:mt-8 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-5">
          <Matrix matrix={data.matrix} />
          <div className="grid gap-4 lg:grid-cols-2 xl:flex xl:flex-col">
            <Rule rule={data.rule} />
            <Links links={data.links} />
          </div>
        </div>

        {/* data note */}
        <div className="mt-4 flex gap-4 rounded-md border border-lr-line bg-lr-panel px-4 py-4 sm:gap-6 sm:px-6 lg:mt-5 lg:items-center lg:px-9 lg:py-5">
          <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-lr-brand text-lr-on-brand lg:h-auto lg:w-auto lg:rounded-none lg:bg-transparent lg:text-lr-green">
            <GuideIcon name="document" className={ICON_LG} />
          </span>
          <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-8">
            <p className={`${SMALL} font-semibold uppercase tracking-[0.02em] text-lr-ink lg:shrink-0`}>{data.note.title}</p>
            <ul className="mt-1.5 flex flex-col gap-2 lg:mt-0 lg:flex-1 lg:flex-row lg:gap-0">
              {data.note.items.map((it) => (
                <li
                  key={it.text}
                  className={`${BODY_SM} border-l border-lr-line-strong pl-3 text-lr-body lg:flex-1 lg:border-l-0 lg:px-8 lg:[&:not(:first-child)]:border-l`}
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
