# 🐾 pet-service

Microservicio de gestión de mascotas para la plataforma Sanos y Salvos.

## Responsabilidad

- CRUD completo de mascotas
- Filtrado por dueño, especie y estado activo
- Soft delete (campo `active`)
- Especies soportadas: perro, gato, ave, otro
- Tamaños: PEQUENIO, MEDIANO, GRANDE

## Puerto

**8082**

## Base de datos

MySQL — `pet_db` (puerto local 3308)

## Prerrequisitos

- Java 21
- Maven 3.9+
- MySQL 8.0 corriendo (o Docker)

## Ejecución local

```bash
# 1. Levantar la base de datos
docker compose up -d pet-db

# 2. Asegurarse de que Eureka y Config Server estén corriendo

# 3. Ejecutar desde IntelliJ
# Run → PetServiceApplication

# O desde terminal
mvn spring-boot:run -pl businessdomain/pet-service
```

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `DB_HOST` | localhost | Host de la base de datos |
| `DB_PORT` | 3308 | Puerto de MySQL |
| `DB_NAME` | pet_db | Nombre de la BD |
| `DB_USER` | root | Usuario MySQL |
| `DB_PASS` | root | Contraseña MySQL |
| `EUREKA_URI` | http://localhost:8761/eureka | URL de Eureka |
| `CONFIG_SERVER_URI` | http://localhost:8888 | URL del Config Server |

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/pets` | Listar todas las mascotas activas |
| GET | `/pets/{id}` | Obtener mascota por ID |
| GET | `/pets/owner/{ownerId}` | Mascotas de un dueño específico |
| GET | `/pets/especie/{especie}` | Filtrar por especie |
| POST | `/pets` | Registrar nueva mascota |
| PUT | `/pets/{id}` | Actualizar datos de mascota |
| DELETE | `/pets/{id}` | Desactivar mascota (soft delete) |

> Todos los endpoints requieren token JWT en el header `Authorization: Bearer <token>`

## Documentación Swagger

```
http://localhost:8082/swagger-ui.html
```

## Ejecutar tests

```bash
mvn test -pl businessdomain/pet-service
```

## Ejemplo de uso

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# Registrar mascota
curl -X POST http://localhost:8082/pets \
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

# Listar mascotas de un dueño
curl http://localhost:8082/pets/owner/1 \
  -H "Authorization: Bearer $TOKEN"
```
