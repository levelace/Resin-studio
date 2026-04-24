import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Metadata } from "next";
import { BookOpen, CheckCircle2, Lock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { formatPrice, siteConfig } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnrollButton } from "./enroll-button";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { slug: params.slug } });
  if (!course) return {};
  return {
    title: course.title,
    description: course.summary,
    openGraph: { images: [course.coverImage] },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course || !course.published) notFound();

  const session = await getServerSession(authOptions);
  const enrolled = session?.user
    ? Boolean(
        await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        }),
      )
    : false;

  return (
    <div className="container py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground">Courses</Link>
        <span className="mx-2">/</span>
        <span>{course.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border">
            <Image src={course.coverImage} alt={course.title} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <h1 className="mt-6 text-3xl font-bold md:text-4xl">{course.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{course.summary}</p>
          <div className="prose prose-sm mt-6 max-w-none whitespace-pre-line text-foreground/90">
            {course.description}
          </div>

          <h2 className="mt-10 flex items-center gap-2 text-2xl font-bold"><BookOpen className="h-5 w-5" /> Lessons</h2>
          <ol className="mt-4 divide-y rounded-xl border bg-card">
            {course.lessons.map((l, i) => {
              const accessible = enrolled || l.preview;
              return (
                <li key={l.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-medium">{i + 1}. {l.title}</p>
                    {l.description && <p className="truncate text-sm text-muted-foreground">{l.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {l.preview && <Badge variant="outline">Preview</Badge>}
                    {accessible ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4" />}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="sticky top-24 h-fit space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-3xl font-bold">
              {course.priceMinor === 0 ? "Free" : formatPrice(course.priceMinor, course.currency)}
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {course.lessons.length} video lessons</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Downloadable PDF guides</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Lifetime access</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Mobile-optimised video</li>
          </ul>

          {enrolled ? (
            <Button asChild className="w-full" size="lg">
              <Link href={`/dashboard/course/${course.slug}`}>Go to course</Link>
            </Button>
          ) : session ? (
            <EnrollButton course={{ id: course.id, slug: course.slug, title: course.title, priceMinor: course.priceMinor, currency: course.currency }} />
          ) : (
            <div className="space-y-2">
              <Button asChild className="w-full" size="lg"><Link href={`/register?next=/courses/${course.slug}`}>Register to enroll</Link></Button>
              <Button asChild variant="outline" className="w-full"><Link href={`/login?next=/courses/${course.slug}`}>I already have an account</Link></Button>
            </div>
          )}
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.summary,
            provider: { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url },
            offers: {
              "@type": "Offer",
              price: (course.priceMinor / 100).toFixed(2),
              priceCurrency: course.currency,
            },
          }),
        }}
      />
    </div>
  );
}
