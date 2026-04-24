"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-store";

export function CartView() {
  const { items, remove, updateQty, subtotalMinor, clear } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4"><Link href="/shop">Browse the shop</Link></Button>
      </div>
    );
  }

  const handleCheckout = async () => {
    const customerEmail = session?.user?.email ?? email;
    if (!customerEmail) {
      toast.error("Enter an email so we can send your receipt.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter a delivery address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "cart",
          email: customerEmail,
          phone,
          shippingAddress: address,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            customization: i.customization,
          })),
          callbackPath: "/checkout/success",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");
      clear();
      if (json.authorizationUrl) {
        window.location.href = json.authorizationUrl;
      } else {
        router.push("/checkout/success");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <ul className="space-y-4">
        {items.map((line) => (
          <li key={line.productId + (line.customization ?? "")} className="flex gap-4 rounded-xl border bg-card p-4">
            {line.image && (
              <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-lg border">
                <Image src={line.image} alt={line.title} fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-1">
              <Link href={`/shop/${line.slug}`} className="font-medium hover:text-primary">{line.title}</Link>
              <p className="text-sm text-muted-foreground">{formatPrice(line.priceMinor, line.currency)}</p>
              {line.customization && (
                <p className="text-xs text-muted-foreground line-clamp-2">Note: {line.customization}</p>
              )}
              <div className="mt-auto flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateQty(line.productId, Number(e.target.value), line.customization)}
                  className="w-20"
                />
                <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => remove(line.productId, line.customization)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(line.priceMinor * line.quantity, line.currency)}</p>
          </li>
        ))}
      </ul>

      <aside className="sticky top-24 h-fit rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotalMinor)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Shipping calculated after we confirm your area.</p>

        <div className="mt-6 space-y-3">
          {!session?.user?.email && (
            <div>
              <Label htmlFor="email">Email (for receipt)</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
          )}
          <div>
            <Label htmlFor="phone">Phone (WhatsApp preferred)</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 20 000 0000" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address">Delivery address</Label>
            <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="GA-123-4567, Accra" className="mt-1" />
          </div>
        </div>

        <Button size="lg" className="mt-6 w-full" onClick={handleCheckout} disabled={loading}>
          {loading ? "Starting checkout…" : "Pay with Paystack"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Paystack accepts Visa, Mastercard, and Mobile Money (MTN, Telecel, AirtelTigo) in GHS.
        </p>
      </aside>
    </div>
  );
}
