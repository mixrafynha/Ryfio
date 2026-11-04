import type { MetadataRoute } from "next";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = "https://www.ryfio.com";
const PAGE_SIZE = 500;

// Rebuild the sitemap periodically, instead of querying Supabase on every request.
export const revalidate = 3600;

const staticPaths = [
  "", "/catalog", "/custom-t-shirts", "/custom-hoodies", "/custom-mugs",
  "/custom-tote-bags", "/pricing", "/blog",
  "/blog/how-to-start-a-clothing-brand",
  "/blog/print-on-demand-vs-dropshipping",
  "/blog/best-print-on-demand-products",
  "/blog/how-to-design-a-custom-tshirt",
  "/blog/how-to-create-a-hoodie-design",
  "/blog/ai-product-design-guide",
  "/blog/how-to-sell-custom-products-online",
  "/blog/print-on-demand-for-beginners",
  "/blog/launch-a-brand-with-no-inventory",
  "/blog/product-page-seo-for-custom-products",
];

type ProductSitemapRow = { id: string; updated_at?: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startedAt = Date.now();
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" || path === "/catalog" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.7,
  }));

  try {
    const supabase = createSupabaseAdmin();
    const productEntries: MetadataRoute.Sitemap = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase
        .from("products")
        .select("id,updated_at")
        .eq("is_active", true)
        .eq("status", "active")
        .is("deleted_at", null)
        .order("id", { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        console.error("[sitemap] product_query_failed", {
          code: error.code,
          offset,
          elapsedMs: Date.now() - startedAt,
        });
        throw new Error(`Sitemap product query failed at offset ${offset}`);
      }

      const products = (data ?? []) as ProductSitemapRow[];
      for (const product of products) {
        if (!product.id) continue;
        const updatedAt = product.updated_at ? new Date(product.updated_at) : null;
        productEntries.push({
          url: `${SITE_URL}/products/${encodeURIComponent(product.id)}`,
          ...(updatedAt && !Number.isNaN(updatedAt.getTime()) ? { lastModified: updatedAt } : {}),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      if (products.length < PAGE_SIZE) break;
    }

    console.info("[sitemap] generated", {
      staticPages: staticEntries.length,
      productPages: productEntries.length,
      elapsedMs: Date.now() - startedAt,
    });
    return [...staticEntries, ...productEntries];
  } catch (error) {
    console.error("[sitemap] generation_failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      elapsedMs: Date.now() - startedAt,
    });
    // Do not silently return a sitemap without products.
    // The server error is visible in deployment logs/monitoring.
    throw error;
  }
}
