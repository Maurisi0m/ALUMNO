-- ================================================================
-- GENERADOR DE CALIFICACIONES ÚNICAS PARA TODOS LOS USUARIOS
-- Cada usuario tendrá calificaciones completamente diferentes
-- Universidad La Salle Pachuca - Arquitectura 3er Semestre
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '=========================================================';
PRINT 'GENERANDO CALIFICACIONES ÚNICAS PARA TODOS LOS USUARIOS';
PRINT 'Cada usuario tendrá calificaciones diferentes y realistas';
PRINT '=========================================================';

-- ================================================================
-- 1. LIMPIAR CALIFICACIONES EXISTENTES
-- ================================================================
PRINT '';
PRINT 'PASO 1: LIMPIANDO CALIFICACIONES EXISTENTES...';

DELETE FROM calificaciones;
PRINT '✓ Todas las calificaciones anteriores eliminadas';

-- ================================================================
-- 2. GENERAR CALIFICACIONES ÚNICAS PARA CADA USUARIO
-- ================================================================
PRINT '';
PRINT 'PASO 2: GENERANDO CALIFICACIONES INDIVIDUALES...';

DECLARE @usuario_id INT;
DECLARE @usuario_nombre NVARCHAR(100);
DECLARE @usuario_matricula NVARCHAR(20);
DECLARE @materia_id INT;
DECLARE @materia_codigo NVARCHAR(20);
DECLARE @materia_nombre NVARCHAR(100);

-- Variables para calificaciones
DECLARE @primer_parcial DECIMAL(4,2);
DECLARE @segundo_parcial DECIMAL(4,2);
DECLARE @ordinario DECIMAL(4,2);
DECLARE @proyecto DECIMAL(4,2);
DECLARE @examenes_semanales DECIMAL(4,2);
DECLARE @calificacion_final DECIMAL(4,2);

-- Variables para personalizar calificaciones por usuario
DECLARE @base_promedio DECIMAL(4,2);
DECLARE @variacion DECIMAL(4,2);
DECLARE @factor_usuario DECIMAL(4,2);

-- Cursor para recorrer todos los usuarios de arquitectura
DECLARE usuario_cursor CURSOR FOR 
SELECT id, nombre, matricula 
FROM usuarios 
WHERE matricula LIKE '240%' 
AND area_estudios = 'Arquitectura'
ORDER BY matricula;

OPEN usuario_cursor;
FETCH NEXT FROM usuario_cursor INTO @usuario_id, @usuario_nombre, @usuario_matricula;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT '  📚 Generando calificaciones para: ' + @usuario_nombre + ' (' + @usuario_matricula + ')';
    
    -- Asignar un "perfil académico" único a cada usuario basado en su matrícula
    SET @factor_usuario = (CAST(RIGHT(@usuario_matricula, 3) AS INT) % 100) / 100.0;
    
    -- Determinar el nivel académico base del usuario
    DECLARE @nivel_academico NVARCHAR(20);
    IF @factor_usuario >= 0.8
        SET @nivel_academico = 'EXCELENTE';
    ELSE IF @factor_usuario >= 0.6
        SET @nivel_academico = 'BUENO';
    ELSE IF @factor_usuario >= 0.4
        SET @nivel_academico = 'REGULAR';
    ELSE
        SET @nivel_academico = 'NECESITA_APOYO';
    
    -- Establecer rangos de calificaciones según el nivel
    DECLARE @min_cal DECIMAL(4,2);
    DECLARE @max_cal DECIMAL(4,2);
    
    IF @nivel_academico = 'EXCELENTE'
    BEGIN
        SET @min_cal = 85.0;
        SET @max_cal = 100.0;
    END
    ELSE IF @nivel_academico = 'BUENO'
    BEGIN
        SET @min_cal = 75.0;
        SET @max_cal = 95.0;
    END
    ELSE IF @nivel_academico = 'REGULAR'
    BEGIN
        SET @min_cal = 70.0;
        SET @max_cal = 85.0;
    END
    ELSE -- NECESITA_APOYO
    BEGIN
        SET @min_cal = 60.0;
        SET @max_cal = 80.0;
    END
    
    PRINT '    📊 Nivel académico: ' + @nivel_academico + ' (Rango: ' + CAST(@min_cal AS NVARCHAR(10)) + '-' + CAST(@max_cal AS NVARCHAR(10)) + ')';
    
    -- Para cada materia de 3er semestre
    DECLARE materia_cursor CURSOR FOR 
    SELECT id, codigo, nombre 
    FROM materias 
    WHERE semestre = 3 AND area_estudios = 'Arquitectura'
    ORDER BY codigo;
    
    OPEN materia_cursor;
    FETCH NEXT FROM materia_cursor INTO @materia_id, @materia_codigo, @materia_nombre;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Generar "fortalezas" y "debilidades" por materia para cada usuario
        DECLARE @materia_factor DECIMAL(4,2);
        SET @materia_factor = (ABS(CHECKSUM(@usuario_matricula + @materia_codigo)) % 100) / 100.0;
        
        -- Determinar si esta materia es fortaleza o debilidad del usuario
        DECLARE @es_fortaleza BIT = 0;
        IF @materia_factor > 0.7
            SET @es_fortaleza = 1;
        
        -- Ajustar rango según fortaleza/debilidad
        DECLARE @min_ajustado DECIMAL(4,2);
        DECLARE @max_ajustado DECIMAL(4,2);
        
        IF @es_fortaleza = 1
        BEGIN
            -- Materia fuerte: calificaciones más altas
            SET @min_ajustado = @min_cal + 5;
            SET @max_ajustado = @max_cal;
            IF @min_ajustado > 100 SET @min_ajustado = 95;
        END
        ELSE
        BEGIN
            -- Materia débil: calificaciones más bajas
            SET @min_ajustado = @min_cal - 10;
            SET @max_ajustado = @max_cal - 5;
            IF @min_ajustado < 60 SET @min_ajustado = 60;
        END
        
        -- Generar calificaciones variables y realistas
        SET @primer_parcial = ROUND(@min_ajustado + (RAND() * (@max_ajustado - @min_ajustado)), 1);
        SET @segundo_parcial = ROUND(@min_ajustado + (RAND() * (@max_ajustado - @min_ajustado)), 1);
        SET @ordinario = ROUND(@min_ajustado + (RAND() * (@max_ajustado - @min_ajustado)), 1);
        SET @proyecto = ROUND(@min_ajustado + (RAND() * (@max_ajustado - @min_ajustado)), 1);
        SET @examenes_semanales = ROUND(@min_ajustado + (RAND() * (@max_ajustado - @min_ajustado)), 1);
        
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
        
        FETCH NEXT FROM materia_cursor INTO @materia_id, @materia_codigo, @materia_nombre;
    END;
    
    CLOSE materia_cursor;
    DEALLOCATE materia_cursor;
    
    FETCH NEXT FROM usuario_cursor INTO @usuario_id, @usuario_nombre, @usuario_matricula;
END;

CLOSE usuario_cursor;
DEALLOCATE usuario_cursor;

PRINT '✅ Calificaciones únicas generadas para todos los usuarios';

-- ================================================================
-- 3. ESTADÍSTICAS DE GENERACIÓN
-- ================================================================
PRINT '';
PRINT 'PASO 3: ESTADÍSTICAS DE GENERACIÓN...';

-- Contar total de calificaciones por usuario
SELECT 
    'ESTADÍSTICAS POR USUARIO' as Tipo,
    u.matricula,
    u.nombre,
    COUNT(c.id) as total_calificaciones,
    AVG(CASE WHEN c.tipo_evaluacion = 'calificacion_final' THEN c.calificacion ELSE NULL END) as promedio_final
FROM usuarios u
LEFT JOIN calificaciones c ON u.id = c.usuario_id
WHERE u.matricula LIKE '240%'
GROUP BY u.matricula, u.nombre
ORDER BY u.matricula;

-- Estadísticas generales
SELECT 'TOTAL USUARIOS' as Estadistica, COUNT(*) as Cantidad
FROM usuarios WHERE matricula LIKE '240%'

UNION ALL

SELECT 'TOTAL MATERIAS', COUNT(*)
FROM materias WHERE semestre = 3 AND area_estudios = 'Arquitectura'

UNION ALL

SELECT 'TOTAL CALIFICACIONES', COUNT(*)
FROM calificaciones

UNION ALL

SELECT 'CALIFICACIONES POR USUARIO', COUNT(*) / (SELECT COUNT(*) FROM usuarios WHERE matricula LIKE '240%')
FROM calificaciones;

-- ================================================================
-- 4. VERIFICAR DIVERSIDAD DE CALIFICACIONES
-- ================================================================
PRINT '';
PRINT 'PASO 4: VERIFICANDO DIVERSIDAD DE CALIFICACIONES...';

-- Mostrar rango de calificaciones finales por materia
SELECT 
    m.codigo,
    m.nombre as materia,
    MIN(c.calificacion) as cal_minima,
    MAX(c.calificacion) as cal_maxima,
    AVG(c.calificacion) as promedio_materia,
    COUNT(DISTINCT c.usuario_id) as estudiantes
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
WHERE c.tipo_evaluacion = 'calificacion_final'
GROUP BY m.codigo, m.nombre
ORDER BY m.codigo;

-- ================================================================
-- 5. EJEMPLOS DE CALIFICACIONES PARA VERIFICAR UNICIDAD
-- ================================================================
PRINT '';
PRINT 'PASO 5: EJEMPLOS DE CALIFICACIONES (Primeros 3 usuarios)...';

-- Mostrar calificaciones de los primeros 3 usuarios para verificar que son diferentes
SELECT TOP 3
    u.matricula,
    u.nombre,
    m.codigo,
    c.tipo_evaluacion,
    c.calificacion
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
INNER JOIN materias m ON c.materia_id = m.id
WHERE u.matricula IN ('240001', '240002', '240003')
AND c.tipo_evaluacion = 'calificacion_final'
ORDER BY u.matricula, m.codigo;

PRINT '';
PRINT '=========================================================';
PRINT '🎉 GENERACIÓN COMPLETADA EXITOSAMENTE';
PRINT '=========================================================';
PRINT '';
PRINT '✅ CARACTERÍSTICAS DEL SISTEMA:';
PRINT '   • Cada usuario tiene calificaciones ÚNICAS';
PRINT '   • Calificaciones realistas según "perfil académico"';
PRINT '   • Fortalezas y debilidades por materia';
PRINT '   • Variación natural entre evaluaciones';
PRINT '   • Promedios ponderados calculados automáticamente';
PRINT '';
PRINT '✅ NIVELES ACADÉMICOS ASIGNADOS:';
PRINT '   • EXCELENTE: 85-100 puntos';
PRINT '   • BUENO: 75-95 puntos';
PRINT '   • REGULAR: 70-85 puntos';
PRINT '   • NECESITA APOYO: 60-80 puntos';
PRINT '';
PRINT '🚀 USUARIOS LISTOS PARA LOGIN:';
PRINT '   240001@lasallep.mx - 240012@lasallep.mx';
PRINT '   240088@lasallep.mx (Mauro Ortiz)';
PRINT '   Password: 1234 (todos)';
PRINT '';
PRINT '📊 Cada usuario verá SUS PROPIAS calificaciones';
PRINT '=========================================================';
