# Backend - Sistema de Gestión de Pedidos

Este proyecto es el backend de una aplicación de gestión de pedidos, desarrollado con **NestJS**, **PostgreSQL** y **TypeORM**. Permite la autenticación de usuarios (incluyendo login con Google), gestión de productos, usuarios y pedidos con control de acceso basado en roles.

## Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Passport.js](http://www.passportjs.org/) + JWT + Google OAuth 2.0
- [Docker](https://www.docker.com/)
- [Class-validator](https://github.com/typestack/class-validator)

## Autenticación y roles

El sistema implementa dos métodos de autenticación:

- **Login tradicional**: con email y contraseña (JWT)
- **Login con Google**: usando OAuth 2.0

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/backend-pedidos.git
cd backend-pedidos
```

### 2. Variables de entorno

Crear un archivo `.env` en la raíz con

```env
PORT=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

> Completa los valores según tu configuración.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Levantar base de datos con Docker

```bash
docker-compose up -d
```

> El `docker-compose.yml` crea un contenedor PostgreSQL en el puerto `5432`.

### 5. Ejecutar migraciones o sincronizar DB

```bash
npm run start:dev
```

> La base se sincroniza automáticamente con las entidades (`synchronize: true`) para entornos de desarrollo.

---

## Endpoints principales

- `POST /auth/login` – Login con JWT
- `GET /auth/google` – Redirección a Google login
- `GET /auth/google/redirect` – Callback OAuth
- `GET /auth/current-user` – Usuario autenticado
- `GET /users` – Listar usuarios (admin)
- `POST /orders` – Crear pedido
- `PUT /orders/:id/finalize` – Finalizar pedido
- `PUT /orders/:id/reject` – Rechazar pedido

---

## Scripts útiles

```bash
npm run start         # Producción
npm run start:dev     # Desarrollo con hot reload
npm run build         # Compilar
```

---

## Autor

**Facundo Martirena Arena**  
Desarrollador Fullstack Junior  
[LinkedIn](https://www.linkedin.com/in/facundo-martirena-9b8109243/)

---
