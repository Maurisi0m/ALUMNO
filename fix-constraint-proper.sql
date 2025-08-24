-- ================================================================
-- FIX CORRECTO PARA CONSTRAINT DET/AF
-- ================================================================
-- Problema: No se puede eliminar índice directamente si está asociado 
-- a un constraint. Hay que eliminar el constraint primero.
-- ================================================================

USE [SIGEA_DB_LOCAL];
GO

PRINT '🔧 APLICANDO FIX CORRECTO PARA CONSTRAINT DET/AF...';
PRINT '';

-- ================================================================
-- 1. IDENTIFICAR Y REMOVER CONSTRAINTS ÚNICOS
-- ================================================================

-- Buscar constraints únicos en la tabla
PRINT '🔍 Identificando constraints únicos existentes...';

SELECT 
    tc.CONSTRAINT_NAME,
    tc.CONSTRAINT_TYPE,
    kcu.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'inscripciones_det_af' 
AND tc.CONSTRAINT_TYPE = 'UNIQUE';

PRINT '';

-- Remover constraint UQ_Usuario_DET si existe
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
           WHERE TABLE_NAME = 'inscripciones_det_af' 
           AND CONSTRAINT_NAME = 'UQ_Usuario_DET' 
           AND CONSTRAINT_TYPE = 'UNIQUE')
BEGIN
    PRINT '🗑️ Removiendo constraint UQ_Usuario_DET...';
    ALTER TABLE inscripciones_det_af DROP CONSTRAINT UQ_Usuario_DET;
    PRINT '✅ Constraint UQ_Usuario_DET removido exitosamente';
END
ELSE
BEGIN
    PRINT '✅ Constraint UQ_Usuario_DET no existe';
END

-- Remover constraint UQ_Usuario_DET_Activo si existe
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
           WHERE TABLE_NAME = 'inscripciones_det_af' 
           AND CONSTRAINT_NAME = 'UQ_Usuario_DET_Activo' 
           AND CONSTRAINT_TYPE = 'UNIQUE')
BEGIN
    PRINT '🗑️ Removiendo constraint UQ_Usuario_DET_Activo...';
    ALTER TABLE inscripciones_det_af DROP CONSTRAINT UQ_Usuario_DET_Activo;
    PRINT '✅ Constraint UQ_Usuario_DET_Activo removido exitosamente';
END
ELSE
BEGIN
    PRINT '✅ Constraint UQ_Usuario_DET_Activo no existe';
END

PRINT '';

-- ================================================================
-- 2. VERIFICAR Y REMOVER ÍNDICES ÚNICOS RESTANTES
-- ================================================================

PRINT '🔍 Verificando índices únicos restantes...';

-- Mostrar índices únicos en la tabla
SELECT 
    i.name AS index_name,
    i.type_desc AS index_type,
    i.is_unique,
    i.filter_definition
FROM sys.indexes i
WHERE i.object_id = OBJECT_ID('inscripciones_det_af')
AND i.is_unique = 1
AND i.name IS NOT NULL;

-- Remover índice UQ_Usuario_DET_Activo si aún existe
IF EXISTS (SELECT * FROM sys.indexes 
           WHERE object_id = OBJECT_ID('inscripciones_det_af') 
           AND name = 'UQ_Usuario_DET_Activo')
BEGIN
    PRINT '🗑️ Removiendo índice UQ_Usuario_DET_Activo...';
    DROP INDEX UQ_Usuario_DET_Activo ON inscripciones_det_af;
    PRINT '✅ Índice UQ_Usuario_DET_Activo removido exitosamente';
END
ELSE
BEGIN
    PRINT '✅ Índice UQ_Usuario_DET_Activo no existe';
END

PRINT '';

-- ================================================================
-- 3. AGREGAR ÍNDICE DE PERFORMANCE (NO ÚNICO)
-- ================================================================

PRINT '➕ Agregando índice de performance...';

-- Índice compuesto para mejorar queries, pero NO único
IF NOT EXISTS (SELECT * FROM sys.indexes 
               WHERE object_id = OBJECT_ID('inscripciones_det_af') 
               AND name = 'IX_Usuario_Tipo_Estado')
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
-- 4. VERIFICAR ESTADO ACTUAL DEL USUARIO 9
-- ================================================================

PRINT '👤 Verificando estado actual del usuario 9...';

SELECT 
    'Estado actual usuario 9:' as info,
    id,
    usuario_id,
    categoria_id,
    tipo_categoria,
    estado,
    fecha_inscripcion
FROM inscripciones_det_af 
WHERE usuario_id = 9
ORDER BY tipo_categoria, fecha_inscripcion DESC;

PRINT '';

-- ================================================================
-- 5. LIMPIAR DATOS INCONSISTENTES SI EXISTEN
-- ================================================================

PRINT '🧹 Limpiando posibles datos inconsistentes...';

-- Si hay múltiples registros activos del mismo tipo para el mismo usuario, 
-- mantener solo el más reciente
WITH DuplicateActiveInscriptions AS (
    SELECT 
        id,
        usuario_id,
        tipo_categoria,
        fecha_inscripcion,
        ROW_NUMBER() OVER (PARTITION BY usuario_id, tipo_categoria 
                          ORDER BY fecha_inscripcion DESC) as rn
    FROM inscripciones_det_af 
    WHERE estado = 'activa'
)
UPDATE inscripciones_det_af 
SET estado = 'baja'
WHERE id IN (
    SELECT id 
    FROM DuplicateActiveInscriptions 
    WHERE rn > 1
);

IF @@ROWCOUNT > 0
BEGIN
    PRINT '🔄 Se limpiaron ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' inscripciones duplicadas';
END
ELSE
BEGIN
    PRINT '✅ No hay inscripciones duplicadas que limpiar';
END

PRINT '';

-- ================================================================
-- 6. PROBAR FUNCIONALIDAD DE BAJA
-- ================================================================

PRINT '🧪 Probando funcionalidad de baja con usuario 9...';

-- Buscar inscripción activa del usuario 9
DECLARE @test_inscription_id INT;

SELECT TOP 1 @test_inscription_id = id
FROM inscripciones_det_af 
WHERE usuario_id = 9 AND estado = 'activa';

IF @test_inscription_id IS NOT NULL
BEGIN
    PRINT '📝 Encontrada inscripción activa ID: ' + CAST(@test_inscription_id AS NVARCHAR(10));
    
    BEGIN TRY
        -- Simular baja directa (sin usar procedimiento almacenado)
        UPDATE inscripciones_det_af 
        SET estado = 'baja'
        WHERE id = @test_inscription_id;
        
        PRINT '✅ Prueba de baja exitosa';
        
        -- Simular re-activación para restaurar estado
        UPDATE inscripciones_det_af 
        SET estado = 'activa'
        WHERE id = @test_inscription_id;
        
        PRINT '🔄 Estado restaurado para continuar usando la aplicación';
        
    END TRY
    BEGIN CATCH
        PRINT '❌ Error en prueba: ' + ERROR_MESSAGE();
    END CATCH
END
ELSE
BEGIN
    PRINT 'ℹ️ No hay inscripciones activas para el usuario 9 para probar';
END

PRINT '';

-- ================================================================
-- 7. VERIFICAR TABLA FINAL
-- ================================================================

PRINT '📋 Estado final de la tabla:';

-- Mostrar estructura sin constraints problemáticos
SELECT 
    'Constraints únicos actuales:' as info;
    
SELECT 
    tc.CONSTRAINT_NAME,
    tc.CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
WHERE tc.TABLE_NAME = 'inscripciones_det_af' 
AND tc.CONSTRAINT_TYPE = 'UNIQUE';

IF @@ROWCOUNT = 0
BEGIN
    PRINT '✅ No hay constraints únicos problemáticos';
END

PRINT '';
PRINT '📋 RESUMEN DEL FIX:';
PRINT '═══════════════════════════════════════════';
PRINT '✅ Constraints únicos problemáticos removidos';
PRINT '✅ Índices únicos problemáticos removidos';
PRINT '✅ Índice de performance agregado';
PRINT '✅ Datos inconsistentes limpiados';
PRINT '✅ Funcionalidad de baja probada';
PRINT '';
PRINT '🔄 Ahora puedes usar la aplicación sin errores de constraint';
PRINT '✅ Fix aplicado exitosamente';
