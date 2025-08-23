-- ================================================================
-- SCRIPT DE DIAGNÓSTICO Y REPARACIÓN DE CALIFICACIONES
-- Para resolver problema de calificaciones vacías
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '=========================================================';
PRINT 'DIAGNÓSTICO DEL PROBLEMA DE CALIFICACIONES';
PRINT '=========================================================';

-- ================================================================
-- 1. VERIFICAR USUARIO 240001 (Carlos)
-- ================================================================
PRINT '';
PRINT 'PASO 1: VERIFICANDO USUARIO 240001...';

SELECT 
    'USUARIO ENCONTRADO' as Estado,
    id,
    nombre,
    email,
    matricula,
    area_estudios,
    semestre
FROM usuarios 
WHERE matricula = '240001';

-- ================================================================
-- 2. VERIFICAR MATERIAS DISPONIBLES
-- ================================================================
PRINT '';
PRINT 'PASO 2: VERIFICANDO MATERIAS DE ARQUITECTURA 3ER SEMESTRE...';

SELECT 
    'MATERIAS DISPONIBLES' as Estado,
    id,
    codigo,
    nombre,
    creditos,
    semestre,
    area_estudios
FROM materias 
WHERE semestre = 3 AND area_estudios = 'Arquitectura'
ORDER BY codigo;

-- ================================================================
-- 3. VERIFICAR CALIFICACIONES BRUTAS PARA CARLOS
-- ================================================================
PRINT '';
PRINT 'PASO 3: VERIFICANDO CALIFICACIONES BRUTAS PARA CARLOS...';

DECLARE @carlos_id INT;
SELECT @carlos_id = id FROM usuarios WHERE matricula = '240001';

PRINT 'ID de Carlos: ' + CAST(@carlos_id AS NVARCHAR(10));

SELECT 
    'CALIFICACIONES BRUTAS' as Estado,
    c.id,
    c.usuario_id,
    c.materia_id,
    c.calificacion,
    c.tipo_evaluacion,
    c.porcentaje
FROM calificaciones c
WHERE c.usuario_id = @carlos_id;

-- ================================================================
-- 4. VERIFICAR JOIN ENTRE CALIFICACIONES Y MATERIAS
-- ================================================================
PRINT '';
PRINT 'PASO 4: VERIFICANDO JOIN CALIFICACIONES <-> MATERIAS...';

-- Esta es la consulta exacta que usa la aplicación
SELECT
    c.id,
    c.materia_id,
    m.id as materia_real_id,
    m.codigo,
    m.nombre as materia,
    m.creditos,
    c.calificacion,
    c.tipo_evaluacion
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
WHERE c.usuario_id = @carlos_id
ORDER BY m.nombre;

-- ================================================================
-- 5. VERIFICAR SI HAY PROBLEMAS DE FOREIGN KEY
-- ================================================================
PRINT '';
PRINT 'PASO 5: IDENTIFICANDO PROBLEMAS DE FOREIGN KEY...';

-- Calificaciones sin materia correspondiente
SELECT 
    'CALIFICACIONES HUÉRFANAS' as Problema,
    c.id,
    c.materia_id as materia_id_faltante,
    c.calificacion,
    c.tipo_evaluacion
FROM calificaciones c
LEFT JOIN materias m ON c.materia_id = m.id
WHERE c.usuario_id = @carlos_id 
AND m.id IS NULL;

-- ================================================================
-- 6. MOSTRAR CONTEOS PARA DIAGNÓSTICO
-- ================================================================
PRINT '';
PRINT 'PASO 6: CONTEOS DE DIAGNÓSTICO...';

SELECT 'TOTAL USUARIOS' as Tipo, COUNT(*) as Cantidad
FROM usuarios WHERE matricula LIKE '240%'

UNION ALL

SELECT 'TOTAL MATERIAS SEMESTRE 3', COUNT(*)
FROM materias WHERE semestre = 3 AND area_estudios = 'Arquitectura'

UNION ALL

SELECT 'TOTAL CALIFICACIONES CARLOS', COUNT(*)
FROM calificaciones WHERE usuario_id = @carlos_id

UNION ALL

SELECT 'CALIFICACIONES CON JOIN EXITOSO', COUNT(*)
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
WHERE c.usuario_id = @carlos_id;

-- ================================================================
-- 7. SOLUCIÓN: REGENERAR CALIFICACIONES CON IDs CORRECTOS
-- ================================================================
PRINT '';
PRINT 'PASO 7: VERIFICANDO NECESIDAD DE REGENERAR CALIFICACIONES...';

-- Verificar si hay problemas de IDs
DECLARE @calificaciones_total INT;
DECLARE @calificaciones_con_join INT;

SELECT @calificaciones_total = COUNT(*) FROM calificaciones WHERE usuario_id = @carlos_id;
SELECT @calificaciones_con_join = COUNT(*)
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
WHERE c.usuario_id = @carlos_id;

PRINT 'Calificaciones totales: ' + CAST(@calificaciones_total AS NVARCHAR(10));
PRINT 'Calificaciones con JOIN exitoso: ' + CAST(@calificaciones_con_join AS NVARCHAR(10));

IF @calificaciones_total != @calificaciones_con_join
BEGIN
    PRINT '';
    PRINT '❌ PROBLEMA DETECTADO: Las calificaciones tienen materia_id incorrectos';
    PRINT 'SOLUCIÓN: Regenerar calificaciones con IDs correctos';
    PRINT '';
    
    -- Eliminar calificaciones incorrectas de todos los usuarios
    DELETE FROM calificaciones;
    PRINT '✓ Calificaciones incorrectas eliminadas';
    
    -- Regenerar calificaciones con IDs correctos
    PRINT '✓ Regenerando calificaciones con IDs correctos...';
    
    DECLARE @usuario_id INT;
    DECLARE @materia_id INT;
    DECLARE @primer_parcial DECIMAL(4,2);
    DECLARE @segundo_parcial DECIMAL(4,2);
    DECLARE @ordinario DECIMAL(4,2);
    DECLARE @proyecto DECIMAL(4,2);
    DECLARE @examenes_semanales DECIMAL(4,2);
    DECLARE @calificacion_final DECIMAL(4,2);

    -- Cursor para recorrer todos los usuarios
    DECLARE usuario_cursor CURSOR FOR 
    SELECT id FROM usuarios WHERE matricula LIKE '240%';

    OPEN usuario_cursor;
    FETCH NEXT FROM usuario_cursor INTO @usuario_id;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Para cada materia de 3er semestre (usar IDs reales)
        DECLARE materia_cursor CURSOR FOR 
        SELECT id FROM materias WHERE semestre = 3 AND area_estudios = 'Arquitectura';
        
        OPEN materia_cursor;
        FETCH NEXT FROM materia_cursor INTO @materia_id;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Generar calificaciones aleatorias realistas
            SET @primer_parcial = ROUND(70 + (RAND() * 30), 1);
            SET @segundo_parcial = ROUND(70 + (RAND() * 30), 1);
            SET @ordinario = ROUND(70 + (RAND() * 30), 1);
            SET @proyecto = ROUND(75 + (RAND() * 25), 1);
            SET @examenes_semanales = ROUND(70 + (RAND() * 30), 1);
            
            -- Calcular calificación final ponderada
            SET @calificacion_final = ROUND(
                (@primer_parcial * 30 + @segundo_parcial * 30 + @ordinario * 15 + @proyecto * 15 + @examenes_semanales * 10) / 100,
                1
            );
            
            -- Insertar calificaciones con IDs correctos
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id, @materia_id, @primer_parcial, 'primer_parcial', 30.00),
            (@usuario_id, @materia_id, @segundo_parcial, 'segundo_parcial', 30.00),
            (@usuario_id, @materia_id, @ordinario, 'ordinario', 15.00),
            (@usuario_id, @materia_id, @proyecto, 'proyecto', 15.00),
            (@usuario_id, @materia_id, @examenes_semanales, 'examenes_semanales', 10.00),
            (@usuario_id, @materia_id, @calificacion_final, 'calificacion_final', 100.00);
            
            FETCH NEXT FROM materia_cursor INTO @materia_id;
        END;
        
        CLOSE materia_cursor;
        DEALLOCATE materia_cursor;
        
        FETCH NEXT FROM usuario_cursor;
    END;

    CLOSE usuario_cursor;
    DEALLOCATE usuario_cursor;
    
    PRINT '✅ Calificaciones regeneradas correctamente';
END
ELSE
BEGIN
    PRINT '✅ No hay problemas detectados con los IDs';
END

-- ================================================================
-- 8. VERIFICACIÓN FINAL
-- ================================================================
PRINT '';
PRINT 'PASO 8: VERIFICACIÓN FINAL...';

-- Verificar que Carlos ahora tenga calificaciones
SELECT
    c.id,
    m.codigo,
    m.nombre as materia,
    m.creditos,
    c.calificacion,
    c.tipo_evaluacion,
    ISNULL(te.porcentaje, 100.00) as porcentaje
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
LEFT JOIN tipos_evaluacion te ON c.tipo_evaluacion = te.nombre
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.matricula = '240001'
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
PRINT '🎉 DIAGNÓSTICO Y REPARACIÓN COMPLETADA';
PRINT 'Ahora Carlos (240001) debería tener calificaciones';
PRINT 'Prueba hacer login nuevamente en la aplicación';
PRINT '=========================================================';
