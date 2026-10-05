"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
export default function CartLink() {
  const n = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return <Link href="/carrito" className="bg-naranja px-3 py-1.5 font-semibold text-ink">Carrito{m && n > 0 ? ` (${n})` : ""}</Link>;
}
