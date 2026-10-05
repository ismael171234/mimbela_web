"use client";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
const API = process.env.NEXT_PUBLIC_API_URL;
export default function Cotizar() {
  const [f, setF] = useState({ name: "", phone: "", email: "", message: "" });
  const [st, setSt] = useState<"idle" | "ok" | "err">("idle");
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!API) { window.open(waLink(`Hola Mimbela, soy ${f.name}. ${f.message}`), "_blank"); return; }
    const r = await fetch(`${API}/quotes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, email: f.email || undefined }) });
    setSt(r.ok ? "ok" : "err");
  }
  const cls = "w-full border-2 border-acero bg-white px-3 py-2";
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Cotiza tu compra por volumen</h1>
      <p className="mt-2">Cuéntanos qué materiales necesitas y en qué cantidad. Te respondemos con precio.</p>
      {st === "ok" ? <p className="mt-6 bg-white p-4 font-semibold">Recibimos tu solicitud. Te contactaremos pronto.</p> : (
        <form onSubmit={send} className="mt-6 space-y-3">
          <input required className={cls} placeholder="Nombre" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input required className={cls} placeholder="Celular" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input className={cls} placeholder="Correo (opcional)" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <textarea required rows={5} className={cls} placeholder="Ej: 20 bolsas de cemento y 50 tubos PVC de 2 pulgadas" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          {st === "err" && <p role="alert" className="font-semibold text-red-700">No se pudo enviar. Revisa los datos o escríbenos por WhatsApp.</p>}
          <button className="bg-naranja px-6 py-3 font-display text-xl font-bold">Enviar solicitud</button>
        </form>
      )}
    </div>
  );
}
