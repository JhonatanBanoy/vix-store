# Vix — Tienda online

Tienda de dropshipping construida con **Next.js 15 + React 19**.

## Requisitos

- Node.js 18+
- Docker Desktop (para el backend y MongoDB)

## Arranque del proyecto

### 1. Backend + base de datos (Docker)

```bash
cd "C:\Users\Jhonatan\Documents\trabajos de VSC\ecommerce-api\ecommerce-api"
docker compose up -d
```

Esto levanta:

- `api-1` → backend en `http://localhost:5000`
- `mongo` → MongoDB en `localhost:27017`

### 2. Frontend

```bash
cd "C:\Users\Jhonatan\Documents\trabajos de VSC\React\my_project"
npm run dev
```

Abrir: **http://localhost:3000**

## Variables de entorno

El archivo `.env.local` contiene:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Todas las peticiones al backend deben usar `API_URL` desde `lib/api.js`.
No escribir URLs fijas en los componentes.

## Estructura

```
app/            → rutas y páginas (App Router)
components/     → componentes reutilizables
context/        → estado global (carrito)
lib/            → utilidades y cliente HTTP
public/         → imágenes y assets estáticos
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `:3000` |
| `npm run build` | Compila para producción |
| `npm run start` | Sirve la versión compilada |
| `npm run lint` | Análisis de código |

## Notas

- El backend **no** vive en este proyecto: está en `ecommerce-api\ecommerce-api`.
- No ejecutar `npm run dev` del backend en local mientras el contenedor Docker esté activo (choque en el puerto 5000).
- No borrar el volumen `ecommerce-api_mongo_data`: contiene los datos.
