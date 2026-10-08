import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Pricing & Plans | Ryfio",
  },
  description:
    "Compare plans for creating and selling custom products. Start free and upgrade as your business grows.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing & Plans | Ryfio",
    description:
      "Compare plans for creating and selling custom products. Start free and upgrade as your business grows.",
    url: "/pricing",
    images: [
      {
        url: "/og-image.webp",
        width: 1672,
        height: 941,
        alt: "Ryfio pricing and plans",
      },
    ],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
