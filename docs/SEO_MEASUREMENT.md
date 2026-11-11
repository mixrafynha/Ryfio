# SEO Measurement and Monitoring

## Search Console checklist

1. Verify `www.ryfio.com` using the existing HTML verification file or an approved domain-property method.
2. Submit `https://www.ryfio.com/sitemap.xml`.
3. Inspect the homepage, catalog, each category landing page, and representative product URLs.
4. Review Page indexing, duplicate/canonical, crawl stats, image indexing, and Product enhancement reports.
5. Export queries/pages monthly and compare impressions, clicks, CTR, average position, and indexed product count.

## Funnel events to implement after measurement approval

- `view_item`: product page view with product ID/category/value/currency.
- `begin_customization`: editor entry with product ID and variant context.
- `add_to_cart`: cart item, value, currency, and product ID.
- `begin_checkout`: checkout start and cart value.
- `purchase`: confirmed Stripe success, transaction ID, value, currency, and items.

Events must be consent-aware, deduplicated, and emitted from authoritative state. Do not invent a GA4 ID or fire purchase events before payment confirmation.

## Baselines

Record before/after deployment:

- indexed public product URLs;
- organic clicks/impressions by landing page;
- catalog-to-product click-through rate;
- product-to-editor start rate;
- add-to-cart, checkout, and purchase rates;
- mobile LCP, INP, and CLS from field data where available.

Repository inspection did not confirm GA4, Search Console API, or ecommerce event wiring. Account access and consent requirements are needed before implementation.
