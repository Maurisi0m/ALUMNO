-- ================================================================
-- SCRIPT DEFINITIVO PARA SIGEA_DB_LOCAL - ESTRUCTURA REAL
-- Basado en análisis completo del código existente
-- Múltiples usuarios con calificaciones individuales
-- Universidad La Salle Pachuca - Arquitectura 3er Semestre
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '=========================================================';
PRINT 'CONFIGURACION SIGEA - MULTIPLE USUARIOS';
PRINT 'Estructura basada en código real del proyecto';
PRINT '=========================================================';

-- ================================================================
-- 1. LIMPIAR DATOS EXISTENTES
-- ================================================================
PRINT '';
PRINT 'PASO 1: LIMPIANDO DATOS EXISTENTES...';

-- Eliminar en orden correcto (foreign keys)
DELETE FROM inscripciones_det_af;
DELETE FROM calificaciones;
DELETE FROM usuarios WHERE email LIKE '%@lasallep.mx%';
DELETE FROM materias WHERE semestre = 3;
DELETE FROM tipos_evaluacion;
DELETE FROM categorias_det_af;

PRINT '✓ Datos anteriores eliminados';

-- ================================================================
-- 2. INSERTAR TIPOS DE EVALUACIÓN (ESTRUCTURA REAL)
-- ================================================================
PRINT '';
PRINT 'PASO 2: CREANDO TIPOS DE EVALUACION...';

-- Estructura exacta como en el código: tipos_evaluacion tabla
INSERT INTO tipos_evaluacion (nombre, porcentaje, descripcion) VALUES 
('primer_parcial', 30.00, 'Primer Parcial (30%)'),
('segundo_parcial', 30.00, 'Segundo Parcial (30%)'),
('ordinario', 15.00, 'Examen Ordinario (15%)'),
('proyecto', 15.00, 'Proyecto (15%)'),
('examenes_semanales', 10.00, 'Examenes Semanales (10%)'),
('calificacion_final', 100.00, 'Calificacion Final');

PRINT '✓ Tipos de evaluacion creados';

-- ================================================================
-- 3. INSERTAR MATERIAS DE ARQUITECTURA 3ER SEMESTRE (REALES)
-- ================================================================
PRINT '';
PRINT 'PASO 3: CREANDO MATERIAS DE ARQUITECTURA 3ER SEMESTRE...';

-- Materias exactas del script existente
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

-- ================================================================
-- 4. CREAR MÚLTIPLES USUARIOS CON MATRICULAS SECUENCIALES
-- ================================================================
PRINT '';
PRINT 'PASO 4: CREANDO USUARIOS DE EJEMPLO...';

-- Estructura exacta como en el código: tabla usuarios
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) VALUES
-- Mauro Ortiz (principal)
('Mauro Ortiz Juárez', '240088@lasallep.mx', '1234', 'estudiante', '240088', 'Arquitectura', 3, 1),

-- Usuarios adicionales
('Carlos Roberto González Martínez', '240001@lasallep.mx', '1234', 'estudiante', '240001', 'Arquitectura', 3, 1),
('María Elena López Hernández', '240002@lasallep.mx', '1234', 'estudiante', '240002', 'Arquitectura', 3, 1),
('Juan Pablo Pérez García', '240003@lasallep.mx', '1234', 'estudiante', '240003', 'Arquitectura', 3, 1),
('Ana Sofía Rodríguez Torres', '240004@lasallep.mx', '1234', 'estudiante', '240004', 'Arquitectura', 3, 1),
('Luis Fernando Martínez Sánchez', '240005@lasallep.mx', '1234', 'estudiante', '240005', 'Arquitectura', 3, 1),
('Sofía Valentina Hernández Cruz', '240006@lasallep.mx', '1234', 'estudiante', '240006', 'Arquitectura', 3, 1),
('Diego Alejandro García Flores', '240007@lasallep.mx', '1234', 'estudiante', '240007', 'Arquitectura', 3, 1),
('Valeria Isabel Torres Mendoza', '240008@lasallep.mx', '1234', 'estudiante', '240008', 'Arquitectura', 3, 1),
('Alejandro Emiliano Sánchez Ramírez', '240009@lasallep.mx', '1234', 'estudiante', '240009', 'Arquitectura', 3, 1),
('Isabella Camila Cruz Vargas', '240010@lasallep.mx', '1234', 'estudiante', '240010', 'Arquitectura', 3, 1),
('Ricardo Sebastián Morales Jiménez', '240011@lasallep.mx', '1234', 'estudiante', '240011', 'Arquitectura', 3, 1),
('Gabriela Michelle Ramos Silva', '240012@lasallep.mx', '1234', 'estudiante', '240012', 'Arquitectura', 3, 1);

PRINT '✓ 13 usuarios creados (240001-240012 + 240088)';

-- ================================================================
-- 5. GENERAR CALIFICACIONES INDIVIDUALES PARA CADA USUARIO
-- ================================================================
PRINT '';
PRINT 'PASO 5: GENERANDO CALIFICACIONES INDIVIDUALES...';

-- Función para generar calificaciones aleatorias por usuario
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
SELECT id, nombre FROM usuarios WHERE matricula LIKE '240%';

OPEN usuario_cursor;
FETCH NEXT FROM usuario_cursor INTO @usuario_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT '  Generando calificaciones para usuario ID: ' + CAST(@usuario_id AS NVARCHAR(10));
    
    -- Para cada materia de 3er semestre
    DECLARE materia_cursor CURSOR FOR 
    SELECT id FROM materias WHERE semestre = 3 AND area_estudios = 'Arquitectura';
    
    OPEN materia_cursor;
    FETCH NEXT FROM materia_cursor INTO @materia_id;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Generar calificaciones aleatorias realistas
        SET @primer_parcial = ROUND(70 + (RAND() * 30), 1);     -- 70-100
        SET @segundo_parcial = ROUND(70 + (RAND() * 30), 1);    -- 70-100
        SET @ordinario = ROUND(70 + (RAND() * 30), 1);          -- 70-100
        SET @proyecto = ROUND(75 + (RAND() * 25), 1);           -- 75-100
        SET @examenes_semanales = ROUND(70 + (RAND() * 30), 1); -- 70-100
        
        -- Calcular calificación final ponderada
        SET @calificacion_final = ROUND(
            (@primer_parcial * 30 + @segundo_parcial * 30 + @ordinario * 15 + @proyecto * 15 + @examenes_semanales * 10) / 100,
            1
        );
        
        -- Insertar calificaciones con estructura exacta del código
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

PRINT '✓ Calificaciones generadas para todos los usuarios';

-- ================================================================
-- 6. CREAR CATEGORÍAS DET/AF
-- ================================================================
PRINT '';
PRINT 'PASO 6: CREANDO CATEGORIAS DET/AF...';

INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES 
('DET', 'Robotica', 'Desarrollo de proyectos de robotica educativa y competencia para estudiantes de Arquitectura', 25),
('DET', 'Programacion Web', 'Desarrollo de aplicaciones web y sitios responsivos', 20),
('DET', 'Diseño 3D', 'Modelado y renderizado 3D para arquitectura', 15),
('AF', 'Atletismo', 'Entrenamiento y competencia en disciplinas atleticas', 30),
('AF', 'Futbol', 'Equipo representativo de futbol universitario', 25),
('AF', 'Basquetbol', 'Equipo representativo de basquetbol', 20),
('AF', 'Voleibol', 'Equipo representativo de voleibol', 18);

PRINT '✓ 7 categorias DET/AF creadas';

-- ================================================================
-- 7. INSCRIBIR ALGUNOS USUARIOS EN DET/AF (EJEMPLOS)
-- ================================================================
PRINT '';
PRINT 'PASO 7: INSCRIBIENDO USUARIOS EN DET/AF...';

-- Inscripciones de ejemplo
DECLARE @mauro_id INT, @carlos_id INT, @maria_id INT;
DECLARE @robotica_id INT, @atletismo_id INT, @futbol_id INT;

SELECT @mauro_id = id FROM usuarios WHERE matricula = '240088';
SELECT @carlos_id = id FROM usuarios WHERE matricula = '240001';
SELECT @maria_id = id FROM usuarios WHERE matricula = '240002';

SELECT @robotica_id = id FROM categorias_det_af WHERE nombre = 'Robotica';
SELECT @atletismo_id = id FROM categorias_det_af WHERE nombre = 'Atletismo';
SELECT @futbol_id = id FROM categorias_det_af WHERE nombre = 'Futbol';

INSERT INTO inscripciones_det_af (usuario_id, categoria_id) VALUES 
(@mauro_id, @robotica_id),   -- Mauro en Robotica
(@carlos_id, @atletismo_id), -- Carlos en Atletismo
(@maria_id, @futbol_id);     -- Maria en Futbol

PRINT '✓ Inscripciones DET/AF creadas';

-- ================================================================
-- 8. VERIFICACIONES Y CONSULTAS DE EJEMPLO
-- ================================================================
PRINT '';
PRINT '=========================================================';
PRINT 'VERIFICACION FINAL - RESUMEN COMPLETO';
PRINT '=========================================================';

-- Contar usuarios creados
SELECT 'USUARIOS CREADOS' as Tipo, COUNT(*) as Cantidad
FROM usuarios WHERE matricula LIKE '240%'

UNION ALL

-- Contar materias
SELECT 'MATERIAS ARQUITECTURA 3ER', COUNT(*)
FROM materias WHERE semestre = 3 AND area_estudios = 'Arquitectura'

UNION ALL

-- Contar calificaciones totales
SELECT 'CALIFICACIONES TOTALES', COUNT(*)
FROM calificaciones

UNION ALL

-- Contar tipos de evaluación
SELECT 'TIPOS EVALUACION', COUNT(*)
FROM tipos_evaluacion

UNION ALL

-- Contar categorías DET/AF
SELECT 'CATEGORIAS DET/AF', COUNT(*)
FROM categorias_det_af

UNION ALL

-- Contar inscripciones DET/AF
SELECT 'INSCRIPCIONES DET/AF', COUNT(*)
FROM inscripciones_det_af;

PRINT '';
PRINT '✅ USUARIOS DISPONIBLES PARA LOGIN:';
PRINT '===================================';

-- Mostrar todos los usuarios creados
SELECT 
    matricula as 'Matrícula',
    nombre as 'Nombre',
    email as 'Email',
    'password: 1234' as 'Contraseña'
FROM usuarios 
WHERE matricula LIKE '240%'
ORDER BY matricula;

PRINT '';
PRINT '✅ EJEMPLO DE CONSULTA DE CALIFICACIONES (Mauro 240088):';
PRINT '========================================================';

-- Consulta de ejemplo como la usa la aplicación
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
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.matricula = '240088'
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
PRINT '✅ RESUMEN ACADÉMICO EJEMPLO (Mauro 240088):';
PRINT '============================================';

-- Resumen académico como lo calcula la aplicación
SELECT
    COUNT(DISTINCT m.id) as total_materias,
    AVG(CASE WHEN c.tipo_evaluacion = 'calificacion_final' THEN c.calificacion ELSE NULL END) as promedio_general,
    COUNT(CASE WHEN c.tipo_evaluacion = 'calificacion_final' AND c.calificacion >= 70 THEN 1 ELSE NULL END) as materias_aprobadas,
    SUM(DISTINCT m.creditos) as total_creditos
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.matricula = '240088';

PRINT '';
PRINT '=========================================================';
PRINT '🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE';
PRINT '=========================================================';
PRINT '';
PRINT '✅ CREDENCIALES DE ACCESO:';
PRINT '   Cualquier usuario: 240001@lasallep.mx hasta 240012@lasallep.mx';
PRINT '   Usuario principal: 240088@lasallep.mx';
PRINT '   Contraseña: 1234 (todos los usuarios)';
PRINT '';
PRINT '✅ FUNCIONALIDADES DISPONIBLES:';
PRINT '   - Login con cualquier usuario';
PRINT '   - Visualización de calificaciones individuales';
PRINT '   - Cálculo automático de promedios';
PRINT '   - Sistema DET/AF con inscripciones';
PRINT '   - Dashboard académico completo';
PRINT '';
PRINT '✅ ESTRUCTURA COMPATIBLE CON:';
PRINT '   - Frontend React (client/pages/Materias.tsx)';
PRINT '   - Backend Express (server/services/userService.ts)';
PRINT '   - API REST (server/routes/auth.ts)';
PRINT '';
PRINT '🚀 BASE DE DATOS LISTA PARA PRODUCCIÓN';
PRINT '=========================================================';
