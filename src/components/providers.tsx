"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { CartProvider } from "./cart-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </CartProvider>
    </SessionProvider>
  );
}
