import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A gallery of handcrafted resin art, souvenirs, custom-print gifts, and scented candle work from our Kumasi studio.",
};

export const revalidate = 120;

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="container py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold md:text-5xl">Gallery</h1>
        <p className="mt-2 text-muted-foreground">
          A glimpse of recent commissions, finished pieces, and the occasional behind-the-scenes pour.
          Something catch your eye? <a href="/contact" className="text-primary underline">Commission a custom piece</a>.
        </p>
      </header>

      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {items.map((g) => (
          <figure key={g.id} className="mb-3 break-inside-avoid overflow-hidden rounded-xl border bg-card">
            <div className="relative aspect-[4/5]">
              <Image src={g.imageUrl} alt={g.title} fill sizes="(min-width:1024px) 23vw, 45vw" className="object-cover" />
            </div>
            <figcaption className="px-3 py-2 text-sm">
              <p className="font-medium">{g.title}</p>
              {g.caption && <p className="text-muted-foreground">{g.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
