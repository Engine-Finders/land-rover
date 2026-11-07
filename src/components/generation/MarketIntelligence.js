import Image from "next/image";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { H2_MODEL, SANS, prose } from "@/components/models/modelKit";
import { localHtml } from "@/components/models/generationsFaqLinks";
import { genCar, genCode } from "./genKit";
import { TrustStrip } from "./ReplacementCosts";

// Generation page section 9 - market intelligence, built to the approved Defender L316 reference:
// the eyebrow, "Market Intelligence" headline and split rule; four insight cards (most requested
// engines, most requested variants, average replacement cost, most common failures - each with its
// round icon, its basis line and data tag at the foot) beside the live feed (vehicle with a thumbnail,
// location, issue, enquiries, updated); then the five-point trust strip.
// Phones: the cards stacked, the feed as one row per enquiry. Tablets: cards 2 x 2, feed below.
// Large screens (1536px+): the reference row of four cards with the feed on the right.

const html = (raw) => localHtml(prose(raw || ""));
const TAG = /\s*\[(PATTERN DATA|EM[-‑]\w+)\]\.?/i;
const capital = (t = "") => String(t).trim().replace(/^[a-z]/, (c) => c.toUpperCase());

// ["1. Td5 (…)", "2. …", "3. 2.2 Td4 (…) - based on UK specialist enquiry patterns [PATTERN DATA]"]
// -> { items: ["Td5 (…)", …], basis: "Based on UK specialist enquiry patterns", tag: "[PATTERN DATA]" }
function parseList(list = []) {
  let basis = "";
  let tag = "";
  const items = list.map((raw) => {
    let text = String(raw).replace(/^\s*\d+\.\s*/, "").trim();
    const t = text.match(TAG);
    if (t) {
      tag = `[${t[1].replace("‑", "-")}]`;
      text = text.replace(TAG, "").trim();
    }
    const b = text.match(/^(.*?)\s+[-–—]\s+(based on .+)$/i);
    if (b) {
      text = b[1];
      basis = capital(b[2]);
    }
    return text;
  });
  return { items: items.filter(Boolean), basis, tag };
}

// "£1,800–£7,000 reconditioned, supply only [EM‑QUOTE]" -> figure / rest / tag
function parseCost(raw = "") {
  const text = String(raw).trim().replace(/\.$/, "");
  const t = text.match(TAG);
  const clean = text.replace(TAG, "").trim();
  const m = clean.match(/^(£[\d,]+(?:\s?[–-]\s?£[\d,]+)?)\s*(.*)$/);
  return { figure: m ? m[1] : clean, rest: m ? m[2].replace(/^\(|\)$/g, "").trim() : "", tag: t ? `[${t[1].replace("‑", "-")}]` : "" };
}

const ICON_RING = "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-ink/45 text-lr-ink xl:h-[54px] xl:w-[54px] dark:border-lr-gold-line/55 dark:text-lr-gold";
const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

function CardIcon({ kind }) {
  if (kind === "engines") return <LrIcon name="real-inquiries" tone="current" className="h-6 w-6" />;
  if (kind === "variants") return <LrIcon name="vehicle" tone="current" className="h-6 w-6" />;
  if (kind === "cost") return <span className="font-[family-name:var(--font-serif-display)] text-[24px] leading-none">£</span>;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <g {...STROKE}>
        <path d="M10.4 4.2 2.6 17.8a1.8 1.8 0 0 0 1.6 2.7h15.6a1.8 1.8 0 0 0 1.6-2.7L13.6 4.2a1.8 1.8 0 0 0-3.2 0Z" />
        <path d="M12 9.6v4.6M12 17.2h.01" />
      </g>
    </svg>
  );
}

function Card({ kind, title, sub, children, basis, tag, art }) {
  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-lr-line bg-lr-card p-5 shadow-[0_18px_44px_-36px_var(--lr-shadow)] xl:p-6">
      <div className="flex items-start gap-3.5 2xl:gap-3">
        <span className={ICON_RING}>
          <CardIcon kind={kind} />
        </span>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-[14px] font-semibold uppercase leading-snug tracking-[0.02em] text-lr-ink xl:text-[15px] dark:text-lr-green">{title}</h3>
          {sub && <p className="mt-1 text-[12.5px] leading-snug text-lr-muted xl:text-[13px]">{sub}</p>}
        </div>
      </div>
      <div className="mt-5 flex-1">{children}</div>
      {(basis || tag) && (
        <div className="relative mt-5 pr-20">
          {basis && <p className="text-[12.5px] leading-snug text-lr-body xl:text-[13px]">{basis}</p>}
          {tag && <p className="mt-1 text-[12.5px] font-medium text-lr-green xl:text-[13px]">{tag}</p>}
          {art && <LrIcon name={art} tone="current" className="absolute bottom-0 right-0 h-14 w-[72px] text-lr-head/15 dark:text-white/15" />}
        </div>
      )}
    </article>
  );
}

function List({ items }) {
  return (
    <ol className="space-y-3.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-[14px] leading-[1.5] text-lr-head xl:text-[15px] 2xl:gap-2">
          <span className="w-4 shrink-0 font-medium">{i + 1}.</span>
          <span className="min-w-0 [&_a]:text-inherit [&_a]:underline" dangerouslySetInnerHTML={{ __html: html(t) }} />
        </li>
      ))}
    </ol>
  );
}

function FeedIcon({ kind, className = "h-4 w-4 shrink-0" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g {...STROKE}>
        {kind === "pin" && (
          <>
            <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.3" />
          </>
        )}
        {kind === "issue" && (
          <>
            <path d="M10.4 4.2 2.6 17.8a1.8 1.8 0 0 0 1.6 2.7h15.6a1.8 1.8 0 0 0 1.6-2.7L13.6 4.2a1.8 1.8 0 0 0-3.2 0Z" />
            <path d="M12 9.6v4.6M12 17.2h.01" />
          </>
        )}
        {kind === "refresh" && <path d="M19.5 8.5A8 8 0 0 0 5.4 6.6L4 8M4.5 15.5a8 8 0 0 0 14.1 1.9L20 16M4 3.8V8h4.2M20 20.2V16h-4.2" />}
      </g>
    </svg>
  );
}

// "3 enquiries" -> { n: "3", label: "enquiries" }
const splitCount = (t = "") => {
  const m = String(t).match(/^(\d[\d,]*\+?)\s*(.*)$/);
  return m ? { n: m[1], label: m[2] } : { n: "", label: String(t) };
};

function LiveFeed({ rows, car }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_18px_44px_-36px_var(--lr-shadow)]">
      <h3 className="flex items-center gap-3 px-5 py-4 text-[15px] font-semibold uppercase tracking-[0.02em] text-lr-head xl:px-6 xl:py-5 xl:text-[16px]">
        <LrIcon name="live-feed" tone="current" className="h-6 w-6 text-lr-ink dark:text-lr-green" />
        Live Feed
        <span className="relative ml-1 flex h-2 w-2" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-lr-green/60 motion-reduce:animate-none" />
          <span className="relative h-2 w-2 rounded-full bg-lr-green" />
        </span>
      </h3>
      {/* tablets and up: the five columns */}
      <div className="hidden border-t border-lr-line sm:block">
        <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] gap-2.5 bg-lr-panel/50 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.03em] text-lr-head 2xl:px-4">
          <span>Vehicle</span>
          <span>Location</span>
          <span>Issue</span>
          <span>Enquiries</span>
          <span>Updated</span>
        </div>
      </div>
      <ul className="divide-y divide-lr-line border-t border-lr-line">
        {rows.map((r, i) => {
          const c = splitCount(r.enquiries);
          return (
            <li key={`${r.vehicle}-${r.location}-${i}`} className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-5 py-3.5 text-[13px] leading-snug text-lr-body sm:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] sm:gap-2.5 2xl:px-4">
              <span className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-1 xl:gap-2">
                <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md xl:h-10 xl:w-12 bg-[linear-gradient(180deg,#d9dfd3,#aab59f)] dark:bg-[linear-gradient(180deg,#2a3d33,#17261f)]">
                  {car && <Image src={car} alt="" fill sizes="56px" className="object-contain p-0.5" />}
                </span>
                <span className="min-w-0 break-words font-medium text-lr-head" dangerouslySetInnerHTML={{ __html: html(r.vehicle) }} />
              </span>
              <span className="col-span-2 flex min-w-0 items-center gap-2 sm:col-span-1">
                <FeedIcon kind="pin" className="h-4 w-4 shrink-0 text-lr-ink dark:text-lr-green" />
                <span className="min-w-0 break-words">{r.location}</span>
              </span>
              <span className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <FeedIcon kind="issue" className="h-4 w-4 shrink-0 text-lr-muted" />
                <span dangerouslySetInnerHTML={{ __html: html(r.issue) }} />
              </span>
              <span className="leading-tight">
                <strong className="block text-[15px] font-semibold text-lr-head">{c.n}</strong>
                {c.label}
              </span>
              <span className="flex min-w-0 items-center gap-1.5 leading-tight">
                <FeedIcon kind="refresh" className="h-4 w-4 shrink-0 text-lr-muted" />
                <span className="min-w-0">{r.updated}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function MarketIntelligence({ data, page = null, model = "" }) {
  if (!data) return null;
  const engines = parseList(data.mostRequestedEngines);
  const variants = parseList(data.mostRequestedVariants);
  const failures = parseList(data.mostCommonFailures);
  const cost = parseCost(data.averageReplacementCost);
  const feed = data.liveFeed || [];
  if (!engines.items.length && !variants.items.length && !failures.items.length && !cost.figure && !feed.length) return null;

  const code = genCode(`${page?.hero?.h1 || ""} ${page?.hero?.tagPill || ""}`);
  const car = genCar(page?.hero || {}, model);

  const cards = [
    engines.items.length > 0 && (
      <Card key="e" kind="engines" title="Most Requested Engines" sub="(UK specialist enquiries)" basis={engines.basis} tag={engines.tag} art="engine">
        <List items={engines.items} />
      </Card>
    ),
    variants.items.length > 0 && (
      <Card key="v" kind="variants" title="Most Requested Variants" sub="(Model-level requests)" basis={variants.basis} tag={variants.tag} art="vehicle">
        <List items={variants.items} />
      </Card>
    ),
    cost.figure && (
      <Card key="c" kind="cost" title="Average Replacement Cost" sub={cost.rest ? `(${capital(cost.rest)})` : ""}>
        <p className="whitespace-nowrap text-[28px] font-semibold leading-tight tracking-[-0.02em] text-lr-head xl:text-[30px]">{cost.figure}</p>
        {cost.rest && <p className="mt-2 text-[17px] leading-snug text-lr-body xl:text-[19px]">{cost.rest}</p>}
        {cost.tag && <p className="mt-5 text-[14px] font-medium text-lr-green">{cost.tag}</p>}
      </Card>
    ),
    failures.items.length > 0 && (
      <Card key="f" kind="failures" title="Most Common Failures" basis={failures.basis} tag={failures.tag}>
        <List items={failures.items} />
      </Card>
    ),
  ].filter(Boolean);

  return (
    <section className={`bg-lr-page pb-6 pt-2 text-lr-head md:pb-7 xl:pb-8 ${SANS}`}>
      <div className={CONTAINER}>
        <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">{code ? `${code} enquiry data` : "Enquiry data"}</p>
        <h2 className={`${H2_MODEL} mt-3.5 text-lr-head md:mt-4`}>Market Intelligence</h2>
        <span className="mt-4 flex h-[3px] w-20 overflow-hidden rounded-full md:mt-5" aria-hidden="true">
          <span className="w-[60%] bg-lr-ink dark:bg-lr-green" />
          <span className="flex-1 bg-lr-gold-line" />
        </span>

        {/* the four cards in a row, the live feed full width under them (side by side, both were squeezed) */}
        <div className="mt-6 grid gap-4 md:mt-8 xl:gap-5">
          {cards.length > 0 && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">{cards}</div>}
          {feed.length > 0 && <LiveFeed rows={feed} car={car} />}
        </div>

        <TrustStrip className="mt-5 md:mt-6" />
      </div>
    </section>
  );
}
