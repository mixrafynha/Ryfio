import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../_components";
import { getPost } from "../_content";

const post = getPost("best-print-on-demand-products");

export const metadata: Metadata = {
  title: "Best Print-on-Demand Products to Sell in 2026 | Ryfio",
  description: "A practical list of products that are easier to position, design, and sell for new print-on-demand brands.",
  alternates: { canonical: "https://www.ryfio.com/blog/best-print-on-demand-products" },
  openGraph: {
    title: "Best Print-on-Demand Products to Sell in 2026 | Ryfio",
    description: "A practical list of products that are easier to position, design, and sell for new print-on-demand brands.",
    url: "https://www.ryfio.com/blog/best-print-on-demand-products",
    siteName: "Ryfio",
    type: "article",
    images: [{ url: "/og-image.webp", width: 1672, height: 941, alt: "Best Print-on-Demand Products to Sell in 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Print-on-Demand Products to Sell in 2026 | Ryfio",
    description: "A practical list of products that are easier to position, design, and sell for new print-on-demand brands.",
    images: ["/og-image.webp"],
  },
};

export default function Page() {
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
