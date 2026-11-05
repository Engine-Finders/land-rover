import { ICON_MD } from "@/lib/typeScale";

// Brand icon set (IBS icons). public/icons/<name>.webp are alpha masks of the delivered artwork; the
// colour comes from the theme: IBS green by day, the Land Rover skin (sand) set at night, and sand on
// brand-green tiles (.bg-lr-brand / .lr-on-brand) in both themes. Same shapes as both delivered
// sets, one download per icon.
// tone: undefined = theme colour, "current" = currentColor (status icons: red / amber / green),
// "skin" = sand in both themes, "green" = IBS green in both themes.
// Names and what each one shows: src/components/shared/lrIconNames.js.

export default function LrIcon({ name, className = ICON_MD, tone, title }) {
  return (
    <span
      className={`lr-icon ${tone ? `lr-icon-${tone}` : ""} ${className}`}
      style={{ "--lr-icon-src": `url(/icons/${name}.webp)` }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
