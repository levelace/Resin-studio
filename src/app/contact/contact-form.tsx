"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      toast.success("Thanks — we'll get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required maxLength={80} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required maxLength={120} className="mt-1" />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" maxLength={120} className="mt-1" />
      </div>
      <div className="mt-4">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={2000} rows={6} className="mt-1" />
      </div>
      <Button type="submit" disabled={loading} size="lg" className="mt-6 w-full sm:w-auto">
        {loading ? "Sending…" : "Send message"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        We only use your contact details to reply to this enquiry.
      </p>
    </form>
  );
}
