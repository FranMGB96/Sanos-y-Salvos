# 🔗 bff-service

Backend For Frontend — orquesta llamadas a los microservicios y entrega vistas compuestas optimizadas para el cliente Angular.

## Responsabilidad

- Combinar datos de múltiples microservicios en una sola respuesta
- Proveer el dashboard con estadísticas generales
- Enriquecer reportes con datos de la mascota asociada
- Reducir el número de llamadas HTTP desde el frontend

## Puerto

**8084**

## Prerrequisitos

- Java 21
- Maven 3.9+
- user-service, pet-service y report-service corriendo

## Ejecución local

```bash
# Ejecutar desde IntelliJ
# Run → BffServiceApplication

# O desde terminal
mvn spring-boot:run -pl infrastructure/bff-service
```

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `EUREKA_URI` | http://localhost:8761/eureka | URL de Eureka |
| `CONFIG_SERVER_URI` | http://localhost:8888 | URL del Config Server |
| `USER_SERVICE_URL` | http://user-service:8081 | URL del user-service |
| `PET_SERVICE_URL` | http://pet-service:8082 | URL del pet-service |
| `REPORT_SERVICE_URL` | http://report-service:8083 | URL del report-service |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/bff/dashboard` | Estadísticas generales + últimos 5 reportes |
| GET | `/bff/reportes` | Todos los reportes con datos de mascota incluidos |
| GET | `/bff/reportes/tipo/{tipo}` | Reportes filtrados por tipo + detalle mascota |
| GET | `/bff/reportes/usuario/{userId}` | Reportes por usuario + detalle mascota |
| GET | `/bff/usuarios/{userId}/mascotas` | Perfil usuario + lista de sus mascotas |

> Todos los endpoints requieren token JWT en el header `Authorization: Bearer <token>`

## Documentación Swagger

```
http://localhost:8084/swagger-ui.html
```

## Ejemplo de uso

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# Dashboard
curl http://localhost:8084/bff/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Reportes enriquecidos
curl http://localhost:8084/bff/reportes \
  -H "Authorization: Bearer $TOKEN"
```
