import { money } from "./products";
import type { CartItem } from "./types";
export const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "51900000000";
export const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
export function cartMessage(items: CartItem[], total: number) {
  const lines = items.map((i) => `- ${i.qty} x ${i.product.name} (${money(i.product.price * i.qty)})`);
  return `Hola Mimbela, quiero hacer este pedido:\n${lines.join("\n")}\nTotal: ${money(total)}`;
}
