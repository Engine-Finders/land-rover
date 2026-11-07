import Link from "next/link";
import LrIcon from "@/components/shared/LrIcon";
import EditorialPullQuote from "@/components/models/EditorialPullQuote";
import { CONTAINER, H2, SMALL } from "@/lib/typeScale";
import { Arrow, BAND_PAGE, CARD, Eyebrow, SANS, SECTION_Y, SoftTile, TABLE_HEAD, prose, splitHeading, H2_MODEL } from "@/components/models/modelKit";

// Model page section 7, built to the approved "Velar Market Intelligence" reference: the eyebrow and
// the serif headline (the "275 UK Owners" phrase in green) beside the headline-figure card, the
// signals table (Signal | 2025 Data | Demand Trend) under a dark green head, the "Insights from
// the data" card with the live-enquiry panel at its side, and the editorial pull-quote with the
// model's car in the Highland backdrop. Below lg the table becomes a list of signal rows; phones
// stack the insights, and the live panel and pull-quote follow full width.

const TAG_RE = /\[((?:EM-|PLACEHOLDER)[^\]]*)\]/g;

// "620 [EM-VERIFIED - see 508PS/448DT correction]" -> { main: "620", tags: ["[EM-VERIFIED - see …]"] }
function splitTags(text = "") {
  const tags = [...String(text).matchAll(TAG_RE)].map((m) => m[0]);
  const main = String(text)
    .replace(TAG_RE, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim()
    .replace(/^[-–—]\s*/, "")
    .replace(/\s*[-–—]$/, "");
  return { main, tags };
}

// figures in the data column set in bold, as in the reference ("155 general + 120 … = 275")
function boldFigures(html = "") {
  return html
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part.replace(/(^|[\s(=+])(\d[\d,]*(?:\.\d+)?%?\+?)(?=$|[\s),.;:])/g, '$1<strong class="font-semibold text-lr-head">$2</strong>')
    )
    .join("");
}

// brand icon for a signal row
function signalIcon(signal = "") {
  if (/PHEV/i.test(signal)) return "ev";
  if (/share/i.test(signal)) return "honest-repair-vs-replace";
  if (/\b\d{3}[A-Z]{2,3}\d?\b|TDV|SDV|Ingenium|K-series|\bTD5\b|Tdi\b/i.test(signal)) return "engine";
  return "vehicle";
}

// "⬆ Rising as the 2017–2018 parc exits warranty [PLACEHOLDER - YoY %]"
function parseTrend(raw = "") {
  let text = String(raw).trim();
  let dir = "steady";
  if (/^[⬆↑▲]/u.test(text)) dir = "up";
  else if (/^[⬇↓▼]/u.test(text)) dir = "down";
  else if (/^(rising|up)\b/i.test(text)) dir = "up";
  else if (/^(falling|declining|down)\b/i.test(text)) dir = "down";
  text = text.replace(/^[⬆⬇➡↑↓→▲▼]️?\s*/u, "");
  const { main, tags } = splitTags(text);
  const m = main.match(/^(\S+)([\s\S]*)$/);
  return { dir, word: m ? m[1] : main, rest: m ? m[2] : "", tags };
}

const TREND_PATH = {
  up: "m3.5 16.5 5.5-5.5 3.5 3.5 7.5-7.5M15 7h5v5",
  down: "m3.5 7.5 5.5 5.5 3.5-3.5 7.5 7.5M15 17h5v-5",
  steady: "M4 12h15m-5-5 5 5-5 5",
};
const TREND_TONE = { up: "text-lr-good", down: "text-lr-warn", steady: "text-lr-muted" };

function TrendIcon({ dir }) {
  return (
    <svg viewBox="0 0 24 24" className={`mt-0.5 h-6 w-6 shrink-0 xl:h-7 xl:w-7 ${TREND_TONE[dir]}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={TREND_PATH[dir]} />
    </svg>
  );
}

function Tags({ tags }) {
  if (!tags.length) return null;
  return (
    <span className="mt-1 block text-[14px] font-medium leading-snug text-lr-green" dangerouslySetInnerHTML={{ __html: tags.map((t) => prose(t).replace(/<[^>]+>/g, "")).join(" ") }} />
  );
}

// headline figure for the card beside the title: the number in the H2 ("What 275 UK Owners …"),
// else the hero's first stat; [EM-VERIFIED] only when the source carries it
function headlineFigure(data, page) {
  const h2 = String(data.h2 || "");
  const year = (h2.match(/\b(20\d\d)\b/) || [])[1] || "";
  const m = h2.match(/(\d[\d,]*\+?)\s+UK Owners/i);
  if (m) {
    const n = m[1].replace(/\+$/, "");
    const verified = (data.signals || []).some((s) => String(s.data || "").includes(n) && /\[EM-VERIFIED/.test(s.data || ""));
    return { value: m[1], label: `Total Enquiries${year ? ` in ${year}` : ""}`, verified };
  }
  const hero = String(page?.hero?.trustStrip?.[0]?.label || "");
  const hm = hero.match(/^(\d[\d,]*\+?)\s+([^[\-–—]+?)\s*(?:\[|[-–—]|$)/);
  if (!hm) return null;
  const label = hm[2].trim().replace(/\((20\d\d)\)/, "in $1");
  return { value: hm[1], label, verified: /\[EM-VERIFIED/.test(hero) };
}

function Title({ h2 }) {
  const { lead, accent: tail } = splitHeading(h2);
  const m = tail.match(/(?:\d[\d,]*\+?\s+)?UK Owners/);
  return (
    <h2 className={`${H2_MODEL} text-balance text-lr-head`}>
      {lead}
      {tail && (
        <>
          {" "}—<br />
          {m ? (
            <>
              {tail.slice(0, m.index)}
              <span className="text-lr-ink dark:text-lr-green">{m[0]}</span>
              {tail.slice(m.index + m[0].length)}
            </>
          ) : (
            tail
          )}
        </>
      )}
    </h2>
  );
}

function FigureCard({ figure }) {
  return (
    <div className={`${CARD} flex items-center gap-4 px-5 py-4 sm:inline-flex lg:min-w-[300px] xl:gap-5 xl:px-7 xl:py-6`}>
      <LrIcon name="users" tone="current" className="h-10 w-10 text-lr-ink md:h-11 md:w-11 xl:h-12 xl:w-12 dark:text-lr-green" />
      <div className="min-w-0">
        <p className="text-[30px] font-semibold leading-none text-lr-head xl:text-[36px]">{figure.value}</p>
        <p className="mt-1.5 text-[15px] leading-snug text-lr-body xl:text-[16px]">{figure.label}</p>
        {figure.verified && <p className="mt-1 text-[14px] font-medium text-lr-green">[EM-VERIFIED]</p>}
      </div>
    </div>
  );
}

function SignalsTable({ signals, year }) {
  return (
    <div className={`${CARD} mt-6 overflow-hidden md:mt-8`}>
      <div className={`hidden grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,1.25fr)] px-6 py-3.5 text-[15px] font-medium lg:grid xl:px-8 xl:py-4 xl:text-[16px] ${TABLE_HEAD}`}>
        <span>Signal</span>
        <span className="pl-6">{year} Data</span>
        <span className="pl-6">Demand Trend</span>
      </div>
      <ul className="divide-y divide-lr-line">
        {signals.map((s) => {
          const data = splitTags(s.data);
          const trend = parseTrend(s.demandTrend);
          return (
            <li key={s.signal} className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-1 sm:gap-3.5 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-0 lg:py-0 xl:px-8">
              <div className="col-span-2 flex items-center gap-3.5 sm:col-span-1 lg:py-4 lg:pr-5">
                <SoftTile name={signalIcon(s.signal)} />
                <span className="text-[15px] font-semibold leading-snug text-lr-head sm:text-[16px] xl:text-[17px]" dangerouslySetInnerHTML={{ __html: prose(s.signal) }} />
              </div>
              <div className="grid content-start gap-1 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-3 lg:block lg:border-l lg:border-lr-line lg:px-6 lg:py-4">
                <span className={`${SMALL} pt-0.5 font-medium uppercase tracking-[0.05em] text-lr-muted lg:hidden`}>{year} data</span>
                <p className="text-[15px] leading-snug text-lr-body xl:text-[16px]">
                  <span dangerouslySetInnerHTML={{ __html: boldFigures(prose(data.main)) }} />
                  <Tags tags={data.tags} />
                </p>
              </div>
              <div className="grid content-start gap-1 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-3 lg:block lg:border-l lg:border-lr-line lg:py-4 lg:pl-6">
                <span className={`${SMALL} pt-0.5 font-medium uppercase tracking-[0.05em] text-lr-muted lg:hidden`}>Trend</span>
                <div className="flex min-w-0 gap-2 sm:gap-3">
                  <TrendIcon dir={trend.dir} />
                  <p className="min-w-0 text-[15px] leading-snug text-lr-body xl:text-[16px]">
                    <strong className="font-semibold text-lr-head">{trend.word}</strong>
                    <span dangerouslySetInnerHTML={{ __html: prose(trend.rest) }} />
                    <Tags tags={trend.tags} />
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// "Interesting insight: …" keeps its label; otherwise the insight's subject ("Velar enquiries",
// "Post-2021 cars", "Discovery 4") is set in bold; a trailing "(Editorial synthesis …)" goes muted
const SUBJECT_NOUNS = /^(enquiries|enquiry|cars|demand|volume|engines|cohort|parc)$/;
function subject(text) {
  const words = text.split(" ");
  const out = [];
  let i = 0;
  while (i < words.length && out.length < 5) {
    const w = words[i];
    if (/^[A-Z0-9£]/.test(w)) out.push(w);
    else if (w === "and" && out.length && /^[A-Z0-9]/.test(words[i + 1] || "")) out.push(w);
    else break;
    i += 1;
  }
  while (i < words.length && SUBJECT_NOUNS.test(words[i]) && out.length < 6) out.push(words[i++]);
  if (!out.length || (out.length === 1 && /^(We|The|It|This|A|An|Our|In|On|At)$/.test(out[0]))) return "";
  return out.join(" ");
}

function parseInsight(raw = "") {
  let text = String(raw).trim();
  let label = "";
  let note = "";
  const lm = text.match(/^(Interesting insight:)\s*/i);
  if (lm) {
    label = lm[1];
    text = text.slice(lm[0].length);
  }
  const nm = text.match(/\s*(\(editorial[^)]*\))\s*$/i);
  if (nm) {
    note = nm[1];
    text = text.slice(0, nm.index).trim();
  }
  const lead = label ? "" : subject(text);
  return { label, lead, text: lead ? text.slice(lead.length) : text, note };
}

const INSIGHT_ICONS = ["scope-decision", "genuine-failure-data", "independent-star"];

function Sparkline() {
  const pts = [0, 30, 8, 34, 16, 31, 24, 36, 32, 30, 40, 33, 48, 25, 56, 28, 64, 20, 72, 24, 80, 14, 88, 22, 96, 18, 104, 26, 112, 16, 120, 9];
  const line = pts.reduce((d, v, i) => d + (i % 2 ? `,${v}` : `${i ? " L" : "M"}${v}`), "");
  return (
    <svg viewBox="0 0 120 44" preserveAspectRatio="none" className="mt-4 h-20 w-full text-lr-green" aria-hidden="true">
      <defs>
        <linearGradient id="mi-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L120,44 L0,44 Z`} fill="url(#mi-spark-fill)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="120" cy="9" r="2.2" fill="currentColor" />
    </svg>
  );
}

function LiveFeed() {
  return (
    <div className="flex flex-col border-t border-lr-line p-5 md:p-6 xl:border-l xl:border-t-0 xl:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[17px] font-semibold text-lr-head xl:text-[18px]">Live Enquiry Feed</p>
        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-lr-good">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lr-good opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lr-good" />
          </span>
          Live
        </span>
      </div>
      <Sparkline />
      <p className="mt-3 text-[15px] leading-snug text-lr-body">Real-time enquiry activity across the UK.</p>
      <Link
        href="/data/enquiry-trends"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-lr-ink/70 bg-lr-card text-[15px] font-semibold text-lr-ink no-underline transition-colors hover:bg-lr-chip xl:mt-auto dark:border-lr-green/55 dark:bg-transparent dark:text-lr-green dark:hover:bg-lr-green/10"
      >
        View Live Feed
        <Arrow className="h-[18px] w-[18px]" />
      </Link>
    </div>
  );
}

function Insights({ insights }) {
  return (
    <div className={`${CARD} mt-5 overflow-hidden md:mt-6 xl:grid xl:grid-cols-[minmax(0,1fr)_300px]`}>
      <div className="p-5 md:p-6 xl:p-7">
        <p className="flex items-center gap-2.5 text-[17px] font-semibold text-lr-head xl:text-[18px]">
          <LrIcon name="real-inquiries" tone="current" className="h-5 w-5 text-lr-ink dark:text-lr-green" />
          Insights from the data:
        </p>
        <ul className="mt-5 grid gap-5 lg:grid-cols-3 lg:gap-0 [&>li+li]:border-t [&>li+li]:border-lr-line [&>li+li]:pt-5 lg:[&>li+li]:border-l lg:[&>li+li]:border-t-0 lg:[&>li+li]:pt-0">
          {insights.map((raw, i) => {
            const ins = parseInsight(raw);
            return (
              <li key={i} className="flex min-w-0 gap-3 sm:gap-4 lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <SoftTile name={INSIGHT_ICONS[i % INSIGHT_ICONS.length]} className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12" iconClass="h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <div className="min-w-0">
                  <p className="text-[14px] leading-[1.6] text-lr-body md:text-[15px]">
                    {ins.label && <strong className="mb-1 block font-semibold text-lr-head">{ins.label}</strong>}
                    {ins.lead && <strong className="font-semibold text-lr-head">{ins.lead}</strong>}
                    <span dangerouslySetInnerHTML={{ __html: prose(ins.text) }} />
                  </p>
                  {ins.note && <p className="mt-2 text-[14px] leading-snug text-lr-muted md:text-[15px]" dangerouslySetInnerHTML={{ __html: prose(ins.note) }} />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <LiveFeed />
    </div>
  );
}

export default function MarketIntelligence({ data, quoteData, slug = "", page }) {
  if (!data) return null;

  const year = (String(data.h2 || "").match(/\b(20\d\d)\b/) || [])[1] || "2025";
  const figure = headlineFigure(data, page);

  return (
    <section id="market-intelligence" className={`${BAND_PAGE} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <Eyebrow>Market Intelligence</Eyebrow>
            <div className="mt-3 md:mt-4">
              <Title h2={data.h2} />
            </div>
          </div>
          {figure && <FigureCard figure={figure} />}
        </div>

        {data.signals?.length > 0 && <SignalsTable signals={data.signals} year={year} />}
        {data.insights?.length > 0 && <Insights insights={data.insights} />}
        {quoteData && <EditorialPullQuote data={quoteData} slug={slug} />}
      </div>
    </section>
  );
}
