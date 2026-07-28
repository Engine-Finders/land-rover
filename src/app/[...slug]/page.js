import { notFound } from "next/navigation";
import modelPages from "@/data/registery/models/pages.json";
import generationPages from "@/data/registery/generations/pages.json";
import variantPages from "@/data/registery/variants/pages.json";

// --- Model components ---
import ModelHero from "@/components/models/ModelHero";
import OwnershipVerdict from "@/components/models/OwnershipVerdict";
import AtAGlance from "@/components/models/AtAGlance";
import GenerationsGrid from "@/components/models/GenerationsGrid";
import EngineDatabase from "@/components/models/EngineDatabase";
import CommonProblems from "@/components/models/CommonProblems";
import MarketIntelligence from "@/components/models/MarketIntelligence";
import EditorialPullQuote from "@/components/models/EditorialPullQuote";
import ReplacementCosts from "@/components/models/ReplacementCosts";
import EngineEvolution from "@/components/models/EngineEvolution";
import WhoShouldBuy from "@/components/models/WhoShouldBuy";
import CalculatorCTA from "@/components/models/CalculatorCTA";
import TrustBlock from "@/components/models/TrustBlock";
import FAQAccordion from "@/components/models/FAQAccordion";
import ClosingActionCards from "@/components/models/ClosingActionCards";

// --- Generation components ---
import GenModelHero from "@/components/generation/ModelHero";
import GenEngineDatabase from "@/components/generation/EngineDatabase";
import Overview from "@/components/generation/Overview";
import BestWorstEngines from "@/components/generation/BestWorstEngines";
import OwnershipEconomics from "@/components/generation/OwnershipEconomics";
import GenCommonProblems from "@/components/generation/CommonProblems";
import GenReplacementCosts from "@/components/generation/ReplacementCosts";
import CoreVariants from "@/components/generation/CoreVariants";
import GenMarketIntelligence from "@/components/generation/MarketIntelligence";
import GenFAQAccordion from "@/components/generation/FAQAccordion";
import TrustCta from "@/components/generation/TrustCta";

// --- Variant components ---
import VariantHero from "@/components/variant/VariantHero";
import EraMap from "@/components/variant/EraMap";
import VarReplacementCosts from "@/components/variant/ReplacementCosts";
import VarCommonProblems from "@/components/variant/CommonProblems";
import QuotesCta from "@/components/variant/QuotesCta";
import RepairBuyOrReplace from "@/components/variant/RepairBuyOrReplace";
import BuyingChecklist from "@/components/variant/BuyingChecklist";
import EngineCodes from "@/components/variant/EngineCodes";
import VarMarketIntelligence from "@/components/variant/MarketIntelligence";
import VarFAQAccordion from "@/components/variant/FAQAccordion";
import VarTrustCta from "@/components/variant/TrustCta";

// --- Registry lookup helpers ---
function lookupEntry(slugArr) {
  const path = slugArr.join("/");

  if (slugArr.length === 1) {
    const slug = slugArr[0];
    const standaloneGen = generationPages.find(
      (p) => !p.parent && p.slug === slug
    );
    if (standaloneGen) return { entry: standaloneGen, type: "generations" };
    const model = modelPages.find((p) => p.slug === slug);
    if (model) return { entry: model, type: "models" };
  }

  if (slugArr.length === 2) {
    const [parent, slug] = slugArr;
    const gen = generationPages.find(
      (p) => p.parent === parent && p.slug === slug
    );
    if (gen) return { entry: gen, type: "generations" };
    const variant = variantPages.find(
      (p) => p.parent === parent && p.slug === slug
    );
    if (variant) return { entry: variant, type: "variants" };
  }

  return null;
}

// --- Data loader ---
async function getPageData(type, dataFile) {
  try {
    const data = await import(`@/data/${type}/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

// --- generateStaticParams ---
export async function generateStaticParams() {
  const paths = [];

  for (const p of modelPages) {
    paths.push({ slug: [p.slug] });
  }

  for (const p of generationPages) {
    if (p.parent) {
      paths.push({ slug: [p.parent, p.slug] });
    } else {
      paths.push({ slug: [p.slug] });
    }
  }

  for (const p of variantPages) {
    paths.push({ slug: [p.parent, p.slug] });
  }

  return paths;
}

// --- generateMetadata ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resolved = lookupEntry(slug);
  if (!resolved) return {};

  const data = await getPageData(resolved.type, resolved.entry.dataFile);
  if (!data?.meta) return {};

  const { meta } = data;
  return {
    title: meta.title,
    description: meta.description,
    alternates: meta.canonical ? { canonical: meta.canonical } : undefined,
    openGraph: meta.openGraph?.title
      ? {
          title: meta.openGraph.title,
          description: meta.openGraph.description,
          type: meta.openGraph.type || "website",
          url: meta.openGraph.url,
          images: meta.openGraph.image ? [meta.openGraph.image] : undefined,
          siteName: meta.openGraph.siteName,
        }
      : undefined,
    twitter: meta.twitter?.title
      ? {
          card: meta.twitter.card,
          title: meta.twitter.title,
          description: meta.twitter.description,
        }
      : undefined,
  };
}

// --- Page ---
export default async function CatchAllPage({ params }) {
  const { slug } = await params;
  const resolved = lookupEntry(slug);
  if (!resolved) notFound();

  const data = await getPageData(resolved.type, resolved.entry.dataFile);
  if (!data) notFound();

  return (
    <main
      style={{
        padding: "24px 16px 64px",
        maxWidth: resolved.type === "models" ? 900 : 1100,
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

      {resolved.type === "models" && (
        <>
          <ModelHero data={data.hero} />
          <OwnershipVerdict data={data.ownershipVerdict} />
          <AtAGlance data={data.atAGlance} />
          <GenerationsGrid data={data.generations} />
          <EngineDatabase data={data.engineDatabase} />
          <CommonProblems data={data.commonProblems} />
          <MarketIntelligence data={data.marketIntelligence} />
          <EditorialPullQuote data={data.editorialPullQuote} />
          <ReplacementCosts data={data.replacementCosts} />
          <EngineEvolution data={data.engineEvolution} />
          <WhoShouldBuy data={data.whoShouldBuy} />
          <CalculatorCTA data={data.calculatorCta} />
          <TrustBlock data={data.trustBlock} />
          <FAQAccordion data={data.faq} />
          <ClosingActionCards data={data.closingActionCards} />
        </>
      )}

      {resolved.type === "generations" && (
        <>
          <GenModelHero data={data.hero} />
          <GenEngineDatabase data={data.engineDatabase} />
          <Overview data={data.overview} />
          <BestWorstEngines data={data.bestWorstEngines} />
          <OwnershipEconomics data={data.ownershipEconomics} />
          <GenCommonProblems data={data.commonProblems} />
          <GenReplacementCosts data={data.replacementCosts} />
          <CoreVariants data={data.coreVariants} />
          <GenMarketIntelligence data={data.marketIntelligence} />
          <GenFAQAccordion data={data.faq} />
          <TrustCta data={data.trustCta} />
        </>
      )}

      {resolved.type === "variants" && (
        <>
          <VariantHero data={data.hero} />
          <EraMap data={data.eraMap} />
          <VarReplacementCosts data={data.replacementCosts} />
          <VarCommonProblems data={data.commonProblems} />
          <QuotesCta data={data.quotesCta} />
          <RepairBuyOrReplace data={data.repairBuyOrReplace} />
          <BuyingChecklist data={data.buyingChecklist} />
          <EngineCodes data={data.engineCodes} />
          <VarMarketIntelligence data={data.marketIntelligence} />
          <VarFAQAccordion data={data.faq} />
          <VarTrustCta data={data.trustCta} />
        </>
      )}
    </main>
  );
}
