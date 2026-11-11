# SEO Action Plan

## Prioritized roadmap

| Priority | Issue | Evidence | Proposed fix | Files | Expected benefit | Effort |
|---|---|---|---|---|---|---|
| P0 | Production is not serving the current SEO branch. | Live crawl differs from local branch. | Deploy branch through normal review; then validate URLs and metadata. | Deployment/PR | Makes approved improvements live. | Small |
| P1 | Canonical host mismatch on category landing pages. | Landing helper used non-`www`; site standard is `www`. | Standardized `SITE_URL`. | `app/_custom-products/ProductLandingPage.tsx` | Consolidates canonical and breadcrumb signals. | Done |
| P1 | Product discovery can stop at 60 catalog rows. | `.limit(60)` in server query. | Measure active product count. If over 60, add cursor pagination or crawlable category pages before raising the limit. | `app/catalog/page.tsx`, `CatalogClient.tsx` | Prevents UI orphaning without risking query/performance regressions. | Medium |
| P1 | Product differentiation depends on database content quality. | Titles/descriptions are stored fields. | Add an editorial data-quality report for duplicate/short titles and missing images; improve records, not schema. | Supabase/admin tooling | Better product snippets and relevance. | Medium |
| P1 | Merchant Center feed is absent. | No feed route/script found. | Define feed fields from real product/variant/shipping data, then generate and validate before submission. | New feed route/script | Enables free listings if eligibility requirements are met. | Medium |
| P2 | Product/category internal-link graph is incomplete. | Landing pages link categories; blog CTA mostly points to catalog. | Add contextual links from relevant articles to category pages, not arbitrary products. | Blog content/components | Improves discovery and intent flow. | Small/medium |
| P2 | Ecommerce measurement is not confirmed. | No GA4 ID/events found. | Implement consent-aware `view_item`, `begin_customization`, `add_to_cart`, `begin_checkout`, `purchase` after account/event design approval. | Analytics integration | Measures organic-to-purchase funnel. | Medium |
| P2 | Blog content quality is unevenly evidenced. | Shared generated paragraphs in `_components.tsx`. | Editorially review high-intent posts and add first-party examples/links. | `app/blog/*` | Better informational-to-transactional relevance. | Medium |
| P3 | International expansion has no locale architecture. | English-only routes; no hreflang. | Select one supported market, translate fully, verify operations, then add locale URLs/hreflang. | Future route structure | Sustainable international discovery. | Large |

## P0 blockers

No confirmed code-level crawl blocker was found. The only immediate delivery blocker is deployment drift: production must receive the branch before its changes can affect search or conversion.

## Safe validation after deployment

1. Fetch `/robots.txt`, `/sitemap.xml`, homepage, catalog, each landing page, and a sample product URL.
2. Confirm `200` responses, canonical host, no unexpected redirects, and expected robots headers.
3. Compare sitemap product IDs with active/non-deleted Supabase products.
4. Inspect Search Console coverage and enhancement reports.
5. Run a real checkout test in a non-production-safe environment before measuring conversion.
