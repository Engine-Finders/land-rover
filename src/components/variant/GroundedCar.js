"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { carRatio, carWheels } from "@/lib/carGeometry";

const CAR_TONE = "brightness-[.76] contrast-[1.08] saturate-[.8] sepia-[.12]";
const DARK_TONE = "dark:brightness-[.76] dark:contrast-[1.08] dark:saturate-[.8] dark:sepia-[.12]";
// golden-hour landscape by day (warm, near true colour), dusk grading at night
const SCENE_TONE = `brightness-[.97] contrast-[1.04] saturate-[.96] sepia-[.08] ${DARK_TONE}`;

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
// studioByDay: on the white day theme the car stands on the page like a studio shot (true colours,
// a soft light shadow, no grass); at night it keeps the dusk-scene grading, shadows and grass.
// sceneByTheme: the car stands in a landscape in both themes - golden-hour light and softer, warmer
// shadows by day, the dusk grading at night.
export default function GroundedCar({ src, sizes, priority = false, studioByDay = false, sceneByTheme = false, studio = false }) {
  // studio: on a studio floor in both themes - true colours, soft cast shadow, a contact shadow per tyre
  const tone = studio ? "dark:brightness-[.92]" : sceneByTheme ? SCENE_TONE : studioByDay ? DARK_TONE : CAR_TONE;
  const shadowFill = studio ? "fill-[rgba(20,22,20,0.42)] dark:fill-[rgba(0,0,0,0.7)]" : sceneByTheme ? "fill-[rgba(28,22,6,0.62)] dark:fill-[rgba(0,0,0,0.78)]" : studioByDay ? "fill-[rgba(15,30,22,0.22)] dark:fill-[rgba(0,0,0,0.78)]" : "fill-[rgba(0,0,0,0.78)]";
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
        <polygon points={footprint(wheels)} className={shadowFill} />
      </svg>
      <Image src={src} alt="" fill sizes={sizes} priority={priority} ref={img} className={`object-fill ${tone}`} />
      <div className={`absolute inset-0 ${fade} ${studio ? "hidden" : studioByDay ? "hidden dark:block" : sceneByTheme ? "opacity-60 dark:opacity-100" : ""}`} style={{ ...carMask(src), background: AO }} />
      <div className={`absolute inset-0 ${fade} ${studio ? "hidden" : studioByDay ? "hidden dark:block" : ""}`}>
      {wheels.map(([x, y, w], i) => (
        <Fragment key={i}>
          {/* grass in front of the tyre, in the car's shade, then the contact shadow pressed into it */}
          <div className={`absolute ${sceneByTheme ? "brightness-[.85] sepia-[.25] dark:brightness-[.55] dark:sepia-0" : "brightness-[.55]"}`} style={{ ...TUFT, left: `${x}%`, top: `${y}%`, width: `${w * 2.6}%`, height: "7%", transform: "translate(-50%, -62%)" }} />
          <div className="absolute rounded-[50%] bg-black/90 mix-blend-multiply blur-[5px]" style={{ left: `${x}%`, top: `${y}%`, width: `${w * 2}%`, height: "4%", transform: "translate(-50%, -55%)" }} />
        </Fragment>
      ))}
      </div>
      {(studioByDay || studio) && (
        <div className={`absolute inset-0 ${studio ? "" : "dark:hidden"} ${fade}`}>
          {wheels.map(([x, y, w], i) => (
            <div key={i} className="absolute rounded-[50%] bg-black/45 blur-[4px]" style={{ left: `${x}%`, top: `${y}%`, width: `${w * 2}%`, height: "3%", transform: "translate(-50%, -55%)" }} />
          ))}
        </div>
      )}
    </div>
  );
}

