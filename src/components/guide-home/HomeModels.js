import Image from "next/image";
import Link from "next/link";
import GuideIcon from "@/components/guide-home/GuideIcon";
import LandRoverLogo from "@/components/guide-home/LandRoverLogo";
import { CONTAINER, H2, H4, H6, BODY, BODY_SM, SMALL, LABEL } from "@/lib/typeScale";

// Follows the site theme (day / night): colours come from the --lr-* tokens; the line-up photo fades
// into the page through CSS masks. The verdict badge tones ("dark" / "gold" / "light") are design
// variants, not the theme: a deep green pill (brand green by day, chip green with a ring at night), a
// solid amber pill (same amber in both themes), and a pale sand pill (gold-tinted at night).
const BADGE = {
  dark: "bg-lr-brand text-lr-on-brand dark:bg-lr-chip dark:ring-1 dark:ring-inset dark:ring-lr-line-strong",
  gold: "bg-[#c98a3a] text-white",
  light: "bg-[#f1e3c9] text-[#1f1f1f] ring-1 ring-inset ring-[#e2cfa8] dark:bg-lr-gold-line/15 dark:text-lr-gold dark:ring-lr-gold-line/45",
};

// desktop line-up photo: by day only its left edge feathers into the page; at night the (overcast, pale)
// sky and the bottom edge fade too, and the photo is dimmed a touch so it sits in the green page
const FADE_LINEUP =
  "[mask-image:linear-gradient(to_right,transparent,#000_3%)] dark:[mask-image:linear-gradient(to_right,transparent,#000_16%),linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)] dark:[mask-composite:intersect]";

// phones: model | verdict (generations sit under the name); sm+: model | generations | verdict as in the references
const ROW = "grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto]";

function Verdict({ m }) {
  return (
    <span
      className={`inline-flex w-[124px] items-center gap-2 rounded-md px-2.5 py-2 text-[10.5px] font-semibold uppercase leading-tight tracking-[0.02em] shadow-[0_3px_8px_-4px_var(--lr-shadow)] sm:w-[148px] sm:gap-2.5 sm:px-3 sm:text-[12px] xl:w-[164px] xl:text-[15px] ${BADGE[m.tone]}`}
    >
      <GuideIcon name={m.icon} className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" />
      {m.verdict}
    </span>
  );
}

function ModelTable({ group, columns }) {
  return (
    <div className="overflow-hidden rounded-md border border-lr-line bg-lr-card shadow-[0_10px_28px_-18px_var(--lr-shadow)]">
      <h3 className={`${H6} flex items-center gap-5 bg-lr-brand px-5 py-3 uppercase tracking-[0.04em] text-lr-on-brand sm:px-6`}>
        {group.brand === "landRover" ? <LandRoverLogo crop className="h-[26px] w-[48px] shrink-0" /> : null}
        {group.label}
      </h3>
      <div className={`${ROW} ${LABEL} items-center gap-x-3 border-b border-lr-line px-4 py-2.5 text-lr-head sm:gap-x-4 sm:px-6`}>
        <span>{columns[0]}</span>
        <span className="hidden sm:block">{columns[1]}</span>
        <span className="w-[124px] pl-1 sm:w-[148px] xl:w-[164px]">{columns[2]}</span>
      </div>
      <ul className="divide-y divide-lr-line px-4 sm:px-6">
        {group.models.map((m) => (
          <li key={m.name}>
            <Link href={m.href} className={`group ${ROW} items-center gap-x-3 py-2.5 font-normal sm:gap-x-4`}>
              <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span className="relative h-[38px] w-[64px] shrink-0 sm:h-[46px] sm:w-[84px] xl:w-[76px]">
                  <Image src={m.image} alt={m.name} fill className="object-contain" sizes="84px" />
                </span>
                <span className="min-w-0 leading-snug">
                  <span className={`${BODY_SM} block font-medium leading-snug text-lr-head group-hover:text-lr-green`}>{m.name}</span>
                  <span className={`${SMALL} block text-lr-muted sm:hidden`}>
                    {m.count} {m.gens}
                  </span>
                </span>
              </span>
              <span className={`${BODY_SM} hidden border-l border-lr-line py-1 pl-4 leading-snug text-lr-body sm:block`}>
                {m.count}
                <br />
                {m.gens}
              </span>
              <Verdict m={m} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// One sharp portrait photo (car at the top, real rocky ground below). Desktop pins it to the top so a wider /
// shorter box only trims ground; phones show it at its natural shape so nothing is cropped.
function Example({ ex }) {
  return (
    <div className="overflow-hidden rounded-md border border-lr-line bg-lr-card shadow-[0_10px_28px_-18px_var(--lr-shadow)] xl:grid xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="relative hidden xl:block">
        <Image src={ex.image} alt={ex.imageAlt} fill quality={90} className="object-cover object-top" sizes="300px" />
      </div>

      <div className="grid grid-cols-[38%_minmax(0,1fr)] sm:grid-cols-[34%_minmax(0,1fr)] xl:block xl:px-8 xl:pb-6 xl:pt-5">
        {/* phones / tablets (mobile reference): eyebrow + title, then the photo filling the rest of the left column */}
        <div className="flex flex-col xl:block">
          <div className="px-3 pb-3 pt-3.5 sm:px-5 sm:pt-4 xl:p-0">
            <p className="text-[10.5px] font-medium uppercase leading-snug tracking-[0.03em] text-lr-muted sm:text-[12.5px] xl:text-[15px]">{ex.eyebrow}</p>
            <Link href={ex.href} className={`${H4} mt-1 block text-lr-head hover:text-lr-green`}>
              {ex.title}
            </Link>
            <span className="mt-2 block h-px w-full bg-lr-line xl:mt-3">
              <span className="block h-px w-6 bg-lr-gold-line" />
            </span>
          </div>
          <div className="relative aspect-[253/326] w-full xl:hidden">
            <Image src={ex.mobileImage} alt={ex.imageAlt} fill quality={90} className="object-cover" sizes="(min-width: 640px) 34vw, 35vw" />
          </div>
        </div>

        <ul className="divide-y divide-lr-line border-l border-lr-line px-3 sm:px-6 xl:mt-4 xl:grid xl:grid-cols-5 xl:divide-x xl:divide-y-0 xl:border-0 xl:px-0">
          {ex.items.map((it) => (
            <li key={it.title} className="flex gap-2.5 py-2.5 sm:gap-4 sm:py-3 xl:block xl:px-5 xl:py-1 xl:first:pl-0 xl:last:pr-0">
              <span className={`shrink-0 ${it.icon === "alert" ? "text-lr-warn" : "text-lr-head"}`}>
                <GuideIcon name={it.icon} className="h-6 w-6 sm:h-8 sm:w-8" />
              </span>
              <span className="min-w-0 xl:mt-1 xl:block">
                <span className={`${SMALL} block font-semibold uppercase tracking-[0.02em] text-lr-head`}>{it.title}</span>
                <span className={`${BODY_SM} mt-0.5 block text-lr-body sm:mt-1 xl:mt-2.5`}>{it.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HomeModels({ data }) {
  const [h1, h2, h3] = data.h2.split("|");
  const { note } = data;

  return (
    <section id="models" lang="en-GB" className="relative scroll-mt-20 overflow-hidden bg-lr-page text-lr-head">
      {/* desktop: model line-up across the top right, left edge fading into the page (mask, not a tint) */}
      <div className={`absolute right-0 top-0 hidden aspect-[1808/604] w-[57%] xl:block ${FADE_LINEUP}`} aria-hidden="true">
        <Image src={data.image} alt="" fill quality={90} className="object-cover dark:brightness-[0.82]" sizes="57vw" />
      </div>

      <div className={`${CONTAINER} relative pb-10 pt-9 lg:pb-14 lg:pt-12`}>
        <h2 className={`${H2} text-balance`}>
          {h1} <br className="sm:hidden xl:block" />
          {h2}
          <br />
          <span className="text-lr-ink">{h3}</span>
        </h2>
        <p className={`${BODY} mt-3 text-lr-body sm:max-w-[640px] xl:mt-5 xl:max-w-[520px]`}>
          {data.subhead}
        </p>

        {/* phones / tablets: the line-up as its own photo below the intro, so no text ever sits on the cars */}
        <div className="relative mt-4 aspect-[777/206] overflow-hidden rounded-md border border-lr-line shadow-[0_10px_24px_-16px_var(--lr-shadow)] xl:hidden" aria-hidden="true">
          <Image src={data.mobileImage} alt="" fill quality={90} className="object-cover dark:brightness-[0.88]" sizes="100vw" />
        </div>

        <div className="mt-3 grid gap-3 xl:mt-7 xl:grid-cols-2 xl:gap-4">
          {data.groups.map((g) => (
            <ModelTable key={g.label} group={g} columns={data.columns} />
          ))}
        </div>

        <div className="mt-3 xl:mt-4">
          <Example ex={data.example} />
        </div>

        {/* data note */}
        <div className="mt-3 flex flex-col gap-3 rounded-md border border-lr-line bg-lr-panel px-4 py-4 text-lr-head min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-5 sm:px-6 xl:mt-4 xl:py-3.5">
          <div className="flex items-start gap-3.5 min-[420px]:flex-1 xl:items-center xl:gap-6">
            <span className="shrink-0 text-lr-gold">
              <GuideIcon name="database" className="h-8 w-8" />
            </span>
            <p className={`${BODY_SM} leading-snug text-lr-body`}>
              <span className={`${SMALL} block font-semibold uppercase text-lr-gold xl:mr-6 xl:inline`}>{note.title}</span>
              {note.text}
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 border-t border-lr-line pt-3 text-lr-body min-[420px]:border-l min-[420px]:border-t-0 min-[420px]:pl-5 min-[420px]:pt-0 xl:flex-row xl:gap-0 xl:divide-x xl:divide-lr-line-strong xl:border-l-0 xl:pl-0">
            {note.stats.map((s) => (
              <li key={s.label} className={`${SMALL} flex items-center gap-3 whitespace-nowrap xl:px-6`}>
                <GuideIcon name={s.icon} className="h-5 w-5 shrink-0 text-lr-green xl:hidden" />
                {s.label}: {s.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
