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
      <header className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold md:text-5xl">
          {category ? (
            <>The <span className="text-resin">{(categoryLabels[category] ?? "shop").toLowerCase()}</span> collection</>
          ) : (
            <>Shop <span className="text-resin">all</span></>
          )}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
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
          {products.map((p, idx) => {
            const images = JSON.parse(p.images) as string[];
            return (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="group block animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx, 12) * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-secondary/30 transition-all duration-500 group-hover:border-resin-gold/50 group-hover:shadow-[0_24px_60px_-24px_hsl(var(--resin-pink)/0.55)]">
                  <Image
                    src={images[0] ?? "/placeholder.svg"}
                    alt={p.title}
                    fill
                    sizes="(min-width:1280px) 22vw, (min-width:640px) 40vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-50" />
                  {p.featured && (
                    <Badge className="absolute left-3 top-3 bg-resin-gradient text-primary-foreground border-transparent shadow-[0_6px_16px_-6px_hsl(var(--resin-pink)/0.8)]">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium transition-colors group-hover:text-resin-gold">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{categoryLabels[p.category] ?? p.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-resin-gold">{formatPrice(p.priceMinor, p.currency)}</p>
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
      className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
        active
          ? "border-transparent bg-resin-gradient text-primary-foreground shadow-[0_6px_16px_-6px_hsl(var(--resin-pink)/0.7)]"
          : "border-border bg-background/60 text-muted-foreground backdrop-blur hover:border-resin-gold/50 hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
