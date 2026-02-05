import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://krouin-ipsum.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
