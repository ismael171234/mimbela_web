import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { CATEGORIES } from "@/lib/products";
export const metadata = { title: "Catálogo" };
export default async function Catalogo({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const all = await getProducts();
  const q = (searchParams.q ?? "").toLowerCase();
  const list = all.filter((p) => (!searchParams.cat || p.category === searchParams.cat) && (!q || `${p.name} ${p.brand}`.toLowerCase().includes(q)));
  const cls = (on: boolean) => `block py-1 ${on ? "font-bold text-naranja" : "hover:underline"}`;
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[220px_1fr]">
      <aside>
        <h2 className="mb-3 font-display text-2xl font-bold">Categorías</h2>
        <Link href="/catalogo" className={cls(!searchParams.cat)}>Todas</Link>
        {CATEGORIES.map((c) => <Link key={c.slug} href={`/catalogo?cat=${c.slug}`} className={cls(searchParams.cat === c.slug)}>{c.name}</Link>)}
      </aside>
      <section>
        <form className="mb-6 flex gap-2">
          {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
          <input name="q" defaultValue={searchParams.q} aria-label="Buscar" placeholder="Buscar en el catálogo" className="flex-1 border-2 border-acero bg-white px-4 py-3" />
          <button className="bg-acero px-5 font-semibold text-white">Buscar</button>
        </form>
        {list.length
          ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          : <p>No encontramos productos con esa búsqueda. Prueba otra palabra o pídenos el producto por WhatsApp.</p>}
      </section>
    </div>
  );
}
