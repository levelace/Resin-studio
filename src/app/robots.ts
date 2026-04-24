import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/", "/login", "/register"] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
