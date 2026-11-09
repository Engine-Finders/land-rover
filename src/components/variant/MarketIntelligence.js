"use client";

import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H2, H5, ICON_MD } from "@/lib/typeScale";
// Pass TopoJSON as an object - URL fetches are HTTPS-only by default in
// @vnedyalk0v/react19-simple-maps, so localhost http:// paths fail to load.
import ukRegionsTopo from "../../../public/320d/uk-regions-topo.json";

// Variant section 7: "Market Intelligence", built to the approved reference (day + night) - a gold
// label, serif title and intro, six stat cards (icon disc, label, serif figure, note, source tag) and
// the regional demand map with share bubbles, from the page's `marketIntelligence` JSON. Icon discs
// are brand green by day and gold rings at night. Phones: two cards per row (ranges may break after
// their dash), the map below.

// Map copy labels -> England EER geo names used in the topo file.
const REGION_ALIASES = {
  London: ["London"],
  "South East": ["South East"],
  "South West": ["South West"],
  "North West": ["North West"],
  "North East": ["North East"],
  Eastern: ["Eastern"],
  Midlands: ["East Midlands", "West Midlands"],
  "East Midlands": ["East Midlands"],
  "West Midlands": ["West Midlands"],
  Yorkshire: ["Yorkshire and The Humber"],
  "Yorkshire and The Humber": ["Yorkshire and The Humber"],
};

const SERIF = "font-[family-name:var(--font-serif-display)]";
const SANS = "font-[family-name:var(--font-instrument-sans)]";
const CARD = "rounded-lg border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)]";
const TAG = "text-[12.5px] font-medium uppercase tracking-[0.04em] text-lr-ink dark:text-lr-green md:text-[13px] xl:text-[15px]";
// map fills: a quiet base, the demand regions graded by share (darkest = highest)
const MAP_BASE = "color-mix(in srgb, var(--lr-line) 85%, var(--lr-card))";
const MAP_HOT = ["var(--lr-green)", "color-mix(in srgb, var(--lr-green) 72%, var(--lr-card))", "color-mix(in srgb, var(--lr-green) 50%, var(--lr-card))"];

// Bubble + connector layout for the right-side callouts.
const BUBBLE_LAYOUT = {
  London: { className: "right-[6%] top-[34%]", line: { x1: 80, y1: 44, x2: 58, y2: 54 }, rank: 1 },
  "South East": { className: "right-[4%] top-[63%]", line: { x1: 82, y1: 72, x2: 62, y2: 68 }, rank: 2 },
  "South West": { className: "left-[2%] top-[78%]", line: { x1: 18, y1: 82, x2: 38, y2: 80 }, rank: 3 },
  "North West": { className: "left-[2%] top-[20%]", line: { x1: 18, y1: 26, x2: 40, y2: 28 }, rank: 4 },
  "North East": { className: "right-[8%] top-[6%]", line: { x1: 76, y1: 12, x2: 54, y2: 14 }, rank: 5 },
  Midlands: { className: "right-[4%] top-[34%]", line: { x1: 82, y1: 40, x2: 52, y2: 44 }, rank: 3 },
  "East Midlands": { className: "right-[4%] top-[34%]", line: { x1: 82, y1: 40, x2: 54, y2: 42 }, rank: 3 },
  "West Midlands": { className: "left-[4%] top-[40%]", line: { x1: 18, y1: 46, x2: 46, y2: 48 }, rank: 3 },
  Eastern: { className: "right-[2%] top-[38%]", line: { x1: 84, y1: 44, x2: 62, y2: 46 }, rank: 3 },
  Yorkshire: { className: "right-[8%] top-[22%]", line: { x1: 78, y1: 28, x2: 52, y2: 30 }, rank: 4 },
  "Yorkshire and The Humber": { className: "right-[8%] top-[22%]", line: { x1: 78, y1: 28, x2: 52, y2: 30 }, rank: 4 },
};

function parseRegionalDemand(value = "") {
  const tagMatch = value.match(/\s*[\[【]([^\]】]+)[\]】]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  let clean = tagMatch ? value.slice(0, tagMatch.index) : value;
  // Drop trailing prose after the last share, e.g. "- premium SUV strongholds"
  clean = clean.replace(/\s+[---].*$/, "").trim();
  const regions = clean
    .split(",")
    .map((part) => {
      const match = part.trim().match(/^(.*?)\s*\(([^)]+)\)/);
      return match ? { name: match[1].trim(), share: match[2].trim() } : null;
    })
    .filter(Boolean);
  return { regions, tag };
}

function parseMetric(value = "") {
  const tagMatch = value.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const clean = (tagMatch ? value.slice(0, tagMatch.index) : value).trim();

  // a figure or range: "120,000-150,000", "£3,500-£4,500", "65%", "£1.2k"
  const numberLead = /^(?:approximately\s+)?(£?[\d][\d,.]*k?(?:\s*[--]\s*£?[\d][\d,.]*k?)?%?)\s*(.*)$/i;
  // an engine code with its note: "11L (Defender-spec 200Tdi)" -> "11L" + "(Defender-spec 200Tdi)"
  const code = clean.match(/^([A-Z0-9][A-Z0-9/]{1,9})\s+(\(.+\))$/);
  if (code && /\d/.test(code[1])) return { title: "", stat: code[1], subtext: code[2], tag };

  const dashIndex = clean.indexOf(" - ");
  if (dashIndex !== -1) {
    const left = clean.slice(0, dashIndex).trim();
    const right = clean.slice(dashIndex + 3).trim();
    const rightMatch = right.match(numberLead);
    if (rightMatch) {
      return { title: left, stat: rightMatch[1], subtext: rightMatch[2].trim(), tag };
    }
    return { title: "", stat: left, subtext: right, tag };
  }

  const leadMatch = clean.match(numberLead);
  if (leadMatch && /^[\d£]/.test(clean)) {
    return { title: "", stat: leadMatch[1], subtext: leadMatch[2].trim(), tag };
  }
  return { title: "", stat: clean, subtext: "", tag };
}

function highlightedGeoNames(regions) {
  const names = new Set();
  regions.forEach((region) => {
    (REGION_ALIASES[region.name] || []).forEach((geoName) => names.add(geoName));
  });
  return names;
}

// card icon, matched on its label: chain / gauge / pound / engine / calendar / bars
function CardIcon({ label = "", title = "" }) {
  const t = label.toLowerCase();
  const disc = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lr-brand text-white md:h-12 md:w-12 lg:h-10 lg:w-10 xl:h-12 xl:w-12 dark:border-[1.5px] dark:border-lr-gold-line/70 dark:bg-transparent dark:text-lr-gold";
  if (/cost|price/.test(t)) return <span className={disc}><LrIcon name="best-used-buy-2" tone="current" className={ICON_MD} /></span>;
  if (/season|month|time/.test(t)) return <span className={disc}><LrIcon name="market-insight" tone="current" className={ICON_MD} /></span>;
  const name = /failure|problem/.test(t) ? (/belt|chain/i.test(title) ? "chain" : "expensive-failure")
    : /mileage|miles/.test(t) ? "meter" : /code|engine/.test(t) ? "engine" : /region/.test(t) ? "real-inquiries" : "real-inquiries";
  return <span className={disc}><LrIcon name={name} tone="current" className={ICON_MD} /></span>;
}
const dash = (v = "") => String(v).replace(/ - /g, " - ");

function StatCard({ label, title, stat, subtext, tag }) {
  // a failure / text-only card: the name in the serif and its note, no big figure
  const textual = !/[\d£]/.test(stat) && !/^[A-Z][a-z]+\/[A-Z]/.test(stat);
  const head = textual ? stat : title;
  const figure = textual ? "" : stat;
  return (
    <div className={`${CARD} flex min-w-0 flex-col p-3.5 md:p-5 lg:p-4 xl:p-5`}>
      <div className="flex flex-col items-start gap-2 min-[400px]:flex-row min-[400px]:items-center min-[400px]:gap-3">
        <CardIcon label={label} title={head} />
        <p className="text-[13px] font-medium leading-snug text-lr-body md:text-[13.5px] lg:text-[12.5px] xl:text-[15px]">{label}</p>
      </div>
      {head && <p className={`${SERIF} mt-2.5 text-[16px] leading-snug text-lr-head md:mt-3 md:text-[18px]`}>{dash(head)}</p>}
      {figure && (
        <p className={`${SERIF} mt-2.5 text-[21px] leading-[1.12] tracking-[-0.01em] text-lr-ink min-[400px]:text-[23px] md:mt-3 md:text-[26px] lg:text-[23px] xl:text-[28px] min-[1400px]:text-[31px] dark:text-lr-green`} dangerouslySetInnerHTML={{ __html: figure.replace(/([-\-/])/, "$1<wbr>") }} />
      )}
      {subtext && <p className="mt-2 text-[13.5px] leading-snug text-lr-body md:text-[14.5px] xl:text-[15px]">{dash(subtext)}</p>}
      {tag && <p className={`${TAG} mt-auto pt-3`}>[{tag}]</p>}
    </div>
  );
}

function RegionCard({ label, regions, tag }) {
  return (
    <div className={`${CARD} flex min-w-0 flex-col p-3.5 md:p-5 lg:p-4 xl:p-5`}>
      <div className="flex flex-col items-start gap-2 min-[400px]:flex-row min-[400px]:items-center min-[400px]:gap-3">
        <CardIcon label={label} />
        <p className="text-[13px] font-medium leading-snug text-lr-body md:text-[13.5px] lg:text-[12.5px] xl:text-[15px]">{label}</p>
      </div>
      <ul className="mt-3 divide-y divide-lr-line">
        {regions.map((r) => (
          <li key={r.name} className="flex items-baseline justify-between gap-2 py-2">
            <span className="text-[13.5px] text-lr-head md:text-[14.5px] xl:text-[15px]">{r.name}</span>
            <span className="text-[14px] font-semibold text-lr-head md:text-[15px]">{r.share}</span>
          </li>
        ))}
      </ul>
      {tag && <p className={`${TAG} mt-auto pt-3`}>[{tag}]</p>}
    </div>
  );
}

function RegionalDemandMap({ regions }) {
  // shade rank by share, highest first
  const ranked = [...regions].sort((a, b) => parseFloat(b.share) - parseFloat(a.share));
  const shade = new Map();
  ranked.forEach((r, i) => (REGION_ALIASES[r.name] || []).forEach((g) => shade.set(g, MAP_HOT[Math.min(i, MAP_HOT.length - 1)])));
  const bubbleRegions = regions.filter((region) => BUBBLE_LAYOUT[region.name]).slice(0, 3);

  return (
    <div className={`${CARD} flex h-full flex-col p-4 md:p-6`}>
      <h3 className={`${H5} text-lr-head`}>Regional Demand Breakdown</h3>
      <div className="relative mt-3 aspect-[4/3.3] w-full max-w-[520px] self-center lg:mt-2 lg:aspect-auto lg:min-h-[360px] lg:max-w-none lg:flex-1">
        <ComposableMap projection="geoMercator" projectionConfig={{ center: [-1.6, 52.7], scale: 2900 }} className="absolute inset-0 h-full w-full">
          <Geographies geography={ukRegionsTopo}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={shade.get(geo.properties.EER13NM) || MAP_BASE}
                  stroke="var(--lr-card)"
                  strokeWidth={0.6}
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible text-lr-line-strong" aria-hidden="true">
          {bubbleRegions.map((region) => {
            const line = BUBBLE_LAYOUT[region.name]?.line;
            if (!line) return null;
            const midX = (line.x1 + line.x2) / 2 + 4;
            const midY = (line.y1 + line.y2) / 2 - 4;
            return <path key={region.name} d={`M ${line.x1} ${line.y1} Q ${midX} ${midY} ${line.x2} ${line.y2}`} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
          })}
        </svg>

        {bubbleRegions.map((region) => (
          <div
            key={region.name}
            className={`absolute z-10 flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full xl:h-[92px] xl:w-[92px] border border-lr-line-strong bg-lr-card text-center shadow-[0_4px_14px_-6px_var(--lr-shadow)] md:h-[76px] md:w-[76px] ${BUBBLE_LAYOUT[region.name].className}`}
          >
            <span className={`${SERIF} text-[19px] leading-none text-lr-ink md:text-[21px] dark:text-lr-head`}>{region.share}</span>
            <span className="mt-1 max-w-[86%] text-[10.5px] leading-[1.1] text-lr-body md:text-[11px] xl:text-[15px]">{region.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketIntelligence({ data, variantName = "" }) {
  if (!data?.items?.length) return null;

  const items = data.items;
  const regionalItem = items.find((item) => item.label === "Regional Demand");
  const { regions, tag } = regionalItem ? parseRegionalDemand(regionalItem.value) : { regions: [], tag: "" };

  return (
    <section className={`relative overflow-hidden bg-lr-band text-lr-head ${SANS}`}>
      <div className={`relative ${CONTAINER} py-6 md:py-6 lg:py-7`}>
        <div className="grid gap-4 lg:gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-lr-gold md:text-[14px] xl:text-[15px]">Market Snapshot</p>
              <span className="h-px w-10 bg-lr-gold-line md:w-14" aria-hidden="true" />
            </div>
            <h2 className={`${H2} mt-3 text-lr-head`}>Market Intelligence</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-lr-body md:text-[16px]">
              Real data from thousands of {variantName || "Land Rover"} enquiries in 2025.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
              {items.map((item) =>
                item.label === "Regional Demand" && regions.length ? (
                  <RegionCard key={item.label} label={item.label} regions={regions} tag={tag} />
                ) : (
                  <StatCard key={item.label} label={item.label} {...parseMetric(item.value)} />
                ),
              )}
            </div>
          </div>

          {regions.length > 0 && <RegionalDemandMap regions={regions} />}
        </div>
      </div>
    </section>
  );
}
