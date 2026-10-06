import "./globals.css";
import type { Metadata } from "next";
import { Big_Shoulders_Display, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { waLink } from "@/lib/whatsapp";

const display = Big_Shoulders_Display({ subsets: ["latin"], variable: "--f-display" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--f-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: { default: "Mimbela Ferretería", template: "%s | Mimbela" },
  description: "Herramientas, materiales de construcción y acabados. Compra online o pide por WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-galva font-body text-ink antialiased">
        <Providers />
        <Header />
        <main>{children}</main>
        <footer className="mt-24 bg-acero text-white/80">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
            <div>
              <p className="font-display text-4xl font-black text-white">MIMBELA<span className="text-naranja">.</span></p>
              <p className="mt-3 max-w-xs">Herramientas y materiales para tu obra, con atención directa.</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">Explora</p>
              <ul className="mt-3 space-y-2">
                <li><Link className="hover:text-naranja" href="/catalogo">Catálogo</Link></li>
                <li><Link className="hover:text-naranja" href="/cotizar">Cotizar por volumen</Link></li>
                <li><Link className="hover:text-naranja" href="/carrito">Mi carrito</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">Contacto</p>
              <p className="mt-3">Dirección y horario: completar con los datos del cliente.</p>
            </div>
          </div>
          <p className="border-t border-white/10 py-4 text-center text-sm">© {new Date().getFullYear()} Mimbela Ferretería</p>
        </footer>
        <a
          href={waLink("Hola Mimbela, quisiera hacer una consulta.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-ink shadow-xl"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
          <MessageCircle className="relative" />
        </a>
      </body>
    </html>
  );
} 