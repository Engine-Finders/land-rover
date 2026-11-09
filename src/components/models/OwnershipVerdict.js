import LrIcon from "@/components/shared/LrIcon";
import { BODY_SM, CONTAINER, ICON_SM } from "@/lib/typeScale";
import { Eyebrow, prose, Stars as KitStars, H2_MODEL, INTRO } from "@/components/models/modelKit";

// Model page section 2, built to the approved Velar reference: on the left the eyebrow, the serif
// "Velar - / The Ownership Verdict" headline, the model's newest car standing in the Highland
// backdrop (misty by day, a storm at night) and the one-line verdict card over its foot; on the right
// the verdict table (Verdict Metric | Our Call) with a brand icon per metric, star ratings drawn as
// stars, the status emoji as icons and the [EM-…] data tags in green. Below xl (1280px) it stacks:
// headline, the car full-bleed, the verdict card over its foot, then the table (a list on phones).
// Art: public/model/hero/bg-<theme>[-m].webp + <slug>-car-<theme>[-m].webp
// (scripts/build-model-hero-art.py).

const SANS = "font-[family-name:var(--font-instrument-sans)]";
const CARS = new Set([
  "defender", "discovery", "discovery-sport", "freelander",
  "range-rover", "range-rover-evoque", "range-rover-sport", "velar",
]);

// brand icon per metric (anything not listed falls back to the shield)
const METRIC_ICONS = {
  "Overall Ownership Rating": "independent-star",
  "Replacement Economics": "scale",
  Reliability: "genuine-failure-data",
  "Most Reliable Engine": "top-choice",
  "Highest-Risk Engine": "expensive-failure",
  "Best Used Buy": "best-used-buy-2",
  "Best Modern Buy": "modern-choice",
  "Best Petrol/Hybrid Buy": "petrol",
  "Best First Range Rover": "good-choice",
  "The D300 Trap": "scope-decision",
  "Most Common Failure Enquiry": "real-inquiries",
  "Homepage Ranking": "flagship-choice",
  Successor: "two-cars",
};
const POUND_METRICS = /replacement$/i; // "Average Engine Replacement" shows a £ in its chip

// desktop backdrop: the left half of the band, feathered into the table side and the foot; by day
// it stays faint behind the headline so the misty sky reads as the page
const BACKDROP_FADE =
  "[mask-image:linear-gradient(to_right,#000_55%,transparent_98%),linear-gradient(to_bottom,rgba(0,0,0,0.15),#000_48%,#000_82%,transparent)] dark:[mask-image:linear-gradient(to_right,#000_55%,transparent_98%),linear-gradient(to_bottom,rgba(0,0,0,0.55),#000_40%,#000_82%,transparent)] [mask-composite:intersect]";
const PHOTO_FADE = "[mask-image:linear-gradient(to_bottom,transparent,#000_24%,#000_80%,transparent)]";
const BG_DESKTOP = "bg-[url(/model/hero/bg-day.webp)] dark:bg-[url(/model/hero/bg-night.webp)]";
const BG_MOBILE =
  "bg-[url(/model/hero/bg-day-m.webp)] sm:bg-[url(/model/hero/bg-day.webp)] dark:bg-[url(/model/hero/bg-night-m.webp)] sm:dark:bg-[url(/model/hero/bg-night.webp)]";
const CAR_ART =
  "aspect-[1200/760] bg-contain bg-bottom bg-no-repeat bg-[image:var(--car-day-m)] sm:bg-[image:var(--car-day)] dark:bg-[image:var(--car-night-m)] sm:dark:bg-[image:var(--car-night)]";

// "★★★½ (3.5/5)" / "✅ Usually Worth Replacing - …" / "🎨 The Design Pick - …"
function parseCall(raw = "") {
  let rest = raw.trim();
  let stars = null;
  const s = rest.match(/^([★☆½]+)\s*/);
  if (s) {
    const full = (s[1].match(/★/g) || []).length;
    const half = s[1].includes("½") ? 1 : 0;
    stars = { full, half, empty: Math.max(0, 5 - full - half) };
    rest = rest.slice(s[0].length).replace(/^-\s+/, "- ");
  }
  let status = "";
  let emoji = "";
  const st = rest.match(/^(✅|⚠️|⚠|❌)\s*/);
  if (st) {
    status = st[1] === "✅" ? "good" : st[1] === "❌" ? "bad" : "warn";
    rest = rest.slice(st[0].length);
  } else {
    const em = rest.match(/^(\p{Extended_Pictographic}[\p{Extended_Pictographic}‍️]*)\s*/u);
    if (em) {
      emoji = em[1];
      rest = rest.slice(em[0].length);
    }
  }
  let lead = "";
  if (status || emoji) {
    // the verdict phrase before the first dash is set in bold, as in the reference
    const cut = rest.search(/\s+-\s+/);
    if (cut > 0 && cut < 60) {
      lead = rest.slice(0, cut);
      rest = rest.slice(cut);
    }
  }
  return { stars, status, emoji, lead, rest: prose(rest) };
}

const STAR_SIZE = "h-[18px] w-[18px] md:h-5 md:w-5 xl:h-[22px] xl:w-[22px]";
const Stars = (props) => <KitStars {...props} size={STAR_SIZE} />;

function StatusIcon({ kind }) {
  if (kind === "good") {
    return (
      <svg viewBox="0 0 24 24" className="mr-2 inline-block h-[18px] w-[18px] shrink-0 align-[-4px] text-lr-good xl:h-5 xl:w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path d="m7 12.4 3.2 3.2L17 8.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  const color = kind === "bad" ? "text-lr-bad" : "text-lr-warn";
  return (
    <svg viewBox="0 0 24 24" className={`mr-2 inline-block h-[18px] w-[18px] shrink-0 align-[-4px] ${color} xl:h-5 xl:w-5`} aria-hidden="true">
      <path d="M10.3 3.4 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" fill="currentColor" />
      <path d="M12 9v4.5M12 17h.01" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MetricChip({ metric }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lr-brand md:h-10 md:w-10 xl:h-11 xl:w-11 dark:border dark:border-lr-gold-line/55 dark:bg-transparent">
      {POUND_METRICS.test(metric) ? (
        <span className="font-[family-name:var(--font-serif-display)] text-[19px] leading-none text-[var(--lr-icon-on-brand)] xl:text-[22px] dark:text-lr-gold" aria-hidden="true">
          £
        </span>
      ) : (
        <LrIcon name={METRIC_ICONS[metric] || "genuine-failure-data"} tone="skin" className={`${ICON_SM} xl:h-5 xl:w-5`} />
      )}
    </span>
  );
}

function Call({ text }) {
  const c = parseCall(text);
  return (
    <p className={`text-[14px] leading-[1.55] md:text-[15px] md:leading-[1.5] text-lr-body [&_a]:font-medium [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline`}>
      {c.stars && (
        <>
          <Stars {...c.stars} />
          {c.rest && " "}
        </>
      )}
      {c.status && <StatusIcon kind={c.status} />}
      {c.emoji && <span className="mr-1.5" aria-hidden="true">{c.emoji}</span>}
      {c.lead && <strong className="font-semibold text-lr-head">{c.lead}</strong>}
      <span className={c.stars && /^\(/.test(c.rest) ? "ml-2" : ""} dangerouslySetInnerHTML={{ __html: c.rest }} />
    </p>
  );
}

function VerdictTable({ metrics }) {
  return (
    <div className="overflow-hidden rounded-xl border border-lr-line bg-lr-card/95 shadow-[0_24px_60px_-42px_var(--lr-shadow)] backdrop-blur-sm lg:rounded-2xl">
      <div className="hidden grid-cols-[minmax(0,41%)_minmax(0,1fr)] border-b border-lr-line px-5 py-4 text-[15px] font-medium text-lr-head md:grid xl:px-7 xl:py-5 xl:text-[16px]">
        <span>Verdict Metric</span>
        <span className="pl-6 xl:pl-7">Our Call</span>
      </div>
      <ul className="divide-y divide-lr-line md:px-5 xl:px-7">
        {metrics.map((row) => (
          <li key={row.metric} className="flex gap-3 px-4 py-3.5 md:grid md:grid-cols-[minmax(0,41%)_minmax(0,1fr)] md:gap-0 md:px-0 md:py-0">
            <div className="flex shrink-0 items-start gap-3 md:items-center md:py-3 md:pr-2 xl:py-3.5">
              <MetricChip metric={row.metric} />
              <span className="hidden text-[15px] font-medium leading-snug text-lr-head md:block" dangerouslySetInnerHTML={{ __html: row.metric }} />
            </div>
            <div className="min-w-0 md:my-1.5 md:flex md:items-center md:border-l md:border-lr-line md:py-1.5 md:pl-6 xl:pl-7">
              <div className="min-w-0">
                <span className="mb-1 block text-[15px] font-semibold leading-snug text-lr-head md:hidden" dangerouslySetInnerHTML={{ __html: row.metric }} />
                <Call text={row.ourCall} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The stats strip along the foot of the section, built from the page's hero facts so every model
// gets its own figures: enquiries, the ranking (when the model has one), generations, engine codes
// and the Engine Finders badge. A section can override it with its own `stats` list
// ([{ icon, text }]). "275+ Enquiries (2025) [EM-VERIFIED] - #1 Most-Enquired Velar Model" splits
// into two cells, as in the reference.
function deriveStats(data = {}, hero = {}) {
  if (Array.isArray(data.stats) && data.stats.length) return data.stats;
  const strip = (hero.trustStrip || []).map((s) => (s.label || s.text || "").trim()).filter(Boolean);
  const find = (re) => strip.find((s) => re.test(s));
  const out = [];
  const [enquiries = "", rank = ""] = (find(/enquir/i) || "").split(/\s+-\s+/);
  if (enquiries) out.push({ icon: "real-inquiries", text: enquiries });
  if (rank) out.push({ icon: "genuine-failure-data", text: rank });
  const generations = (hero.tagPill || "").split(" • ").find((s) => /generation/i.test(s)) || find(/generation/i);
  if (generations) out.push({ icon: "knowledge-centre", text: generations.replace(/<[^>]+>/g, "") });
  const codes = find(/engine codes?/i);
  if (codes) out.push({ icon: "generation-honest-rated", text: codes });
  const partOf = find(/^part of/i);
  if (partOf) out.push({ icon: "part-of-engine-finders", text: partOf });
  return out;
}

// "#1 Most-Enquired Velar Model" -> { value: "#1", label: "Most-Enquired<br>Velar Model" }; the
// label breaks after its first word (not before a year like "(2025)") and [EM-VERIFIED] takes its
// own line in green, as in the reference
function splitStat(text = "") {
  const m = text.match(/^(#?[\d,.]+\+?)\s+(.+)$/);
  const value = m ? m[1] : "";
  let label = (m ? m[2] : text).replace(/\s*\[EM-VERIFIED\]/g, "").trim();
  if (!/<br/i.test(label)) label = label.replace(/^(\S+)\s+(?!\(\d)/, "$1<br>");
  const verified = /\[EM-VERIFIED\]/.test(text);
  return { value, label, verified };
}

function StatsStrip({ items }) {
  const odd = items.length % 2 === 1;
  return (
    <ul className="grid grid-cols-2 overflow-hidden rounded-xl border border-lr-line bg-lr-card/95 shadow-[0_24px_60px_-42px_var(--lr-shadow)] backdrop-blur-sm lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:rounded-2xl lg:py-1">
      {items.map((item, i) => {
        const partOf = (item.text || "").match(/^Part of\s+(.+)$/i);
        const { value, label, verified } = splitStat(item.text);
        const spanAll = odd && i === items.length - 1;
        return (
          <li
            key={item.text}
            className={`relative flex min-w-0 flex-col items-start gap-2.5 px-4 py-4 sm:flex-row sm:items-center sm:gap-3.5 sm:px-5 md:px-6 lg:justify-center lg:gap-4 lg:border-0 lg:px-4 lg:py-5 xl:gap-5 xl:px-6
              ${i % 2 === 1 ? "border-l border-lr-line" : ""} ${i >= 2 ? "border-t border-lr-line" : ""} ${spanAll ? "col-span-2 flex-row items-center gap-3.5 lg:col-span-1" : ""}
              ${i > 0 ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[64%] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-lr-line" : ""}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lr-brand sm:h-14 sm:w-14 lg:h-[60px] lg:w-[60px] xl:h-[70px] xl:w-[70px] dark:border dark:border-lr-gold-line/55 dark:bg-transparent">
              <LrIcon name={item.icon || "genuine-failure-data"} tone="skin" className="h-6 w-6 sm:h-7 sm:w-7 xl:h-9 xl:w-9" />
            </span>
            <p className="min-w-0 text-[14px] leading-[1.4] text-lr-head sm:text-[15px] xl:text-[16px]">
              {partOf ? (
                <>
                  <span className="block">Part of</span>
                  <strong className="block font-semibold text-lr-head dark:font-medium dark:text-lr-green">{partOf[1]}</strong>
                </>
              ) : (
                <>
                  {value && (
                    <span className="mb-1 block text-[22px] font-semibold leading-none text-lr-ink sm:text-[24px] xl:text-[28px] dark:font-medium dark:text-lr-green">
                      {value}
                    </span>
                  )}
                  <span className={`block ${value ? "" : "font-semibold"}`} dangerouslySetInnerHTML={{ __html: label }} />
                  {verified && <span className="block font-medium text-lr-ink dark:text-lr-green">[EM-VERIFIED]</span>}
                </>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function OneLineVerdict({ text }) {
  return (
    <div className="relative flex gap-4 rounded-xl border border-lr-line bg-lr-card/95 p-4 pr-10 shadow-[0_24px_50px_-36px_var(--lr-shadow)] backdrop-blur-md sm:gap-5 sm:p-5 sm:pr-14 xl:rounded-2xl xl:p-6 xl:pr-16">
      <LrIcon name="genuine-failure-data" tone="current" className="h-12 w-12 text-lr-ink sm:h-14 sm:w-14 xl:h-16 xl:w-16 dark:text-lr-green" />
      <div className="min-w-0">
        <p className="text-[17px] font-semibold leading-snug text-lr-ink xl:text-[19px] dark:text-lr-green">One-line verdict:</p>
        <p className={`${BODY_SM} mt-1.5 text-lr-body`} dangerouslySetInnerHTML={{ __html: prose(text) }} />
      </div>
      <LrIcon name="quote" tone="current" className="absolute right-4 top-4 h-5 w-5 rotate-180 text-lr-ink sm:right-5 sm:top-5 xl:h-6 xl:w-6 dark:text-lr-green" />
    </div>
  );
}

export default function OwnershipVerdict({ data, slug = "", hero }) {
  if (!data) return null;
  const stats = deriveStats(data, hero);

  const h2 = (data.h2 || "").replace(/\s+-\s+/, " - ");
  const dash = h2.indexOf(" - ");
  const lead = dash === -1 ? h2 : h2.slice(0, dash);
  const accent = dash === -1 ? "" : h2.slice(dash + 3);
  const car = CARS.has(slug) ? slug : "";
  const art = car && {
    "--car-day": `url(/model/hero/${car}-car-day.webp)`,
    "--car-night": `url(/model/hero/${car}-car-night.webp)`,
    "--car-day-m": `url(/model/hero/${car}-car-day-m.webp)`,
    "--car-night-m": `url(/model/hero/${car}-car-night-m.webp)`,
  };

  return (
    <section className={`relative overflow-hidden bg-lr-band text-lr-head ${SANS}`} style={art || undefined}>
      {car && <div className={`pointer-events-none absolute inset-y-0 left-0 hidden w-[54%] bg-cover bg-[center_bottom] xl:block ${BG_DESKTOP} ${BACKDROP_FADE}`} aria-hidden="true" />}

      <div className={`relative ${CONTAINER} grid gap-5 py-6 md:gap-7 md:py-7 xl:grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)] xl:items-start xl:gap-x-6 xl:gap-y-6 xl:py-8`}>
        <div className="flex min-w-0 flex-col xl:self-stretch">
          <Eyebrow>Ownership Verdict</Eyebrow>
          {/* 44-48px beside the table so "… - / The Ownership Verdict" holds two lines, as in the reference */}
          <h2 className={`${H2_MODEL} mt-3 text-lr-head md:mt-4`}>
            {lead}
            {accent && (
              <>
                {" "}-<br />
                <span className="text-lr-ink dark:text-lr-green">{accent}</span>
              </>
            )}
          </h2>
          {data.subHeadline && (
            // tablet and up only; full-strength heading colour (near-white at night, with a soft
            // shadow so it holds over the storm backdrop) so it reads in both themes
            <p
              className={`${INTRO} relative hidden max-w-[31em]! text-lr-head/85! md:block dark:text-lr-head! dark:[text-shadow:0_1px_12px_rgba(0,0,0,0.65)]`}
              dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }}
            />
          )}

          {car && (
            <div className="relative -mx-5 sm:-mx-6 mt-4 aspect-[16/11] sm:aspect-[16/10] md:-mx-10 md:mt-6 lg:aspect-[2/1] xl:mx-0 xl:mt-8 xl:flex xl:aspect-auto xl:flex-1 xl:items-end" aria-hidden="true">
              <div className={`absolute inset-0 bg-cover bg-[center_bottom] xl:hidden ${BG_MOBILE} ${PHOTO_FADE}`} />
              <div className={`absolute bottom-[6%] left-1/2 w-[86%] max-w-[620px] -translate-x-1/2 lg:max-w-[700px] xl:static xl:w-[94%] xl:max-w-none xl:translate-x-0 ${CAR_ART}`} />
            </div>
          )}

          {data.oneLineVerdict && (
            <div className={`relative ${car ? "-mt-10 sm:-mt-14 xl:-mt-10" : "mt-6"}`}>
              <OneLineVerdict text={data.oneLineVerdict} />
            </div>
          )}
        </div>

        <VerdictTable metrics={data.metrics || []} />

        {stats.length > 0 && (
          <div className="xl:col-span-2">
            <StatsStrip items={stats} />
          </div>
        )}
      </div>
    </section>
  );
}
