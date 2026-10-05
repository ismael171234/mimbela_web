export type Product = {
  id: string; slug: string; name: string; brand: string;
  category: string; // slug de la categoría
  price: number; oldPrice?: number; stock: number;
  description: string; specs: Record<string, string>; images?: string[];
};
export type CartItem = { product: Product; qty: number };
export type Customer = { name: string; phone: string; email: string };
