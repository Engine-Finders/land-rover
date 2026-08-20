/** Full navbar inventory: dynamic MODELS + ENGINES, plus every static public HTML page. */
import modelNavData from "@/components/shared/modelNavData.json";
import staticNavData from "@/components/shared/staticNavData.json";

const enginesGroups = [
  {
    title: "Diesel",
    links: [
      { label: "200Tdi / 300Tdi", href: "/engine/200-300tdi" },
      { label: "276DT", href: "/engine/276dt" },
      { label: "306DT", href: "/engine/306dt" },
      { label: "368DT", href: "/engine/368dt" },
      { label: "448DT", href: "/engine/448dt" },
      { label: "Ingenium 2.0 Diesel", href: "/engine/ingenium-20-diesel" },
      { label: "M47", href: "/engine/m47" },
      { label: "M51", href: "/engine/m51" },
      { label: "M57 TD6", href: "/engine/m57-td6" },
      { label: "204DTD (PSA DW12)", href: "/engine/psa-dw12-204dtd" },
      { label: "TD5", href: "/engine/td5" },
      { label: "AJ20D6", href: "/engine/aj20d6" },
    ],
  },
  {
    title: "Petrol",
    links: [
      { label: "AJ-V8 4.2 / 4.4 SC", href: "/engine/aj-v8-42-44-sc" },
      { label: "AJ133", href: "/engine/aj133" },
      { label: "AJ20P6", href: "/engine/aj20p6" },
      { label: "Ford Si4 / PT204", href: "/engine/ford-si4-pt204" },
      { label: "Ingenium 2.0 Petrol", href: "/engine/ingenium-20-petrol" },
      { label: "K-Series 1.8 / 2.3", href: "/engine/k-series-18-23" },
      { label: "M62", href: "/engine/m62" },
      { label: "N62", href: "/engine/n62" },
      { label: "P510", href: "/engine/p510" },
      { label: "Volvo SI6", href: "/engine/volvo-si6" },
    ],
  },
];

export const navMenus = [
  {
    id: "models",
    label: "MODELS",
    kind: "models",
    groups: modelNavData.groups.map((group) => ({
      title: group.title,
      items: group.items.map(({ variantCount, generationCount, ...item }) => item),
    })),
  },
  {
    id: "engines",
    label: "ENGINES",
    kind: "columns",
    groups: enginesGroups,
  },
  {
    id: "problems",
    label: "PROBLEMS & SYMPTOMS",
    kind: "columns",
    groups: [
      { title: "Common Failures", links: staticNavData.failures },
      { title: "Symptoms", links: staticNavData.symptoms },
      { title: "Warning Lights", links: staticNavData.warningLights },
      { title: "Fault Codes", links: staticNavData.faultCodes },
    ],
  },
  {
    id: "guides",
    label: "GUIDES",
    kind: "columns",
    groups: [
      { title: "Technical Library", links: staticNavData.technical },
    ],
  },
  {
    id: "research",
    label: "RESEARCH & COMPARE",
    kind: "columns",
    groups: [
      { title: "Compare", links: staticNavData.compare },
      { title: "Fitment Guide", links: staticNavData.fitment },
      { title: "Case Studies", links: staticNavData.caseStudies },
      { title: "Recalls", links: staticNavData.recalls },
      { title: "Ownership Economics", links: staticNavData.economics },
    ],
  },
  {
    id: "data-tools",
    label: "DATA & TOOLS",
    kind: "columns",
    groups: [
      { title: "Data & Reports", links: staticNavData.data },
      { title: "Tools", links: staticNavData.tools },
      { title: "About", links: staticNavData.about },
      { title: "Contact", links: staticNavData.contact },
      { title: "Engine Pages", links: staticNavData.engine },
    ],
  },
];
