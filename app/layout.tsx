import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axiaradar.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
      <body>{children}</body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
