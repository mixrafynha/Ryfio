import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Personalized Products & Custom Gifts | Ryfio",
  description:
    "Shop customizable t-shirts, hoodies, sweatshirts, bags and accessories. Personalize products with your own design, photos or text using Ryfio.",
  keywords: [
    "personalized products",
    "personalized gifts",
    "custom products",
    "custom gifts",
    "personalized t-shirts",
    "custom hoodies",
    "custom mugs",
    "custom tote bags",
    "custom clothing",
    "print on demand products",
    "Ryfio catalog",
  ],
  openGraph: {
    title: "Shop Personalized Products & Custom Gifts | Ryfio",
    description:
      "Choose a customizable product and make it yours with your own design, photos or text using Ryfio.",
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
