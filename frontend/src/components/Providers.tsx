"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Toaster } from "sonner";

export default function Providers() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, [reduce]);

  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-naranja" />
      <Toaster position="bottom-left" closeButton toastOptions={{ style: { borderRadius: 2 } }} />
    </>
  );
}