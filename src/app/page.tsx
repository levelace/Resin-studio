import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Palette, Package, Shirt, Coffee, Flame, GraduationCap, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatPrice, siteConfig } from "@/lib/utils";

export const revalidate = 120;

const categories = [
  { slug: "resin", title: "Resin art", Icon: Palette, blurb: "One-of-a-kind coasters, trays, jewellery, wall art." },
  { slug: "gift-box", title: "Gift boxes & bags", Icon: Package, blurb: "Hand-folded paper boxes and bags for any occasion." },
  { slug: "tshirt", title: "Custom T-shirts", Icon: Shirt, blurb: "Upload your design — DTF printing on premium cotton." },
  { slug: "mug", title: "Mugs", Icon: Coffee, blurb: "Personalised ceramic mugs, dishwasher-safe." },
  { slug: "candle", title: "Scented candles", Icon: Flame, blurb: "Soy-wax candles with natural fragrance blends." },
];

export default async function HomePage() {
  const [featured, galleryPreview] = await Promise.all([
    prisma.product.findMany({
      where: { published: true, featured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryItem.findMany({ take: 6, orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent" />
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center animate-fade-in">
            <Badge variant="outline" className="mb-4 w-fit">Handmade in Accra · Ghana</Badge>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Poured with care.<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Wrapped with intention.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Resin art, custom-printed gifts, scented candles, and thoughtful paper packaging — plus online
              courses for anyone who wants to make their own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/shop">Shop the collection <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/courses">Learn resin art</Link></Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Secure checkout</div>
              <div className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Nationwide delivery</div>
              <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-primary" /> Beginner-friendly</div>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1580651315530-69c8e0903883?auto=format&fit=crop&w=1200&q=80"
              alt="Resin art being poured into a mould"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Shop by category</h2>
            <p className="mt-2 text-muted-foreground">Five collections, endless gift possibilities.</p>
          </div>
          <Button asChild variant="ghost"><Link href="/shop">All products <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ slug, title, Icon, blurb }) => (
            <Link key={slug} href={`/shop?category=${slug}`}>
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{blurb}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-bold md:text-4xl">Featured pieces</h2>
            <Button asChild variant="ghost"><Link href="/shop">Shop all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => {
              const images = JSON.parse(p.images) as string[];
              return (
                <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-xl border">
                    <Image
                      src={images[0] ?? "/placeholder.svg"}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 24vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatPrice(p.priceMinor, p.currency)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery strip */}
      {galleryPreview.length > 0 && (
        <section className="container py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">From the studio</h2>
              <p className="mt-2 text-muted-foreground">Recent work and behind-the-scenes pours.</p>
            </div>
            <Button asChild variant="ghost"><Link href="/gallery">Full gallery <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {galleryPreview.map((g) => (
              <div key={g.id} className="relative aspect-square overflow-hidden rounded-lg border">
                <Image src={g.imageUrl} alt={g.title} fill sizes="(min-width:1024px) 16vw, 33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Students CTA */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-8 md:p-14">
          <Badge className="mb-3" variant="outline">Students area</Badge>
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">Learn to pour your own resin art, at your pace.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Register as a student to unlock video lessons, downloadable PDF guides, and supply checklists.
            New beginner and intermediate courses added every month.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/register">Create a free student account</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/courses">Browse courses</Link></Button>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: siteConfig.name,
            description: siteConfig.description,
            url: siteConfig.url,
            address: { "@type": "PostalAddress", addressCountry: "GH", addressLocality: "Accra" },
            currenciesAccepted: "GHS",
            paymentAccepted: "Mobile Money, Visa, Mastercard",
          }),
        }}
      />
    </>
  );
}
