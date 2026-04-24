import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to access your student dashboard and orders.",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your student dashboard or order history.</p>
        <LoginForm next={searchParams?.next} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link href={`/register${searchParams?.next ? `?next=${searchParams.next}` : ""}`} className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
