import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose, splitHeading } from "@/components/models/modelKit";
import { localHtml } from "@/components/models/generationsFaqLinks";
import { engineDbCar } from "./genKit";

// Generation page section 5 - ownership economics, built to the approved Defender L316 references
// (day + night): the eyebrow, the "… - / Ownership Economics" headline with "Economics" in green and a
// split rule; on the right the Highland hillside with the generation's car and the green-and-gold
// stripe at the screen's edge, standing on the table's top edge. The six-column table (icons in the
// head, the engine in green, the verdict with its own icon - check, star, thumbs-up, warning,
// exclamation, info - and its label in bold), then "The <code> rule" card (balance scales, the rule in
// two paragraphs, its closing line in green) beside the Key Takeaways (three questions, round icons).
// Phones / tablets: the copy, the car full-bleed, one card per engine, the two cards stacked.

const BG = "bg-[url(/home/hero-loch-day-m.webp)] sm:bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:dark:bg-[url(/home/hero-loch-night.webp)]";
const KEYS = ["engine", "typicalMileage", "commonMajorFailure", "repairCostSpecialist", "replacementCostRecon", "ownershipVerdict"];
const DEFAULT_COLUMNS = ["Engine", "Typical Mileage", "Common Major Failure", "Repair Cost (Specialist)", "Replacement Cost (Recon)", "Ownership Verdict"];
// column widths (%), from the reference
const WIDTHS = [12.5, 15, 18.5, 13, 16.5, 24.5];
const html = (raw) => localHtml(prose(raw || ""));
const LINKS = "[&_a]:text-inherit [&_a]:no-underline hover:[&_a]:underline";

// ------------------------------------------------------------------ icons

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

function WarnIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
      <g {...STROKE}>
        <path d="M10.4 4.2 2.6 17.8a1.8 1.8 0 0 0 1.6 2.7h15.6a1.8 1.8 0 0 0 1.6-2.7L13.6 4.2a1.8 1.8 0 0 0-3.2 0Z" />
        <path d="M12 9.6v4.6M12 17.2h.01" />
      </g>
    </svg>
  );
}

// header icon per column
function HeadIcon({ index }) {
  const cls = "h-6 w-6 shrink-0 xl:h-7 xl:w-7";
  if (index === 2) return <WarnIcon className={cls} />;
  const name = ["drivetrain-failures", "meter", null, "commercial", "engine", "genuine-failure-data"][index];
  return <LrIcon name={name} tone="current" className={cls} />;
}

// "Best Diesel - the Defender's most dependable engine" -> { label, rest, kind }
const VERDICTS = [
  [/highest risk|avoid|most expensive|expensive/i, "alert"],
  [/risk vs reward|caution|complex|watch/i, "warn"],
  [/enthusiast|niche|rare|future|specialist/i, "info"],
  [/best value|value/i, "thumb"],
  [/best (?:diesel|petrol)|best overall|top/i, "star"],
];
function splitVerdict(raw = "") {
  const text = String(raw).trim();
  const m = text.match(/^(.*?)\s+[-–-]\s+(.*)$/);
  const label = m ? m[1] : text;
  return { label, rest: m ? m[2] : "", kind: VERDICTS.find(([re]) => re.test(label))?.[1] || "check" };
}

const VERDICT_TONE = {
  check: "text-lr-ink dark:text-lr-green",
  star: "text-lr-ink dark:text-lr-green",
  thumb: "text-lr-ink dark:text-lr-green",
  warn: "text-[#d9921c] dark:text-[#f0b54f]",
  alert: "text-[#d32f2f] dark:text-[#ff8a8a]",
  info: "text-[#2f6fd6] dark:text-[#8eb4ff]",
};

function VerdictIcon({ kind, className = "" }) {
  return (
    <svg viewBox="0 0 28 28" className={`shrink-0 ${VERDICT_TONE[kind]} ${className}`} aria-hidden="true">
      <g {...STROKE}>
        {kind === "warn" ? (
          <>
            <circle cx="14" cy="14" r="12" />
            <path d="M12.9 8.4 8.2 16.6a1.3 1.3 0 0 0 1.1 1.9h9.4a1.3 1.3 0 0 0 1.1-1.9l-4.7-8.2a1.3 1.3 0 0 0-2.2 0Z" strokeWidth="1.5" />
            <path d="M14 11.6v2.8M14 16.4h.01" strokeWidth="1.6" />
          </>
        ) : (
          <>
            <circle cx="14" cy="14" r="12" />
            {kind === "check" && <path d="m9 14.4 3.4 3.4 6.8-7.4" strokeWidth="2" />}
            {kind === "star" && <path d="m14 7.8 1.9 3.9 4.3.6-3.1 3 .7 4.3L14 17.6l-3.8 2 .7-4.3-3.1-3 4.3-.6L14 7.8Z" strokeWidth="1.5" />}
            {kind === "thumb" && <path d="M10.6 13v6.6M10.6 13l2.6-4.6c.9 0 1.7.8 1.5 1.8l-.4 2h3.6c.9 0 1.6.8 1.4 1.7l-.9 4.4a1.6 1.6 0 0 1-1.6 1.3h-6.2M8 13h2.6v6.6H8Z" strokeWidth="1.5" />}
            {kind === "alert" && <path d="M14 8.4v7M14 19.2h.01" strokeWidth="2.2" />}
            {kind === "info" && <path d="M14 12.6v7M14 8.8h.01" strokeWidth="2.2" />}
          </>
        )}
      </g>
    </svg>
  );
}

function Verdict({ value }) {
  const v = splitVerdict(value);
  return (
    <span className="flex items-center gap-3 text-left">
      <VerdictIcon kind={v.kind} className="h-7 w-7" />
      <span className="min-w-0 leading-snug">
        <strong className="font-semibold text-lr-head" dangerouslySetInnerHTML={{ __html: html(v.label) }} />
        {v.rest && <span className="text-lr-body" dangerouslySetInnerHTML={{ __html: ` - ${html(v.rest)}` }} />}
      </span>
    </span>
  );
}

// takeaway icons: piggy bank (least), coins with an arrow (most), diamond (best value)
function TakeawayIcon({ index }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lr-brand text-lr-on-brand xl:h-14 xl:w-14 dark:bg-lr-chip dark:text-lr-green">
      {index === 2 ? (
        <LrIcon name="niche-style" tone="current" className="h-6 w-6 xl:h-7 xl:w-7" />
      ) : (
        <svg viewBox="0 0 28 28" className="h-6 w-6 xl:h-7 xl:w-7" aria-hidden="true">
          {index === 0 ? (
            <path
              fill="currentColor"
              d="M12.6 7.2c-4.7 0-8.3 3-8.3 6.9 0 2 1 3.8 2.6 5l-.3 2.6c0 .5.4.9.9.9h2.1c.4 0 .7-.3.8-.7l.3-1.3c.6.1 1.2.2 1.9.2s1.3-.1 1.9-.2l.3 1.3c.1.4.4.7.8.7h2.1c.5 0 .9-.4.9-.9l-.3-2.4c1.1-.8 1.9-1.8 2.3-2.9h1.4c.5 0 .9-.4.9-.9v-2.5c0-.5-.4-.9-.9-.9h-1.4a6.9 6.9 0 0 0-1.9-2.6l.6-2.4c.1-.4-.3-.8-.7-.7l-2.7.8a10 10 0 0 0-3.2-.5Zm6.3 5.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
            />
          ) : (
            <g {...STROKE} strokeWidth="1.7">
              <ellipse cx="10" cy="9" rx="5.6" ry="2.2" />
              <path d="M4.4 9v3.4c0 1.2 2.5 2.2 5.6 2.2M4.4 12.4v3.4c0 1.2 2.5 2.2 5.6 2.2M4.4 15.8v3.4c0 1.2 2.5 2.2 5.6 2.2" />
              <circle cx="18.6" cy="17.6" r="5" />
              <path d="M18.6 15.2v4.8M16.6 17.2l2-2 2 2M20 4.4l2.2 2.2-2.2 2.2M22.2 6.6h-6" />
            </g>
          )}
        </svg>
      )}
    </span>
  );
}

// ------------------------------------------------------------------ rule text

// figures (prices, percentages) in the rule set in bold
const boldFigures = (s) => s.replace(/(£[\d,]+(?:–£[\d,]+)?|\d+(?:–\d+)?%)/g, '<strong class="font-semibold text-lr-head">$1</strong>');

// "A £3,200… one. Against … away. Value the vehicle first, then the engine." -> paragraphs + closing line
function ruleParts(text = "") {
  const sentences = html(text).trim().split(/(?<=[.!?])\s+(?=[A-Z])/);
  const last = sentences.length > 2 && sentences.at(-1).length < 70 ? sentences.pop() : "";
  return { paras: sentences.map(boldFigures), close: last };
}

// ------------------------------------------------------------------ backdrop

// the hillside behind the heading's right side, anchored to the screen's right edge and the
// table's top: by day it fades in from the left and ends at a pale band, a gold line and a sage band;
// at night the gold line edges a deep-green band. Sizes in vw, scaled from 1536px.
function Hillside({ car, className = "" }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 [clip-path:polygon(0_0,calc(100%-6.25vw)_0,calc(100%-15vw)_100%,0_100%)] [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.55)_26%,#000_50%)] dark:[clip-path:polygon(0_0,calc(100%-2.6vw)_0,calc(100%-11.5vw)_100%,0_100%)]">
        <div className={`absolute inset-0 bg-cover bg-[center_30%] ${BG} brightness-[1.05] contrast-[.92] hue-rotate-[14deg] saturate-[.78] dark:filter-none`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--sec-bg,#fff)_32%,transparent),transparent_70%)] dark:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(5,14,11,0.2),rgba(5,14,11,0.35))] dark:block" />
      </div>
      <svg viewBox="0 0 460 300" preserveAspectRatio="none" className="absolute bottom-0 right-0 h-full w-[29.95vw]">
        {/* day */}
        <g className="dark:hidden">
          <polygon points="364,0 424,0 309,300 229,300" fill="#cfd5c8" />
          <polygon points="424,0 428,0 313,300 309,300" fill="#d4bb8c" />
          <polygon points="428,0 600,0 485,300 313,300" fill="#7f8f78" />
        </g>
        {/* night */}
        <g className="hidden dark:inline">
          <polygon points="420,0 424,0 287,300 283,300" fill="#c9a35d" />
          <polygon points="424,0 600,0 463,300 287,300" fill="#173524" />
        </g>
      </svg>
      {car && (
        <div className="absolute bottom-[2px] right-[16vw] w-[23vw] max-w-[440px]">
          <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 23vw, 1px" />
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ section

export default function OwnershipEconomics({ data, hero = null, model = "" }) {
  if (!data) return null;

  const { lead, accent } = splitHeading(prose(data.h2 || ""));
  const accentWords = accent.split(" ");
  const accentLast = accentWords.pop();
  const columns = KEYS.map((_, i) => data.columns?.[i] || DEFAULT_COLUMNS[i]);
  const rows = data.rows || [];
  const car = engineDbCar(hero || { h1: data.h2 }, model);
  const rule = data.economicsRule || {};
  const { paras, close } = ruleParts(rule.text);
  const takeaways = data.keyTakeaways || [];

  return (
    <section className={`relative overflow-hidden bg-lr-page pb-6 text-lr-head md:pb-7 xl:pb-8 ${SANS}`}>
      <div className={`${CONTAINER} pt-6 md:pt-6 lg:pt-6 xl:pt-6`}>
        <div className="relative lg:pb-7">
          <Hillside car={car} className="absolute -top-10 bottom-0 right-[calc(50%-50vw)] hidden w-[60vw] lg:block xl:-top-11" />
          <div className="relative max-w-[760px] lg:max-w-[calc(52vw_-_56px)] xl:max-w-[calc(52vw_-_max(48px,50vw_-_752px)_-_16px)]">
            <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">Ownership Economics</p>
            <h2 className={`${H2_MODEL} mt-3.5 text-lr-head md:mt-4`}>
              {lead}
              {accent && (
                <>
                  {"\u00a0"}-<br />
                  {accentWords.length > 0 && `${accentWords.join(" ")} `}
                  <span className="text-lr-ink dark:text-lr-green">{accentLast}</span>
                </>
              )}
            </h2>
            <span className="mt-4 flex gap-1.5 md:mt-5" aria-hidden="true">
              <span className="h-[3px] w-11 rounded-full bg-lr-ink dark:bg-lr-green" />
              <span className="h-[3px] w-11 rounded-full bg-lr-gold-line" />
            </span>
          </div>
        </div>

        {/* phones / tablets: the hillside with the car, full-bleed */}
        {car && (
          <div className="relative -mx-5 mt-6 aspect-[2/1] sm:-mx-6 sm:aspect-[5/2] md:-mx-10 md:aspect-[3/1] lg:hidden" aria-hidden="true">
            <div className={`absolute inset-0 bg-cover bg-[center_70%] ${BG} brightness-[1.05] contrast-[.92] hue-rotate-[14deg] saturate-[.78] dark:filter-none [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_80%,transparent)]`} />
            <div className="absolute bottom-[8%] left-1/2 w-[56%] max-w-[400px] -translate-x-1/2 sm:w-[44%] md:w-[34%]">
              <GroundedCar src={car} sceneByTheme sizes="(max-width: 640px) 56vw, 400px" />
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <>
            {/* phones / tablets: one card per engine */}
            <ul className={`relative grid gap-3 md:grid-cols-2 md:gap-4 xl:hidden ${car ? "-mt-6 sm:-mt-8 lg:mt-0" : "mt-6"}`}>
              {rows.map((r, i) => (
                <li key={`${r.engine}-${i}`} className="min-w-0 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:p-5">
                  <h3 className={`text-[18px] font-semibold leading-snug text-lr-ink dark:text-lr-green ${LINKS}`} dangerouslySetInnerHTML={{ __html: html(r.engine) }} />
                  <div className="mt-2.5 text-[14px]">
                    <Verdict value={r.ownershipVerdict} />
                  </div>
                  <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-lr-line pt-3.5">
                    {[1, 3, 4, 2].map((k) => (
                      <div key={k} className={`min-w-0 ${k === 2 ? "col-span-2" : ""}`}>
                        <dt className="text-[13px] leading-snug text-lr-muted">{columns[k]}</dt>
                        <dd className={`mt-0.5 text-[14px] leading-snug text-lr-head ${k === 2 ? "" : "font-medium"} ${LINKS}`} dangerouslySetInnerHTML={{ __html: html(r[KEYS[k]]) || "-" }} />
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>

            {/* laptops: the table, on the hillside's foot */}
            <div className="relative hidden overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_28px_70px_-44px_var(--lr-shadow)] xl:block dark:bg-lr-card/85 dark:backdrop-blur-sm">
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">{prose(data.h2 || "")}</caption>
                <colgroup>
                  {WIDTHS.map((w, i) => (
                    <col key={i} style={{ width: `${w}%` }} />
                  ))}
                </colgroup>
                <thead className="border-b border-lr-line">
                  <tr>
                    {columns.map((c, i) => (
                      <th key={c} scope="col" className="border-r border-lr-line px-4 py-4 align-middle last:border-r-0 min-[1440px]:px-5">
                        <span className="flex items-center gap-2.5 text-[13px] font-semibold uppercase leading-snug tracking-[0.02em] text-lr-ink min-[1440px]:text-[14px] dark:text-lr-green">
                          <HeadIcon index={i} />
                          {c}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={`${r.engine}-${ri}`} className="border-t border-lr-line transition-colors first:border-t-0 hover:bg-lr-panel/50">
                      {KEYS.map((k, i) => (
                        <td
                          key={k}
                          className={`border-r border-lr-line px-4 py-3 align-middle leading-snug last:border-r-0 min-[1440px]:px-5 ${
                            i === 0
                              ? "text-[17px] font-semibold text-lr-ink min-[1440px]:text-[18px] dark:text-lr-green"
                              : i === 2
                                ? "text-[14px] text-lr-body min-[1440px]:text-[15px]"
                                : i === 5
                                  ? "text-[14px] min-[1440px]:text-[15px]"
                                  : "text-[16px] text-lr-head min-[1440px]:text-[17px]"
                          } ${LINKS}`}
                        >
                          {i === 5 ? <Verdict value={r[k]} /> : <span dangerouslySetInnerHTML={{ __html: html(r[k]) || "-" }} />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {(paras.length > 0 || takeaways.length > 0) && (
          <div className={`mt-5 grid gap-5 md:mt-6 ${paras.length && takeaways.length ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6" : ""}`}>
            {paras.length > 0 && (
              <article className="rounded-xl border border-lr-line bg-lr-card p-5 shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:p-6 xl:px-8 xl:py-7 dark:bg-lr-card/70">
                <h3 className="text-[17px] font-semibold uppercase leading-snug tracking-[0.02em] text-lr-ink md:text-[18px] xl:text-[20px] dark:text-lr-green">{rule.title || "The rule"}</h3>
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center xl:mt-2 xl:gap-8">
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-lr-line bg-lr-panel/60 text-lr-ink sm:h-24 sm:w-24 xl:h-[124px] xl:w-[124px] dark:border-lr-line-strong dark:bg-transparent dark:text-lr-green">
                    <LrIcon name="scale" tone="current" className="h-10 w-10 xl:h-14 xl:w-14" />
                  </span>
                  <div className="min-w-0 space-y-3.5 text-[15px] leading-[1.6] text-lr-body sm:border-l sm:border-lr-line sm:pl-6 xl:pl-8 xl:text-[16px]">
                    {paras.map((p, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                    ))}
                    {close && <p className="text-[16px] font-semibold text-lr-ink xl:text-[18px] dark:text-lr-green" dangerouslySetInnerHTML={{ __html: close }} />}
                  </div>
                </div>
              </article>
            )}
            {takeaways.length > 0 && (
              <article className="rounded-xl border border-lr-line bg-lr-card p-5 shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:p-6 xl:px-8 xl:py-7 dark:bg-lr-card/70">
                <h3 className="text-[17px] font-semibold uppercase leading-snug tracking-[0.02em] text-lr-ink md:text-[18px] xl:text-[20px] dark:text-lr-green">Key Takeaways</h3>
                <ul className="mt-3 divide-y divide-lr-line">
                  {takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-4 py-3.5 last:pb-0 sm:items-center xl:gap-5">
                      <TakeawayIcon index={i} />
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold leading-snug text-lr-ink xl:text-[17px] dark:text-lr-green" dangerouslySetInnerHTML={{ __html: html(t.question) }} />
                        <p className={`mt-1 text-[14px] leading-[1.55] text-lr-body xl:text-[16px] ${LINKS}`} dangerouslySetInnerHTML={{ __html: html(t.answer) }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
