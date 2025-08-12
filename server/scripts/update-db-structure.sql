-- Script para actualizar la estructura de la base de datos SIGEA_DB_LOCAL
-- Agregar nuevos campos académicos
-- Ejecutar en SQL Server Management Studio (SSMS)

USE SIGEA_DB_LOCAL;
GO

-- Agregar nuevas columnas a la tabla usuarios si no existen
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'matricula')
BEGIN
    ALTER TABLE usuarios ADD matricula NVARCHAR(50) UNIQUE;
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

-- Limpiar usuarios existentes y crear el usuario específico requerido
DELETE FROM calificaciones;
DELETE FROM usuarios;
GO

-- Crear el usuario específico: 240088@lasallep.mx
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
PRINT 'Usuario 240088@lasallep.mx creado con área Arquitectura, 3er semestre';
GO

-- Crear usuario admin de respaldo
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES (
    'Administrador Sistema', 
    'admin@lasalle.edu.mx', 
    '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu', -- password: 1234
    'admin',
    'ADMIN001',
    'Administración',
    NULL,
    1
);
PRINT 'Usuario admin creado';
GO

-- Crear algunas materias específicas de Arquitectura
DELETE FROM materias;
INSERT INTO materias (nombre, codigo, creditos, activo) VALUES 
('Diseño Arquitectónico I', 'ARQ301', 6, 1),
('Historia de la Arquitectura', 'ARQ302', 4, 1),
('Estructuras I', 'ARQ303', 5, 1),
('Dibujo Técnico', 'ARQ304', 4, 1),
('Matemáticas Aplicadas', 'MAT301', 4, 1);
PRINT 'Materias de Arquitectura 3er semestre creadas';
GO

-- Agregar calificaciones para el estudiante 240088
DECLARE @usuario_id INT;
SELECT @usuario_id = id FROM usuarios WHERE matricula = '240088';

INSERT INTO calificaciones (usuario_id, materia_id, calificacion, fecha_registro) VALUES 
(@usuario_id, 1, 88.5, GETDATE()),
(@usuario_id, 2, 92.0, GETDATE()),
(@usuario_id, 3, 79.5, GETDATE()),
(@usuario_id, 4, 85.0, GETDATE()),
(@usuario_id, 5, 87.5, GETDATE());
PRINT 'Calificaciones para estudiante 240088 agregadas';
GO

PRINT '===============================================';
PRINT 'Actualización de base de datos completada';
PRINT '===============================================';
PRINT 'Usuario de prueba:';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Password: 1234';
PRINT 'Matrícula: 240088';
PRINT 'Área: Arquitectura';
PRINT 'Semestre: 3';
PRINT '===============================================';

-- Verificar datos
SELECT 
    nombre,
    email,
    matricula,
    area_estudios,
    semestre,
    rol
FROM usuarios;
