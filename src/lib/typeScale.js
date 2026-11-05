// Site-wide container and type scale for the redesigned pages (home, model variants, engines).
// Desktop sizes (xl, 1280px and up) follow the typography brief: H1 60, H2 54, H3 44, H4 34,
// H5 24, H6 20; description text at most 18; highlighted numbers 19-20; badges, icon labels and
// small text 15-17. Smaller screens step down. H1/H2 use the serif at regular weight; H3-H6 the
// sans at medium weight.

// same width and side padding as the navbar and footer, so every section lines up with them
export const CONTAINER = "mx-auto w-full max-w-8xl px-4 md:px-8";

const SERIF = "font-[family-name:var(--font-serif-display)] font-normal tracking-[-0.01em]";
const SANS = "font-[family-name:var(--font-instrument-sans)] font-medium";

export const H1 = `${SERIF} text-[34px] leading-[1.1] sm:text-[42px] md:text-[48px] lg:text-[54px] xl:text-[60px]`;
export const H2 = `${SERIF} text-[30px] leading-[1.15] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[54px]`;
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
// them; inside a round chip the icon is about 55% of the chip
export const ICON_XS = "h-4 w-4 xl:h-[18px] xl:w-[18px]"; // inline with small text, badges (15px)
export const ICON_SM = "h-5 w-5 xl:h-[22px] xl:w-[22px]"; // list rows, table cells (16px text)
export const ICON_MD = "h-6 w-6 md:h-7 md:w-7 xl:h-8 xl:w-8"; // card titles (H6 20px), 48-56px chips
export const ICON_LG = "h-8 w-8 md:h-9 md:w-9 xl:h-10 xl:w-10"; // feature and trust tiles, 60-72px chips
export const ICON_XL = "h-10 w-10 md:h-12 md:w-12 xl:h-14 xl:w-14"; // hero and highlight icons
