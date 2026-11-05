import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import { carRatio } from "@/lib/carGeometry";
import { BODY_SM, LABEL, NUM } from "@/lib/typeScale";

export { GroundedCar };

// Shared photographic vehicle scene for the variant sections: the variant's car cutout standing on
// the Highland loch-side hillside used by the heroes - golden hour on the day theme, a storm at
// night (CSS backgrounds by theme and screen, so only the one in view downloads) - composited so it
// reads as one photograph rather than a cutout on a backdrop:
//  - the car is toned to the light and planted per tyre (see GroundedCar),
//  - one grade, vignette and film grain sit over photo and car together (lighter by day).
// Fills its (relative, sized) parent. `ground` is the tyre line in % from the bottom.

export const LOCH_BG =
  "bg-cover bg-[url(/home/hero-loch-day-m.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] md:bg-[url(/home/hero-loch-day.webp)] md:dark:bg-[url(/home/hero-loch-night.webp)]";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function PhotoScene({ car, ground = 11, carClass = "left-1/2 w-[76%] -translate-x-1/2", position = "18% 62%", sizes = "100vw", priority = false, children }) {
  const carBox = `absolute ${carClass}`;
  const carPos = car ? { bottom: `${ground}%`, aspectRatio: carRatio(car) } : null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${LOCH_BG}`} style={{ backgroundPosition: position }} />

      {car && (
        <div className={carBox} style={carPos}>
          <GroundedCar src={car} sizes={sizes} priority={priority} sceneByTheme />
        </div>
      )}

      {/* one grade over everything: cool sky, darker foreground, vignette, grain */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 55%, transparent 55%, rgba(0,0,0,0.5) 100%), linear-gradient(to bottom, rgba(12,16,22,0.3), transparent 35%, transparent 72%, rgba(8,7,5,0.5))",
        }}
      />
      {/* day: a soft vignette only, so the golden light stays clean */}
      <div className="absolute inset-0 dark:hidden" style={{ background: "radial-gradient(ellipse 95% 85% at 50% 55%, transparent 60%, rgba(40,28,8,0.22) 100%)" }} />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay dark:opacity-[0.12]" style={{ backgroundImage: GRAIN }} />
      {children}
    </div>
  );
}

// Hero-style loch background for a section band (place inside a full-width `relative` wrapper): the
// landscape spans the whole width, feathers out at the top and bottom, and is washed in the section's
// colour behind the copy (`copy` = which side the text is on), so the car stands in the open on the
// other side - like the heroes, no card or patch. Shown from `from` (md / lg) up; below that use
// LochBanner.
const BAND_FROM = { md: "hidden md:block", lg: "hidden lg:block" };
const washFor = (copy, tone, solid, half, clear) => {
  const c = `var(--lr-${tone})`;
  const edge = "max(0px, 50vw - 704px)";
  return `linear-gradient(${copy === "left" ? "90deg" : "270deg"}, ${c} 0px, color-mix(in srgb, ${c} 92%, transparent) calc(${edge} + ${solid}px), color-mix(in srgb, ${c} 55%, transparent) calc(${edge} + ${half}px), transparent calc(${edge} + ${clear}px))`;
};
export function LochBand({ copy = "left", tone = "page", from = "lg", solid = 520, half = 740, clear = 980, position = "center 66%" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${BAND_FROM[from]}`} aria-hidden="true">
      <div
        className={`absolute inset-0 bg-cover bg-[url(/home/hero-loch-day.webp)] dark:bg-[url(/home/hero-loch-night.webp)] [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)]`}
        style={{ backgroundPosition: position }}
      />
      <div className="absolute inset-0" style={{ background: washFor(copy, tone, solid, half, clear) }} />
    </div>
  );
}

// Phones / tablets: the same landscape as a full-bleed banner (breaks out of the container's side
// padding), feathered at the top and bottom, with the car standing on its foreground.
export function LochBanner({ car, className = "", sizes = "(min-width: 640px) 560px, 78vw" }) {
  return (
    <div className={`relative -mx-4 aspect-[4/3] bg-cover bg-bottom bg-[url(/home/hero-loch-day-m.webp)] dark:bg-[url(/home/hero-loch-night-m.webp)] sm:aspect-[16/9] md:-mx-8 [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_86%,transparent)] ${className}`} aria-hidden="true">
      <div className="absolute bottom-[14%] left-1/2 w-[78%] max-w-[560px] -translate-x-1/2 sm:bottom-[12%] sm:w-[60%]">
        <GroundedCar src={car} sizes={sizes} sceneByTheme />
      </div>
    </div>
  );
}

// Studio product plate for the engine: a warm spotlight, the engine on the plate's floor with a soft
// reflection, and its code. Keeps the engine out of the landscape, where it would look pasted in.
// Follows the site theme: a light studio panel by day, a dark one at night.
export function EnginePlate({ engine, code, desc, vertical = false, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-lr-line bg-lr-panel ${className}`}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 75% at 50% 30%, rgba(201,169,110,0.18), transparent 70%), linear-gradient(to bottom, transparent 60%, var(--lr-shadow))" }} aria-hidden="true" />
      <div className={`relative flex ${vertical ? "h-full flex-col items-center justify-center gap-4 p-5 text-center" : "items-center gap-4 p-3.5 md:gap-5 md:p-4"}`}>
        <div className={`relative shrink-0 ${vertical ? "w-[82%] max-w-[230px]" : "w-[34%] max-w-[150px]"}`} aria-hidden="true">
          <Image src={engine} alt="" width={500} height={500} sizes={vertical ? "230px" : "150px"} className="relative h-auto w-full drop-shadow-[0_14px_14px_rgba(24,40,31,0.3)] dark:drop-shadow-[0_14px_14px_rgba(0,0,0,0.65)]" />
          <div className="absolute inset-x-[12%] bottom-[2%] h-[7%] rounded-[50%] bg-black/30 blur-[6px] dark:bg-black/80" />
        </div>
        <div className="min-w-0">
          <p className={`${LABEL} text-lr-gold`}>Engine fitted</p>
          {code && <p className={`${NUM} mt-1 text-lr-head`}>{code}</p>}
          {desc && <p className={`${BODY_SM} mt-0.5 text-lr-muted`}>{desc}</p>}
        </div>
      </div>
    </div>
  );
}
