USE brasahouse;

-- ============================================
-- 1. Tabla de usuarios (registro/login para poder reservar)
-- ============================================
CREATE TABLE IF NOT EXISTS usuario (
    idusuario INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    celular VARCHAR(9) NOT NULL,
    password VARCHAR(255) NOT NULL,
    bloqueado TINYINT(1) DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Relacionar reservas con usuario (ya no con cliente anónimo)
-- ============================================
ALTER TABLE reserva ADD COLUMN idusuario INT NULL AFTER idcliente;
ALTER TABLE reserva ADD FOREIGN KEY (idusuario) REFERENCES usuario(idusuario);
ALTER TABLE reserva MODIFY idcliente INT NULL;

-- ============================================
-- 3. Estado de disponibilidad de los platos
-- ============================================
ALTER TABLE plato ADD COLUMN estado ENUM('Disponible','Agotado') DEFAULT 'Disponible';

-- ============================================
-- 4. Carrito de compras (pedidos)
-- ============================================
CREATE TABLE IF NOT EXISTS pedido (
    idpedido INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipopago ENUM('Tarjeta','Efectivo') NOT NULL,
    total DECIMAL(8,2) NOT NULL,
    estado ENUM('Pendiente','Completado') DEFAULT 'Pendiente',
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
    iddetalle INT AUTO_INCREMENT PRIMARY KEY,
    idpedido INT NOT NULL,
    idplato INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (idpedido) REFERENCES pedido(idpedido),
    FOREIGN KEY (idplato) REFERENCES plato(idplato)
);

-- ============================================
-- 5. Mesas adicionales (de 4 a 10 mesas en total)
-- ============================================
INSERT INTO mesa (numero, capacidad, estado) VALUES
('Mesa 5', 2, 'Disponible'),
('Mesa 6', 4, 'Disponible'),
('Mesa 7', 6, 'Disponible'),
('Mesa 8', 2, 'Disponible'),
('Mesa 9', 4, 'Disponible'),
('Mesa 10', 8, 'Disponible');
