import { useId } from "react";

// Range Rover badge for the model group headers, drawn to sit beside the Land Rover oval: the same
// 1.74:1 oval, brushed-silver rim and deep green field, with the spaced RANGE / ROVER wordmark in
// silver. Vector, so it stays sharp at any size and screen density. `className` sets the size
// exactly like LandRoverLogo's (e.g. "h-8.5 w-15.5").
export default function RangeRoverBadge({ className = "h-9 w-16" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 478 275" className={`shrink-0 ${className}`} role="img" aria-label="Range Rover">
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef1f0" />
          <stop offset="0.45" stopColor="#b9bfbc" />
          <stop offset="0.55" stopColor="#d6dbd9" />
          <stop offset="1" stopColor="#8f9693" />
        </linearGradient>
        <radialGradient id={`${id}-field`} cx="0.5" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#21704a" />
          <stop offset="0.6" stopColor="#175836" />
          <stop offset="1" stopColor="#0e3d25" />
        </radialGradient>
        <linearGradient id={`${id}-type`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d3d9d6" />
        </linearGradient>
      </defs>
      {/* rim, inner bevel line, field */}
      <ellipse cx="239" cy="137.5" rx="236" ry="134.5" fill={`url(#${id}-rim)`} />
      <ellipse cx="239" cy="137.5" rx="221" ry="120" fill="#0b2f1c" />
      <ellipse cx="239" cy="137.5" rx="217" ry="116" fill={`url(#${id}-field)`} />
      <ellipse cx="239" cy="137.5" rx="200" ry="101" fill="none" stroke="#d6dbd9" strokeOpacity="0.55" strokeWidth="2.5" />
      {/* wordmark */}
      <g fill={`url(#${id}-type)`} fontFamily="var(--font-instrument-sans), Arial, sans-serif" fontWeight="600" textAnchor="middle">
        <text x="239" y="128" fontSize="56" letterSpacing="15">RANGE</text>
        <text x="239" y="192" fontSize="56" letterSpacing="15">ROVER</text>
      </g>
      <rect x="168" y="141" width="142" height="2.5" rx="1.25" fill="#d6dbd9" fillOpacity="0.7" />
    </svg>
  );
}
