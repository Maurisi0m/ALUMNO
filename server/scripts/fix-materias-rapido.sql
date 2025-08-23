-- Fix rápido para materias y calificaciones
-- Ejecutar en SQL Server Management Studio

USE SIGEA_DB_LOCAL;
GO

PRINT 'FIX RAPIDO - MATERIAS Y CALIFICACIONES';

-- 1. Verificar usuario existe
IF NOT EXISTS (SELECT * FROM usuarios WHERE email = '240088@lasallep.mx')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
    VALUES ('Mauro Ortiz', '240088@lasallep.mx', '1234', 'estudiante', '240088', 'Arquitectura', 3, 1);
    PRINT '✓ Usuario Mauro creado';
END
ELSE
BEGIN
    PRINT '✓ Usuario Mauro ya existe';
END

-- 2. Obtener ID del usuario
DECLARE @mauro_id INT;
SELECT @mauro_id = id FROM usuarios WHERE email = '240088@lasallep.mx';
PRINT '✓ ID de Mauro: ' + CAST(@mauro_id AS NVARCHAR(10));

-- 3. Verificar materias existen
IF NOT EXISTS (SELECT * FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3)
BEGIN
    DELETE FROM materias; -- Limpiar materias anteriores
    
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
    
    PRINT '✓ 10 materias de Arquitectura creadas';
END
ELSE
BEGIN
    PRINT '✓ Materias ya existen';
END

-- 4. Crear calificaciones para Mauro
DELETE FROM calificaciones WHERE usuario_id = @mauro_id;

-- Insertar calificaciones rápido para todas las materias
DECLARE @materia_cursor CURSOR;
DECLARE @materia_id INT, @materia_nombre NVARCHAR(100);

SET @materia_cursor = CURSOR FOR 
SELECT id, nombre FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3;

OPEN @materia_cursor;
FETCH NEXT FROM @materia_cursor INTO @materia_id, @materia_nombre;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Calificaciones base para cada materia
    INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
    (@mauro_id, @materia_id, 85.0, 'primer_parcial', 30.00),
    (@mauro_id, @materia_id, 80.0, 'segundo_parcial', 30.00),
    (@mauro_id, @materia_id, 88.0, 'ordinario', 15.00),
    (@mauro_id, @materia_id, 90.0, 'proyecto', 15.00),
    (@mauro_id, @materia_id, 87.0, 'examenes_semanales', 10.00),
    (@mauro_id, @materia_id, 85.5, 'calificacion_final', 100.00);
    
    PRINT '✓ Calificaciones para: ' + @materia_nombre;
    
    FETCH NEXT FROM @materia_cursor INTO @materia_id, @materia_nombre;
END

CLOSE @materia_cursor;
DEALLOCATE @materia_cursor;

-- 5. Verificación final con la misma query que usa la aplicación
PRINT '';
PRINT 'VERIFICACION - QUERY EXACTA DE LA APLICACION:';

SELECT
    m.codigo,
    m.nombre as materia,
    m.creditos,
    c.calificacion,
    c.tipo_evaluacion,
    ISNULL(te.porcentaje, 100.00) as porcentaje
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
LEFT JOIN tipos_evaluacion te ON c.tipo_evaluacion = te.nombre
WHERE c.usuario_id = @mauro_id
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

-- Contar resultados
SELECT 
    'CONTEOS FINALES' as Seccion,
    'Materias' as Tipo,
    COUNT(*) as Cantidad
FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3

UNION ALL

SELECT 
    'CONTEOS FINALES',
    'Calificaciones de Mauro',
    COUNT(*)
FROM calificaciones WHERE usuario_id = @mauro_id;

PRINT '========================================';
PRINT 'FIX COMPLETADO';
PRINT 'Usuario: 240088@lasallep.mx (ID: ' + CAST(@mauro_id AS NVARCHAR(10)) + ')';
PRINT 'Ahora deberían aparecer las 10 materias';
PRINT '========================================';
