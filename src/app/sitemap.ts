import type { MetadataRoute } from "next";
import { bosses } from "@/lib/boss-data";

const SITE_URL = "https://l2bosstracker.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/bosses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ru/bosses`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/uk/bosses`, changeFrequency: "weekly", priority: 0.8 },
    ...bosses.map((b) => ({
      url: `${SITE_URL}/bosses/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
