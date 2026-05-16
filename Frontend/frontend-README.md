# 🐾 Sanos y Salvos — Frontend Angular

Interfaz de usuario para la plataforma de recuperación de mascotas perdidas.

## Stack

- **Angular 17** con standalone components y lazy loading
- **TypeScript 5.4**
- **Leaflet.js** para mapas interactivos
- **OpenStreetMap** (sin API key requerida)

## Prerrequisitos

- Node.js 20 o superior
- Angular CLI 17

```bash
node -v        # debe ser >= 20
npm -v         # debe ser >= 9
```

Si no tienes Angular CLI instalado:
```bash
npm install -g @angular/cli@17
```

## Instalación

```bash
# 1. Navegar a la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install
```

## Ejecución en desarrollo

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:4200**

> El backend debe estar corriendo en el puerto 8080 antes de iniciar el frontend.

## Build para producción

```bash
npm run build
```

Los archivos compilados quedan en `dist/frontend/browser/`.

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript (User, Pet, Report)
│   │   ├── services/        # AuthService, PetService, ReportService
│   │   ├── guards/          # AuthGuard — protege rutas privadas
│   │   └── interceptors/    # AuthInterceptor — agrega JWT a cada request
│   ├── features/
│   │   ├── auth/            # Login y Registro
│   │   ├── dashboard/       # Pantalla principal con estadísticas
│   │   ├── pets/            # Listado y formulario de mascotas
│   │   └── reports/         # Listado y formulario de reportes (con mapa)
│   └── shared/
│       └── components/      # Navbar
├── environments/
│   ├── environment.ts       # URL del API en desarrollo
│   └── environment.prod.ts  # URL del API en producción
└── styles.css               # Estilos globales
```

## Variables de entorno

El archivo `src/environments/environment.ts` define la URL base del API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Si el backend corre en otro puerto, actualiza `apiUrl` antes de iniciar.

## Funcionalidades principales

| Pantalla | Ruta | Descripción |
|---|---|---|
| Login | `/login` | Autenticación con email y contraseña |
| Registro | `/register` | Crear cuenta nueva |
| Dashboard | `/dashboard` | Estadísticas generales y últimos reportes |
| Mascotas | `/pets` | Listar, crear y editar mascotas |
| Reportes | `/reports` | Listar reportes con filtros por tipo |
| Nuevo reporte | `/reports/new` | Formulario con mapa interactivo |

## Ejecución con Docker

```bash
# Desde la raíz del proyecto
docker compose up --build frontend
```

La app estará disponible en **http://localhost:4200** servida por Nginx.

## Notas

- El mapa de reportes usa **Leaflet + OpenStreetMap** — no requiere API key.
- Al crear un reporte, el mapa se centra automáticamente en la ubicación del usuario (requiere permiso del browser).
- El token JWT se almacena en `localStorage` y se envía automáticamente en cada request mediante el interceptor.
