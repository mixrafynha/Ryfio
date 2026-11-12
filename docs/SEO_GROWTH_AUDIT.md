# Ryfio SEO Growth Audit

Audit date: 2026-11-12  
Audit branch: `audit/seo-growth`  
`main` baseline: `04d034aa5521ca50de66df219fb423b95b452f44`

This is an audit only. No application code, layout, style, image, business logic, access rule, or production configuration was changed.

## Branch and publication audit

| Branch | Tip | Changes unique to branch | In `main`? | Published status |
|---|---|---|---|---|
| `main` | `04d034a` | Technical SEO metadata/reports from the prior main commit | yes | Main branch source; deployment commit not exposed by public responses |
| `fix/seo-metadata-consistency` | `19ce5bc` | Canonical host fixes, product availability removal, self-hosted fonts | no | Not provable from Git alone; production HTML resembles some of this branch, but no deployment commit header was available |
| `audit/product-indexation` | `4182f62` | Product indexation audit report only | no | Documentation branch; not published |
| `audit/seo-redirects` | `19697e2` | Redirect audit report only | no | Documentation branch; not published |

The production site currently exposes `www` category canonicals and product JSON-LD without `availability`, which differs from the checked-out `main` source. This means the deployed artifact cannot safely be inferred from the local branch graph. Confirm the Vercel deployment commit before attributing production behavior to a branch.

## Confirmed production strengths

- The public sitemap contains 12 product URLs and the public Search Console facts supplied for this audit report 30 discovered URLs; discovered does not mean indexed.
- All 12 product URLs tested return HTTP 200, have unique titles, canonical URLs on `https://www.ryfio.com`, Product JSON-LD, and accessible primary images.
- Product prices and currency are present in the observed JSON-LD and use EUR values from the public product data.
- Product pages have internal links in the rendered HTML; the sample count was 22 unique site-relative links per product page.
- Public category, catalog, pricing, and blog pages return HTTP 200 and expose `index, follow` metadata.
- Sitemap and robots are available at HTTP 200 and use the `www` canonical host.

## Confirmed or likely opportunities

### P0 — deployment/source consistency

The deployed HTML and checked-out `main` do not match on canonical/availability details. This is the most important operational issue because SEO fixes in an un-deployed branch have no effect. Verify the exact Vercel deployment commit and production branch before changing code.

Files to inspect: deployment settings outside this repository and the Vercel deployment record. No repository change is recommended until the source of the production artifact is known.

### P1 — product descriptions and structured-data semantics

Observed product descriptions are generated from existing product descriptions or a generic fallback and are capped at 155 characters. This is technically valid but may be generic for search intent. Improve only with verified product attributes; do not invent material, fit, sustainability, delivery, reviews, identifiers, or stock.

The local `main` source can emit availability from a local `stock` fallback. Because this is a print-on-demand product model and the production HTML currently does not expose availability, availability should remain omitted unless the business establishes a reliable customer-facing availability source. This is a data-governance recommendation, not an implemented change.

### P1 — Core Web Vitals measurement

No authenticated field data or CrUX record was available. The HTTP sample below is not a Core Web Vitals measurement. Run Lighthouse/PageSpeed Insights on mobile and collect real-user CrUX/Search Console data before changing loading behavior.

### P2 — internal-link intent

Product pages have internal links, but this audit did not establish whether every link is semantically relevant or whether category pages link to every active product. Review the rendered catalog/category link graph before proposing changes. Any visible navigation or card-link change requires approval under the project rules.

## Product audit and individual recommendations

All rows below were fetched from production on 2026-11-12. Each had HTTP 200, a unique title, canonical URL on `www`, Product JSON-LD with an Offer, EUR price, and an accessible image. Availability was not relied on because its semantics were not established.

| Product | Current title | Price | Recommendation | Risk / required evidence |
|---|---|---:|---|---|
| `1d5e73d3-94f0-4448-af38-06a4d31cfa49` | Premium Oversized T-Shirt | €29.99 | Keep title; review description for verified oversized-fit/material terms | Low; product data only |
| `33dc2597-d039-4604-9935-6f1a3167f9ab` | Soft Tee | €20.99 | Keep title; add a verified differentiator only if present in source data | Low; avoid generic claims |
| `35eb11ad-80c6-412a-8917-47ab0587566e` | Classic Hoodie | €33.99 | Review whether “classic” and hoodie attributes are sufficiently specific in the source description | Low |
| `5d087733-4057-4fa5-8ff7-4b06cd1484b7` | Quarter Zip | €39.99 | Keep product type; verify whether “quarter-zip sweatshirt” is supported before proposing a title refinement | Low |
| `7078d547-d526-4ce4-a562-42f75be831ca` | Midweight Crewneck | €35.99 | Keep title; verify weight/material details before enriching metadata | Low |
| `75cff129-9984-4e40-88a5-1555db4e2543` | Daily Tee | €20.99 | Review for a verified audience/use-case descriptor; do not add one speculatively | Low |
| `91975ce6-253f-41b1-8fb4-60a3ae6d1bbe` | Premium Organic Hoodie | €58.99 | Validate “organic” certification/source field and retain only if authoritative | Medium; claim substantiation |
| `92341f50-df34-4aec-a203-dac7c47b3ed0` | Everyday Crewneck | €25.83 | Keep title; review description for verified garment attributes | Low |
| `aba40fb2-a6b5-48a9-9d20-9e1c1b6901a4` | Premium Crewneck | €50.99 | Validate “premium” against approved product copy; avoid unsupported quality claims | Low/medium |
| `bd27110f-bf67-4a2a-97be-44d98851ac3a` | Classic T-Shirt | €17.39 | Keep title; verify whether a fit/material qualifier exists in product data | Low |
| `c1a55d24-2d97-407b-9bba-1b8a0eec4102` | Premium Hoodie | €47.99 | Validate “premium” and consider a verified differentiator only | Low/medium |
| `c97a06e4-8f28-42fa-8dfc-dc909387872e` | Inner Noise Hoodie | €55.08 | Keep distinctive title; ensure description explains the product without changing visible copy | Low |

### Safe metadata proposal pattern

If product source data is approved, use a concise title of `[verified product name] | Ryfio` and a description of `[verified product type/attribute] available to customize on Ryfio.`, capped around 155 characters. Keep the existing canonical URL, image URL, price, and currency. Do not add availability, brand, GTIN, MPN, ratings, reviews, shipping, or returns unless those fields are authoritative.

## Homepage, catalog, and categories

### Homepage

Current production title: `Ryfio — Create & Sell Custom Products`. Current description length: 106 characters. Canonical host is represented by the `www` Open Graph URL; the homepage did not expose a canonical link in the tested HTML. The title and description address creators/sellers more strongly than consumers buying personalized products. A B2C-oriented metadata proposal would mention personalized clothing, gifts, and custom products, but `app/layout.tsx` is protected by the task rules and must not be modified without explicit approval.

### Catalog

Current title: `Custom Products to Sell | RYFIO Product Catalogue | Ryfio` after the root title template. It is seller-oriented and “blank products” language may not match all consumer intent. A proposal could target personalized products/custom gifts only if the catalog actually contains those products. `app/catalog/layout.tsx` is explicitly protected and was not changed.

### Custom-product categories

The four category pages have distinct, consumer-oriented titles/descriptions in production, correct `www` canonicals, Open Graph URLs, and `index, follow`. No duplicate metadata problem was confirmed. The source on `main` should be reconciled with the deployed artifact before any change is considered.

### Blog and pricing

Blog and pricing return 200 with correct `www` canonicals. Blog metadata is descriptive but remains a secondary acquisition path for product discovery. Pricing is indexable; confirm that this is intentional for the commercial strategy before changing anything.

## Speed audit

Measured from an external PowerShell HTTP client; these are one-off total response samples, not CrUX or Lighthouse metrics:

| URL | HTTP | Total response | HTML bytes |
|---|---:|---:|---:|
| `/` | 200 | 83 ms | 84,467 |
| `/catalog` | 200 | 259 ms | 194,437 |
| `/custom-hoodies` | 200 | 14 ms | 68,150 |
| `/custom-t-shirts` | 200 | 26 ms | 68,085 |
| `/custom-tote-bags` | 200 | 97 ms | 67,936 |
| `/custom-mugs` | 200 | 17 ms | 67,667 |
| `/pricing` | 200 | 16 ms | 71,323 |
| `/blog` | 200 | 25 ms | 94,976 |
| representative product | 200 | 281 ms | 239,247 |

The catalog and product HTML responses are materially larger/slower in this sample and should be measured with mobile Lighthouse before optimization. Possible investigation areas are server-rendered product data, client JavaScript, image loading, and caching. No optimization was applied because changing them could affect behavior or appearance.

Unavailable in this audit: mobile LCP, INP, CLS, field TTFB, JavaScript transfer breakdown, Supabase query timings in production, and Google CrUX/Search Console performance data.

## Priority plan

1. Verify the deployed commit/source mapping in Vercel.
2. Obtain Search Console URL Inspection and Page Experience data; separate discovered from indexed URLs.
3. Validate product source attributes and decide whether descriptions should be made more specific.
4. Measure catalog/product mobile Lighthouse and real-user CWV.
5. Only then prepare isolated metadata or performance changes for review.

## Files that would require approval for future changes

- `app/layout.tsx` — homepage/default metadata; prohibited by this audit.
- `app/catalog/layout.tsx` — catalog metadata; prohibited by this audit.
- `app/products/[id]/page.tsx` — product metadata/JSON-LD; requires verified data.
- `app/_custom-products/ProductLandingPage.tsx` — category metadata source; avoid visible/component changes.
- `app/blog/*/page.tsx` and `app/blog/_components.tsx` — article metadata/JSON-LD.
- Deployment/domain settings outside the repository — only with explicit authorization.

## Explicitly prohibited and not changed

No design, visible copy, layout, fonts, CSS, Tailwind, images, animations, middleware, authentication, access rules, private-page blocking, redirect security, product data, prices, stock, Supabase, Gelato, Stripe, checkout, cart, or editor code was modified.

