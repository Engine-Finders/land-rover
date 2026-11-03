// Outline icons for the variant cost/problem sections. Sized and coloured by the caller.
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", "aria-hidden": true };

const PATHS = {
  tag: <><path d="M3 12.6V4.5A1.5 1.5 0 0 1 4.5 3h8.1a1.5 1.5 0 0 1 1.06.44l6.9 6.9a1.5 1.5 0 0 1 0 2.12l-8.1 8.1a1.5 1.5 0 0 1-2.12 0l-6.9-6.9A1.5 1.5 0 0 1 3 12.6z" /><circle cx="8" cy="8" r="1.5" /></>,
  cog: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  piston: <><path d="M8 3h8v5a4 4 0 0 1-8 0z" /><path d="M8 5.5h8" /><path d="M12 12v4" /><path d="M9 21h6l-1-5h-4z" /></>,
  star: <path fill="currentColor" stroke="none" d="M12 2.8l2.75 5.58 6.16.9-4.46 4.34 1.05 6.13L12 16.86l-5.5 2.89 1.05-6.13L3.09 9.28l6.16-.9z" />,
  shield: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  car: <><path d="M5 16h14v-3.5l-1.6-4.3A1.8 1.8 0 0 0 15.7 7H8.3a1.8 1.8 0 0 0-1.7 1.2L5 12.5z" /><path d="M5 16v2h2.5v-2M16.5 16v2H19v-2" /><path d="M5 12.5h14" /><circle cx="8.3" cy="14.2" r=".6" /><circle cx="15.7" cy="14.2" r=".6" /></>,
  scale: <><path d="M12 3v18M7 21h10M5 7h14" /><path d="M5 7l-2.5 6a2.5 2.5 0 0 0 5 0z" /><path d="M19 7l-2.5 6a2.5 2.5 0 0 0 5 0z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" /></>,
  gauge: <><path d="M4.5 17a8.5 8.5 0 1 1 15 0" /><path d="M12 13l3.5-4" /><circle cx="12" cy="13" r="1" /></>,
  receipt: <><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  engine: <><path d="M4 10h2V8h3V6h6v2h2l2 2h1v6h-1l-2 2H6v-2H4z" /><path d="M9 6V4h6v2" /></>,
  alert: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M12 8v4M12 15h.01" /></>,
  thumb: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="m9 13 2 2 4-4" /></>,
  // problem icons
  belt: <><path d="M10 13a4.5 4.5 0 0 0 6.36 0l3-3a4.5 4.5 0 0 0-6.36-6.36l-1.3 1.3" /><path d="M14 11a4.5 4.5 0 0 0-6.36 0l-3 3a4.5 4.5 0 0 0 6.36 6.36l1.3-1.3" /></>,
  chain: <><rect x="3" y="9" width="8" height="6" rx="3" /><rect x="13" y="9" width="8" height="6" rx="3" /><path d="M9 12h6" /></>,
  gasket: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><circle cx="8" cy="12" r="2.3" /><circle cx="16" cy="12" r="2.3" /><path d="M5.5 8.5h.01M18.5 8.5h.01M5.5 15.5h.01M18.5 15.5h.01" /></>,
  pump: <><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" /><path d="M3 21h14M8 7h4v4H8z" /><path d="M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3" /></>,
  turbo: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2" /><path d="M12 10c0-3 1.5-5 4-5.5M14 12c3 0 5 1.5 5.5 4M12 14c0 3-1.5 5-4 5.5M10 12c-3 0-5-1.5-5.5-4" /></>,
  bearing: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="5.5" r="1" /><circle cx="18.5" cy="12" r="1" /><circle cx="12" cy="18.5" r="1" /><circle cx="5.5" cy="12" r="1" /></>,
  coolant: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></>,
  oil: <><path d="M3 14h9l5-4h3v3l-5 4H3z" /><path d="M7 14v-3h3v3" /><path d="M20 17.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6z" /></>,
  filter: <><path d="M4 4h16l-6 8v6l-4 2v-8z" /></>,
  spark: <><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></>,
  bolt: <><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 10v4" /><path d="m11 9-2 3h4l-2 3" /></>,
  fuel: <><path d="M5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16" /><path d="M3 21h13M7 7h5v4H7z" /><path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V9l-3-3" /></>,
  thermo: <><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" /><path d="M12 9v7" /><circle cx="12" cy="17.5" r="1" /></>,
  smoke: <path d="M7 18.5h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7 11a3.75 3.75 0 0 0 0 7.5z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
  doc: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  cart: <><path d="M3 4h2.5l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.45-1.1L20.5 8H6.3" /><circle cx="9.5" cy="19.5" r="1.3" /><circle cx="17" cy="19.5" r="1.3" /></>,
  ear: <><path d="M6 9a6 6 0 0 1 12 0c0 3-2 4-3 5.5-.8 1.2-.8 2.5-1.5 3.8A3 3 0 0 1 8 17" /><path d="M9 9.5a3 3 0 0 1 6 0c0 1.6-1.6 2-1.6 3.5" /><path d="M19.5 9.5c.7.8.7 2.2 0 3M21.5 8c1.3 1.6 1.3 4.4 0 6" /></>,
  tank: <><path d="M5 10h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /><path d="M9 10V8a3 3 0 0 1 6 0v2" /><path d="M12 5V3h3" /><path d="M5 15c2-1.5 4 1.5 7 0s5 1.5 7 0" /></>,
  oilcan: <><path d="M3 11h3l2-2h5l5 3 3-1-4 6H8l-2-3H3z" /><path d="M10 9V7h3" /><path d="M21 15.5s1 1.2 1 1.9a1 1 0 0 1-2 0c0-.7 1-1.9 1-1.9z" /></>,
  docsearch: <><path d="M13 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v4" /><path d="M14 3v5h5M8 12h5M8 16h3" /><circle cx="17" cy="17" r="2.6" /><path d="m19 19 2 2" /></>,
  cylinders: <><rect x="4" y="5" width="4" height="12" rx="1" /><rect x="10" y="5" width="4" height="12" rx="1" /><rect x="16" y="5" width="4" height="12" rx="1" /><path d="M3 5h18M6 17v3M12 17v3M18 17v3" /></>,
  users: <><circle cx="8.5" cy="8" r="3.2" /><circle cx="16.5" cy="8" r="3.2" /><path d="M2.5 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" /><path d="M14.3 14.2c.7-.1 1.4-.2 2.2-.2 3 0 5.4 1.8 6 5" /></>,
  truck: <><path d="M2.5 6.5h11v9.5h-11z" /><path d="M13.5 9.5h4l3.5 3.6V16h-7.5" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  pound: <><path d="M16.5 7.5A3.5 3.5 0 0 0 10 9.2V14c0 2-1 3.5-3 4.5h11" /><path d="M7.5 12.5h6.5" /></>,
};

export default function VIcon({ name, className = "h-5 w-5", ...rest }) {
  return (
    <svg {...base} className={className} {...rest}>
      {PATHS[name] || PATHS.info}
    </svg>
  );
}
