-- Script para arreglar la base de datos actual
-- Ejecutar en SQL Server Management Studio (SSMS) o con sqlcmd

USE SIGEA_DB_LOCAL;
GO

-- Verificar si las columnas existen, si no, agregarlas
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'matricula')
BEGIN
    ALTER TABLE usuarios ADD matricula NVARCHAR(50);
    PRINT 'Columna matricula agregada';
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'area_estudios')
BEGIN
    ALTER TABLE usuarios ADD area_estudios NVARCHAR(50);
    PRINT 'Columna area_estudios agregada';
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'semestre')
BEGIN
    ALTER TABLE usuarios ADD semestre INT;
    PRINT 'Columna semestre agregada';
END
GO

-- Verificar si el usuario específico existe, si no, crearlo
IF NOT EXISTS (SELECT * FROM usuarios WHERE email = '240088@lasallep.mx')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
    VALUES (
        'Juan Pérez Arquitecto', 
        '240088@lasallep.mx', 
        '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu', -- password: 1234
        'estudiante',
        '240088',
        'Arquitectura',
        3,
        1
    );
    PRINT 'Usuario 240088@lasallep.mx creado exitosamente';
END
ELSE
BEGIN
    -- Si el usuario ya existe, actualizarlo
    UPDATE usuarios 
    SET 
        matricula = '240088',
        area_estudios = 'Arquitectura',
        semestre = 3,
        password = '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu'
    WHERE email = '240088@lasallep.mx';
    PRINT 'Usuario 240088@lasallep.mx actualizado';
END
GO

PRINT '=== SCRIPT EJECUTADO EXITOSAMENTE ===';
PRINT 'Usuario de prueba: 240088@lasallep.mx / 1234';
