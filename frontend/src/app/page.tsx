import Link from "next/link";
import {
  ArrowUpRight, Boxes, BrickWall, Clock, Drill, Droplets, Hammer, HardHat, Headset,
  MapPin, MessageCircle, PackageCheck, PaintRoller, Wallet, Wrench, Zap,
} from "lucide-react";
import { Counter, Faq } from "@/components/Extras";
import ProductCard from "@/components/ProductCard";
import { Hero, Reveal } from "@/components/Sections";
import { getProducts } from "@/lib/api";
import { CATEGORIES } from "@/lib/products";
import { waLink } from "@/lib/whatsapp";

// EDITA AQUÍ los datos reales del negocio
const INFO = { direccion: "Por definir", horario: "Por definir" };

const ICONS: Record<string, any> = {
  "herramientas-manuales": Hammer, "herramientas-electricas": Drill, pinturas: PaintRoller, gasfiteria: Droplets,
  electricidad: Zap, construccion: BrickWall, seguridad: HardHat, tornilleria: Wrench,
};
const VALUES = [
  [PackageCheck, "Stock a la vista", "Ves cuántas unidades hay antes de comprar."],
  [Wallet, "Pago flexible", "Online o por WhatsApp, como te sea más cómodo."],
  [Boxes, "Precios por volumen", "Cotizamos tus compras grandes con precio claro."],
  [Headset, "Atención directa", "Te respondemos por WhatsApp sin vueltas."],
] as const;
const STEPS = [
  ["Busca y elige", "Encuentra tus materiales por categoría o con el buscador."],
  ["Paga o pide por WhatsApp", "Paga online de forma segura o envía tu pedido por WhatsApp."],
  ["Confirmamos tu pedido", "Revisamos el stock, te confirmamos y lo dejamos listo."],
];
const h2 = "font-display text-5xl font-black uppercase";

export default async function Home() {
  const all = await getProducts();
  const destacados = all.slice(0, 4);
  const loop = [...CATEGORIES, ...CATEGORIES];
  const stats = [[all.length, "productos en el catálogo"], [CATEGORIES.length, "categorías para tu obra"], [3, "formas de comprar"]] as const;
  return (
    <>
      <Hero />
      <div className="overflow-hidden bg-naranja py-3 text-ink">
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-2xl font-bold uppercase">
          {loop.map((c, i) => <span key={i} className="mx-6 inline-flex items-center gap-6">{c.name}<i className="h-2 w-2 bg-ink" /></span>)}
        </div>
      </div>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 text-center md:grid-cols-3">
          {stats.map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-7xl font-black text-naranja"><Counter to={n} /></p>
              <p className="mt-1 text-white/70">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal><h2 className={h2}>Compra por categoría</h2></Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const Icon = ICONS[c.slug] ?? Wrench;
            return (
              <Reveal key={c.slug} delay={i * 0.05} className="h-full">
                <Link href={`/catalogo?cat=${c.slug}`} className="group flex h-full min-h-40 flex-col justify-between gap-6 border border-acero/15 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-naranja hover:shadow-xl">
                  <span className="flex items-start justify-between">
                    <Icon className="text-naranja" size={32} strokeWidth={1.75} />
                    <ArrowUpRight className="text-acero/30 transition group-hover:text-naranja" size={20} />
                  </span>
                  <span className="font-display text-2xl font-bold leading-tight">{c.name}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className={h2}>Productos destacados</h2>
            <Link href="/catalogo" className="hidden font-semibold underline decoration-naranja decoration-2 underline-offset-4 md:block">Ver todo el catálogo</Link>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {destacados.map((p, i) => <Reveal key={p.id} delay={i * 0.08} className="h-full"><ProductCard p={p} /></Reveal>)}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <Reveal><h2 className={h2}>Por qué comprar en Mimbela</h2></Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="h-full">
              <div className="h-full border-t-4 border-naranja bg-white p-6">
                <Icon className="text-acero" size={30} strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-2xl font-bold">{t}</h3>
                <p className="mt-1 text-acero/75">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><h2 className={h2}>Comprar es así de simple</h2></Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.12}>
                <p className="font-mono text-5xl text-naranja">0{i + 1}</p>
                <h3 className="mt-3 font-display text-3xl font-bold">{t}</h3>
                <p className="mt-2 text-acero/80">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20">
        <Reveal><h2 className={h2}>Preguntas frecuentes</h2></Reveal>
        <Reveal delay={0.1} className="mt-8"><Faq /></Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <Reveal><h2 className={h2}>Encuéntranos</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[[MapPin, "Dirección", INFO.direccion], [Clock, "Horario", INFO.horario]].map(([Icon, t, d]: any) => (
            <Reveal key={t} className="h-full">
              <div className="flex h-full gap-4 border border-acero/15 bg-white p-6">
                <Icon className="mt-1 shrink-0 text-naranja" />
                <div><p className="font-display text-2xl font-bold">{t}</p><p className="text-acero/75">{d}</p></div>
              </div>
            </Reveal>
          ))}
          <Reveal className="h-full">
            <a href={waLink("Hola Mimbela, quisiera hacer una consulta.")} target="_blank" rel="noreferrer"
              className="flex h-full gap-4 bg-[#25D366] p-6 text-ink transition hover:brightness-95">
              <MessageCircle className="mt-1 shrink-0" />
              <div><p className="font-display text-2xl font-bold">WhatsApp</p><p>Escríbenos y te respondemos.</p></div>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <Reveal>
          <div className="relative overflow-hidden bg-acero p-10 text-white md:p-14">
            <div className="pegboard-dark absolute inset-0" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-5xl font-black uppercase leading-none">¿Obra grande?<br />Cotiza por volumen</h2>
                <p className="mt-3 max-w-md text-white/75">Cuéntanos qué necesitas y te respondemos con precio y disponibilidad.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/cotizar" className="bg-naranja px-6 py-3 font-display text-xl font-bold text-ink transition hover:bg-white">Pedir cotización</Link>
                <a href={waLink("Hola Mimbela, quiero una cotización por volumen.")} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 border border-white/40 px-6 py-3 font-display text-xl font-bold transition hover:bg-white hover:text-ink"><MessageCircle size={20} />WhatsApp</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}