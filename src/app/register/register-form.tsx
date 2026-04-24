"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ next }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not register");
      const signRes = await signIn("credentials", {
        email: body.email,
        password: body.password,
        redirect: false,
      });
      if (signRes?.error) throw new Error("Registered, but couldn't log you in automatically.");
      toast.success("Welcome to the studio!");
      router.push(next ?? "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" required maxLength={80} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} className="mt-1" />
        <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters. Use a passphrase you&apos;ll remember.</p>
      </div>
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
