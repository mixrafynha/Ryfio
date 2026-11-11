# Ryfio SEO, Product Discovery & Organic Growth Audit

Audit basis: repository checkout on branch `feat/b2c-seo-optimization`, plus a read-only crawl of `https://www.ryfio.com` on 2026-11-11. Production may differ because the branch is not deployed.

## Executive summary

The application has a sound Next.js App Router foundation: public product pages are server-rendered, active products are queried into the sitemap, product pages have canonical metadata and Product JSON-LD, and middleware explicitly leaves `/products` public. The highest confirmed issues are inconsistent canonical host usage in category landing pages, unsupported social-proof copy that was addressed in this branch, and production drift from the branch. The catalog is currently capped at 60 records; whether that hides active products depends on the live product count and therefore requires a Supabase/production check before changing it.

## Confirmed findings

| Severity | Finding | Evidence | Impact | Status |
|---|---|---|---|---|
| High | Category landing pages used the non-`www` host in canonical and breadcrumb URLs. | `app/_custom-products/ProductLandingPage.tsx` defined `SITE_URL = https://ryfio.com`; root, sitemap, robots and product pages use `https://www.ryfio.com`. | Splits URL signals and can create host inconsistency. | Fixed in this branch. |
| High | Production homepage and catalog still served old creator-first copy during the audit crawl. | Live crawl showed “Turn any idea into a real product”, “5/5 from creators”, and old catalog H1; local branch contains buyer-first copy. | Intended SEO/conversion improvements have no production effect until deployed. | Confirmed; deployment required. |
| Medium | The previous homepage contained an unverified “5/5 from creators” claim and rotating testimonials using remote avatars. | `app/page.tsx` and `app/components/TestimonialRotator.tsx`; the homepage change removes the claim from the rendered page. | Trust/compliance risk and weak evidence quality. | Addressed in this branch; unused component remains for safe review/removal later. |
| Medium | Catalog query is limited to 60 active products. | `app/catalog/page.tsx`, `.limit(60)`. | Products after the first 60 may not be discoverable through the catalog UI. Sitemap discovery is separate. | Confirmed limit; commercial impact unverified until product count is measured. |
| Low | Product image source is database-driven and not guaranteed to have descriptive filenames. | `app/products/[id]/page.tsx` and Supabase `image/images` fields. | Filename-based image relevance may be weak, although alt text and JSON-LD are present through the product UI. | Confirmed implementation constraint; storage migration not justified yet. |

## Crawlability and indexing

- `app/robots.ts` allows the public site and disallows `/api/`, `/admin/`, and `/dashboard/`; sitemap is `https://www.ryfio.com/sitemap.xml`.
- `middleware.ts` marks dashboard/admin/settings/profile routes `noindex, nofollow, noarchive` and bypasses authentication for `/products`.
- `app/sitemap.ts` emits static public pages and active, non-deleted products using `is_active=true`, `status=active`, and `deleted_at IS NULL`.
- Missing products call `notFound()`, so they are not intentionally rendered as indexable product pages.
- `/products` re-exports the catalog page, preserving an additional public catalog route; its canonical/indexing behavior should be checked in Search Console before treating it as a second landing page.
- Filter state is query-string driven in the catalog. No evidence supports indexing every filter combination; keep filters crawl-neutral unless a deliberate category URL strategy is added.

The sitemap/product query agreement is structurally good, but production verification still needs a sampled sitemap fetch, HTTP status check, and comparison with the active Supabase product count. Redirect chains, TLS host redirects, and soft-404 behavior require production/HTTP access and are not claimed here.

## Product SEO

`app/products/[id]/page.tsx` fetches active public products server-side, creates a unique title from the product title, creates a description from the stored description with a fallback, emits an absolute canonical URL, Open Graph image metadata, and Product JSON-LD with visible name/description and price when valid. It does not add ratings, reviews, shipping, or availability that are not verified.

The main scalability risk is data quality: generic or repeated titles and thin descriptions would produce weakly differentiated pages. The safe strategy is to improve product records and add optional slug support later with permanent redirects, without changing existing ID URLs. Do not invent specifications or identifiers.

## Category and landing pages

`/custom-t-shirts`, `/custom-hoodies`, `/custom-mugs`, and `/custom-tote-bags` have unique metadata, H1s, FAQ content, image alt text, related category links, and catalog CTAs. They are useful commercial entry points. Their current schema is BreadcrumbList only; Product/Offer schema should not be added unless each page visibly presents a specific purchasable product and accurate offer.

## Blog

The blog contains 10 published articles covering brand launch, print-on-demand, product design, AI design, selling, and product-page SEO. Articles have metadata and Article JSON-LD through `app/blog/_components.tsx`, related guides, and a catalog CTA. The content model is reusable and some article body sections are programmatically generalized, so editorial review is recommended before expanding it. No article should be removed or redirected without Search Console traffic and backlink evidence.

## Images and performance

Public marketing/catalog images use `next/image`, responsive `sizes`, and priority for leading imagery. Product image URLs come from Supabase data; absolute URLs are now used in product metadata/JSON-LD. Real Core Web Vitals are not available in this repository. Lighthouse-like results would be lab data only. Measure mobile LCP/INP/CLS in CrUX or field analytics before changing fonts, editor code, or checkout behavior.

## International SEO

The UI is English-first. Currency is product/checkout data driven, but no locale URL tree or translated pages were found. No hreflang tags should be added. International expansion should begin with verified supported-country, currency, tax, and shipping rules, then create localized pages only when translated content and operational support exist.

## Analytics and verification

A Google Search Console verification HTML file exists at `public/googleabdb156a7aea41f2.html`. No GA4 measurement ID, Search Console API integration, or ecommerce event implementation was confirmed by repository search. Account access is required to verify ownership, submit the sitemap, inspect indexing, and establish conversion baselines.

## Google Merchant Center readiness

The site has public product URLs, product names, images, prices, currencies, and Product JSON-LD. No product feed generator, GTIN/MPN data contract, country-specific feed, or verified shipping/availability feed was found. Merchant Center readiness is therefore partial, not complete. Do not submit products until feed values, availability, shipping, returns, brand identity, and policy pages are reconciled with actual operations.

## Limitations

Supabase contents, production response headers/statuses, Search Console, GA4, Merchant Center, real-user CWV, rankings, backlink data, keyword volume, and competitor datasets were not available. No traffic, ranking, conversion, or revenue claims are made.
