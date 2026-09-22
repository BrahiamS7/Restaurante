# La Brasa — Sistema de gestión

Sistema de gestión interno para un restaurante de parrilla/asador: control de mesas, pedidos, turnos de caja, productos del menú y personal de meseros. Pensado para uso en piso por meseros y administración, no para clientes finales.

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | Node.js + Express 5, Prisma ORM 7 (driver adapter `@prisma/adapter-pg`), PostgreSQL |
| Autenticación | JWT (`jsonwebtoken`) + `bcrypt` para hashes de contraseña |
| Frontend | React 19 + Vite, React Router 7 |
| Estilos | CSS con tokens propios (sin framework), tipografías Big Shoulders + Archivo |

## Estructura del repo

```
proyectoRestaurante/
├── backend/
│   ├── controllers/       # Lógica de negocio por recurso
│   ├── routes/             # Definición de endpoints Express
│   ├── middleware/          # Auth (JWT) y validación de parámetros
│   ├── prisma/              # schema.prisma + migraciones
│   └── index.js / server.js
└── frontend/
    ├── src/pages/           # Una página por sección (Mesas, Pedidos, Productos...)
    ├── src/components/       # Sidebar, modales, logo, theme toggle
    ├── src/context/          # ThemeContext (claro/oscuro)
    └── src/services/api.js  # Cliente HTTP hacia el backend
```

## Requisitos previos

- Node.js 20+
- PostgreSQL corriendo localmente (o accesible por URL)

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
```

Crea un archivo `backend/.env` con:

```bash
DATABASE_URL="postgresql://usuario:password@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="una-cadena-larga-y-aleatoria"
```

Aplica las migraciones y genera el cliente de Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

Levanta el servidor (puerto `3000` por defecto):

```bash
npm run dev     # con recarga automática (nodemon)
npm start       # sin recarga
```

No existe un endpoint para crear el primer administrador: se crea manualmente en la tabla `Administrador` con un hash de `bcrypt` en `password`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173` y apunta al backend en `http://localhost:3000` (ver `src/services/api.js`).

## Autenticación

Todas las rutas del backend requieren un JWT válido en el header `Authorization: Bearer <token>`, **excepto**:

- `GET /` (healthcheck)
- `POST /admin/login`

`POST /admin/login` valida usuario/contraseña y devuelve un token con expiración de 8 horas. El frontend lo guarda en `localStorage` y lo adjunta automáticamente en cada request; si el backend responde `401`, el token se limpia.

## Modelo de datos

- **Administrador** — usuario del panel (login).
- **Mesero** — personal de piso; puede desactivarse sin borrarse.
- **Mesa** — estado `LIBRE / OCUPADA / RESERVADA`; puede desactivarse.
- **Producto** — ítem de menú con `categoria` (`PLATO_FUERTE`, `ENTRADA`, `BEBIDA`, `POSTRE`, `OTRO`) y precio decimal.
- **Turno** — sesión de caja (`ABIERTO / CERRADO`); agrupa los pedidos facturados de un periodo.
- **Pedido** — orden de una mesa, asociada a un mesero y a un turno; estado `PENDIENTE / EN_PROCESO / CANCELADO / FACTURADO`.
- **Contenido** — línea de un pedido (producto + cantidad + observaciones); marca `enviadoACocina` al generar el ticket.

## API

Base URL: `http://localhost:3000`. Todo protegido con JWT salvo lo indicado.

### Admin / Meseros (`/admin`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/admin/login` | Login, devuelve `{ token }`. **Público** |
| POST | `/admin/mesero` | Crear mesero |
| GET | `/admin/meseros?activo=true\|false` | Listar meseros |
| GET | `/admin/mesero/:id` | Obtener mesero |
| PUT | `/admin/mesero/:id` | Actualizar nombre |
| PUT | `/admin/mesero/:id/desactivar` | Desactivar (si no tiene pedidos activos) |
| PUT | `/admin/mesero/:id/reactivar` | Reactivar |

### Mesas (`/mesas`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/mesas` | Crear mesa |
| GET | `/mesas?activo=todos` | Listar mesas (activas por defecto) |
| GET | `/mesas/:id` | Obtener mesa |
| PUT | `/mesas/:id/desactivar` | Desactivar (si no está `OCUPADA`) |
| PUT | `/mesas/:id/reactivar` | Reactivar |

### Productos (`/productos`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/productos` | Crear producto |
| GET | `/productos` | Listar productos activos |
| GET | `/productos/categoria/:categoria` | Filtrar por categoría |
| GET | `/productos/:id` | Obtener producto |
| PUT | `/productos/:id/desactivar` | Desactivar |
| PUT | `/productos/:id/actualizar` | Actualizar nombre/precio/categoría |

### Pedidos (`/pedidos`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/pedidos` | Crear pedido (requiere mesa `LIBRE` y turno abierto) |
| GET | `/pedidos?estado=&turno_id=` | Listar (activos por defecto, o `estado=todos`) |
| GET | `/pedidos/:id` | Obtener pedido con total calculado |
| PUT | `/pedidos/:id/estado` | Cambiar estado |
| POST | `/pedidos/:id/facturar` | Facturar y liberar la mesa |
| POST | `/pedidos/:id/cancelar` | Cancelar y liberar la mesa |
| GET | `/pedidos/:id/contenidos` | Listar productos del pedido |
| POST | `/pedidos/:id/ticket` | Generar ticket de cocina (marca contenidos como enviados) |

### Contenidos (`/contenidos`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/contenidos` | Agregar producto a un pedido |
| PUT | `/contenidos/:id` | Actualizar cantidad/observaciones |
| DELETE | `/contenidos/:id` | Quitar del pedido |

### Turnos (`/turnos`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/turnos` | Abrir turno (solo si no hay uno abierto) |
| GET | `/turnos?desde=&hasta=` | Listar turnos |
| GET | `/turnos/actual` | Turno abierto actual |
| GET | `/turnos/:id` | Detalle de un turno con sus pedidos |
| POST | `/turnos/:id/cerrar` | Cerrar turno (requiere todos los pedidos facturados o cancelados) |

## Scripts

| Comando | Dónde | Qué hace |
| --- | --- | --- |
| `npm run dev` | `backend/` | Servidor con recarga (nodemon) |
| `npm start` | `backend/` | Servidor sin recarga |
| `npm run dev` | `frontend/` | Vite dev server |
| `npm run build` | `frontend/` | Build de producción |
| `npm run lint` | `frontend/` | ESLint |
