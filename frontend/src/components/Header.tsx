"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import CartLink from "./CartLink";

const links = [["Catálogo", "/catalogo"], ["Cotizar", "/cotizar"]];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`sticky top-0 z-40 text-white transition-all duration-300 ${scrolled ? "bg-acero/95 shadow-lg backdrop-blur" : "bg-acero"}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}>
        <Link href="/" className="font-display text-4xl font-black tracking-tight">MIMBELA<span className="text-naranja">.</span></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([n, h]) => (
            <Link key={h} href={h} className="group relative font-medium">
              {n}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-naranja transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <CartLink />
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <CartLink />
          <button aria-label="Menú" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden">
            <div className="flex flex-col gap-4 px-4 pb-5 text-lg">
              {links.map(([n, h]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{n}</Link>)}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}