import Image from "next/image";

// Real Land Rover emblem (client-supplied PNG, background removed),
// replacing the earlier inline-SVG redraw. `className` still controls size
// (e.g. "h-8 w-8") exactly like before, so every call site is unchanged.
//
// Image `fill` needs *some* positioning context on this wrapper - normally
// "relative", but callers that need to position the whole logo themselves
// (e.g. "absolute ... -translate-x-1/2") pass their own position utility, and
// forcing "relative" here too made both classes compete for the CSS
// `position` property, with "relative" silently winning and breaking the
// caller's placement. Only fall back to "relative" when nothing else in the
// passed className already sets a position.
// `crop` trims the square PNG's transparent top/bottom padding so the oval
// fills a ~1.8:1 box (pass a matching width/height in className).
export default function LandRoverLogo({ className = "w-10 h-10", crop = false }) {
  const hasPosition = /\b(absolute|fixed|sticky|relative|static)\b/.test(className);
  return (
    <span className={`inline-block shrink-0 ${hasPosition ? "" : "relative"} ${className}`}>
      <Image src="/landrover_real_logo.webp" alt="Land Rover" fill className={crop ? "object-cover" : "object-contain"} sizes="120px" />
    </span>
  );
}
