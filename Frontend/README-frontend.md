# 🐾 Sanos y Salvos — Frontend

Aplicación web desarrollada en Angular 17 para la plataforma de reportes de mascotas perdidas y encontradas.

---

## 🧩 Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts        # Protege rutas para usuarios autenticados
│   │   │   └── admin.guard.ts       # Protege rutas exclusivas del administrador
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Adjunta el JWT a cada petición HTTP
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── pet.model.ts
│   │   │   └── report.model.ts
│   │   └── services/
│   │       ├── auth.service.ts      # Login, registro y manejo de sesión
│   │       ├── pet.service.ts       # CRUD de mascotas
│   │       └── report.service.ts    # CRUD de reportes y dashboard
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/               # Pantalla de inicio de sesión
│   │   │   └── register/            # Pantalla de registro
│   │   ├── dashboard/               # Inicio con estadísticas y últimos reportes
│   │   ├── pets/
│   │   │   ├── pet-list/            # Listado de mascotas
│   │   │   └── pet-form/            # Formulario crear/editar mascota
│   │   ├── reports/
│   │   │   ├── report-list/         # Listado de reportes con filtros
│   │   │   └── report-form/         # Formulario crear reporte con geolocalización
│   │   ├── admin/
│   │   │   └── admin-panel/         # Panel de administración (solo ADMIN)
│   │   └── about/                   # Página "Nosotros"
│   └── shared/
│       └── components/
│           └── navbar/              # Barra de navegación y footer
├── environments/
│   ├── environment.ts               # Desarrollo (localhost:8080)
│   └── environment.prod.ts          # Producción
└── styles.css                       # Estilos globales
```

---

## ⚙️ Requisitos

- Node.js 18+
- npm 9+
- Angular CLI 17

```bash
npm install -g @angular/cli@17
```

---

## 🚀 Instalación y ejecución

### 1. Instalar dependencias

```bash
cd Frontend
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación estará disponible en:
```
http://localhost:4200
```

> El backend debe estar corriendo en `http://localhost:8080` antes de iniciar el frontend.

### 3. Build para producción

```bash
npm run build
```

Los archivos compilados quedan en `dist/frontend/`.

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Protección |
|---|---|---|
| `/login` | LoginComponent | Pública |
| `/register` | RegisterComponent | Pública |
| `/nosotros` | AboutComponent | Pública |
| `/inicio` | DashboardComponent | Autenticado |
| `/pets` | PetListComponent | Autenticado |
| `/pets/new` | PetFormComponent | Autenticado |
| `/pets/edit/:id` | PetFormComponent | Autenticado |
| `/reports` | ReportListComponent | Autenticado |
| `/reports/new` | ReportFormComponent | Autenticado |
| `/admin` | AdminPanelComponent | Solo ADMIN |

---

## 🔐 Autenticación

El frontend usa JWT almacenado en `localStorage`. El `AuthInterceptor` agrega automáticamente el token a cada petición HTTP:

```
Authorization: Bearer <token>
```

La sesión persiste entre recargas de página. Al hacer logout se limpian el token y los datos del usuario.

---

## ⚙️ Variables de entorno

Editar `src/environments/environment.ts` para cambiar la URL del backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

## 🐳 Ejecución con Docker

```bash
# Desde la carpeta Frontend
docker build -t sanos-y-salvos-frontend .
docker run -p 4200:80 sanos-y-salvos-frontend
```

---

## 📦 Dependencias principales

| Paquete | Versión | Uso |
|---|---|---|
| `@angular/core` | 17.3.0 | Framework principal |
| `@angular/router` | 17.3.0 | Navegación y rutas |
| `@angular/forms` | 17.3.0 | Formularios reactivos y template-driven |
| `@angular/common/http` | 17.3.0 | Peticiones HTTP |
| `rxjs` | 7.8.0 | Programación reactiva |

---

## 👤 Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@sanosysalvos.cl | admin1 | ADMIN |

Para probar con usuario normal, registrar una cuenta nueva en `/register`.
