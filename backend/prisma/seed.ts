import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
const db = new PrismaClient();
// Datos de ejemplo. Los productos reales de Mimbela se cargan luego por CSV desde el panel.
const cats = [["herramientas-manuales", "Herramientas manuales"], ["herramientas-electricas", "Herramientas eléctricas"], ["pinturas", "Pinturas"], ["gasfiteria", "Gasfitería"], ["electricidad", "Electricidad"], ["construccion", "Construcción"], ["seguridad", "Seguridad industrial"], ["tornilleria", "Tornillería"]];
const prods = [
  ["martillo-una-16oz", "Martillo de uña 16 oz", "Truper", "herramientas-manuales", 24.9, 40],
  ["taladro-percutor-650w", "Taladro percutor 650 W", "Bosch", "herramientas-electricas", 289, 9],
  ["pintura-latex-blanco", "Pintura látex blanco 1 galón", "CPP", "pinturas", 69.9, 60],
  ["tubo-pvc-2", "Tubo PVC desagüe 2 in x 3 m", "Pavco", "gasfiteria", 22, 80],
  ["cable-thw-14", "Cable THW 14 AWG rollo de 100 m", "Indeco", "electricidad", 189, 14],
  ["cemento-42-5", "Cemento bolsa 42.5 kg", "Sol", "construccion", 31.9, 200],
] as const;
async function main() {
  for (const [slug, name] of cats) await db.category.upsert({ where: { slug }, update: {}, create: { slug, name } });
  for (const [slug, name, brand, cat, price, stock] of prods) {
    const c = await db.category.findUniqueOrThrow({ where: { slug: cat } });
    await db.product.upsert({ where: { slug }, update: {}, create: { slug, name, brand, categoryId: c.id, price, stock, description: "Producto de ejemplo." } });
  }
  const email = process.env.ADMIN_EMAIL!;
  await db.adminUser.upsert({ where: { email }, update: {}, create: { email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10) } });
}
main().finally(() => db.$disconnect());
