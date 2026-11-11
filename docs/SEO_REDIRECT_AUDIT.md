# SEO Redirect Audit

Audit date: 2026-11-12  
Repository baseline: `04d034aa5521ca50de66df219fb423b95b452f44`  
Branch: `audit/seo-redirects`  
Canonical host: `https://www.ryfio.com`

## Executive result

All seven Search Console URLs currently resolve to the canonical host without a loop, SSL error, login redirect, or incorrect destination. The non-`www` HTTPS URLs use one hosting-level `307 Temporary Redirect` to the equivalent `www` URL, which then returns `200`. The non-`www` HTTP URLs use two hops (`308` HTTP→HTTPS, then `307` apex→`www`).

The repository contains no public-host redirect in `next.config.js`, `vercel.json`, or `middleware.ts`; the observed host redirects are therefore external hosting/domain behavior. No code correction is justified or safe to apply under the requested rules.

## Redirect table

All seven rows had the same observed chain pattern. The initial HTTP form is included to show the complete protocol/host behavior.

| URL original | HTTP inicial | Cadeia completa | URL final | HTTP final | Canonical | Problema identificado | Correção recomendada | Estado |
|---|---:|---|---|---:|---|---|---|---|
| `https://ryfio.com/custom-hoodies` | 307 | `https://ryfio.com/custom-hoodies` → 307 → `https://www.ryfio.com/custom-hoodies` | `https://www.ryfio.com/custom-hoodies` | 200 | correto | Temporary redirect at hosting layer | Configure the canonical apex-to-`www` domain redirect as permanent 308 in hosting, if the provider supports it | ativo no alojamento; funcional |
| `https://ryfio.com/custom-t-shirts` | 307 | `https://ryfio.com/custom-t-shirts` → 307 → `https://www.ryfio.com/custom-t-shirts` | `https://www.ryfio.com/custom-t-shirts` | 200 | correto | Temporary redirect at hosting layer | Same hosting-only recommendation | ativo no alojamento; funcional |
| `https://ryfio.com/custom-tote-bags` | 307 | `https://ryfio.com/custom-tote-bags` → 307 → `https://www.ryfio.com/custom-tote-bags` | `https://www.ryfio.com/custom-tote-bags` | 200 | correto | Temporary redirect at hosting layer | Same hosting-only recommendation | ativo no alojamento; funcional |
| `https://ryfio.com/custom-mugs` | 307 | `https://ryfio.com/custom-mugs` → 307 → `https://www.ryfio.com/custom-mugs` | `https://www.ryfio.com/custom-mugs` | 200 | correto | Temporary redirect at hosting layer | Same hosting-only recommendation | ativo no alojamento; funcional |
| `https://ryfio.com/pricing` | 307 | `https://ryfio.com/pricing` → 307 → `https://www.ryfio.com/pricing` | `https://www.ryfio.com/pricing` | 200 | correto | Temporary redirect at hosting layer | Same hosting-only recommendation | ativo no alojamento; funcional |
| `https://ryfio.com/catalog` | 307 | `https://ryfio.com/catalog` → 307 → `https://www.ryfio.com/catalog` | `https://www.ryfio.com/catalog` | 200 | correto | Temporary redirect at hosting layer | Same hosting-only recommendation | ativo no alojamento; funcional |
| `https://ryfio.com/blog` | 307 | `https://ryfio.com/blog` → 307 → `https://www.ryfio.com/blog` | `https://www.ryfio.com/blog` | 200 | correto | Temporary redirect at hosting layer | Same hosting-only recommendation | ativo no alojamento; funcional |

## Additional protocol checks

For all seven paths:

- `http://ryfio.com/path` → `308 https://ryfio.com/path` → `307 https://www.ryfio.com/path` → `200`.
- `http://www.ryfio.com/path` → `308 https://www.ryfio.com/path` → `200`.
- `https://www.ryfio.com/path` → `200` directly.
- No cycles, SSL failures, or incorrect path destinations were observed.

The query string was preserved: `https://ryfio.com/catalog?source=gsc` returned `307` to `https://www.ryfio.com/catalog?source=gsc`.

## Final-page checks

The seven canonical final pages all returned:

- HTTP 200.
- Canonical URL on `https://www.ryfio.com` with the same path.
- `robots` metadata `index, follow`.
- Public HTML without an authentication redirect.

Additional checks passed:

- Homepage canonical host behavior: `https://www.ryfio.com/` returned 200; its existing page response did not expose a conflicting canonical tag.
- Representative product: HTTP 200, canonical `https://www.ryfio.com/products/1d5e73d3-94f0-4448-af38-06a4d31cfa49`, public response.
- Sitemap and robots: both returned HTTP 200 and use `https://www.ryfio.com`.
- Protected route preservation: `https://www.ryfio.com/dashboard` still returned the existing `307` login redirect with the `/dashboard` return path.

## Code and hosting audit

- `next.config.js`: no redirect or rewrite rule found.
- `vercel.json`: security headers only; no redirect rule found.
- `middleware.ts`: redirect logic is limited to authentication/protected-route behavior; it was not changed.
- Production domain/DNS dashboard: not available in this repository or authorized tools, so the exact Vercel domain setting cannot be inspected.

## Search Console interpretation

The seven non-`www` URLs are expected to be reported as redirected/noncanonical when Google crawls them. Their final canonical pages are currently reachable and indexable. Because the live redirect is already resolving correctly, do not use **Validate Fix** as a substitute for changing the hosting redirect status. If the Search Console issue is historical, request validation only after confirming the report's affected-example list has refreshed. Inspect the `www` final URLs directly for indexing status.

If the owner approves a hosting change, configure one permanent canonical-domain redirect at the hosting provider (preferably `308`, preserving path and query), then re-test all seven URL families before using **Validate Fix**. No application code, middleware, layout, access rule, or deployment setting was changed in this audit.

