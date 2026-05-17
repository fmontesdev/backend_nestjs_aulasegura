# 🛡️ AulaSegura - Backend

Backend de **AulaSegura**, un sistema de control de acceso para instituciones educativas construido con **NestJS**, **TypeScript**, **TypeORM** y **MariaDB**.

El objetivo del proyecto es centralizar la gestión de accesos a aulas y espacios del centro mediante credenciales RFID/NFC, NFC móvil y QR, manteniendo trazabilidad completa de los intentos de entrada, permisos por horario, reservas, lectores físicos, usuarios, roles y estructura académica.

Este backend no es solo una API CRUD: modela reglas reales de un centro educativo. Por ejemplo, un profesor puede tener permisos semanales vinculados a una asignación docente concreta (`profesor + curso + asignatura`), un conserje puede emitir pases temporales, y el sistema registra cada acceso con su motivo, método y contexto.

---

## 📚 Tabla de contenidos

- [Descripción general](#-descripción-general)
- [Tecnologías](#-tecnologías)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Módulos principales](#-módulos-principales)
- [Modelo de dominio](#-modelo-de-dominio)
- [API y endpoints principales](#-api-y-endpoints-principales)
- [Autenticación y autorización](#-autenticación-y-autorización)
- [Configuración de entorno](#-configuración-de-entorno)
- [Docker Compose](#-docker-compose)
- [Instalación y arranque](#-instalación-y-arranque)
- [Seeders y datos de desarrollo](#-seeders-y-datos-de-desarrollo)
- [Migraciones y base de datos](#-migraciones-y-base-de-datos)
- [Testing y calidad](#-testing-y-calidad)
- [Documentación Swagger](#-documentación-swagger)
- [Gestión de imágenes](#-gestión-de-imágenes)
- [Detalles importantes del proyecto](#-detalles-importantes-del-proyecto)
- [Estructura de directorios](#-estructura-de-directorios)
- [Estado de licencia](#-estado-de-licencia)

---

## 📋 Descripción general

AulaSegura permite controlar quién puede acceder a cada aula, en qué horario y bajo qué contexto. El sistema contempla accesos recurrentes asociados a horarios semanales, reservas puntuales, pases temporales, lectores físicos, credenciales personales y registros históricos para auditoría.

El backend expone una API REST organizada por dominios funcionales. Cada módulo encapsula sus entidades, reglas de negocio, controladores, DTOs, repositorios y mappers, manteniendo una separación clara entre el dominio, la aplicación, la infraestructura y la capa HTTP.

### Casos de uso que cubre

- Un administrador gestiona usuarios, roles, cursos, aulas, lectores, horarios y permisos.
- Un profesor puede tener asignaciones docentes por curso y asignatura.
- Un permiso semanal de profesor puede quedar vinculado a una asignación docente concreta.
- Un profesor o administrador puede crear una reserva puntual de aula.
- Un conserje puede emitir pases temporales para otros usuarios.
- Un usuario puede acceder mediante RFID/NFC o QR si tiene un permiso válido en ese momento.
- El sistema registra accesos permitidos y denegados con su razón.
- El frontend puede recibir eventos de acceso y notificaciones en tiempo real mediante SSE.

---

## 🛠️ Tecnologías

### Core

- **NestJS 11** como framework backend principal.
- **TypeScript 5.7** para tipado estático y mantenibilidad.
- **TypeORM 0.3** como ORM sobre MariaDB.
- **MariaDB 11.4** como base de datos relacional.

### Seguridad y autenticación

- **Passport** con estrategias local y JWT.
- **JWT access + refresh tokens** con rotación e invalidación.
- **Cookies httpOnly** para gestión segura de tokens en cliente.
- **bcrypt** mediante `@node-rs/bcrypt` para contraseñas.
- **Blacklist de tokens** para logout y rotación de refresh token.
- **Versionado de tokens** (`tokenVersion`) para invalidación global.

### Validación y documentación

- **class-validator** y **class-transformer** para DTOs.
- **ValidationPipe global** con whitelist y rechazo de campos extra.
- **Swagger/OpenAPI** en entorno de desarrollo.

### Infraestructura local

- **Docker Compose** para levantar API, MariaDB, phpMyAdmin y Nginx.
- **PM2** como runtime dentro del contenedor NestJS.
- **Nginx** para servir imágenes y avatares.
- **Jest** y **ts-jest** para tests unitarios.
- **Supertest** para tests e2e.

---

## ✨ Funcionalidades principales

- 🔐 **Autenticación completa** con login, refresh, logout, logout global, recuperación y cambio de contraseña.
- 👥 **Gestión de usuarios y roles** con perfiles diferenciados para profesorado, administración, conserjería y personal de apoyo.
- 🧑‍🏫 **Asignaciones docentes** basadas en profesor, curso y asignatura.
- 🏫 **Gestión de aulas y lectores** RFID/QR, permitiendo lectores sin aula asignada.
- 📚 **Catálogo académico** con años académicos, cursos, asignaturas y departamentos.
- 📅 **Horarios semanales y eventos puntuales** para permisos recurrentes y reservas.
- 🔑 **Permisos granulares** por usuario, aula y horario.
- 🏷️ **Credenciales RFID/NFC/NFC móvil** almacenadas de forma segura mediante hash.
- 🚪 **Validación de accesos** por credencial física o QR.
- 📖 **Registro histórico de accesos** con estado, motivo y método.
- 📊 **Analíticas de acceso** con ventanas móviles semanales y mensuales.
- 🔔 **Notificaciones y eventos SSE** para actualizaciones en tiempo real.
- 🖼️ **Gestión de avatares e imágenes** servidas por Nginx.

---

## 🏗️ Arquitectura del proyecto

El código está organizado siguiendo una arquitectura limpia/hexagonal por módulo funcional. La idea es que cada dominio del sistema tenga su propia frontera y que las reglas de negocio no dependan directamente de detalles de infraestructura como TypeORM o HTTP.

La estructura general de un módulo es:

```text
src/{module}/
├── application/       # Servicios de aplicación, casos de uso y DTOs internos
├── domain/            # Entidades, enums y contratos de repositorio
├── infrastructure/    # Implementaciones TypeORM, guards, decorators o adapters
├── presentation/      # Controllers, request DTOs, response DTOs y mappers
└── {module}.module.ts # Configuración NestJS del módulo
```

### Capas

#### `domain/`

Contiene el modelo del dominio: entidades, enums y contratos. Aquí viven las abstracciones que representan el negocio de AulaSegura sin acoplarse a HTTP ni a detalles de persistencia.

#### `application/`

Contiene servicios de aplicación y DTOs internos. Es donde se orquestan reglas de negocio como validar un permiso, crear una asignación docente, comprobar solapamientos de horarios o registrar un acceso.

#### `infrastructure/`

Contiene las implementaciones técnicas: repositorios TypeORM, estrategias, guards o piezas que conectan el dominio con herramientas externas.

#### `presentation/`

Contiene los controladores HTTP, DTOs de entrada/salida y mappers. Esta capa traduce la API pública a operaciones de aplicación y convierte entidades en respuestas seguras para frontend.

### Convenciones importantes

- Los repositorios se inyectan mediante **clases abstractas** como tokens de DI.
- Los DTOs de entrada están en `presentation/dto/requests`.
- Los DTOs de respuesta están en `presentation/dto/responses`.
- Los mappers separan entidades internas del contrato HTTP.
- El `ValidationPipe` global impide enviar propiedades no declaradas en los DTOs.
- En desarrollo se permite `synchronize`; en producción debe trabajarse con migraciones.

> ⚠️ Nota histórica: el módulo `users` usa la carpeta `Infraestructure/` con mayúscula y spelling legacy. Se mantiene por compatibilidad con los imports existentes.

---

## 🧩 Módulos principales

| Módulo | Responsabilidad |
|--------|-----------------|
| `auth` | Autenticación, JWT, cookies, recuperación de contraseña, logout e invalidación de tokens. |
| `users` | Usuarios, roles, profesores, subida de avatares y asignaciones docentes. |
| `academic-years` | Años académicos y gestión del año activo. |
| `courses` | Cursos, etapas educativas y relaciones con asignaturas. |
| `subjects` | Asignaturas, códigos y vinculación con departamentos/cursos. |
| `departments` | Departamentos académicos y profesorado asociado. |
| `rooms` | Aulas, edificios, plantas, capacidad y disponibilidad. |
| `readers` | Lectores RFID/QR asignables opcionalmente a aulas. |
| `tags` | Credenciales RFID/NFC/NFC móvil y administración de tags. |
| `schedules` | Horarios base, horarios semanales y eventos puntuales. |
| `permissions` | Permisos de acceso por usuario, aula y horario; reservas y pases temporales. |
| `access` | Comprobación de accesos, logs, analíticas y eventos SSE. |
| `notifications` | Notificaciones, contador de no leídas, marcado como leído y stream SSE. |

---

## 🧠 Modelo de dominio

### Usuarios, roles y perfiles docentes

El usuario es la entidad central de identidad. Cada usuario tiene un UUID, credenciales de acceso, fechas de validez, roles y un `tokenVersion` que permite invalidar tokens cuando ocurre una operación sensible.

Los roles se gestionan mediante una relación `role_user`. Actualmente el sistema contempla:

- `admin`
- `teacher`
- `janitor`
- `support_staff`

Los profesores tienen además un perfil específico en `teacher`, vinculado al usuario y asociado a un departamento.

### Asignaciones docentes

La docencia se modela con una relación ternaria:

```text
teacher_subject_course
├── assignment_id  # ID estable autoincremental
├── user_id        # profesor
├── course_id      # curso
├── subject_id     # asignatura
├── created_at
└── is_active
```

Esto significa que una asignación no representa simplemente “un profesor imparte una asignatura”, sino algo más preciso: **un profesor imparte una asignatura en un curso concreto**.

Este matiz es importante porque permisos semanales, horarios y trazabilidad académica necesitan saber el contexto real de la docencia. Por eso el modelo legacy `teacher_subject` ya no se usa como fuente de verdad.

Reglas principales:

- `assignmentId` es el identificador estable de la asignación.
- La combinación `teacher + course + subject` es única.
- Una asignación puede desactivarse con soft delete.
- Si se reactiva una asignación existente, conserva su `assignmentId`.

### Horarios

El sistema diferencia entre tres conceptos:

- `schedule`: entidad base común.
- `weekly_schedule`: horario recurrente semanal.
- `event_schedule`: evento puntual, reserva o pase temporal.

Los horarios semanales se usan para accesos recurrentes. Los eventos se usan para situaciones concretas con fecha y hora de inicio/fin.

### Permisos

Los permisos mantienen una clave compuesta:

```text
user_id + room_id + schedule_id
```

Esta clave se conserva porque los permisos no son exclusivos de profesores. Un permiso siempre pertenece a un usuario, un aula y un horario.

Además, los permisos semanales pueden tener una relación opcional con una asignación docente:

```text
permission.assignment_id -> teacher_subject_course.assignment_id
```

Reglas actuales:

- Para usuarios `teacher`, un permiso semanal debe estar contextualizado con una asignación docente activa del mismo profesor.
- Para usuarios no profesores, `assignment_id` debe quedar vacío.
- Los permisos de tipo evento no requieren asignación docente.
- `POST /permissions/event-schedule` permite que `admin` funcione igual que `teacher` para crear reservas propias.

### Tags y credenciales

Las credenciales RFID/NFC no se almacenan en claro. El sistema usa `TAG_PEPPER` para generar hashes con HMAC-SHA256.

En el caso de NFC móvil, la app obtiene la credencial llamando a `POST /tags` con `{ "type": "nfc_mobile" }`. El backend devuelve `mobileCredential` una sola vez y después solo conserva su hash, así que el frontend debe guardarla inmediatamente en almacenamiento seguro del dispositivo.

La app móvil solo debe pedir una nueva `mobileCredential` si no tiene una guardada en Secure Storage. Esto cubre el primer inicio de sesión, un dispositivo nuevo, una reinstalación o un dispositivo restablecido. Cada nueva llamada regenera la credencial móvil activa del usuario y deja inválida la anterior.

### Logs de acceso

Cada intento de acceso puede registrar:

- usuario
- lector
- aula
- tag utilizado
- método de acceso
- estado
- razón/motivo
- asignatura si aplica
- fecha y hora

Esto permite auditar qué ocurrió, cuándo ocurrió y por qué se permitió o denegó un acceso.

---

## 🌐 API y endpoints principales

La API completa se documenta con Swagger en desarrollo. Esta sección resume las rutas más importantes para entender la superficie funcional del backend.

### 🔐 Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registra un nuevo usuario. |
| `POST` | `/auth/login` | Autentica credenciales y emite tokens. |
| `POST` | `/auth/refresh` | Rota access/refresh token. |
| `POST` | `/auth/logout` | Cierra la sesión actual. |
| `POST` | `/auth/logout-all` | Invalida todos los tokens del usuario. |
| `POST` | `/auth/change-password` | Cambia contraseña del usuario autenticado. |
| `POST` | `/auth/forgot-password` | Inicia recuperación de contraseña. |
| `POST` | `/auth/reset-password` | Restablece contraseña con código. |
| `POST` | `/auth/suspend` | Suspende un usuario. |
| `GET` | `/auth/me` | Devuelve el usuario autenticado. |

### 👥 Usuarios y profesorado

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/users` | Lista usuarios. |
| `GET` | `/users/:id` | Obtiene un usuario por ID. |
| `PATCH` | `/users/:id` | Actualiza usuario. |
| `DELETE` | `/users/:id` | Elimina o desactiva usuario. |
| `POST` | `/users/upload-avatar` | Sube avatar del usuario autenticado. |
| `POST` | `/users/:id/upload-avatar` | Sube avatar para un usuario concreto. |
| `GET` | `/teachers/assignments` | Lista asignaciones docentes paginadas y filtrables. |
| `POST` | `/teachers/assignments` | Crea o reactiva una asignación docente. |
| `DELETE` | `/teachers/assignments/:assignmentId` | Desactiva una asignación docente. |
| `GET` | `/teachers/:teacherId/assignments` | Lista asignaciones de un profesor. |

### 📚 Catálogo académico

| Módulo | Ruta base | Descripción |
|--------|-----------|-------------|
| Años académicos | `/academic-years` | Gestión de cursos académicos. |
| Cursos | `/courses` | Gestión de cursos y niveles educativos. |
| Asignaturas | `/subjects` | Gestión de asignaturas y códigos. |
| Departamentos | `/departments` | Gestión de departamentos académicos. |

Estos módulos siguen un patrón REST estándar con operaciones de listado, obtención, creación, actualización y eliminación según el caso.

### 🏫 Aulas y lectores

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/rooms` | Lista aulas con paginación y filtros. |
| `GET` | `/rooms/available` | Devuelve aulas disponibles en una fecha/franja. |
| `GET` | `/rooms/:id` | Obtiene un aula. |
| `POST` | `/rooms` | Crea un aula. |
| `PATCH` | `/rooms/update/:id` | Actualiza un aula. |
| `DELETE` | `/rooms/:id` | Elimina aula preservando lectores con `room_id = NULL`. |
| `GET` | `/readers` | Lista lectores con paginación y filtros. |
| `GET` | `/readers/:id` | Obtiene un lector. |
| `POST` | `/readers` | Crea un lector. |
| `PATCH` | `/readers/:id` | Actualiza un lector. |
| `DELETE` | `/readers/:id` | Elimina un lector. |

### 🏷️ Tags y credenciales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/tags` | Lista tags paginados/filtrables sin exponer `tagCode`. |
| `GET` | `/tags/:id` | Obtiene un tag. |
| `POST` | `/tags` | Crea tag estándar o genera/regenera `nfc_mobile` para el usuario autenticado. |
| `POST` | `/tags/admin` | Crea credenciales desde flujo administrador. |
| `PATCH` | `/tags/:id` | Actualiza tag y regenera credencial física si aplica. |
| `DELETE` | `/tags/:id` | Desactiva tag con soft delete. |

### 📅 Horarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/schedules` | Lista horarios activos, semanales y eventos. |
| `GET` | `/schedules/:id` | Obtiene horario base. |
| `DELETE` | `/schedules/:id` | Soft delete de horario. |
| `DELETE` | `/schedules/delete/:id` | Hard delete de horario. |
| `GET` | `/weekly-schedules` | Lista horarios semanales. |
| `GET` | `/weekly-schedules/:id` | Obtiene horario semanal. |
| `POST` | `/weekly-schedules` | Crea horario semanal. |
| `PATCH` | `/weekly-schedules/:id` | Actualiza horario semanal. |
| `GET` | `/event-schedules` | Lista eventos. |
| `GET` | `/event-schedules/:id` | Obtiene evento. |
| `PATCH` | `/event-schedules/:id` | Actualiza evento. |

### 🔑 Permisos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/permissions` | Lista permisos activos. |
| `GET` | `/permissions/my-reservations` | Reservas activas del usuario autenticado. |
| `GET` | `/permissions/my-weekly-schedules` | Horarios semanales del usuario autenticado. |
| `GET` | `/permissions/:userId/:roomId/:scheduleId` | Obtiene permiso por clave compuesta. |
| `POST` | `/permissions/weekly-schedule` | Crea permiso semanal. |
| `PATCH` | `/permissions/weekly-schedule/:userId/:roomId/:scheduleId` | Actualiza permiso semanal. |
| `POST` | `/permissions/event-schedule` | Crea reserva o pase temporal. |
| `DELETE` | `/permissions/:userId/:roomId/:scheduleId` | Soft delete de permiso. |
| `DELETE` | `/permissions/delete/:userId/:roomId/:scheduleId` | Hard delete de permiso. |

### 🚪 Accesos y analíticas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/access/check` | Valida acceso RFID/NFC. |
| `POST` | `/access/qrcheck` | Valida acceso QR. |
| `GET` | `/access/logs` | Lista logs de acceso. |
| `GET` | `/access/logs/:id` | Obtiene log de acceso. |
| `GET` | `/access/analytics/summary` | Devuelve resumen analítico. |
| `GET` | `/access/events` | Stream SSE de eventos de acceso. |

### 🔔 Notificaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/notifications` | Crea notificación. |
| `GET` | `/notifications` | Lista notificaciones. |
| `GET` | `/notifications/unread-count` | Devuelve contador de no leídas. |
| `PATCH` | `/notifications/read-all` | Marca todas como leídas. |
| `PATCH` | `/notifications/:id/read` | Marca una notificación como leída. |
| `GET` | `/notifications/events` | Stream SSE de notificaciones. |

---

## 🔐 Autenticación y autorización

El sistema usa JWT con access token y refresh token. El access token permite autenticar peticiones normales, mientras que el refresh token permite renovar sesión sin volver a pedir credenciales.

### Flujo básico

1. El cliente llama a `POST /auth/login` con email y contraseña.
2. El backend valida las credenciales con la estrategia local.
3. Se emiten access token y refresh token.
4. Los tokens pueden viajar en cookies httpOnly.
5. El access token también se acepta como `Authorization: Bearer <token>`.
6. `POST /auth/refresh` rota los tokens y mete el refresh anterior en blacklist.
7. `logout-all`, cambio de contraseña y suspensión invalidan sesiones incrementando `tokenVersion`.

### Roles del sistema

| Rol | Descripción |
|-----|-------------|
| `admin` | Administración completa del sistema. |
| `teacher` | Profesorado, reservas y permisos docentes. |
| `janitor` | Conserjería y creación de pases temporales. |
| `support_staff` | Personal de apoyo con permisos específicos. |

### Guards y decoradores

- `JwtAuthGuard`
- `LocalAuthGuard`
- `RolesGuard`
- `@Roles(...)`
- `@Public()`
- `@CurrentUser()`

---

## ⚙️ Configuración de entorno

El proyecto incluye archivos de ejemplo para crear tu `.env`. Puedes partir de `.env.example` o `env.example`.

```bash
cp .env.example .env
```

Variables principales:

```env
# Base de datos
DB_HOST=database
DB_PORT=3306
DB_DATABASE=aulasegura
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_ROOT_PASSWORD=tu_password_root

# Aplicación
NODE_ENV=development
WEB_SERVER_PORT=8000

# JWT
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Credenciales RFID/NFC
TAG_PEPPER=change-me-tag-pepper

# Servidor de imágenes
IMAGES_PATH=/app/images
IMAGES_BASE_URL=http://localhost:8090
```

### `DB_HOST` según cómo ejecutes la app

| Contexto | Valor recomendado |
|----------|-------------------|
| NestJS dentro de Docker Compose | `database` |
| NestJS en tu máquina contra DB Docker | `localhost` |

### CORS

La configuración de CORS permite por defecto:

- `http://localhost:8081`
- `http://localhost:19006`

Puedes añadir más orígenes con:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🐳 Docker Compose

El entorno local está preparado para levantarse con Docker Compose. Incluye la API, la base de datos, phpMyAdmin y un servidor Nginx para imágenes.

| Servicio | Contenedor | Puerto host | Puerto interno | Descripción |
|----------|------------|-------------|----------------|-------------|
| `webserver` | `aulasegura-nestjs` | `${WEB_SERVER_PORT}` (`8000`) | `3000` | API NestJS ejecutada con PM2. |
| `database` | `aulasegura-mariadb` | `${DB_PORT}` (`3306`) | `3306` | MariaDB 11.4. |
| `phpmyadmin` | `aulasegura-phpmyadmin` | `8085` | `80` | Interfaz visual para la base de datos. |
| `imageserver` | `aulasegura-nginx-images` | `8090` | `80` | Servidor estático de imágenes. |

Comandos habituales:

```bash
docker compose up -d
docker compose ps
docker compose logs -f webserver
docker compose down
```

> La aplicación NestJS escucha dentro del contenedor en `3000`. El puerto público se controla con `WEB_SERVER_PORT`.

---

## 🚀 Instalación y arranque

### Prerrequisitos

- Node.js compatible con el proyecto.
- npm.
- Docker y Docker Compose.

### 1. Clonar el repositorio

```bash
git clone https://github.com/fmontesdev/backend_nestjs_aulasegura.git
cd backend_nestjs_aulasegura
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Revisa especialmente `DB_HOST`, credenciales de base de datos, secretos JWT y `TAG_PEPPER`.

### 3. Levantar servicios

```bash
docker compose up -d
```

### 4. Comprobar que todo está levantado

```bash
docker compose ps
```

### 5. Acceder a servicios

| Servicio | URL |
|----------|-----|
| API | `http://localhost:8000` |
| Swagger | `http://localhost:8000/docs` |
| phpMyAdmin | `http://localhost:8085` |
| Imágenes | `http://localhost:8090` |

### Ejecutar NestJS fuera de Docker

Si prefieres ejecutar la aplicación directamente en tu máquina:

```bash
npm install
npm run start:dev
```

En ese caso, si la base de datos sigue estando en Docker, usa:

```env
DB_HOST=localhost
```

---

## 🌱 Seeders y datos de desarrollo

El proyecto incluye seeders para poblar la base de datos con datos útiles de desarrollo: roles, usuarios, cursos, departamentos, aulas, lectores, tags, horarios, eventos y permisos.

```bash
npm run seed:dev
```

### Usuarios de prueba

Todos los usuarios semilla usan la contraseña:

```text
AulaSegura@1234
```

| Email | Rol principal |
|-------|---------------|
| `admin@gva.es` | Administrador |
| `teacher@gva.es` | Profesor |
| `pagado@gva.es` | Profesor |
| `janitor@gva.es` | Conserje |
| `staff@gva.es` | Personal de apoyo |

### Orden de seeders

Los seeders se encuentran en `src/db/seeding/seeds/` y se ejecutan en orden:

1. `01-role.seeder.ts`
2. `02-department.seeder.ts`
3. `02b-academic-year.seeder.ts`
4. `03-course.seeder.ts`
5. `04-user.seeder.ts`
6. `05-role-user.seeder.ts`
7. `06-room.seeder.ts`
8. `07-academic-year-course.seeder.ts`
9. `07b-subject.seeder.ts`
10. `08-course-subject.seeder.ts`
11. `09-teacher.seeder.ts`
12. `10-teacher-subject-course.seeder.ts`
13. `11-reader.seeder.ts`
14. `12-tag.seeder.ts`
15. `13-schedule.seeder.ts`
16. `14-weekly-schedule.seeder.ts`
17. `15-event-schedule.seeder.ts`
18. `16-permission.seeder.ts`

Estos seeders permiten reconstruir un entorno funcional de desarrollo sin tener que crear manualmente toda la estructura académica y de accesos.

---

## 🗄️ Migraciones y base de datos

La conexión TypeORM se configura en `src/app.module.ts`.

Configuración relevante:

- `type: 'mysql'`
- `autoLoadEntities: true`
- `timezone: 'Z'`
- `synchronize: NODE_ENV !== 'production'`

En desarrollo, `synchronize` facilita iterar rápido. En producción, NO debe usarse para evolucionar esquema. Para eso están las migraciones en `src/db/migrations/`.

### Migraciones existentes

Las migraciones actuales cubren, entre otros cambios:

- Campos de razón/estado en logs de acceso.
- Ajustes de tipos de notificación.
- Lectores con aula nullable.
- Creación de `teacher_subject_course`.
- `assignment_id` estable en asignaciones docentes.
- Eliminación de `teacher_subject` legacy.
- Asociación opcional `permission.assignment_id` hacia asignaciones docentes.

Actualmente no existe un script npm dedicado para ejecutar migraciones. En entornos persistentes conviene aplicar los cambios de forma controlada según la estrategia de despliegue.

### Acceso directo a MariaDB

```bash
docker exec -it aulasegura-mariadb mariadb -u[usuario] -p[password] aulasegura
```

### Backup

```bash
docker exec aulasegura-mariadb mysqldump -u[usuario] -p[password] aulasegura > backup.sql
```

---

## ✅ Testing y calidad

### Tests unitarios

```bash
npm run test
```

Ejecutar un test concreto:

```bash
npm test -- --runInBand --testPathPatterns=permission.service.spec.ts
```

> Jest 30 usa `--testPathPatterns` en plural.

### Tests e2e

```bash
npm run test:e2e
```

Los tests e2e requieren una base de datos disponible.

### Coverage

```bash
npm run test:cov
```

### Lint y formato

```bash
npm run lint
npm run format
```

### TypeScript sin emitir archivos

```bash
npx tsc --noEmit --incremental false --pretty false
```

---

## 📚 Documentación Swagger

Swagger se habilita únicamente cuando:

```env
NODE_ENV=development
```

URL:

```text
http://localhost:8000/docs
```

La interfaz incluye autenticación Bearer y conserva la autorización en el navegador con `persistAuthorization`.

---

## 🖼️ Gestión de imágenes

El backend permite subir avatares y servirlos mediante un contenedor Nginx dedicado.

Variables relacionadas:

| Variable | Descripción |
|----------|-------------|
| `IMAGES_PATH` | Ruta interna donde se guardan imágenes. |
| `IMAGES_BASE_URL` | URL pública usada para construir enlaces de imágenes. |

Por defecto:

```text
http://localhost:8090
```

El volumen compartido es:

```text
./imageserver/images
```

---

## ⚠️ Detalles importantes del proyecto

Estos puntos son pequeños, pero ahorran muchísimo tiempo cuando alguien entra nuevo al proyecto:

- Swagger está en `/docs`, no en `/api/docs`.
- phpMyAdmin está en `http://localhost:8085`, no en `8081`.
- La app escucha internamente en `PORT ?? 3000`; `WEB_SERVER_PORT` se usa para exponer el puerto en Docker y para el mensaje de log.
- El `ValidationPipe` global rechaza campos extra. Si el DTO no declara una propiedad, enviar esa propiedad provoca `400 Bad Request`.
- En desarrollo TypeORM usa `synchronize`; no lo actives en producción.
- `autoLoadEntities: true` carga entidades registradas por módulos con `TypeOrmModule.forFeature()`.
- `NotificationEntity` vive en `src/entities/`, fuera de un módulo propio. Es una inconsistencia conocida.
- El módulo `users` conserva la carpeta `Infraestructure/` por compatibilidad histórica.
- `teacher_subject` legacy está eliminado. La fuente de verdad docente es `teacher_subject_course`.
- Los permisos mantienen clave compuesta aunque puedan tener `assignment_id` opcional.
- Los tags se guardan hasheados; no se puede reconstruir el código original desde la base de datos.
- Las ventanas analíticas móviles son: `week` últimos 7 días y `month` últimos 30 días.

---

## 📁 Estructura de directorios

```text
backend_nestjs_aulasegura/
├── src/
│   ├── access/              # Checks, logs y analíticas de acceso
│   ├── academic-years/      # Años académicos
│   ├── auth/                # Autenticación, JWT, guards y estrategias
│   ├── courses/             # Cursos
│   ├── db/                  # Migraciones y seeders
│   ├── departments/         # Departamentos
│   ├── entities/            # Entidad huérfana/legacy de notificaciones
│   ├── notifications/       # Notificaciones y SSE
│   ├── permissions/         # Permisos usuario-aula-horario
│   ├── readers/             # Lectores RFID/QR
│   ├── rooms/               # Aulas y disponibilidad
│   ├── schedules/           # Horarios semanales y eventos
│   ├── subjects/            # Asignaturas
│   ├── tags/                # Credenciales RFID/NFC
│   ├── users/               # Usuarios, profesores y asignaciones
│   ├── app.module.ts
│   ├── main.ts
│   └── seeds.ts
├── imageserver/
│   ├── images/              # Avatares y recursos estáticos
│   └── nginx/               # Configuración de Nginx
├── test/                    # Tests e2e
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pm2.json
└── README.md
```

---

## 📝 Estado de licencia

El `package.json` declara el proyecto como:

```json
"license": "UNLICENSED"
```

Si el proyecto se va a distribuir públicamente o reutilizar fuera del contexto actual, conviene añadir una licencia explícita y actualizar esta sección.
