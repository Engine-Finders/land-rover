// Shared design tokens for the engine page sections, so every section uses the same palette,
// type and page width. Light sections sit on CREAM with INK headings and GOLD accents; dark
// sections sit on DARK with white type, MINT accents (GOLD_ON_DARK for the At a Glance band).

export const INK = "#123d2a";
export const GOLD = "#b9995c";
export const GOLD_ON_DARK = "#c9a35d";
export const MINT = "#7bc47e";
export const DARK = "#060b0d";
export const CREAM = "#fbf9f5";

export const SERIF = { fontFamily: "var(--font-serif-display), Georgia, 'Times New Roman', serif" };
export const SERIF_BOLD = { ...SERIF, fontWeight: 700 };
export const SANS = { fontFamily: "var(--font-instrument-sans), Arial, sans-serif" };

// page width for every engine section: 48px gutters on large screens, as in the reference designs
export const CONTAINER = "mx-auto w-full max-w-[1680px] px-4 sm:px-6 md:px-8 xl:px-10 2xl:px-12";

// card surfaces
export const LIGHT_CARD = "rounded-xl border border-[#e8e4da] bg-white shadow-[0_14px_30px_-24px_rgba(31,42,34,0.4)]";
export const DARK_CARD = "rounded-xl border border-[#262e2a] bg-[linear-gradient(180deg,#111816_0%,#0b110f_100%)]";
