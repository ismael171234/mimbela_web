import { MOCK } from "./products";
import type { Customer, Product } from "./types";
// Sin NEXT_PUBLIC_API_URL la web usa los productos de ejemplo. Con la URL, consume el backend.
const API = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(): Promise<Product[]> {
  if (!API) return MOCK;
  const r = await fetch(`${API}/products`, { next: { revalidate: 60 } });
  if (!r.ok) throw new Error("No se pudo cargar el catálogo");
  return (await r.json()).data;
}
export async function getProduct(slug: string): Promise<Product | null> {
  if (!API) return MOCK.find((p) => p.slug === slug) ?? null;
  const r = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } });
  return r.ok ? (await r.json()).data : null;
}
export async function createCheckout(customer: Customer, items: { productId: string; qty: number }[]) {
  if (!API) throw new Error("El pago online se activa cuando el backend esté conectado.");
  const r = await fetch(`${API}/orders/checkout`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer, items }),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message ?? "No se pudo iniciar el pago");
  return (await r.json()) as { orderId: string; paymentUrl: string };
}
