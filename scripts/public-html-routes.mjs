import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");

/** App routes that must not be overridden by static HTML rewrites. */
const RESERVED = new Set(["quote"]);

/** Engines rendered by the /engine/[slug] template: their old static HTML pages (public/engine/*.html)
 * must not shadow the template, so they are skipped here and the template serves them. */
function templateEngineSlugs() {
  try {
    const file = path.join(ROOT, "src/data/registery/engines/pages.json");
    return new Set(JSON.parse(fs.readFileSync(file, "utf8")).map((p) => `engine/${p.slug}`));
  } catch {
    return new Set();
  }
}

function walkHtmlFiles(dir, relativeDir = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const rel = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith(".html")) {
      files.push(rel.replace(/\\/g, "/"));
    }
  }

  return files;
}

/** Build beforeFiles rewrites + canonical redirects for public/*.html assets. */
export function getPublicHtmlRoutes() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    return { rewrites: [], redirects: [] };
  }

  const rewrites = [];
  const redirects = [];
  const ENGINE_TEMPLATES = templateEngineSlugs();

  for (const file of walkHtmlFiles(PUBLIC_DIR)) {
    const htmlPath = `/${file}`;
    const cleanPath = htmlPath.replace(/\.html$/, "");
    const slug = cleanPath.slice(1);

    if (!slug || RESERVED.has(slug.split("/")[0])) continue;
    if (ENGINE_TEMPLATES.has(slug)) {
      // old links to the .html file land on the template page
      redirects.push({ source: htmlPath, destination: cleanPath, permanent: true });
      continue;
    }

    rewrites.push({ source: cleanPath, destination: htmlPath });
    redirects.push({ source: htmlPath, destination: cleanPath, permanent: true });
  }

  return { rewrites, redirects };
}
