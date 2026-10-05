"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createCheckout } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/products";
import { cartMessage, waLink } from "@/lib/whatsapp";
export default function Carrito() {
  const { items, setQty } = useCart();
  const [m, setM] = useState(false);
  const [c, setC] = useState({ name: "", phone: "", email: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setM(true), []);
  if (!m) return null;
  const total = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  if (!items.length) return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Tu carrito está vacío</h1>
      <Link href="/catalogo" className="mt-6 inline-block bg-naranja px-6 py-3 font-display text-xl font-bold">Ver catálogo</Link>
    </div>
  );
  async function pay() {
    if (!c.name || !c.phone || !c.email) return setErr("Completa nombre, celular y correo para pagar online.");
    setBusy(true); setErr("");
    try {
      const { paymentUrl } = await createCheckout(c, items.map((i) => ({ productId: i.product.id, qty: i.qty })));
      window.location.href = paymentUrl;
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  }
  const input = "w-full border-2 border-acero bg-white px-3 py-2";
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_340px]">
      <section>
        <h1 className="font-display text-4xl font-bold">Tu carrito</h1>
        <ul className="mt-6 divide-y divide-acero/20 border-y border-acero/20 bg-white">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="flex items-center justify-between gap-4 p-4">
              <span className="font-medium">{product.name}</span>
              <span className="flex items-center gap-2">
                <button aria-label="Quitar uno" onClick={() => setQty(product.id, qty - 1)} className="h-9 w-9 bg-galva font-bold">−</button>
                <span className="w-6 text-center">{qty}</span>
                <button aria-label="Agregar uno" onClick={() => setQty(product.id, Math.min(product.stock, qty + 1))} className="h-9 w-9 bg-galva font-bold">+</button>
              </span>
              <span className="w-24 text-right font-display text-xl font-bold">{money(product.price * qty)}</span>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit bg-white p-5">
        <p className="flex justify-between font-display text-2xl font-bold"><span>Total</span><span>{money(total)}</span></p>
        <div className="mt-4 space-y-2">
          <input className={input} placeholder="Nombre" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
          <input className={input} placeholder="Celular" inputMode="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
          <input className={input} placeholder="Correo" type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
        </div>
        {err && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{err}</p>}
        <button onClick={pay} disabled={busy} className="mt-4 w-full bg-naranja py-3 font-display text-xl font-bold disabled:opacity-60">{busy ? "Procesando…" : "Pagar online"}</button>
        <a href={waLink(cartMessage(items, total))} target="_blank" rel="noreferrer" className="mt-2 block bg-acero py-3 text-center font-display text-xl font-bold text-white">Pedir por WhatsApp</a>
      </aside>
    </div>
  );
}
