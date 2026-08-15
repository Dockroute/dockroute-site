import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: new URL("/changelog", siteUrl).toString() },
    ...source.getPages().map((page) => ({
      url: new URL(page.url, siteUrl).toString(),
    })),
  ];
}
