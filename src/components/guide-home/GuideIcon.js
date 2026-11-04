// Line icons for the ownership-guide sections (hero stats, trust tiles, model badges).
// All drawn on a 24px grid and coloured via currentColor.
export default function GuideIcon({ name, className = "h-6 w-6" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "chart":
      return (
        <svg {...common}>
          <rect x="4" y="13" width="3.5" height="7" rx="0.6" />
          <rect x="10.25" y="9" width="3.5" height="11" rx="0.6" />
          <rect x="16.5" y="4" width="3.5" height="16" rx="0.6" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0 5.2 5.2l.6-.6a4.5 4.5 0 0 1-5.6 1.4L7.3 19.9a2 2 0 0 1-2.8-2.8l7.6-7.6a4.5 4.5 0 0 1 1.4-5.6l-.6.6a4 4 0 0 0 1.8 1.8z" />
          <circle cx="5.9" cy="18.5" r="0.4" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M3 5.5c3-1 6-1 9 1 3-2 6-2 9-1V19c-3-1-6-1-9 1-3-2-6-2-9-1z" />
          <path d="M12 6.5V20M5.5 9h3.5M5.5 12h3.5M15 9h3.5M15 12h3.5M15 15h3.5" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
          <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5" />
          <path d="M12 14v3M8.5 20h7M9.5 20l.5-3h4l.5 3" />
          <path d="m12 6.2.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2z" strokeWidth="1" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 5 5.5v6c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5v-6z" />
          <path d="m8.8 12 2.2 2.2 4.3-4.4" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
        </svg>
      );
    // filled group of three people
    case "family":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="6.2" r="2.6" />
          <circle cx="5.2" cy="8" r="2.1" />
          <circle cx="18.8" cy="8" r="2.1" />
          <path d="M7.8 19.5v-4.2a4.2 4.2 0 0 1 8.4 0v4.2z" />
          <path d="M1.8 19.5v-3a3.4 3.4 0 0 1 5.2-2.9 5.6 5.6 0 0 0-.6 2.5v3.4zM22.2 19.5v-3a3.4 3.4 0 0 0-5.2-2.9c.4.8.6 1.6.6 2.5v3.4z" />
        </svg>
      );
    // filled flame with an inner cut-out
    case "flame":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12.5 2c.4 3-1.2 4.6-2.8 6.3C8 10 6 12 6 15a6 6 0 0 0 12 0c0-2.4-1.1-4.1-2.3-5.3.1 1.4-.4 2.6-1.4 3.2.4-3.8-.6-8.2-1.8-10.9zM12 20.5a3 3 0 0 1-3-3c0-1.8 1.4-2.8 2.4-4.3.5 1.5 1.7 2 2.6 2.9.6.5 1 1.3 1 2.2a3 3 0 0 1-3 2.2z"
          />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="M10.3 4.2 2.6 17.6A2 2 0 0 0 4.3 20.6h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
          <path d="M12 9.5v4.5" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common}>
          <path d="M3.5 8 7.5 12 12 5.5 16.5 12l4-4-1.8 9.5H5.3z" />
          <path d="M5.3 20h13.4" />
          <circle cx="3.5" cy="7.5" r="0.9" />
          <circle cx="12" cy="4.8" r="0.9" />
          <circle cx="20.5" cy="7.5" r="0.9" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M14.5 4.5c2.5-1.3 4.6-1.3 5.5-1 .3.9.3 3-1 5.5l-5.6 5.6-4-4z" />
          <path d="M9.4 10.6 6 10.2 3.5 12.7l3.9.9M13.4 14.6l.4 3.4-2.5 2.5-.9-3.9" />
          <circle cx="16" cy="8" r="1.4" />
          <path d="M6.2 15.8c-1.4.4-2.2 2-2.4 4.4 2.4-.2 4-1 4.4-2.4" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...common}>
          <path d="M6.5 4h11l4 5-9.5 11L2.5 9z" />
          <path d="M2.5 9h19M9.5 4 8 9l4 11 4-11-1.5-5" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="12" cy="7.5" r="2.8" />
          <circle cx="5.5" cy="9.5" r="2.1" />
          <circle cx="18.5" cy="9.5" r="2.1" />
          <path d="M7.3 19.5v-1.8a4.7 4.7 0 0 1 9.4 0v1.8z" />
          <path d="M2 19v-1a3.5 3.5 0 0 1 5.1-3.1M22 19v-1a3.5 3.5 0 0 0-5.1-3.1" />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M6 3h8.5L19 7.5V21H6z" />
          <path d="M14 3v5h5M9 12.5h7M9 16h7" />
        </svg>
      );
    case "garage":
      return (
        <svg {...common}>
          <path d="M2.5 9.5 12 4l9.5 5.5" />
          <path d="M4.5 9v11.5h15V9" />
          <path d="M7.5 20.5v-8h9v8M7.5 15h9M7.5 17.75h9" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <path d="M9 4.5H6.5v16.5h11V4.5H15" />
          <rect x="9" y="3" width="6" height="3" rx="1" />
          <path d="m8.8 10.6 1.1 1.1 2-2M13.5 10.8h2.2M8.8 15.6l1.1 1.1 2-2M13.5 15.8h2.2" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M3.5 13.5 5.3 8a2 2 0 0 1 1.9-1.4h9.6A2 2 0 0 1 18.7 8l1.8 5.5" />
          <path d="M3 13.5h18v4.5H3z" />
          <path d="M5 18v2h2.5v-2M16.5 18v2H19v-2" />
          <circle cx="6.8" cy="15.7" r="0.9" fill="currentColor" />
          <circle cx="17.2" cy="15.7" r="0.9" fill="currentColor" />
          <path d="M9.5 15.7h5" />
        </svg>
      );
    case "search":
      return (
        <svg {...common} strokeWidth={1.8}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
      );
    // hexagon nut with centre ring - "specialist knowledge"
    case "gear":
      return (
        <svg {...common}>
          <path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4z" />
          <circle cx="12" cy="12" r="3.6" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common}>
          <path d="M12 3.5v16M7.5 20.5h9M5 6.5h14M12 5a1 1 0 1 0 0-.1" />
          <path d="M5 6.5 2.5 13a2.6 2.6 0 0 0 5 0zM19 6.5 16.5 13a2.6 2.6 0 0 0 5 0zM2.5 13h5M16.5 13h5" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common} strokeWidth={1.8}>
          <path d="M19.5 9A7.5 7.5 0 0 0 5.8 7.2M4.5 15a7.5 7.5 0 0 0 13.7 1.8" />
          <path d="M5.5 3.5v4h4M18.5 20.5v-4h-4" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M3.5 12.5V4.5h8l9 9-8 8z" />
          <circle cx="8" cy="9" r="1.4" />
          <path d="M10.5 14.5l3-3M12.5 16.5l3-3" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M4.5 21V3.5h10V21M14.5 9h5v12M3 21h18" />
          <path d="M7.5 7h1.5M10.5 7H12M7.5 10.5h1.5M10.5 10.5H12M7.5 14h1.5M10.5 14H12M8.5 21v-3.5h2V21" />
        </svg>
      );
    case "engine":
      return (
        <svg {...common}>
          <path d="M7 8h7l2 2h2.5v2.5H21v-2h1v6h-1v-2h-2.5V17h-3l-2 2H8l-2-2H4.5v-2.5H2.5V18h-1v-7h1v2h2V10H7z" />
          <path d="M9 8V5.5h5V8M7.5 5.5h8" />
          <circle cx="12" cy="13.5" r="2.4" />
        </svg>
      );
    case "suspension":
      return (
        <svg {...common}>
          <path d="M9.5 3.5h5M12 3.5v2.5" />
          <path d="m8.5 6 7 1.8-7 1.8 7 1.8-7 1.8 7 1.8-7 1.8" />
          <path d="M12 16.8v3.7M9.5 20.5h5" />
        </svg>
      );
    case "drivetrain":
      return (
        <svg {...common}>
          <circle cx="4.5" cy="6" r="2" />
          <circle cx="19.5" cy="6" r="2" />
          <circle cx="4.5" cy="18" r="2" />
          <circle cx="19.5" cy="18" r="2" />
          <path d="M6.5 6h11M6.5 18h11M12 6v12" />
          <rect x="10" y="10.5" width="4" height="3" rx="0.6" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6z" />
        </svg>
      );
    case "pound":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M14.8 8.6a2.6 2.6 0 0 0-4.9 1.2c0 1.6.6 2.6.6 4.2 0 1.1-.6 2-1.5 2.5h6.3M8.8 12.5h4.4" />
        </svg>
      );
    case "chevron-up":
      return (
        <svg {...common} strokeWidth={1.8}>
          <path d="m5 15 7-7 7 7" />
        </svg>
      );
    case "engine-detail":
      return (
        <svg {...common}>
          <path d="M6.5 9.5h10l2.5 2.5v5l-2.5 3H8l-2.5-3V12z" />
          <path d="M9 9.5V7h6v2.5M8 7h8M10 4.5h4V7h-4zM19 14h2.5M3 14h2.5" />
          <circle cx="12.3" cy="14.6" r="2.6" />
          <path d="m17.5 6 3-2M19 8l2.5-.5" />
        </svg>
      );
    case "chain":
      return (
        <svg {...common}>
          <path d="M10 14a4 4 0 0 0 5.7 0l3.5-3.5a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
          <path d="M14 10a4 4 0 0 0-5.7 0l-3.5 3.5a4 4 0 0 0 5.7 5.7l1.2-1.2" />
        </svg>
      );
    case "air-suspension":
      return (
        <svg {...common}>
          <path d="M12 2.5v4M10.2 4.7 12 2.5l1.8 2.2M12 21.5v-3M10.2 19.3 12 21.5l1.8-2.2" />
          <path d="M5 13.5 6.6 9.6A1.6 1.6 0 0 1 8.1 8.5h7.8a1.6 1.6 0 0 1 1.5 1.1l1.6 3.9" />
          <path d="M4.5 13.5h15v3.5h-15zM6 17v1.5h2.2V17M15.8 17v1.5H18V17" />
          <circle cx="7.4" cy="15.2" r="0.7" fill="currentColor" />
          <circle cx="16.6" cy="15.2" r="0.7" fill="currentColor" />
        </svg>
      );
    case "terrain":
      return (
        <svg {...common}>
          <path d="M2 21 22 12" />
          <path d="m4.5 15.5 1-3.3a1.4 1.4 0 0 1 1.1-1l6.2-1.6a1.4 1.4 0 0 1 1.4.4l2.2 2.4 1 2.2" />
          <path d="m4 16 13.7-3.6" />
          <circle cx="7.5" cy="17.4" r="1.4" />
          <circle cx="15" cy="15.4" r="1.4" />
          <path d="m15 8 2.5-4.5 1.8 2.6 1-1.4 1.7 3.3" />
        </svg>
      );
    case "cog":
      return (
        <svg {...common}>
          <path d="M10.3 3h3.4l.5 2.3 1.6.9 2.2-.8 1.7 2.9-1.8 1.6v1.9l1.8 1.6-1.7 2.9-2.2-.8-1.6.9-.5 2.3h-3.4l-.5-2.3-1.6-.9-2.2.8-1.7-2.9 1.8-1.6v-1.9L4.3 8.3 6 5.4l2.2.8 1.6-.9z" />
          <circle cx="12" cy="12" r="3.3" />
        </svg>
      );
    case "axle":
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="3.5" height="14" rx="1" />
          <rect x="18" y="5" width="3.5" height="14" rx="1" />
          <path d="M6 12h3.5M14.5 12H18" />
          <circle cx="12" cy="12" r="2.6" />
          <path d="M3.5 8.5h1.5M3.5 15.5h1.5M19 8.5h1.5M19 15.5h1.5" />
        </svg>
      );
    case "pistons":
      return (
        <svg {...common}>
          <path d="m4 4 3.5 3.5M5 9.5l4.5-4.5 2 2-4.5 4.5zM9 9l7 7" />
          <path d="m20 4-3.5 3.5M19 9.5 14.5 5l-2 2 4.5 4.5zM15 9l-7 7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    case "gauge":
      return (
        <svg {...common}>
          <path d="M4.2 17.5a9 9 0 1 1 15.6 0" />
          <path d="m12 13 4-4.5" />
          <circle cx="12" cy="13.5" r="1.3" />
          <path d="M6.5 13.5h1.2M16.3 13.5h1.2M12 6.5v1.2M8 8.8l.8.8" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...common}>
          <path d="m2.5 19.5 6.5-11 3.5 5.5 2.5-3.5 6.5 9z" />
          <path d="m7 11 2 1.5 1.5-1.5" />
        </svg>
      );
    case "pie":
      return (
        <svg {...common}>
          <path d="M11 4a8 8 0 1 0 9 9h-9z" />
          <path d="M14 2.5a8 8 0 0 1 7.5 7.5H14z" />
        </svg>
      );
    case "chart-search":
      return (
        <svg {...common}>
          <path d="M20 11V5.5A1.5 1.5 0 0 0 18.5 4h-13A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H11" />
          <path d="m7 15 3-3.5 2.5 2 3-4" />
          <circle cx="16.5" cy="16.5" r="3" />
          <path d="m18.7 18.7 2.3 2.3" />
        </svg>
      );
    case "broadcast":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="1.6" />
          <path d="M8.6 15.4a4.8 4.8 0 0 1 0-6.8M15.4 8.6a4.8 4.8 0 0 1 0 6.8M5.8 18.2a8.8 8.8 0 0 1 0-12.4M18.2 5.8a8.8 8.8 0 0 1 0 12.4" />
        </svg>
      );
    case "trend":
      return (
        <svg {...common}>
          <path d="M3 20h18" />
          <path d="m4 16 5-5 4 3 7-7" />
          <path d="M15 7h5v5" />
        </svg>
      );
    case "trend-bold":
      return (
        <svg {...common} strokeWidth={2.2}>
          <path d="m3.5 16.5 6-6 4 4 7-7" />
          <path d="M15 7.5h5.5V13" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common}>
          <path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5H5.5A2.5 2.5 0 0 1 3 5" />
          <path d="M11.3 11.5a2 2 0 1 0 0 4M16.8 11.5a2 2 0 1 0 0 4" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
          <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 9.8c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8M4.5 14.2c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
        </svg>
      );
    case "x-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );
    case "trend-up":
      return (
        <svg {...common} strokeWidth={1.7}>
          <path d="m3.5 17 6-6 4 4 7-7.5" />
          <path d="M15.5 7.5h5v5" />
        </svg>
      );
    case "invoice":
      return (
        <svg {...common}>
          <path d="M6 2.8h8.5L19 7.3V21.2H6z" />
          <path d="M14 2.8v5h5M9 7h3M9 9.8h6" />
          <path d="M14.2 13.4a1.9 1.9 0 0 0-3.5 1c0 1.2.5 1.9.5 3.1 0 .8-.5 1.4-1.2 1.8h4.8M9.6 16.4h3.4" />
        </svg>
      );
    case "headset":
      return (
        <svg {...common}>
          <circle cx="12" cy="9.5" r="4" />
          <path d="M6 10a6 6 0 0 1 12 0v2.5" />
          <rect x="4.5" y="9.5" width="2.5" height="4" rx="1" />
          <rect x="17" y="9.5" width="2.5" height="4" rx="1" />
          <path d="M18.2 13.5c0 1.8-1.6 3-3.7 3H12.5" />
          <path d="M4.5 21v-.6A4.4 4.4 0 0 1 8.9 16h6.2a4.4 4.4 0 0 1 4.4 4.4v.6z" />
        </svg>
      );
    case "phone":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 2.5c.6 0 1.1.4 1.3 1l1 3.4c.2.6 0 1.2-.5 1.6L6.6 9.9a14 14 0 0 0 7.5 7.5l1.4-1.8c.4-.5 1-.7 1.6-.5l3.4 1c.6.2 1 .7 1 1.3v3c0 .9-.8 1.7-1.7 1.6C10.4 21.6 2.4 13.6 1.9 4.2 1.8 3.3 2.6 2.5 3.5 2.5z" />
        </svg>
      );
    case "star-solid":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 1.8 2.9 7.2 7.6.4-5.9 4.8 2 7.5L12 17.5l-6.6 4.2 2-7.5-5.9-4.8 7.6-.4z" />
        </svg>
      );
    case "quote":
      return (
        <svg className={className} viewBox="0 0 32 24" fill="currentColor" aria-hidden="true">
          <path d="M3 24V14C3 6.5 6.6 1.7 13 0l1.4 2.7C10.6 4.2 8.8 7 8.6 11H14v13zm17 0V14c0-7.5 3.6-12.3 10-14l1.4 2.7c-3.8 1.5-5.6 4.3-5.8 8.3H31v13z" />
        </svg>
      );
    case "lock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10h.5A2 2 0 0 1 19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zm2 0h5V7.5a2.5 2.5 0 0 0-5 0zm2.5 3.5a1.6 1.6 0 0 0-.8 3v1.8h1.6v-1.8a1.6 1.6 0 0 0-.8-3z" />
        </svg>
      );
    case "shield-filled":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2.5 4.5 5.3v6.1c0 4.7 3.2 8.4 7.5 10.1 4.3-1.7 7.5-5.4 7.5-10.1V5.3z" />
          <path d="m8.6 12 2.4 2.4 4.5-4.6" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "people-filled":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="8.5" cy="8" r="3.2" />
          <circle cx="16" cy="8.5" r="2.7" />
          <path d="M2.5 19v-1.2A4.8 4.8 0 0 1 7.3 13h2.4a4.8 4.8 0 0 1 4.8 4.8V19zM15.5 19v-1.2c0-1.6-.6-3.1-1.6-4.2.5-.2 1.1-.3 1.7-.3h.9a4 4 0 0 1 4 4V19z" />
        </svg>
      );
    case "user-check":
      return (
        <svg {...common}>
          <circle cx="10" cy="8" r="3.8" />
          <path d="M3 20.5v-1a5.5 5.5 0 0 1 5.5-5.5h3" />
          <circle cx="17" cy="17" r="4" fill="currentColor" stroke="none" />
          <path d="m15.2 17 1.3 1.3 2.4-2.5" stroke="#fff" strokeWidth="1.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <path d="M7.5 13h.01M12 13h.01M16.5 13h.01M7.5 16.5h.01M12 16.5h.01M16.5 16.5h.01" strokeWidth="2.2" />
        </svg>
      );
    case "question":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.6" />
          <path d="M12 16.9h.01" strokeWidth="2.2" />
        </svg>
      );
    case "signature":
      return (
        <svg className={className} viewBox="0 0 80 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 22c4-1 7-6 9-12 1-4 0-6-2-4-3 3-3 14 0 15 3 1 6-7 8-10 1-2 2 0 1 2-1 3 0 6 2 4 2-3 4-9 6-9 1 0 0 4 1 6 1 1 3-2 4-4 2-4 3-3 3 0 0 3 2 3 4 1 3-3 5-6 7-5 2 1 0 4 2 4 3 0 8-2 13-3" />
          <path d="M14 18c6-1 12-1 18 0" strokeWidth="0.9" />
        </svg>
      );
    case "star-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m12 6.8 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
        </svg>
      );
    case "thumbs-up":
      return (
        <svg {...common}>
          <path d="M7 10.5v9.5H3.5v-9.5z" />
          <path d="M7 10.5 11 3.5c1.3 0 2.3 1 2.1 2.4l-.6 3.6h5.4a2 2 0 0 1 2 2.4l-1.3 6.4a2 2 0 0 1-2 1.7H7" />
        </svg>
      );
    case "check-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.2 12.2 2.6 2.6 5-5.3" />
        </svg>
      );
    case "arrow-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M7.5 12h8.5M12.5 8.5 16 12l-3.5 3.5" />
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
    case "chevron-down":
      return (
        <svg {...common} strokeWidth={1.8}>
          <path d="m5 9 7 7 7-7" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common} strokeWidth={1.8}>
          <path d="m9 5 7 7-7 7" />
        </svg>
      );
    default:
      return null;
  }
}

export function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
