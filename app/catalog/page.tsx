import { unstable_cache } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import CatalogClient from "./CatalogClient";

export const revalidate = 60;

// Fetch the same public product fields used by the existing catalog, server-side.
const getCatalogProducts = unstable_cache(async (category: string) => {
  const supabase = createSupabaseAdmin();
  let query = supabase.from("products").select(`
    id, title, price, currency, image, images, category,
    product_colors (color, color_hex, thumbnail, product_variants (size, stock))
  `)
    .eq("is_active", true)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(60);

  if (category && category.toLowerCase() !== "all") {
    query = query.eq("category", category);
  }
  const { data, error } = await query;
  if (error) {
    console.error("CATALOG_SSR_ERROR", { code: error.code });
    throw new Error("Unable to load catalog");
  }
  return (data ?? []).map((product) => {
    const colors = (product.product_colors ?? []) as Array<{
      color?: string | null;
      color_hex?: string | null;
      thumbnail?: string | null;
      product_variants?: Array<{ size?: string | null; stock?: number | null }>;
    }>;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      image: product.image,
      images: product.images,
      category: product.category,
      colors: colors.map(({ color, color_hex, thumbnail }) => ({ color, color_hex, thumbnail })),
      variants: colors.flatMap((color) => color.product_variants ?? []),
    };
  });
}, ["ryfio-catalog-ssr-v1"], { revalidate: 60 });

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  const requested = searchParams?.category;
  const category = typeof requested === "string" && requested.length <= 80
    && !/[<>%_,()]/.test(requested) ? requested.trim() : "";
  const products = await getCatalogProducts(category);
  return <CatalogClient initialProducts={products} />;
}
