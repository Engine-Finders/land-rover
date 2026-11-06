import GroundedCar from "@/components/variant/GroundedCar";
import LrIcon from "@/components/shared/LrIcon";
import { BadgeStrip, PoundShield } from "@/components/models/costBuyerBadges";
import { BAND_PAGE, CARD, Eyebrow, SANS, SECTION_Y, SERIF, SectionTitle, TABLE_HEAD, generationCar, prose, INTRO } from "@/components/models/modelKit";
import { BODY_SM, CONTAINER } from "@/lib/typeScale";

// Model page section 8 - engine replacement costs, built to the approved Velar reference: the
// headline with the four-up promise card beside it, then one card per generation table (a panel
// with the generation's name, years and its car, beside a dark green price table), then the notes
// row (Important Notes + Labour Estimate, and the model's replacement rule with its verdict chip).
// Phones: each generation card shows its title and car, then one compact entry per variant (its
// code chip, then used / reconditioned / rebuilt prices and labour hours as label-value rows).
// Tablets / 1024: the car sits beside the title above a full-width table. xl (1280+): the
// reference layout, panel left of the table.

// Promises the site makes on its own pages (about/how-it-works, warranty-standards,
// specialist-vetting) and in this section's data (real UK pricing, supply-only quotes)
const BADGES = [
  { icon: <PoundShield />, title: "Transparent", text: "Real UK Prices" },
  { icon: "transparent-data", title: "Quality Assured", text: "Tested Engines" },
  { icon: "commercial", title: "Fitted by Experts", text: "Trusted Garages" },
  { icon: "genuine-failure-data", title: "12 Months", text: "Warranty" },
];

// "Velar (L560) - 2017–2020 (pre-facelift)" -> { name: "Velar (L560)", years: "2017–2020", note: "(pre-facelift)" }
function splitGenTitle(title = "") {
  const t = String(title).replace(/\s+[-–—]\s+/, " — ");
  const i = t.indexOf(" — ");
  const name = i === -1 ? t : t.slice(0, i);
  const rest = i === -1 ? "" : t.slice(i + 3);
  const m = rest.match(/^(.*?)\s*(\([^)]*\))\s*$/);
  return { name, years: m ? m[1] : rest, note: m ? m[2] : "" };
}

// "£2,000–£3,500 (top-hat linered)" -> spaced range, halves kept whole, the note on its own line
function Range({ value = "" }) {
  const s = String(value).trim();
  const m = s.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  const main = m ? m[1] : s;
  const note = m ? m[2] : "";
  const parts = main.split(/\s*–\s*/);
  return (
    <>
      {parts.length === 2 ? (
        <>
          <span className="whitespace-nowrap">{parts[0]} –</span> <span className="whitespace-nowrap">{parts[1]}</span>
        </>
      ) : (
        main
      )}
      {note && <span className="mt-0.5 block text-[13px] font-normal leading-snug text-lr-muted">({note})</span>}
    </>
  );
}

function Clock({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

// ✅ / ⚠️ / ❌ verdict markers inside the copy -> coloured chips ("✅ Safe." -> [✓ Safe].)
const CHIP = {
  "✅": ["bg-lr-good/12 text-lr-good", '<path d="m7 12.5 3.2 3.2L17 8.8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'],
  "⚠️": ["bg-lr-warn/14 text-lr-warn", '<path d="M12 7.5v5.5M12 16.6h.01" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'],
  "❌": ["bg-lr-bad/12 text-lr-bad", '<path d="m8.5 8.5 7 7m0-7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'],
};
function verdictChips(html = "") {
  return html.replace(/(✅|⚠️|⚠|❌)\s*([^,.;:)—<]+?)(?=[,.;:)]|\s—\s|<|$)/gu, (_, mark, phrase) => {
    const key = mark === "⚠" ? "⚠️" : mark;
    const [tone, glyph] = CHIP[key];
    const words = phrase.trim().split(/\s+/);
    // short phrases ("Safe", "walk away", "past the line") go in the chip; a longer clause keeps
    // only its first word in the chip and reads on as text
    const inChip = words.length <= 3 ? phrase.trim() : words[0];
    const after = words.length <= 3 ? "" : ` ${words.slice(1).join(" ")}`;
    return `<span class="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-px align-[1px] text-[0.92em] font-semibold ${tone}"><svg viewBox="0 0 24 24" class="h-3.5 w-3.5" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor" opacity=".18"/>${glyph}</svg>${inChip}</span>${after}`;
  });
}
// long data tags ("[PLACEHOLDER - confirm vs Table A; …]") may wrap, so they never push a phone
// layout sideways; short ones ("[EM-QUOTE]") stay on one line
const wrapLongTags = (html) =>
  html.replace(/<span class="whitespace-nowrap ([^"]*)">(\[[^\]]{18,}\])<\/span>/g, '<span class="$1">$2</span>');
const copy = (text) => verdictChips(wrapLongTags(prose(text)));

// Labour estimate, and the model's rule: from economicsBox, or - on models whose rule was written
// into the labour estimate ("… [EM-QUOTE]. The Evoque rule - the generation split: …") - split out
// of it, so nothing is lost and nothing shows twice.
function splitNotes(data = {}) {
  const raw = String(data.labourEstimate || "").trim();
  const at = raw.search(/\s+The\s[^.:]{2,60}?\brule\b[^.:]*:/);
  let labour = at === -1 ? raw : raw.slice(0, at).trim();
  let title = String(data.economicsBox?.title || "").trim();
  let text = String(data.economicsBox?.text || "").trim();
  if (at !== -1 && !(title && text)) {
    const embedded = raw.slice(at).trim();
    const colon = embedded.indexOf(":");
    title = title || embedded.slice(0, colon).trim();
    text = text || embedded.slice(colon + 1).trim();
  }
  labour = labour.replace(/^Labour estimate:\s*/i, "");
  return { labour, title, text };
}

function GenerationCard({ table, slug }) {
  const { name, years, note } = splitGenTitle(table.title);
  const car = generationCar(table.title, slug);
  const cols = table.columns?.length === 6 ? table.columns : ["Variant", "Engine Code", "Used (Supply)", "Reconditioned (Supply)", "Rebuilt (Supply)", "Labour Hours"];
  const short = (c) => c.replace(/\s*\(Supply\)\s*/i, "");
  const rows = table.rows || [];

  return (
    <article className={`${CARD} overflow-hidden xl:grid xl:grid-cols-[288px_minmax(0,1fr)] 2xl:grid-cols-[316px_minmax(0,1fr)]`}>
      {/* generation panel: title (and car beside it until xl, below it from xl) */}
      <header className="flex items-center gap-3 border-b border-lr-line bg-lr-panel/80 px-4 py-3.5 sm:gap-5 sm:px-5 md:px-6 md:py-4 xl:flex-col xl:items-stretch xl:justify-between xl:gap-4 xl:border-b-0 xl:border-r xl:px-6 xl:pb-5 xl:pt-6">
        <h3 className={`${SERIF} min-w-0 flex-1 text-[19px] leading-[1.2] text-lr-head sm:text-[22px] md:text-[24px] xl:flex-none xl:text-[26px]`}>
          {name}
          {years && (
            <>
              {" "}—<br />
              {years}
            </>
          )}
          {note && <span className="mt-0.5 block text-[15px] text-lr-body sm:text-[16px] xl:text-[19px]">{note}</span>}
        </h3>
        {car && (
          <div className="w-[42%] max-w-[176px] shrink-0 sm:w-[200px] sm:max-w-none md:w-[230px] xl:mx-auto xl:w-full xl:max-w-[250px]">
            <GroundedCar src={car} studio sizes="(min-width: 1280px) 250px, (min-width: 768px) 230px, 176px" />
          </div>
        )}
      </header>

      {/* xl: the table fills the panel's height (short tables get airier rows, not a gap) */}
      <div className="min-w-0 xl:flex xl:flex-col">
        {/* phones: one compact entry per variant */}
        <p className="flex items-center gap-1.5 border-b border-lr-line px-4 py-2 text-[13px] text-lr-muted sm:px-5 md:hidden">
          <LrIcon name="note" tone="current" className="h-3.5 w-3.5 text-lr-ink dark:text-lr-green" />
          Supply-only prices · labour extra
        </p>
        <ul className="divide-y divide-lr-line md:hidden">
          {rows.map((r) => (
            <li key={`${r.model}-${r.engineCode}`} className="px-4 py-3 sm:px-5">
              {/* variant + engine code, labour hours on the right */}
              <div className="flex items-start justify-between gap-3">
                <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[15px] font-semibold leading-snug text-lr-head">{r.model}</span>
                  <span className="rounded-md bg-lr-panel px-2 py-0.5 text-[12.5px] font-semibold leading-snug text-lr-ink dark:text-lr-green">{r.engineCode}</span>
                </p>
                <p className="flex max-w-[48%] shrink-0 items-start gap-1.5 text-right text-[13.5px] font-medium leading-snug text-lr-body">
                  <Clock className="mt-[3px] h-3.5 w-3.5 shrink-0 text-lr-ink dark:text-lr-green" />
                  <span className="sr-only">{cols[5]}: </span>
                  <span>
                    <Range value={r.labourHours} />
                  </span>
                </p>
              </div>
              {/* the three supply prices side by side, like the table */}
              <dl className="mt-2 grid grid-cols-3 divide-x divide-lr-line overflow-hidden rounded-lg border border-lr-line tabular-nums">
                {[
                  [short(cols[2]), r.usedSupply],
                  [short(cols[3]).replace(/^Reconditioned$/i, "Recon"), r.reconditionedSupply],
                  [short(cols[4]), r.rebuiltSupply],
                ].map(([label, v]) => (
                  <div key={label} className="min-w-0 px-2.5 py-2">
                    <dt className="text-[12px] font-medium uppercase tracking-[0.04em] text-lr-muted">{label}</dt>
                    <dd className="mt-0.5 text-[14px] font-semibold leading-snug text-lr-head">
                      <Range value={v} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        {/* tablets and up: the price table */}
        <table className="hidden w-full border-collapse text-[14px] tabular-nums md:table lg:text-[15px] xl:flex-1">
          <colgroup>
            <col className="w-[16%]" />
            <col className="w-[15%]" />
            <col className="w-[17%]" />
            <col className="w-[19%]" />
            <col className="w-[17%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className={TABLE_HEAD}>
              {cols.map((c, i) => (
                <th key={c} scope="col" className={`px-2.5 py-3 text-[14px] font-semibold leading-tight lg:px-3 xl:py-3.5 ${i === 0 ? "text-left lg:pl-4 xl:pl-6" : "text-center"}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.model}-${r.engineCode}`} className="border-t border-lr-line first:border-t-0 transition-colors hover:bg-lr-panel/50">
                <th scope="row" className="px-3 py-3 text-left font-semibold leading-snug text-lr-head lg:px-4 lg:py-3.5 xl:pl-6">{r.model}</th>
                <td className="px-3 py-3 text-center leading-snug text-lr-body lg:px-4 lg:py-3.5">{r.engineCode}</td>
                {[r.usedSupply, r.reconditionedSupply, r.rebuiltSupply].map((v, i) => (
                  <td key={i} className="px-3 py-3 text-center leading-snug text-lr-head lg:px-4 lg:py-3.5">
                    <Range value={v} />
                  </td>
                ))}
                <td className="px-3 py-3 text-center leading-snug text-lr-head lg:px-4 lg:py-3.5">
                  <Range value={r.labourHours} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

// "… whole parc - ✅ Safe. The one pressure point …" -> the verdict sentence, then the rest
function ruleParagraphs(text = "") {
  const m = String(text).match(/^(.*?(?:✅|⚠️|⚠|❌)[^.]*\.)\s+(\S.*)$/su);
  return m ? [m[1], m[2]] : [text];
}

function NoteBlock({ icon, title, html }) {
  return (
    <div className="p-4 sm:p-5 xl:p-6">
      <h3 className="flex items-center gap-3 text-[16px] font-semibold text-lr-head xl:text-[17px]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-lr-line-strong text-lr-ink dark:text-lr-green">{icon}</span>
        {title}
      </h3>
      <p className={`${BODY_SM} mt-3 text-lr-body`} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default function ReplacementCosts({ data, slug = "" }) {
  if (!data) return null;
  const tables = (data.tables || []).filter((t) => t.rows?.length);
  const { labour, title: ruleTitle, text: ruleText } = splitNotes(data);
  const hasNotes = data.figuresNote || labour;

  return (
    <section id="replacement-costs" className={`${BAND_PAGE} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid gap-6 xl:gap-8 min-[1500px]:grid-cols-[minmax(0,1fr)_minmax(0,560px)] min-[1500px]:items-center min-[1500px]:gap-10">
          <div>
            <Eyebrow>Replacement Costs</Eyebrow>
            <SectionTitle h2={data.h2} className="mt-3 md:mt-4" />
            {data.subHeadline && <p className={INTRO} dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }} />}
          </div>
          <BadgeStrip items={BADGES} />
        </div>

        {tables.length > 0 && (
          <div className="mt-6 space-y-4 md:mt-8 md:space-y-5 xl:mt-10">
            {tables.map((t) => (
              <GenerationCard key={t.title} table={t} slug={slug} />
            ))}
          </div>
        )}

        {(hasNotes || ruleText) && (
          <div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)_minmax(0,0.5fr)] xl:gap-5">
            {hasNotes && (
              <div className={`${CARD} grid divide-y divide-lr-line md:col-span-2 md:grid-cols-2 md:divide-x md:divide-y-0 xl:col-span-1`}>
                {data.figuresNote && <NoteBlock icon={<LrIcon name="note" tone="current" className="h-[18px] w-[18px]" />} title="Important Notes" html={copy(data.figuresNote)} />}
                {labour && <NoteBlock icon={<Clock className="h-[18px] w-[18px]" />} title="Labour Estimate" html={copy(labour)} />}
              </div>
            )}
            {ruleText && (
              <div className="flex gap-4 rounded-xl border border-lr-line bg-lr-chip/70 p-4 sm:gap-5 sm:p-5 lg:rounded-2xl xl:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lr-line-strong bg-lr-card text-lr-ink sm:h-14 sm:w-14 dark:text-lr-green">
                  <LrIcon name="flagship-choice" tone="current" className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
                <div className="min-w-0">
                  {ruleTitle && <h3 className="text-[17px] font-semibold leading-snug text-lr-head xl:text-[18px]" dangerouslySetInnerHTML={{ __html: prose(ruleTitle) }} />}
                  {ruleParagraphs(ruleText).map((para, i) => (
                    <p key={i} className={`${BODY_SM} ${i ? "mt-2.5" : "mt-2"} text-lr-body`} dangerouslySetInnerHTML={{ __html: copy(para) }} />
                  ))}
                </div>
              </div>
            )}
            {/* the value-first tip (gold), as in the reference */}
            <div className="flex gap-4 rounded-xl border border-lr-gold-line/35 bg-lr-gold-line/[0.08] p-4 sm:p-5 lg:rounded-2xl xl:flex-col xl:gap-3 xl:p-6 min-[1440px]:flex-row min-[1440px]:gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lr-gold-line/45 bg-lr-card text-lr-gold">
                <LrIcon name="real-inquiries" tone="current" className="h-6 w-6" />
              </span>
              <div className={`${BODY_SM} min-w-0 text-lr-body`}>
                <p>Always compare against the car&rsquo;s value and your long-term ownership plan.</p>
                <p className="mt-2.5 font-medium text-lr-head">Value the car first; the engine decision follows.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
