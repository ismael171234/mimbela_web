import "./globals.css";
import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Link from "next/link";
import CartLink from "@/components/CartLink";
import { waLink } from "@/lib/whatsapp";
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--f-display" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-body" });
export const metadata: Metadata = {
  title: { default: "Mimbela Ferretería", template: "%s | Mimbela" },
  description: "Herramientas, materiales de construcción y acabados. Compra online o pide por WhatsApp.",
};
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="bg-galva font-body text-ink antialiased">
        <header className="sticky top-0 z-20 bg-acero text-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="font-display text-3xl font-bold">Mimbela<span className="text-naranja">.</span></Link>
            <nav className="flex items-center gap-6 font-medium">
              <Link href="/catalogo" className="hover:text-naranja">Catálogo</Link>
              <Link href="/cotizar" className="hover:text-naranja">Cotizar</Link>
              <CartLink />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 bg-acero py-10 text-white/80">
          <div className="mx-auto max-w-6xl px-4">
            <p className="font-display text-2xl font-bold text-white">Mimbela Ferretería</p>
            <p className="mt-2">Dirección, horario y teléfono: completar con los datos del cliente.</p>
          </div>
        </footer>
        <a href={waLink("Hola Mimbela, quisiera hacer una consulta.")} target="_blank" rel="noreferrer"
          className="fixed bottom-4 right-4 z-30 bg-[#25D366] px-4 py-3 font-semibold text-ink shadow-lg">Escríbenos por WhatsApp</a>
      </body>
    </html>
  );
}
