# Prompt para el backend de Mimbela Ferretería

Copia este texto en tu asistente de IA (o úsalo como guía) para construir el backend.

---

Actúa como ingeniero backend senior. Necesito construir el backend de una tienda online para una ferretería peruana llamada Mimbela. El frontend (Next.js 14) ya está hecho por mi compañero y consume la API descrita abajo. No cambies el contrato sin avisarme.

## Stack
- Node.js 20 + TypeScript, con NestJS (o Express si prefieres) y validación con class-validator o Zod.
- PostgreSQL + Prisma ORM, con migraciones y un seed con productos de ejemplo.
- Autenticación JWT para administradores (contraseñas con bcrypt/argon2).
- Imágenes en Cloudinary. Importación masiva por CSV/Excel.
- Pasarela de pagos: Culqi (alternativa: Niubiz). Moneda PEN.
- Docker Compose para desarrollo local, variables en `.env` con `.env.example`, documentación OpenAPI/Swagger en `/docs`.

## Modelo de datos (mínimo)
- Category(id, slug único, name)
- Product(id, slug único, name, brand, categoryId, price Decimal(10,2), oldPrice?, stock Int, description, specs Json, images String[], active Boolean, timestamps)
- Order(id, code legible, customerName, customerPhone, customerEmail, total, status [PENDING_PAYMENT, PAID, PENDING_WHATSAPP, PREPARING, COMPLETED, CANCELLED], channel [ONLINE, WHATSAPP], paymentRef?, timestamps)
- OrderItem(orderId, productId, nameSnapshot, priceSnapshot, qty)
- Quote(id, name, phone, email?, message, items Json, status, timestamps)
- AdminUser(id, email único, passwordHash, role [ADMIN, STAFF])

## Contrato que el frontend ya consume
Las respuestas van envueltas en `{ "data": ... }`. El producto se serializa así (price y oldPrice como número, category es el slug):
`{ id, slug, name, brand, category, price, oldPrice?, stock, description, specs: {clave: valor}, images: string[] }`

Públicos:
- GET /products?q=&category=&page=&limit= → { data: Product[] } (solo activos)
- GET /products/:slug → { data: Product } o 404
- GET /categories → { data: [{ slug, name }] }
- POST /orders/checkout  body { customer: {name, phone, email}, items: [{productId, qty}] } → 201 { orderId, paymentUrl }
  El servidor recalcula precios desde la base de datos (nunca confiar en precios del cliente), valida stock y crea el cargo/orden en la pasarela.
- POST /orders/whatsapp (opcional pero recomendado): registra el pedido como PENDING_WHATSAPP para que la tienda lo tenga en el panel.
- POST /quotes → cotización por volumen.
- POST /webhooks/payments → confirmación de la pasarela: verificar firma, ser idempotente, marcar PAID y descontar stock en una transacción.

Admin (JWT, rol ADMIN o STAFF):
- POST /auth/login, GET /auth/me
- CRUD /admin/products y /admin/categories
- POST /admin/products/import (CSV/Excel con validación y reporte de filas con error)
- POST /admin/uploads (imagen a Cloudinary)
- GET /admin/orders, GET /admin/orders/:id, PATCH /admin/orders/:id/status
- GET /admin/quotes, PATCH /admin/quotes/:id
- GET /admin/stats (ventas por día, productos más vendidos, stock bajo)

## Reglas de negocio y seguridad
- Descontar stock solo al confirmarse el pago (online) o al marcar el pedido como completado (WhatsApp). Evitar stock negativo con transacciones.
- CORS limitado al dominio del frontend, rate limiting en login y checkout, helmet, logs de errores, sin exponer datos internos.
- Errores con formato `{ message, code }` y mensajes en español claros para el usuario.
- Paginación en listados. Índices en slug, categoryId y búsqueda por nombre.

## Cómo quiero que trabajes
1. Primero propón la estructura de carpetas y el esquema Prisma, y espera mi confirmación.
2. Luego implementa por fases: (a) catálogo público + seed, (b) auth + admin de productos, (c) pedidos y checkout con Culqi en modo prueba, (d) cotizaciones, importación y estadísticas.
3. En cada fase incluye pruebas (Jest) de lo crítico: checkout, webhook y stock.
4. Entrega al final: guía de despliegue (Railway/Render o VPS), respaldos automáticos de la base de datos y cómo cargar los productos reales de Mimbela.
