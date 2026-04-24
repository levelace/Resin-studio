import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and checkout securely.",
};

export default function CartPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold">Your cart</h1>
      <CartView />
    </div>
  );
}
