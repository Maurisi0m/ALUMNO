-- ================================================================
-- SCRIPT DE VERIFICACIÓN DET/AF
-- Ejecutar DESPU��S de fix-detaf-database.sql
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '🔍 VERIFICANDO FUNCIONAMIENTO DET/AF...';
PRINT '';

-- ================================================================
-- 1. VERIFICAR ESTRUCTURA DE BASE DE DATOS
-- ================================================================

PRINT '📋 VERIFICANDO TABLAS Y PROCEDIMIENTOS...';

-- Verificar tablas
SELECT 'TABLAS EXISTENTES' as Verificacion, 
    CASE 
        WHEN EXISTS (SELECT * FROM sysobjects WHERE name='categorias_det_af' AND xtype='U') THEN '✅'
        ELSE '❌'
    END + ' categorias_det_af' as Estado
UNION ALL
SELECT 'TABLAS EXISTENTES',
    CASE 
        WHEN EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones_det_af' AND xtype='U') THEN '✅'
        ELSE '❌'
    END + ' inscripciones_det_af'

-- Verificar procedimientos
UNION ALL
SELECT 'PROCEDIMIENTOS',
    CASE 
        WHEN EXISTS (SELECT * FROM sysobjects WHERE name='sp_inscribir_det_af' AND xtype='P') THEN '✅'
        ELSE '❌'
    END + ' sp_inscribir_det_af'
UNION ALL
SELECT 'PROCEDIMIENTOS',
    CASE 
        WHEN EXISTS (SELECT * FROM sysobjects WHERE name='sp_dar_baja_det_af' AND xtype='P') THEN '✅'
        ELSE '❌'
    END + ' sp_dar_baja_det_af'

-- Verificar vistas
UNION ALL
SELECT 'VISTAS',
    CASE 
        WHEN EXISTS (SELECT * FROM sysobjects WHERE name='v_categorias_disponibles' AND xtype='V') THEN '✅'
        ELSE '❌'
    END + ' v_categorias_disponibles'
UNION ALL
SELECT 'VISTAS',
    CASE 
        WHEN EXISTS (SELECT * FROM sysobjects WHERE name='v_inscripciones_usuario' AND xtype='V') THEN '✅'
        ELSE '❌'
    END + ' v_inscripciones_usuario';

-- ================================================================
-- 2. VERIFICAR DATOS DE CATEGORÍAS
-- ================================================================

PRINT '';
PRINT '📊 VERIFICANDO CATEGORÍAS DET/AF...';

SELECT 'CATEGORÍAS POR TIPO' as Resumen, tipo as TipoCategoria, COUNT(*) as Cantidad
FROM categorias_det_af
WHERE activo = 1
GROUP BY tipo
ORDER BY tipo;

SELECT 'TODAS LAS CATEGORÍAS' as Detalle, tipo as TipoCategoria, nombre, cupo_maximo, activo
FROM categorias_det_af
ORDER BY tipo, nombre;

-- ================================================================
-- 3. VERIFICAR USUARIO DE PRUEBA
-- ================================================================

PRINT '';
PRINT '👤 VERIFICANDO USUARIO DE PRUEBA...';

SELECT 'USUARIO MAURO' as Verificacion, 
    CASE 
        WHEN EXISTS (SELECT * FROM usuarios WHERE matricula = '240088') THEN '✅ Usuario Mauro existe'
        ELSE '❌ Usuario Mauro NO existe'
    END as Estado;

-- Mostrar datos del usuario si existe
IF EXISTS (SELECT * FROM usuarios WHERE matricula = '240088')
BEGIN
    SELECT 'DATOS USUARIO' as Info, id, nombre, email, matricula, area_estudios, semestre, activo
    FROM usuarios 
    WHERE matricula = '240088';
END

-- ================================================================
-- 4. PROBAR PROCEDIMIENTOS ALMACENADOS
-- ================================================================

PRINT '';
PRINT '🧪 PROBANDO PROCEDIMIENTOS ALMACENADOS...';

DECLARE @test_user_id INT;
DECLARE @test_categoria_det INT;
DECLARE @test_categoria_af INT;

-- Obtener ID del usuario de prueba
SELECT @test_user_id = id FROM usuarios WHERE matricula = '240088';

-- Obtener categorías de prueba
SELECT TOP 1 @test_categoria_det = id FROM categorias_det_af WHERE tipo = 'DET' AND activo = 1;
SELECT TOP 1 @test_categoria_af = id FROM categorias_det_af WHERE tipo = 'AF' AND activo = 1;

IF @test_user_id IS NOT NULL AND @test_categoria_det IS NOT NULL AND @test_categoria_af IS NOT NULL
BEGIN
    PRINT 'Probando inscripción en DET...';
    
    -- Limpiar inscripciones previas del usuario de prueba
    UPDATE inscripciones_det_af 
    SET estado = 'baja' 
    WHERE usuario_id = @test_user_id AND estado = 'activa';
    
    -- Probar inscripción DET
    BEGIN TRY
        EXEC sp_inscribir_det_af @test_user_id, @test_categoria_det;
        PRINT '✅ Inscripción DET: EXITOSA';
    END TRY
    BEGIN CATCH
        PRINT '❌ Inscripción DET: ERROR - ' + ERROR_MESSAGE();
    END CATCH
    
    -- Probar inscripción AF
    BEGIN TRY
        EXEC sp_inscribir_det_af @test_user_id, @test_categoria_af;
        PRINT '✅ Inscripción AF: EXITOSA';
    END TRY
    BEGIN CATCH
        PRINT '❌ Inscripción AF: ERROR - ' + ERROR_MESSAGE();
    END CATCH
    
    -- Probar baja de inscripción
    DECLARE @inscripcion_id INT;
    SELECT TOP 1 @inscripcion_id = id 
    FROM inscripciones_det_af 
    WHERE usuario_id = @test_user_id AND estado = 'activa';
    
    IF @inscripcion_id IS NOT NULL
    BEGIN
        BEGIN TRY
            EXEC sp_dar_baja_det_af @test_user_id, @inscripcion_id;
            PRINT '✅ Baja de inscripción: EXITOSA';
        END TRY
        BEGIN CATCH
            PRINT '❌ Baja de inscripción: ERROR - ' + ERROR_MESSAGE();
        END CATCH
    END
END
ELSE
BEGIN
    PRINT '⚠️ No se pueden probar los procedimientos: faltan datos de prueba';
END

-- ================================================================
-- 5. VERIFICAR VISTAS
-- ================================================================

PRINT '';
PRINT '👁️ PROBANDO VISTAS...';

-- Probar vista de categorías disponibles
BEGIN TRY
    SELECT 'VISTA CATEGORÍAS' as Prueba, COUNT(*) as Registros
    FROM v_categorias_disponibles;
    PRINT '✅ Vista v_categorias_disponibles: FUNCIONA';
END TRY
BEGIN CATCH
    PRINT '❌ Vista v_categorias_disponibles: ERROR - ' + ERROR_MESSAGE();
END CATCH

-- Probar vista de inscripciones de usuario
BEGIN TRY
    SELECT 'VISTA INSCRIPCIONES' as Prueba, COUNT(*) as Registros
    FROM v_inscripciones_usuario;
    PRINT '✅ Vista v_inscripciones_usuario: FUNCIONA';
END TRY
BEGIN CATCH
    PRINT '❌ Vista v_inscripciones_usuario: ERROR - ' + ERROR_MESSAGE();
END CATCH

-- ================================================================
-- 6. RESUMEN DE ESTADO ACTUAL
-- ================================================================

PRINT '';
PRINT '📈 ESTADO ACTUAL DEL SISTEMA...';

-- Mostrar categorías con cupos disponibles
SELECT 'DISPONIBILIDAD' as Verificacion, tipo as TipoCategoria, nombre, cupo_maximo, inscritos_actuales, cupos_disponibles
FROM v_categorias_disponibles
ORDER BY tipo, nombre;

-- Mostrar inscripciones activas
SELECT 'INSCRIPCIONES ACTIVAS' as Verificacion, COUNT(*) as Total
FROM inscripciones_det_af
WHERE estado = 'activa';

-- ================================================================
-- 7. INSTRUCCIONES FINALES
-- ================================================================

PRINT '';
PRINT '================================================================';
PRINT '🎉 VERIFICACIÓN COMPLETA';
PRINT '================================================================';
PRINT '';
PRINT '✅ Si todas las pruebas muestran ✅, el sistema está funcionando';
PRINT '❌ Si hay errores ❌, revisar los mensajes de error';
PRINT '';
PRINT '🚀 PRÓXIMOS PASOS:';
PRINT '   1. Reinicia tu aplicación (npm run dev)';
PRINT '   2. Ve a http://localhost:8080/inscripcion-det-af';
PRINT '   3. Inicia sesión con: 240088@lasallep.mx / 1234';
PRINT '   4. Prueba inscribirte y darte de baja';
PRINT '';
PRINT '📝 ENDPOINTS A PROBAR:';
PRINT '   - GET /api/detaf/categories (debería devolver categorías)';
PRINT '   - GET /api/detaf/my-status (con token)';
PRINT '   - POST /api/detaf/enroll (con token y categoryId)';
PRINT '   - POST /api/detaf/unenroll (con token e inscriptionId)';
PRINT '';
PRINT '================================================================';
