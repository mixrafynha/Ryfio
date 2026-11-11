import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Headphones,
  ShoppingBag,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Personalized Gifts & Custom Clothing",
  description: "Create personalized t-shirts, hoodies, mugs and gifts with your photos, text or AI-generated designs. Design something unique with Ryfio.",
  alternates: { canonical: "https://www.ryfio.com/" },
};

const CREATE_HREF = "/dashboard/create";
const CATALOG_HREF = "/catalog";

const safeHref = (href: string) => {
  if (typeof href !== "string") return "/";
  const trimmed = href.trim();
  const clean = trimmed.toLowerCase();

  if (
    clean.startsWith("javascript:") ||
    clean.startsWith("data:") ||
    clean.startsWith("vbscript:")
  ) {
    return "/";
  }

  return trimmed || "/";
};

const safeText = (val: unknown) => {
  if (typeof val !== "string") return "";

  return val
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type Product = {
  name: string;
  image: string;
  tag?: string;
  category: string;
  description: string;
};

type CustomProduct = {
  title: string;
  eyebrow: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

const FEATURES: readonly Feature[] = Object.freeze([
  {
    icon: Zap,
    title: "Create with AI",
    desc: "Turn a simple idea into a product concept in seconds.",
  },
  {
    icon: ShoppingBag,
    title: "Made to sell",
    desc: "Premium clothing, accessories and gifts in your style.",
  },
  {
    icon: Truck,
    title: "Zero inventory",
    desc: "Create on demand without buying or storing stock.",
  },
  {
    icon: Headphones,
    title: "Launch faster",
    desc: "A simple workflow built for creators and new brands.",
  },
]);

const PRODUCTS: readonly Product[] = Object.freeze([
  {
    name: "Purple Graphic Tee",
    tag: "NEW",
    category: "Streetwear apparel",
    description: "A cinematic graphic tee made for standout moments.",
    image: "/create/editorial-purple.webp",
  },
  {
    name: "Graphic T-Shirt",
    image: "/create/editorial-sunset.webp",
    category: "Apparel",
    description: "A bold graphic canvas made to stand out.",
  },
  {
    name: "Color Story Tee",
    category: "Apparel",
    description: "Bold color and graphic energy for everyday wear.",
    image: "/create/editorial-color.webp",
  },
  {
    name: "Parkside Graphic Tee",
    category: "Lifestyle apparel",
    description: "A relaxed everyday look with a memorable graphic.",
    image: "/create/editorial-park.webp",
  },
]);

const CUSTOM_PRODUCTS: readonly CustomProduct[] = Object.freeze([
  {
    eyebrow: "Apparel",
    title: "Custom T-Shirts",
    description:
      "Design personalized t-shirts with text, photos, logos or artwork for yourself, your brand or your next drop.",
    cta: "Create Custom T-Shirts",
    href: "/custom-t-shirts",
    image: "/custom-products/custom-t-shirts.webp",
    alt: "Custom t-shirt with personalized graphic design",
  },
  {
    eyebrow: "Apparel",
    title: "Hoodies & Sweatshirts",
    description:
      "Create custom hoodies and sweatshirts with your own artwork, logo or text, ready to wear, gift or sell online.",
    cta: "Create Custom Hoodies",
    href: "/custom-hoodies",
    image: "/custom-products/custom-sweatshirts.webp",
    alt: "Custom hoodie and sweatshirt with personalized printed design",
  },
  {
    eyebrow: "Drinkware",
    title: "Custom Mugs",
    description:
      "Make personalized mugs with photos, text, artwork or AI-generated designs for gifts, collections or stores.",
    cta: "Create Custom Mugs",
    href: "/custom-mugs",
    image: "/custom-products/custom-mugs.webp",
    alt: "Personalized custom mugs with printed designs",
  },
  {
    eyebrow: "Accessories",
    title: "Custom Tote Bags",
    description:
      "Design custom tote bags with your logo, illustration, text or graphics for everyday use and branded merch.",
    cta: "Create Custom Tote Bags",
    href: "/custom-tote-bags",
    image: "/custom-products/custom-tote-bags.webp",
    alt: "Custom tote bags with personalized printed artwork",
  },
]);

const FeatureCard = memo(function FeatureCard({ item }: { item: Feature }) {
  const Icon = item.icon;

  return (
    <div className="flex items-start gap-3 border-b border-white/10 p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6 lg:last:border-r-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
        <Icon size={20} aria-hidden="true" />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-black tracking-tight text-white sm:text-base">
          {safeText(item.title)}
        </h3>

        <p className="text-xs leading-relaxed text-white/52 sm:text-sm">
          {safeText(item.desc)}
        </p>
      </div>
    </div>
  );
});

const ProductCard = memo(function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <Link
      href={safeHref(CATALOG_HREF)}
      className="product-editorial-card group relative mx-auto block h-[360px] w-full overflow-hidden rounded-none bg-black/20 transition duration-700 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(168,85,247,0.22)] sm:h-[700px] lg:h-[760px]"
    >
      {product.tag && (
        <div className="absolute left-3 top-3 z-20 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 px-2.5 py-1 text-[9px] font-black sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
          {safeText(product.tag)}
        </div>
      )}

      <Image
        src={product.image}
        alt={safeText(product.name)}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition duration-[1400ms] ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#08050d] via-[#08050d]/35 to-transparent" />
      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.38),transparent_52%)]" />

    </Link>
  );
});

const CustomProductCard = memo(function CustomProductCard({
  product,
  priority,
}: {
  product: CustomProduct;
  priority: boolean;
}) {
  return (
    <article className="group relative h-[504px] min-w-[86vw] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.3)] transition duration-700 hover:-translate-y-1 hover:border-fuchsia-300/35 hover:shadow-[0_34px_90px_rgba(168,85,247,0.2)] sm:h-[612px] sm:min-w-[52vw] lg:h-[648px] lg:min-w-0 xl:h-[684px]">
      <Image
        src={product.image}
        alt={safeText(product.alt)}
        fill
        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 25vw"
        className="object-cover transition duration-[1400ms] ease-out group-hover:scale-105"
        priority={priority}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/58 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
          {safeText(product.eyebrow)}
        </p>
        <h3 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)] sm:text-3xl">
          {safeText(product.title)}
        </h3>
        <p className="max-w-[28rem] pr-12 text-sm font-semibold leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
          {safeText(product.description)}
        </p>
        <Link
          href={safeHref(product.href)}
          aria-label={safeText(product.cta)}
          className="absolute bottom-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-[#100a18] sm:bottom-6 sm:right-6"
        >
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
});

function CustomProductsShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#110b1a] pb-16 pt-24 text-white sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_-6%_86%,rgba(124,58,237,0.28),transparent_25%),radial-gradient(circle_at_104%_70%,rgba(168,85,247,0.28),transparent_24%),linear-gradient(180deg,#130d1d_0%,#0e0916_100%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 overflow-hidden">
        <svg
          className="absolute left-1/2 top-0 h-24 w-[120vw] -translate-x-1/2"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 28 C 185 82 305 4 488 42 C 675 82 792 52 945 31 C 1110 8 1274 64 1440 29"
            fill="none"
            stroke="url(#customProductsWave)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 28 C 185 82 305 4 488 42 C 675 82 792 52 945 31 C 1110 8 1274 64 1440 29"
            fill="none"
            stroke="rgba(217,70,239,0.36)"
            strokeWidth="14"
            strokeLinecap="round"
            filter="blur(12px)"
          />
          <defs>
            <linearGradient id="customProductsWave" x1="0" x2="1440" y1="0" y2="0">
              <stop stopColor="#a855f7" />
              <stop offset="0.5" stopColor="#f0abfc" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative mx-auto max-w-none px-4 md:px-8 lg:px-6">
        <div className="mx-auto mb-7 grid max-w-5xl items-end gap-5 text-center sm:mb-8">
          <div>
            <h2
              aria-label="Custom products you can create"
              className="mx-auto max-w-full font-[var(--font-logo)] text-[20px] font-normal uppercase leading-[0.95] tracking-[0] text-white min-[390px]:text-[21px] sm:max-w-4xl sm:text-[42px] lg:text-[46px] xl:text-[52px]"
              style={{ fontFamily: "var(--font-logo)" }}
            >
              <span className="block whitespace-nowrap">Custom products you can</span>
              <span className="block bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                create
              </span>
            </h2>
          </div>
          <p className="mx-auto max-w-md text-xs font-medium leading-relaxed text-white/58 sm:text-sm lg:max-w-none lg:whitespace-nowrap lg:text-base">
            Design t-shirts, hoodies, sweatshirts, mugs and tote bags with your artwork, text or AI-generated graphics.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:gap-5 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {CUSTOM_PRODUCTS.map((product, index) => (
            <CustomProductCard
              key={product.title}
              product={product}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#1d1726] text-white">
      <section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(216,180,254,0.32),transparent_25%),radial-gradient(circle_at_58%_55%,rgba(244,114,182,0.18),transparent_22%),linear-gradient(180deg,#332044_0%,#1d1726_55%,#18131f_100%)]" />

  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,23,38,0.25)_0%,#1d1726_100%)] lg:bg-[linear-gradient(90deg,#1d1726_0%,rgba(29,23,38,0.94)_34%,rgba(29,23,38,0.45)_72%,#1d1726_100%)]" />

  <div className="relative mx-auto grid w-full max-w-[1800px] items-center gap-2 px-4 pb-3 pt-7 sm:pt-12 md:px-10 lg:min-h-[760px] lg:grid-cols-2 lg:gap-12 lg:px-16 lg:pb-4 lg:pt-20 xl:px-20">
    <div className="hero-copy-enter z-10 order-1 mt-0 text-center sm:-mt-10 lg:-mt-54 lg:text-left">
      
      <h1
        className="relative mb-[48px] font-[var(--font-logo)] text-[28px] font-normal uppercase leading-[1.02] tracking-[-0.025em] sm:mb-[74px] sm:text-[39px] sm:leading-[0.98] md:text-[45px] lg:-top-[27px] lg:-translate-x-[10%] lg:translate-y-[20%] lg:whitespace-nowrap lg:text-[48px] xl:text-[50px]"
        style={{ fontFamily: "var(--font-logo)", textShadow: "0 0 14px rgba(102,67,136,.28)" }}
      >
        <span className="text-white">Make it personal. </span>
        <span className="mt-1 block bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-center text-transparent sm:mt-0 sm:inline">Make it yours.</span>
      </h1>

      <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-white/70 sm:text-xl md:text-2xl lg:mx-0 lg:mb-8 lg:translate-x-0 lg:whitespace-nowrap">
        Create personalized clothing and gifts with your photos, text or AI-generated designs.
      </p>

      {/* DESKTOP CTA */}
      <div className="relative top-[73px] hidden items-end justify-start gap-8 lg:flex">
        <div className="flex -translate-y-[15px] flex-col items-start gap-3">
          <Link
            href={safeHref(CATALOG_HREF)}
            className="hero-cta group relative inline-flex items-center justify-center gap-4 overflow-visible rounded-lg px-[3.25rem] py-[1.5rem] text-[1.375rem] font-black text-white shadow-[0_12px_35px_rgba(34,211,238,0.25)] transition duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            Customize Your Product
            <Zap size={20} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-12" />
          </Link>
          <div className="flex items-center gap-2 pl-1 text-xs font-bold text-white/75">
            <span>Personalize before you order</span>
          </div>
        </div>

        <div className="w-[380px] rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-4 shadow-[0_8px_26px_rgba(0,0,0,0.2)] backdrop-blur-xl lg:-translate-y-[10px] lg:translate-x-[calc(20%_+_20px)]">
          <p className="text-sm font-bold leading-6 text-white/80">Preview your personalized design, choose your product options, and continue to the editor when you’re ready.</p>
        </div>
      </div>
    </div>

    <div className="hero-visual-enter relative z-0 order-2 mx-auto -mt-4 flex w-full items-center justify-center sm:-mt-2 lg:justify-end">
      <Link
        href={safeHref(CATALOG_HREF)}
        className="relative block h-[323px] w-full max-w-[722px] p-[10px] sm:h-[409px] md:h-[475px] lg:right-[-10%] lg:h-[532px] lg:w-[969px] lg:max-w-none"
      >
        <div className="relative h-full w-full">
          <Image
            src="/hero3.webp"
            alt="Custom Ryfio product example"
            fill
            priority
            quality={78}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 980px, 1040px"
            className="translate-x-[2%] scale-[1.17] object-contain object-center sm:translate-x-0 sm:scale-[1.16] lg:-translate-x-[2%] lg:scale-[1.235]"
          />

        </div>
      </Link>
    </div>
  </div>

  {/* MOBILE CTA */}
<div className="relative mx-auto w-full max-w-[320px] px-4 pb-6 lg:hidden">
  <Link
    href={safeHref(CATALOG_HREF)}
    className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 px-5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(168,85,247,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
  >
    <Zap size={15} aria-hidden="true" />
    Customize Your Product
  </Link>
</div>

</section>

      <section className="relative mt-0 overflow-hidden bg-[#1d1726] py-0">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 overflow-hidden">
          <svg
            className="absolute left-1/2 top-0 h-24 w-[120vw] -translate-x-1/2"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 28 C 185 82 305 4 488 42 C 675 82 792 52 945 31 C 1110 8 1274 64 1440 29"
              fill="none"
              stroke="url(#createProductsWave)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M0 28 C 185 82 305 4 488 42 C 675 82 792 52 945 31 C 1110 8 1274 64 1440 29"
              fill="none"
              stroke="rgba(217,70,239,0.36)"
              strokeWidth="14"
              strokeLinecap="round"
              filter="blur(12px)"
            />
            <defs>
              <linearGradient id="createProductsWave" x1="0" x2="1440" y1="0" y2="0">
                <stop stopColor="#a855f7" />
                <stop offset="0.5" stopColor="#f0abfc" />
                <stop offset="1" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative mx-auto w-full max-w-none px-0 lg:px-6">
          <h2 className="mb-8 px-4 pt-[100px] text-center font-[var(--font-logo)] text-[22px] font-normal uppercase leading-[0.92] tracking-[-0.015em] text-white min-[420px]:text-2xl sm:text-6xl lg:-translate-y-[20px] lg:whitespace-nowrap lg:px-0 lg:pt-[116px]" style={{ fontFamily: "var(--font-logo)" }}>
            <span className="block whitespace-nowrap">Custom T-Shirt Design</span>
            <span className="block bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">Ideas</span>
          </h2>
          <div className="grid w-full grid-cols-2 gap-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {PRODUCTS.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CustomProductsShowcase />

      <section className="relative overflow-hidden bg-[#1d1726] py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center md:px-8 lg:px-12">
          <h2 className="mb-5 text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl lg:whitespace-nowrap">
            Launch your
            <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent lg:inline">
              next bestseller
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-xl">
            Choose a product, describe your idea and let Ryfio create a custom
            design ready to order or sell online.
          </p>

          <Link
            href={safeHref(CREATE_HREF)}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-8 py-4 text-base font-black text-white transition hover:scale-[1.02] sm:w-auto"
          >
            Create my bestseller
          </Link>

          <p className="mt-5 text-sm text-white/35">
            Free to start • No credit card required
          </p>
        </div>
      </section>
      <style suppressHydrationWarning>{`
        .hero-slide {
          opacity: 0;
          animation: heroCrossfade 12s ease-in-out infinite;
          will-change: opacity;
        }

        .hero-slide-first {
          animation-delay: 0s;
        }

        .hero-slide-second {
          animation-delay: 6s;
        }

        @keyframes heroCrossfade {
          0%, 35% { opacity: 1; }
          48%, 88% { opacity: 0; }
          100% { opacity: 1; }
        }

        .hero-copy-enter {
          animation: heroCopyEnter 900ms cubic-bezier(.22,1,.36,1) both;
        }

        .product-editorial-card {
          animation: productCardReveal 900ms cubic-bezier(.22,1,.36,1) both;
        }

        .product-editorial-card:nth-child(2) { animation-delay: 90ms; }
        .product-editorial-card:nth-child(3) { animation-delay: 180ms; }
        .product-editorial-card:nth-child(4) { animation-delay: 270ms; }

        @keyframes productCardReveal {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-visual-enter {
          animation: heroVisualEnter 1100ms cubic-bezier(.22,1,.36,1) 120ms both;
        }

        .hero-cta {
          background: linear-gradient(135deg, #06b6d4 0%, #6366f1 48%, #a855f7 100%);
          isolation: isolate;
        }

        .hero-cta::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: -18px;
          border-radius: 18px;
          opacity: 0;
          background:
            radial-gradient(circle at 8% 35%, rgba(34,211,238,.9) 0 2px, transparent 3px),
            radial-gradient(circle at 94% 20%, rgba(217,70,239,.9) 0 2px, transparent 3px),
            radial-gradient(circle at 82% 92%, rgba(129,140,248,.9) 0 1.5px, transparent 3px),
            radial-gradient(circle at 18% 90%, rgba(255,255,255,.8) 0 1.5px, transparent 3px);
          transform: scale(.72);
          transition: opacity 220ms ease;
          pointer-events: none;
        }

        .hero-cta:hover {
          box-shadow: 0 16px 45px rgba(34,211,238,.32), 0 0 34px rgba(168,85,247,.28);
        }

        .hero-cta:hover::before {
          opacity: 1;
          animation: heroSpray 700ms cubic-bezier(.22,1,.36,1) both;
        }

        .testimonial-window > span {
          position: absolute;
          inset: 0;
          display: block;
          opacity: 0;
          transform: translateY(12px);
          animation: testimonialFade 24s ease-in-out infinite;
        }

        .testimonial-window > span:nth-child(1) { animation-delay: 0s; }
        .testimonial-window > span:nth-child(2) { animation-delay: 6s; }
        .testimonial-window > span:nth-child(3) { animation-delay: 12s; }
        .testimonial-window > span:nth-child(4) { animation-delay: 18s; }

        @keyframes testimonialFade {
          0%, 5% { opacity: 0; transform: translateY(12px); }
          8%, 20% { opacity: 1; transform: translateY(0); }
          25%, 100% { opacity: 0; transform: translateY(-12px); }
        }

        @keyframes heroSpray {
          0% { transform: scale(.72); filter: blur(1px); }
          65% { transform: scale(1.08); filter: blur(0); }
          100% { transform: scale(1); filter: blur(0); }
        }

        @keyframes heroCopyEnter {
          from { opacity: 0; transform: translateX(-34px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes heroVisualEnter {
          from { opacity: 0; transform: translateX(34px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-slide { animation: none; }
          .hero-slide-first { opacity: 1; }
          .hero-slide-second { opacity: 0; }
          .hero-copy-enter, .hero-visual-enter, .hero-cta::before, .testimonial-window > span, .product-editorial-card { animation: none; }
        .testimonial-window > span:first-child { opacity: 1; transform: none; }

        .testimonial-message {
          animation: testimonialMessageIn 500ms cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes testimonialMessageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        }
      `}</style>
    </main>
  );
}
