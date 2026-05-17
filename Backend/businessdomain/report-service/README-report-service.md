# 📋 report-service

Microservicio encargado de la gestión de reportes de mascotas perdidas y encontradas en la plataforma Sanos y Salvos.

---

## 📋 Responsabilidades

- Creación y gestión de reportes de mascotas perdidas o encontradas
- Geolocalización de reportes (latitud y longitud)
- Cambio de estado de reportes (ACTIVO, RESUELTO, CERRADO)
- Control de acceso: solo el creador del reporte o un ADMIN puede modificarlo
- Soft delete de reportes

---

## ⚙️ Configuración

| Propiedad | Valor |
|---|---|
| Puerto | 8083 |
| Base de datos | MySQL — `report_db` (puerto 3309) |
| Registro | Eureka Server :8761 |
| Config | Config Server :8888 |

---

## 🚀 Ejecución local

### Requisitos previos
```bash
docker compose up -d report-db
```

### Ejecutar
```bash
cd businessdomain/report-service
mvn spring-boot:run
```

---

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/reports` | JWT | Listar todos los reportes |
| GET | `/reports/{id}` | JWT | Obtener reporte por ID |
| GET | `/reports/tipo/{tipo}` | JWT | Filtrar por tipo (PERDIDO/ENCONTRADO) |
| GET | `/reports/estado/{estado}` | JWT | Filtrar por estado |
| GET | `/reports/usuario/{userId}` | JWT | Reportes de un usuario |
| GET | `/reports/mascota/{petId}` | JWT | Reportes de una mascota |
| POST | `/reports` | JWT | Crear reporte |
| PUT | `/reports/{id}` | JWT | Actualizar reporte (creador o ADMIN) |
| PATCH | `/reports/{id}/estado` | JWT | Cambiar estado del reporte |
| DELETE | `/reports/{id}` | JWT | Eliminar reporte (creador o ADMIN) |

---

## 📤 Campos del reporte

| Campo | Tipo | Requerido |
|---|---|---|
| tipo | String (PERDIDO/ENCONTRADO) | Sí |
| descripcion | String | Sí |
| latitud | Double | No |
| longitud | Double | No |
| ubicacionDescripcion | String | No |
| petId | Long | No |
| reporterUserId | Long | Sí |

---

## 🗄️ Modelo de datos

```
reports
├── id                    BIGINT (PK)
├── tipo                  ENUM(PERDIDO, ENCONTRADO)
├── descripcion           TEXT
├── latitud               DOUBLE
├── longitud              DOUBLE
├── ubicacion_descripcion VARCHAR
├── estado                ENUM(ACTIVO, RESUELTO, CERRADO)
├── pet_id                BIGINT
├── reporter_user_id      BIGINT
├── active                BOOLEAN
└── created_at            DATETIME
```

---

## 🔍 Swagger UI

```
http://localhost:8083/swagger-ui/index.html
```
