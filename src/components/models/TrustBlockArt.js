// Decorative art for sections 12 (TrustBlock) and 14 (ClosingActionCards): a UK outline drawn from
// a coarse coastline (Great Britain, Northern Ireland and the main islands, projected from lon/lat),
// as a dot map (section 12, behind the car) or a filled map with specialist pins (section 14), and an
// abstract "data insights" line + bar chart. All aria-hidden: they illustrate, they carry no data.

const GB = [
  [-3.37, 58.67], [-3.03, 58.64], [-3.09, 58.44], [-3.65, 58.12], [-3.77, 57.86], [-4.2, 57.52], [-3.87, 57.59],
  [-3.28, 57.72], [-2.0, 57.69], [-1.78, 57.5], [-2.08, 57.15], [-2.47, 56.71], [-2.58, 56.28], [-3.2, 56.05],
  [-2.72, 56.06], [-2.13, 55.9], [-2.0, 55.77], [-1.7, 55.6], [-1.42, 55.02], [-1.2, 54.68], [-0.61, 54.49],
  [-0.08, 54.12], [0.11, 53.58], [0.34, 53.14], [0.2, 52.85], [0.5, 52.95], [1.3, 52.93], [1.73, 52.6],
  [1.75, 52.48], [1.35, 51.96], [1.15, 51.79], [0.7, 51.53], [1.44, 51.37], [1.32, 51.13], [0.97, 50.91],
  [0.25, 50.73], [-0.14, 50.82], [-1.1, 50.78], [-1.9, 50.71], [-2.45, 50.58], [-3.4, 50.62], [-3.64, 50.22],
  [-4.14, 50.36], [-5.2, 49.96], [-5.71, 50.07], [-5.48, 50.21], [-4.94, 50.54], [-4.53, 51.02], [-3.48, 51.21],
  [-2.7, 51.55], [-3.17, 51.47], [-3.94, 51.6], [-4.32, 51.56], [-5.3, 51.73], [-5.07, 52.03], [-4.1, 52.4],
  [-4.1, 52.75], [-4.77, 52.8], [-4.3, 53.14], [-4.56, 53.42], [-3.83, 53.33], [-3.1, 53.38], [-3.0, 53.45],
  [-3.05, 53.82], [-2.9, 54.07], [-3.23, 54.11], [-3.64, 54.51], [-3.3, 54.95], [-4.05, 54.83], [-4.86, 54.64],
  [-5.1, 54.9], [-4.63, 55.46], [-4.9, 55.95], [-5.8, 55.3], [-5.55, 56.0], [-5.47, 56.42], [-6.23, 56.73],
  [-5.83, 57.0], [-5.71, 57.28], [-5.8, 57.8], [-5.17, 57.9], [-5.0, 58.62], [-4.4, 58.56], [-3.52, 58.6],
];
const NI = [
  [-6.1, 55.25], [-5.45, 54.75], [-5.43, 54.45], [-5.55, 54.3], [-6.15, 54.03], [-6.6, 54.05], [-7.0, 54.3],
  [-7.6, 54.15], [-8.17, 54.45], [-7.55, 54.6], [-7.25, 55.05], [-6.5, 55.25],
];
const ISLANDS = [
  [[-6.25, 58.52], [-6.15, 58.2], [-6.4, 57.88], [-7.05, 57.75], [-7.1, 58.0], [-6.8, 58.25]], // Lewis & Harris
  [[-7.2, 57.65], [-7.2, 57.1], [-7.45, 57.1], [-7.5, 57.6]], // the Uists
  [[-5.95, 57.68], [-5.65, 57.3], [-5.9, 57.05], [-6.35, 57.3], [-6.6, 57.5]], // Skye
  [[-5.65, 56.55], [-6.0, 56.3], [-6.35, 56.35], [-6.1, 56.6]], // Mull
  [[-6.05, 55.95], [-6.05, 55.65], [-6.45, 55.7], [-6.4, 55.9]], // Islay
  [[-3.35, 59.15], [-2.75, 59.1], [-2.8, 58.85], [-3.3, 58.9]], // Orkney
  [[-1.55, 50.72], [-1.1, 50.75], [-1.2, 50.58], [-1.5, 50.62]], // Isle of Wight
];

const LON0 = -8.4;
const LAT0 = 59.45;
const K = 20;
const C = Math.cos((54.5 * Math.PI) / 180);
const project = ([lon, lat]) => [(lon - LON0) * C * K, (LAT0 - lat) * K];
const toPath = (poly) => `M${poly.map((p) => project(p).map((v) => v.toFixed(1)).join(" ")).join("L")}Z`;

const UK_PATH = [GB, NI, ...ISLANDS].map(toPath).join("");
const UK_VIEWBOX = "0 0 120 192";

// specialist pins (London, Birmingham, Manchester, Leeds, Bristol, Newcastle)
const PINS = [[-0.12, 51.5], [-1.9, 52.48], [-2.24, 53.48], [-1.55, 53.8], [-2.6, 51.45], [-1.6, 54.97]].map(project);

// Dot map: a dot grid clipped to the coastline (one pattern, so the markup stays tiny).
export function UkDotMap({ className = "" }) {
  return (
    <svg viewBox={UK_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="uk-dot-grid" width="2.6" height="2.6" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="1.3" r="0.62" className="fill-current" />
        </pattern>
      </defs>
      <path d={UK_PATH} fill="url(#uk-dot-grid)" />
    </svg>
  );
}

// Filled map with gold pins.
export function UkPinMap({ className = "" }) {
  return (
    <svg viewBox={UK_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path d={UK_PATH} className="fill-lr-gold/20 dark:fill-lr-gold/15" />
      {PINS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <path d="M0 0c-2.6-3.6-4.6-6.2-4.6-8.6a4.6 4.6 0 0 1 9.2 0c0 2.4-2 5-4.6 8.6Z" className="fill-lr-gold" />
          <circle cx="0" cy="-8.6" r="1.7" className="fill-lr-card" />
        </g>
      ))}
    </svg>
  );
}

// Insights chart, as in the reference: "DATA INSIGHTS", a 25-100 scale, rising bars under a trend
// line and the months along the foot. Decorative - it illustrates, it carries no data.
const BARS = [22, 30, 26, 38, 34, 46, 42, 55, 50, 63, 58, 72];
const LINE = [[30, 118], [50, 110], [70, 114], [90, 98], [110, 102], [130, 86], [150, 90], [170, 72], [190, 76], [210, 58], [230, 50]];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const AXIS = [[100, 40], [75, 66], [50, 92], [25, 118]];

export function InsightsChart({ className = "" }) {
  return (
    <svg viewBox="0 0 260 166" className={className} aria-hidden="true" focusable="false">
      <text x="22" y="12" className="fill-lr-head" fontSize="7.5" fontWeight="600" letterSpacing="0.6">DATA INSIGHTS</text>
      {AXIS.map(([v, y]) => (
        <g key={v}>
          <text x="16" y={y + 2.4} textAnchor="end" className="fill-lr-muted" fontSize="6.5">{v}</text>
          <line x1="22" x2="256" y1={y} y2={y} className="stroke-lr-line" strokeWidth="0.8" strokeDasharray="2 4" />
        </g>
      ))}
      {BARS.map((h, i) => (
        <rect key={i} x={26 + i * 19.2} y={144 - h} width="9" height={h} rx="1.5" className="fill-lr-green/25 dark:fill-lr-green/20" />
      ))}
      <polyline points={LINE.map((p) => p.join(",")).join(" ")} fill="none" className="stroke-lr-ink dark:stroke-lr-green" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {LINE.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" className="fill-lr-card stroke-lr-ink dark:stroke-lr-green" strokeWidth="1.4" />
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={30.5 + i * 19.2} y="158" textAnchor="middle" className="fill-lr-muted" fontSize="5.6">{m}</text>
      ))}
    </svg>
  );
}
