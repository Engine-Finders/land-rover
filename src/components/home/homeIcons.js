"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";

/**
 * Semantic key → exact filename under public/Jaguar Black|Silver.
 * Keep filenames identical to silver-black-icons.txt — do not rename assets.
 *
 * Dark/silver appearance uses Jaguar Black + CSS invert. Switching image folders
 * through next/image was unreliable in the browser (stuck on black assets).
 */
export const HOME_ICON_FILES = {
  realEnquiries: "Real Inquiries Icon-01.png",
  vettedSpecialists: "Vetted Specialist Icon-01.png",
  generationRated: "Generation Honest Rated Icon-01.png",
  engineFinders: "Part of Engine finders Icon-01.png",
  genuineFailureData: "Genuine Failure Data Icon-01.png",
  repairVsReplace: "Hones repair vs replace icon-01.png",
  expertVerified: "Expert Verified Icon-01.png",
  independent: "100% independent icon-01.png",
  check: "Check-01.png",
  realData: "Real data icon-01.png",
  safestBuy: "Safe buy icon-01.png",
  bestFamily: "Best Family Icon-01.png",
  mostEnquired: "Most Enquired Icon-01.png",
  checkValue: "Value icon-01.png",
  flagshipChoice: "Flagship choice icon-01.png",
  highDemand: "High demand icon-01.png",
  premiumStyle: "Niche style icon-01.png",
  bestSeller: "Good choice-01.png",
  oemReferences: "Oem references Icon-01.png",
  specificKnowledge: "Specific knowledge icon-01.png",
  scale: "Scale Icon-01.png",
  symptoms: "Symptoms Icon-01.png",
  vehicle: "Vehicle Icon-01.png",
  calculator: "Calculator icon-01.png",
  users: "Users Icon-01.png",
  engine: "Engine icon-01.png",
  drivetrain: "Drivetrain failures icon-01.png",
  electrical: "Electric failures icon-01.png",
  airSuspension: "Air suspension knowledge Icon-01.png",
  ingenium: "Ingenium Icon-01.png",
  chain: "Chain icon-01.png",
  terrainResponse: "Terrain response Icon-01.png",
  gearbox: "Gearbox problem  Icon-01.png",
  knowledgeCentre: "Knowledge centre icon-01.png",
  database: "Database Icon-01.png",
  bestUsedBuy: "Best Used buy icon-01.png",
  bestLongTerm: "Best Long term Icon-01.png",
  topChoice: "Top choice-01.png",
  expensiveFailure: "Expensive failure icon-01.png",
  checkWatch: "Check Watch-01.png",
  note: "Note Icon-01.png",
  faq: "Faq Icon-01.png",
  liveFeed: "Live Feed icon-01.png",
  trend: "Trend icon-01.png",
  getGuidance: "Get Guidance Icon-01.png",
  phone: "Phone Icon-01.png",
  callSpecialist: "Call a specialist Icon-01.png",
  quote: "Quote Icon-01.png",
};

function iconSrc(filename) {
  // Always load Black assets; lighten with CSS when silver tone is needed.
  // encodeURIComponent keeps spaces and "%" filenames working as static files.
  return `/${encodeURIComponent("Jaguar Black")}/${encodeURIComponent(filename)}`;
}

export function HomeIcon({ name, size = 40, className = "", alt = "", tone = "auto" }) {
  const { theme } = useTheme();
  const filename = HOME_ICON_FILES[name];

  if (!filename) return null;

  const wantSilver =
    tone === "silver" || (tone === "auto" && theme === "dark");

  return (
    <Image
      src={iconSrc(filename)}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${wantSilver ? "brightness-0 invert" : ""} ${className}`}
      aria-hidden={alt ? undefined : true}
    />
  );
}
