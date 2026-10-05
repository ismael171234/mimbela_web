import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../db";
import { HttpError } from "../http";
import { ser } from "../serialize";
export const pub = Router();

pub.get("/products", async (req, res) => {
  const q = String(req.query.q ?? "");
  const category = req.query.category ? String(req.query.category) : undefined;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 50);
  const rows = await db.product.findMany({
    where: {
      active: true,
      ...(category && { category: { slug: category } }),
      ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }] }),
    },
    include: { category: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit,
  });
  res.json({ data: rows.map(ser) });
});
pub.get("/products/:slug", async (req, res) => {
  const p = await db.product.findFirst({ where: { slug: req.params.slug, active: true }, include: { category: true } });
  if (!p) throw new HttpError(404, "Producto no encontrado", "NOT_FOUND");
  res.json({ data: ser(p) });
});
pub.get("/categories", async (_req, res) => {
  res.json({ data: await db.category.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }) });
});
pub.post("/quotes", async (req, res) => {
  const d = z.object({ name: z.string().min(2), phone: z.string().min(6), email: z.string().email().optional(), message: z.string().min(5) }).parse(req.body);
  await db.quote.create({ data: d });
  res.status(201).json({ data: { ok: true } });
});
pub.post("/auth/login", rateLimit({ windowMs: 15 * 60_000, limit: 10 }), async (req, res) => {
  const { email, password } = z.object({ email: z.string(), password: z.string() }).parse(req.body);
  const u = await db.adminUser.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) throw new HttpError(401, "Correo o contraseña incorrectos", "BAD_CREDENTIALS");
  res.json({ token: jwt.sign({ role: u.role }, process.env.JWT_SECRET!, { subject: String(u.id), expiresIn: "8h" }) });
});
