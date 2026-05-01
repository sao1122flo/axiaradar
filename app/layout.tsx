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
      </head>
      <body>{children}</body>
    </html>
  );
}
