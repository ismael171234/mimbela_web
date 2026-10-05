// Convierte un producto de la base de datos a la forma que espera el frontend.
export const ser = (p: any) => ({
  id: p.id, slug: p.slug, name: p.name, brand: p.brand, category: p.category.slug,
  price: Number(p.price), oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
  stock: p.stock, description: p.description, specs: p.specs, images: p.images,
});
