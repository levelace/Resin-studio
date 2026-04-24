import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Download, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { params: { slug: string } };

export default async function StudentCoursePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/login?next=/dashboard/course/${params.slug}`);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment || enrollment.status !== "active") {
    redirect(`/courses/${course.slug}`);
  }

  return (
    <div className="container py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">My area</Link>
        <span className="mx-2">/</span>
        <span>{course.title}</span>
      </nav>

      <h1 className="text-3xl font-bold md:text-4xl">{course.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{course.summary}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <ol className="space-y-4">
          {course.lessons.map((l, i) => (
            <li key={l.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Lesson {i + 1}</p>
                  <h3 className="text-lg font-semibold">{l.title}</h3>
                  {l.description && <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>}
                </div>
                {l.preview && <Badge variant="outline">Preview</Badge>}
              </div>

              {l.videoUrl && (
                <div className="mt-4 overflow-hidden rounded-lg border bg-black">
                  {/* Served via Mux / direct mp4 URL. For Mux playback IDs swap to <MuxPlayer>. */}
                  <video controls preload="none" className="aspect-video w-full" poster={course.coverImage}>
                    <source src={l.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {l.pdfUrl && (
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={`/api/downloads/${l.id}`} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-1.5 h-4 w-4" /> Download PDF guide
                    </a>
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ol>

        <aside className="h-fit rounded-xl border bg-card p-6">
          <h2 className="font-semibold">About this course</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{course.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <PlayCircle className="h-4 w-4" /> {course.lessons.length} lessons
          </div>
        </aside>
      </div>
    </div>
  );
}
