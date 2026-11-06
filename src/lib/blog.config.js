// src/lib/blog.config.js
/**
 * Site-specific configuration for Headless CMS Blog & Lead Quote integration.
 * Tailored for Land Rover Engine.
 */

export const blogConfig = {
  // 1. Site Identity
  siteName: "Land Rover Engine",
  siteSlug: process.env.CMS_SITE_SLUG || "landroverengine",
  siteDomain: "landroverengine.co.uk",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://landroverengine.co.uk").replace(/\/$/, ""),
  defaultAuthor: "Land Rover Technical Specialist",

  // 2. Headings & UI Copy
  copy: {
    metaTitle: "Land Rover Engine | Guides & Diagnostic Advice",
    metaDescription: "Expert failure diagnosis, engine replacement costs, Ingenium oil dilution advice, and technical specifications for all Land Rover & Range Rover models.",
    blogTitlePrefix: "Land Rover Engine",
    blogTitleAccent: "Knowledge & Guides",
    blogSubtitle: "Expert failure diagnosis, engine replacement costs, Ingenium oil dilution advice, and technical specifications for all Land Rover & Range Rover models.",
    emptyTitle: "No guides published yet",
    emptySubtitle: "Land Rover Engine technical articles and diagnostic guides published from the CMS will appear here.",
    readMoreText: "Read Guide",
    widgetTitle: "Instant Land Rover Engine Quote",
    widgetSubtitle: "Enter your registration or request a callback from our Land Rover engine specialists.",
    widgetSubmitText: "Request Free Quote",
    widgetSuccessTitle: "Quote Request Received!",
    widgetSuccessSubtitle: "Our Land Rover Engine specialists will check stock and contact you shortly with the best pricing.",
    recentGuidesTitle: "Recent Guides",
    relatedGuidesTitle: "Related Guides",
    bottomCta: {
      enabled: true,
      badge: "Land Rover Engine Network",
      title: "Need a Replacement Land Rover Engine?",
      subtitle: "Get an instant quote for reconditioned or tested low-mileage Land Rover and Range Rover engines with full warranty coverage.",
      buttonText: "Get Free Land Rover Engine Quote »",
      buttonHref: "#sidebar-reg-input",
    },
  },

  // 3. Theme Colors
  theme: {
    fontFamily: "var(--font-instrument-sans), system-ui, sans-serif",
    primaryColor: "var(--lr-green)",
    primaryHover: "var(--lr-brand-hover)",
    accentColor: "var(--lr-green)",
    accentHover: "var(--lr-brand-hover)",
    widgetBg: "#0d281f",
    widgetBorder: "#133e30",
    widgetButtonBg: "#175f46",
    widgetButtonHover: "#114734",
    ukBadgeBg: "#003399",
    fallbackThumbnail: "/home/knowledge-defender.webp", // a Land Rover in the site's own art (the template shipped a stock photo)
  },
};
