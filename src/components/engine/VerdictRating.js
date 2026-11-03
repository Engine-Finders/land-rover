import Image from "next/image";
import { CONTAINER, GOLD, INK, SANS, SERIF_BOLD } from "@/components/engine/engineTheme";

// Engine section: Verdict & Rating - rating stars, confidence line, verdict quote and best-for /
// avoid-if cards on the left; the five-row Engine Score breakdown with its total on the right.
// Copy from the page's `verdictRating` JSON. Fixed light design; a faded engine sits behind the
// lower left cards. 2xl values are the reference design at 1672px; xl is the same layout scaled
// for 1280-1535px; below xl the columns stack.

const SERIF = SERIF_BOLD;

/* ---------- line icons ---------- */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const GLYPHS = {
  shield: (
    <>
      <path {...line} d="M12 3 19 5.8v5.8c0 4.4-3 7.5-7 9.2-4-1.7-7-4.8-7-9.2V5.8z" />
      <path fill="none" stroke={GOLD} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" d="m8.8 12.1 2.2 2.2 4.3-4.5" />
    </>
  ),
  pound: (
    <>
      <circle {...line} cx="12" cy="12" r="8.6" />
      <path {...line} d="M14.6 8.4a2.6 2.6 0 0 0-4.6 1.7v5.8M8.6 12.6h4.6M8.4 15.9h7" />
    </>
  ),
  tools: (
    <>
      <path {...line} d="M14.2 6.4a3.4 3.4 0 0 0 4.3 4.3L9.4 19.8a1.6 1.6 0 0 1-2.3-2.3zM14.2 6.4a3.4 3.4 0 0 1 4.2-2.1l-2 2 .3 1.8 1.8.3 2-2a3.4 3.4 0 0 1-2.1 4.2" />
      <path {...line} d="m4.2 4.2 2.4-.9 5.2 5.2-1.5 1.5-5.2-5.2zM12.9 13.1l5.6 5.6a1.4 1.4 0 0 1-2 2l-5.6-5.6" />
    </>
  ),
  cube: (
    <>
      <path {...line} d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2z" />
      <path {...line} d="M4 7.2 12 11.6l8-4.4M12 11.6v9.6" />
      <circle cx="8.4" cy="13" r="0.9" fill="currentColor" />
      <circle cx="15.6" cy="13" r="0.9" fill="currentColor" />
      <circle cx="12" cy="7.2" r="0.9" fill="currentColor" />
    </>
  ),
  chart: (
    <>
      <path {...line} d="M3.5 20.5h17" />
      <rect {...line} x="5" y="12" width="3" height="8.5" rx="0.4" />
      <rect {...line} x="10.5" y="6" width="3" height="14.5" rx="0.4" />
      <rect {...line} x="16" y="9.5" width="3" height="11" rx="0.4" />
    </>
  ),
};
const ICON_BY_DIMENSION = [
  [/reliab/i, "shield"],
  [/cost/i, "pound"],
  [/repairab/i, "tools"],
  [/parts/i, "cube"],
  [/econom/i, "chart"],
];

const Svg = ({ name, className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
    {GLYPHS[name]}
  </svg>
);

// card icons drawn on viewBoxes cropped to their outlines, so the box size is the visible size
function ShieldCheckIcon({ className }) {
  return (
    <svg viewBox="3 1.6 18 20.8" className={className} aria-hidden="true" style={{ color: INK }}>
      <path {...line} strokeWidth="1.9" d="M12 2.6 19.6 5.6v6c0 4.7-3.2 8-7.6 9.8-4.4-1.8-7.6-5.1-7.6-9.8v-6z" />
      <path {...line} strokeWidth="2.1" d="m8.6 12 2.4 2.4 4.5-4.7" />
    </svg>
  );
}
function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="2.1 2.1 19.8 19.8" className={className} aria-hidden="true">
      <circle {...line} strokeWidth="1.4" cx="12" cy="12" r="9.2" />
      <path {...line} strokeWidth="1.6" d="m7.8 12.3 2.8 2.8 5.6-5.8" />
    </svg>
  );
}
function WarningIcon({ className }) {
  return (
    <svg viewBox="2.1 2.4 19.8 18.6" className={className} aria-hidden="true">
      <path {...line} strokeWidth="1.4" d="M10.4 4.1a1.85 1.85 0 0 1 3.2 0l7.6 13.4a1.85 1.85 0 0 1-1.6 2.8H4.4a1.85 1.85 0 0 1-1.6-2.8z" />
      <path {...line} strokeWidth="1.6" d="M12 9.2v4.8" />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" />
    </svg>
  );
}

const STAR_PATH = "m12 2.4 2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.1l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z";

function Star({ fill }) {
  return (
    <svg viewBox="2.6 2.4 18.8 17.9" className="h-full w-full" aria-hidden="true">
      <path fill={fill} d={STAR_PATH} />
    </svg>
  );
}

// "★★★★½ out of 5" -> 4 full stars and a half star (green left half, gold right half)
function Stars({ rating = "" }) {
  const full = (rating.match(/★/g) || []).length;
  const half = rating.includes("½");
  const out = Number((rating.match(/out of (\d+)/) || [])[1] || 5);
  return (
    <span className="flex items-center gap-1.5 min-[360px]:gap-2 md:gap-[14px] xl:ml-[4px] xl:gap-[20px] 2xl:ml-[5px] 2xl:gap-[24px]" role="img" aria-label={`${full}${half ? ".5" : ""} out of ${out} stars`}>
      {Array.from({ length: out }).map((_, i) => (
        <span key={i} className="relative h-8 w-[34px] min-[360px]:h-9 min-[360px]:w-[38px] md:h-[50px] md:w-[52px] xl:h-[46px] xl:w-[48px] 2xl:h-[54px] 2xl:w-[57px]">
          {i < full ? (
            <Star fill={INK} />
          ) : i === full && half ? (
            <>
              <Star fill="#cdb07a" />
              <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                <span className="block h-full w-[200%]">
                  <Star fill={INK} />
                </span>
              </span>
            </>
          ) : (
            <Star fill="#dcd8cd" />
          )}
        </span>
      ))}
    </span>
  );
}

/* ---------- data helpers ---------- */
const dash = (t = "") => t.replace(/ - /g, " — ");

// "18 (Star rating (4.5★) × 4 = 18)" -> { value: "18", detail: "(Star rating (4.5★) × 4 = 18)" }
function splitScore(score = "") {
  const m = score.match(/^\s*(\d+)(?:\s*\/\s*(\d+))?\s*([\s\S]*)$/);
  return m ? { value: m[1], outOf: m[2] || "", detail: dash(m[3].trim()) } : { value: "", outOf: "", detail: dash(score) };
}

function splitConfidence(text = "") {
  const m = text.match(/^(\d+%\s*confidence)\s*[-–—]\s*([\s\S]*)$/i);
  return m ? { lead: m[1], rest: m[2] } : { lead: "", rest: text };
}

const CARD = "relative rounded-xl border border-[#ebe8e0] bg-white shadow-[0_14px_36px_-24px_rgba(31,42,34,0.35)]";

function IconDisc({ name }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3f2ee] shadow-[inset_0_0_0_1px_#e7e5de,0_3px_8px_-3px_rgba(0,0,0,0.12)] md:my-4 md:h-14 md:w-14 xl:my-[16px] xl:h-[60px] xl:w-[60px] 2xl:my-[19px] 2xl:h-[70px] 2xl:w-[70px]"
      style={{ color: "#1c3a28" }}
    >
      <Svg name={name} className="h-[26px] w-[26px] md:h-[34px] md:w-[34px] xl:h-[38px] xl:w-[38px] 2xl:h-[44px] 2xl:w-[44px]" />
    </span>
  );
}

// one grid template so the explanation and score columns line up on every row (and the total);
// the score column runs to the card edge so its divider spans the full row
const GRID =
  "grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-3 px-4 sm:px-5 md:grid-cols-[56px_150px_minmax(0,1fr)_128px] md:gap-x-5 md:pr-0 xl:grid-cols-[60px_140px_minmax(0,1fr)_170px] xl:gap-x-[22px] 2xl:grid-cols-[70px_165px_minmax(0,1fr)_204px] 2xl:gap-x-[27px]";
const ROW_GRID = `${GRID} md:pl-6 xl:pl-[23px] 2xl:pl-[27px]`;
// header + total rows: text starts a little right of the icon discs, as in the reference
const HEAD_GRID = `${GRID} md:pl-[30px] xl:pl-[28px] 2xl:pl-[33px]`;

export default function VerdictRating({ data }) {
  if (!data) return null;

  const confidence = splitConfidence(data.confidence);
  const rows = data.scoreBreakdown?.rows || [];
  const totalRow = rows.find((r) => /^total/i.test(r.dimension));
  const dimensions = rows.filter((r) => r !== totalRow);
  const total = totalRow ? splitScore(totalRow.score) : null;
  const [dimensionCol = "Dimension", scoreCol = "Score (of 20)"] = data.scoreBreakdown?.columns || [];
  const outOf = (scoreCol.match(/(\d+)/) || [])[1] || "20";

  return (
    <section className="relative overflow-hidden bg-[#fbf9f5] text-[#1b1d1a]" style={SANS}>
      <div className={`relative ${CONTAINER} grid gap-7 pb-12 pt-10 md:gap-8 md:pb-14 md:pt-12 xl:grid-cols-[minmax(0,590fr)_minmax(0,945fr)] xl:gap-x-[29px] 2xl:grid-cols-[590px_minmax(0,945px)] xl:pb-[34px] xl:pt-[23px] 2xl:gap-x-[34px] 2xl:pb-[39px] 2xl:pt-[27px]`}>
        {/* ---------- left: heading + verdict cards ---------- */}
        <div className="relative">
          {/* faded engine behind the lower cards */}
          <div className="pointer-events-none absolute -bottom-14 -left-20 aspect-[616/536] w-[min(560px,118%)] [mask-image:linear-gradient(to_top,black_50%,transparent_92%)] md:-bottom-16 xl:-bottom-[72px] xl:-left-[84px] xl:w-[480px] 2xl:-bottom-[84px] 2xl:-left-[100px] 2xl:w-[560px]" aria-hidden="true">
            <Image src="/engine-verdict/engine-faded.webp" alt="" fill sizes="560px" className="object-contain object-left-bottom" />
          </div>

          <div className="relative">
            <p className="flex items-center gap-3 text-[12.5px] font-semibold uppercase leading-5 tracking-[0.04em] md:text-[14px] xl:gap-[10px] xl:text-[13.5px] 2xl:gap-[12px] 2xl:text-[15px] 2xl:tracking-[0.01em]" style={{ color: INK }}>
              <span className="h-[2px] w-7 xl:w-[24px] 2xl:w-[28px]" style={{ background: GOLD }} aria-hidden="true" />
              Our Verdict
            </p>
            <h2 className="mt-2 text-[31px] leading-[1.15] md:text-[37px] xl:mt-[10px] xl:text-[34px] 2xl:mt-[12px] 2xl:text-[40px]" style={{ ...SERIF, color: INK }}>
              Verdict &amp; Rating
            </h2>
            <span className="mt-2.5 block h-[3px] w-[60px] rounded-full xl:mt-[8px] xl:w-[57px] 2xl:mt-[9px] 2xl:h-[4px] 2xl:w-[66px]" style={{ background: GOLD }} aria-hidden="true" />

            <div className="mt-6 grid gap-3 md:mt-7 md:gap-3.5 xl:mt-[15px] xl:gap-[10px] 2xl:mt-[17px] 2xl:gap-[11px]">
              {data.starRating && (
                <article className={`${CARD} px-5 py-5 md:px-9 md:py-7 xl:px-[33px] xl:pb-[27px] xl:pt-[26px] 2xl:px-[38px] 2xl:pb-[32px] 2xl:pt-[31px]`}>
                  <p className="text-[18px] leading-none text-[#1b1d1a] md:text-[22px] xl:text-[18.5px] 2xl:text-[21px]" style={SERIF}>
                    Rating:
                  </p>
                  <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2 min-[360px]:gap-x-4 sm:flex-nowrap md:mt-5 md:gap-x-6 xl:mt-[19px] xl:gap-x-[28px] 2xl:mt-[22px] 2xl:gap-x-[33px]">
                    <Stars rating={data.starRating} />
                    <span className="whitespace-nowrap pb-1 text-[15px] leading-none text-[#3b3b3b] md:text-[19px] xl:pb-[3px] xl:text-[18px] 2xl:pb-[4px] 2xl:text-[21px]">
                      out of {(data.starRating.match(/out of (\d+)/) || [])[1] || 5}
                    </span>
                  </div>
                </article>
              )}

              {data.confidence && (
                <article className={`${CARD} flex items-center gap-4 px-5 py-5 md:gap-7 md:px-9 md:py-6 xl:items-start xl:gap-[37px] xl:px-[34px] xl:pb-[11px] xl:pt-[16px] 2xl:gap-[41px] 2xl:px-[40px] 2xl:pb-[12px] 2xl:pt-[19px]`}>
                  <ShieldCheckIcon className="h-12 w-10 shrink-0 md:h-[64px] md:w-[53px] xl:mt-[3px] xl:h-[58px] xl:w-[50px] 2xl:h-[68px] 2xl:w-[59px]" />
                  <p className="text-[15px] leading-[1.6] text-[#1b1d1a] md:text-[18px] xl:text-[17px] xl:leading-[26px] 2xl:text-[20px] 2xl:leading-[30px]">
                    {confidence.lead && <strong className="font-semibold" style={{ color: INK }}>{confidence.lead}</strong>}
                    {confidence.lead ? " — " : ""}
                    <span dangerouslySetInnerHTML={{ __html: confidence.rest }} />
                  </p>
                </article>
              )}

              {data.oneLineVerdict && (
                <figure className={`${CARD} pb-11 pl-[52px] pr-5 pt-5 md:py-7 md:pl-[100px] md:pr-16 xl:pb-[19px] xl:pl-[88px] xl:pr-[55px] xl:pt-[21px] 2xl:pb-[23px] 2xl:pl-[102px] 2xl:pr-[64px] 2xl:pt-[24px]`}>
                  <span className="absolute left-4 top-6 text-[44px] leading-[0.7] md:left-8 md:top-9 md:text-[64px] xl:left-[22px] xl:top-[18px] xl:text-[84px] xl:leading-none 2xl:left-[25px] 2xl:top-[21px] 2xl:text-[98px]" style={{ ...SERIF, fontWeight: 400, color: GOLD }} aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className="text-[15.5px] leading-[1.6] text-[#1b1d1a] md:text-[18px] xl:text-[17px] xl:leading-[25px] 2xl:text-[20px] 2xl:leading-[29px]" dangerouslySetInnerHTML={{ __html: dash(data.oneLineVerdict) }} />
                  <span className="absolute bottom-2 right-5 text-[44px] leading-[0.7] md:bottom-5 md:right-8 md:text-[64px] xl:-bottom-[35px] xl:right-[21px] xl:text-[84px] xl:leading-none 2xl:-bottom-[38px] 2xl:right-[24px] 2xl:text-[98px]" style={{ ...SERIF, fontWeight: 400, color: GOLD }} aria-hidden="true">
                    &rdquo;
                  </span>
                </figure>
              )}

              {(data.bestFor || data.avoidIf) && (
                <div className="grid gap-3 min-[480px]:grid-cols-2 md:gap-3.5 xl:gap-[12px] 2xl:gap-[14px]">
                  {data.bestFor && (
                    <article className={`${CARD} flex gap-3.5 p-5 md:gap-4 md:px-6 md:py-6 xl:gap-[17px] xl:pb-[8px] xl:pl-[20px] xl:pr-[5px] xl:pt-[19px] 2xl:gap-[20px] 2xl:pb-[9px] 2xl:pl-[23px] 2xl:pr-[6px] 2xl:pt-[23px]`}>
                      <CheckCircleIcon className="h-11 w-11 shrink-0 text-[#1b1d1a] md:h-[50px] md:w-[50px] xl:mt-[2px] xl:h-[42px] xl:w-[42px] 2xl:h-[49px] 2xl:w-[49px]" />
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold leading-6 md:text-[18px] xl:text-[16.5px] xl:leading-[21px] 2xl:text-[19px] 2xl:leading-[24px]" style={{ color: INK }}>Best for:</p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[#2b2c29] md:text-[14.5px] xl:mt-[5px] xl:text-[13.5px] xl:leading-[20px] 2xl:mt-[6px] 2xl:text-[14.5px] 2xl:leading-[22px]" dangerouslySetInnerHTML={{ __html: data.bestFor }} />
                      </div>
                    </article>
                  )}
                  {data.avoidIf && (
                    <article className={`${CARD} flex gap-3.5 p-5 md:gap-4 md:px-6 md:py-6 xl:gap-[17px] xl:pb-[8px] xl:pl-[20px] xl:pr-[5px] xl:pt-[19px] 2xl:gap-[20px] 2xl:pb-[9px] 2xl:pl-[23px] 2xl:pr-[6px] 2xl:pt-[23px]`}>
                      <WarningIcon className="h-[42px] w-[45px] shrink-0 text-[#b23421] md:h-[47px] md:w-[50px] xl:mt-[2px] xl:h-[40px] xl:w-[42px] 2xl:h-[46px] 2xl:w-[49px]" />
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold leading-6 text-[#a3241a] md:text-[18px] xl:text-[16.5px] xl:leading-[21px] 2xl:text-[19px] 2xl:leading-[24px]">Avoid if:</p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[#2b2c29] md:text-[14.5px] xl:mt-[5px] xl:text-[13.5px] xl:leading-[20px] 2xl:mt-[6px] 2xl:text-[14.5px] 2xl:leading-[22px]" dangerouslySetInnerHTML={{ __html: data.avoidIf }} />
                      </div>
                    </article>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- right: score breakdown ---------- */}
        {dimensions.length > 0 && (
          <div className={`${CARD} self-start overflow-hidden rounded-2xl xl:mt-[9px] 2xl:mt-[10px] 2xl:max-w-[945px]`}>
            <p className="px-4 py-5 text-[18.5px] leading-[1.25] sm:px-5 md:px-[30px] md:py-6 md:text-[22px] xl:pb-[14px] xl:pl-[28px] xl:pt-[22px] xl:text-[19px] 2xl:pb-[17px] 2xl:pl-[33px] 2xl:pt-[25px] 2xl:text-[22px]" style={{ ...SERIF, color: INK }}>
              {data.scoreNote || "Engine Score breakdown:"}
            </p>
            <div className={`${HEAD_GRID} border-y border-[#ebe8e0] bg-[#f6f4f0] py-3 text-[13.5px] font-semibold leading-[1.3] text-[#1b1d1a] md:py-[13px] md:text-[16px] xl:py-[11px] xl:text-[15.5px] 2xl:py-[13px] 2xl:text-[18px]`}>
              <span className="col-span-2 md:col-span-3">{dimensionCol}</span>
              <span className="text-right md:text-center">{scoreCol}</span>
            </div>

            <ul>
              {dimensions.map((r) => {
                const s = splitScore(r.score);
                const icon = (ICON_BY_DIMENSION.find(([re]) => re.test(r.dimension)) || [])[1] || "shield";
                return (
                  <li key={r.dimension} className={`${ROW_GRID} border-b border-[#ebe8e0] py-4 md:py-0`}>
                    <IconDisc name={icon} />
                    <p className="text-[16px] font-semibold leading-[1.25] text-[#1b1d1a] md:text-[17px] xl:text-[18px] 2xl:text-[21px]">{r.dimension}</p>
                    <p className="col-start-3 row-start-1 flex justify-end self-center md:col-start-4 md:h-full md:items-center md:justify-center md:self-stretch md:border-l md:border-[#ebe8e0] xl:justify-end xl:pr-[44px] 2xl:pr-[52px]">
                      <span className="flex items-baseline gap-1.5 md:gap-2.5 xl:gap-[15px] 2xl:gap-[18px]">
                        <span className="text-[26px] font-semibold leading-none md:text-[36px] xl:text-[40px] 2xl:text-[47px]" style={{ color: INK }}>{s.value}</span>
                        <span className="text-[14px] leading-none text-[#5c5d5a] md:text-[20px] xl:text-[24px] 2xl:text-[28px]">/{outOf}</span>
                      </span>
                    </p>
                    <p className="col-span-2 col-start-2 row-start-2 mt-1.5 text-[13.5px] leading-[1.55] text-[#2b2c29] md:col-span-1 md:col-start-3 md:row-start-1 md:mt-0 md:py-[13px] md:text-[14.5px] md:leading-[22px] xl:py-[12px] xl:text-[15px] xl:leading-[23px] 2xl:py-[14px] 2xl:text-[17.5px] 2xl:leading-[26px]">
                      <strong className="font-semibold text-[#1b1d1a]">{s.value}</strong> <span dangerouslySetInnerHTML={{ __html: s.detail }} />
                    </p>
                  </li>
                );
              })}
            </ul>

            {total && (
              <div className={`${HEAD_GRID} py-4 md:py-5 xl:py-[14px] 2xl:py-4`}>
                <p className="col-span-2 text-[14px] font-semibold uppercase tracking-[0.02em] text-[#1b1d1a] md:col-span-3 md:text-[16px] xl:text-[17px] 2xl:text-[19.5px]">Total Engine Score</p>
                <p className="flex items-baseline justify-end gap-1.5 md:justify-center md:gap-2.5 xl:justify-end xl:gap-[15px] xl:pr-[47px] 2xl:gap-[20px] 2xl:pr-[56px]">
                  <span className="text-[34px] font-semibold leading-none md:text-[42px] 2xl:text-[48px]" style={{ color: INK }}>{total.value}</span>
                  <span className="text-[16px] leading-none text-[#5c5d5a] md:text-[22px] xl:text-[25px] 2xl:text-[29px]">/{total.outOf || 100}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
