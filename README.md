# Mimbela Ferretería

Un solo repositorio, dos partes:

    mimbela/
    ├── frontend/   Next.js + Tailwind (lo que ve el cliente y el panel /admin)
    ├── backend/    Express + Prisma + PostgreSQL (API, pedidos, pagos, stock)
    ├── docs/       Prompt y contrato de la API
    └── docker-compose.yml   Base de datos local

## Cómo levantarlo (Windows / PowerShell)

    docker compose up -d db
    cd backend
    copy .env.example .env
    npm install
    npx prisma migrate dev --name init
    npm run db:seed
    npm run dev                      # API en http://localhost:4000

    cd ../frontend
    copy .env.example .env.local     # pon NEXT_PUBLIC_API_URL=http://localhost:4000
    npm install
    npm run dev                      # web en http://localhost:3000

Panel: `/admin` (usuario y clave en `backend/.env`).

## Qué pasa cuando alguien compra (para entender el flujo)
1. El carrito vive en el navegador (Zustand). Al pagar, el frontend manda solo `productId` y `qty`.
2. `POST /orders/checkout` (backend/src/routes/orders.ts) lee los precios de la base de datos, valida stock y crea el pedido PENDING_PAYMENT.
3. `payments.ts` crea el pago en la pasarela y devuelve su URL; el cliente paga allí.
4. La pasarela llama a `POST /webhooks/payments`: el pedido pasa a PAID y se descuenta el stock en una transacción.
5. Si elige WhatsApp, el pedido se registra como PENDING_WHATSAPP y el stock se descuenta al marcarlo COMPLETED desde el panel.

## Quién hace qué
- Frontend: todo `frontend/`. Toda llamada al backend sale de `src/lib/api.ts`.
- Backend: todo `backend/`. Si cambia un endpoint, se actualiza `docs/BACKEND_PROMPT.md` en el mismo commit.

## Estado
Hecho: catálogo, búsqueda, ficha, carrito, checkout y WhatsApp, cotizaciones, auth admin, productos, pedidos, importación CSV, estadísticas, panel básico.
Falta: pasarela real (Culqi/Niubiz en `payments.ts`), subida de imágenes (Cloudinary), cuenta de usuario del cliente, crear/editar productos y ver cotizaciones desde el panel, pruebas automáticas, despliegue.
