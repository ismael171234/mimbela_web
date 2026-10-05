import { parse } from "csv-parse/sync";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { db } from "../db";
import { HttpError } from "../http";
import { ser } from "../serialize";
export const admin = Router();
const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5_000_000 } });
const prod = z.object({
  slug: z.string().min(2), name: z.string().min(2), brand: z.string().default(""), categoryId: z.number().int(),
  price: z.number().positive(), oldPrice: z.number().positive().nullish(), stock: z.number().int().min(0),
  description: z.string().default(""), specs: z.record(z.string()).default({}), images: z.array(z.string().url()).default([]), active: z.boolean().default(true),
});
admin.get("/products", async (_q, res) => res.json({ data: await db.product.findMany({ orderBy: { name: "asc" } }) }));
admin.post("/products", async (req, res) => res.status(201).json({ data: await db.product.create({ data: prod.parse(req.body) }) }));
admin.put("/products/:id", async (req, res) => res.json({ data: await db.product.update({ where: { id: req.params.id }, data: prod.partial().parse(req.body) }) }));
admin.delete("/products/:id", async (req, res) => { await db.product.update({ where: { id: req.params.id }, data: { active: false } }); res.json({ ok: true }); });
admin.post("/categories", async (req, res) => res.status(201).json({ data: await db.category.create({ data: z.object({ slug: z.string().min(2), name: z.string().min(2) }).parse(req.body) }) }));
// CSV con columnas: slug,name,brand,category,price,stock,description (category = slug de la categoría)
admin.post("/products/import", up.single("file"), async (req, res) => {
  if (!req.file) throw new HttpError(400, "Falta el archivo CSV", "NO_FILE");
  const rows = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true }) as any[];
  const cats = await db.category.findMany();
  const errors: { row: number; message: string }[] = [];
  let imported = 0;
  for (const [i, r] of rows.entries()) {
    const c = cats.find((x) => x.slug === r.category);
    if (!r.slug || !r.name || !c || !(Number(r.price) > 0)) { errors.push({ row: i + 2, message: "Revisa slug, nombre, categoría o precio" }); continue; }
    const d = { name: r.name, brand: r.brand ?? "", categoryId: c.id, price: Number(r.price), stock: Number(r.stock) || 0, description: r.description ?? "" };
    await db.product.upsert({ where: { slug: r.slug }, update: d, create: { slug: r.slug, ...d } });
    imported++;
  }
  res.json({ data: { imported, errors } });
});
admin.get("/orders", async (_q, res) => res.json({ data: await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 }) }));
admin.get("/orders/:id", async (req, res) => res.json({ data: await db.order.findUniqueOrThrow({ where: { id: req.params.id }, include: { items: true } }) }));
admin.patch("/orders/:id/status", async (req, res) => {
  const { status } = z.object({ status: z.enum(["PENDING_PAYMENT", "PAID", "PENDING_WHATSAPP", "PREPARING", "COMPLETED", "CANCELLED"]) }).parse(req.body);
  const o = await db.order.findUniqueOrThrow({ where: { id: req.params.id }, include: { items: true } });
  await db.$transaction(async (tx) => {
    // Pedidos por WhatsApp: el stock se descuenta cuando se completan.
    if (status === "COMPLETED" && o.channel === "WHATSAPP" && o.status !== "COMPLETED") {
      for (const i of o.items) {
        const r = await tx.product.updateMany({ where: { id: i.productId, stock: { gte: i.qty } }, data: { stock: { decrement: i.qty } } });
        if (r.count === 0) throw new HttpError(409, "Stock insuficiente para completar el pedido", "NO_STOCK");
      }
    }
    await tx.order.update({ where: { id: o.id }, data: { status } });
  });
  res.json({ ok: true });
});
admin.get("/quotes", async (_q, res) => res.json({ data: await db.quote.findMany({ orderBy: { createdAt: "desc" } }) }));
admin.patch("/quotes/:id", async (req, res) => res.json({ data: await db.quote.update({ where: { id: Number(req.params.id) }, data: z.object({ status: z.string() }).parse(req.body) }) }));
admin.get("/stats", async (_q, res) => {
  const paid = await db.order.aggregate({ where: { status: { in: ["PAID", "PREPARING", "COMPLETED"] } }, _sum: { total: true }, _count: true });
  const top = await db.orderItem.groupBy({ by: ["nameSnapshot"], _sum: { qty: true }, orderBy: { _sum: { qty: "desc" } }, take: 5 });
  const lowStock = await db.product.count({ where: { active: true, stock: { lte: 5 } } });
  res.json({ data: { revenue: Number(paid._sum.total ?? 0), orders: paid._count, lowStock, top: top.map((t) => ({ name: t.nameSnapshot, qty: t._sum.qty })) } });
});
