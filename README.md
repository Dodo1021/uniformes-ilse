# Uniformes Ilse

E-commerce y catálogo de uniformes quirúrgicos y zapatos de hospital.
Powered by ¿Y Tu Web?

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- Prisma + PostgreSQL 16
- NextAuth.js v5 (Credentials)
- MercadoPago Checkout Pro
- Docker (multi-stage build)

## Modos de operación

1. **Catálogo (default):** los clientes navegan productos pero no pueden
   comprar. La tienda muestra un banner de configuración.
2. **E-commerce:** se activa automáticamente cuando el admin pega un
   Access Token de MercadoPago válido en `/admin/configuracion`.

El estado vive en la tabla `Setting` (`mp_status`), no en variables de entorno.

## Desarrollo local

```bash
cp .env.example .env
# editar .env y poner tu DATABASE_URL
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Admin: `http://localhost:3000/admin/login` con las credenciales de `.env`.

## Producción (Coolify)

- Imagen: `Dockerfile` multi-stage (`output: standalone`)
- Volumen: monta `/app/public/uploads` para persistir imágenes subidas
- Migraciones: `npx prisma migrate deploy && npx prisma db seed`

Variables requeridas: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD`.
