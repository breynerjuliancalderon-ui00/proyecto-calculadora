-- Eliminamos la base de datos si ya existe (útil al re-ejecutar)
DROP DATABASE IF EXISTS login_db;

-- Creamos la base de datos
CREATE DATABASE login_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionamos la base de datos
USE login_db;

-- =========================================
-- TABLA: usuarios
-- =========================================
CREATE TABLE usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  NOT NULL UNIQUE,
    password        VARCHAR(255)  NOT NULL,
    telefono        VARCHAR(20)   NULL,
    fecha_registro  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA: historial_operaciones
-- =========================================
CREATE TABLE historial_operaciones (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id  INT           NOT NULL,
    operacion   VARCHAR(255)  NOT NULL,
    resultado   VARCHAR(255)  NOT NULL,
    fecha       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Usuario de prueba
INSERT INTO usuarios (nombre, email, password, telefono)
VALUES ('Aprendiz SENA', 'aprendiz@sena.edu.co', '12345', '3001234567');

-- Verificamos
SELECT * FROM usuarios;
