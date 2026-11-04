import type { MetadataRoute } from "next";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = "https://www.ryfio.com";
const PAGE_SIZE = 500;

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
      if (error) throw error;
      const products = (data ?? []) as ProductSitemapRow[];
      for (const product of products) {
        if (!product.id) continue;
        productEntries.push({
          url: `${SITE_URL}/products/${encodeURIComponent(product.id)}`,
          ...(product.updated_at ? { lastModified: new Date(product.updated_at) } : {}),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      if (products.length < PAGE_SIZE) break;
    }
    return [...staticEntries, ...productEntries];
  } catch (error) {
    console.error("SITEMAP_PRODUCT_FETCH_FAILED", error);
    return staticEntries;
  }
}
