"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
export default function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  if (product.stock <= 0) return <p className="mt-6 font-semibold">Agotado. Consúltanos por WhatsApp cuándo llega.</p>;
  return (
    <div className="mt-6 flex items-center gap-3">
      <input type="number" min={1} max={product.stock} value={qty} aria-label="Cantidad"
        onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
        className="w-20 border-2 border-acero bg-white px-3 py-3" />
      <button onClick={() => { add(product, qty); setDone(true); setTimeout(() => setDone(false), 1800); }}
        className="bg-naranja px-6 py-3 font-display text-xl font-bold text-ink">
        {done ? "Agregado al carrito" : "Agregar al carrito"}
      </button>
    </div>
  );
}
