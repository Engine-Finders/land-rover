import { notFound } from "next/navigation";
import pages from "@/data/registery/variants/pages.json";
import VariantHero from "@/components/variant/VariantHero";
import EraMap from "@/components/variant/EraMap";
import ReplacementCosts from "@/components/variant/ReplacementCosts";
import CommonProblems from "@/components/variant/CommonProblems";
import QuotesCta from "@/components/variant/QuotesCta";
import RepairBuyOrReplace from "@/components/variant/RepairBuyOrReplace";
import BuyingChecklist from "@/components/variant/BuyingChecklist";
import EngineCodes from "@/components/variant/EngineCodes";
import MarketIntelligence from "@/components/variant/MarketIntelligence";
import FAQAccordion from "@/components/variant/FAQAccordion";
import TrustCta from "@/components/variant/TrustCta";

async function getPageData(dataFile) {
  try {
    const data = await import(`@/data/variants/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) return {};
  const data = await getPageData(entry.dataFile);
  if (!data?.meta) return {};

  const { meta } = data;

  function stripEmpty(obj) {
    if (!obj) return null;
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== "" && value !== undefined && value !== null) {
        cleaned[key] = value;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : null;
  }

  const og = stripEmpty(meta.openGraph);
  const tw = stripEmpty(meta.twitter);

  return {
    title: meta.title || undefined,
    description: meta.description || undefined,
    alternates: meta.canonical
      ? { canonical: meta.canonical }
      : undefined,
    openGraph: og ? { type: og.type || "website", openGraph: og
      ? {`r`n          ...(og.type && { type: og.type }),
          ...(og.title && { title: og.title }),
          ...(og.description && { description: og.description }),
          ...(og.url && { url: og.url }),
          ...(og.image && { images: [og.image] }),
          ...(og.siteName && { siteName: og.siteName }),
        }
      : undefined,
    twitter: tw
      ? {
          ...(tw.card && { card: tw.card }),
          ...(tw.title && { title: tw.title }),
          ...(tw.description && { description: tw.description }),
          ...(tw.image && { images: [tw.image] }),
        }
      : undefined,
  };
}

export default async function VariantPage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.dataFile);
  if (!data) notFound();

  return (
    <main
      style={{
        padding: "24px 16px 64px",
        maxWidth: 1100,
        margin: "0 auto",
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.meta.jsonLd),
          }}
        />
      )}
      <VariantHero data={data.hero} />
      <EraMap data={data.eraMap} />
      <ReplacementCosts data={data.replacementCosts} />
      <CommonProblems data={data.commonProblems} />
      <QuotesCta data={data.quotesCta} />
      <RepairBuyOrReplace data={data.repairBuyOrReplace} />
      <BuyingChecklist data={data.buyingChecklist} />
      <EngineCodes data={data.engineCodes} />
      <MarketIntelligence data={data.marketIntelligence} />
      <FAQAccordion data={data.faq} />
      <TrustCta data={data.trustCta} />
    </main>
  );
}
