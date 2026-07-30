# Taste Learnings

- Prefers data-driven SEO metadata (canonicals, titles, descriptions) stored in JSON data files and consumed by `generateMetadata()`, rather than auto-derived from route patterns or hardcoded in components. Confidence: 0.8
- Prefers page registries (`pages.json` files that enumerate slugs and reference data files) over filesystem scanning (`fs.readdirSync`, glob) for route discovery and sitemap generation. Confidence: 0.7
- Uses casual communication shorthand (e.g., "plz" for please, "chk" for check). Confidence: 0.6
