# 👤 user-service

Microservicio de gestión de usuarios y autenticación JWT para la plataforma Sanos y Salvos.

## Responsabilidad

- Registro e inicio de sesión de usuarios
- Generación y validación de tokens JWT
- CRUD de usuarios con soft delete
- Roles: OWNER, CITIZEN, ORG, ADMIN

## Puerto

**8081**

## Base de datos

MySQL — `user_db` (puerto local 3307)

## Prerrequisitos

- Java 21
- Maven 3.9+
- MySQL 8.0 corriendo (o Docker)

## Ejecución local

```bash
# 1. Levantar la base de datos con Docker
docker compose up -d user-db

# 2. Asegurarse de que Eureka y Config Server estén corriendo

# 3. Ejecutar desde IntelliJ
# Run → UserServiceApplication

# O desde terminal (en la raíz del proyecto)
mvn spring-boot:run -pl businessdomain/user-service
```

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `DB_HOST` | localhost | Host de la base de datos |
| `DB_PORT` | 3307 | Puerto de MySQL |
| `DB_NAME` | user_db | Nombre de la BD |
| `DB_USER` | root | Usuario MySQL |
| `DB_PASS` | root | Contraseña MySQL |
| `EUREKA_URI` | http://localhost:8761/eureka | URL de Eureka |
| `CONFIG_SERVER_URI` | http://localhost:8888 | URL del Config Server |

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Registrar nuevo usuario |
| POST | `/auth/login` | ❌ | Login, retorna token JWT |
| GET | `/users` | ✅ JWT | Listar todos los usuarios |
| GET | `/users/{id}` | ✅ JWT | Obtener usuario por ID |
| PUT | `/users/{id}` | ✅ JWT | Actualizar usuario |
| DELETE | `/users/{id}` | ✅ JWT | Desactivar usuario (soft delete) |

## Documentación Swagger

Con el servicio corriendo, acceder a:
```
http://localhost:8081/swagger-ui.html
```

## Ejecutar tests

```bash
mvn test -pl businessdomain/user-service
```

## Ejemplo de uso

### Registrar usuario
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Francisco García",
    "email": "francisco@duocuc.cl",
    "password": "123456",
    "rol": "OWNER"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "francisco@duocuc.cl", "password": "123456" }'
```
