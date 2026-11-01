"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { carRatio, carWheels } from "@/lib/carGeometry";

const CAR_TONE = "brightness-[.76] contrast-[1.08] saturate-[.8] sepia-[.12]";

const carMask = (src) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" });
// light from the sky on the roof, ambient occlusion darkening toward the ground - clipped to the car
const AO = "linear-gradient(to bottom, rgba(150,170,200,0.10) 0%, transparent 35%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.6) 100%)";
// feathered tuft of real grass (cut from the same dusk photo), laid over a tyre's contact patch
const TUFT = {
  backgroundImage: "url(/variant/grass-strip.webp)",
  backgroundSize: "auto 100%",
  backgroundRepeat: "repeat-x",
  backgroundPosition: "center bottom",
  maskImage: "linear-gradient(to right, transparent, #000 30%, #000 70%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, #000 30%, #000 70%, transparent)",
};
// The car's footprint on the ground: the three visible tyre contacts (front-left, near front,
// near rear - every cutout is a front-left three-quarter view) plus the hidden far-rear wheel that
// completes the parallelogram, pushed out a little so the shadow reaches past the tyres.
function footprint([fl, nf, rr]) {
  const pts = [fl, nf, rr, [fl[0] + rr[0] - nf[0], fl[1] + rr[1] - nf[1]]];
  const cx = pts.reduce((t, p) => t + p[0], 0) / 4;
  const cy = pts.reduce((t, p) => t + p[1], 0) / 4;
  return pts.map(([x, y]) => `${(cx + (x - cx) * 1.1).toFixed(1)},${(cy + (y - cy) * 1.3).toFixed(1)}`).join(" ");
}

// A car cutout planted on the ground. Every tyre's contact point is measured per image
// (carMeta.json), so each wheel - including the rear one, which sits higher in the photo - gets
// its own contact shadow and grass tuft, and the whole car casts a shadow across its footprint.
// Ambient occlusion clipped to the car's own outline darkens the body toward the ground.
// The shading, shadows and grass wait for the car image and fade in with it, so a slow
// connection never shows a dark car-shaped shadow on its own.
export default function GroundedCar({ src, sizes, priority = false }) {
  const wheels = carWheels(src);
  const [ready, setReady] = useState(false);
  const img = useRef(null);
  // listen for the image's own load event (next/image's onLoad waits for decode(), and an image
  // that loaded before hydration never reports at all)
  useEffect(() => {
    const el = img.current;
    if (!el) return;
    if (el.complete && el.naturalWidth) return setReady(true);
    const done = () => setReady(true);
    el.addEventListener("load", done);
    return () => el.removeEventListener("load", done);
  }, []);
  const fade = `transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`;
  return (
    <div className="relative w-full" style={{ aspectRatio: carRatio(src) }}>
      <svg className={`absolute inset-0 h-full w-full overflow-visible blur-[9px] ${fade}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points={footprint(wheels)} fill="rgba(0,0,0,0.78)" />
      </svg>
      <Image src={src} alt="" fill sizes={sizes} priority={priority} ref={img} className={`object-fill ${CAR_TONE}`} />
      <div className={`absolute inset-0 ${fade}`} style={{ ...carMask(src), background: AO }} />
      <div className={`absolute inset-0 ${fade}`}>
      {wheels.map(([x, y, w], i) => (
        <Fragment key={i}>
          {/* grass in front of the tyre, in the car's shade, then the contact shadow pressed into it */}
          <div className="absolute brightness-[.55]" style={{ ...TUFT, left: `${x}%`, top: `${y}%`, width: `${w * 2.6}%`, height: "7%", transform: "translate(-50%, -62%)" }} />
          <div className="absolute rounded-[50%] bg-black/90 mix-blend-multiply blur-[5px]" style={{ left: `${x}%`, top: `${y}%`, width: `${w * 2}%`, height: "4%", transform: "translate(-50%, -55%)" }} />
        </Fragment>
      ))}
      </div>
    </div>
  );
}

