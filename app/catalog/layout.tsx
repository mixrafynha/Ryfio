import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Your Own T-Shirts & Hoodies",
  description:
    "Explore customizable t-shirts, hoodies and clothing. Add your artwork, text or AI-generated designs and create something uniquely yours.",
  keywords: [
    "custom products",
    "print on demand products",
    "blank t-shirts",
    "custom hoodies",
    "custom clothing",
    "RYFIO catalogue",
  ],
  openGraph: {
    title: "Create Custom Products That Sell | RYFIO",
    description:
      "Choose premium blank products, customise your design and launch your next product with RYFIO.",
    type: "website",
    url: "/catalog",
  },
  alternates: {
    canonical: "/catalog",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
