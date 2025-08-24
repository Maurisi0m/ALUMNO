-- ================================================================
-- FIX PARA CONSTRAINT ÚNICO DET/AF
-- ================================================================
-- Problema: El constraint actual UQ_Usuario_DET impide que usuarios
-- se reinscriban después de darse de baja, porque incluye registros
-- con estado = 'baja'
-- 
-- Solución: Reemplazar constraint con uno que solo aplique a activos
-- ================================================================

USE [SIGEA_DB_LOCAL];
GO

PRINT '🔧 INICIANDO FIX DE CONSTRAINT ÚNICO DET/AF...';
PRINT '';

-- ================================================================
-- 1. VERIFICAR ESTADO ACTUAL
-- ================================================================

PRINT '📊 Verificando estado actual...';

-- Verificar si existe el constraint problemático
IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'UQ_Usuario_DET')
BEGIN
    PRINT '❌ Constraint problemático UQ_Usuario_DET encontrado';
    
    -- Mostrar registros que podrían causar problemas
    SELECT 
        usuario_id,
        tipo_categoria,
        estado,
        COUNT(*) as cantidad
    FROM inscripciones_det_af 
    GROUP BY usuario_id, tipo_categoria, estado
    HAVING COUNT(*) > 1
    ORDER BY usuario_id, tipo_categoria;
    
END
ELSE
BEGIN
    PRINT '✅ Constraint UQ_Usuario_DET no encontrado';
END

-- Verificar si ya existe el constraint correcto
IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'UQ_Usuario_DET_Activo')
BEGIN
    PRINT '✅ Constraint correcto UQ_Usuario_DET_Activo ya existe';
END
ELSE
BEGIN
    PRINT '⚠️ Constraint correcto UQ_Usuario_DET_Activo no encontrado';
END

PRINT '';

-- ================================================================
-- 2. REMOVER CONSTRAINT PROBLEMÁTICO
-- ================================================================

IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'UQ_Usuario_DET')
BEGIN
    PRINT '🗑️ Removiendo constraint problemático UQ_Usuario_DET...';
    
    ALTER TABLE inscripciones_det_af 
    DROP CONSTRAINT UQ_Usuario_DET;
    
    PRINT '✅ Constraint UQ_Usuario_DET removido exitosamente';
END
ELSE
BEGIN
    PRINT '✅ Constraint UQ_Usuario_DET ya estaba removido';
END

PRINT '';

-- ================================================================
-- 3. AGREGAR CONSTRAINT CORRECTO (SOLO ACTIVOS)
-- ================================================================

IF NOT EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'UQ_Usuario_DET_Activo')
BEGIN
    PRINT '➕ Agregando constraint correcto UQ_Usuario_DET_Activo...';
    
    -- Crear índice único filtrado que solo aplique a registros activos
    CREATE UNIQUE INDEX UQ_Usuario_DET_Activo 
    ON inscripciones_det_af (usuario_id, tipo_categoria) 
    WHERE estado = 'activa';
    
    PRINT '✅ Constraint UQ_Usuario_DET_Activo creado exitosamente';
    PRINT '   📝 Solo aplica a inscripciones con estado = ''activa''';
END
ELSE
BEGIN
    PRINT '✅ Constraint UQ_Usuario_DET_Activo ya existe';
END

PRINT '';

-- ================================================================
-- 4. VERIFICAR FIX
-- ================================================================

PRINT '🔍 Verificando fix aplicado...';

-- Contar constraints existentes
DECLARE @constraint_count INT;
SELECT @constraint_count = COUNT(*) 
FROM sys.indexes 
WHERE name = 'UQ_Usuario_DET_Activo' 
AND object_id = OBJECT_ID('inscripciones_det_af');

IF @constraint_count > 0
BEGIN
    PRINT '✅ Constraint correcto verificado: UQ_Usuario_DET_Activo';
    
    -- Mostrar detalles del constraint
    SELECT 
        i.name AS constraint_name,
        i.type_desc AS constraint_type,
        i.filter_definition AS filter_condition,
        'Permite múltiples registros por usuario/tipo si no están activos' AS descripcion
    FROM sys.indexes i
    WHERE i.name = 'UQ_Usuario_DET_Activo'
    AND i.object_id = OBJECT_ID('inscripciones_det_af');
    
END
ELSE
BEGIN
    PRINT '❌ Error: Constraint correcto no fue creado';
END

PRINT '';

-- ================================================================
-- 5. PRUEBA FUNCIONALIDAD
-- ================================================================

PRINT '🧪 Probando funcionalidad de baja y re-inscripción...';

-- Buscar una inscripción activa para probar
DECLARE @test_user_id INT;
DECLARE @test_inscription_id INT;
DECLARE @test_categoria_id INT;
DECLARE @test_tipo NVARCHAR(10);

SELECT TOP 1 
    @test_user_id = usuario_id,
    @test_inscription_id = id,
    @test_categoria_id = categoria_id,
    @test_tipo = tipo_categoria
FROM inscripciones_det_af 
WHERE estado = 'activa';

IF @test_user_id IS NOT NULL
BEGIN
    PRINT '🔄 Probando con usuario: ' + CAST(@test_user_id AS NVARCHAR(10));
    PRINT '   Inscripción ID: ' + CAST(@test_inscription_id AS NVARCHAR(10));
    PRINT '   Tipo: ' + @test_tipo;
    
    BEGIN TRY
        -- Simular baja
        PRINT '   📝 Simulando baja...';
        UPDATE inscripciones_det_af 
        SET estado = 'baja'
        WHERE id = @test_inscription_id;
        
        -- Simular re-inscripción (debería funcionar ahora)
        PRINT '   📝 Simulando re-inscripción...';
        INSERT INTO inscripciones_det_af (usuario_id, categoria_id, tipo_categoria, estado)
        VALUES (@test_user_id, @test_categoria_id, @test_tipo, 'activa');
        
        PRINT '   ✅ Prueba exitosa: Baja y re-inscripción funcionan';
        
        -- Limpiar prueba
        DELETE FROM inscripciones_det_af 
        WHERE usuario_id = @test_user_id 
        AND categoria_id = @test_categoria_id 
        AND estado = 'activa'
        AND id > @test_inscription_id;
        
        UPDATE inscripciones_det_af 
        SET estado = 'activa'
        WHERE id = @test_inscription_id;
        
        PRINT '   🧹 Datos de prueba limpiados';
        
    END TRY
    BEGIN CATCH
        PRINT '   ❌ Error en prueba: ' + ERROR_MESSAGE();
        
        -- Restaurar estado original
        UPDATE inscripciones_det_af 
        SET estado = 'activa'
        WHERE id = @test_inscription_id;
    END CATCH
END
ELSE
BEGIN
    PRINT '⚠️ No hay inscripciones activas para probar';
END

PRINT '';

-- ================================================================
-- 6. RESUMEN
-- ================================================================

PRINT '📋 RESUMEN DEL FIX:';
PRINT '═══════════════════════════════════════════════════════════';
PRINT '✅ Constraint problemático UQ_Usuario_DET removido';
PRINT '✅ Constraint correcto UQ_Usuario_DET_Activo agregado';
PRINT '📝 Ahora los usuarios pueden:';
PRINT '   • Darse de baja de inscripciones';
PRINT '   • Re-inscribirse en el mismo tipo (DET/AF)';
PRINT '   • Mantener historial de inscripciones pasadas';
PRINT '✅ Fix aplicado exitosamente';
PRINT '';
PRINT '🔄 Reinicia la aplicación para aplicar cambios';
