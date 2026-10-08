import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../_components";
import { getPost } from "../_content";

const post = getPost("launch-a-brand-with-no-inventory");

export const metadata: Metadata = {
  title: "How to Launch a Brand With No Inventory | Ryfio",
  description: "A lean launch plan for creating a real brand without buying stock, renting storage, or risking money on untested products.",
  alternates: { canonical: "https://www.ryfio.com/blog/launch-a-brand-with-no-inventory" },
  openGraph: {
    title: "How to Launch a Brand With No Inventory | Ryfio",
    description: "A lean launch plan for creating a real brand without buying stock, renting storage, or risking money on untested products.",
    url: "https://www.ryfio.com/blog/launch-a-brand-with-no-inventory",
    siteName: "Ryfio",
    type: "article",
    images: [{ url: "/og-image.webp", width: 1672, height: 941, alt: "How to Launch a Brand With No Inventory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Launch a Brand With No Inventory | Ryfio",
    description: "A lean launch plan for creating a real brand without buying stock, renting storage, or risking money on untested products.",
    images: ["/og-image.webp"],
  },
};

export default function Page() {
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
