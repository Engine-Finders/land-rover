"use client";

import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import VIcon from "@/components/variant/VariantIcons";
import { BODY_SM, CONTAINER, H2, H5, LABEL, NUM, SMALL, STAT, STAT_LG } from "@/lib/typeScale";
// Pass TopoJSON as an object - URL fetches are HTTPS-only by default in
// @vnedyalk0v/react19-simple-maps, so localhost http:// paths fail to load.
import ukRegionsTopo from "../../../public/320d/uk-regions-topo.json";

// Variant section: "Market Intelligence" - stat cards and the regional demand map from the page's
// `marketIntelligence` JSON. Follows the site theme (day / night): cards with brand-green icon discs
// and stat figures on the shared scale that also shrink to the card (container query units), so long
// values never clip.
// figures and shares in the sans, which has a real semibold
const FIG = "font-[family-name:var(--font-instrument-sans)]";

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

const MAP_FILL = { base: "var(--lr-line)", highlight: "var(--lr-green)", stroke: "var(--lr-card)" };
const CARD = "rounded-xl border border-lr-line bg-lr-card shadow-[0_20px_44px_-34px_var(--lr-shadow)]";

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
  clean = clean.replace(/\s+[-–-].*$/, "").trim();
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

  const numberLead = /^(?:approximately\s+)?(£[\d,.]+|[\d,.]+%|[\d,.]+)\s*(.*)$/i;

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

function itemIcon(label = "") {
  const t = label.toLowerCase();
  if (/failure|problem/.test(t)) return "alert";
  if (/mileage|miles/.test(t)) return "gauge";
  if (/cost|price/.test(t)) return "pound";
  if (/code|engine/.test(t)) return "engine";
  if (/season|month|time/.test(t)) return "calendar";
  if (/region/.test(t)) return "users";
  return "info";
}

// one line, scaled down to the card width when the value is too long for the STAT_LG step;
// the class caps each breakpoint at the shared scale (28/30/32/34px)
function figureFit(value) {
  const cq = Math.min(18, 96 / (String(value).length * 0.56));
  return { "--fig-fit": `${cq.toFixed(1)}cqw` };
}
const STAT_LG_FIT = `${STAT_LG.replace(/\S*text-\[\d+px\]/g, "").trim()} text-[length:min(28px,var(--fig-fit))] md:text-[length:min(30px,var(--fig-fit))] lg:text-[length:min(32px,var(--fig-fit))] xl:text-[length:min(34px,var(--fig-fit))]`;

function StatCard({ icon, label, title, stat, subtext, tag }) {
  const wrap = String(stat).length > 14;
  return (
    <div className={`@container flex min-w-0 flex-col p-3.5 md:p-5 ${CARD}`}>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lr-brand text-lr-on-brand md:h-12 md:w-12">
          <VIcon name={icon} className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} />
        </span>
        <p className={`${SMALL} font-medium text-lr-body`}>{label}</p>
      </div>
      {title && <p className={`${BODY_SM} mt-3 font-medium text-lr-head`}>{title}</p>}
      {wrap ? (
        <p className={`${STAT} ${FIG} ${title ? "mt-1.5" : "mt-3"} break-words text-lr-head`}>{stat}</p>
      ) : (
        <p className={`${STAT_LG_FIT} ${FIG} ${title ? "mt-1.5" : "mt-3"} whitespace-nowrap text-lr-head`} style={figureFit(stat)}>{stat}</p>
      )}
      {subtext && <p className={`${BODY_SM} mt-2 text-lr-body`}>{subtext}</p>}
      {tag && <p className={`${LABEL} mt-auto pt-3 text-lr-green`}>{tag}</p>}
    </div>
  );
}

function RegionCard({ label, regions, tag }) {
  return (
    <div className={`flex min-w-0 flex-col p-3.5 md:p-5 ${CARD}`}>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lr-brand text-lr-on-brand md:h-12 md:w-12">
          <VIcon name="users" className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} />
        </span>
        <p className={`${SMALL} font-medium text-lr-body`}>{label}</p>
      </div>
      <ul className="mt-3 divide-y divide-lr-line">
        {regions.map((r) => (
          <li key={r.name} className="flex items-baseline justify-between gap-2 py-1.5 first:pt-0">
            <span className={`${BODY_SM} text-lr-body`}>{r.name}</span>
            <span className={`${NUM} ${FIG} text-lr-head`}>{r.share}</span>
          </li>
        ))}
      </ul>
      {tag && <p className={`${LABEL} mt-auto pt-3 text-lr-green`}>{tag}</p>}
    </div>
  );
}

function RegionalDemandMap({ regions }) {
  const highlighted = highlightedGeoNames(regions);
  // Prefer London → South East stack like the reference; otherwise top 2 by share.
  const bubbleRegions = [...regions]
    .filter((region) => BUBBLE_LAYOUT[region.name])
    .sort((a, b) => {
      const rankA = BUBBLE_LAYOUT[a.name]?.rank ?? 99;
      const rankB = BUBBLE_LAYOUT[b.name]?.rank ?? 99;
      if (rankA !== rankB) return rankA - rankB;
      return parseFloat(b.share) - parseFloat(a.share);
    })
    .slice(0, 2);

  return (
    <div className={`flex h-full flex-col overflow-visible p-4 md:p-6 ${CARD}`}>
      <h3 className={`${H5} text-lr-head`}>
        Regional Demand Breakdown
      </h3>
      <div className="relative mt-2 min-h-[340px] w-full flex-1 overflow-visible">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-1.5, 52.6], scale: 3000 }}
          className="absolute inset-0 h-full w-full"
        >
          <Geographies geography={ukRegionsTopo}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.EER13NM;
                const isHot = highlighted.has(name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHot ? MAP_FILL.highlight : MAP_FILL.base}
                    stroke={MAP_FILL.stroke}
                    strokeWidth={0.55}
                    style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible text-lr-green/50">
          {bubbleRegions.map((region) => {
            const line = BUBBLE_LAYOUT[region.name]?.line;
            if (!line) return null;
            const midX = (line.x1 + line.x2) / 2 + 4;
            const midY = (line.y1 + line.y2) / 2 - 4;
            return (
              <path
                key={region.name}
                d={`M ${line.x1} ${line.y1} Q ${midX} ${midY} ${line.x2} ${line.y2}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {bubbleRegions.map((region) => (
          <div
            key={region.name}
            className={`absolute z-10 flex h-[5rem] w-[5rem] shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-lr-green/50 bg-lr-card text-center shadow-[0_3px_10px_var(--lr-shadow)] xl:h-[5.75rem] xl:w-[5.75rem] ${BUBBLE_LAYOUT[region.name]?.className || ""}`}
          >
            <span className={`${NUM} ${FIG} text-lr-ink`}>{region.share}</span>
            <span className={`${SMALL} mt-1 max-w-[90%] leading-[1.1] text-lr-muted`}>{region.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketIntelligence({ data }) {
  if (!data?.items?.length) return null;

  const items = data.items;
  const regionalItem = items.find((item) => item.label === "Regional Demand");
  const { regions, tag } = regionalItem ? parseRegionalDemand(regionalItem.value) : { regions: [], tag: "" };

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      <div className={`relative ${CONTAINER} py-10 md:py-14`}>
        <div className="flex items-center gap-3">
          <p className={`${LABEL} text-lr-gold`}>Engine Snapshot</p>
          <span className="h-px w-10 bg-lr-gold-line md:w-14" aria-hidden="true" />
        </div>
        <h2 className={`${H2} mt-3 text-lr-ink`}>Market Intelligence</h2>

        <div className={`mt-6 grid gap-4 lg:gap-5 ${regions.length ? "lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]" : ""}`}>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
            {items.map((item) =>
              item.label === "Regional Demand" ? (
                regions.length ? (
                  <RegionCard key={item.label} label={item.label} regions={regions} tag={tag} />
                ) : (
                  <StatCard key={item.label} icon="users" label={item.label} {...parseMetric(item.value)} />
                )
              ) : (
                <StatCard key={item.label} icon={itemIcon(item.label)} label={item.label} {...parseMetric(item.value)} />
              ),
            )}
          </div>

          {regions.length > 0 && (
            <div className="lg:h-full">
              <RegionalDemandMap regions={regions} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
