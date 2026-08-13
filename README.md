# Brasa House

Aplicativo web para el restaurante **Brasa House**: sitio informativo, menú conectado a base de datos, sistema de reservas con login obligatorio, carrito de compras, y panel administrativo — desarrollado con **React** en el frontend y **PHP + MySQL** en el backend.

Este proyecto fue bootstrapeado con [Create React App](https://github.com/facebook/create-react-app).

## Tecnologías utilizadas

- **Frontend:** React JS + React Router
- **Backend:** PHP (API REST, sin framework)
- **Base de datos:** MySQL (servida mediante XAMPP)
- **Autenticación:** Registro/Login de clientes con contraseña encriptada (`password_hash`) y verificación reCAPTCHA
- **Servidor local:** Apache + MySQL vía XAMPP

## Estructura del proyecto

```
brasa-house/
├── src/                        # Frontend (React)
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── PlatosDestacados.jsx
│   │   ├── Promociones.jsx
│   │   ├── Nosotros.jsx
│   │   ├── Contacto.jsx
│   │   ├── Menu.jsx             # Conectado a api/platos.php
│   │   ├── Login.jsx            # Login / Registro / Admin (3 pestañas)
│   │   ├── Reservas.jsx         # Requiere sesión iniciada
│   │   ├── Carrito.jsx
│   │   ├── Admin.jsx            # Panel administrativo
│   │   └── Footer.jsx
│   ├── context/
│   │   └── CarritoContext.jsx   # Estado global del carrito (persistente en localStorage)
│   └── App.js                   # Rutas (React Router)
│
└── brasa_house_backend/        # Backend (PHP + MySQL)
    ├── config.php               # Conexión a la base de datos + CORS
    ├── database/                # Scripts SQL (ejecutar en este orden)
    │   ├── schema.sql            # Script inicial de creación de tablas
    │   ├── seed_platos.sql       # Datos iniciales del menú
    │   ├── actualizacion_v2.sql  # Usuarios, pedidos, estado de platos, mesas 5-10
    │   ├── actualizacion_v3.sql  # Relación reserva-mesa (evita choques de horario)
    │   └── actualizacion_v4.sql  # Restricción UNIQUE en nombre de platos
    └── api/
        ├── usuarios.php          # Registro (con reCAPTCHA), login, bloqueo de usuarios
        ├── reservas.php          # CRUD de reservas + validación de conflictos y límite
        ├── mesas.php             # Gestión de mesas + filtro por disponibilidad
        ├── platos.php            # Menú + estado Disponible/Agotado
        ├── pedidos.php           # Carrito de compras
        └── dashboard.php         # Indicadores del panel administrativo
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (v16 o superior)
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP 8.2+)

## Instalación y ejecución

### 1. Base de datos

1. Enciende **Apache** y **MySQL** desde el Panel de Control de XAMPP.
2. Abre `http://localhost/phpmyadmin`.
3. Ejecuta en orden, en la pestaña **SQL**, el contenido de cada archivo dentro de `brasa_house_backend/database/`: `schema.sql` → `seed_platos.sql` → `actualizacion_v2.sql` → `actualizacion_v3.sql` → `actualizacion_v4.sql`.

### 2. Backend (PHP)

Copia la carpeta `brasa_house_backend` dentro de tu carpeta `htdocs` de XAMPP:

```
C:\xampp\htdocs\brasa_house_backend\
```

Verifica que responda entrando a `http://localhost/brasa_house_backend/api/reservas.php` (debe mostrar `[]`).

### 3. Frontend (React)

En la carpeta raíz del proyecto:

```bash
npm install
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver la página. La página se recarga automáticamente al guardar cambios.

> Nota: tanto XAMPP (Apache + MySQL) como `npm start` deben estar corriendo **al mismo tiempo** para que el sitio funcione completo.

## Endpoints de la API

| Endpoint | Métodos | Descripción |
|---|---|---|
| `api/usuarios.php` | GET, POST, PUT | Registro, login, listado y bloqueo de usuarios |
| `api/reservas.php` | GET, POST, PUT | Listar, crear (requiere sesión) y actualizar estado de reservas |
| `api/mesas.php` | GET, PUT | Listar mesas (con filtro `?fecha=&hora=`) y cambiar estado |
| `api/platos.php` | GET, PUT | Listar platos del menú y cambiar estado (Disponible/Agotado) |
| `api/pedidos.php` | GET, POST | Confirmar pedido del carrito y listar pedidos |
| `api/dashboard.php` | GET | Indicadores en tiempo real del panel administrativo |

## Funcionalidades implementadas

- Página de Inicio, Menú (conectado a base de datos), Promociones y Contacto
- Registro de clientes con validación de contraseña segura, confirmación de contraseña, mostrar/ocultar contraseña y verificación reCAPTCHA
- Login diferenciado para clientes y administrador
- Reservas con calendario interactivo, selección de mesa según disponibilidad real, y personas limitadas a la capacidad de la mesa elegida
- Validación de conflictos: no se puede reservar una mesa ya tomada en la misma fecha/hora
- Límite de 2 reservas activas por usuario
- Carrito de compras persistente (localStorage), con método de pago simulado (Tarjeta/Efectivo)
- Panel administrativo con dashboard en tiempo real, y gestión de Reservas, Mesas (10 en total), Platos y Usuarios (bloqueo/desbloqueo)

## Scripts disponibles

En el directorio del proyecto puedes ejecutar:

### `npm start`
Corre la app en modo desarrollo en [http://localhost:3000](http://localhost:3000).

### `npm test`
Lanza el test runner en modo interactivo.

### `npm run build`
Compila la app para producción en la carpeta `build`, minificada y optimizada.

## Aprende más

- [Documentación de Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
- [Documentación de React](https://reactjs.org/)
