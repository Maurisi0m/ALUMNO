-- ================================================================
-- SOLUCIÓN PARA ERROR 400 EN DET/AF
-- Este script verifica y crea las tablas/procedimientos faltantes
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

PRINT '🔧 VERIFICANDO Y CORRIGIENDO ESTRUCTURA DET/AF...';
PRINT '';

-- ================================================================
-- 1. VERIFICAR QUE EXISTAN LAS TABLAS BÁSICAS
-- ================================================================

-- Verificar tabla usuarios (debe existir)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    PRINT '❌ ERROR: Tabla usuarios no existe. Ejecuta init-local-db.sql primero';
    RETURN;
END
ELSE
BEGIN
    PRINT '✅ Tabla usuarios existe';
END

-- Agregar columnas faltantes a usuarios si no existen
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='matricula')
BEGIN
    ALTER TABLE usuarios ADD matricula NVARCHAR(20);
    PRINT '✅ Columna matricula agregada a usuarios';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='area_estudios')
BEGIN
    ALTER TABLE usuarios ADD area_estudios NVARCHAR(50);
    PRINT '✅ Columna area_estudios agregada a usuarios';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='semestre')
BEGIN
    ALTER TABLE usuarios ADD semestre INT;
    PRINT '✅ Columna semestre agregada a usuarios';
END

-- ================================================================
-- 2. CREAR TABLAS DET/AF SI NO EXISTEN
-- ================================================================

-- Verificar y crear tabla categorias_det_af
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='categorias_det_af' AND xtype='U')
BEGIN
    CREATE TABLE categorias_det_af (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tipo NVARCHAR(10) NOT NULL CHECK (tipo IN ('DET', 'AF')),
        nombre NVARCHAR(100) NOT NULL UNIQUE,
        descripcion NVARCHAR(500),
        cupo_maximo INT DEFAULT 30,
        activo BIT DEFAULT 1,
        fecha_creacion DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Tabla categorias_det_af creada';
END
ELSE
BEGIN
    PRINT '✅ Tabla categorias_det_af ya existe';
END

-- Verificar y crear tabla inscripciones_det_af
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones_det_af' AND xtype='U')
BEGIN
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
    );
    PRINT '✅ Tabla inscripciones_det_af creada';
END
ELSE
BEGIN
    PRINT '✅ Tabla inscripciones_det_af ya existe';
END

-- ================================================================
-- 3. INSERTAR CATEGORÍAS SI NO EXISTEN
-- ================================================================

-- Insertar categorías DET si no existen
IF NOT EXISTS (SELECT * FROM categorias_det_af WHERE tipo = 'DET')
BEGIN
    INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES
    ('DET', 'FOTOGRAFIA', 'Taller de fotografía digital y análoga, composición y técnicas avanzadas', 20),
    ('DET', 'DIBUJO', 'Técnicas de dibujo artístico, perspectiva y sombreado para arquitectos', 25),
    ('DET', 'MINDFULNESS', 'Práctica de atención plena, meditación y bienestar mental', 15),
    ('DET', 'ROBOTICA', 'Construcción y programación de robots educativos y competencia', 18),
    ('DET', 'GUITARRA', 'Clases de guitarra acústica y eléctrica, nivel principiante e intermedio', 12),
    ('DET', 'ENSAMBLE MUSICA', 'Grupo musical universitario, diversos instrumentos y géneros', 10);
    PRINT '✅ Categorías DET insertadas';
END
ELSE
BEGIN
    PRINT '✅ Categorías DET ya existen';
END

-- Insertar categorías AF si no existen
IF NOT EXISTS (SELECT * FROM categorias_det_af WHERE tipo = 'AF')
BEGIN
    INSERT INTO categorias_det_af (tipo, nombre, descripcion, cupo_maximo) VALUES
    ('AF', 'ATLETISMO', 'Entrenamiento de velocidad, resistencia y competencias atleticas', 30),
    ('AF', 'GIMNASIO', 'Entrenamiento con pesas, acondicionamiento físico general', 40),
    ('AF', 'FISICOCONSTRUCTIVISMO', 'Culturismo y desarrollo muscular especializado', 20),
    ('AF', 'BASQUET', 'Equipo representativo de basquetbol universitario', 16),
    ('AF', 'FUT RAPIDO', 'Futbol rápido 5v5, ligas internas y torneos', 25),
    ('AF', 'FUTBOL', 'Equipo representativo de futbol soccer universitario', 22),
    ('AF', 'TOCHO', 'Futbol americano sin contacto, banderas', 20),
    ('AF', 'AMERICANO', 'Futbol americano con equipo completo, competencia universitaria', 35);
    PRINT '✅ Categorías AF insertadas';
END
ELSE
BEGIN
    PRINT '✅ Categorías AF ya existen';
END

-- ================================================================
-- 4. CREAR VISTAS SI NO EXISTEN
-- ================================================================

-- Vista de categorías disponibles con cupos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='v_categorias_disponibles' AND xtype='V')
BEGIN
    EXEC('CREATE VIEW v_categorias_disponibles AS
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
    LEFT JOIN inscripciones_det_af i ON c.id = i.categoria_id AND i.estado = ''activa''
    WHERE c.activo = 1
    GROUP BY c.id, c.tipo, c.nombre, c.descripcion, c.cupo_maximo');
    PRINT '✅ Vista v_categorias_disponibles creada';
END
ELSE
BEGIN
    PRINT '✅ Vista v_categorias_disponibles ya existe';
END

-- Vista de inscripciones activas por usuario
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='v_inscripciones_usuario' AND xtype='V')
BEGIN
    EXEC('CREATE VIEW v_inscripciones_usuario AS
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
    WHERE i.estado = ''activa''');
    PRINT '✅ Vista v_inscripciones_usuario creada';
END
ELSE
BEGIN
    PRINT '✅ Vista v_inscripciones_usuario ya existe';
END

-- ================================================================
-- 5. CREAR PROCEDIMIENTOS ALMACENADOS CRÍTICOS
-- ================================================================

-- Verificar y crear procedimiento sp_inscribir_det_af
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sp_inscribir_det_af' AND xtype='P')
BEGIN
    EXEC('CREATE PROCEDURE sp_inscribir_det_af
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
            THROW 50001, ''Categoría no encontrada o inactiva'', 1;
        END
        
        -- Verificar si ya está inscrito en una categoría del mismo tipo
        SELECT @ya_inscrito = COUNT(*)
        FROM inscripciones_det_af 
        WHERE usuario_id = @usuario_id 
        AND tipo_categoria = @tipo_categoria 
        AND estado = ''activa'';
        
        IF @ya_inscrito > 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, ''Ya estás inscrito en una categoría de este tipo. Debes darte de baja primero.'', 1;
        END
        
        -- Verificar cupo disponible (CON LOCK para evitar condiciones de carrera)
        SELECT @inscritos_actuales = COUNT(*)
        FROM inscripciones_det_af WITH (TABLOCKX)
        WHERE categoria_id = @categoria_id AND estado = ''activa'';
        
        IF @inscritos_actuales >= @cupo_maximo
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, ''No hay cupo disponible en esta categoría'', 1;
        END
        
        -- Insertar inscripción
        INSERT INTO inscripciones_det_af (usuario_id, categoria_id, tipo_categoria, estado)
        VALUES (@usuario_id, @categoria_id, @tipo_categoria, ''activa'');
        
        COMMIT TRANSACTION;
        
        SELECT ''Inscripción exitosa'' as mensaje, SCOPE_IDENTITY() as inscripcion_id;
    END');
    PRINT '✅ Procedimiento sp_inscribir_det_af creado';
END
ELSE
BEGIN
    PRINT '✅ Procedimiento sp_inscribir_det_af ya existe';
END

-- Verificar y crear procedimiento sp_dar_baja_det_af
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sp_dar_baja_det_af' AND xtype='P')
BEGIN
    EXEC('CREATE PROCEDURE sp_dar_baja_det_af
        @usuario_id INT,
        @inscripcion_id INT
    AS
    BEGIN
        SET NOCOUNT ON;
        
        DECLARE @filas_afectadas INT;
        
        UPDATE inscripciones_det_af 
        SET estado = ''baja''
        WHERE id = @inscripcion_id 
        AND usuario_id = @usuario_id 
        AND estado = ''activa'';
        
        SET @filas_afectadas = @@ROWCOUNT;
        
        IF @filas_afectadas = 0
        BEGIN
            THROW 50004, ''Inscripción no encontrada o ya dada de baja'', 1;
        END
        
        SELECT ''Baja exitosa'' as mensaje, @filas_afectadas as filas_afectadas;
    END');
    PRINT '✅ Procedimiento sp_dar_baja_det_af creado';
END
ELSE
BEGIN
    PRINT '✅ Procedimiento sp_dar_baja_det_af ya existe';
END

-- ================================================================
-- 6. VERIFICAR USUARIO DE PRUEBA
-- ================================================================

-- Verificar que existe el usuario Mauro para pruebas
IF NOT EXISTS (SELECT * FROM usuarios WHERE matricula = '240088')
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
    VALUES (
        'Mauro Ortiz Juárez',
        '240088@lasallep.mx',
        '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu', -- password: 1234
        'estudiante',
        '240088',
        'Medicina',
        5,
        1
    );
    PRINT '✅ Usuario Mauro creado para pruebas';
END
ELSE
BEGIN
    PRINT '✅ Usuario Mauro ya existe';
END

-- ================================================================
-- 7. PRUEBAS FINALES
-- ================================================================

PRINT '';
PRINT '🧪 EJECUTANDO PRUEBAS FINALES...';

-- Verificar que las vistas funcionan
SELECT 'TOTAL CATEGORÍAS' as Prueba, COUNT(*) as Resultado FROM v_categorias_disponibles;
PRINT '✅ Vista v_categorias_disponibles funciona';

-- Verificar que los procedimientos existen
SELECT 'PROCEDIMIENTOS' as Prueba, COUNT(*) as Resultado 
FROM sysobjects 
WHERE name IN ('sp_inscribir_det_af', 'sp_dar_baja_det_af') AND xtype='P';
PRINT '✅ Procedimientos almacenados verificados';

PRINT '';
PRINT '🎉 ¡CORRECCIÓN COMPLETA!';
PRINT '';
PRINT '✅ Tablas DET/AF creadas y verificadas';
PRINT '✅ Procedimientos almacenados creados';
PRINT '✅ Vistas optimizadas creadas';
PRINT '✅ Categorías DET/AF insertadas';
PRINT '✅ Usuario de prueba verificado';
PRINT '';
PRINT '🚀 El sistema DET/AF debería funcionar ahora';
PRINT '   Prueba el frontend desde /inscripcion-det-af';
PRINT '';
