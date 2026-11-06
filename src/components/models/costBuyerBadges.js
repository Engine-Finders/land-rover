import LrIcon from "@/components/shared/LrIcon";

// The four-up badge card that sits beside the headline in sections 8 (Replacement Costs) and
// 10 (Who Should Buy): icon, short title, one-line caption, divided cells. 2 x 2 on phones,
// one row from sm. `icon` is a brand icon name, or a React node for a custom glyph.

export function BadgeStrip({ items = [], className = "" }) {
  if (!items.length) return null;
  return (
    <ul className={`grid grid-cols-2 overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_18px_44px_-36px_var(--lr-shadow)] sm:grid-cols-4 lg:rounded-2xl ${className}`}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`flex items-center gap-2.5 px-3 py-3.5 text-left sm:flex-col sm:gap-0 sm:px-3 sm:py-5 sm:text-center
            ${i % 2 === 0 ? "border-r border-lr-line" : ""} ${i < 2 ? "border-b border-lr-line sm:border-b-0" : ""} ${i === 1 ? "sm:border-r" : ""}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center text-lr-ink md:h-10 md:w-10 dark:text-lr-green">
            {typeof item.icon === "string" ? <LrIcon name={item.icon} tone="current" className="h-8 w-8 md:h-9 md:w-9" /> : item.icon}
          </span>
          <span className="min-w-0">
            <strong className="block text-[14px] font-semibold leading-snug text-lr-head sm:mt-2.5 md:text-[15px]">{item.title}</strong>
            <span className="mt-0.5 block text-[13px] leading-snug text-lr-muted md:text-[14px]" dangerouslySetInnerHTML={{ __html: item.text }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

// Shield with a pound sign (no £ glyph in the brand icon set), drawn to sit with it
export function PoundShield({ className = "h-8 w-8 md:h-9 md:w-9" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 3.5 6 7.4v7.4c0 6.6 4.3 11.6 10 13.7 5.7-2.1 10-7.1 10-13.7V7.4L16 3.5Z" />
      <path d="M19.6 11.4a3.2 3.2 0 0 0-6 1.5v6.7M11.8 19.6h8.4M11.8 15.6h6" strokeLinecap="round" />
    </svg>
  );
}
