import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { db } from "../db";
import { HttpError } from "../http";
import { createPayment } from "../payments";
export const orders = Router();
const body = z.object({
  customer: z.object({ name: z.string().min(2), phone: z.string().min(6), email: z.string().email() }),
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1) })).min(1),
});
// Regla de oro: el precio SIEMPRE se lee de la base de datos, nunca del cliente.
async function build(b: z.infer<typeof body>) {
  const prods = await db.product.findMany({ where: { id: { in: b.items.map((i) => i.productId) }, active: true } });
  let total = 0;
  const lines = b.items.map((i) => {
    const p = prods.find((x) => x.id === i.productId);
    if (!p) throw new HttpError(400, "Uno de los productos ya no está disponible", "NOT_AVAILABLE");
    if (p.stock < i.qty) throw new HttpError(409, `Stock insuficiente de ${p.name}`, "NO_STOCK");
    total += Number(p.price) * i.qty;
    return { productId: p.id, nameSnapshot: p.name, priceSnapshot: p.price, qty: i.qty };
  });
  return { lines, total };
}
const code = () => `MIM-${Date.now().toString(36).toUpperCase()}`;
const make = async (b: z.infer<typeof body>, channel: "ONLINE" | "WHATSAPP") => {
  const { lines, total } = await build(b);
  return db.order.create({ data: {
    code: code(), customerName: b.customer.name, customerPhone: b.customer.phone, customerEmail: b.customer.email, total, channel,
    status: channel === "ONLINE" ? "PENDING_PAYMENT" : "PENDING_WHATSAPP", items: { create: lines },
  } });
};
orders.post("/orders/checkout", rateLimit({ windowMs: 60_000, limit: 10 }), async (req, res) => {
  const o = await make(body.parse(req.body), "ONLINE");
  res.status(201).json({ orderId: o.id, paymentUrl: await createPayment(o) });
});
orders.post("/orders/whatsapp", rateLimit({ windowMs: 60_000, limit: 10 }), async (req, res) => {
  const o = await make(body.parse(req.body), "WHATSAPP");
  res.status(201).json({ orderId: o.id, code: o.code });
});
// La pasarela avisa aquí cuando el pago se confirma. Adaptar el formato al de Culqi/Niubiz.
orders.post("/webhooks/payments", async (req, res) => {
  if (req.headers["x-webhook-secret"] !== process.env.WEBHOOK_SECRET) throw new HttpError(401, "Firma inválida", "BAD_SIGNATURE");
  const { orderId, paid } = z.object({ orderId: z.string(), paid: z.boolean() }).parse(req.body);
  await db.$transaction(async (tx) => {
    const o = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!o || o.status !== "PENDING_PAYMENT") return; // idempotente: si ya se procesó, no hace nada
    if (!paid) { await tx.order.update({ where: { id: o.id }, data: { status: "CANCELLED" } }); return; }
    for (const i of o.items) {
      const r = await tx.product.updateMany({ where: { id: i.productId, stock: { gte: i.qty } }, data: { stock: { decrement: i.qty } } });
      if (r.count === 0) throw new HttpError(409, "Sin stock para confirmar el pedido", "NO_STOCK");
    }
    await tx.order.update({ where: { id: o.id }, data: { status: "PAID" } });
  });
  res.json({ ok: true });
});
