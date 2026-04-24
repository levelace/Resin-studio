import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Join as a student",
  description: "Register for a free student account to enrol in resin courses and access PDF guides.",
};

export default function RegisterPage({ searchParams }: { searchParams?: { next?: string } }) {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Create your student account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free to join. Get access to PDF guides, preview lessons, and enrol in any course.
        </p>
        <RegisterForm next={searchParams?.next} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href={`/login${searchParams?.next ? `?next=${searchParams.next}` : ""}`} className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
