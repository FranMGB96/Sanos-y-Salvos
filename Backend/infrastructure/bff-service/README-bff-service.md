# 🔀 bff-service (Backend For Frontend)

Microservicio de agregación que combina datos de múltiples microservicios para construir las respuestas que necesita el frontend, evitando múltiples llamadas desde el cliente.

---

## 📋 Responsabilidades

- Agregar datos de user-service, pet-service y report-service en una sola respuesta
- Construir el dashboard con estadísticas globales del sistema
- Enriquecer reportes con información de la mascota asociada
- Implementar Circuit Breaker para tolerancia a fallos con Resilience4j

---

## ⚙️ Configuración

| Propiedad | Valor |
|---|---|
| Puerto | 8084 |
| Registro | Eureka Server :8761 |
| Config | Config Server :8888 |

---

## 🚀 Ejecución local

```bash
cd infrastructure/bff-service
mvn spring-boot:run
```

> Requiere que user-service (:8081), pet-service (:8082) y report-service (:8083) estén corriendo.

---

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/bff/dashboard` | JWT | Estadísticas globales + últimos reportes |
| GET | `/bff/reportes` | JWT | Reportes enriquecidos con datos de mascota |
| GET | `/bff/reportes/tipo/{tipo}` | JWT | Reportes por tipo enriquecidos |
| GET | `/bff/reportes/usuario/{userId}` | JWT | Reportes de un usuario enriquecidos |
| GET | `/bff/usuarios/{userId}/mascotas` | JWT | Usuario con sus mascotas |

---

## 🔌 Circuit Breaker (Resilience4j)

El BFF implementa Circuit Breaker en todos sus métodos de agregación para garantizar disponibilidad aunque algún microservicio falle.

| Circuito | Método protegido | Fallback |
|---|---|---|
| `bff-dashboard` | `getDashboard()` | Dashboard con valores en cero |
| `bff-usuario` | `getUsuarioConMascotas()` | Usuario con datos "No disponible" |
| `bff-reportes` | `getReportesConDetalle()` y similares | Lista vacía |

### Configuración del Circuit Breaker

| Parámetro | Valor | Descripción |
|---|---|---|
| `failureRateThreshold` | 50% | Porcentaje de fallos para abrir el circuito |
| `minimumNumberOfCalls` | 5 | Mínimo de llamadas antes de evaluar |
| `waitDurationInOpenState` | 10s | Tiempo en estado OPEN antes de probar |
| `permittedNumberOfCallsInHalfOpenState` | 3 | Llamadas de prueba en estado HALF-OPEN |
| `slidingWindowSize` | 10 | Tamaño de la ventana de evaluación |

### Estados del Circuit Breaker

```
CLOSED ──(fallos > 50%)──► OPEN ──(10s)──► HALF-OPEN ──(éxito)──► CLOSED
                                                        └──(fallo)──► OPEN
```

---

## 🔍 Monitoreo

Ver estado de los circuit breakers en tiempo real:

```
http://localhost:8084/actuator/circuitbreakers
http://localhost:8084/actuator/health
```
