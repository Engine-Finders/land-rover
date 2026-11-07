import { notFound } from "next/navigation";
import modelPages from "@/data/registery/models/pages.json";
import genPages from "@/data/registery/generations/pages.json";
import variantPages from "@/data/registery/variants/pages.json";

import ModelHero from "@/components/models/ModelHero";
import OwnershipVerdict from "@/components/models/OwnershipVerdict";
import AtAGlance from "@/components/models/AtAGlance";
import GenerationsGrid from "@/components/models/GenerationsGrid";
import EngineDatabase from "@/components/models/EngineDatabase";
import CommonProblems from "@/components/models/CommonProblems";
import MarketIntelligence from "@/components/models/MarketIntelligence";
import ReplacementCosts from "@/components/models/ReplacementCosts";
import EngineEvolution from "@/components/models/EngineEvolution";
import WhoShouldBuy from "@/components/models/WhoShouldBuy";
import CalculatorCTA from "@/components/models/CalculatorCTA";
import TrustBlock from "@/components/models/TrustBlock";
import FAQAccordion from "@/components/models/FAQAccordion";
import ClosingActionCards from "@/components/models/ClosingActionCards";

import GenHero from "@/components/generation/ModelHero";
import GenEngineDatabase from "@/components/generation/EngineDatabase";
import Overview from "@/components/generation/Overview";
import BestWorstEngines from "@/components/generation/BestWorstEngines";
import OwnershipEconomics from "@/components/generation/OwnershipEconomics";
import GenProblems from "@/components/generation/CommonProblems";
import GenReplacementCosts from "@/components/generation/ReplacementCosts";
import CoreVariants from "@/components/generation/CoreVariants";
import GenMarketIntelligence from "@/components/generation/MarketIntelligence";
import GenFAQAccordion from "@/components/generation/FAQAccordion";
import GenTrustCta from "@/components/generation/TrustCta";
import { genName } from "@/components/generation/genKit";

import VariantHero from "@/components/variant/VariantHero";
import EraMap from "@/components/variant/EraMap";
import VarReplacementCosts from "@/components/variant/ReplacementCosts";
import VarProblems from "@/components/variant/CommonProblems";
import QuotesCta from "@/components/variant/QuotesCta";
import RepairBuyOrReplace from "@/components/variant/RepairBuyOrReplace";
import ChecklistAndCodes from "@/components/variant/ChecklistAndCodes";
import VarMarketIntelligence from "@/components/variant/MarketIntelligence";
import VarFAQAccordion from "@/components/variant/FAQAccordion";
import VarTrustCta from "@/components/variant/TrustCta";
import { variantCar, variantEngine } from "@/lib/variantDesign";

async function getModelData(dataFile) {
  try {
    const data = await import(`@/data/models/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

async function getGenData(dataFile) {
  try {
    const data = await import(`@/data/generations/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

async function getVariantData(dataFile) {
  try {
    const data = await import(`@/data/variants/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

function findEntry(slugSegments) {
  if (slugSegments.length === 1) {
    const single = slugSegments[0];
    const model = modelPages.find((p) => p.slug === single);
    if (model) return { entry: model, type: "models" };
    notFound();
  }

  if (slugSegments.length === 2) {
    const [parent, child] = slugSegments;
    const gen = genPages.find((p) => p.parent === parent && p.slug === child);
    if (gen) return { entry: gen, type: "generations" };

    const variant = variantPages.find((p) => p.parent === parent && p.slug === child);
    if (variant) return { entry: variant, type: "variants" };

    notFound();
  }

  notFound();
}

export async function generateStaticParams() {
  const paths = [];

  for (const page of modelPages) {
    if (!page?.slug) continue;
    paths.push({ slug: [page.slug] });
  }

  for (const page of genPages) {
    if (!page?.parent || !page?.slug) continue;
    paths.push({ slug: [page.parent, page.slug] });
  }

  for (const page of variantPages) {
    if (!page?.parent || !page?.slug) continue;
    paths.push({ slug: [page.parent, page.slug] });
  }

  return paths;
}

export async function generateMetadata({ params }) {
  const { slug: slugSegments } = await params;
  const result = findEntry(slugSegments);
  if (!result) return {};

  const { entry, type } = result;

  let data;
  if (type === "models") data = await getModelData(entry.dataFile);
  else if (type === "generations") data = await getGenData(entry.dataFile);
  else if (type === "variants") data = await getVariantData(entry.dataFile);

  if (!data?.meta) return {};

  const { meta } = data;
  const og = meta.openGraph;
  const hasOg = og && (og.title || og.description || og.url || og.image || og.siteName || og.type);
  const canonical = meta.canonical || `https://landroverengine.uk/${slugSegments.join("/")}`;

  return {
    title: meta.title || undefined,
    description: meta.description || undefined,
    alternates: { canonical },
    openGraph: hasOg
      ? {
          title: og.title || undefined,
          description: og.description || undefined,
          type: og.type || "website",
          url: og.url || undefined,
          images: og.image ? [og.image] : undefined,
          siteName: og.siteName || undefined,
        }
      : undefined,
    twitter: meta.twitter?.title || meta.twitter?.description
      ? {
          card: meta.twitter.card || undefined,
          title: meta.twitter.title || undefined,
          description: meta.twitter.description || undefined,
          images: meta.twitter.image ? [meta.twitter.image] : undefined,
        }
      : undefined,
  };
}

export default async function CatchAllPage({ params }) {
  const { slug: slugSegments } = await params;
  const result = findEntry(slugSegments);

  const { entry, type } = result;

  let data;
  if (type === "models") data = await getModelData(entry.dataFile);
  else if (type === "generations") data = await getGenData(entry.dataFile);
  else if (type === "variants") data = await getVariantData(entry.dataFile);

  if (!data) notFound();

  if (type === "models") {
    return (
      <main className="lr-sections flex w-full flex-col">
        {data.meta?.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data.meta.jsonLd) }}
          />
        )}
        <ModelHero data={data.hero} slug={entry.slug} />
        <OwnershipVerdict data={data.ownershipVerdict} slug={entry.slug} hero={data.hero} />
        <AtAGlance data={data.atAGlance} slug={entry.slug} />
        {/* sections 4-14 get the model slug (art, names) and the whole page (cross-section figures) */}
        <GenerationsGrid data={data.generations} slug={entry.slug} page={data} />
        <EngineDatabase data={data.engineDatabase} slug={entry.slug} page={data} />
        <CommonProblems data={data.commonProblems} slug={entry.slug} page={data} />
        <MarketIntelligence data={data.marketIntelligence} quoteData={data.editorialPullQuote} slug={entry.slug} page={data} />
        <ReplacementCosts data={data.replacementCosts} slug={entry.slug} page={data} />
        <EngineEvolution data={data.engineEvolution} slug={entry.slug} page={data} />
        <WhoShouldBuy data={data.whoShouldBuy} slug={entry.slug} page={data} />
        <CalculatorCTA data={data.calculatorCta} slug={entry.slug} page={data} />
        <TrustBlock data={data.trustBlock} slug={entry.slug} page={data} />
        <FAQAccordion data={data.faq} slug={entry.slug} page={data} />
        <ClosingActionCards data={data.closingActionCards} slug={entry.slug} page={data} />
      </main>
    );
  }

  if (type === "generations") {
    return (
      <main className="lr-sections flex flex-col">
        {data.meta?.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data.meta.jsonLd) }}
          />
        )}
        <GenHero data={data.hero} model={entry.parent || entry.slug} />
        <GenEngineDatabase data={data.engineDatabase} hero={data.hero} model={entry.parent || entry.slug} />
        <Overview data={data.overview} hero={data.hero} model={entry.parent || entry.slug} />
        <BestWorstEngines data={data.bestWorstEngines} />
        <OwnershipEconomics data={data.ownershipEconomics} hero={data.hero} model={entry.parent || entry.slug} />
        <GenProblems data={data.commonProblems} page={data} />
        <GenReplacementCosts data={data.replacementCosts} page={data} model={entry.parent || entry.slug} />
        <CoreVariants data={data.coreVariants} page={data} model={entry.parent || entry.slug} />
        <GenMarketIntelligence data={data.marketIntelligence} page={data} model={entry.parent || entry.slug} />
        <GenFAQAccordion data={data.faq} name={genName(data)} />
        <GenTrustCta data={data.trustCta} page={data} model={entry.parent || entry.slug} />
      </main>
    );
  }

  if (type === "variants") {
    const car = variantCar(entry.dataFile);
    const engine = variantEngine(entry.dataFile);
    return (
      <main className="lr-redesign lr-sections flex flex-col">
        {data.meta?.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data.meta.jsonLd) }}
          />
        )}
        <VariantHero data={data.hero} car={car} parent={entry.parent} />
        <EraMap data={data.eraMap} band="soft" car={car} />
        <VarReplacementCosts data={data.replacementCosts} ticker={data.hero?.ticker} />
        <VarProblems data={data.commonProblems} engineTitle={data.replacementCosts?.h2} />
        <QuotesCta data={data.quotesCta} car={car} />
        <RepairBuyOrReplace data={data.repairBuyOrReplace} car={car} engine={engine} />
        <ChecklistAndCodes checklist={data.buyingChecklist} codes={data.engineCodes} car={car} engine={engine} variantName={(data.hero?.tagPill || "").split(" • ")[0]} />
        <VarMarketIntelligence data={data.marketIntelligence} variantName={(data.hero?.tagPill || "").split(" • ")[0]} />
        <VarFAQAccordion data={data.faq} />
        <VarTrustCta data={data.trustCta} car={car} engine={engine} />
      </main>
    );
  }

  notFound();
}
