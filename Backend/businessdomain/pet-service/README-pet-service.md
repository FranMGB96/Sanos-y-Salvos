# 🐾 pet-service

Microservicio encargado de la gestión de mascotas registradas en la plataforma Sanos y Salvos.

---

## 📋 Responsabilidades

- Registro y gestión de mascotas
- Asociación de mascotas con sus dueños (ownerId)
- Subida y almacenamiento de fotos de mascotas
- Control de acceso: solo el dueño o un ADMIN puede modificar/eliminar
- Soft delete (las mascotas eliminadas quedan inactivas)

---

## ⚙️ Configuración

| Propiedad | Valor |
|---|---|
| Puerto | 8082 |
| Base de datos | MySQL — `pet_db` (puerto 3308) |
| Registro | Eureka Server :8761 |
| Config | Config Server :8888 |

---

## 🚀 Ejecución local

### Requisitos previos
```bash
docker compose up -d pet-db
```

### Ejecutar
```bash
cd businessdomain/pet-service
mvn spring-boot:run
```

---

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/pets` | JWT | Listar todas las mascotas activas |
| GET | `/pets/{id}` | JWT | Obtener mascota por ID |
| GET | `/pets/owner/{ownerId}` | JWT | Mascotas de un dueño |
| GET | `/pets/especie/{especie}` | JWT | Filtrar por especie |
| POST | `/pets` | JWT | Crear mascota (multipart/form-data) |
| PUT | `/pets/{id}` | JWT | Actualizar mascota (dueño o ADMIN) |
| DELETE | `/pets/{id}` | JWT | Eliminar mascota (dueño o ADMIN) |

---

## 📤 Campos para crear/editar mascota

| Campo | Tipo | Requerido |
|---|---|---|
| nombre | String | Sí |
| especie | String | Sí |
| raza | String | No |
| color | String | No |
| tamanio | String (PEQUEÑO/MEDIANO/GRANDE) | No |
| descripcion | String | No |
| ownerId | Long | Sí (solo en creación) |
| foto | MultipartFile | No |

---

## 🗄️ Modelo de datos

```
pets
├── id          BIGINT (PK)
├── nombre      VARCHAR
├── especie     VARCHAR
├── raza        VARCHAR
├── color       VARCHAR
├── tamanio     ENUM(PEQUEÑO, MEDIANO, GRANDE)
├── descripcion TEXT
├── foto_url    VARCHAR
├── owner_id    BIGINT
├── active      BOOLEAN
└── created_at  DATETIME
```

---

## 🔍 Swagger UI

```
http://localhost:8082/swagger-ui/index.html
```
