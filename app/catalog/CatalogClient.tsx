"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type ApiProduct = {
  id: string;
  title: string;
  price: number | null;
  currency: string | null;
  image: string | null;
  images?: unknown;
  category: string | null;
  is_active?: boolean | null;
  status?: string | null;
  colors?: Array<{ color?: string | null; color_hex?: string | null; thumbnail?: string | null }>;
  variants?: Array<{ size?: string | null; stock?: number | null }>;
};

const CATEGORY_LABELS: Record<string, string> = {
  tshirt: "T-Shirts",
  tshirts: "T-Shirts",
  "t-shirt": "T-Shirts",
  "t-shirts": "T-Shirts",
  t_shirt: "T-Shirts",
  tee: "T-Shirts",
  tees: "T-Shirts",
  hoodie: "Hoodies",
  hoodies: "Hoodies",
  sweatshirt: "Sweatshirts",
  sweatshirts: "Sweatshirts",
  sweat: "Sweatshirts",
  bag: "Bags",
  bags: "Bags",
  tote: "Bags",
  totes: "Bags",
};

const CATEGORY_ALIASES: Record<string, string> = {
  tshirt: "tshirt",
  tshirts: "tshirt",
  "t-shirt": "tshirt",
  "t-shirts": "tshirt",
  t_shirt: "tshirt",
  tee: "tshirt",
  tees: "tshirt",
  hoodie: "hoodie",
  hoodies: "hoodie",
  sweatshirt: "sweatshirt",
  sweatshirts: "sweatshirt",
  sweat: "sweatshirt",
  bag: "bag",
  bags: "bag",
  tote: "bag",
  totes: "bag",
};

const safeText = (val: unknown) => (typeof val === "string" ? val.replace(/<script.*?>.*?<\/script>/gi, "").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "");

const safeHref = (href: string) => {
  if (typeof href !== "string") return "/";
  const clean = href.trim().toLowerCase();
  if (clean.startsWith("javascript:") || clean.startsWith("data:")) return "/";
  return href.trim() || "/";
};

const imageFrom = (product: ApiProduct) => {
  if (typeof product.image === "string" && product.image.trim()) return product.image.trim();
  if (!Array.isArray(product.images)) return "/placeholder.png";
  for (const item of product.images) {
    const url =
      typeof item === "string"
        ? item
        : item && typeof item === "object"
          ? String((item as { url?: unknown; src?: unknown; image?: unknown; image_url?: unknown; publicUrl?: unknown }).url ?? (item as { url?: unknown; src?: unknown; image?: unknown; image_url?: unknown; publicUrl?: unknown }).src ?? (item as { url?: unknown; src?: unknown; image?: unknown; image_url?: unknown; publicUrl?: unknown }).image ?? (item as { url?: unknown; src?: unknown; image?: unknown; image_url?: unknown; publicUrl?: unknown }).image_url ?? (item as { url?: unknown; src?: unknown; image?: unknown; image_url?: unknown; publicUrl?: unknown }).publicUrl ?? "")
          : "";
    if (url.trim()) return url.trim();
  }
  return "/placeholder.png";
};

const imagesFrom = (product: ApiProduct) => {
  const images = Array.isArray(product.images)
    ? product.images.map((item) => typeof item === "string" ? item : item && typeof item === "object" ? String((item as Record<string, unknown>).url ?? (item as Record<string, unknown>).src ?? (item as Record<string, unknown>).image ?? (item as Record<string, unknown>).image_url ?? (item as Record<string, unknown>).publicUrl ?? "") : "").filter(Boolean)
    : [];
  return Array.from(new Set([...(product.image ? [product.image] : []), ...images]));
};

function RotatingProductImage({ product, priority = false }: { product: ApiProduct; priority?: boolean }) {
  const sources = imagesFrom(product);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (sources.length < 2) return;
    let timer: number | undefined;
    let cancelled = false;

    const scheduleNext = () => {
      const delay = 3600 + Math.floor(Math.random() * 3600);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setActiveIndex((current) => {
          const next = Math.floor(Math.random() * (sources.length - 1));
          return next >= current ? next + 1 : next;
        });
        scheduleNext();
      }, delay);
    };

    timer = window.setTimeout(() => {
      setActiveIndex((current) => {
        const next = Math.floor(Math.random() * (sources.length - 1));
        return next >= current ? next + 1 : next;
      });
      scheduleNext();
    }, 1800 + Math.floor(Math.random() * 2600));

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [sources.length]);

  return <Image src={sources[activeIndex] || imageFrom(product)} alt={product.title} fill priority={priority} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw" className="object-contain transition-opacity duration-1000 group-hover:scale-105" />;
}

function ProductMeta({ product }: { product: ApiProduct }) {
  const colors = product.colors?.filter((color) => color.color_hex || color.color).slice(0, 6) ?? [];
  const sizes = Array.from(new Set(product.variants?.map((variant) => variant.size).filter(Boolean) ?? [])).slice(0, 5);
  if (!colors.length && !sizes.length) return null;
  return <div className="mt-4 flex min-h-7 items-center justify-between gap-3">
    {colors.length > 0 && <div className="flex items-center gap-1.5" aria-label={`${colors.length} available colors`}>
      {colors.map((color, index) => <span key={`${color.color}-${index}`} title={color.color || "Available color"} className="h-4 w-4 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: color.color_hex || "#9ca3af" }} />)}
      {product.colors && product.colors.length > colors.length && <span className="ml-1 text-[10px] font-bold text-white/45">+{product.colors.length - colors.length}</span>}
    </div>}
    {sizes.length > 0 && <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">{sizes.join(" · ")}</span>}
  </div>;
}

const formatPrice = (price: number | null, currency: string | null) => {
  if (price == null || !Number.isFinite(Number(price))) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 2,
  }).format(Number(price));
};

export default function CatalogClient({ initialProducts }: { initialProducts: ApiProduct[] }) {
  const [products] = useState<ApiProduct[]>(initialProducts);
  const loading = false;

  const categories = useMemo(() => Array.from(new Set(products.map((product) => {
    const raw = (product.category || "Other").trim().toLowerCase();
    return CATEGORY_ALIASES[raw] || raw;
  }))).sort(), [products]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const visibleProducts = useMemo(() => products
    .filter((product) => activeCategory === "all" || (CATEGORY_ALIASES[(product.category || "other").trim().toLowerCase()] || (product.category || "other").trim().toLowerCase()) === activeCategory)
    .slice()
    .sort((a, b) => {
      const difference = (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
      return sortOrder === "asc" ? difference : -difference;
    }), [products, activeCategory, sortOrder]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1d1726] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(216,180,254,0.32),transparent_25%),radial-gradient(circle_at_58%_55%,rgba(244,114,182,0.18),transparent_22%),linear-gradient(180deg,#332044_0%,#1d1726_55%,#18131f_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(29,23,38,0.25)_0%,#1d1726_100%)] lg:bg-[linear-gradient(90deg,#1d1726_0%,rgba(29,23,38,0.94)_34%,rgba(29,23,38,0.45)_72%,#1d1726_100%)]" />
      <section className="relative overflow-hidden px-4 py-10 md:px-8 lg:px-16 lg:py-14">
        <div className="relative mx-auto max-w-[1600px] py-4 lg:py-8">
          <h1 className="mx-auto max-w-[22rem] whitespace-normal font-[var(--font-logo)] text-center text-[32px] font-normal uppercase leading-[0.94] tracking-[-0.045em] sm:max-w-none sm:whitespace-nowrap sm:text-5xl md:text-[61px]" style={{ fontFamily: "var(--font-logo)" }}>
            <span className="text-white">Custom apparel </span>
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">& clothing</span>
          </h1>

          <p className="mx-auto mt-4 max-w-[22rem] whitespace-normal text-center text-base font-semibold leading-relaxed text-white/82 sm:mt-7 sm:max-w-none sm:whitespace-nowrap sm:text-base md:-translate-y-[10px] md:text-xl">
            Shop T-shirts, hoodies and sweatshirts ready to customize with your own designs, artwork or AI-generated graphics.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-[1800px] px-4 pb-16 md:px-8 lg:px-12">
        {loading ? (
          <div className="relative py-3 sm:py-6">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="h-3 w-28 rounded-full bg-white/[0.08]" />
              <div className="h-10 w-40 rounded-full bg-white/[0.08]" />
            </div>
            <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.045] sm:aspect-[3/4]">
                    <div className="catalog-shimmer absolute inset-0" />
                  </div>
                  <div className="mt-5 h-5 w-3/4 rounded-full bg-white/[0.09]" />
                  <div className="mt-3 h-4 w-1/3 rounded-full bg-white/[0.06]" />
                </div>
              ))}
            </div>
            <div className="mt-12 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
              <Loader2 className="h-4 w-4 animate-spin text-purple-300" />
              Preparing your products
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="grid min-h-[260px] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.025] text-center">
            <div>
              <CheckCircle2 className="mx-auto h-9 w-9 text-white/25" />
              <p className="mt-4 text-lg font-black text-white">No products found</p>
              <p className="mt-2 text-sm font-semibold text-white/40">Try another category.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button onClick={() => setActiveCategory("all")} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${activeCategory === "all" ? "border-white bg-white text-black" : "border-white/20 bg-white/10 text-white/82 hover:border-fuchsia-300/60 hover:bg-white/16 hover:text-white"}`}>All products</button>
                {categories.map((key) => <button key={key} onClick={() => setActiveCategory(key)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${activeCategory === key ? "border-white bg-white text-black" : "border-white/20 bg-white/10 text-white/82 hover:border-fuchsia-300/60 hover:bg-white/16 hover:text-white"}`}>{CATEGORY_LABELS[key] || key}</button>)}
              </div>
              <label className="flex w-full items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-white/78 lg:w-auto lg:justify-start">
                <SlidersHorizontal className="h-4 w-4 text-fuchsia-200" />
                <span className="hidden sm:inline">Sort by</span>
                <span className="relative w-full sm:w-auto">
                  <button type="button" aria-haspopup="listbox" aria-expanded={sortMenuOpen} onClick={() => setSortMenuOpen((open) => !open)} className="flex w-full min-w-0 items-center justify-between gap-4 rounded-full border border-white/25 bg-white/[0.12] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:border-fuchsia-300/70 hover:bg-white/18 sm:min-w-[188px] sm:text-xs">
                    {sortOrder === "asc" ? "Price: low to high" : "Price: high to low"}
                    <ChevronDown className={`h-4 w-4 text-white/85 transition-transform ${sortMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortMenuOpen && <div role="listbox" className="absolute right-0 z-20 mt-2 min-w-[230px] overflow-hidden rounded-2xl border border-white/25 bg-[#1a1224]/95 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                    {[{ value: "asc" as const, label: "Price: low to high" }, { value: "desc" as const, label: "Price: high to low" }].map((option) => <button key={option.value} type="button" role="option" aria-selected={sortOrder === option.value} onClick={() => { setSortOrder(option.value); setSortMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.12em] transition sm:text-xs ${sortOrder === option.value ? "bg-white text-black" : "text-white/85 hover:bg-white/14 hover:text-white"}`}>{option.label}{sortOrder === option.value && <span className="text-purple-600">✓</span>}</button>)}
                  </div>}
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
              {visibleProducts.map((product, index) => (
                    <motion.div key={product.id} initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -28 : 28 }} animate={{ opacity: 1, x: 0 }} transition={reducedMotion ? { duration: 0 } : { duration: 1.15, delay: Math.min(index * 0.07, 0.55), ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={`/dashboard/product/${product.id}`} className="group flex h-full flex-col transition duration-700 hover:-translate-y-2">
                      <div className="relative mb-5 aspect-[4/5] overflow-hidden sm:aspect-[3/4] lg:mb-7">
                        <RotatingProductImage product={product} priority={index < 2} />
                      </div>
                      <h3 className="min-h-[2.5rem] text-base font-black leading-tight text-white sm:text-base lg:text-xl">{safeText(product.title)}</h3>
                      <div className="mt-2 flex min-h-7 items-center justify-between gap-2">
                        <p className="text-sm font-black text-white/90 sm:text-sm lg:text-[0.95rem]">{formatPrice(product.price, product.currency)}</p>
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100 lg:text-[10px]">
                          Unisex
                        </span>
                      </div>
                      <ProductMeta product={product} />
                      <div className="mt-auto pt-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/72 transition group-hover:text-white sm:text-[11px] lg:text-xs">
                        Design now <span className="ml-2 text-cyan-300">↗</span>
                      </div>
                    </Link>
                    </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
