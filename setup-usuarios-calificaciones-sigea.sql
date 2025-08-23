-- ================================================================
-- SCRIPT DE CONFIGURACIÓN COMPLETA SIGEA_DB_LOCAL
-- Sistema de usuarios con matriculas y calificaciones individuales
-- Universidad La Salle Pachuca - Arquitectura 3er Semestre
-- ================================================================

USE SIGEA_DB_LOCAL;
GO

-- ================================================================
-- 1. CREAR/VERIFICAR ESTRUCTURA DE TABLAS
-- ================================================================

-- Tabla de usuarios
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        matricula NVARCHAR(20) UNIQUE NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        apellido_paterno NVARCHAR(50) NOT NULL,
        apellido_materno NVARCHAR(50),
        email NVARCHAR(100) UNIQUE NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        semestre INT DEFAULT 3,
        area_estudios NVARCHAR(50) DEFAULT 'Arquitectura',
        telefono NVARCHAR(15),
        fecha_nacimiento DATE,
        direccion NVARCHAR(200),
        estatus NVARCHAR(20) DEFAULT 'Activo',
        fecha_ingreso DATE DEFAULT GETDATE(),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Tabla usuarios creada';
END
ELSE
    PRINT '✅ Tabla usuarios ya existe';

-- Tabla de materias
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='materias' AND xtype='U')
BEGIN
    CREATE TABLE materias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo NVARCHAR(20) UNIQUE NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        creditos INT DEFAULT 3,
        semestre INT DEFAULT 3,
        area_estudios NVARCHAR(50) DEFAULT 'Arquitectura',
        activo BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Tabla materias creada';
END
ELSE
    PRINT '✅ Tabla materias ya existe';

-- Tabla de tipos de evaluación
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tipos_evaluacion' AND xtype='U')
BEGIN
    CREATE TABLE tipos_evaluacion (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(50) UNIQUE NOT NULL,
        codigo NVARCHAR(30) UNIQUE NOT NULL,
        porcentaje_default DECIMAL(5,2) DEFAULT 20.00,
        activo BIT DEFAULT 1
    );
    PRINT '✅ Tabla tipos_evaluacion creada';
END
ELSE
    PRINT '✅ Tabla tipos_evaluacion ya existe';

-- Tabla de calificaciones
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='calificaciones' AND xtype='U')
BEGIN
    CREATE TABLE calificaciones (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        materia_id INT NOT NULL,
        tipo_evaluacion_id INT NOT NULL,
        calificacion DECIMAL(5,2) NOT NULL,
        porcentaje DECIMAL(5,2) NOT NULL,
        observaciones NVARCHAR(500),
        fecha_registro DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (materia_id) REFERENCES materias(id),
        FOREIGN KEY (tipo_evaluacion_id) REFERENCES tipos_evaluacion(id),
        UNIQUE(usuario_id, materia_id, tipo_evaluacion_id)
    );
    PRINT '✅ Tabla calificaciones creada';
END
ELSE
    PRINT '✅ Tabla calificaciones ya existe';

-- ================================================================
-- 2. LIMPIAR DATOS EXISTENTES (OPCIONAL - DESCOMENTA SI NECESITAS)
-- ================================================================
-- DELETE FROM calificaciones;
-- DELETE FROM usuarios WHERE matricula LIKE '240%';
-- DELETE FROM materias WHERE semestre = 3;
-- DELETE FROM tipos_evaluacion;

-- ================================================================
-- 3. INSERTAR TIPOS DE EVALUACIÓN
-- ================================================================

INSERT INTO tipos_evaluacion (nombre, codigo, porcentaje_default) VALUES
('Primer Parcial', 'primer_parcial', 20.00),
('Segundo Parcial', 'segundo_parcial', 20.00),
('Ordinario', 'ordinario', 30.00),
('Proyecto', 'proyecto', 15.00),
('Exámenes Semanales', 'examenes_semanales', 10.00),
('Calificación Final', 'calificacion_final', 5.00);

PRINT '✅ Tipos de evaluación insertados';

-- ================================================================
-- 4. INSERTAR MATERIAS DE ARQUITECTURA 3ER SEMESTRE
-- ================================================================

INSERT INTO materias (codigo, nombre, creditos, semestre, area_estudios) VALUES
('ARQ301-BIO', 'BIOLOGÍA I', 4, 3, 'Arquitectura'),
('ARQ301', 'DISEÑO ARQUITECTÓNICO I', 6, 3, 'Arquitectura'),
('ARQ302-CONST', 'CONSTRUCCIÓN I', 5, 3, 'Arquitectura'),
('ARQ303-INST', 'INSTALACIONES', 4, 3, 'Arquitectura'),
('ARQ304-MAT', 'MATEMÁTICAS III', 4, 3, 'Arquitectura'),
('ARQ305-HIST', 'HISTORIA DE LA ARQUITECTURA', 3, 3, 'Arquitectura'),
('ARQ306-TEC', 'TECNOLOGÍA DE MATERIALES', 3, 3, 'Arquitectura'),
('ARQ307-URB', 'INTRODUCCIÓN AL URBANISMO', 4, 3, 'Arquitectura');

PRINT '✅ Materias de Arquitectura 3er semestre insertadas';

-- ================================================================
-- 5. CREAR USUARIOS DE EJEMPLO CON MATRICULAS Y CONTRASEÑAS
-- ================================================================

-- Contraseña por defecto: "password123" (en texto plano para desarrollo)
-- En producción debería usar bcrypt

INSERT INTO usuarios (matricula, nombre, apellido_paterno, apellido_materno, email, password_hash, semestre, area_estudios, telefono, fecha_nacimiento, direccion) VALUES
('240001', 'Carlos', 'González', 'Martínez', '240001@lasallep.mx', 'password123', 3, 'Arquitectura', '5551234567', '2003-05-15', 'Av. Universidad 123, Pachuca'),
('240002', 'María', 'López', 'Hernández', '240002@lasallep.mx', 'password123', 3, 'Arquitectura', '5557654321', '2003-08-22', 'Calle Reforma 456, Pachuca'),
('240003', 'Juan', 'Pérez', 'García', '240003@lasallep.mx', 'password123', 3, 'Arquitectura', '5559876543', '2003-02-10', 'Av. Juárez 789, Pachuca'),
('240004', 'Ana', 'Rodríguez', 'Torres', '240004@lasallep.mx', 'password123', 3, 'Arquitectura', '5556543210', '2003-11-30', 'Calle Hidalgo 321, Pachuca'),
('240005', 'Luis', 'Martínez', 'Sánchez', '240005@lasallep.mx', 'password123', 3, 'Arquitectura', '5558765432', '2003-07-18', 'Av. Revolución 654, Pachuca'),
('240006', 'Sofía', 'Hernández', 'Cruz', '240006@lasallep.mx', 'password123', 3, 'Arquitectura', '5554321098', '2003-04-25', 'Calle Morelos 987, Pachuca'),
('240007', 'Diego', 'García', 'Flores', '240007@lasallep.mx', 'password123', 3, 'Arquitectura', '5552109876', '2003-09-12', 'Av. Independencia 147, Pachuca'),
('240008', 'Valeria', 'Torres', 'Mendoza', '240008@lasallep.mx', 'password123', 3, 'Arquitectura', '5556789012', '2003-01-08', 'Calle Allende 258, Pachuca'),
('240009', 'Alejandro', 'Sánchez', 'Ramírez', '240009@lasallep.mx', 'password123', 3, 'Arquitectura', '5553456789', '2003-06-14', 'Av. Madero 369, Pachuca'),
('240010', 'Isabella', 'Cruz', 'Vargas', '240010@lasallep.mx', 'password123', 3, 'Arquitectura', '5559012345', '2003-12-03', 'Calle Guerrero 741, Pachuca'),
('240088', 'Mauro', 'Ortiz', 'Juárez', '240088@lasallep.mx', 'password123', 3, 'Arquitectura', '5555551234', '2003-03-15', 'Calle Principal 123, Pachuca');

PRINT '✅ 11 usuarios de ejemplo creados (incluyendo 240088)';

-- ================================================================
-- 6. GENERAR CALIFICACIONES ALEATORIAS PARA CADA USUARIO
-- ================================================================

-- Variables para el loop
DECLARE @usuario_id INT;
DECLARE @materia_id INT;
DECLARE @tipo_id INT;
DECLARE @calificacion DECIMAL(5,2);
DECLARE @porcentaje DECIMAL(5,2);

-- Cursor para recorrer usuarios
DECLARE usuario_cursor CURSOR FOR 
SELECT id FROM usuarios WHERE matricula LIKE '240%';

OPEN usuario_cursor;
FETCH NEXT FROM usuario_cursor INTO @usuario_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Para cada materia de 3er semestre
    DECLARE materia_cursor CURSOR FOR 
    SELECT id FROM materias WHERE semestre = 3 AND area_estudios = 'Arquitectura';
    
    OPEN materia_cursor;
    FETCH NEXT FROM materia_cursor INTO @materia_id;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Generar calificaciones para cada tipo de evaluación
        
        -- Primer Parcial (20%)
        SET @calificacion = ROUND(70 + (RAND() * 30), 1); -- Entre 70 y 100
        INSERT INTO calificaciones (usuario_id, materia_id, tipo_evaluacion_id, calificacion, porcentaje)
        VALUES (@usuario_id, @materia_id, 1, @calificacion, 20.00);
        
        -- Segundo Parcial (20%)
        SET @calificacion = ROUND(70 + (RAND() * 30), 1);
        INSERT INTO calificaciones (usuario_id, materia_id, tipo_evaluacion_id, calificacion, porcentaje)
        VALUES (@usuario_id, @materia_id, 2, @calificacion, 20.00);
        
        -- Ordinario (30%)
        SET @calificacion = ROUND(70 + (RAND() * 30), 1);
        INSERT INTO calificaciones (usuario_id, materia_id, tipo_evaluacion_id, calificacion, porcentaje)
        VALUES (@usuario_id, @materia_id, 3, @calificacion, 30.00);
        
        -- Proyecto (15%)
        SET @calificacion = ROUND(75 + (RAND() * 25), 1);
        INSERT INTO calificaciones (usuario_id, materia_id, tipo_evaluacion_id, calificacion, porcentaje)
        VALUES (@usuario_id, @materia_id, 4, @calificacion, 15.00);
        
        -- Exámenes Semanales (10%)
        SET @calificacion = ROUND(70 + (RAND() * 30), 1);
        INSERT INTO calificaciones (usuario_id, materia_id, tipo_evaluacion_id, calificacion, porcentaje)
        VALUES (@usuario_id, @materia_id, 5, @calificacion, 10.00);
        
        -- Calificación Final (5% - calculada como promedio ponderado)
        DECLARE @final DECIMAL(5,2);
        SELECT @final = 
            (SUM(calificacion * porcentaje) / SUM(porcentaje))
        FROM calificaciones c
        INNER JOIN tipos_evaluacion te ON c.tipo_evaluacion_id = te.id
        WHERE c.usuario_id = @usuario_id 
        AND c.materia_id = @materia_id 
        AND te.codigo != 'calificacion_final';
        
        INSERT INTO calificaciones (usuario_id, materia_id, tipo_evaluacion_id, calificacion, porcentaje)
        VALUES (@usuario_id, @materia_id, 6, @final, 5.00);
        
        FETCH NEXT FROM materia_cursor INTO @materia_id;
    END;
    
    CLOSE materia_cursor;
    DEALLOCATE materia_cursor;
    
    FETCH NEXT FROM usuario_cursor INTO @usuario_id;
END;

CLOSE usuario_cursor;
DEALLOCATE usuario_cursor;

PRINT '✅ Calificaciones generadas para todos los usuarios';

-- ================================================================
-- 7. VISTA PARA CONSULTAR CALIFICACIONES POR USUARIO
-- ================================================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'vista_calificaciones_usuario')
    DROP VIEW vista_calificaciones_usuario;
GO

CREATE VIEW vista_calificaciones_usuario AS
SELECT 
    u.matricula,
    u.nombre + ' ' + u.apellido_paterno + ' ' + ISNULL(u.apellido_materno, '') AS nombre_completo,
    u.semestre,
    u.area_estudios,
    m.codigo AS codigo_materia,
    m.nombre AS nombre_materia,
    m.creditos,
    te.nombre AS tipo_evaluacion,
    te.codigo AS codigo_evaluacion,
    c.calificacion,
    c.porcentaje,
    c.fecha_registro
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
INNER JOIN materias m ON c.materia_id = m.id
INNER JOIN tipos_evaluacion te ON c.tipo_evaluacion_id = te.id;
GO

PRINT '✅ Vista vista_calificaciones_usuario creada';

-- ================================================================
-- 8. PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ================================================================

-- Procedimiento para obtener calificaciones de un usuario
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_obtener_calificaciones_usuario')
    DROP PROCEDURE sp_obtener_calificaciones_usuario;
GO

CREATE PROCEDURE sp_obtener_calificaciones_usuario
    @matricula NVARCHAR(20)
AS
BEGIN
    SELECT 
        m.codigo,
        m.nombre AS materia,
        m.creditos,
        te.codigo AS tipo,
        c.calificacion,
        c.porcentaje
    FROM calificaciones c
    INNER JOIN usuarios u ON c.usuario_id = u.id
    INNER JOIN materias m ON c.materia_id = m.id
    INNER JOIN tipos_evaluacion te ON c.tipo_evaluacion_id = te.id
    WHERE u.matricula = @matricula
    ORDER BY m.codigo, te.id;
END;
GO

PRINT '✅ Procedimiento sp_obtener_calificaciones_usuario creado';

-- ================================================================
-- 9. CONSULTAS DE VERIFICACIÓN Y EJEMPLOS
-- ================================================================

PRINT '✅ CONFIGURACIÓN COMPLETADA - RESUMEN:';
PRINT '==========================================';

-- Contar usuarios creados
SELECT 'Total de usuarios: ' + CAST(COUNT(*) AS NVARCHAR(10)) AS info
FROM usuarios WHERE matricula LIKE '240%';

-- Contar materias
SELECT 'Total de materias: ' + CAST(COUNT(*) AS NVARCHAR(10)) AS info
FROM materias WHERE semestre = 3;

-- Contar calificaciones
SELECT 'Total de calificaciones: ' + CAST(COUNT(*) AS NVARCHAR(10)) AS info
FROM calificaciones;

PRINT '';
PRINT '✅ USUARIOS DE PRUEBA CREADOS:';
PRINT '==============================';
SELECT 
    matricula,
    nombre + ' ' + apellido_paterno AS nombre_completo,
    email,
    'password123' AS password
FROM usuarios 
WHERE matricula LIKE '240%'
ORDER BY matricula;

PRINT '';
PRINT '✅ PARA PROBAR EL LOGIN USA:';
PRINT '=============================';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Contraseña: password123';
PRINT '';
PRINT 'O cualquier otro usuario de 240001 a 240010';
PRINT 'Todos tienen la contraseña: password123';

PRINT '';
PRINT '✅ CONSULTA DE EJEMPLO - Calificaciones de 240088:';
PRINT '===================================================';
EXEC sp_obtener_calificaciones_usuario '240088';

PRINT '';
PRINT '🎉 ¡CONFIGURACIÓN COMPLETA!';
PRINT 'La base de datos SIGEA_DB_LOCAL está lista para usar.';
