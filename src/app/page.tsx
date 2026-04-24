import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Palette, Package, Shirt, Coffee, Flame, GraduationCap, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResinBackdrop } from "@/components/resin-backdrop";
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
        <ResinBackdrop variant="hero" />
        <div className="container grid gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center animate-fade-in-up">
            <Badge
              variant="outline"
              className="mb-5 w-fit border-resin-gold/50 bg-resin-gold/5 text-resin-gold"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Handmade in Accra · Ghana
            </Badge>
            <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl">
              Poured with care.
              <br />
              <span className="text-resin bg-[length:200%_200%] animate-pour">
                Wrapped with intention.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Resin art, custom-printed gifts, scented candles, and thoughtful paper packaging — plus online
              courses for anyone who wants to make their own.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/shop">Shop the collection <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/courses">Learn resin art</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-resin-gold" /> Secure checkout</div>
              <div className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-resin-gold" /> Nationwide delivery</div>
              <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-resin-gold" /> Beginner-friendly</div>
            </div>
          </div>
          <div className="relative animate-fade-in-up [animation-delay:150ms]">
            {/* Gold halo behind the photo frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-resin-gradient opacity-30 blur-3xl"
            />
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-resin-gold/30 shadow-[0_40px_80px_-30px_hsl(var(--resin-pink)/0.6)]">
              <Image
                src="https://images.unsplash.com/photo-1580651315530-69c8e0903883?auto=format&fit=crop&w=1200&q=80"
                alt="Resin art being poured into a mould"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover transition-transform duration-[2000ms] hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <div className="resin-divider container" />

      {/* Categories */}
      <section className="container py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold md:text-4xl">
              Shop by <span className="text-resin">category</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Five collections, endless gift possibilities.</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/shop">All products <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ slug, title, Icon, blurb }, idx) => (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <Card className="h-full hover-lift">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-resin-gradient text-primary-foreground shadow-[0_6px_18px_-6px_hsl(var(--resin-pink)/0.8)]">
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
        <section className="container py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="text-3xl font-bold md:text-4xl animate-fade-in-up">
              Featured <span className="text-resin">pieces</span>
            </h2>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/shop">Shop all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, idx) => {
              const images = JSON.parse(p.images) as string[];
              return (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="group block animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-500 group-hover:border-resin-gold/50 group-hover:shadow-[0_24px_60px_-24px_hsl(var(--resin-pink)/0.65)]">
                    <Image
                      src={images[0] ?? "/placeholder.svg"}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 24vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/0 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                      <div className="inline-flex rounded-full bg-background/70 px-3 py-1 text-[11px] font-medium tracking-wide text-resin-gold backdrop-blur">
                        {formatPrice(p.priceMinor, p.currency)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <h3 className="font-medium transition-colors group-hover:text-resin-gold">{p.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-resin-gold" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery strip */}
      {galleryPreview.length > 0 && (
        <section className="container py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold md:text-4xl">
                From the <span className="text-resin">studio</span>
              </h2>
              <p className="mt-2 text-muted-foreground">Recent work and behind-the-scenes pours.</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/gallery">Full gallery <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {galleryPreview.map((g, idx) => (
              <div
                key={g.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border/80 animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Image
                  src={g.imageUrl}
                  alt={g.title}
                  fill
                  sizes="(min-width:1024px) 16vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-20" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Students CTA */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl border border-resin-gold/30 bg-card p-10 md:p-16">
          <ResinBackdrop variant="panel" />
          <Badge
            variant="outline"
            className="mb-4 border-resin-gold/50 bg-resin-gold/10 text-resin-gold"
          >
            Students area
          </Badge>
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">
            Learn to pour your own <span className="text-resin">resin art</span>, at your pace.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Register as a student to unlock video lessons, downloadable PDF guides, and supply checklists.
            New beginner and intermediate courses added every month.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
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
