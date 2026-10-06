"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CreditCard, FileText, MessageCircle, Search } from "lucide-react";
const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const r = useReducedMotion();
  return (
    <motion.div className={className} initial={r ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  );
}

const words = ["Todo", "para", "tu", "obra,", "en", "un", "solo", "lugar."];
const tags = [
  { Icon: CreditCard, t: "Pago online", s: "Con tarjeta, seguro y rápido" },
  { Icon: MessageCircle, t: "Pedido por WhatsApp", s: "Envía tu lista y listo" },
  { Icon: FileText, t: "Cotiza por volumen", s: "Respuesta con precio" },
];

export function Hero() {
  const r = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-acero text-white">
      <div className="pegboard-dark absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
        <div>
          <h1 className="font-display text-6xl font-black uppercase leading-[0.9] md:text-8xl">
            {words.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span className={`inline-block ${w === "obra," ? "text-naranja" : ""}`} initial={r ? false : { y: "110%" }}
                  animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.08 * i, ease }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="mt-6 max-w-lg text-lg text-white/75" initial={r ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
            Herramientas, materiales y acabados de calidad. Compra online o pide por WhatsApp.
          </motion.p>
          <motion.form action="/catalogo" className="mt-8 flex max-w-xl" initial={r ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.6, ease }}>
            <input name="q" aria-label="Buscar productos" placeholder="¿Qué necesitas? Taladro, tubo PVC, pintura…" className="min-w-0 flex-1 bg-white px-4 py-4 text-ink" />
            <button className="flex items-center gap-2 bg-naranja px-6 font-display text-xl font-bold text-ink transition hover:bg-white"><Search size={20} />Buscar</button>
          </motion.form>
        </div>
        <div className="relative hidden h-[430px] md:block">
          {tags.map(({ Icon, t, s }, i) => (
            <motion.div key={t} style={{ top: i * 135, left: i % 2 ? 70 : 0, transformOrigin: "top center" }}
              className="absolute w-64 bg-white p-5 text-ink shadow-2xl" initial={r ? false : { opacity: 0, y: -40 }}
              animate={r ? { opacity: 1 } : { opacity: 1, y: 0, rotate: [-2, 2, -2] }}
              transition={{ opacity: { delay: 0.5 + i * 0.15, duration: 0.6 }, y: { delay: 0.5 + i * 0.15, duration: 0.6, ease }, rotate: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" } }}>
              <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-acero" />
              <Icon className="mt-3 text-naranja" size={28} />
              <p className="mt-2 font-display text-2xl font-bold">{t}</p>
              <p className="text-sm text-acero/70">{s}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}