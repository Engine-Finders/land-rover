# Taste Learnings

- Prefers data-driven SEO metadata (canonicals, titles, descriptions) stored in JSON data files and consumed by `generateMetadata()`, rather than auto-derived from route patterns or hardcoded in components. Confidence: 0.5
- Prefers canonical URLs to be dynamically constructed in `generateMetadata()` from route parameters (e.g., `parent/slug`), NOT hardcoded into every data JSON file — values dynamic generation over batch-writing static fields. Confidence: 0.9
- Prefers page registries (`pages.json` files that enumerate slugs and reference data files) over filesystem scanning (`fs.readdirSync`, glob) for route discovery and sitemap generation. Confidence: 0.7
- Uses casual communication shorthand (e.g., "plz" for please, "chk" for check, "fking" for frustrated emphasis). Confidence: 0.8
- Prefers canonical URLs without trailing slashes — considers trailing "/" a bug that must be stripped from `canonical`, `openGraph.url`, and all jsonLd URLs. Confidence: 0.9
