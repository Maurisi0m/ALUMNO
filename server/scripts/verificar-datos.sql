-- Script para verificar el estado actual de la base de datos
-- Ejecutar en SQL Server Management Studio (SSMS)

USE SIGEA_DB_LOCAL;
GO

PRINT '===============================================';
PRINT 'VERIFICACIÓN DE DATOS - SIGEA_DB_LOCAL';
PRINT '===============================================';

-- Verificar usuarios
PRINT '';
PRINT '--- USUARIOS ---';
SELECT 
    id,
    nombre,
    email,
    rol,
    matricula,
    area_estudios,
    semestre,
    activo
FROM usuarios;

-- Verificar materias
PRINT '';
PRINT '--- MATERIAS ---';
SELECT 
    id,
    nombre,
    codigo,
    creditos,
    semestre,
    area_estudios,
    activo
FROM materias 
ORDER BY area_estudios, semestre, nombre;

-- Verificar calificaciones
PRINT '';
PRINT '--- CALIFICACIONES POR USUARIO ---';
SELECT 
    u.nombre as usuario,
    u.area_estudios,
    u.semestre,
    m.nombre as materia,
    m.codigo,
    c.tipo_evaluacion,
    c.calificacion,
    c.porcentaje
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
INNER JOIN materias m ON c.materia_id = m.id
ORDER BY u.nombre, m.nombre, 
    CASE c.tipo_evaluacion 
        WHEN 'primer_parcial' THEN 1
        WHEN 'segundo_parcial' THEN 2
        WHEN 'ordinario' THEN 3
        WHEN 'proyecto' THEN 4
        WHEN 'examenes_semanales' THEN 5
        WHEN 'calificacion_final' THEN 6
        ELSE 7
    END;

-- Verificar tipos de evaluación
PRINT '';
PRINT '--- TIPOS DE EVALUACIÓN ---';
SELECT * FROM tipos_evaluacion ORDER BY nombre;

-- Verificar categorías DET/AF
PRINT '';
PRINT '--- CATEGORÍAS DET/AF ---';
SELECT * FROM categorias_det_af ORDER BY tipo, nombre;

-- Contar registros por tabla
PRINT '';
PRINT '--- RESUMEN DE REGISTROS ---';
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Materias', COUNT(*) FROM materias
UNION ALL
SELECT 'Calificaciones', COUNT(*) FROM calificaciones
UNION ALL
SELECT 'Tipos_Evaluacion', COUNT(*) FROM tipos_evaluacion
UNION ALL
SELECT 'Categorias_DET_AF', COUNT(*) FROM categorias_det_af
UNION ALL
SELECT 'Inscripciones_DET_AF', COUNT(*) FROM inscripciones_det_af;

-- Verificar estructura específica para Arquitectura 3er semestre
PRINT '';
PRINT '--- DATOS ESPECÍFICOS ARQUITECTURA 3ER SEMESTRE ---';
SELECT 
    'Usuario Arquitectura 3er' as tipo,
    COUNT(*) as total
FROM usuarios 
WHERE area_estudios = 'Arquitectura' AND semestre = 3

UNION ALL

SELECT 
    'Materias Arquitectura 3er',
    COUNT(*)
FROM materias 
WHERE area_estudios = 'Arquitectura' AND semestre = 3

UNION ALL

SELECT 
    'Calificaciones Arquitectura 3er',
    COUNT(*)
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.area_estudios = 'Arquitectura' AND u.semestre = 3;

PRINT '===============================================';
PRINT 'VERIFICACIÓN COMPLETADA';
PRINT '===============================================';
