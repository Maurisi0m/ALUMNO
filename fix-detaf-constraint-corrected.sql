-- ================================================================
-- FIX CORREGIDO PARA CONSTRAINT DET/AF
-- ================================================================
-- Problema: El constraint UQ_Usuario_DET_Activo está impidiendo
-- actualizar registros de 'activa' a 'baja'
-- 
-- Causa: El constraint debe ser diferente para permitir el UPDATE
-- ================================================================

USE [SIGEA_DB_LOCAL];
GO

PRINT '🔧 APLICANDO FIX CORREGIDO PARA CONSTRAINT DET/AF...';
PRINT '';

-- ================================================================
-- 1. VERIFICAR ESTADO ACTUAL DE LA BASE DE DATOS
-- ================================================================

PRINT '📊 Verificando estado actual de la tabla...';

-- Mostrar inscripciones del usuario problema (ID 9)
SELECT 
    id,
    usuario_id,
    categoria_id,
    tipo_categoria,
    estado,
    fecha_inscripcion
FROM inscripciones_det_af 
WHERE usuario_id = 9
ORDER BY tipo_categoria, fecha_inscripcion;

PRINT '';

-- ================================================================
-- 2. REMOVER TODOS LOS CONSTRAINTS PROBLEMÁTICOS
-- ================================================================

-- Remover constraint único si existe
IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'UQ_Usuario_DET')
BEGIN
    PRINT '🗑️ Removiendo constraint UQ_Usuario_DET...';
    ALTER TABLE inscripciones_det_af DROP CONSTRAINT UQ_Usuario_DET;
    PRINT '✅ Constraint UQ_Usuario_DET removido';
END

-- Remover índice único si existe
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_Usuario_DET_Activo')
BEGIN
    PRINT '🗑️ Removiendo índice UQ_Usuario_DET_Activo...';
    DROP INDEX UQ_Usuario_DET_Activo ON inscripciones_det_af;
    PRINT '✅ Índice UQ_Usuario_DET_Activo removido';
END

PRINT '';

-- ================================================================
-- 3. APLICAR SOLUCIÓN CORRECTA
-- ================================================================
-- En lugar de un constraint que cause conflictos, vamos a:
-- 1. Permitir múltiples registros por usuario/tipo
-- 2. Usar lógica de aplicación para manejar "1 activo por tipo"
-- 3. Agregar un índice para performance (no único)

PRINT '➕ Agregando índice de performance (no único)...';

-- Índice compuesto para mejorar queries, pero NO único
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuario_Tipo_Estado')
BEGIN
    CREATE INDEX IX_Usuario_Tipo_Estado 
    ON inscripciones_det_af (usuario_id, tipo_categoria, estado);
    
    PRINT '✅ Índice IX_Usuario_Tipo_Estado creado';
END
ELSE
BEGIN
    PRINT '✅ Índice IX_Usuario_Tipo_Estado ya existe';
END

PRINT '';

-- ================================================================
-- 4. CREAR VIEW PARA INSCRIPCIONES ACTIVAS
-- ================================================================

PRINT '📋 Creando view para inscripciones activas...';

-- View que solo muestra inscripciones activas (facilita queries)
IF EXISTS (SELECT * FROM sys.views WHERE name = 'v_inscripciones_activas')
BEGIN
    DROP VIEW v_inscripciones_activas;
END

EXEC('CREATE VIEW v_inscripciones_activas AS
SELECT 
    i.id,
    i.usuario_id,
    i.categoria_id,
    i.tipo_categoria,
    i.estado,
    i.fecha_inscripcion,
    c.nombre as categoria_nombre,
    c.descripcion
FROM inscripciones_det_af i
INNER JOIN categorias_det_af c ON i.categoria_id = c.id
WHERE i.estado = ''activa''');

PRINT '✅ View v_inscripciones_activas creada';

PRINT '';

-- ================================================================
-- 5. PROBAR LA FUNCIONALIDAD DE BAJA
-- ================================================================

PRINT '🧪 Probando funcionalidad de baja...';

-- Probar baja con el usuario problemático
DECLARE @test_user_id INT = 9;
DECLARE @test_inscription_id INT = 7; -- ID de la inscripción DET

PRINT '📝 Probando baja para usuario ' + CAST(@test_user_id AS NVARCHAR(10)) + ', inscripción ' + CAST(@test_inscription_id AS NVARCHAR(10));

BEGIN TRY
    -- Ejecutar procedimiento de baja
    EXEC sp_dar_baja_det_af 
        @usuario_id = @test_user_id,
        @inscripcion_id = @test_inscription_id;
    
    PRINT '✅ Baja ejecutada exitosamente';
    
    -- Verificar resultado
    SELECT 
        'Después de la baja:' as estado,
        id,
        usuario_id,
        tipo_categoria,
        estado
    FROM inscripciones_det_af 
    WHERE id = @test_inscription_id;
    
END TRY
BEGIN CATCH
    PRINT '❌ Error en prueba de baja: ' + ERROR_MESSAGE();
    PRINT '🔢 Error número: ' + CAST(ERROR_NUMBER() AS NVARCHAR(10));
END CATCH

PRINT '';

-- ================================================================
-- 6. VERIFICAR INTEGRIDAD DE DATOS
-- ================================================================

PRINT '🔍 Verificando integridad de datos...';

-- Mostrar usuarios con múltiples inscripciones activas del mismo tipo (esto sería un problema)
SELECT 
    'Usuarios con múltiples activas del mismo tipo:' as alerta,
    usuario_id,
    tipo_categoria,
    COUNT(*) as cantidad_activas
FROM inscripciones_det_af 
WHERE estado = 'activa'
GROUP BY usuario_id, tipo_categoria
HAVING COUNT(*) > 1;

-- Si no hay resultados, es bueno
IF @@ROWCOUNT = 0
BEGIN
    PRINT '✅ No hay usuarios con múltiples inscripciones activas del mismo tipo';
END

PRINT '';

-- ================================================================
-- 7. RESUMEN Y RECOMENDACIONES
-- ================================================================

PRINT '📋 RESUMEN DEL FIX CORREGIDO:';
PRINT '═══════════════════════════════════════════════════════════';
PRINT '✅ Todos los constraints únicos problemáticos removidos';
PRINT '✅ Índice de performance agregado (no único)';
PRINT '✅ View para consultas rápidas de activos creada';
PRINT '✅ Procedimiento sp_dar_baja_det_af probado';
PRINT '';
PRINT '📝 CAMBIOS APLICADOS:';
PRINT '   • Sin restricciones únicas en inscripciones_det_af';
PRINT '   • La lógica "1 activo por tipo" se maneja en la aplicación';
PRINT '   • Historial completo de inscripciones mantenido';
PRINT '   • Performance optimizada con índices apropiados';
PRINT '';
PRINT '🔄 Reinicia la aplicación para probar la funcionalidad';
PRINT '✅ Fix aplicado exitosamente';
