# 🔀 api-gateway

Punto de entrada único del sistema. Valida JWT, enruta peticiones y aplica CORS.

## Responsabilidad

- Único punto de entrada para el frontend Angular (puerto 8080)
- Validación centralizada de tokens JWT
- Enrutamiento dinámico a microservicios via Eureka
- Configuración CORS global
- Inyección de headers internos X-User-Id y X-User-Role

## Puerto

**8080**

## Prerrequisitos

- Java 21
- Maven 3.9+
- Eureka Server corriendo en puerto 8761

## Ejecución local

```bash
# Ejecutar desde IntelliJ
# Run → ApiGatewayApplication

# O desde terminal
mvn spring-boot:run -pl infrastructure/api-gateway
```

## Rutas configuradas

| Ruta pública | Destino | Auth |
|---|---|---|
| `/api/auth/**` | user-service | ❌ Sin JWT |

| Ruta protegida | Destino | Auth |
|---|---|---|
| `/api/users/**` | user-service | ✅ JWT |
| `/api/pets/**` | pet-service | ✅ JWT |
| `/api/reports/**` | report-service | ✅ JWT |
| `/api/bff/**` | bff-service | ✅ JWT |

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `EUREKA_URI` | http://localhost:8761/eureka | URL de Eureka |
| `CONFIG_SERVER_URI` | http://localhost:8888 | URL del Config Server |

## Notas

- Usa Spring Cloud Gateway (reactivo, basado en WebFlux)
- El filtro `AuthenticationFilter` valida el JWT antes de enrutar
- Si el token es inválido o falta, retorna HTTP 401
- Los headers `X-User-Id` y `X-User-Role` se agregan al request interno para que los microservicios conozcan el contexto del usuario autenticado
