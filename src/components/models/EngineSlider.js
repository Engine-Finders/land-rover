"use client";

import { Children, useRef, useState } from "react";

// Key engines, four in view (as the BMW guide's engine slider): a row with more than four scrolls
// sideways inside its cell - swipe, or the round arrows at the edges, a view at a time. Four or
// fewer render as a plain row. `baseClass` is shared, `rowClass` lays out a plain row and
// `scrollClass` sizes the columns of a scrolling one.
const PER_VIEW = 4;

function Arrow({ dir, hidden, onClick }) {
  const prev = dir < 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Previous engines" : "More engines"}
      tabIndex={hidden ? -1 : 0}
      className={`absolute top-[38%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-lr-line bg-lr-card text-lr-ink shadow-[0_3px_10px_-2px_var(--lr-shadow)] transition-opacity duration-200 hover:border-lr-brand/60 dark:text-lr-green ${prev ? "-left-3" : "-right-3"} ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={prev ? "M14.5 6l-6 6 6 6" : "M9.5 6l6 6-6 6"} />
      </svg>
    </button>
  );
}

export default function EngineSlider({ children, baseClass = "", rowClass = "", scrollClass = "" }) {
  const track = useRef(null);
  const more = Children.count(children) > PER_VIEW;
  const [edge, setEdge] = useState({ start: true, end: false });

  if (!more) return <ul className={`${baseClass} ${rowClass}`}>{children}</ul>;

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    if (start !== edge.start || end !== edge.end) setEdge({ start, end });
  };
  const step = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth, behavior: "smooth" });

  return (
    <div className="relative">
      <ul
        ref={track}
        onScroll={onScroll}
        className={`${baseClass} ${scrollClass} snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>li]:snap-start`}
      >
        {children}
      </ul>
      <Arrow dir={-1} hidden={edge.start} onClick={() => step(-1)} />
      <Arrow dir={1} hidden={edge.end} onClick={() => step(1)} />
    </div>
  );
}
