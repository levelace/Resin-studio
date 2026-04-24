import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Serves gated PDF guides. Only enrolled students (or admins) can download.
// For remote URLs we redirect; for local /public files the URL is returned as-is.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: { course: true },
  });
  if (!lesson?.pdfUrl) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = session.user.role === "admin";
  if (!isAdmin) {
    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: lesson.courseId } },
    });
    if (!enrolled || enrolled.status !== "active") {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }
  }

  // Redirect the browser to the actual file. In production, swap for an S3/R2
  // presigned URL with a short TTL to prevent link leaks.
  return NextResponse.redirect(new URL(lesson.pdfUrl, process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
