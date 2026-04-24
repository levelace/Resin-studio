import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse resin art, gift boxes, custom T-shirts, mugs, and scented candles. Pay online with card or Mobile Money.",
};

export const revalidate = 60;

const categoryLabels: Record<string, string> = {
  resin: "Resin art",
  "gift-box": "Gift boxes & bags",
  tshirt: "Custom T-shirts",
  mug: "Mugs",
  candle: "Scented candles",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const category = searchParams?.category;
  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="container py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold md:text-5xl">
          {category ? categoryLabels[category] ?? "Shop" : "Shop all"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          All prices in GHS. Delivery across Ghana, pay with card or Mobile Money at checkout.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <CategoryLink slug="" current={category}>All</CategoryLink>
        {Object.entries(categoryLabels).map(([slug, label]) => (
          <CategoryLink key={slug} slug={slug} current={category}>{label}</CategoryLink>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No products in this category yet. Check back soon, or{" "}
          <Link href="/contact" className="text-primary underline">ask for a custom order</Link>.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const images = JSON.parse(p.images) as string[];
            return (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl border bg-secondary/30">
                  <Image
                    src={images[0] ?? "/placeholder.svg"}
                    alt={p.title}
                    fill
                    sizes="(min-width:1280px) 22vw, (min-width:640px) 40vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.featured && (
                    <Badge className="absolute left-3 top-3">Featured</Badge>
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{categoryLabels[p.category] ?? p.category}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(p.priceMinor, p.currency)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategoryLink({ slug, current, children }: { slug: string; current?: string; children: React.ReactNode }) {
  const active = slug === "" ? !current : current === slug;
  return (
    <Link
      href={slug ? `/shop?category=${slug}` : "/shop"}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-secondary"
      }`}
    >
      {children}
    </Link>
  );
}
