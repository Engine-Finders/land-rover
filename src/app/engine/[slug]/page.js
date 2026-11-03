import { notFound } from "next/navigation";
import pages from "@/data/registery/engines/pages.json";
import EngineHero from "@/components/engine/EngineHero";
import AtAGlance from "@/components/engine/AtAGlance";
import VerdictRating from "@/components/engine/VerdictRating";
import Compatibility from "@/components/engine/Compatibility";
import CostGuide from "@/components/engine/CostGuide";
import FAQAccordion from "@/components/engine/FAQAccordion";
import TrustCta from "@/components/engine/TrustCta";

async function getPageData(dataFile) {
  try {
    const data = await import(`@/data/engines/${dataFile}.json`);
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
  return {
    title: meta.title,
    description: meta.description,
    alternates: meta.canonical
      ? { canonical: meta.canonical }
      : undefined,
    openGraph: meta.openGraph
      ? {
          title: meta.openGraph.title,
          description: meta.openGraph.description,
          type: meta.openGraph.type,
          url: meta.openGraph.url,
          images: meta.openGraph.image ? [meta.openGraph.image] : undefined,
          siteName: meta.openGraph.siteName,
        }
      : undefined,
    twitter: meta.twitter
      ? {
          card: meta.twitter.card,
          title: meta.twitter.title,
          description: meta.twitter.description,
          images: meta.twitter.image ? [meta.twitter.image] : undefined,
        }
      : undefined,
  };
}

export default async function EnginePage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.dataFile);
  if (!data) notFound();

  // "Land Rover 200Tdi / 300Tdi Engine - Specs, ..." -> "Land Rover 200Tdi / 300Tdi"
  const engineName = (data.hero?.h1 || "").split(" Engine - ")[0];
  const yearsProduced = data.atAGlance?.rows?.find((r) => r.metric === "Years Produced")?.value || "";

  return (
    <main className="flex flex-col">
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.meta.jsonLd),
          }}
        />
      )}
      <EngineHero data={data.hero} slug={slug} />
      <AtAGlance data={data.atAGlance} title={data.hero?.h1} slug={slug} />
      <VerdictRating data={data.verdictRating} />
      <Compatibility data={data.compatibility} engineName={engineName} years={yearsProduced} slug={slug} />
      <CostGuide data={data.costGuide} engineName={engineName} />
      <FAQAccordion data={data.faq} engineName={engineName} slug={slug} />
      <TrustCta data={data.trustCta} />
    </main>
  );
}
