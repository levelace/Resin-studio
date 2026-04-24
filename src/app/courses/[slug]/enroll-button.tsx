"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  course: { id: string; slug: string; title: string; priceMinor: number; currency: string };
};

export function EnrollButton({ course }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "course",
          courseId: course.id,
          callbackPath: `/dashboard/course/${course.slug}`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not start checkout");
      if (json.free) {
        toast.success("Enrolled!");
        router.push(`/dashboard/course/${course.slug}`);
      } else if (json.authorizationUrl) {
        window.location.href = json.authorizationUrl;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handle} disabled={loading} className="w-full" size="lg">
      {loading ? "Starting checkout…" : course.priceMinor === 0 ? "Enroll for free" : "Enroll & pay"}
    </Button>
  );
}
