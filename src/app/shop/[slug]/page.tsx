import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice, siteConfig } from "@/lib/utils";
import { AddToCartForm } from "./add-to-cart-form";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};
  const images = JSON.parse(product.images) as string[];
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: images[0] ? [images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product || !product.published) notFound();
  const images = JSON.parse(product.images) as string[];

  return (
    <div className="container py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border">
            <Image
              src={images[0] ?? "/placeholder.svg"}
              alt={product.title}
              fill
              priority
              sizes="(min-width:768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image src={src} alt="" fill sizes="15vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{product.title}</h1>
          <p className="mt-2 text-xl font-semibold text-primary">{formatPrice(product.priceMinor, product.currency)}</p>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>

          <AddToCartForm
            product={{
              productId: product.id,
              slug: product.slug,
              title: product.title,
              priceMinor: product.priceMinor,
              currency: product.currency,
              image: images[0] ?? "",
              customizable: product.customizable,
              stock: product.stock,
            }}
          />

          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <p>✓ Secure checkout via Paystack (card, MTN MoMo, Telecel Cash, AirtelTigo)</p>
            <p>✓ Delivery within 2–5 working days in Ghana</p>
            <p>✓ Need something bespoke? <Link href="/contact" className="text-primary underline">Request a custom order</Link></p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: images,
            offers: {
              "@type": "Offer",
              priceCurrency: product.currency,
              price: (product.priceMinor / 100).toFixed(2),
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
              url: `${siteConfig.url}/shop/${product.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
