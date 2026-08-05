import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/book`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/sign-pay`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/event`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
