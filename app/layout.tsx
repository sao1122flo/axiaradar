import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ratebench.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ratebench — Charge what you're worth, not less",
  description:
    "Real market data on what clients pay independent designers, developers, photographers, and writers — by city, by skill, by experience level. Stop guessing. Stop leaving money behind.",
  keywords: [
    "freelance rates",
    "freelance rate intelligence",
    "hourly rate",
    "contract rates",
    "BLS OEWS",
    "UX designer rates",
    "developer rates",
    "photographer rates",
    "copywriter rates",
    "stop undercharging",
  ],
  authors: [{ name: "Ratebench" }],
  creator: "Ratebench",
  publisher: "Ratebench",
  openGraph: {
    title: "Ratebench — Charge what you're worth, not less",
    description:
      "Real market data on what clients pay independent designers, developers, photographers, and writers — by city, by skill, by experience level. Stop guessing. Stop leaving money behind.",
    url: SITE_URL,
    siteName: "Ratebench",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Ratebench — Freelance rate intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratebench — Charge what you're worth, not less",
    description:
      "Real market data on what clients pay. Stop guessing. Stop leaving money behind.",
  },
  alternates: {
    canonical: SITE_URL,
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
          src="https://www.googletagmanager.com/gtag/js?id=G-4YVEDRYTMH"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-4YVEDRYTMH');`,
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
                  "@id": "https://ratebench.app/#organization",
                  "name": "Ratebench",
                  "url": "https://ratebench.app",
                  "logo": "https://ratebench.app/icon.png",
                  "description": "Freelance rate intelligence for independent professionals. Real market percentile data sourced from BLS, job listings, and verified freelancer reports. Charge what you're worth, not less.",
                  "founder": {
                    "@type": "Person",
                    "name": "Sergio Ordonez",
                    "jobTitle": "Founder",
                    "sameAs": ["https://x.com/Sergioordonez22"]
                  },
                  "foundingDate": "2026",
                  "knowsAbout": ["freelance rates", "pricing transparency", "labor market data", "BLS OEWS", "rate benchmarks"],
                  "sameAs": [
                    "https://twitter.com/ratebench",
                    "https://linkedin.com/company/ratebench"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ratebench.app/#website",
                  "url": "https://ratebench.app",
                  "name": "Ratebench",
                  "description": "Real market data on what clients pay independent designers, developers, photographers, and writers — by city, by skill, by experience level. Stop guessing. Stop leaving money behind.",
                  "publisher": { "@id": "https://ratebench.app/#organization" },
                  "inLanguage": "en-US"
                },
                {
                  "@type": "Dataset",
                  "@id": "https://ratebench.app/#dataset",
                  "name": "Ratebench Freelance Rate Benchmarks",
                  "description": "Percentile-based freelance rate data (P25/P50/P75/P90) for major freelance occupations across US metropolitan areas. Blends BLS OEWS, scraped job listings, and contributor-submitted real rates.",
                  "url": "https://ratebench.app",
                  "creator": { "@id": "https://ratebench.app/#organization" },
                  "license": "https://ratebench.app/terms",
                  "keywords": "freelance rates, hourly rates, contract rates, UX designer rates, developer rates, photographer rates, copywriter rates, brand designer rates",
                  "spatialCoverage": "United States",
                  "temporalCoverage": "2024/.."
                },
                {
                  "@type": "Product",
                  "@id": "https://ratebench.app/#product",
                  "name": "Ratebench Pro",
                  "description": "Full distribution access to freelance rate benchmarks. Unlimited queries, quarterly trend alerts, PDF reports, historical trends.",
                  "brand": { "@id": "https://ratebench.app/#organization" },
                  "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "USD",
                    "lowPrice": "0",
                    "highPrice": "9",
                    "offerCount": "3"
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://ratebench.app/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "How do I know if I'm undercharging as a freelancer?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ratebench shows where your current rate sits in the percentile distribution for your skill and city. If you're below the P50 (median) for similar work, you're likely leaving money on the table. The recommended freelance range targets P55-P75, which is where most experienced mid-level professionals should land. Ratebench's transparent methodology helps you defend a higher rate with real market data."
                      }
                    }
                  ]
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
