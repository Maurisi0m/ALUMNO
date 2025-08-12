-- Script súper simple para desarrollo
-- Ejecutar con: sqlcmd -S localhost -U sa -P "Pollito92." -i server/scripts/simple-setup.sql

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SIGEA_DB_LOCAL')
BEGIN
    CREATE DATABASE SIGEA_DB_LOCAL;
    PRINT 'Base de datos SIGEA_DB_LOCAL creada';
END
GO

USE SIGEA_DB_LOCAL;
GO

-- Eliminar tabla si existe para empezar limpio
IF EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    DROP TABLE usuarios;
    PRINT 'Tabla usuarios eliminada';
END
GO

-- Crear tabla usuarios simple
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    rol NVARCHAR(20) DEFAULT 'estudiante',
    matricula NVARCHAR(50),
    area_estudios NVARCHAR(50),
    semestre INT,
    activo BIT DEFAULT 1
);
PRINT 'Tabla usuarios creada';
GO

-- Insertar usuario de prueba con contraseña en texto plano
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES (
    'Juan Pérez Arquitecto', 
    '240088@lasallep.mx', 
    '1234',  -- Contraseña en texto plano
    'estudiante',
    '240088',
    'Arquitectura',
    3,
    1
);
PRINT 'Usuario 240088@lasallep.mx creado con password: 1234';
GO

-- Crear tabla materias
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='materias' AND xtype='U')
BEGIN
    CREATE TABLE materias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        codigo NVARCHAR(20) UNIQUE NOT NULL,
        creditos INT DEFAULT 3,
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla materias creada';
END
GO

-- Insertar materias de ejemplo
INSERT INTO materias (nombre, codigo, creditos, activo) VALUES 
('Diseño Arquitectónico I', 'ARQ301', 6, 1),
('Historia de la Arquitectura', 'ARQ302', 4, 1),
('Estructuras I', 'ARQ303', 5, 1),
('Dibujo Técnico', 'ARQ304', 4, 1),
('Matemáticas Aplicadas', 'MAT301', 4, 1);
PRINT 'Materias creadas';
GO

-- Crear tabla calificaciones
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='calificaciones' AND xtype='U')
BEGIN
    CREATE TABLE calificaciones (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        materia_id INT NOT NULL,
        calificacion DECIMAL(4,2),
        fecha_registro DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (materia_id) REFERENCES materias(id)
    );
    PRINT 'Tabla calificaciones creada';
END
GO

-- Insertar calificaciones de ejemplo
INSERT INTO calificaciones (usuario_id, materia_id, calificacion) VALUES 
(1, 1, 88.5),
(1, 2, 92.0),
(1, 3, 79.5),
(1, 4, 85.0),
(1, 5, 87.5);
PRINT 'Calificaciones creadas';
GO

PRINT '======================================';
PRINT 'SETUP COMPLETADO EXITOSAMENTE';
PRINT '======================================';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Password: 1234';
PRINT 'Matrícula: 240088';
PRINT 'Área: Arquitectura';
PRINT 'Semestre: 3';
PRINT '======================================';

-- Verificar datos
SELECT nombre, email, password, matricula, area_estudios, semestre FROM usuarios;
