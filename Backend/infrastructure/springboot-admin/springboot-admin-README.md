# 📊 springboot-admin

Panel de monitoreo visual para todos los microservicios del sistema.

## Responsabilidad

- Dashboard en tiempo real con estado de cada microservicio
- Métricas de salud, memoria, CPU y threads
- Visualización de logs en tiempo real
- Detección automática de servicios caídos via Eureka

## Puerto

**9090**

## Prerrequisitos

- Java 21
- Maven 3.9+
- Eureka Server corriendo
- Al menos uno de los microservicios corriendo

## Ejecución local

```bash
# Ejecutar desde IntelliJ
# Run → SpringBootAdminApplication

# O desde terminal
mvn spring-boot:run -pl infrastructure/springboot-admin
```

## Acceso al panel

Con el servicio corriendo:
```
http://localhost:9090
```

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`

## Lo que se puede monitorear

| Sección | Descripción |
|---|---|
| Health | Estado UP/DOWN de cada servicio |
| Metrics | CPU, memoria, threads activos |
| Loggers | Ver y cambiar nivel de logs en caliente |
| Environment | Variables de entorno activas |
| Beans | Beans de Spring registrados |
| Mappings | Endpoints HTTP expuestos |

## Notas

- Descubre los microservicios automáticamente a través de Eureka — no requiere configuración manual
- Los microservicios deben tener el actuator habilitado para exponer métricas
- No requiere base de datos
