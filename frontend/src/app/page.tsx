import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { CATEGORIES } from "@/lib/products";
import { waLink } from "@/lib/whatsapp";
export default async function Home() {
  const destacados = (await getProducts()).slice(0, 4);
  return (
    <>
      <section className="pegboard border-b-4 border-naranja bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] md:text-7xl">Lo que necesitas para la obra, sin dar mil vueltas.</h1>
          <form action="/catalogo" className="mt-8 flex max-w-xl shadow-[6px_6px_0_#22313F]">
            <input name="q" aria-label="Buscar productos" placeholder="Busca: taladro, tubo PVC, pintura…"
              className="flex-1 border-2 border-acero bg-white px-4 py-4" />
            <button className="bg-naranja px-6 font-display text-xl font-bold text-ink">Buscar</button>
          </form>
          <p className="mt-4 text-acero">¿Compras por volumen? <a className="font-semibold underline" target="_blank" rel="noreferrer" href={waLink("Hola Mimbela, quiero una cotización por volumen.")}>Pide tu cotización por WhatsApp</a>.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl font-bold">Compra por categoría</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/catalogo?cat=${c.slug}`} className="border-l-4 border-naranja bg-white px-4 py-5 font-display text-xl font-semibold hover:bg-acero hover:text-white">{c.name}</Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-bold">Productos destacados</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{destacados.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </>
  );
}
