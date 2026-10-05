"use client";
import { useEffect, useState } from "react";
import { money } from "@/lib/products";
const API = process.env.NEXT_PUBLIC_API_URL;
const STATUS = ["PENDING_PAYMENT", "PAID", "PENDING_WHATSAPP", "PREPARING", "COMPLETED", "CANCELLED"];
export default function Admin() {
  const [token, setToken] = useState(""); // solo en memoria: al recargar se pide login de nuevo
  const [cred, setCred] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const call = (path: string, init: RequestInit = {}) =>
    fetch(`${API}/admin${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }).then((r) => r.json());
  const load = () => { call("/stats").then((r) => setStats(r.data)); call("/orders").then((r) => setOrders(r.data)); call("/products").then((r) => setProducts(r.data)); };
  useEffect(() => { if (token) load(); }, [token]);
  async function login(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const r = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cred) });
    const j = await r.json();
    if (r.ok) setToken(j.token); else setErr(j.message);
  }
  const put = (id: string, body: object) => call(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }).then(load);
  if (!API) return <p className="p-10">Conecta el backend (NEXT_PUBLIC_API_URL) para usar el panel.</p>;
  const cls = "border-2 border-acero bg-white px-3 py-2";
  if (!token) return (
    <form onSubmit={login} className="mx-auto flex max-w-sm flex-col gap-3 px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Panel de Mimbela</h1>
      <input className={cls} placeholder="Correo" value={cred.email} onChange={(e) => setCred({ ...cred, email: e.target.value })} />
      <input className={cls} placeholder="Contraseña" type="password" value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} />
      {err && <p role="alert" className="font-semibold text-red-700">{err}</p>}
      <button className="bg-naranja py-3 font-display text-xl font-bold">Entrar</button>
    </form>
  );
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Panel de Mimbela</h1>
      {stats && <div className="grid grid-cols-3 gap-3">
        {[["Ventas", money(stats.revenue)], ["Pedidos pagados", stats.orders], ["Stock bajo", stats.lowStock]].map(([k, v]) => (
          <div key={k as string} className="bg-white p-4"><p className="text-sm">{k}</p><p className="font-display text-3xl font-bold">{v}</p></div>))}
      </div>}
      <section>
        <h2 className="mb-3 font-display text-2xl font-bold">Pedidos</h2>
        <table className="w-full bg-white text-left text-sm"><tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-acero/20">
              <td className="p-2 font-medium">{o.code}</td><td>{o.customerName}</td><td>{o.channel}</td><td>{money(Number(o.total))}</td>
              <td><select value={o.status} className="border p-1" onChange={(e) => call(`/orders/${o.id}/status`, { method: "PATCH", body: JSON.stringify({ status: e.target.value }) }).then(load)}>
                {STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
            </tr>))}
        </tbody></table>
      </section>
      <section>
        <h2 className="mb-3 font-display text-2xl font-bold">Productos</h2>
        <table className="w-full bg-white text-left text-sm"><tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-acero/20">
              <td className="p-2">{p.name}</td><td>{money(Number(p.price))}</td>
              <td><input type="number" defaultValue={p.stock} aria-label="Stock" className="w-20 border p-1" onBlur={(e) => put(p.id, { stock: Number(e.target.value) })} /></td>
              <td><label><input type="checkbox" checked={p.active} onChange={(e) => put(p.id, { active: e.target.checked })} /> Visible</label></td>
            </tr>))}
        </tbody></table>
      </section>
    </div>
  );
}
