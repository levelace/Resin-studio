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
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotalMinor: number;
};

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

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.productId === productId ? { ...p, quantity: Math.max(1, qty) } : p))
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
