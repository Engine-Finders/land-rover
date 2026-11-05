import LrIcon from "@/components/shared/LrIcon";
import { ICON_MD } from "@/lib/typeScale";

// Home-page icons. Every pictogram is drawn from the brand icon set (LrIcon): the icon names the home
// data uses (src/data/guide-home/*.json) map to a brand icon below, and any brand icon name
// (src/components/shared/lrIconNames.js) passes straight through. Sections whose items need a more
// specific icon resolve their own names first. Only UI marks (chevrons, the arrow disc), the car line
// drawing, the signature and Trustpilot's stars stay as inline SVG, coloured via currentColor.

// data icon name -> brand icon, by what the icon stands for on the home page
const BRAND = {
  "air-suspension": "air-suspension-knowledge",
  alert: "expensive-failure",
  axle: "chassis",
  bolt: "electric-failures",
  book: "generation-honest-rated",
  broadcast: "live-feed",
  building: "calculator", // main dealer estimate
  calendar: "trend",
  car: "vehicle",
  chart: "real-inquiries",
  "chart-search": "scope-decision",
  "check-circle": "good-choice",
  clipboard: "symptoms",
  cog: "gearbox-problem",
  crown: "flagship-choice",
  diamond: "niche-style",
  document: "oem-references",
  drivetrain: "drivetrain-failures",
  "engine-detail": "engine",
  family: "best-family",
  flame: "most-enquired",
  garage: "part-of-engine-finders",
  gauge: "meter",
  gear: "specific-knowledge",
  headset: "get-guidance",
  invoice: "oem-references",
  lock: "independent-and-impartial",
  mountain: "hill",
  people: "vetted-specialist",
  "people-filled": "vetted-specialist",
  pie: "honest-repair-vs-replace",
  pistons: "engine",
  pound: "best-used-buy-2", // costs and prices: a price tag (the set's currency icon is a euro)
  question: "faq",
  refresh: "gearbox-problem", // circular arrows: reconditioned
  rocket: "high-demand",
  scale: "scale",
  search: "scope-decision",
  shield: "genuine-failure-data",
  "shield-filled": "genuine-failure-data",
  star: "independent-star",
  "star-circle": "high-demand",
  suspension: "air-suspension-knowledge",
  tag: "best-used-buy-2",
  terrain: "terrain-response",
  "thumbs-up": "best-used-buy",
  "trend-bold": "trend",
  "trend-up": "real-inquiries",
  trophy: "top-choice",
  "user-check": "vetted-specialist",
  wallet: "best-used-buy-2",
  wrench: "vetted-specialist",
  "x-circle": "expensive-failure",
};

// model verdict badges (Find Your Vehicle rows, the model tables), keyed by the badge text
export const BADGE_ICONS = {
  "Safest Buy": "safe-buy",
  "Best Family": "best-family",
  "Most Enquired": "most-enquired",
  "Check Value": "check-watch",
  "Flagship Choice": "flagship-choice",
  "High Demand": "high-demand",
  "Premium Style": "niche-style",
  "Best-Seller": "top-choice",
};

// tone: undefined = theme icon colour, "current" = currentColor (status icons keep red / amber / green)
export default function GuideIcon({ name, className = ICON_MD, tone }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "chevron-up":
      return (
        <svg {...common}>
          <path d="m5 15 7-7 7 7" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...common}>
          <path d="m5 9 7 7 7-7" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path d="m9 5 7 7-7 7" />
        </svg>
      );
    case "arrow-circle":
      return (
        <svg {...common} strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M7.5 12h8.5M12.5 8.5 16 12l-3.5 3.5" />
        </svg>
      );
    // Trustpilot's star (their logo and rating boxes)
    case "star-solid":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 1.8 2.9 7.2 7.6.4-5.9 4.8 2 7.5L12 17.5l-6.6 4.2 2-7.5-5.9-4.8 7.6-.4z" />
        </svg>
      );
    case "signature":
      return (
        <svg className={className} viewBox="0 0 80 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 22c4-1 7-6 9-12 1-4 0-6-2-4-3 3-3 14 0 15 3 1 6-7 8-10 1-2 2 0 1 2-1 3 0 6 2 4 2-3 4-9 6-9 1 0 0 4 1 6 1 1 3-2 4-4 2-4 3-3 3 0 0 3 2 3 4 1 3-3 5-6 7-5 2 1 0 4 2 4 3 0 8-2 13-3" />
          <path d="M14 18c6-1 12-1 18 0" strokeWidth="0.9" />
        </svg>
      );
    // side-profile SUV line drawing (decorative)
    case "suv-outline":
      return (
        <svg className={className} viewBox="0 6 300 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* body silhouette (front at left): upright nose, high flat bonnet, windscreen, roof, tailgate, both arches */}
          <path d="M22 84 16 66q-1-14 5-20l6-4q30-3 70-4l26-22q4-3 10-3l94-1q8 0 14 2l22 10q8 4 13 14l3 20q1 16-2 26h-33a23 23 0 0 0-46 0H93a23 23 0 0 0-46 0z" />
          {/* glasshouse */}
          <path d="M104 37l21-19q3-2 7-2h37v21z" />
          <path d="M174 16l50-1q6 0 10 2l20 10q3 3 0 7l-4 3h-76z" />
          {/* belt line, door shuts, handles, sill */}
          <path d="M98 40l168-2" />
          <path d="M108 40q-4 18 2 38M171.5 37v43M230 38q7 18 1 40" />
          <path d="M138 47h10M196 47h10" />
          <path d="M96 76h100" />
          {/* mirror, headlight, tail light, lower bumper lines */}
          <path d="M105 36l-8-6h-6l2 7z" />
          <path d="M18 52l20-5 2 4-20 5z" />
          <path d="M268 33l10 4 1 6-10-4z" />
          <path d="M22 66l22-2M246 64l30-2" />
          {/* wheels */}
          <circle cx="70" cy="84" r="19" />
          <circle cx="70" cy="84" r="13" />
          <circle cx="70" cy="84" r="3" />
          <path d="M70 71.5v9M81.9 80.1l-8.6 2.8M77.35 94.1l-5.25-7.3M62.65 94.1l5.25-7.3M58.1 80.1l8.6 2.8" />
          <circle cx="221" cy="84" r="19" />
          <circle cx="221" cy="84" r="13" />
          <circle cx="221" cy="84" r="3" />
          <path d="M221 71.5v9M232.9 80.1l-8.6 2.8M228.35 94.1l-5.25-7.3M213.65 94.1l5.25-7.3M209.1 80.1l8.6 2.8" />
          {/* ground line */}
          <path d="M24 104h258" strokeOpacity="0.3" />
        </svg>
      );
    default:
      // display: block like the inline SVGs it replaces, so icons sit centred in their chips and rows
      return <LrIcon name={BRAND[name] ?? name} className={`block ${className}`} tone={tone} />;
  }
}

export function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
