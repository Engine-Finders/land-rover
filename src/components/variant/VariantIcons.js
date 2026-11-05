// The variant sections' CTA arrow (a UI glyph, not part of the brand icon set). Every pictogram on
// the variant pages comes from the brand icon set: src/components/shared/LrIcon.js. Sized and
// coloured by the caller.
export default function ArrowIcon({ className = "h-5 w-5", strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}
