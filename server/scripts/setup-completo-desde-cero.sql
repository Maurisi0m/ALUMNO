-- Script completo para configurar SIGEA desde cero
-- Para usuario: 240088@lasallep.mx
-- Ejecutar en SQL Server Management Studio (SSMS)

USE SIGEA_DB_LOCAL;
GO

PRINT '=========================================================';
PRINT 'CONFIGURACION COMPLETA DESDE CERO - SIGEA';
PRINT 'Usuario: 240088@lasallep.mx (Mauro Ortiz)';
PRINT '=========================================================';

-- PASO 1: Limpiar datos existentes
PRINT '';
PRINT 'PASO 1: LIMPIANDO DATOS EXISTENTES...';

-- Eliminar en orden correcto (foreign keys)
DELETE FROM inscripciones_det_af;
DELETE FROM calificaciones;
DELETE FROM usuarios WHERE email LIKE '%@lasallep.mx%';
DELETE FROM materias;
DELETE FROM tipos_evaluacion;
DELETE FROM categorias_det_af;

PRINT '✓ Datos anteriores eliminados';

-- PASO 2: Crear tipos de evaluación
PRINT '';
PRINT 'PASO 2: CREANDO TIPOS DE EVALUACION...';

INSERT INTO tipos_evaluacion (nombre, porcentaje, descripcion) VALUES 
('primer_parcial', 30.00, 'Primer Parcial (30%)'),
('segundo_parcial', 30.00, 'Segundo Parcial (30%)'),
('ordinario', 15.00, 'Examen Ordinario (15%)'),
('proyecto', 15.00, 'Proyecto (15%)'),
('examenes_semanales', 10.00, 'Examenes Semanales (10%)'),
('calificacion_final', 100.00, 'Calificacion Final');

PRINT '✓ Tipos de evaluacion creados';

-- PASO 3: Crear usuario Mauro Ortiz
PRINT '';
PRINT 'PASO 3: CREANDO USUARIO MAURO ORTIZ...';

INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES ('Mauro Ortiz', '240088@lasallep.mx', '1234', 'estudiante', '240088', 'Arquitectura', 3, 1);

DECLARE @mauro_id INT;
SELECT @mauro_id = id FROM usuarios WHERE email = '240088@lasallep.mx';

PRINT '✓ Usuario Mauro Ortiz creado con ID: ' + CAST(@mauro_id AS NVARCHAR(10));

-- PASO 4: Crear materias de Arquitectura 3er semestre
PRINT '';
PRINT 'PASO 4: CREANDO MATERIAS DE ARQUITECTURA 3ER SEMESTRE...';

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

PRINT '✓ 10 materias de Arquitectura 3er semestre creadas';

-- PASO 5: Insertar calificaciones completas
PRINT '';
PRINT 'PASO 5: INSERTANDO CALIFICACIONES COMPLETAS...';

DECLARE @materia_id INT;

-- BIOLOGIA I
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-BIO';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 85.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 78.5, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 82.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 88.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 86.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 83.5, 'calificacion_final', 100.00);

-- FISICA I
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-FIS';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 75.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 80.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 85.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 78.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 82.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 79.5, 'calificacion_final', 100.00);

-- FORMACION EN VALORES III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-VAL';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 95.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 92.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 90.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 96.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 94.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 93.5, 'calificacion_final', 100.00);

-- GEOMETRIA DESCRIPTIVA
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-GEO';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 80.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 85.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 78.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 87.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 83.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 82.0, 'calificacion_final', 100.00);

-- HISTORIA DE MEXICO II
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-HIS';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 88.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 85.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 90.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 92.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 89.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 88.5, 'calificacion_final', 100.00);

-- INTRODUCCION AL DIBUJO
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-DIB';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 92.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 89.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 85.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 95.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 91.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 90.5, 'calificacion_final', 100.00);

-- LITERATURA I
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-LIT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 86.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 88.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 84.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 90.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 87.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 87.0, 'calificacion_final', 100.00);

-- MATEMATICAS III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-MAT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 78.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 82.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 85.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 80.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 83.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 81.5, 'calificacion_final', 100.00);

-- SELECTIVO ACTIVACION AL AIRE LIBRE
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ACT';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 95.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 93.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 90.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 98.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 96.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 94.5, 'calificacion_final', 100.00);

-- INGLES III
SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ING';
INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
(@mauro_id, @materia_id, 84.0, 'primer_parcial', 30.00),
(@mauro_id, @materia_id, 87.0, 'segundo_parcial', 30.00),
(@mauro_id, @materia_id, 89.0, 'ordinario', 15.00),
(@mauro_id, @materia_id, 85.0, 'proyecto', 15.00),
(@mauro_id, @materia_id, 86.0, 'examenes_semanales', 10.00),
(@mauro_id, @materia_id, 86.0, 'calificacion_final', 100.00);

PRINT '✓ Calificaciones completas insertadas para las 10 materias';

-- PASO 6: Crear categorías DET/AF
PRINT '';
PRINT 'PASO 6: CREANDO CATEGORIAS DET/AF...';

INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES 
('DET', 'Robotica', 'Desarrollo de proyectos de robotica educativa y competencia para estudiantes de Arquitectura', 25),
('AF', 'Atletismo', 'Entrenamiento y competencia en disciplinas atleticas', 30);

PRINT '✓ Categorias DET/AF creadas';

-- PASO 7: Inscribir a Mauro en DET Robotica
PRINT '';
PRINT 'PASO 7: INSCRIBIENDO A MAURO EN DET - ROBOTICA...';

DECLARE @categoria_robotica_id INT;
SELECT @categoria_robotica_id = id FROM categorias_det_af WHERE nombre = 'Robotica';
INSERT INTO inscripciones_det_af (usuario_id, categoria_id) VALUES (@mauro_id, @categoria_robotica_id);

PRINT '✓ Mauro inscrito en DET - Robotica';

-- VERIFICACION FINAL
PRINT '';
PRINT '=========================================================';
PRINT 'VERIFICACION FINAL - CONFIGURACION COMPLETA';
PRINT '=========================================================';

-- Mostrar usuario
SELECT 
    'USUARIO CONFIGURADO' as Seccion,
    id,
    nombre,
    email,
    matricula,
    area_estudios,
    semestre,
    activo
FROM usuarios WHERE email = '240088@lasallep.mx';

-- Contar elementos
SELECT 'CONTEOS' as Seccion, 'Materias Arquitectura 3er' as Descripcion, COUNT(*) as Cantidad
FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3

UNION ALL

SELECT 'CONTEOS', 'Calificaciones Mauro', COUNT(*)
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx'

UNION ALL

SELECT 'CONTEOS', 'Tipos Evaluacion', COUNT(*)
FROM tipos_evaluacion

UNION ALL

SELECT 'CONTEOS', 'Categorias DET/AF', COUNT(*)
FROM categorias_det_af

UNION ALL

SELECT 'CONTEOS', 'Inscripciones DET/AF', COUNT(*)
FROM inscripciones_det_af i
INNER JOIN usuarios u ON i.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx';

-- Test de consulta que usa la aplicación
PRINT '';
PRINT 'TEST DE CONSULTA DE CALIFICACIONES (Como en la aplicación):';

SELECT
    m.codigo,
    m.nombre as materia,
    m.creditos,
    c.calificacion,
    c.tipo_evaluacion,
    te.porcentaje
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
LEFT JOIN tipos_evaluacion te ON c.tipo_evaluacion = te.nombre
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx'
ORDER BY m.nombre,
    CASE c.tipo_evaluacion
        WHEN 'primer_parcial' THEN 1
        WHEN 'segundo_parcial' THEN 2
        WHEN 'ordinario' THEN 3
        WHEN 'proyecto' THEN 4
        WHEN 'examenes_semanales' THEN 5
        WHEN 'calificacion_final' THEN 6
        ELSE 7
    END;

PRINT '';
PRINT '=========================================================';
PRINT 'CONFIGURACION COMPLETA EXITOSA';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Password: 1234';
PRINT 'Usuario: Mauro Ortiz';
PRINT 'Materias: 10 con calificaciones completas';
PRINT 'DET/AF: Inscrito en Robotica';
PRINT '=========================================================';
