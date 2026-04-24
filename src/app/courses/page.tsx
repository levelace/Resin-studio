import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Clock, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Courses",
  description: "Learn resin art, candle making, and more. Video lessons and PDF guides for students in Ghana and beyond.",
};

export const revalidate = 120;

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { _count: { select: { lessons: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <header className="mb-10 max-w-2xl animate-fade-in-up">
        <h1 className="text-4xl font-bold md:text-5xl">
          Learn to <span className="text-resin">pour</span>.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Step-by-step video lessons with downloadable PDF guides. Enroll once, watch forever — stream smoothly
          even on mobile data.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {courses.map((c, idx) => (
          <article
            key={c.id}
            className="resin-card group overflow-hidden rounded-2xl hover-lift animate-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <Link href={`/courses/${c.slug}`}>
              <div className="relative aspect-video overflow-hidden">
                <Image src={c.coverImage} alt={c.title} fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute left-4 top-4">
                  {c.priceMinor === 0 ? (
                    <Badge className="bg-resin-gradient text-primary-foreground border-transparent shadow-[0_6px_16px_-6px_hsl(var(--resin-pink)/0.8)]">Free</Badge>
                  ) : (
                    <Badge>{formatPrice(c.priceMinor, c.currency)}</Badge>
                  )}
                </div>
              </div>
            </Link>
            <div className="p-6">
              <h2 className="text-xl font-semibold">
                <Link href={`/courses/${c.slug}`} className="transition-colors hover:text-resin-gold">{c.title}</Link>
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c._count.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Self-paced</span>
                <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> PDF guides</span>
              </div>
              <div className="mt-5 flex gap-2">
                <Button asChild size="sm"><Link href={`/courses/${c.slug}`}>View course</Link></Button>
                <Button asChild size="sm" variant="outline"><Link href="/register">Register</Link></Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
