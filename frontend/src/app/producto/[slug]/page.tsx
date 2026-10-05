import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import { getProduct } from "@/lib/api";
import { money } from "@/lib/products";
import { waLink } from "@/lib/whatsapp";
export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      {p.images?.[0]
        ? <img src={p.images[0]} alt={p.name} className="aspect-square w-full bg-white object-cover" />
        : <div className="pegboard grid aspect-square place-items-center bg-white font-display text-2xl text-acero/60">Foto pendiente</div>}
      <div>
        <p className="text-acero/70">{p.brand}</p>
        <h1 className="font-display text-4xl font-bold leading-tight">{p.name}</h1>
        <p className="mt-4 font-display text-4xl font-bold">{money(p.price)}</p>
        <p className="mt-1 text-sm">{p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}</p>
        <p className="mt-6 max-w-prose">{p.description}</p>
        <AddToCart product={p} />
        <a href={waLink(`Hola Mimbela, consulto por: ${p.name}`)} target="_blank" rel="noreferrer" className="mt-4 inline-block font-semibold underline">Consultar por WhatsApp</a>
        <dl className="mt-8 border-t border-acero/20">
          {Object.entries(p.specs).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-acero/20 py-2"><dt>{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  );
}
