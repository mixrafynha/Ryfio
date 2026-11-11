# Ryfio Product Indexing Report

## Source findings

- Product URLs use `/products/{id}` and are canonicalized to `https://www.ryfio.com/products/{id}`.
- `app/sitemap.ts` includes only products where `is_active = true`, `status = active`, and `deleted_at IS NULL`.
- `app/products/[id]/page.tsx` applies the same active/status/deleted filters before rendering; missing products return `notFound()` and `noindex` metadata.
- `middleware.ts` explicitly bypasses authentication middleware for public `/products` routes, preserving crawler access without changing protected routes.
- Product pages render server-side metadata and Product JSON-LD, including truthful price/currency data when available.

## Runtime limitation

This source audit did not query production Supabase data or claim that exactly 12 products are currently active. After deployment, compare the sitemap product URLs with the active product export/query and inspect each URL's rendered HTML and HTTP status.

## Required verification

1. Confirm every active product returns HTTP 200 and has one canonical URL.
2. Confirm unpublished/deleted products are absent from the sitemap and return the existing not-found behavior.
3. Confirm no public product page emits `noindex` or an authentication redirect.
4. Validate Product and BreadcrumbList JSON-LD on representative products with real price, currency, images, and stock states.

