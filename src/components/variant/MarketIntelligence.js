"use client";

import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import VIcon from "@/components/variant/VariantIcons";
// Pass TopoJSON as an object - URL fetches are HTTPS-only by default in
// @vnedyalk0v/react19-simple-maps, so localhost http:// paths fail to load.
import ukRegionsTopo from "../../../public/320d/uk-regions-topo.json";

// Variant section: "Market Intelligence" - stat cards and the regional demand map from the page's
// `marketIntelligence` JSON. Fixed light design: white cards with dark-green icon discs and serif
// figures that size themselves to the card (container query units), so long values never clip.

const INK = "#1f3d24";
const GREEN = "#2f5a35";
const GOLD = "#c9a24a";
const SERIF = { fontFamily: "var(--font-serif-display), Georgia, 'Times New Roman', serif" };

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

const MAP_FILL = { base: "#dcdfd8", highlight: "#2f5a35", stroke: "#ffffff" };

// Bubble + connector layout for the right-side callouts.
const BUBBLE_LAYOUT = {
  London: { className: "right-[6%] top-[42%]", line: { x1: 80, y1: 50, x2: 58, y2: 54 }, rank: 1 },
  "South East": { className: "right-[4%] top-[62%]", line: { x1: 82, y1: 70, x2: 62, y2: 68 }, rank: 2 },
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

// one line, scaled to the card width; long text values wrap at a smaller size instead
function figureSize(value, max) {
  const cq = Math.min(18, 96 / (String(value).length * 0.56));
  return `min(${max}px, ${cq.toFixed(1)}cqw)`;
}

function StatCard({ icon, label, title, stat, subtext, tag }) {
  const wrap = String(stat).length > 14;
  return (
    <div className="@container flex min-w-0 flex-col rounded-xl border border-[#e6e2d8] bg-white p-3.5 shadow-[0_8px_24px_-18px_rgba(31,61,36,0.4)] md:p-5">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white md:h-12 md:w-12" style={{ background: INK }}>
          <VIcon name={icon} className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} />
        </span>
        <p className="text-[12.5px] font-medium leading-snug text-[#2b3229] md:text-[13.5px]">{label}</p>
      </div>
      {title && <p className="mt-3 text-[14px] font-semibold leading-snug text-[#141a13] md:text-[15px]">{title}</p>}
      {wrap ? (
        <p className={`${title ? "mt-1.5" : "mt-3"} break-words leading-[1.15] text-[#141a13]`} style={{ ...SERIF, fontSize: "min(26px, 15cqw)" }}>{stat}</p>
      ) : (
        <p className={`${title ? "mt-1.5" : "mt-3"} whitespace-nowrap leading-[1.1] text-[#141a13]`} style={{ ...SERIF, fontSize: figureSize(stat, 34) }}>{stat}</p>
      )}
      {subtext && <p className="mt-1.5 text-[12.5px] leading-snug text-[#4a5048] md:text-[14px]">{subtext}</p>}
      {tag && <p className="mt-auto pt-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: GREEN }}>{tag}</p>}
    </div>
  );
}

function RegionCard({ label, regions, tag }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-[#e6e2d8] bg-white p-3.5 shadow-[0_8px_24px_-18px_rgba(31,61,36,0.4)] md:p-5">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white md:h-12 md:w-12" style={{ background: INK }}>
          <VIcon name="users" className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} />
        </span>
        <p className="text-[12.5px] font-medium leading-snug text-[#2b3229] md:text-[13.5px]">{label}</p>
      </div>
      <ul className="mt-3 divide-y divide-[#ece8df]">
        {regions.map((r) => (
          <li key={r.name} className="flex items-baseline justify-between gap-2 py-1.5 first:pt-0">
            <span className="text-[13px] text-[#4a5048] md:text-[14px]">{r.name}</span>
            <span className="text-[18px] leading-none text-[#141a13] md:text-[21px]" style={SERIF}>{r.share}</span>
          </li>
        ))}
      </ul>
      {tag && <p className="mt-auto pt-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: GREEN }}>{tag}</p>}
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
    <div className="flex h-full flex-col overflow-visible rounded-xl border border-[#e6e2d8] bg-white p-4 shadow-[0_8px_24px_-18px_rgba(31,61,36,0.4)] md:p-6">
      <h3 className="text-[20px] leading-tight text-[#141a13] md:text-[23px]" style={SERIF}>
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

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible">
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
                stroke="#9fb39a"
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
            className={`absolute z-10 flex h-[4.25rem] w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-[#9fb39a] bg-white text-center shadow-[0_3px_10px_rgba(0,0,0,0.1)] ${BUBBLE_LAYOUT[region.name]?.className || ""}`}
          >
            <span className="text-[1.05rem] font-bold leading-none text-[#1f3d24]">{region.share}</span>
            <span className="mt-1 max-w-[88%] text-[0.58rem] leading-[1.1] text-black/65">{region.name}</span>
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
    <section className="relative overflow-hidden bg-[#f6f5f1] text-[#141a13]">
      <div className="relative mx-auto max-w-8xl px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a6a1f] md:text-[13px]">Engine Snapshot</p>
          <span className="h-px w-10 md:w-14" style={{ background: GOLD }} aria-hidden="true" />
        </div>
        <h2 className="mt-2 text-[34px] leading-[1.08] sm:text-[42px] lg:text-[52px]" style={{ ...SERIF, color: INK }}>Market Intelligence</h2>

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
