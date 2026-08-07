import modelPages from "@/data/registery/models/pages.json";
import generationPages from "@/data/registery/generations/pages.json";
import variantPages from "@/data/registery/variants/pages.json";
import enginePages from "@/data/registery/engines/pages.json";

const BASE_URL = "https://landroverengine.uk";

export default function sitemap() {
  const entries = [];

  // Home
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // Models: /defender, /velar, ...
  for (const { slug } of modelPages) {
    entries.push({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Generations: /defender/l663, /velar/l560, ...
  for (const { parent, slug } of generationPages) {
    const url = parent ? `${BASE_URL}/${parent}/${slug}` : `${BASE_URL}/${slug}`;
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Variants: /defender/p300, /velar/d200, ...
  for (const { parent, slug } of variantPages) {
    entries.push({
      url: `${BASE_URL}/${parent}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Engines: /engine/200-300tdi, /engine/aj133, ...
  for (const { slug } of enginePages) {
    entries.push({
      url: `${BASE_URL}/engine/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
