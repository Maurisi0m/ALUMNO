-- Script para agregar materias de 3er semestre y sistema de calificaciones mejorado
-- Ejecutar en SQL Server Management Studio (SSMS) o SQL Server Express
-- Database: SIGEA_DB_LOCAL

USE SIGEA_DB_LOCAL;
GO

-- Agregar columnas adicionales a la tabla usuarios si no existen
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'matricula')
BEGIN
    ALTER TABLE usuarios ADD matricula NVARCHAR(20);
    PRINT 'Columna matricula agregada a usuarios';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'area_estudios')
BEGIN
    ALTER TABLE usuarios ADD area_estudios NVARCHAR(50);
    PRINT 'Columna area_estudios agregada a usuarios';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'semestre')
BEGIN
    ALTER TABLE usuarios ADD semestre INT;
    PRINT 'Columna semestre agregada a usuarios';
END
GO

-- Actualizar estructura de calificaciones para incluir diferentes tipos de evaluación
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('calificaciones') AND name = 'tipo_evaluacion')
BEGIN
    ALTER TABLE calificaciones ADD tipo_evaluacion NVARCHAR(30) DEFAULT 'calificacion_final';
    PRINT 'Columna tipo_evaluacion agregada a calificaciones';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('calificaciones') AND name = 'porcentaje')
BEGIN
    ALTER TABLE calificaciones ADD porcentaje DECIMAL(5,2) DEFAULT 100.00;
    PRINT 'Columna porcentaje agregada a calificaciones';
END
GO

-- Crear tabla de tipos de evaluación si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tipos_evaluacion' AND xtype='U')
BEGIN
    CREATE TABLE tipos_evaluacion (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(50) NOT NULL UNIQUE,
        porcentaje DECIMAL(5,2) NOT NULL,
        descripcion NVARCHAR(200),
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla tipos_evaluacion creada exitosamente';
END
GO

-- Insertar tipos de evaluación
IF NOT EXISTS (SELECT * FROM tipos_evaluacion WHERE nombre = 'primer_parcial')
BEGIN
    INSERT INTO tipos_evaluacion (nombre, porcentaje, descripcion) VALUES 
    ('primer_parcial', 30.00, 'Primer Parcial (30%)'),
    ('segundo_parcial', 30.00, 'Segundo Parcial (30%)'),
    ('ordinario', 15.00, 'Examen Ordinario (15%)'),
    ('proyecto', 15.00, 'Proyecto (15%)'),
    ('examenes_semanales', 10.00, 'Exámenes Semanales (10%)'),
    ('calificacion_final', 100.00, 'Calificación Final');
    PRINT 'Tipos de evaluación insertados';
END
GO

-- Insertar materias de 3er semestre
-- Primero eliminar materias existentes de ejemplo si existen
DELETE FROM materias WHERE codigo LIKE 'MAT%' OR codigo LIKE 'FIS%' OR codigo LIKE 'PRG%' OR codigo LIKE 'QUI%' OR codigo LIKE 'HIS%';

-- Insertar las materias de 3er semestre específicas
INSERT INTO materias (nombre, codigo, creditos) VALUES 
('BIOLOGÍA I', 'BIO301', 4),
('FÍSICA I', 'FIS301', 4),
('FORMACIÓN EN VALORES III', 'VAL301', 2),
('GEOMETRÍA DESCRIPTIVA', 'GEO301', 3),
('HISTORIA DE MÉXICO II', 'HIS302', 3),
('INTRODUCCIÓN AL DIBUJO', 'DIB301', 3),
('LITERATURA I', 'LIT301', 3),
('MATEMÁTICAS III', 'MAT303', 4),
('SELECTIVO ACTIVACIÓN AL AIRE LIBRE', 'ACT301', 2),
('INGLÉS III', 'ING303', 3);

PRINT 'Materias de 3er semestre insertadas';
GO

-- Crear tabla para categorías DET/AF si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='categorias_det_af' AND xtype='U')
BEGIN
    CREATE TABLE categorias_det_af (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tipo NVARCHAR(10) NOT NULL, -- 'DET' o 'AF'
        nombre NVARCHAR(100) NOT NULL,
        descripcion NVARCHAR(500),
        cupo_maximo INT DEFAULT 30,
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla categorias_det_af creada exitosamente';
END
GO

-- Insertar categorías DET y AF
IF NOT EXISTS (SELECT * FROM categorias_det_af WHERE nombre = 'Robótica')
BEGIN
    INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES 
    ('DET', 'Robótica', 'Desarrollo de proyectos de robótica educativa y competencia', 25),
    ('AF', 'Atletismo', 'Entrenamiento y competencia en disciplinas atléticas', 30);
    PRINT 'Categorías DET/AF insertadas';
END
GO

-- Crear tabla para inscripciones DET/AF si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones_det_af' AND xtype='U')
BEGIN
    CREATE TABLE inscripciones_det_af (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        categoria_id INT NOT NULL,
        fecha_inscripcion DATETIME DEFAULT GETDATE(),
        estado NVARCHAR(20) DEFAULT 'activa', -- 'activa', 'baja', 'completada'
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (categoria_id) REFERENCES categorias_det_af(id),
        UNIQUE(usuario_id, categoria_id) -- Un usuario no puede inscribirse dos veces en la misma categoría
    );
    PRINT 'Tabla inscripciones_det_af creada exitosamente';
END
GO

-- Actualizar usuario de ejemplo con datos completos
UPDATE usuarios 
SET matricula = '2024030001', 
    area_estudios = 'Arquitectura', 
    semestre = 3
WHERE email = 'estudiante@lasalle.edu.mx';

-- Insertar calificaciones de ejemplo para las materias de 3er semestre
-- Primero obtener el ID del usuario estudiante
DECLARE @usuario_id INT;
SELECT @usuario_id = id FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx';

-- Eliminar calificaciones anteriores del usuario
DELETE FROM calificaciones WHERE usuario_id = @usuario_id;

-- Insertar calificaciones para cada materia con diferentes tipos de evaluación
DECLARE @materia_id INT;

-- BIOLOGÍA I
SELECT @materia_id = id FROM materias WHERE codigo = 'BIO301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 85.0, 'primer_parcial'),
(@usuario_id, @materia_id, 78.5, 'segundo_parcial'),
(@usuario_id, @materia_id, 82.0, 'ordinario'),
(@usuario_id, @materia_id, 88.0, 'proyecto'),
(@usuario_id, @materia_id, 86.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 83.5, 'calificacion_final');

-- FÍSICA I
SELECT @materia_id = id FROM materias WHERE codigo = 'FIS301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 75.0, 'primer_parcial'),
(@usuario_id, @materia_id, 80.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 85.0, 'ordinario'),
(@usuario_id, @materia_id, 78.0, 'proyecto'),
(@usuario_id, @materia_id, 82.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 79.5, 'calificacion_final');

-- FORMACIÓN EN VALORES III
SELECT @materia_id = id FROM materias WHERE codigo = 'VAL301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 95.0, 'primer_parcial'),
(@usuario_id, @materia_id, 92.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 90.0, 'ordinario'),
(@usuario_id, @materia_id, 96.0, 'proyecto'),
(@usuario_id, @materia_id, 94.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 93.5, 'calificacion_final');

-- GEOMETRÍA DESCRIPTIVA
SELECT @materia_id = id FROM materias WHERE codigo = 'GEO301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 80.0, 'primer_parcial'),
(@usuario_id, @materia_id, 85.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 78.0, 'ordinario'),
(@usuario_id, @materia_id, 87.0, 'proyecto'),
(@usuario_id, @materia_id, 83.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 82.0, 'calificacion_final');

-- HISTORIA DE MÉXICO II
SELECT @materia_id = id FROM materias WHERE codigo = 'HIS302';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 88.0, 'primer_parcial'),
(@usuario_id, @materia_id, 85.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 90.0, 'ordinario'),
(@usuario_id, @materia_id, 92.0, 'proyecto'),
(@usuario_id, @materia_id, 89.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 88.5, 'calificacion_final');

-- INTRODUCCIÓN AL DIBUJO
SELECT @materia_id = id FROM materias WHERE codigo = 'DIB301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 92.0, 'primer_parcial'),
(@usuario_id, @materia_id, 89.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 85.0, 'ordinario'),
(@usuario_id, @materia_id, 95.0, 'proyecto'),
(@usuario_id, @materia_id, 91.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 90.5, 'calificacion_final');

-- LITERATURA I
SELECT @materia_id = id FROM materias WHERE codigo = 'LIT301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 86.0, 'primer_parcial'),
(@usuario_id, @materia_id, 88.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 84.0, 'ordinario'),
(@usuario_id, @materia_id, 90.0, 'proyecto'),
(@usuario_id, @materia_id, 87.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 87.0, 'calificacion_final');

-- MATEMÁTICAS III
SELECT @materia_id = id FROM materias WHERE codigo = 'MAT303';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 78.0, 'primer_parcial'),
(@usuario_id, @materia_id, 82.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 85.0, 'ordinario'),
(@usuario_id, @materia_id, 80.0, 'proyecto'),
(@usuario_id, @materia_id, 83.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 81.5, 'calificacion_final');

-- SELECTIVO ACTIVACIÓN AL AIRE LIBRE
SELECT @materia_id = id FROM materias WHERE codigo = 'ACT301';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 95.0, 'primer_parcial'),
(@usuario_id, @materia_id, 93.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 90.0, 'ordinario'),
(@usuario_id, @materia_id, 98.0, 'proyecto'),
(@usuario_id, @materia_id, 96.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 94.5, 'calificacion_final');

-- INGLÉS III
SELECT @materia_id = id FROM materias WHERE codigo = 'ING303';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion) VALUES 
(@usuario_id, @materia_id, 84.0, 'primer_parcial'),
(@usuario_id, @materia_id, 87.0, 'segundo_parcial'),
(@usuario_id, @materia_id, 89.0, 'ordinario'),
(@usuario_id, @materia_id, 85.0, 'proyecto'),
(@usuario_id, @materia_id, 86.0, 'examenes_semanales'),
(@usuario_id, @materia_id, 86.0, 'calificacion_final');

PRINT 'Calificaciones de ejemplo para 3er semestre insertadas';
GO

-- Inscribir al usuario de ejemplo en DET - Robótica
DECLARE @usuario_id INT, @categoria_id INT;
SELECT @usuario_id = id FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx';
SELECT @categoria_id = id FROM categorias_det_af WHERE nombre = 'Robótica';

IF NOT EXISTS (SELECT * FROM inscripciones_det_af WHERE usuario_id = @usuario_id AND categoria_id = @categoria_id)
BEGIN
    INSERT INTO inscripciones_det_af (usuario_id, categoria_id) VALUES (@usuario_id, @categoria_id);
    PRINT 'Usuario inscrito en DET - Robótica';
END
GO

PRINT '===============================================';
PRINT 'Script de 3er semestre completado exitosamente';
PRINT '===============================================';
PRINT 'Materias de 3er semestre agregadas:';
PRINT '- BIOLOGÍA I';
PRINT '- FÍSICA I';
PRINT '- FORMACIÓN EN VALORES III';
PRINT '- GEOMETRÍA DESCRIPTIVA';
PRINT '- HISTORIA DE MÉXICO II';
PRINT '- INTRODUCCIÓN AL DIBUJO';
PRINT '- LITERATURA I';
PRINT '- MATEMÁTICAS III';
PRINT '- SELECTIVO ACTIVACIÓN AL AIRE LIBRE';
PRINT '- INGLÉS III';
PRINT '';
PRINT 'Sistema de calificaciones con porcentajes:';
PRINT '- Primer Parcial (30%)';
PRINT '- Segundo Parcial (30%)';
PRINT '- Ordinario (15%)';
PRINT '- Proyecto (15%)';
PRINT '- Exámenes Semanales (10%)';
PRINT '';
PRINT 'Categorías DET/AF agregadas:';
PRINT '- DET: Robótica';
PRINT '- AF: Atletismo';
PRINT '===============================================';
