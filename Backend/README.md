# 🐾 Sanos y Salvos — Plataforma de Recuperación de Mascotas

Proyecto semestral **DSY1106 Desarrollo Fullstack III** — DuocUC  
Arquitectura de **microservicios Maven multi-módulo** con Spring Boot 3.2 + Angular 17 + Docker

---

## 🏗️ Estructura del proyecto (Maven multi-módulo)

```
sanos-y-salvos/                          ← pom.xml PADRE
├── pom.xml                              ← gestiona versiones de todos los módulos
│
├── businessdomain/                      ← módulo agrupador: lógica de negocio
│   ├── pom.xml
│   ├── user-service/                    ← usuarios + autenticación JWT (puerto 8081)
│   ├── pet-service/                     ← gestión de mascotas (puerto 8082)
│   └── report-service/                  ← reportes perdidos/encontrados (puerto 8083)
│
├── infrastructure/                      ← módulo agrupador: infraestructura
│   ├── pom.xml
│   ├── eureka-server/                   ← service discovery (puerto 8761)
│   ├── config-server/                   ← configuración centralizada (puerto 8888)
│   ├── api-gateway/                     ← punto de entrada + JWT filter (puerto 8080)
│   └── bff-service/                     ← backend for frontend (puerto 8084)
│
├── frontend/                            ← Angular 17 SPA (puerto 4200)
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 17 (standalone components, lazy loading) |
| API Gateway | Spring Cloud Gateway |
| Service Discovery | Netflix Eureka |
| Config Server | Spring Cloud Config |
| Microservicios | Spring Boot 3.2 + Spring Data JPA |
| Seguridad | JWT (jjwt 0.11.5) + Spring Security |
| Base de datos | MySQL 8.0 (una BD por microservicio) |
| Comunicación | RestTemplate + Load Balancer |
| Contenedores | Docker + Docker Compose |
| Build | Maven multi-módulo |
| Documentación | Swagger / OpenAPI 3 |

---

## ✅ Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ← **el más importante**
- [Git](https://git-scm.com/)
- Java 17 + Maven 3.9 *(solo para correr sin Docker)*
- Node.js 20 + Angular CLI *(solo para correr frontend sin Docker)*

---

## 🚀 Levantar el proyecto completo

### Opción A — Todo con Docker (recomendado para entrega)

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/sanos-y-salvos.git
cd sanos-y-salvos

# 2. Levantar TODO el sistema con un solo comando
docker compose up --build

# 3. Esperar ~3-4 minutos (la primera vez compila todos los servicios)
# Ver progreso:
docker compose logs -f
```

Cuando esté listo verás en los logs: `Started UserServiceApplication`, `Started PetServiceApplication`, etc.

### URLs disponibles tras levantar

| Servicio | URL | Descripción |
|---|---|---|
| 🌐 Frontend | http://localhost:4200 | Aplicación Angular |
| 🔀 API Gateway | http://localhost:8080 | Punto de entrada único |
| 📋 Eureka Dashboard | http://localhost:8761 | Ver todos los servicios registrados |
| ⚙️ Config Server | http://localhost:8888 | Ver config: `/user-service/default` |
| 👤 User Swagger | http://localhost:8081/swagger-ui.html | API de usuarios |
| 🐾 Pet Swagger | http://localhost:8082/swagger-ui.html | API de mascotas |
| 📝 Report Swagger | http://localhost:8083/swagger-ui.html | API de reportes |
| 🔗 BFF Swagger | http://localhost:8084/swagger-ui.html | API del BFF |

### Opción B — Infraestructura en Docker, servicios en IntelliJ

```bash
# Solo levantar bases de datos + infraestructura
docker compose up user-db pet-db report-db eureka-server config-server -d

# Luego abrir cada servicio en IntelliJ y ejecutar con Run
# Orden recomendado:
# 1. eureka-server
# 2. config-server
# 3. user-service, pet-service, report-service (cualquier orden)
# 4. api-gateway
# 5. bff-service

# Frontend por separado
cd frontend
npm install
npm start
```

---

## 🔑 Primeros pasos: probar la API

### 1. Registrar usuario (ruta pública)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Francisco",
    "email": "francisco@duocuc.cl",
    "password": "123456",
    "rol": "OWNER"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "nombre": "Francisco",
  "rol": "OWNER"
}
```

### 2. Registrar mascota (requiere token)

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

curl -X POST http://localhost:8080/api/pets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais",
    "especie": "perro",
    "raza": "Labrador",
    "color": "Amarillo",
    "tamanio": "GRANDE",
    "ownerId": 1
  }'
```

### 3. Crear reporte de mascota perdida

```bash
curl -X POST http://localhost:8080/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "PERDIDO",
    "descripcion": "Se perdió en el Parque O Higgins el sábado en la tarde",
    "ubicacionDescripcion": "Parque O Higgins, Santiago Centro",
    "petId": 1,
    "reporterUserId": 1
  }'
```

### 4. Ver dashboard del BFF

```bash
curl http://localhost:8080/api/bff/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🗃️ Bases de datos

Cada microservicio tiene **su propia base de datos MySQL** — principio fundamental de microservicios.

| Servicio | Base de datos | Puerto externo | Usuario | Contraseña |
|---|---|---|---|---|
| user-service | user_db | 3307 | root | root |
| pet-service | pet_db | 3308 | root | root |
| report-service | report_db | 3309 | root | root |

**Conectarse con MySQL Workbench:**
- Host: `localhost`
- Puerto: el que corresponda (3307, 3308 o 3309)
- Usuario/contraseña: `root` / `root`

Las tablas se crean automáticamente al levantar los servicios (`ddl-auto: update`).

### Modelo de datos

**user_db.users**
```sql
id | nombre | email | password | rol | active | created_at
```
Roles disponibles: `OWNER`, `CITIZEN`, `ORG`, `ADMIN`

**pet_db.pets**
```sql
id | nombre | especie | raza | color | tamanio | foto_url | descripcion | owner_id | active | created_at
```
Tamaños: `PEQUENIO`, `MEDIANO`, `GRANDE`

**report_db.reports**
```sql
id | tipo | descripcion | latitud | longitud | ubicacion_descripcion | pet_id | reporter_user_id | estado | created_at | updated_at
```
Tipos: `PERDIDO`, `ENCONTRADO`  
Estados: `ACTIVO`, `RESUELTO`, `CERRADO`

---

## ⚙️ Config Server — configuración centralizada

El **Config Server** (puerto 8888) centraliza los `application.yml` de todos los servicios.
Están en `infrastructure/config-server/src/main/resources/config/`:

```
config/
├── user-service.yml      ← datasource + jwt config
├── pet-service.yml       ← datasource config
├── report-service.yml    ← datasource config
├── api-gateway.yml       ← rutas + jwt secret
└── bff-service.yml       ← URLs de servicios
```

Ventaja: cambias la config en **un solo lugar** sin tocar cada servicio.

Para ver la config activa de un servicio:
```
http://localhost:8888/user-service/default
http://localhost:8888/api-gateway/default
```

---

## 🧪 Ejecutar tests

```bash
# Todos los tests desde la raíz del proyecto
mvn test

# Solo un servicio específico
mvn test -pl businessdomain/user-service
mvn test -pl businessdomain/pet-service
mvn test -pl businessdomain/report-service
```

---

## 🔧 Comandos Docker útiles

```bash
# Ver estado de todos los contenedores
docker compose ps

# Logs de un servicio específico
docker compose logs -f user-service
docker compose logs -f config-server
docker compose logs -f api-gateway

# Reiniciar un servicio sin reconstruir
docker compose restart pet-service

# Reconstruir un servicio tras cambios en el código
docker compose up --build user-service

# Detener todo (mantiene los datos en BD)
docker compose down

# Detener todo y borrar las bases de datos (reset completo)
docker compose down -v

# Ver IP interna de un contenedor
docker inspect user-service | grep IPAddress
```

---

## 📌 Referencia de endpoints

### Auth (públicos — sin JWT)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Login → retorna JWT |

### Usuarios (requieren JWT)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Listar todos |
| GET | `/api/users/{id}` | Ver por ID |
| PUT | `/api/users/{id}` | Actualizar |
| DELETE | `/api/users/{id}` | Desactivar (soft delete) |

### Mascotas (requieren JWT)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pets` | Listar activas |
| GET | `/api/pets/{id}` | Ver por ID |
| GET | `/api/pets/owner/{ownerId}` | Por dueño |
| GET | `/api/pets/especie/{especie}` | Por especie |
| POST | `/api/pets` | Crear |
| PUT | `/api/pets/{id}` | Actualizar |
| DELETE | `/api/pets/{id}` | Desactivar |

### Reportes (requieren JWT)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/reports` | Listar todos |
| GET | `/api/reports/tipo/{tipo}` | Por tipo (PERDIDO/ENCONTRADO) |
| GET | `/api/reports/estado/{estado}` | Por estado |
| GET | `/api/reports/usuario/{userId}` | Por usuario |
| GET | `/api/reports/mascota/{petId}` | Por mascota |
| POST | `/api/reports` | Crear |
| PUT | `/api/reports/{id}` | Actualizar |
| PATCH | `/api/reports/{id}/estado?estado=RESUELTO` | Cambiar estado |
| DELETE | `/api/reports/{id}` | Cerrar |

### BFF (requieren JWT) — vistas compuestas para el frontend
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/bff/dashboard` | Estadísticas + últimos 5 reportes |
| GET | `/api/bff/reportes` | Reportes con datos de mascota incluidos |
| GET | `/api/bff/reportes/tipo/{tipo}` | Filtrados + detalle mascota |
| GET | `/api/bff/reportes/usuario/{userId}` | Por usuario + detalle mascota |
| GET | `/api/bff/usuarios/{userId}/mascotas` | Perfil usuario + sus mascotas |

---

## 👥 División del trabajo

| Integrante | Responsabilidades |
|---|---|
| **Francisco** | Infraestructura: Eureka, Config Server, API Gateway, BFF. Integración general. |
| **Compañero** | Business Domain: Pet Service, Report Service. Frontend Angular. Testing. |

---

## 🎓 Información académica

- **Ramo:** DSY1106 Desarrollo Fullstack III
- **Institución:** DuocUC
- **Proyecto:** Sanos y Salvos — Plataforma de recuperación de mascotas perdidas
