-- Script de verificación para Mauro Ortiz (240088@lasallep.mx)
-- Ejecutar después del script principal para confirmar configuración

USE SIGEA_DB_LOCAL;
GO

PRINT '===============================================';
PRINT 'VERIFICACION USUARIO MAURO ORTIZ';
PRINT '===============================================';

-- Verificar usuario existe
IF EXISTS (SELECT * FROM usuarios WHERE email = '240088@lasallep.mx')
BEGIN
    PRINT '✓ Usuario Mauro Ortiz encontrado';
    
    SELECT 
        'DATOS USUARIO' as Seccion,
        nombre,
        email,
        matricula,
        area_estudios,
        semestre,
        rol,
        activo
    FROM usuarios 
    WHERE email = '240088@lasallep.mx';
    
END
ELSE
BEGIN
    PRINT '✗ ERROR: Usuario Mauro Ortiz NO encontrado';
END

-- Verificar materias de Arquitectura 3er semestre
PRINT '';
PRINT 'Materias disponibles para Arquitectura 3er semestre:';

SELECT 
    'MATERIA' as Tipo,
    codigo,
    nombre,
    creditos
FROM materias 
WHERE area_estudios = 'Arquitectura' AND semestre = 3
ORDER BY nombre;

-- Verificar calificaciones del usuario
PRINT '';
PRINT 'Calificaciones de Mauro Ortiz:';

SELECT 
    'CALIFICACION' as Tipo,
    m.nombre as Materia,
    c.tipo_evaluacion,
    c.calificacion,
    c.porcentaje
FROM calificaciones c
INNER JOIN materias m ON c.materia_id = m.id
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = '240088@lasallp.mx'
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

-- Contar registros
PRINT '';
SELECT 'RESUMEN' as Seccion, 'Total Materias Arquitectura 3er' as Descripcion, COUNT(*) as Cantidad
FROM materias 
WHERE area_estudios = 'Arquitectura' AND semestre = 3

UNION ALL

SELECT 'RESUMEN', 'Total Calificaciones Mauro', COUNT(*)
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx'

UNION ALL

SELECT 'RESUMEN', 'Calificaciones Finales', COUNT(*)
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx' AND c.tipo_evaluacion = 'calificacion_final'

UNION ALL

SELECT 'RESUMEN', 'Categorias DET/AF', COUNT(*)
FROM categorias_det_af

UNION ALL

SELECT 'RESUMEN', 'Inscripciones DET/AF de Mauro', COUNT(*)
FROM inscripciones_det_af i
INNER JOIN usuarios u ON i.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx';

-- Verificar inscripciones DET/AF
PRINT '';
PRINT 'Inscripciones DET/AF de Mauro Ortiz:';

SELECT 
    'INSCRIPCION' as Tipo,
    c.tipo,
    c.nombre,
    c.descripcion,
    i.estado,
    i.fecha_inscripcion
FROM inscripciones_det_af i
INNER JOIN categorias_det_af c ON i.categoria_id = c.id
INNER JOIN usuarios u ON i.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx';

PRINT '';
PRINT '===============================================';
PRINT 'CREDENCIALES PARA LOGIN:';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Password: 1234';
PRINT '===============================================';

-- Test de autenticación simulada
DECLARE @test_email NVARCHAR(150) = '240088@lasallep.mx';
DECLARE @test_password NVARCHAR(50) = '1234';

IF EXISTS (
    SELECT * FROM usuarios 
    WHERE email = @test_email 
    AND (password = @test_password OR password = '1234')
    AND activo = 1
)
BEGIN
    PRINT '✓ TEST AUTENTICACION: EXITOSO';
    PRINT '✓ El usuario puede hacer login correctamente';
END
ELSE
BEGIN
    PRINT '✗ TEST AUTENTICACION: FALLIDO';
    PRINT '✗ Revisar credenciales o configuración';
END

PRINT '';
PRINT '===============================================';
PRINT 'VERIFICACION COMPLETADA';
PRINT '===============================================';
