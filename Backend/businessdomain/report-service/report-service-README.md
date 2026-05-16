# 📋 report-service

Microservicio de gestión de reportes de mascotas perdidas y encontradas.

## Responsabilidad

- Crear y gestionar reportes de mascotas PERDIDAS o ENCONTRADAS
- Filtrado por tipo, estado, usuario y mascota
- Cambio de estado: ACTIVO → RESUELTO → CERRADO
- Almacena coordenadas geográficas (latitud/longitud) del lugar del reporte

## Puerto

**8083**

## Base de datos

MySQL — `report_db` (puerto local 3309)

## Prerrequisitos

- Java 21
- Maven 3.9+
- MySQL 8.0 corriendo (o Docker)

## Ejecución local

```bash
# 1. Levantar la base de datos
docker compose up -d report-db

# 2. Asegurarse de que Eureka y Config Server estén corriendo

# 3. Ejecutar desde IntelliJ
# Run → ReportServiceApplication

# O desde terminal
mvn spring-boot:run -pl businessdomain/report-service
```

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `DB_HOST` | localhost | Host de la base de datos |
| `DB_PORT` | 3309 | Puerto de MySQL |
| `DB_NAME` | report_db | Nombre de la BD |
| `DB_USER` | root | Usuario MySQL |
| `DB_PASS` | root | Contraseña MySQL |
| `EUREKA_URI` | http://localhost:8761/eureka | URL de Eureka |
| `CONFIG_SERVER_URI` | http://localhost:8888 | URL del Config Server |

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/reports` | Listar todos los reportes |
| GET | `/reports/{id}` | Obtener reporte por ID |
| GET | `/reports/tipo/{tipo}` | Filtrar: PERDIDO o ENCONTRADO |
| GET | `/reports/estado/{estado}` | Filtrar: ACTIVO, RESUELTO, CERRADO |
| GET | `/reports/usuario/{userId}` | Reportes de un usuario |
| GET | `/reports/mascota/{petId}` | Reportes de una mascota |
| POST | `/reports` | Crear nuevo reporte |
| PUT | `/reports/{id}` | Actualizar reporte |
| PATCH | `/reports/{id}/estado?estado=RESUELTO` | Cambiar estado |
| DELETE | `/reports/{id}` | Cerrar reporte |

> Todos los endpoints requieren token JWT en el header `Authorization: Bearer <token>`

## Documentación Swagger

```
http://localhost:8083/swagger-ui.html
```

## Ejecutar tests

```bash
mvn test -pl businessdomain/report-service
```

## Ejemplo de uso

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# Crear reporte de mascota perdida
curl -X POST http://localhost:8083/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "PERDIDO",
    "descripcion": "Se perdió en el Parque O Higgins el sábado",
    "ubicacionDescripcion": "Parque O Higgins, Santiago Centro",
    "latitud": -33.4489,
    "longitud": -70.6693,
    "petId": 1,
    "reporterUserId": 1
  }'

# Marcar reporte como resuelto
curl -X PATCH "http://localhost:8083/reports/1/estado?estado=RESUELTO" \
  -H "Authorization: Bearer $TOKEN"
```
