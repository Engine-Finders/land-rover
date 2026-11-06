// Site-wide container and type scale for the redesigned pages (home, model variants, engines).
// Desktop sizes (xl, 1280px and up) follow the typography brief: H1 60, H2 48 (44 on 1280-1439px), H3 44, H4 34,
// H5 24, H6 20; description text at most 18; highlighted numbers 19-20; badges, icon labels and
// small text 15-17. Smaller screens step down. H1/H2 use the serif at regular weight; H3-H6 the
// sans at medium weight.

// same width and side padding as the navbar and footer, so every section lines up with them
export const CONTAINER = "mx-auto w-full max-w-8xl px-5 sm:px-6 md:px-10 xl:px-12";

const SERIF = "font-[family-name:var(--font-serif-display)] font-normal tracking-[-0.01em]";
const SANS = "font-[family-name:var(--font-instrument-sans)] font-medium";

export const H1 = `${SERIF} text-[34px] leading-[1.1] sm:text-[42px] md:text-[48px] lg:text-[54px] xl:text-[60px]`;
// One H2 size on every page (home, model, generation, variant, engine): 48px from lg, a step down to
// 44px on 1280-1439px laptops (where two-column section heads are narrowest), 48px again from 1440px
export const H2 = `${SERIF} text-[30px] leading-[1.15] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:max-[1439px]:text-[44px]!`;
export const H3 = `${SANS} text-[26px] leading-[1.2] md:text-[32px] lg:text-[38px] xl:text-[44px]`;
export const H4 = `${SANS} text-[22px] leading-[1.25] md:text-[27px] lg:text-[31px] xl:text-[34px]`;
export const H5 = `${SANS} text-[19px] leading-[1.3] md:text-[21px] lg:text-[22px] xl:text-[24px]`;
export const H6 = `${SANS} text-[17px] leading-[1.35] md:text-[18px] xl:text-[20px]`;

// description text: never above 18px
export const BODY = "text-[15px] leading-[1.6] md:text-[16px] xl:text-[18px]";
// secondary copy inside cards, table cells and notes
export const BODY_SM = "text-[14px] leading-[1.6] md:text-[15px] xl:text-[16px]";
// highlighted numbers / short highlighted values inside copy
export const NUM = "font-semibold text-[18px] leading-tight xl:text-[20px]";
// badges, icon labels, captions, eyebrows: 15px on desktop
export const SMALL = "text-[13px] leading-snug md:text-[14px] xl:text-[15px]";
export const LABEL = `${SMALL} font-medium uppercase tracking-[0.06em]`;

// large stat figures (scores, prices) sit on the heading steps so the hierarchy stays intact
export const STAT_LG = "font-semibold leading-none text-[28px] md:text-[30px] lg:text-[32px] xl:text-[34px]";
export const STAT = "font-semibold leading-none text-[21px] md:text-[22px] xl:text-[24px]";

// icon sizes for the brand icon set (src/components/shared/LrIcon.js), matched to the text beside
// them and kept compact so they accent the copy rather than compete with it; inside a round chip the
// icon is about half the chip
export const ICON_XS = "h-3.5 w-3.5 xl:h-4 xl:w-4"; // inline with small text, badges (14-16px)
export const ICON_SM = "h-4 w-4 xl:h-[18px] xl:w-[18px]"; // list rows, table cells (16-18px)
export const ICON_MD = "h-5 w-5 md:h-[22px] md:w-[22px] xl:h-6 xl:w-6"; // card titles, 40-48px chips (20-24px)
export const ICON_LG = "h-6 w-6 md:h-[26px] md:w-[26px] xl:h-7 xl:w-7"; // feature and trust tiles, 52-60px chips (24-28px)
export const ICON_XL = "h-7 w-7 md:h-8 md:w-8 xl:h-9 xl:w-9"; // hero stats and highlight icons (28-36px)
