import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { unstable_cache } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 60;
const siteUrl = "https://www.ryfio.com";
const safeId = (id: string) => id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);

const getProduct = unstable_cache(async (id: string) => {
  if (!safeId(id)) return null;
  const { data, error } = await createSupabaseAdmin()
    .from("products")
    .select("id, title, description, price, currency, image, images, category")
    .eq("id", id)
    .eq("is_active", true)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();
  if (error) {
    console.error("PUBLIC_PRODUCT_SSR_ERROR", { code: error.code });
    throw new Error("Unable to load product");
  }
  return data;
}, ["ryfio-public-product-v1"], { revalidate: 60 });

const summary = (text: string | null | undefined, title: string) =>
  (text?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ||
    `Customize ${title} with your own design on Ryfio.`).slice(0, 155);

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  const description = summary(product.description, product.title);
  const canonical = `/products/${encodeURIComponent(product.id)}`;
  const image = typeof product.image === "string" && /^https?:\/\//.test(product.image)
    ? product.image : undefined;
  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      url: canonical,
      ...(image ? { images: [{ url: image, alt: product.title }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const price = product.price == null ? null : Number(product.price);
  const validPrice = price !== null && Number.isFinite(price) && price >= 0;
  const currency = /^[A-Z]{3}$/.test(product.currency || "") ? product.currency : "EUR";
  const image = typeof product.image === "string" && /^https?:\/\//.test(product.image)
    ? product.image : undefined;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: summary(product.description, product.title),
    url: `${siteUrl}/products/${encodeURIComponent(product.id)}`,
    ...(image ? { image: [image] } : {}),
    ...(validPrice ? { offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${encodeURIComponent(product.id)}`,
      price: price!.toFixed(2),
      priceCurrency: currency,
    } } : {}),
  };
  return (
    <main className="min-h-screen overflow-hidden bg-[#03030a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
      }} />
      <section className="relative mx-auto flex min-h-screen max-w-4xl items-center px-4 py-14 md:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.24),transparent_32%),linear-gradient(180deg,#03030a_0%,#050511_55%,#03030a_100%)]" />
        <div className="relative w-full text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-purple-300">
            <Sparkles size={14} />
            Real product
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-[-0.06em] sm:text-6xl">
            {product.title}
          </h1>
          <Link
            href={`/dashboard/product/${product.id}`}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-[0_0_34px_rgba(168,85,247,0.34)] transition hover:scale-[1.02]"
          >
            Design now
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
