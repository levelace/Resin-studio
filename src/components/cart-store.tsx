"use client";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  priceMinor: number;
  currency: string;
  image?: string;
  quantity: number;
  customization?: string;
};

type Ctx = {
  items: CartLine[];
  add: (line: CartLine) => void;
  remove: (productId: string, customization?: string) => void;
  updateQty: (productId: string, qty: number, customization?: string) => void;
  clear: () => void;
  subtotalMinor: number;
};

// A cart line is uniquely identified by (productId, customization). The same
// physical product can appear multiple times with different customisation
// text (e.g. one mug engraved "Alice", another "Bob").
const sameLine = (a: Pick<CartLine, "productId" | "customization">, productId: string, customization?: string) =>
  a.productId === productId && (a.customization ?? "") === (customization ?? "");

const CartCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "resin-studio:cart:v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((line: CartLine) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === line.productId && p.customization === line.customization);
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, quantity: p.quantity + line.quantity } : p,
        );
      }
      return [...prev, line];
    });
  }, []);

  const remove = useCallback((productId: string, customization?: string) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, customization)));
  }, []);

  const updateQty = useCallback((productId: string, qty: number, customization?: string) => {
    setItems((prev) =>
      prev
        .map((p) => (sameLine(p, productId, customization) ? { ...p, quantity: Math.max(1, qty) } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotalMinor = useMemo(
    () => items.reduce((sum, l) => sum + l.priceMinor * l.quantity, 0),
    [items],
  );

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, subtotalMinor }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function useCartCount() {
  const ctx = useContext(CartCtx);
  if (!ctx) return 0;
  return ctx.items.reduce((n, l) => n + l.quantity, 0);
}
