# AulaSegura - Backend

Sistema de control de acceso para instituciones educativas mediante RFID, NFC, y QR desarrollado con NestJS y arquitectura limpia.

## 📋 Descripción

AulaSegura es una aplicación backend que gestiona el control de acceso a aulas y espacios educativos mediante tecnología RFID, NFC y QR. El sistema permite administrar usuarios, permisos, horarios, y realizar seguimiento de accesos en tiempo real.

### Funcionalidades principales:

- 🔐 Autenticación y autorización con JWT (access y refresh)
- 👥 Gestión de usuarios (profesores, administrativos, personal)
- 📚 Gestión académica (cursos, asignaturas, departamentos)
- 🏫 Control de salas y espacios
- 📅 Gestión de horarios (semanales y eventos)
- 🏷️ Control de acceso mediante tags RFID/NFC y QR
- 📖 Registro de accesos (access logs)
- 🔑 Permisos granulares por usuario-sala-horario

## 🛠️ Tecnologías

### Core
- **NestJS** v11 - Framework backend progresivo de Node.js
- **TypeScript** - Tipado estático y desarrollo moderno
- **TypeORM** v0.3 - ORM para gestión de base de datos
- **MariaDB** 11.4.5 - Base de datos relacional

### Seguridad
- **Passport JWT** - Autenticación basada en tokens
- **bcrypt** (@node-rs/bcrypt) - Hash de contraseñas
- **Class Validator** - Validación de DTOs

### Infraestructura
- **Docker & Docker Compose** - Contenedorización y orquestación
- **PM2** - Gestor de procesos Node.js
- **Nginx** - Servidor de imágenes estáticas
- **phpMyAdmin** - Gestión visual de base de datos

### Documentación
- **Swagger/OpenAPI** - Documentación automática de API

## 🏗️ Arquitectura

El proyecto sigue una **Arquitectura Limpia (Clean Architecture)** organizada por módulos funcionales:

```
src/
├── {modulo}/
│   ├── {modulo}.module.ts
│   ├── application/        # Casos de uso y DTOs
│   │   ├── dto/
│   │   └── services/
│   ├── domain/             # Entidades y repositorios (interfaces)
│   │   ├── entities/
│   │   ├── enums/
│   │   └── repositories/
│   ├── infrastructure/     # Implementación de repositorios y decoradores
│   │   ├── persistence/
│   │   ├── decorators/
│   │   └── guards/
│   └── presentation/       # Controladores y mappers
│       ├── controllers/
│       ├── dto/
│       └── mappers/
```

### Módulos principales:
- `auth` - Autenticación y autorización
- `users` - Gestión de usuarios y profesores
- `courses` - Cursos y niveles educativos
- `subjects` - Asignaturas
- `departments` - Departamentos académicos
- `academic-years` - Años académicos
- `rooms` - Salas y espacios
- `schedules` - Horarios (semanales y eventos)
- `readers` - Lectores RFID
- `tags` - Tags NFC/RFID
- `permissions` - Permisos de acceso
- `access` - Registros de acceso

## 🐳 Docker Compose

El proyecto incluye 4 servicios orquestados:

### 1. **webserver** (NestJS)
- Contenedor: `aulasegura-nestjs`
- Puerto: `8000`
- Base: Node.js con PM2
- Reinicio automático en cambios (desarrollo)

### 2. **database** (MariaDB)
- Contenedor: `aulasegura-mariadb`
- Imagen: `yobasystems/alpine-mariadb:11.4.5`
- Puerto: `3306`
- Volumen persistente: `mariadb_data`
- Charset: `utf8mb4_unicode_ci`

### 3. **phpmyadmin**
- Contenedor: `aulasegura-phpmyadmin`
- Puerto: `8081`
- Interfaz web para gestión de BD
- URL: http://localhost:8081

### 4. **imageserver** (Nginx)
- Contenedor: `aulasegura-nginx-images`
- Puerto: `8090`
- Sirve imágenes estáticas (avatares, etc.)
- Volumen: `./imageserver/images`

## 🚀 Instalación y Arranque

### Prerrequisitos
- Docker y Docker Compose

### 1. Clonar el repositorio
```bash
git clone https://github.com/fmontesdev/backend_nestjs_aulasegura.git
cd backend_nestjs_aulasegura
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=database
DB_PORT=3306
DB_DATABASE=aulasegura
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DB_ROOT_PASSWORD=tu_contraseña_root_db

# Application
NODE_ENV=development
WEB_SERVER_PORT=8000

# JWT
JWT_ACCESS_SECRET=tu_clave_secreta_jwt_access
JWT_REFRESH_SECRET=tu_clave_secreta_jwt_refresh
JWT_ACCESS_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d

# Tag Configuration (RFID/NFC)
TAG_PEPPER=tu_clave_secreta_para_encriptacion_en_db

# Image Server Configuration (Nginx)
IMAGES_PATH=/app/images
IMAGES_BASE_URL=http://localhost:8090
```

### 3. Levantar servicios con Docker Compose
```bash
docker-compose up -d
```

Docker Compose se encargará de:
- ✅ Construir la imagen del contenedor
- ✅ Instalar todas las dependencias de Node.js
- ✅ Levantar MariaDB en puerto 3306
- ✅ Levantar NestJS en puerto 8000
- ✅ Levantar phpMyAdmin en puerto 8081
- ✅ Levantar Nginx (imágenes) en puerto 8090

### 4. Verificar que los servicios están corriendo
```bash
docker-compose ps
```

## 🌱 Poblar la Base de Datos

El proyecto incluye seeders completos para popular la base de datos con datos de desarrollo.

### Ejecutar todos los seeders

```bash
npm run seed:dev
```

Esto poblará la base de datos con:
- ✅ **4 Roles** (admin, teacher, janitor, support_staff)
- ✅ **3 Años académicos** (2023-2024, 2024-2025, 2025-2026)
- ✅ **21 Departamentos** académicos
- ✅ **26 Cursos** (ESO, Bachillerato, FP)
- ✅ **5 Usuarios** de prueba
- ✅ **193 Asignaturas**
- ✅ **46 Salas**
- ✅ **46 Lectores RFID**
- ✅ **10 Tags** (NFC/RFID)
- ✅ **76 Horarios** (70 semanales + 6 eventos)
- ✅ **47 Permisos** de acceso
- ✅ Relaciones: course-subject, academic_year-course, teacher-subject, role-user

**Total: ~842 registros**

### Usuarios de prueba

Todos los usuarios tienen la contraseña: **`AulaSegura@1234`**

| Email | Nombre | Rol |
|-------|--------|-----|
| admin@gva.es | Ana Morales Martínez | Administrador |
| teacher@gva.es | Luis Torregrosa Pérez | Profesor |
| pagado@gva.es | Paco García Donat | Profesor |
| janitor@gva.es | Marta Fernández Ruiz | Conserje |
| staff@gva.es | Eva Mendes López | Personal de apoyo |

### 🏷️ Tags RFID/NFC de prueba

Cada usuario tiene asignados tags para pruebas de acceso:

| Usuario | Email | UUID | Tag RFID | Tag NFC |
|---------|-------|------|----------|----------|
| Ana Morales Martínez | admin@gva.es | `2d9ce2e0-b172-4756-8c92-c647e3f0a649` | `00AABBCCDDEE11` | `2d45b6416a5929c7085754f2a7635eb4` |
| Marta Fernández Ruiz | janitor@gva.es | `1a1fcf19-6cbc-4d30-be9f-59f337c633a5` | `00AABBCCDDEE22` | `f70c19bcf21ccfb08ad758b07e6f9a7c` |
| Paco García Donat | pagado@gva.es | `6b86f7e7-bf19-4117-b262-a1221c4ced55` | `00AABBCCDDEE33` | `a35dda264047067599ad9773f8345fd6` |
| Luis Torregrosa Pérez | teacher@gva.es | `2f09b2f8-3e2a-4cb6-b907-e98db842b4ee` | `00AABBCCDDEE44` | `aa6a9afe8029f1a5a19b95f927d68db4` |
| Eva Mendes López | staff@gva.es | `c3496420-0e39-4af4-951e-5b11f54e5022` | `00AABBCCDDEE55` | `0ff84eccc8347c78a5c8a4991e242115` |

> **Nota**: Estos tags pueden utilizarse para probar las consultas de acceso y validación del sistema.

### Seeders individuales

Los seeders están en `src/db/seeding/seeds/` y se ejecutan en orden:

1. `01-role.seeder.ts` - Roles del sistema
2. `02-department.seeder.ts` - Departamentos
3. `02b-academic-year.seeder.ts` - Años académicos
4. `03-course.seeder.ts` - Cursos
5. `04-user.seeder.ts` - Usuarios
6. `05-role-user.seeder.ts` - Asignación roles-usuarios
7. `06-room.seeder.ts` - Salas
8. `07-academic-year-course.seeder.ts` - Relación años-cursos
9. `07b-subject.seeder.ts` - Asignaturas
10. `08-course-subject.seeder.ts` - Relación cursos-asignaturas
11. `09-teacher.seeder.ts` - Profesores
12. `10-teacher-subject.seeder.ts` - Asignación profesor-asignatura
13. `11-reader.seeder.ts` - Lectores RFID
14. `12-tag.seeder.ts` - Tags NFC/RFID
15. `13-schedule.seeder.ts` - Horarios
16. `14-weekly-schedule.seeder.ts` - Horarios semanales
17. `15-event-schedule.seeder.ts` - Horarios de eventos
18. `16-permission.seeder.ts` - Permisos de acceso

**Nota:** Puedes ejecutar los seeders múltiples veces sin duplicar datos.

## 🔧 Desarrollo

### Modo desarrollo con hot-reload
```bash
npm run start:dev
```

### Build para producción
```bash
npm run build
npm run start:prod
```

### Ejecutar tests
```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

### Linting y formato
```bash
npm run lint          # Ejecutar ESLint
npm run format        # Formatear con Prettier
```

## 📚 Documentación API

Una vez iniciado el servidor, accede a la documentación Swagger en:

```
http://localhost:8000/api/docs
```

## 🗄️ Gestión de Base de Datos

### Acceso a phpMyAdmin
```
URL: http://localhost:8081
Usuario: [tu DB_USER]
Password: [tu DB_PASSWORD]
```

### Acceso directo a MariaDB
```bash
docker exec -it aulasegura-mariadb mariadb -u[usuario] -p[password] aulasegura
```

### Backup de la base de datos
```bash
docker exec aulasegura-mariadb mysqldump -u[usuario] -p[password] aulasegura > backup.sql
```

## 📁 Estructura de Directorios Principales

```
backend_nestjs_aulasegura/
├── src/
│   ├── db/
│   │   ├── seeding/          # Seeders organizados
│   │   └── init-data.sql     # Script SQL original
│   ├── {modulos}/            # Módulos funcionales
│   ├── main.ts               # Entry point
│   └── seeds.ts              # Script de ejecución de seeders
├── imageserver/
│   ├── images/               # Avatares y recursos
│   └── nginx/                # Configuración Nginx
├── scripts/                  # Scripts de utilidad
├── docker-compose.yml        # Orquestación de servicios
├── Dockerfile                # Imagen de la aplicación
└── pm2.json                  # Configuración PM2
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
