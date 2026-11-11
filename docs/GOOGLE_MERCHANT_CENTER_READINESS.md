# Google Merchant Center Readiness

## Current state

Partially ready for a future feed, not ready for submission based on repository evidence alone.

### Present

- Public product URLs: `/products/[id]`.
- Server-rendered product data and canonical metadata.
- Product names, descriptions, images, price, and currency fields.
- Product JSON-LD with name, description, image, and Offer price when valid.
- Refund, shipping, terms, privacy, contact, and support routes exist.

### Missing or requiring verification

- No Merchant Center feed generator was found.
- Availability and variant-level stock must be mapped from Supabase/Gelato accurately.
- Shipping price, delivery estimates, tax treatment, and target countries require operational confirmation.
- GTIN/MPN/brand fields are not established in the public product query.
- Return/refund policy eligibility and business identity require account/legal verification.
- Product image URLs, price, currency, and feed values must be tested for consistency.

## Recommended implementation sequence

1. Define a read-only feed contract from active products, variants, real prices, images, and supported countries.
2. Add only real identifiers; use `identifier_exists=no` only where Merchant Center permits and the product genuinely has no identifier.
3. Generate a feed endpoint or scheduled file without changing checkout or fulfillment logic.
4. Validate feed landing pages, structured data, policy links, image access, and currency/availability consistency.
5. Submit only after account ownership, shipping, returns, tax, and country eligibility are verified.

No products should be submitted from this audit, and no fabricated identifiers, stock, shipping promises, ratings, or guarantees should be added.
