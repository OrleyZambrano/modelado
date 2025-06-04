This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Next.js + Supabase CRUD

Este proyecto es una aplicación Next.js (TypeScript, Tailwind CSS) conectada a Supabase (Postgres) para realizar operaciones CRUD sobre una tabla de ejemplo.

## ¿Cómo empezar?

1. Copia tu URL y clave anónima de Supabase en un archivo `.env.local` en la raíz:

```
NEXT_PUBLIC_SUPABASE_URL=https://aws-0-us-east-2.pooler.supabase.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

2. Instala el cliente de Supabase:

```
npm install @supabase/supabase-js
```

3. Ejecuta la app:

```
npm run dev
```

4. Edita el código en `src/app/page.tsx` para personalizar la lógica CRUD.

## Estructura
- `src/` — Código fuente principal
- `.env.local` — Variables de entorno (no subir a git)
- `.github/copilot-instructions.md` — Instrucciones para Copilot

## Notas
- Puedes crear la tabla en Supabase desde el panel web.
- El ejemplo base es para una tabla `users` con campos `id`, `name` y `email`.

---

¿Dudas? ¡Pide ayuda en cualquier momento!
