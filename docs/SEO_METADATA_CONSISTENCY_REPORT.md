# SEO Metadata Consistency Report

## Baseline

- Initial `main` commit: `04d034aa5521ca50de66df219fb423b95b452f44`
- Working branch: `fix/seo-metadata-consistency`
- Production canonical host used by the existing root metadata and sitemap: `https://www.ryfio.com`

## Implemented

- `app/_custom-products/ProductLandingPage.tsx`: changed the metadata/JSON-LD URL constant from the bare host to `https://www.ryfio.com`.
- `app/blog/_components.tsx`: changed the Article publisher logo URL to the `www` host and added the publisher organization URL. Article `mainEntityOfPage` already used the `www` host.
- `app/products/[id]/page.tsx`: removed the `Offer.availability` value because the inspected product `stock` field is not sufficient to establish customer-facing print-on-demand availability. The application has separate Gelato regional availability resolution and sync status fields; inventing `InStock`/`OutOfStock` from the local stock fallback would be misleading. Price and currency remain sourced from the existing product/variant data.

## Intentionally not changed

- `app/layout.tsx` and `app/catalog/layout.tsx`: the requested metadata improvements are technically possible, but the supplied absolute rule prohibits modifying any `layout.tsx`. Existing metadata was therefore audited and left unchanged.
- `app/sitemap.ts`: active public product filtering and all existing category/static routes already use the same `https://www.ryfio.com` host. No publication or access rule was changed.
- `middleware.ts`, CSS, fonts, visible content, images, product data, checkout, authentication, and protected-route behavior: unchanged.

## Verification scope

Source-level checks can verify host strings and structured-data construction. Live product counts, HTTP responses, deployed sitemap contents, Rich Results, and Search Console coverage still require deployment/runtime access.

