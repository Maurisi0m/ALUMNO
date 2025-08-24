-- ================================================================
-- AGREGAR CAMPO fecha_baja A TABLA inscripciones_det_af
-- ================================================================

USE [SIGEA_DB_LOCAL];
GO

PRINT '📅 Agregando campo fecha_baja si no existe...';

-- Verificar si el campo ya existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('inscripciones_det_af') AND name = 'fecha_baja')
BEGIN
    ALTER TABLE inscripciones_det_af 
    ADD fecha_baja DATETIME NULL;
    
    PRINT '✅ Campo fecha_baja agregado exitosamente';
END
ELSE
BEGIN
    PRINT '✅ Campo fecha_baja ya existe';
END

PRINT '📋 Estructura actualizada de tabla inscripciones_det_af:';

-- Mostrar estructura actual
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'inscripciones_det_af'
ORDER BY ORDINAL_POSITION;
