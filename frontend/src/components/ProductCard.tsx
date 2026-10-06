"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { money } from "@/lib/products";
import type { Product } from "@/lib/types";
export default function ProductCard({ p }: { p: Product }) {
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <motion.div className="h-full" whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link href={`/producto/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-acero/15 bg-white transition-shadow duration-300 hover:shadow-2xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          {p.images?.[0]
            ? <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            : <div className="pegboard grid h-full place-items-center font-display text-xl text-acero/50">Foto pendiente</div>}
          {off > 0 && <span className="absolute left-0 top-3 bg-naranja px-3 py-1 font-mono text-sm font-medium text-ink">-{off}%</span>}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="font-mono text-xs uppercase tracking-wider text-acero/60">{p.brand}</span>
          <h3 className="font-display text-2xl font-bold leading-tight">{p.name}</h3>
          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="font-display text-3xl font-black">{money(p.price)}</span>
            {p.oldPrice && <s className="font-mono text-sm text-acero/50">{money(p.oldPrice)}</s>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}