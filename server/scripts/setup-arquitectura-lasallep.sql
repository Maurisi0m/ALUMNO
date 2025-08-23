-- Script completo para configurar SIGEA con formato @lasallep.mx
-- Usuario de prueba: 240088@lasallep.mx (Mauro Ortiz)
-- Ejecutar en SQL Server Management Studio (SSMS)
-- Database: SIGEA_DB_LOCAL

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

USE SIGEA_DB_LOCAL;
GO

PRINT 'Configurando base de datos para formato @lasallep.mx...';

-- Crear tabla usuarios si no existe
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
    PRINT 'Tabla usuarios creada exitosamente';
END
ELSE
BEGIN
    -- Agregar columnas faltantes si no existen
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
    
    PRINT 'Tabla usuarios verificada';
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
    PRINT 'Tabla materias creada exitosamente';
END
ELSE
BEGIN
    -- Agregar columnas faltantes si no existen
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
    
    PRINT 'Tabla materias verificada';
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
    PRINT 'Tabla calificaciones creada exitosamente';
END
ELSE
BEGIN
    -- Agregar columnas faltantes si no existen
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('calificaciones') AND name = 'tipo_evaluacion')
    BEGIN
        ALTER TABLE calificaciones ADD tipo_evaluacion NVARCHAR(30) DEFAULT 'calificacion_final';
        PRINT 'Columna tipo_evaluacion agregada';
    END

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('calificaciones') AND name = 'porcentaje')
    BEGIN
        ALTER TABLE calificaciones ADD porcentaje DECIMAL(5,2) DEFAULT 100.00;
        PRINT 'Columna porcentaje agregada';
    END
    
    PRINT 'Tabla calificaciones verificada';
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
    PRINT 'Tabla tipos_evaluacion creada exitosamente';
END
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
    PRINT 'Tabla categorias_det_af creada exitosamente';
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
    PRINT 'Tabla inscripciones_det_af creada exitosamente';
END
GO

-- LIMPIAR DATOS ANTERIORES Y CONFIGURAR NUEVOS
PRINT 'Limpiando datos anteriores...';

-- Eliminar datos en orden correcto (por las foreign keys)
DELETE FROM inscripciones_det_af;
DELETE FROM calificaciones;
DELETE FROM usuarios WHERE email LIKE '%@lasalle.edu.mx' OR email LIKE '%@lasallep.mx';
DELETE FROM materias;
DELETE FROM tipos_evaluacion;
DELETE FROM categorias_det_af;

PRINT 'Datos anteriores eliminados';

-- INSERTAR TIPOS DE EVALUACION
INSERT INTO tipos_evaluacion (nombre, porcentaje, descripcion) VALUES 
('primer_parcial', 30.00, 'Primer Parcial (30%)'),
('segundo_parcial', 30.00, 'Segundo Parcial (30%)'),
('ordinario', 15.00, 'Examen Ordinario (15%)'),
('proyecto', 15.00, 'Proyecto (15%)'),
('examenes_semanales', 10.00, 'Examenes Semanales (10%)'),
('calificacion_final', 100.00, 'Calificacion Final');

PRINT 'Tipos de evaluacion configurados';

-- CREAR USUARIO DE PRUEBA MAURO ORTIZ
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES ('Mauro Ortiz', '240088@lasallep.mx', '1234', 'estudiante', '240088', 'Arquitectura', 3, 1);

PRINT 'Usuario Mauro Ortiz (240088@lasallep.mx) creado';

-- INSERTAR MATERIAS DE ARQUITECTURA 3ER SEMESTRE
INSERT INTO materias (nombre, codigo, creditos, semestre, area_estudios) VALUES 
('BIOLOGIA I', 'ARQ301-BIO', 4, 3, 'Arquitectura'),
('FISICA I', 'ARQ301-FIS', 4, 3, 'Arquitectura'),
('FORMACION EN VALORES III', 'ARQ301-VAL', 2, 3, 'Arquitectura'),
('GEOMETRIA DESCRIPTIVA', 'ARQ301-GEO', 3, 3, 'Arquitectura'),
('HISTORIA DE MEXICO II', 'ARQ301-HIS', 3, 3, 'Arquitectura'),
('INTRODUCCION AL DIBUJO', 'ARQ301-DIB', 3, 3, 'Arquitectura'),
('LITERATURA I', 'ARQ301-LIT', 3, 3, 'Arquitectura'),
('MATEMATICAS III', 'ARQ301-MAT', 4, 3, 'Arquitectura'),
('SELECTIVO ACTIVACION AL AIRE LIBRE', 'ARQ301-ACT', 2, 3, 'Arquitectura'),
('INGLES III', 'ARQ301-ING', 3, 3, 'Arquitectura');

PRINT 'Materias de Arquitectura 3er semestre insertadas';

-- INSERTAR CALIFICACIONES PARA MAURO ORTIZ
DECLARE @usuario_id INT;
SELECT @usuario_id = id FROM usuarios WHERE email = '240088@lasallep.mx';

PRINT 'Insertando calificaciones completas para Mauro Ortiz...';

-- BIOLOGIA I
DECLARE @materia_id INT;
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-BIO';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 85.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 78.5, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 82.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 88.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 86.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 83.5, 'calificacion_final', 100.00);

-- FISICA I
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-FIS';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 75.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 80.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 78.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 82.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 79.5, 'calificacion_final', 100.00);

-- FORMACION EN VALORES III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-VAL';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 95.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 92.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 90.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 96.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 94.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 93.5, 'calificacion_final', 100.00);

-- GEOMETRIA DESCRIPTIVA
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-GEO';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 80.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 78.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 87.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 83.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 82.0, 'calificacion_final', 100.00);

-- HISTORIA DE MEXICO II
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-HIS';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 88.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 90.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 92.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 89.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 88.5, 'calificacion_final', 100.00);

-- INTRODUCCION AL DIBUJO
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

-- MATEMATICAS III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-MAT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 78.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 82.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 85.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 80.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 83.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 81.5, 'calificacion_final', 100.00);

-- SELECTIVO ACTIVACION AL AIRE LIBRE
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ACT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 95.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 93.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 90.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 98.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 96.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 94.5, 'calificacion_final', 100.00);

-- INGLES III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ING';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@usuario_id, @materia_id, 84.0, 'primer_parcial', 30.00),
(@usuario_id, @materia_id, 87.0, 'segundo_parcial', 30.00),
(@usuario_id, @materia_id, 89.0, 'ordinario', 15.00),
(@usuario_id, @materia_id, 85.0, 'proyecto', 15.00),
(@usuario_id, @materia_id, 86.0, 'examenes_semanales', 10.00),
(@usuario_id, @materia_id, 86.0, 'calificacion_final', 100.00);

PRINT 'Calificaciones completas insertadas para todas las materias';

-- INSERTAR CATEGORIAS DET/AF
INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES 
('DET', 'Robotica', 'Desarrollo de proyectos de robotica educativa y competencia para estudiantes de Arquitectura', 25),
('AF', 'Atletismo', 'Entrenamiento y competencia en disciplinas atleticas', 30);

PRINT 'Categorias DET/AF configuradas';

-- INSCRIBIR A MAURO EN ROBOTICA (DET)
DECLARE @categoria_id INT;
SELECT @categoria_id = id FROM categorias_det_af WHERE nombre = 'Robotica';
INSERT INTO inscripciones_det_af (usuario_id, categoria_id) VALUES (@usuario_id, @categoria_id);

PRINT 'Mauro Ortiz inscrito en DET - Robotica';

-- VERIFICACIONES FINALES
PRINT '';
PRINT '===============================================';
PRINT 'CONFIGURACION COMPLETADA - FORMATO @lasallep.mx';
PRINT '===============================================';

-- Mostrar usuario configurado
SELECT 'USUARIO CONFIGURADO:' as Verificacion, 
       nombre, email, matricula, area_estudios, semestre 
FROM usuarios WHERE email = '240088@lasallep.mx';

-- Contar materias
SELECT 'MATERIAS ARQUITECTURA 3ER:' as Verificacion, COUNT(*) as Total 
FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3;

-- Contar calificaciones
SELECT 'CALIFICACIONES TOTALES:' as Verificacion, COUNT(*) as Total 
FROM calificaciones c 
INNER JOIN usuarios u ON c.usuario_id = u.id 
WHERE u.email = '240088@lasallep.mx';

-- Contar categorias DET/AF
SELECT 'CATEGORIAS DET/AF:' as Verificacion, COUNT(*) as Total 
FROM categorias_det_af;

-- Mostrar inscripciones
SELECT 'INSCRIPCIONES DET/AF:' as Verificacion, 
       c.tipo, c.nombre 
FROM inscripciones_det_af i
INNER JOIN categorias_det_af c ON i.categoria_id = c.id
INNER JOIN usuarios u ON i.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx';

PRINT '';
PRINT '===============================================';
PRINT 'CREDENCIALES DE ACCESO:';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Password: 1234';
PRINT 'Usuario: Mauro Ortiz';
PRINT 'Area: Arquitectura - 3er Semestre';
PRINT 'Matricula: 240088';
PRINT '===============================================';
PRINT 'BASE DE DATOS LISTA PARA USO';
PRINT '===============================================';
