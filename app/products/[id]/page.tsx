import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductClient from "@/app/dashboard/product/[id]/ProductClient";
import BackButton from "@/app/dashboard/product/[id]/BackButton";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { unstable_cache } from "next/cache";

export const revalidate = 60;
const SITE_URL = "https://www.ryfio.com";
const validId = (id: string) => Boolean(id) && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);

const normalize = (v: any) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

const PRODUCT_SELECT_FIELDS = [
  "id",
  "title",
  "description",
  "price",
  "currency",
  "discount_price",
  "image",
  "images",
  "category",
  "slug",
  "position",
  "collection",
  "is_new",
  "is_hot",
  "is_featured",
  "status",
  "rating",
  "sales_count",
  "audience",
  "created_at",
].join(", ");

const COLOR_SELECT_FIELDS = [
  "id",
  "product_id",
  "color",
  "color_hex",
  "mockup_front",
  "mockup_back",
  "thumbnail",
  "position",
].join(", ");

const VARIANT_SELECT_FIELDS = [
  "id",
  "product_color_id",
  "name",
  "size",
  "stock",
  "price",
  "sku",
].join(", ");

async function getProduct(supabase: ReturnType<typeof createSupabaseAdmin>, id: string) {
  try {
    if (!id) return null;

    const productStageStartedAt = Date.now();
    console.info("[product-perf] product_start");
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(PRODUCT_SELECT_FIELDS)
      .eq("id", id)
      .eq("is_active", true)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();
    console.info("[product-perf] product_done durationMs=" + (Date.now() - productStageStartedAt));

    if (productError || !product) {
      console.error("PRODUCT ERROR:", productError?.message ?? "Product not found");
      return null;
    }
    const productRow = product as Record<string, any>;

    const colorsStageStartedAt = Date.now();
    console.info("[product-perf] colors_start");
    const { data: colorsData, error: colorsError } = await supabase
      .from("product_colors")
      .select(COLOR_SELECT_FIELDS)
      .eq("product_id", productRow.id)
      .order("position", { ascending: true });
    console.info(
      "[product-perf] colors_done durationMs=" +
        (Date.now() - colorsStageStartedAt) +
        " rows=" +
        (colorsData?.length ?? 0)
    );

    if (colorsError) {
      console.error("COLORS ERROR:", colorsError.message);
      return null;
    }

    const colors = (colorsData || []).map((color: any) => ({
      id: color.id,
      product_id: color.product_id,
      color: color.color,
      color_hex: color.color_hex || null,
      mockup_front: color.mockup_front,
      mockup_back: color.mockup_back,
      thumbnail: color.thumbnail,
      position: color.position,
    }));

    const colorIds = colors.map((color: any) => color.id);

    let variants: any[] = [];

    if (colorIds.length > 0) {
      const variantsStageStartedAt = Date.now();
      console.info("[product-perf] variants_start rows=" + colorIds.length);
      const { data: variantsData, error: variantsError } = await supabase
        .from("product_variants")
        .select(VARIANT_SELECT_FIELDS)
        .in("product_color_id", colorIds);
      console.info(
        "[product-perf] variants_done durationMs=" +
          (Date.now() - variantsStageStartedAt) +
          " rows=" +
          (variantsData?.length ?? 0)
      );

      if (variantsError) {
        console.error("VARIANTS ERROR:", variantsError.message);
        return null;
      }

      const colorsById = new Map(colors.map((color: any) => [color.id, color]));

      variants = (variantsData || []).map((variant: any) => {
        const color = colorsById.get(variant.product_color_id);

        return {
          id: variant.id,
          product_id: productRow.id,
          product_color_id: variant.product_color_id,
          name: variant.name ?? null,
          size: normalize(variant.size),
          stock: Number(variant.stock ?? 0),
          price: variant.price != null ? Number(variant.price) : null,
          sku: variant.sku ?? null,
          color: color?.color || null,
          color_hex: color?.color_hex || null,
        };
      });
    }

    const images = Array.isArray(productRow.images)
      ? productRow.images.filter(Boolean)
      : productRow.image
      ? [productRow.image]
      : [];

    const variantPrices = variants
      .map((variant) => variant.price)
      .filter((price): price is number => typeof price === "number");

    const price =
      variantPrices.length > 0 ? Math.min(...variantPrices) : productRow.price;

    const defaultVariant =
      variants.find((variant) => variant.stock > 0) || variants[0] || null;

    return {
      ...productRow,
      // Explicit properties preserve TypeScript inference when Supabase's
      // dynamically constructed select string returns an untyped record.
      id: String(productRow.id),
      title: String(productRow.title ?? ""),
      description: productRow.description as string | null,
      image: productRow.image as string | null,
      currency: productRow.currency as string | null,
      images,
      colors,
      variants,
      price,
      defaultVariant,
    };
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err instanceof Error ? err.message : "Unknown error");
    return null;
  }
}


const getPublicProduct = unstable_cache(async (id: string) => {
  if (!validId(id)) return null;
  return getProduct(createSupabaseAdmin(), id);
}, ["ryfio-public-product-original-ux-v1"], { revalidate: 60 });

const plainText = (value: unknown) => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
type ProductSeoData = { title?: unknown; description?: unknown; category?: unknown };
const TITLE_SUFFIX = " | Ryfio";

const trimAtWordBoundary = (value: string, maxLength = 155) => {
  if (value.length <= maxLength) return value;
  const trimmed = value.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
  return trimmed || value.slice(0, maxLength).trim();
};

const titleFor = (product: ProductSeoData) => {
  const title = plainText(product.title);
  const personalizationEvidence = `${title} ${plainText(product.description)} ${plainText(product.category)}`;
  const hasPersonalizationEvidence = /\b(custom|personalized|personalised|customizable|customisable|personalize|personalise)\b/i.test(
    personalizationEvidence,
  );
  const titleAlreadySignalsPersonalization = /\b(custom|personalized|personalised|customizable|customisable)\b/i.test(title);
  const personalizedTitle = `Personalized ${title}`;

  return !title || !hasPersonalizationEvidence || titleAlreadySignalsPersonalization || personalizedTitle.length + TITLE_SUFFIX.length > 60
    ? title
    : personalizedTitle;
};

const semanticWords = (value: string) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/g, "").replace(/s$/, ""))
    .filter((word) => word.length > 2);

const categoryRepeatsProductType = (title: string, category: string) => {
  const titleWords = semanticWords(title);
  return semanticWords(category).some((categoryWord) =>
    titleWords.some((titleWord) => titleWord === categoryWord || titleWord.startsWith(categoryWord) || categoryWord.startsWith(titleWord)),
  );
};

const descriptionFor = (product: ProductSeoData) => {
  const title = plainText(product.title);
  const category = plainText(product.category);
  const existingDescription = plainText(product.description);

  if (existingDescription.length >= 50) {
    return trimAtWordBoundary(existingDescription);
  }

  const categoryPhrase = category && !categoryRepeatsProductType(title, category)
    ? ` ${category}`
    : "";
  return trimAtWordBoundary(
    `Discover the ${title || "product"}${categoryPhrase} from Ryfio.`,
  );
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getPublicProduct(params.id);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  const url = `${SITE_URL}/products/${encodeURIComponent(product.id)}`;
  const imageCandidates = [product.image, ...(Array.isArray(product.images) ? product.images : [])];
  const image = imageCandidates
    .map((candidate) => {
      if (typeof candidate !== "string") return undefined;
      const normalized = candidate.trim();
      try {
        const parsed = new URL(normalized);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : undefined;
      } catch {
        return undefined;
      }
    })
    .find((candidate): candidate is string => Boolean(candidate));
  const seoTitle = titleFor(product);
  const description = descriptionFor(product);
  return {
    title: seoTitle, description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: { type: "website", url, title: seoTitle, description,
      ...(image ? { images: [{ url: image, alt: plainText(product.title) }] } : {}) },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const product = await getPublicProduct(id);
  if (!product) notFound();
  const amount = Number(product.price);
  const hasPrice = product.price != null && Number.isFinite(amount) && amount >= 0;
  const currency = /^[A-Z]{3}$/.test(String(product.currency ?? "")) ? product.currency : "EUR";
  const image = typeof product.image === "string" && /^https?:\/\//.test(product.image) ? product.image : undefined;
  const url = `${SITE_URL}/products/${encodeURIComponent(id)}`;
  const productImages = product.images
    .filter((candidate: unknown): candidate is string => typeof candidate === "string" && candidate.trim().length > 0)
    .map((candidate: string) => new URL(candidate, SITE_URL).toString());
  const hasKnownStock = Boolean(product.defaultVariant);
  const isInStock = hasKnownStock && Number(product.defaultVariant?.stock) > 0;
  const structuredData = {
    "@context": "https://schema.org", "@type": "Product",
    name: plainText(product.title), description: descriptionFor(product), url,
    ...(productImages.length > 0 ? { image: productImages } : image ? { image: [image] } : {}),
    ...(hasPrice ? {
      offers: {
        "@type": "Offer",
        url,
        price: amount.toFixed(2),
        priceCurrency: currency,
        ...(hasKnownStock ? { availability: `https://schema.org/${isInStock ? "InStock" : "OutOfStock"}` } : {}),
      },
    } : {}),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Catalog", item: `${SITE_URL}/catalog` },
        { "@type": "ListItem", position: 3, name: plainText(product.title), item: url },
      ],
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <main
      className="min-h-screen overflow-x-hidden bg-[#2a2630] text-white"
    >
      <section className="relative min-h-screen bg-transparent">
        {/* HEADER COM A MESMA UX DO NAVBAR, MAS SEM FUNDO DIFERENTE */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#2a2630]/95">
          <div className="relative mx-auto flex max-w-7xl items-center justify-start px-3 py-3 sm:px-5 md:justify-between md:px-6 lg:max-w-none lg:px-12 xl:px-16">
            <Link
              href="/"
              className="group overflow-visible select-none shrink-0 text-white transition active:scale-[0.98] md:hover:opacity-90"
              aria-label="RYFIO home"
            >
              <div className="relative flex items-center">
                <span
                  className="text-[27px] md:text-[40px] uppercase leading-none tracking-[-0.03em] select-none transition-opacity duration-200 group-hover:opacity-90"
                  style={{
                    fontFamily: "var(--font-logo)",
                    textShadow: "0 0 18px rgba(102, 67, 136, 0.35)",
                  }}
                >
                  <span className="ryfio-letter text-white" style={{ animationDelay: "0ms" }}>R</span>
                  <span className="ryfio-letter text-white" style={{ animationDelay: "120ms" }}>Y</span>
                  <span className="ryfio-letter bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent" style={{ animationDelay: "240ms" }}>F</span>
                  <span className="ryfio-letter bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent" style={{ animationDelay: "360ms" }}>I</span>
                  <span className="ryfio-letter bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent" style={{ animationDelay: "480ms" }}>O</span>
                </span>
              </div>
            </Link>

            <BackButton />
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-[3px] pb-5 pt-3 sm:px-4 md:px-6 lg:max-w-none lg:px-12 xl:px-16">
          <ProductClient product={product} images={product.images} id={id} />

        </div>
      </section>
    </main>
    </>
  );
}
