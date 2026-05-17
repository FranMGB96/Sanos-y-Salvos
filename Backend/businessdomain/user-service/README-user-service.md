# 👤 user-service

Microservicio encargado del registro, autenticación y gestión de usuarios de la plataforma Sanos y Salvos.

---

## 📋 Responsabilidades

- Registro de nuevos usuarios
- Autenticación con JWT
- Gestión de roles (OWNER, CITIZEN, ORG, ADMIN)
- CRUD de usuarios para el panel de administración
- Creación automática del usuario ADMIN al iniciar

---

## ⚙️ Configuración

| Propiedad | Valor |
|---|---|
| Puerto | 8081 |
| Base de datos | MySQL — `user_db` (puerto 3307) |
| Registro | Eureka Server :8761 |
| Config | Config Server :8888 |

---

## 🚀 Ejecución local

### Requisitos previos
```bash
# Levantar la base de datos
docker compose up -d user-db
```

### Ejecutar
```bash
cd businessdomain/user-service
mvn spring-boot:run
```

---

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registro de usuario |
| POST | `/auth/login` | No | Login, retorna JWT |
| GET | `/users` | JWT | Listar todos los usuarios |
| GET | `/users/{id}` | JWT | Obtener usuario por ID |
| PUT | `/users/{id}` | JWT | Actualizar usuario (nombre, email, rol, active) |
| DELETE | `/users/{id}` | JWT | Desactivar usuario (soft delete) |

---

## 🔑 Roles disponibles

| Rol | Descripción |
|---|---|
| `OWNER` | Dueño de mascota (rol por defecto al registrarse) |
| `CITIZEN` | Ciudadano que reporta mascotas |
| `ORG` | Organización rescatista |
| `ADMIN` | Administrador con acceso total |

---

## 🗄️ Modelo de datos

```
users
├── id          BIGINT (PK)
├── nombre      VARCHAR
├── email       VARCHAR (único)
├── password    VARCHAR (BCrypt)
├── rol         ENUM(OWNER, CITIZEN, ORG, ADMIN)
├── active      BOOLEAN
└── created_at  DATETIME
```

---

## 🔍 Swagger UI

```
http://localhost:8081/swagger-ui/index.html
```
