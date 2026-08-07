# Canonical URL Setup — LandRoverEngine.uk

Every page auto-generates `<link rel="canonical">` from its JSON data file with zero per-page manual work.

## Route Structure

| URL Pattern | Page File | Content Type |
|---|---|---|
| `/` | `src/app/page.js` | Home |
| `/defender`, `/velar`, … | `src/app/[...slug]/page.js` | Model page |
| `/defender/l663`, `/velar/l560`, … | `src/app/[...slug]/page.js` | Generation page |
| `/defender/p300`, `/velar/d200`, … | `src/app/[...slug]/page.js` | Variant page |
| `/engine/200-300tdi`, `/engine/aj133`, … | `src/app/engine/[slug]/page.js` | Engine page |

## How Canonicals Work

Every data JSON has a `meta.canonical` field with an absolute URL:

```json
{
  "meta": {
    "canonical": "https://landroverengine.uk/defender/p300/"
  }
}
```

Each `generateMetadata()` reads `meta.canonical` and passes it to `alternates.canonical`. No fallback auto-generation — the JSON is the source of truth.

### Catch-all route (`src/app/[...slug]/page.js`):

```js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resolved = lookupEntry(slug);        // matches models, generations, or variants registry
  const data = await getPageData(resolved.type, resolved.entry.dataFile);

  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: data.meta.canonical ? { canonical: data.meta.canonical } : undefined,
    // … openGraph, twitter …
  };
}
```

### Engine route (`src/app/engine/[slug]/page.js`):

Same pattern — reads `meta.canonical` from `src/data/engines/{dataFile}.json`.

### Home page (`src/app/page.js`):

Hardcoded canonical for the root.

## Result

Every page outputs:

```html
<link rel="canonical" href="https://landroverengine.uk/defender/p300/" />
```

## Sitemap

`src/app/sitemap.js` imports all four page registries:
- `src/data/registery/models/pages.json`
- `src/data/registery/generations/pages.json`
- `src/data/registery/variants/pages.json`
- `src/data/registery/engines/pages.json`

It iterates them and constructs absolute URLs matching the route structure:

```
/                          → priority 1.0
/defender, /velar, …       → priority 0.9  (models)
/defender/l663, …          → priority 0.8  (generations, {parent}/{slug})
/defender/p300, …          → priority 0.7  (variants, {parent}/{slug})
/engine/200-300tdi, …      → priority 0.8  (engines, /engine/{slug})
```

Next.js auto-serves this at `https://landroverengine.uk/sitemap.xml` — no manual XML needed.
