-- Script para crear la base de datos local SIGEA_DB_LOCAL
-- Ejecutar en SQL Server Management Studio (SSMS) o SQL Server Express

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SIGEA_DB_LOCAL')
BEGIN
    CREATE DATABASE SIGEA_DB_LOCAL;
    PRINT 'Base de datos SIGEA_DB_LOCAL creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La base de datos SIGEA_DB_LOCAL ya existe';
END
GO

-- Usar la base de datos
USE SIGEA_DB_LOCAL;
GO

-- Crear tabla de usuarios si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        rol NVARCHAR(20) DEFAULT 'estudiante',
        fecha_creacion DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla usuarios creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla usuarios ya existe';
END
GO

-- Crear tabla de materias si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='materias' AND xtype='U')
BEGIN
    CREATE TABLE materias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        codigo NVARCHAR(20) UNIQUE NOT NULL,
        creditos INT DEFAULT 3,
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla materias creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla materias ya existe';
END
GO

-- Crear tabla de calificaciones si no existe
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
    PRINT 'Tabla calificaciones creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla calificaciones ya existe';
END
GO

-- Insertar datos de ejemplo
-- Usuario administrador de ejemplo
IF NOT EXISTS (SELECT * FROM usuarios WHERE email = 'admin@lasalle.edu.mx')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol) 
    VALUES ('Administrador', 'admin@lasalle.edu.mx', '$2a$10$rH8QgZjyJzE.KnG8pVnR2O8J5Z1Xa0v8aF3ZqH.9P7B6R4Y3M1Q8e', 'admin');
    PRINT 'Usuario administrador creado (password: admin123)';
END
GO

-- Usuario estudiante de ejemplo
IF NOT EXISTS (SELECT * FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol) 
    VALUES ('Juan Pérez', 'estudiante@lasalle.edu.mx', '$2a$10$rH8QgZjyJzE.KnG8pVnR2O8J5Z1Xa0v8aF3ZqH.9P7B6R4Y3M1Q8e', 'estudiante');
    PRINT 'Usuario estudiante creado (password: admin123)';
END
GO

-- Materias de ejemplo
IF NOT EXISTS (SELECT * FROM materias WHERE codigo = 'MAT101')
BEGIN
    INSERT INTO materias (nombre, codigo, creditos) VALUES 
    ('Matemáticas I', 'MAT101', 4),
    ('Física I', 'FIS101', 3),
    ('Programación I', 'PRG101', 4),
    ('Química General', 'QUI101', 3),
    ('Historia de México', 'HIS101', 2);
    PRINT 'Materias de ejemplo creadas';
END
GO

-- Calificaciones de ejemplo
IF NOT EXISTS (SELECT * FROM calificaciones WHERE usuario_id = 2)
BEGIN
    INSERT INTO calificaciones (usuario_id, materia_id, calificacion) VALUES 
    (2, 1, 85.5),
    (2, 2, 78.0),
    (2, 3, 92.0),
    (2, 4, 81.5),
    (2, 5, 88.0);
    PRINT 'Calificaciones de ejemplo creadas';
END
GO

PRINT '===============================================';
PRINT 'Inicialización de base de datos completada';
PRINT 'Base de datos: SIGEA_DB_LOCAL';
PRINT 'Servidor: localhost';
PRINT 'Puerto: 1433';
PRINT '===============================================';
PRINT 'Usuarios de prueba:';
PRINT 'Admin: admin@lasalle.edu.mx / admin123';
PRINT 'Estudiante: estudiante@lasalle.edu.mx / admin123';
PRINT '===============================================';
