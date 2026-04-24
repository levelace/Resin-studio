import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const [products, courses] = await Promise.all([
      prisma.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.course.findMany({ where: { published: true }, select: { slug: true, createdAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...products.map((p) => ({
        url: `${base}/shop/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...courses.map((c) => ({
        url: `${base}/courses/${c.slug}`,
        lastModified: c.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
