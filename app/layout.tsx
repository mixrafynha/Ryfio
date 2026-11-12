import "./globals.css";
import Providers from "./providers";
import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Audiowide } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "600", "700"],
});

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-logo",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "600"],
});

const siteUrl = "https://www.ryfio.com";
const siteName = "Ryfio";
const defaultTitle = "Personalized Gifts & Custom Products | Ryfio";
const defaultDescription =
  "Shop personalized t-shirts, hoodies, mugs and gifts made with your photos, text or AI-generated designs. Create something uniquely yours with Ryfio.";

export const viewport: Viewport = {
  themeColor: "#03030a",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: defaultTitle,
    template: "%s | Ryfio",
  },

  description: defaultDescription,

  keywords: [
    "personalized gifts",
    "custom gifts",
    "personalized products",
    "custom products",
    "custom clothing",
    "custom apparel",
    "personalized t-shirts",
    "custom hoodies",
    "custom mugs",
    "print on demand",
    "AI product design",
    "Ryfio",
  ],

  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "ecommerce",
  applicationName: siteName,

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
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.webp",
        width: 1672,
        height: 941,
        alt: "Ryfio — Create and sell custom products",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.webp"],
  },

  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/icon-192.png`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${audiowide.variable} w-full h-full`}
    >
      <body
        className={`
          ${manrope.className}
          w-full min-h-screen m-0 p-0 bg-white text-gray-900
          antialiased leading-relaxed tracking-tight
          flex flex-col
        `}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Providers>
            <main className="flex-1 w-full">{children}</main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
