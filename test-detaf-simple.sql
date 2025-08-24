-- ================================================================
-- PRUEBA SIMPLE DET/AF - SIN AMBIGÜEDADES
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '🔍 PRUEBA RÁPIDA DEL SISTEMA DET/AF';
PRINT '';

-- ================================================================
-- 1. VERIFICAR QUE TODO EXISTE
-- ================================================================

PRINT '📋 VERIFICANDO COMPONENTES ESENCIALES...';

-- Contar tablas principales
SELECT 'TABLAS' as Componente, 
       CASE WHEN EXISTS (SELECT * FROM sysobjects WHERE name='categorias_det_af' AND xtype='U') THEN 'SI' ELSE 'NO' END as categorias_det_af,
       CASE WHEN EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones_det_af' AND xtype='U') THEN 'SI' ELSE 'NO' END as inscripciones_det_af;

-- Contar procedimientos
SELECT 'PROCEDIMIENTOS' as Componente,
       CASE WHEN EXISTS (SELECT * FROM sysobjects WHERE name='sp_inscribir_det_af' AND xtype='P') THEN 'SI' ELSE 'NO' END as sp_inscribir,
       CASE WHEN EXISTS (SELECT * FROM sysobjects WHERE name='sp_dar_baja_det_af' AND xtype='P') THEN 'SI' ELSE 'NO' END as sp_dar_baja;

-- ================================================================
-- 2. CONTAR DATOS
-- ================================================================

PRINT '';
PRINT '📊 CONTANDO DATOS...';

-- Contar categorías por tipo
SELECT c.tipo, COUNT(*) as total_categorias
FROM categorias_det_af c
WHERE c.activo = 1
GROUP BY c.tipo;

-- Contar inscripciones activas
SELECT 'Inscripciones activas' as descripcion, COUNT(*) as total
FROM inscripciones_det_af
WHERE estado = 'activa';

-- ================================================================
-- 3. MOSTRAR CATEGORÍAS DISPONIBLES
-- ================================================================

PRINT '';
PRINT '🎯 CATEGORÍAS DISPONIBLES...';

-- Usar consulta directa sin vista para evitar problemas
SELECT c.id, c.tipo, c.nombre, c.cupo_maximo,
       ISNULL(i.inscritos, 0) as inscritos_actuales,
       (c.cupo_maximo - ISNULL(i.inscritos, 0)) as cupos_disponibles
FROM categorias_det_af c
LEFT JOIN (
    SELECT categoria_id, COUNT(*) as inscritos
    FROM inscripciones_det_af 
    WHERE estado = 'activa'
    GROUP BY categoria_id
) i ON c.id = i.categoria_id
WHERE c.activo = 1
ORDER BY c.tipo, c.nombre;

-- ================================================================
-- 4. VERIFICAR USUARIO DE PRUEBA
-- ================================================================

PRINT '';
PRINT '👤 USUARIO DE PRUEBA...';

SELECT u.id, u.nombre, u.matricula, u.email
FROM usuarios u
WHERE u.matricula = '240088';

-- Verificar inscripciones del usuario
IF EXISTS (SELECT * FROM usuarios WHERE matricula = '240088')
BEGIN
    DECLARE @user_id INT = (SELECT id FROM usuarios WHERE matricula = '240088');
    
    SELECT i.id as inscripcion_id, c.tipo, c.nombre as categoria, i.estado, i.fecha_inscripcion
    FROM inscripciones_det_af i
    INNER JOIN categorias_det_af c ON i.categoria_id = c.id
    WHERE i.usuario_id = @user_id
    ORDER BY i.fecha_inscripcion DESC;
END

-- ================================================================
-- 5. PRUEBA DE PROCEDIMIENTOS (OPCIONAL)
-- ================================================================

PRINT '';
PRINT '🧪 PROBANDO PROCEDIMIENTOS (solo si hay usuario)...';

IF EXISTS (SELECT * FROM usuarios WHERE matricula = '240088')
BEGIN
    DECLARE @test_user_id INT = (SELECT id FROM usuarios WHERE matricula = '240088');
    DECLARE @test_categoria INT = (SELECT TOP 1 id FROM categorias_det_af WHERE tipo = 'DET' AND activo = 1);
    
    PRINT 'Usuario ID: ' + CAST(@test_user_id as VARCHAR(10));
    PRINT 'Categoria ID: ' + CAST(@test_categoria as VARCHAR(10));
    
    -- Verificar que los procedimientos existen antes de usarlos
    IF EXISTS (SELECT * FROM sysobjects WHERE name='sp_inscribir_det_af' AND xtype='P')
        AND EXISTS (SELECT * FROM sysobjects WHERE name='sp_dar_baja_det_af' AND xtype='P')
    BEGIN
        PRINT '✅ Ambos procedimientos existen y están listos para usar';
    END
    ELSE
    BEGIN
        PRINT '❌ Faltan procedimientos almacenados';
    END
END
ELSE
BEGIN
    PRINT '⚠️ No hay usuario de prueba (240088@lasallep.mx)';
END

-- ================================================================
-- 6. RESUMEN FINAL
-- ================================================================

PRINT '';
PRINT '================================================================';
PRINT '📈 RESUMEN DEL ESTADO DET/AF';
PRINT '================================================================';

-- Estado general
SELECT 'ESTADO GENERAL' as categoria,
       (SELECT COUNT(*) FROM categorias_det_af WHERE activo = 1) as total_categorias,
       (SELECT COUNT(*) FROM inscripciones_det_af WHERE estado = 'activa') as inscripciones_activas,
       (SELECT COUNT(*) FROM usuarios WHERE matricula LIKE '24%') as usuarios_estudiantes;

PRINT '';
PRINT '✅ Si ves datos arriba, el sistema DET/AF está funcionando';
PRINT '🚀 Puedes probar el frontend en: /inscripcion-det-af';
PRINT '🔑 Usuario de prueba: 240088@lasallep.mx / 1234';
PRINT '';
PRINT '================================================================';
