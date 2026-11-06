# Technical Service

Este proyecto quedó separado en dos partes:

- backend: API REST con Node.js, Express y MongoDB
- frontend: portal Angular con Bootstrap para gestionar clientes

## Estructura

```text
technical-service/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── docker-compose.yaml
│   └── node_modules/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── angular.json
│   └── node_modules/
├── README.md
└── .git/
```

## Backend

### Requisitos
- Node.js
- Docker Desktop
- npm

### Iniciar MongoDB

Desde la carpeta backend:

```bash
cd backend
docker compose up -d
```

### Instalar dependencias

```bash
cd backend
npm install
```

### Levantar API

```bash
cd backend
npm run dev
```

La API quedará en:

```text
http://localhost:3000
```

Los clientes nuevos reciben automáticamente un código secuencial (`A0001` a `A9999`, luego
`B0001`, y así sucesivamente). Los códigos ya asignados a clientes existentes no se modifican.

### Endpoints principales

```text
GET    /clients
POST   /clients
GET    /clients/:id
PUT    /clients/:id
DELETE /clients/:id

GET    /orders
POST   /orders
GET    /orders/:id
PUT    /orders/:id
DELETE /orders/:id
```

---

## Frontend

### Requisitos
- Node.js
- npm

### Instalar dependencias

```bash
cd frontend
npm install
```

### Levantar app Angular

```bash
cd frontend
npm start
```

La app quedará en:

```text
http://localhost:4200
```

> En algunos equipos Windows puede aparecer un bloqueo del sistema sobre el módulo nativo de Rollup. Si eso pasa, hay que autorizar ese archivo o mover el proyecto a una ruta permitida por Windows antes de ejecutar `npm start`.

---

## Flujo recomendado

1. Abrir Docker y levantar MongoDB desde backend
2. Levantar backend con `npm run dev`
3. Levantar frontend con `npm start`
4. Usar el portal para clientes en `http://localhost:4200`

## Nota

El backend expone los recursos desde:

```text
http://localhost:3000/clients
http://localhost:3000/orders
```

El formulario de seguimiento del frontend queda deshabilitado temporalmente: el endpoint actual de
consulta de órdenes no valida el teléfono del cliente. El backend se mantiene sin cambios en este
inicio del frontend.
