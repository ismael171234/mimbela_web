"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCart } from "@/lib/cart";
function Inner() {
  const code = useSearchParams().get("order");
  useEffect(() => useCart.getState().clear(), []);
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Gracias por tu compra</h1>
      {code && <p className="mt-3">Tu código de pedido es <b>{code}</b>. Guárdalo por si necesitas consultarnos.</p>}
      <Link href="/catalogo" className="mt-6 inline-block bg-naranja px-6 py-3 font-display text-xl font-bold">Seguir comprando</Link>
    </div>
  );
}
export default function Gracias() { return <Suspense><Inner /></Suspense>; }
