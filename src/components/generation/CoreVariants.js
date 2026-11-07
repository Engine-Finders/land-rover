import Link from "next/link";
import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import variantPages from "@/data/registery/variants/pages.json";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose } from "@/components/models/modelKit";
import { stripHtml } from "@/components/models/engineSections";
import { localHref, localHtml } from "@/components/models/generationsFaqLinks";
import { engineDbCar, genCode } from "./genKit";

// Generation page section 8 - core variants, built to the approved Defender L316 reference: the
// eyebrow, "Core Variants" headline and split rule; the diesel and petrol cards (a green diagonal
// panel with the fuel icon, the variant names as a two-column list, each linked to its variant page
// where one exists) and the scope note; on the right the generation's car on the hillside, full-bleed
// to the screen's edge. Where the JSON lists no variants for a fuel, the engine table's own engines of
// that fuel stand in (unlinked).
// Phones / tablets: the heading, the car full-bleed, the cards stacked, the scope note.

const BG = "bg-[url(/home/hero-loch-day-m.webp)] sm:bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:dark:bg-[url(/home/hero-loch-night.webp)]";
const PAGES = new Set(variantPages.map((p) => `/${p.parent}/${p.slug}`));

// "https://landroverengine.uk/defender/200tdi" -> "/defender/200tdi", only when that page exists
const variantHref = (url = "") => {
  const href = localHref(url).replace(/\/$/, "");
  return PAGES.has(href) ? href : "";
};

// the engine table's engines of one fuel, by family name ("3.9 V8", "3.5 V8")
function tableEngines(page, fuel) {
  const names = (page?.engineDatabase?.engines || [])
    .filter((e) => new RegExp(fuel, "i").test(stripHtml(e.fuel)))
    .map((e) => stripHtml(e.family || e.engineCode).replace(/\s*\([^)]*\)/g, "").trim())
    .filter(Boolean);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, "en", { numeric: true })).map((name) => ({ name, url: "" }));
}

function FuelCard({ kind, items }) {
  const rows = items.length > 3 ? Math.ceil(items.length / 2) : items.length;
  return (
    <article className="relative flex min-w-0 overflow-hidden rounded-xl border border-lr-line bg-[linear-gradient(100deg,var(--lr-panel),var(--lr-card)_70%)] shadow-[0_18px_44px_-36px_var(--lr-shadow)]">
      <span
        className="flex w-[92px] shrink-0 items-center justify-start bg-lr-brand pl-5 text-lr-on-brand [clip-path:polygon(0_0,100%_0,62%_100%,0_100%)] sm:w-[112px] xl:w-[118px] dark:bg-[#1f5a35]"
        aria-hidden="true"
      >
        <LrIcon name={kind === "diesel" ? "engine" : "petrol"} tone="current" className="h-10 w-10 xl:h-12 xl:w-12" />
      </span>
      <div className="min-w-0 flex-1 py-5 pr-5 xl:py-6 xl:pr-7">
        <h3 className="text-[17px] font-semibold uppercase leading-snug tracking-[0.02em] text-lr-ink md:text-[18px] xl:text-[20px] dark:text-lr-green">{kind === "diesel" ? "Diesel Variants" : "Petrol Variants"}</h3>
        <ul className="mt-3 grid grid-flow-col gap-x-8 gap-y-2" style={{ gridTemplateRows: `repeat(${rows}, auto)` }}>
          {items.map((v, i) => {
            const href = variantHref(v.url);
            return (
              <li key={`${v.name}-${i}`} className="flex items-center gap-3 text-[15px] leading-snug text-lr-head xl:text-[16px]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lr-ink dark:bg-lr-green" aria-hidden="true" />
                {href ? (
                  <Link href={href} className="font-normal text-lr-head no-underline decoration-lr-green underline-offset-4 hover:text-lr-ink hover:underline dark:hover:text-lr-green" dangerouslySetInnerHTML={{ __html: localHtml(prose(v.name)) }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: localHtml(prose(v.name)) }} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export default function CoreVariants({ data, page = null, model = "" }) {
  if (!data) return null;
  const diesel = data.dieselVariants?.length ? data.dieselVariants : tableEngines(page, "diesel");
  const petrol = data.petrolVariants?.length ? data.petrolVariants : tableEngines(page, "petrol");
  if (!diesel.length && !petrol.length) return null;

  const code = genCode(`${page?.hero?.h1 || ""} ${page?.hero?.tagPill || ""}`);
  const car = engineDbCar(page?.hero || {}, model);
  const both = diesel.length > 0 && petrol.length > 0;

  return (
    <section className={`relative overflow-hidden bg-lr-band py-6 text-lr-head md:py-7 xl:py-8 ${SANS}`}>
      {/* laptops: the hillside and the car, full-bleed on the right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[50vw] lg:block" aria-hidden="true">
        <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.7)_22%,#000_40%)]">
          <div className={`absolute inset-0 bg-cover bg-[42%_62%] ${BG} brightness-[1.04] contrast-[.94] hue-rotate-[12deg] saturate-[.8] dark:filter-none [mask-image:linear-gradient(180deg,#000_78%,transparent)]`} />
        </div>
        {car && (
          <div className="absolute bottom-[12%] right-[4vw] w-[40vw] max-w-[720px]">
            <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 40vw, 1px" />
          </div>
        )}
      </div>

      <div className={`${CONTAINER} relative`}>
        <div className="lg:max-w-[calc(52vw_-_56px)] xl:max-w-[calc(52vw_-_max(48px,50vw_-_752px)_-_8px)]">
          <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">{code ? `${code} body code` : "Variants"}</p>
          <h2 className={`${H2_MODEL} mt-3.5 text-lr-head md:mt-4`}>Core Variants</h2>
          <span className="mt-4 flex h-[3px] w-20 overflow-hidden rounded-full md:mt-5" aria-hidden="true">
            <span className="w-[60%] bg-lr-ink dark:bg-lr-green" />
            <span className="flex-1 bg-lr-gold-line" />
          </span>

          {/* phones / tablets: the hillside with the car, full-bleed */}
          {car && (
            <div className="relative -mx-5 mt-6 aspect-[2/1] sm:-mx-6 sm:aspect-[5/2] md:-mx-10 md:aspect-[3/1] lg:hidden" aria-hidden="true">
              <div className={`absolute inset-0 bg-cover bg-[center_68%] ${BG} brightness-[1.04] contrast-[.94] hue-rotate-[12deg] saturate-[.8] dark:filter-none [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_80%,transparent)]`} />
              <div className="absolute bottom-[8%] left-1/2 w-[58%] max-w-[420px] -translate-x-1/2 sm:w-[46%] md:w-[36%]">
                <GroundedCar src={car} sceneByTheme sizes="(max-width: 640px) 58vw, 420px" />
              </div>
            </div>
          )}

          <div className={`relative grid gap-4 xl:gap-5 ${both ? "sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]" : ""} ${car ? "-mt-4 sm:-mt-6 lg:mt-7" : "mt-6 md:mt-7"}`}>
            {diesel.length > 0 && <FuelCard kind="diesel" items={diesel} />}
            {petrol.length > 0 && <FuelCard kind="petrol" items={petrol} />}
          </div>

          {data.scopeNote && (
            <div className="relative mt-4 flex items-start gap-4 rounded-xl border border-lr-line bg-lr-card/95 p-5 shadow-[0_18px_44px_-36px_var(--lr-shadow)] backdrop-blur-sm md:mt-5 xl:items-center xl:gap-5 xl:px-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-ink/60 text-lr-ink xl:h-12 xl:w-12 dark:border-lr-green/60 dark:text-lr-green">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 10.5v7M12 6.6h.01" />
                </svg>
              </span>
              <p className="min-w-0 text-[15px] leading-[1.6] text-lr-body xl:text-[16px] [&_a]:text-lr-ink [&_a]:underline dark:[&_a]:text-lr-green">
                <strong className="font-semibold text-lr-head">Scope note: </strong>
                <span dangerouslySetInnerHTML={{ __html: localHtml(prose(data.scopeNote)) }} />
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
