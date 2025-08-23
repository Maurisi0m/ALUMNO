-- SQL Script to verify SQL Server setup and create SIGEA_DB_LOCAL
-- Run this in SQL Server Management Studio (SSMS)

-- 1. Check SQL Server version and configuration
SELECT 
    @@SERVERNAME as ServerName,
    @@VERSION as SQLVersion,
    DB_NAME() as CurrentDatabase;

-- 2. Check if SIGEA_DB_LOCAL exists
SELECT 
    name as DatabaseName,
    state_desc as Status,
    create_date as CreatedDate
FROM sys.databases 
WHERE name = 'SIGEA_DB_LOCAL';

-- 3. If SIGEA_DB_LOCAL doesn't exist, create it
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SIGEA_DB_LOCAL')
BEGIN
    CREATE DATABASE SIGEA_DB_LOCAL;
    PRINT 'SIGEA_DB_LOCAL database created successfully';
END
ELSE
BEGIN
    PRINT 'SIGEA_DB_LOCAL database already exists';
END

-- 4. Switch to SIGEA_DB_LOCAL
USE SIGEA_DB_LOCAL;
GO

-- 5. Check if tables exist
SELECT 
    TABLE_NAME as TableName,
    TABLE_SCHEMA as SchemaName
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- 6. Create tables if they don't exist
-- Users table
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
    PRINT 'usuarios table created';
END

-- Subjects table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='materias' AND xtype='U')
BEGIN
    CREATE TABLE materias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        codigo NVARCHAR(20) UNIQUE NOT NULL,
        creditos INT DEFAULT 3,
        activo BIT DEFAULT 1
    );
    PRINT 'materias table created';
END

-- Grades table
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
    PRINT 'calificaciones table created';
END

-- 7. Insert test users
IF NOT EXISTS (SELECT * FROM usuarios WHERE email = 'admin@lasalle.edu.mx')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol) 
    VALUES ('Administrador', 'admin@lasalle.edu.mx', '$2a$10$rH8QgZjyJzE.KnG8pVnR2O8J5Z1Xa0v8aF3ZqH.9P7B6R4Y3M1Q8e', 'admin');
    PRINT 'Admin user created';
END

IF NOT EXISTS (SELECT * FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol) 
    VALUES ('Juan Pérez', 'estudiante@lasalle.edu.mx', '$2a$10$rH8QgZjyJzE.KnG8pVnR2O8J5Z1Xa0v8aF3ZqH.9P7B6R4Y3M1Q8e', 'estudiante');
    PRINT 'Student user created';
END

-- 8. Verify users and tables
SELECT 'usuarios' as TableName, COUNT(*) as RecordCount FROM usuarios
UNION ALL
SELECT 'materias' as TableName, COUNT(*) as RecordCount FROM materias
UNION ALL
SELECT 'calificaciones' as TableName, COUNT(*) as RecordCount FROM calificaciones;

-- 9. Test login query
SELECT id, nombre, email, rol FROM usuarios WHERE email = 'admin@lasalle.edu.mx';

PRINT 'Database setup verification completed';
