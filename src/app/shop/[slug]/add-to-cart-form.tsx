"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart-store";

type Props = {
  product: {
    productId: string;
    slug: string;
    title: string;
    priceMinor: number;
    currency: string;
    image: string;
    customizable: boolean;
    stock: number;
  };
};

export function AddToCartForm({ product }: Props) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState("");
  const outOfStock = product.stock <= 0;

  const handleAdd = (goToCart: boolean) => {
    add({
      productId: product.productId,
      slug: product.slug,
      title: product.title,
      priceMinor: product.priceMinor,
      currency: product.currency,
      image: product.image,
      quantity: qty,
      customization: custom.trim() || undefined,
    });
    toast.success(`Added ${qty} × ${product.title} to cart`);
    if (goToCart) router.push("/cart");
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-end gap-3">
        <div>
          <Label htmlFor="qty">Quantity</Label>
          <Input
            id="qty"
            type="number"
            min={1}
            max={Math.max(1, product.stock || 99)}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-24"
          />
        </div>
      </div>

      {product.customizable && (
        <div>
          <Label htmlFor="custom">Customization details</Label>
          <Textarea
            id="custom"
            placeholder="Describe your design, engraving text, colour preference, etc."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            We&apos;ll reach out via email/WhatsApp if we need artwork files.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button size="lg" disabled={outOfStock} onClick={() => handleAdd(false)}>
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
        <Button size="lg" variant="outline" disabled={outOfStock} onClick={() => handleAdd(true)}>
          Buy now
        </Button>
      </div>
    </div>
  );
}
