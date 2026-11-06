# Servicio técnico

Aplicación para administrar los clientes y las órdenes de un servicio técnico. El proyecto está
dividido en una API REST y una interfaz web:

- **Frontend:** Angular y Bootstrap.
- **Backend:** Node.js, Express, TypeScript y Mongoose.
- **Base de datos:** MongoDB.

## Funcionalidades

- Crear, editar, buscar y eliminar clientes.
- Asignar a cada cliente un código secuencial, por ejemplo `A0001`.
- Registrar, editar, buscar y eliminar órdenes de servicio.
- Asignar automáticamente a cada orden un número de cuatro cifras, desde `0001` hasta `9999`.
- Buscar órdenes por número, cliente, equipo, estado y otros detalles.
- Cambiar entre tema claro y oscuro.

La interfaz de clientes está en `/` y la administración de órdenes en `/ordenes`. El seguimiento de
órdenes para clientes no forma parte de la interfaz actual.

## Requisitos

- Node.js y npm.
- Docker Desktop con Docker Compose, para iniciar MongoDB mediante el archivo incluido.

## Preparar el proyecto

Desde una terminal en la carpeta principal del proyecto, instala las dependencias de cada parte:

```powershell
cd backend
npm install
cd ..\frontend
npm install
cd ..
```

Inicia MongoDB:

```powershell
cd backend
docker compose up -d
```

La configuración local conecta con `mongodb://localhost:27017/technical-service`. Docker conserva
los datos en el volumen `mongodb_data`.

## Ejecutar la aplicación

Abre dos terminales, ambas desde la carpeta principal del proyecto.

**Terminal 1 — API:**

```powershell
cd backend
npm run dev
```

La API estará disponible en `http://localhost:3000`.

**Terminal 2 — frontend:**

```powershell
cd frontend
npm start
```

Abre `http://localhost:4200` en el navegador. El frontend necesita que la API y MongoDB estén
iniciados.

## Estructura del proyecto

```text
technical-service/
├── backend/
│   └── src/
│       ├── client/       # Modelo, lógica y rutas de clientes
│       ├── db/           # Conexión con MongoDB
│       ├── order/        # Modelo, lógica y rutas de órdenes
│       └── scripts/      # Scripts de mantenimiento y migración
├── frontend/
│   └── src/app/
│       ├── client-home/  # Administración de clientes
│       ├── orders/       # Administración de órdenes
│       ├── app.routes.ts # Rutas del frontend
│       └── *.service.ts  # Comunicación con la API
└── README.md
```

Los formularios y listados se encuentran separados de las páginas que coordinan las operaciones.
Así, la presentación, las validaciones y la comunicación con el backend quedan organizadas en
componentes distintos.

## API

La API expone los siguientes endpoints:

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/clients` | Listar clientes |
| `POST` | `/clients` | Crear cliente |
| `GET` | `/clients/:id` | Obtener un cliente |
| `PUT` | `/clients/:id` | Actualizar cliente |
| `DELETE` | `/clients/:id` | Eliminar cliente |
| `GET` | `/orders` | Listar órdenes |
| `POST` | `/orders` | Crear orden |
| `GET` | `/orders/:id` | Obtener una orden |
| `PUT` | `/orders/:id` | Actualizar orden |
| `DELETE` | `/orders/:id` | Eliminar orden |

## Migrar los números de órdenes existentes

Si la base de datos ya contiene órdenes con identificadores de ocho cifras, es necesario migrarlas
antes de volver a iniciar la API con la versión actual. La migración no se ejecuta automáticamente.

1. Detén la API.
2. Haz un respaldo de MongoDB antes de continuar.
3. Desde la carpeta principal, ejecuta:

```powershell
cd backend
npm run migrate:order-ids
```

El script asigna identificadores de cuatro cifras en orden de fecha de creación y conserva la
colección original con un nombre `orders_backup_*`. Los números cambian, así que guarda cualquier
referencia a los identificadores anteriores. El máximo admitido es de `9999` órdenes; al alcanzar
ese número, la API rechazará nuevas órdenes con un mensaje explícito.

## Compilar

Para comprobar el backend:

```powershell
cd backend
npm run build
```

Para compilar el frontend:

```powershell
cd frontend
npm run build
```
