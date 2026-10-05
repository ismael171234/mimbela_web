import type { Order } from "@prisma/client";
// Aquí se conecta Culqi o Niubiz. Sin CULQI_SECRET devuelve una URL simulada para desarrollo.
export async function createPayment(o: Order): Promise<string> {
  if (!process.env.CULQI_SECRET) return `${process.env.FRONTEND_URL}/gracias?order=${o.code}`;
  throw new Error("Pendiente: crear la orden de pago en la pasarela y devolver su URL");
}
