import HomeSec1 from "@/components/guide-home/HomeSec1";
import HomeFindVehicle from "@/components/guide-home/HomeFindVehicle";
import HomeDiagnose from "@/components/guide-home/HomeDiagnose";
import HomeRankings from "@/components/guide-home/HomeRankings";
import HomeFailures from "@/components/guide-home/HomeFailures";
import HomeKnowledge from "@/components/guide-home/HomeKnowledge";
import HomeCompare from "@/components/guide-home/HomeCompare";
import HomeEconomics from "@/components/guide-home/HomeEconomics";
import HomeMarket from "@/components/guide-home/HomeMarket";
import HomeModels from "@/components/guide-home/HomeModels";
import HomeTrust from "@/components/guide-home/HomeTrust";
import HomeFinal from "@/components/guide-home/HomeFinal";
import homeSec1 from "@/data/guide-home/homeSec1.json";
import homeFindVehicle from "@/data/guide-home/homeFindVehicle.json";
import homeDiagnose from "@/data/guide-home/homeDiagnose.json";
import homeRankings from "@/data/guide-home/homeRankings.json";
import homeFailures from "@/data/guide-home/homeFailures.json";
import homeKnowledge from "@/data/guide-home/homeKnowledge.json";
import homeCompare from "@/data/guide-home/homeCompare.json";
import homeEconomics from "@/data/guide-home/homeEconomics.json";
import homeMarket from "@/data/guide-home/homeMarket.json";
import homeModels from "@/data/guide-home/homeModels.json";
import homeTrust from "@/data/guide-home/homeTrust.json";
import homeFinal from "@/data/guide-home/homeFinal.json";

const HOME_TITLE = "The UK's Most Trusted Land Rover & Range Rover Ownership Guide";
const HOME_DESCRIPTION =
  "Reliability rankings, real failure data, honest repair-vs-replace economics - for every Defender, Discovery, Range Rover, Evoque, Velar and Freelander ever sold in the UK.";
const HOME_URL = "https://landroverengine.uk";
const HOME_IMAGE = "https://landroverengine.uk/hero-day.webp";

export const metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: HOME_URL,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    url: HOME_URL,
    siteName: "Land Rover & Range Rover Ownership Guide",
    locale: "en_GB",
    images: [
      {
        url: HOME_IMAGE,
        alt: "Land Rover & Range Rover Ownership Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [HOME_IMAGE],
  },
};

// Home page redesign (the approved Ownership Guide home, first built on the Land Rover Garage site
// by mistake): each section component carries its own mobile / desktop layout, this file just
// wires the JSON in. The previous HomeSec1-13 sections stay in src/components/home for now.
export default function Home() {
  return (
    <main>
      <HomeSec1 hero={homeSec1} />
      <HomeFindVehicle data={homeFindVehicle} />
      <HomeDiagnose data={homeDiagnose} />
      <HomeRankings data={homeRankings} />
      <HomeFailures data={homeFailures} />
      <HomeKnowledge data={homeKnowledge} />
      <HomeCompare data={homeCompare} />
      <HomeEconomics data={homeEconomics} />
      <HomeMarket data={homeMarket} />
      <HomeModels data={homeModels} />
      <HomeTrust data={homeTrust} />
      <HomeFinal data={homeFinal} />
    </main>
  );
}
