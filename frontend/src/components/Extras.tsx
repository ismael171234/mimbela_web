"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(to); return; }
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const ITEMS = [
  ["¿Cómo pago mi pedido?", "Puedes pagar online con tarjeta de forma segura, o enviar tu pedido por WhatsApp y coordinar el pago con nosotros."],
  ["¿Hacen ventas por volumen?", "Sí. Usa la página de cotización o escríbenos por WhatsApp con tu lista de materiales y te respondemos con precio."],
  ["¿Cómo sé si hay stock?", "Cada producto muestra las unidades disponibles. Si algo está agotado, consúltanos y te avisamos cuándo llega."],
  ["¿Cómo recibo mi pedido?", "Al confirmar tu pedido coordinamos contigo la entrega o el recojo."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-acero/15 border-y border-acero/15 bg-white">
      {ITEMS.map(([q, a], i) => (
        <div key={q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-2xl font-bold">
            {q}
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="text-naranja"><ChevronDown /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-acero/80">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}