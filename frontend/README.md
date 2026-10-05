# Mimbela Ferretería (frontend)

Next.js 14 (App Router) + TypeScript + Tailwind + Zustand.

    npm install
    cp .env.example .env.local
    npm run dev

- Sin `NEXT_PUBLIC_API_URL` la web usa productos de ejemplo (`src/lib/products.ts`).
- Con la URL del backend, consume la API definida en `../docs/BACKEND_PROMPT.md`.
- Toda la comunicación con el backend vive en `src/lib/api.ts`.
- `NEXT_PUBLIC_WHATSAPP`: número con código de país, sin `+`.

Pendiente: panel admin, cotizaciones, cuenta de usuario, página de contacto, fotos y logo reales.
