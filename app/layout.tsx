import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4YVEDRYTMH"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4YVEDRYTMH');`}
        </Script>
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
                      "name": "Where do Ratebench's numbers come from?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ratebench v1 derives every benchmark from public BLS OEWS (Occupational Employment and Wage Statistics) data through a documented freelance markup ladder. BLS publishes employee wage percentiles by occupation; Ratebench applies a transparent multiplier (1.4x at P25 → 2.7x at P90) to estimate freelance equivalents. Full methodology is published at ratebench.app/methodology. Real freelancer submissions replace these estimates as contributors join."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Why does BLS data alone not work for freelancers?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "BLS OEWS surveys W-2 employees only — it explicitly excludes self-employed workers and most independent contractors. For freelancers, BLS gives a useful floor (the wage equivalent of a full-time role) but understates real freelance rates because freelancers must cover benefits, employer payroll taxes, business overhead, downtime, and a profit margin. The Ratebench markup ladder estimates that gap; contributor submissions will eventually replace the model with measured freelance data."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does Ratebench's markup ladder work?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The Ratebench freelance markup ladder applies a different multiplier at each percentile of the BLS wage distribution. P25 (entry-level freelance) uses a 1.4x multiplier; P50 (median) uses 1.7x; P75 (proven freelancers) uses 2.1x; P90 (specialists with leverage) uses 2.7x. The ladder increases with percentile because pricing power scales with experience, reputation, and specialization. The model sits inside the 1.5x–3x range that Robert Half, Toptal, and Codementor consistently cite for freelance markup over equivalent W-2 wages."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How do I know if I'm undercharging as a freelancer?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Find your skill and tier on Ratebench. If your current rate is below the P50 (median) for your tier, you may be leaving money on the table. The recommended freelance band is P50-P75, which is where most experienced practitioners with 3+ years of freelance reputation should land. P25 is typically entry-level or agency-mediated rates; P90+ requires specialty leverage. Note: v1 estimates are BLS-derived; contributor submissions will refine them."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Why is contributor data N=0 right now?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ratebench launches as a methodology and a public commitment to build a real freelancer rate database — not as a finished product. The first 50–500 contributor submissions will validate (or correct) the BLS-derived estimates and unlock tier-specific medians, then MSA-level breakouts. Submitting your real rate via /contribute earns full Pro access while you contribute, no subscription required."
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
