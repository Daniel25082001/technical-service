# Portal para clientes

Aplicación Angular con Bootstrap para la parte pública del servicio técnico.

## Desarrollo

```bash
npm install
npm start
```

La aplicación se ejecuta en `http://localhost:4200`. El backend existente se inicia por separado
desde `../backend`.

## Estructura inicial

- `src/app/client-home/`: gestión de clientes (listar, crear, editar y eliminar).
- `src/app/client-home/client-form/`: formulario de alta y edición.
- `src/app/client-home/client-list/`: buscador, listado y acciones de clientes.
- `src/app/clients.service.ts`: conexión HTTP con `/clients` en el backend.
- `src/app/client.model.ts`: tipos de cliente usados por el frontend.
- `src/app/order-tracking/`: pantalla de seguimiento de órdenes.
- `src/app/app.html`: navegación y estructura general.
- `src/app/app.routes.ts`: rutas de la aplicación.

Las plantillas HTML están separadas de los componentes TypeScript.

La gestión de clientes requiere el backend disponible en `http://localhost:3000`.
El listado permite buscar por cualquier dato del cliente y no distingue mayúsculas ni acentos.

Localidad, calle, altura y piso se conservan dentro del campo `address` existente mediante un
formato versionado del frontend, sin requerir cambios en el esquema del backend. Las direcciones
guardadas anteriormente se cargan como calle para poder completarlas al editarlas.

## Integración pendiente

El backend actual no verifica el teléfono recibido al consultar o aceptar una orden. Por ese motivo,
el formulario de seguimiento está preparado visualmente pero la consulta permanece deshabilitada
hasta que la API valide también ese dato.
