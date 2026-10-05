import type { Product } from "./types";
export const CATEGORIES = [
  { slug: "herramientas-manuales", name: "Herramientas manuales" },
  { slug: "herramientas-electricas", name: "Herramientas eléctricas" },
  { slug: "pinturas", name: "Pinturas" },
  { slug: "gasfiteria", name: "Gasfitería" },
  { slug: "electricidad", name: "Electricidad" },
  { slug: "construccion", name: "Construcción" },
  { slug: "seguridad", name: "Seguridad industrial" },
  { slug: "tornilleria", name: "Tornillería" },
];
export const money = (n: number) => `S/ ${n.toFixed(2)}`;
const p = (slug: string, name: string, brand: string, category: string, price: number, stock: number,
  description: string, specs: Record<string, string>, oldPrice?: number): Product =>
  ({ id: slug, slug, name, brand, category, price, stock, description, specs, oldPrice });

// DATOS DE EJEMPLO: precios, marcas y stock son ficticios. Se reemplazan por los reales desde la API.
export const MOCK: Product[] = [
  p("martillo-una-16oz", "Martillo de uña 16 oz", "Truper", "herramientas-manuales", 24.9, 40, "Cabeza forjada y mango de fibra de vidrio con empuñadura antideslizante. Sirve para clavar y extraer clavos.", { Peso: "16 oz", Mango: "Fibra de vidrio" }),
  p("destornilladores-6", "Juego de destornilladores 6 piezas", "Stanley", "herramientas-manuales", 39.9, 25, "Tres planos y tres Phillips con punta magnética.", { Piezas: "6", Punta: "Magnética" }),
  p("llave-francesa-10", "Llave francesa 10 pulgadas", "Truper", "herramientas-manuales", 35, 18, "Acero cromado con apertura de hasta 30 mm.", { Largo: "10 in", Apertura: "30 mm" }),
  p("taladro-percutor-650w", "Taladro percutor 650 W", "Bosch", "herramientas-electricas", 289, 9, "Para concreto, madera y metal. Velocidad variable y reversa.", { Potencia: "650 W", Mandril: "13 mm" }, 329),
  p("amoladora-4-1-2", "Amoladora angular 4 1/2 in 850 W", "Bosch", "herramientas-electricas", 249, 12, "Corte y desbaste de metal y albañilería.", { Potencia: "850 W", Disco: "115 mm" }),
  p("pintura-latex-blanco", "Pintura látex blanco 1 galón", "CPP", "pinturas", 69.9, 60, "Acabado mate lavable para interiores y exteriores.", { Rendimiento: "35 m² por galón", Acabado: "Mate" }),
  p("rodillo-9-bandeja", "Rodillo de 9 in con bandeja", "Truper", "pinturas", 18.5, 35, "Felpa media para superficies lisas.", { Ancho: "9 in", Felpa: "Media" }),
  p("tubo-pvc-2", "Tubo PVC desagüe 2 in x 3 m", "Pavco", "gasfiteria", 22, 80, "Tubo de desagüe liviano y resistente a la corrosión.", { Diámetro: "2 in", Largo: "3 m" }),
  p("cable-thw-14", "Cable THW 14 AWG rollo de 100 m", "Indeco", "electricidad", 189, 14, "Conductor de cobre para instalaciones eléctricas interiores.", { Calibre: "14 AWG", Largo: "100 m" }),
  p("casco-seguridad", "Casco de seguridad con ajuste", "Genérico", "seguridad", 14.9, 50, "Suspensión de 4 puntos y ajuste de rueda.", { Material: "Polietileno", Ajuste: "Rueda" }),
  p("tornillo-drywall-1", "Tornillo drywall 1 in caja de 100", "Genérico", "tornilleria", 12.9, 100, "Punta fina para planchas de yeso sobre perfil metálico.", { Cantidad: "100 unidades", Largo: "1 in" }),
  p("cemento-42-5", "Cemento bolsa 42.5 kg", "Sol", "construccion", 31.9, 200, "Cemento Portland para uso general en obra.", { Peso: "42.5 kg", Uso: "General" }),
];
