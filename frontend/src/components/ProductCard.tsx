import Link from "next/link";
import { money } from "@/lib/products";
import type { Product } from "@/lib/types";
export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/producto/${p.slug}`} className="flex flex-col border border-acero/20 bg-white hover:border-naranja">
      {p.images?.[0]
        ? <img src={p.images[0]} alt={p.name} className="aspect-[4/3] w-full object-cover" />
        : <div className="pegboard grid aspect-[4/3] place-items-center font-display text-xl text-acero/60">Foto pendiente</div>}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-sm text-acero/70">{p.brand}</span>
        <h3 className="font-display text-xl font-semibold leading-tight">{p.name}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-display text-2xl font-bold">{money(p.price)}</span>
          {p.oldPrice && <s className="text-sm text-acero/60">{money(p.oldPrice)}</s>}
        </div>
      </div>
    </Link>
  );
}
