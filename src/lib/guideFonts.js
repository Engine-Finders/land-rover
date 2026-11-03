import { DM_Serif_Display } from "next/font/google";

// Serif display face for the ownership-guide headings (hero, Find Your Vehicle);
// the rest of the site stays on Roboto Condensed / Inter.
export const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
