# Taste Learnings
- Prefers data-driven SEO metadata (canonicals, titles, descriptions) stored in JSON data files and consumed by `generateMetadata()`, rather than auto-derived from route patterns or hardcoded in components. Confidence: 0.5
- Prefers canonical URLs to be dynamically constructed in `generateMetadata()` from route parameters (e.g., `parent/slug`), NOT hardcoded into every data JSON file — values dynamic generation over batch-writing static fields. Confidence: 0.95
- Prefers page registries (`pages.json` files that enumerate slugs and reference data files) over filesystem scanning (`fs.readdirSync`, glob) for route discovery and sitemap generation. Confidence: 0.7
- Uses casual communication shorthand (e.g., "plz" for please, "chk" for check, "fking" for frustrated emphasis). Confidence: 0.8
- Prefers canonical URLs without trailing slashes — considers trailing "/" a bug that must be stripped from `canonical`, `openGraph.url`, and all jsonLd URLs. Confidence: 0.9
- Prefers a single reference/planning file that catalogues all page headings (H1/H2) in render order as the canonical source of truth, explicitly marking which are hardcoded vs `{placeholder}` data-driven; syncs components to match it and skip ones already correct. Confidence: 0.7
- Values fast, no-frills execution on simple mechanical tasks ("do it fast its simple task") — prefers minimal deliberation and over-explanation for straightforward jobs. Confidence: 0.4
elves and wants the agent to limit changes to the specific edits requested rather than running tests or builds. Confidence: 0.6
