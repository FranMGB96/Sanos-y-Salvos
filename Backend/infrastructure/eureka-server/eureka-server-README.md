# 📋 eureka-server

Servidor de descubrimiento de servicios basado en Netflix Eureka.

## Responsabilidad

- Registro dinámico de todos los microservicios al arrancar
- Health check periódico (heartbeat) para detectar servicios caídos
- Permite al API Gateway y BFF resolver nombres de servicio sin IPs fijas

## Puerto

**8761**

## Prerrequisitos

- Java 21
- Maven 3.9+

## Ejecución local

```bash
# Ejecutar desde IntelliJ — debe ser el PRIMER servicio en arrancar
# Run → EurekaServerApplication

# O desde terminal
mvn spring-boot:run -pl infrastructure/eureka-server
```

## Dashboard

Con el servicio corriendo, acceder al panel visual:
```
http://localhost:8761
```

Ahí se pueden ver todos los microservicios registrados, su estado y la cantidad de instancias activas.

## Notas importantes

- **Debe arrancar antes que cualquier otro servicio** — los demás microservicios necesitan registrarse en Eureka al iniciar
- No requiere base de datos — almacena el registro en memoria
- Si Eureka se reinicia, los microservicios se vuelven a registrar automáticamente en el siguiente heartbeat (cada 30 segundos por defecto)
