import Image from "next/image";
import GroundedCar from "@/components/variant/GroundedCar";
import { carRatio } from "@/lib/carGeometry";

export { GroundedCar };

// Shared photographic vehicle scene for the dark variant sections: the variant's car cutout
// standing on the dusk highland photo (CC0 Poly Haven "Champagne Castle", graded), composited so
// it reads as one photograph rather than a cutout on a backdrop:
//  - the car is toned to the dusk light and planted per tyre (see GroundedCar),
//  - one grade, vignette and film grain sit over photo and car together.
// Fills its (relative, sized) parent. `ground` is the tyre line in % from the bottom.

const PHOTO = "/variant/hero-landscape-v3.webp";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function PhotoScene({ car, ground = 11, carClass = "left-1/2 w-[76%] -translate-x-1/2", position = "18% 62%", sizes = "100vw", priority = false, children }) {
  const photo = { objectPosition: position };
  const carBox = `absolute ${carClass}`;
  const carPos = car ? { bottom: `${ground}%`, aspectRatio: carRatio(car) } : null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image src={PHOTO} alt="" fill sizes={sizes} priority={priority} className="object-cover" style={photo} />

      {car && (
        <div className={carBox} style={carPos}>
          <GroundedCar src={car} sizes={sizes} priority={priority} />
        </div>
      )}

      {/* one grade over everything: cool sky, darker foreground, vignette, grain */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 55%, transparent 55%, rgba(0,0,0,0.5) 100%), linear-gradient(to bottom, rgba(12,16,22,0.3), transparent 35%, transparent 72%, rgba(8,7,5,0.5))",
        }}
      />
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      {children}
    </div>
  );
}

// Studio product plate for the engine: a warm spotlight, the engine on a dark floor with a soft
// reflection, and its code. Keeps the engine out of the landscape, where it would look pasted in.
export function EnginePlate({ engine, code, desc, vertical = false, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0e110d] ${className}`}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 75% at 50% 30%, rgba(201,169,110,0.18), transparent 70%), linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.35))" }} aria-hidden="true" />
      <div className={`relative flex ${vertical ? "h-full flex-col items-center justify-center gap-4 p-5 text-center" : "items-center gap-4 p-3.5 md:gap-5 md:p-4"}`}>
        <div className={`relative shrink-0 ${vertical ? "w-[82%] max-w-[230px]" : "w-[34%] max-w-[150px]"}`} aria-hidden="true">
          <Image src={engine} alt="" width={500} height={500} sizes={vertical ? "230px" : "150px"} className="relative h-auto w-full drop-shadow-[0_14px_14px_rgba(0,0,0,0.65)]" />
          <div className="absolute inset-x-[12%] bottom-[2%] h-[7%] rounded-[50%] bg-black/80 blur-[6px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c9a96e] md:text-[12px]">Engine fitted</p>
          {code && <p className="mt-1 text-[19px] font-semibold leading-tight text-white md:text-[21px]">{code}</p>}
          {desc && <p className="mt-0.5 text-[14px] leading-snug text-white/65 md:text-[15px]">{desc}</p>}
        </div>
      </div>
    </div>
  );
}
