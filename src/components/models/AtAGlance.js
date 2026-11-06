import { CONTAINER } from "@/lib/typeScale";
import { CAR_ART, CAR_ART_RATIO, Eyebrow, SANS, Stars, modelArt, parseRating, H2_MODEL, INTRO } from "@/components/models/modelKit";

// Model page section 3, built to the approved Velar reference: the eyebrow, the serif "Velar /
// at a Glance" headline and its intro on the left; the model's silver car standing in the Highland
// backdrop on the right, the backdrop running off the right edge and feathered into the page; and
// under them the key-facts table (icon | Metric | Value) with the [EM-…] data tags drawn as pills
// and the rating as stars plus a score pill.
// Phones (90% of visitors): headline and intro, the car full-bleed, then the facts as a stacked
// list (icon, metric label, value) on a card over the car's foot. From md (768px) the car sits
// beside the copy and the facts become the two-column table.

// ------------------------------------------------------------------ icons (as in the reference)

const ICONS = {
  generations: (
    <>
      <path d="m12 3.5 8.5 4.25L12 12 3.5 7.75 12 3.5Z" fill="currentColor" stroke="none" />
      <path d="m3.5 12 8.5 4.25L20.5 12M3.5 16.25 12 20.5l8.5-4.25" />
    </>
  ),
  years: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="M7.5 13.5h.01M10.5 13.5h.01M13.5 13.5h.01M16.5 13.5h.01M7.5 17h.01M10.5 17h.01M13.5 17h.01" strokeWidth="2.4" />
    </>
  ),
  engine: (
    <>
      <path d="M7 8.5h3V6.5h4v2h2.5l2 2.5H21v5h-2.5l-2 2.5H9L7 16H5v-2.5H3v-3h2V8.5h2Z" />
      <path d="M10 6.5V5h4v1.5" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5v15.5M3.5 20.5h12" />
      <path d="M5 10.5h9" />
      <path d="M14 8h1.5a1.5 1.5 0 0 1 1.5 1.5V16a1.25 1.25 0 0 0 2.5 0V8.5L17 6" />
    </>
  ),
  enquired: (
    <>
      <path d="M4 3.5v17h16.5" />
      <path d="M8 17v-5M12 17V8.5M16 17v-7M20 17V6" strokeWidth="2.6" />
    </>
  ),
  reliable: (
    <>
      <path d="M12 3 5 5.8v5.6c0 4.6 3 8.4 7 9.6 4-1.2 7-5 7-9.6V5.8L12 3Z" />
      <path d="M12 3v18c-4-1.2-7-5-7-9.6V5.8L12 3Z" fill="currentColor" stroke="none" opacity="0.9" />
      <path d="m9 12 2 2 4-4.5" />
    </>
  ),
  risk: (
    <>
      <path d="M10.3 4.2 2.6 17.8A2 2 0 0 0 4.3 20.8h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.5v4.5M12 17.3h.01" strokeWidth="2.2" />
    </>
  ),
  cost: <path d="M16.5 7.2A4.6 4.6 0 0 0 8.5 9.8V18M6 18.5h11.5M6 13.5h8" />,
  value: (
    <>
      <path d="M20.5 12.6 12.6 20.5a1.6 1.6 0 0 1-2.3 0L3.5 13.7V3.5h10.2l6.8 6.8a1.6 1.6 0 0 1 0 2.3Z" />
      <circle cx="8.3" cy="8.3" r="1.4" />
    </>
  ),
  rating: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 6.8 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5L12 6.8Z" fill="currentColor" stroke="none" />
    </>
  ),
};

function iconFor(metric = "") {
  if (/generation/i.test(metric) && !/enquired/i.test(metric)) return "generations";
  if (/years?/i.test(metric)) return "years";
  if (/engine codes?/i.test(metric)) return "engine";
  if (/fuel/i.test(metric)) return "fuel";
  if (/enquired|enquiries/i.test(metric)) return "enquired";
  if (/reliable/i.test(metric)) return "reliable";
  if (/risk/i.test(metric)) return "risk";
  if (/cost/i.test(metric)) return "cost";
  if (/value/i.test(metric)) return "value";
  if (/rating/i.test(metric)) return "rating";
  return "generations";
}

function MetricIcon({ metric }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lr-line bg-lr-band text-lr-ink shadow-[0_2px_6px_-3px_var(--lr-shadow)] md:h-11 md:w-11 xl:h-12 xl:w-12 dark:border-lr-gold-line/55 dark:bg-transparent dark:text-lr-gold">
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-[22px] md:w-[22px] xl:h-6 xl:w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS[iconFor(metric)]}
      </svg>
    </span>
  );
}

// ------------------------------------------------------------------ values

const TAG_RE = /\s*\[((?:EM-|PLACEHOLDER)[^\]]*)\]/g;

// "£3,000–£9,500 reconditioned [EM-QUOTE]" -> { text: "£3,000–£9,500 reconditioned", tags: ["EM-QUOTE"] }
// "★★★½ 3.5/5" -> { rating: { full: 3, half: 1, empty: 1 }, score: "3.5/5" }
function parseValue(raw = "") {
  const tags = [];
  let text = String(raw).replace(TAG_RE, (_, t) => {
    tags.push(t.replace(/\s+-\s+/g, " — "));
    return "";
  });
  const r = parseRating(text);
  if (r.stars) return { rating: r, score: r.rest.replace(/[()]/g, ""), text: "", tags };
  text = text.trim().replace(/\s+-\s+/g, " — ");
  return { rating: null, score: "", text, tags };
}

const PILL = "inline-flex items-center rounded-md border px-2 py-[5px] text-[12px] font-semibold leading-none tracking-[0.03em] md:px-2.5 md:py-1.5 md:text-[13px] xl:text-[14px]";

function Tag({ name }) {
  const tone = /^EM-QUOTE/.test(name)
    ? "border-lr-gold-line/80 bg-lr-gold-line/[0.07] text-lr-gold"
    : /^EM-/.test(name)
      ? "border-lr-ink/45 bg-lr-ink/[0.04] text-lr-ink dark:border-lr-green/55 dark:bg-lr-green/[0.06] dark:text-lr-green"
      : "border-lr-line-strong bg-lr-band font-medium tracking-normal text-lr-body [overflow-wrap:anywhere] leading-snug";
  return <span className={`${PILL} ${tone}`}>{name}</span>;
}

function Value({ raw }) {
  const v = parseValue(raw);
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 [&_a]:font-medium [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline">
      {v.rating ? (
        <>
          <Stars {...v.rating} size="h-[19px] w-[19px] md:h-[22px] md:w-[22px] xl:h-6 xl:w-6" className="text-lr-gold! dark:text-lr-gold!" />
          {v.score && <span className={`${PILL} border-lr-gold-line/80 bg-lr-gold-line/[0.07] text-lr-gold`}>{v.score}</span>}
        </>
      ) : (
        v.text && <span className="min-w-0" dangerouslySetInnerHTML={{ __html: v.text }} />
      )}
      {v.tags.map((t) => (
        <Tag key={t} name={t} />
      ))}
    </span>
  );
}

// ------------------------------------------------------------------ table

const COLS = "md:grid-cols-[64px_minmax(0,36%)_minmax(0,1fr)] xl:grid-cols-[80px_minmax(0,34%)_minmax(0,1fr)]";

function FactsTable({ rows }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-lr-line bg-lr-card/95 shadow-[0_24px_60px_-38px_var(--lr-shadow)] backdrop-blur-sm md:rounded-[20px]">
      {/* tablet and up: Metric | Value header */}
      <div className={`hidden px-4 pt-4 text-[15px] font-semibold text-lr-head md:grid md:px-5 xl:px-6 xl:pt-5 xl:text-[17px] ${COLS}`}>
        <span />
        <span className="border-b border-lr-line pb-3.5 xl:pb-4">Metric</span>
        <span className="border-b border-lr-line pb-3.5 pl-6 xl:pb-4 xl:pl-9">Value</span>
      </div>

      <ul className="py-1 md:px-5 md:pb-3 md:pt-0 xl:px-6 xl:pb-4">
        {rows.map((row, i) => {
          const last = i === rows.length - 1;
          return (
            <li key={row.metric} className={`grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3.5 px-4 md:items-stretch md:gap-x-0 md:px-0 ${COLS}`}>
              <span className="flex items-start py-3.5 md:items-center md:py-1.5">
                <MetricIcon metric={row.metric} />
              </span>
              {/* phones: label over value, divided from the next row under the text only */}
              <div className={`min-w-0 py-3.5 md:hidden ${last ? "" : "border-b border-lr-line"}`}>
                <p className="text-[13px] font-medium leading-snug text-lr-body" dangerouslySetInnerHTML={{ __html: row.metric }} />
                <div className="mt-1 text-[15.5px] font-semibold leading-[1.4] text-lr-head">
                  <Value raw={row.value} />
                </div>
              </div>
              {/* tablet and up: two columns with the vertical rule between them */}
              <span
                className={`hidden items-center border-r border-lr-line py-3 pr-4 text-[15px] font-medium leading-snug text-lr-head md:flex xl:text-[17px] ${last ? "" : "border-b"}`}
                dangerouslySetInnerHTML={{ __html: row.metric }}
              />
              <div className={`hidden min-w-0 items-center py-3 pl-6 text-[15px] leading-[1.45] text-lr-head md:flex xl:pl-9 xl:text-[17px] ${last ? "" : "border-b border-lr-line"}`}>
                <Value raw={row.value} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ------------------------------------------------------------------ section

// backdrop feathering: phones fade it in at the top and out under the card; from md the panel
// fades in from the copy side and out at its foot (behind the table)
const PHOTO_FADE_M = "[mask-image:linear-gradient(to_bottom,transparent,#000_26%,#000_78%,transparent)]";
// (two nested masks rather than one composited pair, which left a hairline at the panel's edge)
const PHOTO_FADE_X =
  "[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.06)_8%,rgba(0,0,0,0.3)_18%,rgba(0,0,0,0.7)_30%,#000_44%)]";
const PHOTO_FADE_Y = "[mask-image:linear-gradient(to_bottom,#000_58%,rgba(0,0,0,0.5)_78%,transparent)]";
const BG = "bg-cover bg-[center_62%] bg-[url(/model/hero/bg-day.webp)] dark:bg-[url(/model/hero/bg-night.webp)]";
const BG_M = "bg-cover bg-[center_bottom] bg-[url(/model/hero/bg-day-m.webp)] dark:bg-[url(/model/hero/bg-night-m.webp)]";

export default function AtAGlance({ data, slug = "" }) {
  if (!data) return null;

  const h2 = String(data.h2 || "");
  const at = h2.search(/\bat a Glance\b/i);
  const lead = at > 0 ? h2.slice(0, at).trim() : h2;
  const accent = at > 0 ? h2.slice(at) : "";
  const art = modelArt(slug, "silver");
  const rows = data.rows || [];

  return (
    <section className={`relative overflow-hidden bg-lr-page py-10 text-lr-head md:py-14 xl:py-16 ${SANS}`} style={art || undefined}>
      <div className={`relative ${CONTAINER}`}>
        <div className="relative md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          {/* md+: the backdrop panel, from the section top to behind the table, off the right edge */}
          {art && (
            <div
              className={`pointer-events-none absolute -top-12 bottom-[-4.5rem] left-[34%] right-[calc(50%-50vw)] hidden md:block lg:left-[30%] xl:-top-14 ${PHOTO_FADE_X}`}
              aria-hidden="true"
            >
              <div className={`absolute inset-0 ${BG} ${PHOTO_FADE_Y}`} />
            </div>
          )}

          <div className="relative min-w-0 md:self-start md:pb-8 lg:pb-10">
            <Eyebrow>At a Glance</Eyebrow>
            <h2 className={`${H2_MODEL} mt-3 text-lr-head md:mt-4`}>
              {lead}
              {accent && (
                <>
                  <br />
                  <span className="text-lr-ink dark:text-lr-green">{accent}</span>
                </>
              )}
            </h2>
            {data.subHeadline && (
              <p className={`${INTRO} md:max-w-[21em]`}>{data.subHeadline}</p>
            )}
          </div>

          {art && (
            <div className="relative -mx-5 sm:-mx-6 mt-2 aspect-[16/10] sm:aspect-[2/1] md:mx-0 md:mt-0 md:aspect-auto md:pt-6 lg:pt-4" aria-hidden="true">
              <div className={`absolute inset-0 md:hidden ${BG_M} ${PHOTO_FADE_M}`} />
              <div
                className={`absolute bottom-[10%] left-1/2 w-[84%] max-w-[560px] -translate-x-1/2 md:static md:ml-auto md:mr-[2%] md:w-full md:max-w-[600px] md:translate-x-0 ${CAR_ART_RATIO} ${CAR_ART}`}
              />
            </div>
          )}
        </div>

        <div className={`relative ${art ? "-mt-8 sm:-mt-10 md:mt-0" : "mt-6"}`}>
          <FactsTable rows={rows} />
        </div>
      </div>
    </section>
  );
}
