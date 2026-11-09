import Link from "next/link";
import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import { LochBand, LochBanner } from "@/components/variant/PhotoScene";
import VIcon from "@/components/variant/VariantIcons";
import { stripArrow, stripBullet, topicIcon } from "@/components/variant/variantText";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H2, H5, ICON_LG, ICON_MD, ICON_SM } from "@/lib/typeScale";

// Variant sections 4-5: "Repair, Buy, or Replace?", built to the approved reference (day + night):
// a gold rule, serif title (the engine in green) and intro beside the car standing on the loch-side
// hillside; then "Can It Be Repaired?" (problem table) beside "Buying This ...? Check These First"
// (Buy If / Avoid If boxes); then the Closing Verdict with its shield beside the "Don't guess" compare
// card with the engine photo. Copy from the page's `repairBuyOrReplace` JSON; the intro defaults to
// the verdict's opening claim. Phones stack everything; the two card rows sit side by side from xl.

const SERIF = "font-[family-name:var(--font-serif-display)]";
const SANS = "font-[family-name:var(--font-instrument-sans)]";
const CARD = "rounded-lg border border-lr-line bg-lr-card/95 shadow-[0_14px_30px_-26px_var(--lr-shadow)] backdrop-blur-sm";
const CARD_TITLE = `${H5} text-lr-head`;
const dashify = (t = "") => String(t).replace(/ - /g, " — ");

/* ---------- icons ---------- */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
// topic pictogram for a problem / check line (brand set; a calendar for model-year advice)
function TopicIcon({ text = "", className = "" }) {
  const t = text.toLowerCase();
  let name = topicIcon(text);
  if (/pre-?19\d\d|example|model year/.test(t)) name = "generation-honest-rated";
  if (/timing belt|snapped/.test(t)) name = "chain";
  else if (/overheat|coolant/.test(t)) name = "cooling-system-2";
  else if (/head gasket/.test(t)) name = "ingenium";
  else if (/injection pump|injector/.test(t)) name = "injector";
  else if (/lift pump/.test(t)) name = "petrol";
  else if (/cold start|smoke/.test(t) && !/black smoke/.test(t)) name = "exhaust-and-emission";
  return <LrIcon name={name} tone="current" className={className} />;
}
function StatusDisc({ ok }) {
  const bg = ok === "no" ? "bg-lr-bad" : ok === "partial" ? "bg-lr-warn" : "bg-lr-good";
  return (
    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${bg}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        {ok === "no" ? <path d="M7 7l10 10M17 7 7 17" /> : <path d="m6 12.5 4 4 8-9" />}
      </svg>
    </span>
  );
}

// "✅ Yes" / "❌ Usually No" / "⚠️ Sometimes" -> status + label without the emoji
function repairable(value = "") {
  const label = value.replace(/^[^\p{L}\p{N}]+/u, "").trim() || value;
  if (value.includes("✅")) return { ok: "yes", label };
  if (value.includes("❌")) return { ok: "no", label };
  return { ok: "partial", label };
}
// `wrap` (table cells): a long label ("Yes (if caught early)") wraps beside its disc instead of
// running into the next column
function Status({ value, className = "", wrap = false }) {
  const { ok, label } = repairable(value);
  const tone = ok === "no" ? "text-lr-bad" : "text-lr-head";
  if (wrap) {
    return (
      <span className={`flex items-start gap-1.5 leading-snug ${tone} ${className}`}>
        <span className="flex h-[1.375em] shrink-0 items-center"><StatusDisc ok={ok} /></span>
        <span className="min-w-0 hyphens-auto">{label}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${tone} ${className}`}>
      <StatusDisc ok={ok} />
      {label}
    </span>
  );
}
// "Coolant leak (hoses/thermostat)": the slash may break, so a long pair never overflows its cell
const slashBreak = (html = "") => String(html).replace(/([\p{L}\d)])\/([\p{L}\d(])/gu, "$1/<wbr>$2");

/* ---------- Can it be repaired ---------- */
// "£1,800–£4,500+ [11†L6]" -> the price (free to break only after its dash, never inside an amount)
// with its data tag(s) on a smaller line underneath, so a long figure never runs into the next column
function Cost({ value = "" }) {
  const m = String(value).match(/^(.*?)\s*((?:\[[^\]]+\]\s*)+)$/);
  const main = (m ? m[1] : String(value)).replace(/(£[\d,.]+k?\+?)\s*[–‑-]\s*(£)/g, "$1–​$2");
  const tags = m ? m[2].match(/\[[^\]]+\]/g) : [];
  return (
    <>
      <span className="block">{main}</span>
      {tags.map((t) => (
        <span key={t} className="mt-0.5 block text-[12px] font-medium leading-tight text-lr-muted xl:text-[12.5px]">{t}</span>
      ))}
    </>
  );
}

function RepairCard({ repair }) {
  const cols = repair.columns?.length === 4 ? repair.columns : ["Problem", "Repairable?", "Typical Cost", "When It Makes Sense"];
  const rowIcon = `${ICON_MD} text-lr-head dark:text-lr-gold`;
  return (
    <div className={`${CARD} p-4 md:p-5`}>
      <h3 className={`${CARD_TITLE} flex items-center gap-3`}>
        <LrIcon name="commercial" tone="current" className={`${ICON_MD} text-lr-head dark:text-lr-gold`} />
        <span dangerouslySetInnerHTML={{ __html: repair.title || "Can It Be Repaired?" }} />
      </h3>

      {/* phones: one row per problem */}
      <ul className="mt-4 divide-y divide-lr-line overflow-hidden rounded-md border border-lr-line md:hidden">
        {repair.rows.map((r) => (
          <li key={r.problem} className="flex gap-3 px-3 py-3.5">
            <TopicIcon text={r.problem} className={rowIcon} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] font-medium leading-snug text-lr-head" dangerouslySetInnerHTML={{ __html: r.problem }} />
                <Status value={r.repairable} className="shrink-0 pt-px text-[14px] xl:text-[16px]" />
              </div>
              <p className={`mt-1 text-[14.5px] font-semibold ${/£/.test(r.typicalCost) ? "text-lr-ink dark:text-lr-green" : "text-lr-body"}`}>{r.typicalCost}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-lr-body xl:text-[16px]" dangerouslySetInnerHTML={{ __html: dashify(r.whenItMakesSense) }} />
            </div>
          </li>
        ))}
      </ul>

      {/* tablet / desktop: table */}
      <div className="mt-4 hidden overflow-hidden rounded-md border border-lr-line md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[27%]" /><col className="w-[21%]" /><col className="w-[20%]" /><col className="w-[32%]" />
          </colgroup>
          <thead>
            <tr className="bg-lr-panel text-[14px] font-medium text-lr-head dark:text-lr-gold xl:text-[16px]">
              {cols.map((h, i) => (
                <th key={h} scope="col" className={`py-3 font-medium ${i === 0 ? "pl-[66px] pr-3" : i === 2 ? "border-l border-lr-line px-3 text-center" : "border-l border-lr-line px-3"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[14px] xl:text-[16px]">
            {repair.rows.map((r) => (
              <tr key={r.problem} className="border-t border-lr-line">
                <th scope="row" className="py-3 pl-3 pr-3 font-normal">
                  <span className="flex items-center gap-3.5">
                    <TopicIcon text={r.problem} className={rowIcon} />
                    <span className="min-w-0 leading-snug text-lr-head" dangerouslySetInnerHTML={{ __html: slashBreak(r.problem) }} />
                  </span>
                </th>
                <td className="border-l border-lr-line px-2.5 py-3"><Status value={r.repairable} wrap /></td>
                <td className={`border-l border-lr-line px-2.5 py-3 text-center leading-snug text-lr-head ${/£/.test(r.typicalCost) ? "xl:text-[15px]" : "text-[13.5px] xl:text-[15px]"}`}><Cost value={r.typicalCost} /></td>
                <td className="border-l border-lr-line px-3 py-3 leading-snug text-lr-body" dangerouslySetInnerHTML={{ __html: dashify(r.whenItMakesSense) }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Buy If / Avoid If ---------- */
function CheckBox({ good, items }) {
  if (!items?.length) return null;
  const c = good
    ? { box: "border-lr-good/45 dark:bg-lr-good/[0.05]", head: "text-lr-good", ring: "border-lr-line-strong text-lr-head dark:border-lr-good/35 dark:text-lr-good" }
    : { box: "border-lr-bad/40 dark:bg-lr-bad/[0.05]", head: "text-lr-bad", ring: "border-lr-bad/35 text-lr-bad" };
  return (
    <div className={`rounded-md border bg-lr-card px-3.5 pb-1 pt-3.5 md:px-4 ${c.box}`}>
      <p className={`${SANS} flex items-center gap-2.5 border-b border-lr-line pb-3 text-[19px] font-semibold leading-none md:text-[20px] ${c.head}`}>
        <LrIcon name={good ? "genuine-failure-data" : "check-watch"} tone="current" className={`${ICON_MD} ${good ? "text-lr-good" : "text-lr-bad"}`} />
        {good ? "Buy If:" : "Avoid If:"}
      </p>
      <ul className="divide-y divide-lr-line">
        {items.map((raw) => {
          const text = dashify(stripBullet(raw));
          return (
            <li key={text} className="flex items-center gap-3.5 py-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${c.ring}`}>
                <TopicIcon text={text} className={ICON_SM} />
              </span>
              <p className="text-[14.5px] leading-snug text-lr-body xl:text-[15px]" dangerouslySetInnerHTML={{ __html: text }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- verdict ---------- */
function VerdictShield({ className = "" }) {
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rbr-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="[stop-color:#e3e7e2] dark:[stop-color:#e7c98d]" />
          <stop offset="1" className="[stop-color:#8d958f] dark:[stop-color:#a7843f]" />
        </linearGradient>
        <linearGradient id="rbr-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "#1f7049" }} />
          <stop offset="1" style={{ stopColor: "#0f3d27" }} />
        </linearGradient>
      </defs>
      <path d="M32 2 60 12v20c0 18-12 30-28 38C16 62 4 50 4 32V12z" fill="url(#rbr-rim)" />
      <path d="M32 7.5 55 15.8v16.4c0 15-10 25.2-23 31.8C19 57.4 9 47.2 9 32.2V15.8z" fill="url(#rbr-field)" />
      <path d="m20.5 35 8.5 8.5 15.5-17" fill="none" className="stroke-white dark:stroke-[#e7c98d]" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
// green highlights in the verdict: the engine name, the "2.5-litre mechanical turbo-diesel" phrase, "no ECU"
function highlightVerdict(html = "", engine = "") {
  const g = (s) => `<span class="font-medium text-lr-ink dark:text-lr-green">${s}</span>`;
  let out = dashify(html);
  out = out.replace(/\b\d(?:\.\d)?-litre\b[^,.;—]*?\b(?:diesel|petrol|engine|V8|V6)\b/, (m) => g(m));
  out = out.replace(/\bno ECU\b/, (m) => g(m));
  if (engine) out = out.replace(new RegExp(`(?<![\\w-])${engine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`, "g"), (m) => g(m));
  return out;
}

export default function RepairBuyOrReplace({ data, car = null, engine = "/variant/sec10_engine.webp" }) {
  if (!data) return null;
  // "Defender 200Tdi - Repair, Buy, or Replace?" -> "Defender " + green "200Tdi" + " —" / "Repair, Buy, or Replace?"
  const h2 = data.h2 || "";
  const dash = h2.indexOf(" - ");
  const lead = (dash === -1 ? "" : h2.slice(0, dash)).trim();
  const tail = dash === -1 ? h2 : h2.slice(dash + 3);
  const cut = lead.lastIndexOf(" ");
  const engineName = cut > 0 ? lead.slice(cut + 1) : lead;
  // intro: the verdict's opening claim, then the section's promise
  const opening = (data.closingVerdict || "").split(/ - |(?<=\.)\s/)[0].replace(/[.\s]*$/, ".");
  const intro = data.intro || `${opening && opening.length < 180 ? `${opening} ` : ""}Use clear data, repair reality, and honest buying guidance before you commit.`;
  const repair = data.canItBeRepaired;
  const checks = data.buyingChecks;
  const hasChecks = checks && (checks.buyIf?.length || checks.avoidIf?.length);

  return (
    <section className={`relative overflow-hidden bg-lr-band text-lr-head ${SANS}`}>
      {/* ---------- header: like the heroes, the loch spans the band (washed behind the title) and
          the car stands on its foreground; phones show it as a banner under the intro ---------- */}
      <div className="relative">
        {car && <LochBand copy="left" tone="band" from="lg" solid={480} half={700} clear={940} position="center 66%" />}
        <div className={`relative ${CONTAINER} pt-6 md:pt-6 lg:pt-6`}>
          <div className="grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-10">
            <div>
              <span className="block h-[3px] w-14 rounded-full bg-lr-gold-line md:w-20" aria-hidden="true" />
              <h2 className={`${H2} mt-5 text-lr-head`}>
                {lead && (
                  <>
                    {cut > 0 ? `${lead.slice(0, cut)} ` : ""}
                    <span className="text-lr-ink dark:text-lr-green">{engineName}</span> —<br />
                  </>
                )}
                {tail}
              </h2>
              <p className="mt-4 max-w-[34em] text-[15px] leading-relaxed text-lr-body md:text-[16px] xl:text-[17px]" dangerouslySetInnerHTML={{ __html: dashify(intro) }} />
            </div>
            {car && (
              <div className="relative hidden lg:block" aria-hidden="true">
                <div className="ml-auto w-full max-w-[540px] pb-12 pt-0">
                  <GroundedCar src={car} sceneByTheme sizes="(min-width: 1024px) 40vw, 1px" />
                </div>
              </div>
            )}
          </div>
          {car && <LochBanner car={car} className="mt-5 lg:hidden" sizes="80vw" />}
        </div>
      </div>

      <div className={`relative ${CONTAINER} pb-10 md:pb-14`}>
        {/* ---------- repair table + buying checks (side by side from xl) ---------- */}
        <div className="mt-5 grid gap-4 md:mt-6 lg:-mt-2 lg:gap-5 min-[1400px]:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]">
          {repair?.rows?.length > 0 && <RepairCard repair={repair} />}
          {hasChecks ? (
            <div className={`${CARD} p-4 md:p-5`}>
              <h3 className={`${CARD_TITLE} flex items-center gap-3`}>
                <LrIcon name="symptoms" tone="current" className={`${ICON_MD} text-lr-head dark:text-lr-gold`} />
                {/* "Buying This …? Check These First": when it wraps, it breaks after the question */}
                <span>
                  {(checks.title || "Check These First").split(/(?<=\?)\s+/).map((part, i) => (
                    <span key={i}>
                      {i > 0 && " "}
                      <span className="inline-block" dangerouslySetInnerHTML={{ __html: part }} />
                    </span>
                  ))}
                </span>
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
                <CheckBox good items={checks.buyIf} />
                <CheckBox items={checks.avoidIf} />
              </div>
            </div>
          ) : null}
        </div>

        {/* ---------- closing verdict + compare CTA ---------- */}
        <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-2 lg:gap-5">
          {data.closingVerdict && (
            <div className={`${CARD} grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 p-4 sm:gap-x-6 md:p-6 xl:gap-x-8 xl:p-7`}>
              <VerdictShield className="h-14 w-[50px] drop-shadow-[0_8px_10px_rgba(0,0,0,0.25)] sm:row-span-2 sm:h-24 sm:w-[86px] xl:h-[118px] xl:w-[104px]" />
              <h3 className={`${H5} text-lr-head sm:self-end`}>Closing Verdict</h3>
              <p className="col-span-2 mt-3 text-[14.5px] leading-[1.6] text-lr-body sm:col-span-1 sm:col-start-2 sm:mt-2 sm:self-start md:text-[15px] xl:text-[16px]" dangerouslySetInnerHTML={{ __html: highlightVerdict(data.closingVerdict, engineName) }} />
            </div>
          )}

          {data.cta?.label && (
            <div className={`${CARD} relative overflow-hidden p-4 md:p-6 xl:p-7`}>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[44%] max-w-[300px] [mask-image:linear-gradient(to_right,transparent,#000_40%)] sm:w-[38%]" aria-hidden="true">
                <Image src={engine} alt="" fill sizes="300px" className="object-cover object-left opacity-35 sm:opacity-60 dark:opacity-30 sm:dark:opacity-55" />
              </div>
              <div className="relative sm:max-w-[66%]">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-lr-head/80 text-lr-head dark:border-lr-gold-line dark:text-lr-gold md:h-[60px] md:w-[60px]" aria-hidden="true">
                    <LrIcon name="best-used-buy-2" tone="current" className={ICON_LG} />
                  </span>
                  <h3 className={`${H5} max-w-[16em] text-lr-head`}>
                    Don&apos;t guess. Get the right engine at the right price.
                  </h3>
                </div>
                <Link
                  href="/quote"
                  className="group mt-5 flex items-center gap-3.5 rounded-md border border-lr-brand bg-lr-brand px-4 py-3.5 text-[15px] font-medium leading-snug text-lr-on-brand shadow-[0_10px_30px_-14px_rgba(31,112,73,0.7)] transition-colors hover:bg-lr-brand-hover md:mt-6 md:px-5 md:text-[16px] xl:text-[17px] dark:border-lr-green/55 dark:bg-lr-brand/15 dark:text-lr-head dark:shadow-none dark:hover:bg-lr-brand/30"
                >
                  <VIcon name="arrow" className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  {stripArrow(data.cta.label)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
