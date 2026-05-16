# ⚙️ config-server

Servidor de configuración centralizada. Provee los `application.yml` de todos los microservicios desde un único lugar.

## Responsabilidad

- Centralizar la configuración de todos los microservicios
- Permitir cambiar configuración sin recompilar ni reiniciar servicios
- Proveer configuración específica por servicio (datasource, jwt, rutas, etc.)

## Puerto

**8888**

## Prerrequisitos

- Java 21
- Maven 3.9+
- Eureka Server corriendo

## Ejecución local

```bash
# Ejecutar desde IntelliJ — debe arrancar DESPUÉS de Eureka
# Run → ConfigServerApplication

# O desde terminal
mvn spring-boot:run -pl infrastructure/config-server
```

## Archivos de configuración

Los archivos de config de cada servicio están en:
```
infrastructure/config-server/src/main/resources/config/
├── user-service.yml      ← datasource + jwt secret
├── pet-service.yml       ← datasource
├── report-service.yml    ← datasource
├── api-gateway.yml       ← rutas + jwt secret
└── bff-service.yml       ← URLs de servicios
```

## Verificar configuración activa

Con el Config Server corriendo, acceder a:

```
# Ver config de user-service
http://localhost:8888/user-service/default

# Ver config de api-gateway
http://localhost:8888/api-gateway/default
```

## Orden de arranque

```
1. eureka-server   (puerto 8761)
2. config-server   (puerto 8888)  ← segundo obligatoriamente
3. user-service, pet-service, report-service
4. api-gateway, bff-service
5. springboot-admin
```

## Notas

- No requiere base de datos — lee los YML desde el filesystem
- El perfil `native` indica que lee configuración desde archivos locales (no desde Git)
- Cada microservicio importa su config con: `spring.config.import: configserver:http://localhost:8888`
