import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ratebench.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // NOTE: the landing renders home/about/pricing as internal SPA views via
  // `setPage`, not as separate Next.js routes — so we only expose the root.
  // When/if these become real routes (e.g. app/about/page.tsx), add them here.
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/contribute`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
