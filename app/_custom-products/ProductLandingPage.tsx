import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Sparkles, Wand2, Zap } from "lucide-react";

const SITE_URL = "https://www.ryfio.com";

export type ProductLanding = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  primaryKeyword: string;
  image: string;
  imageAlt: string;
  related: { label: string; href: string }[];
  useCases: string[];
  ideas: string[];
  steps: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  ogImage: string;
};

const safeHref = (href: string) => {
  const clean = href.trim().toLowerCase();
  if (clean.startsWith("javascript:") || clean.startsWith("data:")) return "/";
  return href.trim() || "/";
};

const galleryImages = [
  {
    src: "/custom-products/custom-t-shirts.webp",
    alt: "Custom t-shirt with personalized graphic design",
  },
  {
    src: "/custom-products/custom-sweatshirts.webp",
    alt: "Custom hoodie and sweatshirt with personalized printed design",
  },
  {
    src: "/custom-products/custom-mugs.webp",
    alt: "Personalized ceramic mugs with custom graphics",
  },
  {
    src: "/custom-products/custom-tote-bags.webp",
    alt: "Custom canvas tote bag with floral print",
  },
];

export function buildLandingMetadata(page: ProductLanding): Metadata {
  const url = `${SITE_URL}/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
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
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: "Ryfio",
      type: "website",
      images: [{ url: page.ogImage, width: 1200, height: 1600, alt: page.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [page.ogImage],
    },
  };
}

function JsonLd({ page }: { page: ProductLanding }) {
  const url = `${SITE_URL}/${page.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.h1, item: url },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductLandingPage({ page }: { page: ProductLanding }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#03030a] text-white">
      <JsonLd page={page} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(168,85,247,0.24),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(14,165,233,0.15),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(217,70,239,0.12),transparent_34%)]"
      />

      <section className="relative mx-auto grid w-full max-w-[1600px] gap-8 px-4 pb-12 pt-20 sm:px-6 md:pb-16 md:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12 lg:pt-28">
        <div className="text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-purple-300 shadow-[0_0_34px_rgba(168,85,247,0.12)] backdrop-blur-xl">
            <Sparkles size={14} aria-hidden="true" />
            {page.eyebrow}
          </div>

          <h1
            className="mx-auto max-w-5xl font-[var(--font-logo)] text-[34px] font-normal uppercase leading-[0.95] tracking-[-0.025em] text-white sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl"
            style={{ fontFamily: "var(--font-logo)" }}
          >
            {page.h1}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-white/64 sm:text-base md:text-lg lg:mx-0">
            {page.intro}
          </p>

          <div className="mt-7 flex justify-center lg:justify-start">
            <Link
              href={safeHref("/catalog")}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 px-7 text-sm font-black text-white shadow-[0_0_34px_rgba(168,85,247,0.34)] transition active:scale-[0.98] sm:text-base md:hover:scale-[1.02]"
            >
              Browse {page.primaryKeyword}
              <Zap size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-2xl sm:p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-black/25">
              <Image
                src={page.image}
                alt={page.imageAlt}
                fill
                priority
                quality={82}
                sizes="(max-width: 768px) 92vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">
                  {page.primaryKeyword}
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  Create online with artwork, text or AI-generated graphics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-[0.82fr_1fr] lg:gap-5">
          <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] shadow-[0_26px_80px_rgba(0,0,0,0.28)] sm:min-h-[680px] lg:min-h-[760px]">
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-4 lg:grid-rows-[0.92fr_1fr] lg:gap-5">
            <div className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] shadow-[0_26px_80px_rgba(0,0,0,0.22)] sm:min-h-[360px]">
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                fill
                sizes="(max-width: 1024px) 92vw, 54vw"
                className="object-cover"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
              {galleryImages.slice(2).map((image) => (
                <div
                  key={image.src}
                  className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] shadow-[0_26px_80px_rgba(0,0,0,0.22)] sm:min-h-[380px]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 27vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          {page.useCases.map((item) => (
            <article key={item} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <CheckCircle2 className="mb-4 text-purple-300" size={22} aria-hidden="true" />
              <h2 className="text-lg font-black text-white">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Build a personalized product around a clear idea, brand, gift, event or store concept.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-300">
            Design Your Own
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
            Design Your Own {page.eyebrow}
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Start with a product, add original artwork, upload a logo, write a phrase or use AI-generated graphics. Ryfio keeps the creation process simple so the page works for first-time creators and for brands testing new ideas.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {page.ideas.map((idea) => (
            <article key={idea} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="text-base font-black text-white">{idea}</h3>
              <p className="mt-2 text-sm leading-6 text-white/56">
                Use clear artwork, balanced placement and readable text so the final design looks intentional.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            How to Create Custom {page.eyebrow}
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {page.steps.map((step, index) => (
              <article key={step} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-sm font-black text-purple-200">
                  {index + 1}
                </div>
                <h3 className="text-base font-black text-white">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-12">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Why Create Custom {page.eyebrow} With Ryfio
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
            Ryfio combines a clean product workflow with AI-assisted design tools, so you can move from idea to preview without inventory, complex setup or heavy software.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.related.map((link) => (
              <Link
                key={link.href}
                href={safeHref(link.href)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/[0.08] hover:text-white"
              >
                {link.label}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          {page.benefits.map((benefit) => (
            <article key={benefit} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <Wand2 className="mt-1 shrink-0 text-fuchsia-300" size={20} aria-hidden="true" />
              <div>
                <h3 className="text-base font-black text-white">{benefit}</h3>
                <p className="mt-1 text-sm leading-6 text-white/56">
                  Keep the process focused while building something polished enough to order, test or sell.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-4 py-12 pb-20 sm:px-6 lg:px-12">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white">
          Custom {page.eyebrow} FAQ
        </h2>
        <div className="mt-6 grid gap-4">
          {page.faqs.map((faq) => (
            <article key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="text-base font-black text-white">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
