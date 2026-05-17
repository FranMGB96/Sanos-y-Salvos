# 🐾 Sanos y Salvos — Backend

Sistema de reportes de mascotas perdidas desarrollado con arquitectura de microservicios usando Spring Boot, Spring Cloud y Docker.

---

## 📐 Arquitectura

```
                        ┌─────────────┐
                        │   Frontend  │
                        │  Angular    │
                        └──────┬──────┘
                               │ :4200
                        ┌──────▼──────┐
                        │ API Gateway │  :8080
                        │Spring Cloud │
                        └──────┬──────┘
               ┌───────────────┼───────────────┐
               │               │               │
        ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐
        │user-service│  │pet-service │  │report-svc  │
        │   :8081    │  │   :8082    │  │   :8083    │
        └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
               │               │               │
           user-db          pet-db         report-db
           :3307            :3308           :3309

        ┌─────────────┐    ┌─────────────┐
        │bff-service  │    │eureka-server│
        │   :8084     │    │   :8761     │
        └─────────────┘    └─────────────┘
        ┌─────────────┐
        │config-server│
        │   :8888     │
        └─────────────┘
```

---

## 🧩 Microservicios

| Servicio | Puerto | Descripción |
|---|---|---|
| `api-gateway` | 8080 | Punto de entrada único, valida JWT |
| `user-service` | 8081 | Registro, login y gestión de usuarios |
| `pet-service` | 8082 | Gestión de mascotas |
| `report-service` | 8083 | Reportes de mascotas perdidas/encontradas |
| `bff-service` | 8084 | Backend For Frontend, agrega datos para el dashboard |
| `eureka-server` | 8761 | Service Registry |
| `config-server` | 8888 | Configuración centralizada |

---

## ⚙️ Requisitos

- Java 21
- Maven 3.9+
- Docker y Docker Compose
- IntelliJ IDEA (recomendado)

---

## 🚀 Ejecución con Docker Compose

### 1. Clonar el repositorio

```bash
git clone <url-repositorio>
cd Backend
```

### 2. Levantar todo el stack

```bash
docker compose up --build
```

### 3. Levantar solo las bases de datos (desarrollo local)

```bash
docker compose up -d user-db pet-db report-db
```

---

## 🖥️ Ejecución local (IntelliJ)

Ejecutar los servicios en este orden:

```
1. EurekaServerApplication    → :8761
2. ConfigServerApplication    → :8888
3. UserServiceApplication     → :8081
4. PetServiceApplication      → :8082
5. ReportServiceApplication   → :8083
6. ApiGatewayApplication      → :8080
7. BffServiceApplication      → :8084
```

---

## 🔐 Credenciales por defecto

| Usuario | Email | Contraseña | Rol |
|---|---|---|---|
| Administrador | admin@sanosysalvos.cl | admin1 | ADMIN |

---

## 📡 Endpoints principales (vía API Gateway)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login |
| GET | `/api/users` | Listar usuarios (admin) |
| PUT | `/api/users/{id}` | Actualizar usuario |
| GET | `/api/pets` | Listar mascotas |
| POST | `/api/pets` | Crear mascota |
| GET | `/api/reports` | Listar reportes |
| POST | `/api/reports` | Crear reporte |
| GET | `/api/bff/dashboard` | Dashboard con estadísticas |

---

## 🔍 Monitoreo

| URL | Descripción |
|---|---|
| http://localhost:8761 | Eureka Dashboard |
| http://localhost:8084/actuator/circuitbreakers | Estado Circuit Breakers |
| http://localhost:8081/swagger-ui/index.html | Swagger user-service |
| http://localhost:8082/swagger-ui/index.html | Swagger pet-service |
| http://localhost:8083/swagger-ui/index.html | Swagger report-service |
