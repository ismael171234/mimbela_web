"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";
type S = { items: CartItem[]; add: (p: Product, q?: number) => void; setQty: (id: string, q: number) => void; clear: () => void };
export const useCart = create<S>()(persist((set) => ({
  items: [],
  add: (p, q = 1) => set((s) => {
    const has = s.items.some((x) => x.product.id === p.id);
    return { items: has ? s.items.map((x) => x.product.id === p.id ? { ...x, qty: x.qty + q } : x) : [...s.items, { product: p, qty: q }] };
  }),
  setQty: (id, q) => set((s) => ({ items: q <= 0 ? s.items.filter((x) => x.product.id !== id) : s.items.map((x) => x.product.id === id ? { ...x, qty: q } : x) })),
  clear: () => set({ items: [] }),
}), { name: "mimbela-cart" }));
