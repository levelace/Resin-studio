"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Logged in");
    router.push(next ?? "/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" minLength={8} className="mt-1" />
      </div>
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
