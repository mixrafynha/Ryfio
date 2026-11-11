# Ryfio Technical SEO Audit

Audit baseline: commit `6a151c22ee6f0a272643ed1140970863fb59cb10` on 2026-11-11.

## Confirmed implementation

- `app/layout.tsx` defines the site URL, default title/description, canonical-capable metadata base, Open Graph, Twitter, robots directives, icons, and Organization/WebSite JSON-LD.
- The homepage, catalog, custom-product pages, blog index, and blog posts expose metadata and canonical URLs in source.
- `app/sitemap.ts` emits the static public routes and queries active, non-deleted products with `status = active` for product URLs. It revalidates hourly and fails loudly when the product query fails.
- `app/robots.ts` allows public crawling, disallows `/api/`, `/admin/`, and `/dashboard/`, and points to `/sitemap.xml`.
- `middleware.ts` preserves authentication and access-control behavior and adds `X-Robots-Tag: noindex, nofollow, noarchive` only for protected route families.
- Custom-product pages include canonical metadata and BreadcrumbList JSON-LD. Blog pages include canonical/Open Graph/Twitter metadata; blog structured data is rendered by `app/blog/_components.tsx`.

## Confirmed issue fixed

Public product pages had canonical/product JSON-LD and an Offer, but did not expose page-level Twitter metadata, explicit index/follow directives, all available product image URLs, truthful stock availability, or a product breadcrumb in structured data. These were added in `app/products/[id]/page.tsx` using existing product data only.

## Potential issues requiring runtime verification

- The real count of active products and whether all approximately 12 products satisfy the sitemap publication predicates cannot be confirmed from source alone.
- HTTP status, rendered HTML, deployed sitemap contents, Search Console coverage, Core Web Vitals, image MIME types, and cache headers require a deployed environment/browser or Search Console access.
- Product structured data should be validated against live pages after deployment with Google Rich Results Test and Schema Markup Validator.

## Opportunities not implemented

- A Merchant Center feed should wait until reliable shipping, returns, destination, and product-identifier data are confirmed.
- Visible copy improvements may strengthen intent matching but are outside this task's no-visible-change rule; see `SEO_FUTURE_OPPORTUNITIES.md`.

