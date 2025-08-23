-- Script para corregir y configurar materias de Arquitectura 3er semestre
-- Ejecutar en SQL Server Management Studio (SSMS)
-- Database: SIGEA_DB_LOCAL

USE SIGEA_DB_LOCAL;
GO

PRINT 'Iniciando corrección para Arquitectura 3er semestre...';

-- Verificar si las tablas existen y crearlas si no
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SIGEA_DB_LOCAL')
BEGIN
    CREATE DATABASE SIGEA_DB_LOCAL;
    PRINT 'Base de datos SIGEA_DB_LOCAL creada';
END
GO

USE SIGEA_DB_LOCAL;
GO

-- Verificar y crear tabla usuarios
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        rol NVARCHAR(20) DEFAULT 'estudiante',
        matricula NVARCHAR(20),
        area_estudios NVARCHAR(50),
        semestre INT,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla usuarios creada';
END
GO

-- Agregar columnas faltantes a usuarios si no existen
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'matricula')
BEGIN
    ALTER TABLE usuarios ADD matricula NVARCHAR(20);
    PRINT 'Columna matricula agregada';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'area_estudios')
BEGIN
    ALTER TABLE usuarios ADD area_estudios NVARCHAR(50);
    PRINT 'Columna area_estudios agregada';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'semestre')
BEGIN
    ALTER TABLE usuarios ADD semestre INT;
    PRINT 'Columna semestre agregada';
END
GO

-- Crear tabla materias si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='materias' AND xtype='U')
BEGIN
    CREATE TABLE materias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        codigo NVARCHAR(20) UNIQUE NOT NULL,
        creditos INT DEFAULT 3,
        semestre INT DEFAULT 1,
        area_estudios NVARCHAR(50),
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla materias creada';
END
GO

-- Agregar columnas faltantes a materias
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('materias') AND name = 'semestre')
BEGIN
    ALTER TABLE materias ADD semestre INT DEFAULT 1;
    PRINT 'Columna semestre agregada a materias';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('materias') AND name = 'area_estudios')
BEGIN
    ALTER TABLE materias ADD area_estudios NVARCHAR(50);
    PRINT 'Columna area_estudios agregada a materias';
END
GO

-- Crear tabla calificaciones si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='calificaciones' AND xtype='U')
BEGIN
    CREATE TABLE calificaciones (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        materia_id INT NOT NULL,
        calificacion DECIMAL(4,2),
        tipo_evaluacion NVARCHAR(30) DEFAULT 'calificacion_final',
        porcentaje DECIMAL(5,2) DEFAULT 100.00,
        fecha_registro DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (materia_id) REFERENCES materias(id)
    );
    PRINT 'Tabla calificaciones creada';
END
GO

-- Agregar columnas faltantes a calificaciones
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

-- Crear tabla tipos_evaluacion si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tipos_evaluacion' AND xtype='U')
BEGIN
    CREATE TABLE tipos_evaluacion (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(50) NOT NULL UNIQUE,
        porcentaje DECIMAL(5,2) NOT NULL,
        descripcion NVARCHAR(200),
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla tipos_evaluacion creada';
END
GO

-- Insertar tipos de evaluación
DELETE FROM tipos_evaluacion;
INSERT INTO tipos_evaluacion (nombre, porcentaje, descripcion) VALUES 
('primer_parcial', 30.00, 'Primer Parcial (30%)'),
('segundo_parcial', 30.00, 'Segundo Parcial (30%)'),
('ordinario', 15.00, 'Examen Ordinario (15%)'),
('proyecto', 15.00, 'Proyecto (15%)'),
('examenes_semanales', 10.00, 'Exámenes Semanales (10%)'),
('calificacion_final', 100.00, 'Calificación Final');
PRINT 'Tipos de evaluación configurados';
GO

-- Limpiar y configurar usuario de prueba para Arquitectura 3er semestre
DELETE FROM calificaciones WHERE usuario_id IN (SELECT id FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx');
DELETE FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx';

-- Crear usuario de Arquitectura 3er semestre
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES ('Juan Pérez', 'estudiante@lasalle.edu.mx', '1234', 'estudiante', '2024030001', 'Arquitectura', 3, 1);
PRINT 'Usuario de Arquitectura 3er semestre creado';

-- Limpiar materias anteriores y crear las de Arquitectura 3er semestre
DELETE FROM calificaciones;
DELETE FROM materias;

-- Insertar materias específicas de Arquitectura 3er semestre
INSERT INTO materias (nombre, codigo, creditos, semestre, area_estudios) VALUES 
('BIOLOGÍA I', 'ARQ301-BIO', 4, 3, 'Arquitectura'),
('FÍSICA I', 'ARQ301-FIS', 4, 3, 'Arquitectura'),
('FORMACIÓN EN VALORES III', 'ARQ301-VAL', 2, 3, 'Arquitectura'),
('GEOMETRÍA DESCRIPTIVA', 'ARQ301-GEO', 3, 3, 'Arquitectura'),
('HISTORIA DE MÉXICO II', 'ARQ301-HIS', 3, 3, 'Arquitectura'),
('INTRODUCCIÓN AL DIBUJO', 'ARQ301-DIB', 3, 3, 'Arquitectura'),
('LITERATURA I', 'ARQ301-LIT', 3, 3, 'Arquitectura'),
('MATEMÁTICAS III', 'ARQ301-MAT', 4, 3, 'Arquitectura'),
('SELECTIVO ACTIVACIÓN AL AIRE LIBRE', 'ARQ301-ACT', 2, 3, 'Arquitectura'),
('INGLÉS III', 'ARQ301-ING', 3, 3, 'Arquitectura');

PRINT 'Materias de Arquitectura 3er semestre insertadas';
GO

-- Obtener IDs para las calificaciones
DECLARE @usuario_id INT;
SELECT @usuario_id = id FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx' AND area_estudios = 'Arquitectura';

PRINT 'Insertando calificaciones para cada materia...';

-- BIOLOGÍA I
DECLARE @materia_id INT;
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-BIO';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 85.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 78.5, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 82.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 88.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 86.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 83.5, 'calificacion_final', 100.00);

-- FÍSICA I
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-FIS';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 75.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 80.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 78.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 82.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 79.5, 'calificacion_final', 100.00);

-- FORMACIÓN EN VALORES III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-VAL';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 95.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 92.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 90.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 96.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 94.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 93.5, 'calificacion_final', 100.00);

-- GEOMETRÍA DESCRIPTIVA
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-GEO';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 80.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 78.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 87.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 83.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 82.0, 'calificacion_final', 100.00);

-- HISTORIA DE MÉXICO II
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-HIS';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 88.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 90.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 92.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 89.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 88.5, 'calificacion_final', 100.00);

-- INTRODUCCIÓN AL DIBUJO
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-DIB';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 92.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 89.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 95.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 91.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 90.5, 'calificacion_final', 100.00);

-- LITERATURA I
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-LIT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 86.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 88.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 84.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 90.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 87.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 87.0, 'calificacion_final', 100.00);

-- MATEMÁTICAS III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-MAT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 78.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 82.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 80.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 83.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 81.5, 'calificacion_final', 100.00);

-- SELECTIVO ACTIVACIÓN AL AIRE LIBRE
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ACT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 95.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 93.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 90.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 98.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 96.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 94.5, 'calificacion_final', 100.00);

-- INGLÉS III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ING';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 84.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 87.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 89.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 85.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 86.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 86.0, 'calificacion_final', 100.00);

PRINT 'Calificaciones insertadas para todas las materias';
GO

-- Crear tablas DET/AF si no existen
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='categorias_det_af' AND xtype='U')
BEGIN
    CREATE TABLE categorias_det_af (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tipo NVARCHAR(10) NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        descripcion NVARCHAR(500),
        cupo_maximo INT DEFAULT 30,
        activo BIT DEFAULT 1
    );
    PRINT 'Tabla categorias_det_af creada';
END

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones_det_af' AND xtype='U')
BEGIN
    CREATE TABLE inscripciones_det_af (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        categoria_id INT NOT NULL,
        fecha_inscripcion DATETIME DEFAULT GETDATE(),
        estado NVARCHAR(20) DEFAULT 'activa',
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (categoria_id) REFERENCES categorias_det_af(id),
        UNIQUE(usuario_id, categoria_id)
    );
    PRINT 'Tabla inscripciones_det_af creada';
END
GO

-- Insertar categorías DET/AF
DELETE FROM inscripciones_det_af;
DELETE FROM categorias_det_af;

INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES 
('DET', 'Robótica', 'Desarrollo de proyectos de robótica educativa y competencia para estudiantes de Arquitectura', 25),
('AF', 'Atletismo', 'Entrenamiento y competencia en disciplinas atléticas', 30);
PRINT 'Categorías DET/AF configuradas';
GO

-- Verificaciones finales
PRINT '===============================================';
PRINT 'VERIFICACIÓN FINAL';
PRINT '===============================================';

SELECT 'USUARIO CONFIGURADO:' as Tipo, nombre, email, area_estudios, semestre, matricula 
FROM usuarios WHERE email = 'estudiante@lasalle.edu.mx';

SELECT 'MATERIAS ARQUITECTURA 3ER SEMESTRE:' as Tipo, COUNT(*) as Total 
FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3;

SELECT 'CALIFICACIONES TOTALES:' as Tipo, COUNT(*) as Total 
FROM calificaciones c 
INNER JOIN usuarios u ON c.usuario_id = u.id 
WHERE u.area_estudios = 'Arquitectura' AND u.semestre = 3;

SELECT 'CATEGORÍAS DET/AF:' as Tipo, COUNT(*) as Total 
FROM categorias_det_af;

PRINT '===============================================';
PRINT 'CONFIGURACIÓN COMPLETADA EXITOSAMENTE';
PRINT 'Usuario: estudiante@lasalle.edu.mx';
PRINT 'Contraseña: 1234';
PRINT 'Área: Arquitectura - 3er Semestre';
PRINT 'Materias: 10 materias con calificaciones completas';
PRINT '===============================================';
