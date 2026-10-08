import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../_components";
import { getPost } from "../_content";

const post = getPost("how-to-design-a-custom-tshirt");

export const metadata: Metadata = {
  title: "How to Design a Custom T-Shirt That Looks Professional | Ryfio",
  description: "Design principles for custom t-shirts that look clean, wearable, and ready to sell online.",
  alternates: { canonical: "https://www.ryfio.com/blog/how-to-design-a-custom-tshirt" },
  openGraph: {
    title: "How to Design a Custom T-Shirt That Looks Professional | Ryfio",
    description: "Design principles for custom t-shirts that look clean, wearable, and ready to sell online.",
    url: "https://www.ryfio.com/blog/how-to-design-a-custom-tshirt",
    siteName: "Ryfio",
    type: "article",
    images: [{ url: "/og-image.webp", width: 1672, height: 941, alt: "How to Design a Custom T-Shirt That Looks Professional" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Design a Custom T-Shirt That Looks Professional | Ryfio",
    description: "Design principles for custom t-shirts that look clean, wearable, and ready to sell online.",
    images: ["/og-image.webp"],
  },
};

export default function Page() {
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
