# Google Merchant Readiness

## Current assessment

The application contains product titles, descriptions, images, prices, currencies, variants, and stock fields. Source inspection does not establish reliable values for all Merchant Center requirements, including brand/GTIN/MPN identifiers, shipping destinations and costs, return policy, tax configuration, or supported countries.

Status: **not ready for an automatically published feed without data confirmation**.

## Not implemented

No feed endpoint was added because publishing incomplete or misleading product data would violate the source-of-truth and truthfulness requirements. No products were submitted to Merchant Center.

## Before a feed is implemented

- Confirm the active-product query and public landing-page URL for each product.
- Confirm country, language, currency, shipping, tax, and returns configuration.
- Decide whether identifiers are available; do not invent GTIN, MPN, brand, ratings, or review values.
- Validate availability semantics against the existing variant stock model.
- Ensure the feed exposes only public fields and uses absolute HTTPS image URLs.

