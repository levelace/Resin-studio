import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My area",
  description: "Your courses, guides, and orders.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?next=/dashboard");

  const [enrollments, orders] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: session.user.id, status: "active" },
      include: { course: { include: { lessons: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="container py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Welcome{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}</h1>
        <p className="mt-1 text-muted-foreground">Your enrolled courses, downloadable guides, and recent orders.</p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">My courses</h2>
        {enrollments.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-muted-foreground">You&apos;re not enrolled in any courses yet.</p>
            <Button asChild className="mt-4"><Link href="/courses">Browse courses</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map(({ course }) => (
              <Link key={course.id} href={`/dashboard/course/${course.slug}`} className="group">
                <div className="overflow-hidden rounded-xl border bg-card transition-shadow group-hover:shadow-lg">
                  <div className="relative aspect-video">
                    <Image src={course.coverImage} alt={course.title} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{course.lessons.length} lessons · lifetime access</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3 font-mono text-xs">#{o.id.slice(-6).toUpperCase()}</td>
                    <td className="p-3">{o.items.map((i) => i.title).join(", ")}</td>
                    <td className="p-3">{formatPrice(o.totalMinor, o.currency)}</td>
                    <td className="p-3"><Badge variant={o.status === "paid" || o.status === "fulfilled" ? "default" : "outline"}>{o.status}</Badge></td>
                    <td className="p-3 text-muted-foreground">{o.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
