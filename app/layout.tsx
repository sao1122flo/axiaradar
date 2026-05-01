import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axiaradar.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Axia — Freelance rate intelligence",
  description:
    "What clients actually pay independent designers, developers, photographers, and writers — by city, by skill, by experience level.",
  openGraph: {
    title: "Axia — Freelance rate intelligence",
    description:
      "Real market data on what clients pay independent professionals.",
    url: SITE_URL,
    siteName: "Axia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axia — Freelance rate intelligence",
    description:
      "What clients actually pay. Not a calculator. The actual percentiles.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WFT3Z7DFLY"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-WFT3Z7DFLY');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://axiaradar.com/#organization",
                  "name": "Axia",
                  "url": "https://axiaradar.com",
                  "description": "Freelance rate intelligence — real market data on what clients pay independent designers, developers, photographers, copywriters, and brand designers.",
                  "founder": {
                    "@type": "Person",
                    "name": "Sergio Ordonez",
                    "jobTitle": "Founder",
                    "sameAs": ["https://x.com/Sergioordonez22"]
                  },
                  "foundingDate": "2026",
                  "knowsAbout": ["freelance rates", "pricing transparency", "labor market data", "BLS OEWS", "rate benchmarks"]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://axiaradar.com/#website",
                  "url": "https://axiaradar.com",
                  "name": "Axia",
                  "description": "Freelance rate intelligence",
                  "publisher": { "@id": "https://axiaradar.com/#organization" },
                  "inLanguage": "en-US"
                },
                {
                  "@type": "Dataset",
                  "@id": "https://axiaradar.com/#dataset",
                  "name": "Axia Freelance Rate Benchmarks",
                  "description": "Percentile-based freelance rate data (P25/P50/P75/P90) for major freelance occupations across US metropolitan areas. Blends BLS OEWS, scraped job listings, and contributor-submitted real rates.",
                  "url": "https://axiaradar.com",
                  "creator": { "@id": "https://axiaradar.com/#organization" },
                  "license": "https://axiaradar.com/terms",
                  "keywords": "freelance rates, hourly rates, contract rates, UX designer rates, developer rates, photographer rates, copywriter rates, brand designer rates",
                  "spatialCoverage": "United States",
                  "temporalCoverage": "2024/.."
                },
                {
                  "@type": "Product",
                  "@id": "https://axiaradar.com/#product",
                  "name": "Axia Pro",
                  "description": "Full distribution access to freelance rate benchmarks. Unlimited queries, quarterly trend alerts, PDF reports, historical trends.",
                  "brand": { "@id": "https://axiaradar.com/#organization" },
                  "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "USD",
                    "lowPrice": "0",
                    "highPrice": "9",
                    "offerCount": "3"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
