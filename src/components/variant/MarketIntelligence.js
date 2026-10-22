"use client";

import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import HeadingEyebrow from "@/components/reusableComponents/HeadingEyebrow";
import { HomeIcon } from "@/components/home/homeIcons";
import { sectionBgClass } from "@/components/home/sectionBand";
// Pass TopoJSON as an object - URL fetches are HTTPS-only by default in
// @vnedyalk0v/react19-simple-maps, so localhost http:// paths fail to load.
import ukRegionsTopo from "../../../public/320d/uk-regions-topo.json";

const ITEM_ICONS = ["expensiveFailure", "checkWatch", "checkValue", "quote", "checkWatch", "trend"];

// Map copy labels → England EER geo names used in the topo file.
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

const MAP_FILL = { base: "#cfcfcf", highlight: "#4a4a4a", stroke: "#ececec" };

// Bubble + connector layout for the simple right-side callouts (ref style).
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
    <div className="flex h-full flex-col overflow-visible rounded-[8px] border border-[var(--color-border)]/75 bg-[#f0f0f0] p-4">
      <p className="font-lora text-[0.85rem] font-medium uppercase tracking-wide text-black">
        Regional Demand Breakdown
      </p>
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
                stroke="#111"
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
            className={`absolute z-10 flex h-[4.25rem] w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-black bg-white text-center shadow-[0_3px_10px_rgba(0,0,0,0.1)] ${BUBBLE_LAYOUT[region.name]?.className || ""}`}
          >
            <span className="text-[1.05rem] font-bold leading-none text-black">{region.share}</span>
            <span className="mt-1 max-w-[88%] text-[0.58rem] leading-[1.1] text-black/65">{region.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketIntelligence({ data, band = "page" }) {
  if (!data) return null;

  const items = data.items || [];
  const regionalItem = items.find((item) => item.label === "Regional Demand");
  const { regions, tag } = regionalItem ? parseRegionalDemand(regionalItem.value) : { regions: [], tag: "" };

  return (
    <section className={`w-full py-8 text-[var(--color-text)] md:py-10 ${sectionBgClass(band)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <HeadingEyebrow text="MARKET INTELLIGENCE" />
            <h2 className="mt-3 font-lora text-[2.15rem] font-medium leading-[1.1] tracking-normal md:text-[3rem]">
              Market Intelligence
            </h2>

            {items.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {items.map((item, index) => {
                  if (item.label === "Regional Demand") {
                    return (
                      <div key={item.label} className="glass-panel flex flex-col gap-2 rounded-[8px] p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
                            <HomeIcon name="trend" size={44} className="h-11 w-11" />
                          </span>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">{item.label}</p>
                        </div>
                        <div className="flex flex-col">
                          {regions.map((region) => (
                            <div key={region.name} className="flex items-center justify-between border-t border-[var(--color-border)]/55 py-1.5 first:border-t-0 first:pt-0">
                              <span className="text-[0.78rem] text-[var(--color-text-muted)]">{region.name}</span>
                              <span className="text-[0.8rem] font-semibold text-[var(--color-text)]">{region.share}</span>
                            </div>
                          ))}
                        </div>
                        {tag ? <p className="text-[0.62rem] font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">{tag}</p> : null}
                      </div>
                    );
                  }
                  const { title, stat, subtext, tag: metricTag } = parseMetric(item.value);
                  return (
                    <div key={item.label} className="flex flex-col justify-between rounded-[8px] border border-[var(--color-border)]/75 bg-[var(--color-surface)] p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
                          <HomeIcon name={ITEM_ICONS[index % ITEM_ICONS.length]} size={44} className="h-11 w-11" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="text-[0.7rem] font-medium text-[var(--color-text-soft)]">{item.label}</p>
                          {title ? <p className="text-[0.8rem] font-bold leading-tight text-[var(--color-text)]">{title}</p> : null}
                        </div>
                      </div>

                      <p className="mt-4 text-[16px] font-extrabold leading-none text-[var(--color-primary)] md:text-[18px]">{stat}</p>

                      <div className="mt-2 flex flex-col gap-1">
                        {subtext ? <p className="text-[0.72rem] text-[var(--color-text-muted)]">{subtext}</p> : null}
                        {metricTag ? (
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">[{metricTag}]</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {regions.length > 0 ? (
            <div className="lg:col-span-4 lg:h-full">
              <RegionalDemandMap regions={regions} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
