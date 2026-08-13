-- ============================================
-- Base de datos: brasahouse
-- Crear esto en phpMyAdmin (pestaña SQL) o en la consola de MySQL de XAMPP
-- ============================================

CREATE DATABASE IF NOT EXISTS brasahouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE brasahouse;

-- Tabla clientes
CREATE TABLE cliente (
    idcliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla mesas (usada en el panel Admin)
CREATE TABLE mesa (
    idmesa INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) NOT NULL,
    capacidad INT NOT NULL,
    estado ENUM('Disponible', 'Ocupada') DEFAULT 'Disponible'
);

-- Tabla reservas (llenada desde el formulario de React)
CREATE TABLE reserva (
    idreserva INT AUTO_INCREMENT PRIMARY KEY,
    idcliente INT NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    personas INT NOT NULL,
    ocasion VARCHAR(50),
    mensaje TEXT,
    estado ENUM('Pendiente', 'Confirmada') DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente)
);

-- Tabla platos (para el componente Menu.jsx)
CREATE TABLE plato (
    idplato INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(6,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagen VARCHAR(150)
);

-- Datos iniciales de ejemplo para mesas
INSERT INTO mesa (numero, capacidad, estado) VALUES
('Mesa 1', 4, 'Disponible'),
('Mesa 2', 6, 'Ocupada'),
('Mesa 3', 2, 'Disponible'),
('Mesa 4', 4, 'Disponible');
