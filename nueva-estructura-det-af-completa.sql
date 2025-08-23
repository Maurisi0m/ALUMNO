-- ================================================================
-- NUEVA ESTRUCTURA DET/AF DESDE CERO
-- Sistema de inscripciones individuales por usuario
-- 1 DET + 1 AF máximo por usuario
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '=========================================================';
PRINT 'CREANDO NUEVA ESTRUCTURA DET/AF DESDE CERO';
PRINT 'Inscripciones individuales - 1 DET + 1 AF por usuario';
PRINT '=========================================================';

-- ================================================================
-- 1. ELIMINAR ESTRUCTURA ANTERIOR COMPLETAMENTE
-- ================================================================
PRINT '';
PRINT 'PASO 1: ELIMINANDO ESTRUCTURA ANTERIOR...';

-- Eliminar datos y tablas existentes
IF EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones_det_af' AND xtype='U')
BEGIN
    DROP TABLE inscripciones_det_af;
    PRINT '✓ Tabla inscripciones_det_af eliminada';
END

IF EXISTS (SELECT * FROM sysobjects WHERE name='categorias_det_af' AND xtype='U')
BEGIN
    DROP TABLE categorias_det_af;
    PRINT '✓ Tabla categorias_det_af eliminada';
END

-- ================================================================
-- 2. CREAR NUEVA ESTRUCTURA DE TABLAS
-- ================================================================
PRINT '';
PRINT 'PASO 2: CREANDO NUEVA ESTRUCTURA DE TABLAS...';

-- Tabla de categorías DET/AF
CREATE TABLE categorias_det_af (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo NVARCHAR(10) NOT NULL CHECK (tipo IN ('DET', 'AF')),
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(500),
    cupo_maximo INT DEFAULT 30,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

PRINT '✓ Tabla categorias_det_af creada';

-- Tabla de inscripciones (NUEVA LÓGICA)
CREATE TABLE inscripciones_det_af (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    tipo_categoria NVARCHAR(10) NOT NULL CHECK (tipo_categoria IN ('DET', 'AF')),
    fecha_inscripcion DATETIME DEFAULT GETDATE(),
    estado NVARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'baja')),
    
    -- Foreign Keys
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias_det_af(id),
    
    -- Constraints únicos: 1 DET + 1 AF por usuario
    CONSTRAINT UQ_Usuario_DET UNIQUE (usuario_id, tipo_categoria) 
    -- Esto garantiza que un usuario solo puede tener 1 inscripción activa por tipo
);

PRINT '✓ Tabla inscripciones_det_af creada con lógica individual';

-- ================================================================
-- 3. INSERTAR NUEVAS CATEGORÍAS DET
-- ================================================================
PRINT '';
PRINT 'PASO 3: INSERTANDO CATEGORÍAS DET...';

INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES
('DET', 'FOTOGRAFIA', 'Taller de fotografía digital y análoga, composición y técnicas avanzadas', 20),
('DET', 'DIBUJO', 'Técnicas de dibujo artístico, perspectiva y sombreado para arquitectos', 25),
('DET', 'MINDFULNESS', 'Práctica de atención plena, meditación y bienestar mental', 15),
('DET', 'ROBOTICA', 'Construcción y programación de robots educativos y competencia', 18),
('DET', 'GUITARRA', 'Clases de guitarra acústica y eléctrica, nivel principiante e intermedio', 12),
('DET', 'ENSAMBLE MUSICA', 'Grupo musical universitario, diversos instrumentos y géneros', 10);

PRINT '✓ 6 categorías DET insertadas';

-- ================================================================
-- 4. INSERTAR NUEVAS CATEGORÍAS AF
-- ================================================================
PRINT '';
PRINT 'PASO 4: INSERTANDO CATEGORÍAS AF...';

INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES
('AF', 'ATLETISMO', 'Entrenamiento de velocidad, resistencia y competencias atleticas', 30),
('AF', 'GIMNASIO', 'Entrenamiento con pesas, acondicionamiento físico general', 40),
('AF', 'FISICOCONSTRUCTIVISMO', 'Culturismo y desarrollo muscular especializado', 20),
('AF', 'BASQUET', 'Equipo representativo de basquetbol universitario', 16),
('AF', 'FUT RAPIDO', 'Futbol rápido 5v5, ligas internas y torneos', 25),
('AF', 'FUTBOL', 'Equipo representativo de futbol soccer universitario', 22),
('AF', 'TOCHO', 'Futbol americano sin contacto, banderas', 20),
('AF', 'AMERICANO', 'Futbol americano con equipo completo, competencia universitaria', 35);

PRINT '✓ 8 categorías AF insertadas';

-- ================================================================
-- 5. CREAR VISTAS PARA CONSULTAS EFICIENTES
-- ================================================================
PRINT '';
PRINT 'PASO 5: CREANDO VISTAS PARA CONSULTAS...';

-- Vista de categorías disponibles con cupos
CREATE VIEW v_categorias_disponibles AS
SELECT 
    c.id,
    c.tipo,
    c.nombre,
    c.descripcion,
    c.cupo_maximo,
    COUNT(i.id) as inscritos_actuales,
    (c.cupo_maximo - COUNT(i.id)) as cupos_disponibles,
    CASE 
        WHEN COUNT(i.id) >= c.cupo_maximo THEN 0 
        ELSE 1 
    END as tiene_cupo_disponible
FROM categorias_det_af c
LEFT JOIN inscripciones_det_af i ON c.id = i.categoria_id AND i.estado = 'activa'
WHERE c.activo = 1
GROUP BY c.id, c.tipo, c.nombre, c.descripcion, c.cupo_maximo;

PRINT '✓ Vista v_categorias_disponibles creada';

-- Vista de inscripciones activas por usuario
CREATE VIEW v_inscripciones_usuario AS
SELECT 
    u.id as usuario_id,
    u.nombre as usuario_nombre,
    u.matricula,
    i.id as inscripcion_id,
    c.tipo,
    c.nombre as categoria_nombre,
    c.descripcion,
    i.fecha_inscripcion,
    i.estado
FROM usuarios u
INNER JOIN inscripciones_det_af i ON u.id = i.usuario_id
INNER JOIN categorias_det_af c ON i.categoria_id = c.id
WHERE i.estado = 'activa';

PRINT '✓ Vista v_inscripciones_usuario creada';

-- ================================================================
-- 6. CREAR PROCEDIMIENTOS ALMACENADOS SEGUROS
-- ================================================================
PRINT '';
PRINT 'PASO 6: CREANDO PROCEDIMIENTOS ALMACENADOS...';

-- Procedimiento para inscribirse (TRANSACCIONAL)
CREATE PROCEDURE sp_inscribir_det_af
    @usuario_id INT,
    @categoria_id INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @tipo_categoria NVARCHAR(10);
    DECLARE @cupo_maximo INT;
    DECLARE @inscritos_actuales INT;
    DECLARE @ya_inscrito INT;
    
    -- Obtener tipo y cupo de la categoría
    SELECT @tipo_categoria = tipo, @cupo_maximo = cupo_maximo
    FROM categorias_det_af 
    WHERE id = @categoria_id AND activo = 1;
    
    IF @tipo_categoria IS NULL
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50001, 'Categoría no encontrada o inactiva', 1;
    END
    
    -- Verificar si ya está inscrito en una categoría del mismo tipo
    SELECT @ya_inscrito = COUNT(*)
    FROM inscripciones_det_af 
    WHERE usuario_id = @usuario_id 
    AND tipo_categoria = @tipo_categoria 
    AND estado = 'activa';
    
    IF @ya_inscrito > 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50002, 'Ya estás inscrito en una categoría de este tipo. Debes darte de baja primero.', 1;
    END
    
    -- Verificar cupo disponible (CON LOCK para evitar condiciones de carrera)
    SELECT @inscritos_actuales = COUNT(*)
    FROM inscripciones_det_af WITH (TABLOCKX)
    WHERE categoria_id = @categoria_id AND estado = 'activa';
    
    IF @inscritos_actuales >= @cupo_maximo
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50003, 'No hay cupo disponible en esta categoría', 1;
    END
    
    -- Insertar inscripción
    INSERT INTO inscripciones_det_af (usuario_id, categoria_id, tipo_categoria, estado)
    VALUES (@usuario_id, @categoria_id, @tipo_categoria, 'activa');
    
    COMMIT TRANSACTION;
    
    SELECT 'Inscripción exitosa' as mensaje, SCOPE_IDENTITY() as inscripcion_id;
END;
GO

PRINT '✓ Procedimiento sp_inscribir_det_af creado';

-- Procedimiento para darse de baja
CREATE PROCEDURE sp_dar_baja_det_af
    @usuario_id INT,
    @inscripcion_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @filas_afectadas INT;
    
    UPDATE inscripciones_det_af 
    SET estado = 'baja'
    WHERE id = @inscripcion_id 
    AND usuario_id = @usuario_id 
    AND estado = 'activa';
    
    SET @filas_afectadas = @@ROWCOUNT;
    
    IF @filas_afectadas = 0
    BEGIN
        THROW 50004, 'Inscripción no encontrada o ya dada de baja', 1;
    END
    
    SELECT 'Baja exitosa' as mensaje, @filas_afectadas as filas_afectadas;
END;
GO

PRINT '✓ Procedimiento sp_dar_baja_det_af creado';

-- ================================================================
-- 7. INSERTAR INSCRIPCIONES DE EJEMPLO
-- ================================================================
PRINT '';
PRINT 'PASO 7: INSERTANDO INSCRIPCIONES DE EJEMPLO...';

-- Inscribir algunos usuarios de ejemplo
DECLARE @mauro_id INT, @carlos_id INT, @maria_id INT;
SELECT @mauro_id = id FROM usuarios WHERE matricula = '240088';
SELECT @carlos_id = id FROM usuarios WHERE matricula = '240001';
SELECT @maria_id = id FROM usuarios WHERE matricula = '240002';

-- Mauro: ROBOTICA (DET) + GIMNASIO (AF)
IF @mauro_id IS NOT NULL
BEGIN
    EXEC sp_inscribir_det_af @mauro_id, (SELECT id FROM categorias_det_af WHERE nombre = 'ROBOTICA');
    EXEC sp_inscribir_det_af @mauro_id, (SELECT id FROM categorias_det_af WHERE nombre = 'GIMNASIO');
    PRINT '✓ Mauro inscrito en ROBOTICA y GIMNASIO';
END

-- Carlos: FOTOGRAFIA (DET) + FUTBOL (AF)
IF @carlos_id IS NOT NULL
BEGIN
    EXEC sp_inscribir_det_af @carlos_id, (SELECT id FROM categorias_det_af WHERE nombre = 'FOTOGRAFIA');
    EXEC sp_inscribir_det_af @carlos_id, (SELECT id FROM categorias_det_af WHERE nombre = 'FUTBOL');
    PRINT '✓ Carlos inscrito en FOTOGRAFIA y FUTBOL';
END

-- María: MINDFULNESS (DET) + BASQUET (AF)
IF @maria_id IS NOT NULL
BEGIN
    EXEC sp_inscribir_det_af @maria_id, (SELECT id FROM categorias_det_af WHERE nombre = 'MINDFULNESS');
    EXEC sp_inscribir_det_af @maria_id, (SELECT id FROM categorias_det_af WHERE nombre = 'BASQUET');
    PRINT '✓ María inscrita en MINDFULNESS y BASQUET';
END

-- ================================================================
-- 8. VERIFICACIONES Y CONSULTAS DE EJEMPLO
-- ================================================================
PRINT '';
PRINT 'PASO 8: VERIFICACIONES FINALES...';

-- Mostrar todas las categorías creadas
SELECT 'CATEGORÍAS CREADAS' as Tipo, tipo, nombre, cupo_maximo, activo
FROM categorias_det_af
ORDER BY tipo, nombre;

-- Mostrar inscripciones actuales
SELECT 'INSCRIPCIONES ACTIVAS' as Tipo, * FROM v_inscripciones_usuario;

-- Mostrar disponibilidad de cupos
SELECT 'DISPONIBILIDAD DE CUPOS' as Tipo, tipo, nombre, cupo_maximo, inscritos_actuales, cupos_disponibles
FROM v_categorias_disponibles
ORDER BY tipo, nombre;

-- Estadísticas generales
SELECT 'ESTADÍSTICAS' as Tipo, 'Total categorías DET' as Descripción, COUNT(*) as Cantidad
FROM categorias_det_af WHERE tipo = 'DET'

UNION ALL

SELECT 'ESTADÍSTICAS', 'Total categorías AF', COUNT(*)
FROM categorias_det_af WHERE tipo = 'AF'

UNION ALL

SELECT 'ESTADÍSTICAS', 'Total inscripciones activas', COUNT(*)
FROM inscripciones_det_af WHERE estado = 'activa'

UNION ALL

SELECT 'ESTADÍSTICAS', 'Usuarios con DET activo', COUNT(DISTINCT usuario_id)
FROM inscripciones_det_af WHERE tipo_categoria = 'DET' AND estado = 'activa'

UNION ALL

SELECT 'ESTADÍSTICAS', 'Usuarios con AF activo', COUNT(DISTINCT usuario_id)
FROM inscripciones_det_af WHERE tipo_categoria = 'AF' AND estado = 'activa';

PRINT '';
PRINT '=========================================================';
PRINT '🎉 NUEVA ESTRUCTURA DET/AF CREADA EXITOSAMENTE';
PRINT '=========================================================';
PRINT '';
PRINT '✅ CATEGORÍAS DET DISPONIBLES:';
PRINT '   • FOTOGRAFIA (20 cupos)';
PRINT '   • DIBUJO (25 cupos)';
PRINT '   • MINDFULNESS (15 cupos)';
PRINT '   • ROBOTICA (18 cupos)';
PRINT '   • GUITARRA (12 cupos)';
PRINT '   • ENSAMBLE MUSICA (10 cupos)';
PRINT '';
PRINT '✅ CATEGORÍAS AF DISPONIBLES:';
PRINT '   • ATLETISMO (30 cupos)';
PRINT '   • GIMNASIO (40 cupos)';
PRINT '   • FISICOCONSTRUCTIVISMO (20 cupos)';
PRINT '   • BASQUET (16 cupos)';
PRINT '   • FUT RAPIDO (25 cupos)';
PRINT '   • FUTBOL (22 cupos)';
PRINT '   • TOCHO (20 cupos)';
PRINT '   • AMERICANO (35 cupos)';
PRINT '';
PRINT '✅ CARACTERÍSTICAS DEL SISTEMA:';
PRINT '   • Máximo 1 DET + 1 AF por usuario';
PRINT '   • Inscripciones/bajas individuales';
PRINT '   • Control de cupos en tiempo real';
PRINT '   • Transacciones seguras (sin duplicados)';
PRINT '   • Vistas optimizadas para consultas';
PRINT '   • Procedimientos almacenados seguros';
PRINT '';
PRINT '🚀 LISTO PARA INTEGRAR CON BACKEND';
PRINT '=========================================================';
