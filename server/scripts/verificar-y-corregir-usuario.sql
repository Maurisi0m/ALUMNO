-- Script para verificar y corregir el usuario 240088@lasallep.mx
-- Ejecutar en SQL Server Management Studio (SSMS)

USE SIGEA_DB_LOCAL;
GO

PRINT '========================================================';
PRINT 'VERIFICACION Y CORRECCION USUARIO 240088@lasallep.mx';
PRINT '========================================================';

-- 1. Verificar si existe el usuario
PRINT '';
PRINT '1. VERIFICANDO SI EXISTE EL USUARIO...';

IF EXISTS (SELECT * FROM usuarios WHERE email = '240088@lasallep.mx')
BEGIN
    PRINT '✓ Usuario encontrado en la base de datos';
    
    SELECT 
        'USUARIO EXISTENTE' as Estado,
        id,
        nombre,
        email,
        password,
        rol,
        matricula,
        area_estudios,
        semestre,
        activo
    FROM usuarios 
    WHERE email = '240088@lasallep.mx';
END
ELSE
BEGIN
    PRINT '✗ Usuario NO encontrado - Creando usuario...';
    
    -- Crear el usuario si no existe
    INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
    VALUES ('Mauro Ortiz', '240088@lasallep.mx', '1234', 'estudiante', '240088', 'Arquitectura', 3, 1);
    
    PRINT '✓ Usuario creado exitosamente';
END

-- 2. Mostrar detalles del usuario
PRINT '';
PRINT '2. DETALLES ACTUALES DEL USUARIO:';

SELECT 
    'USUARIO ACTUAL' as Estado,
    id,
    nombre,
    email,
    password,
    rol,
    matricula,
    area_estudios,
    semestre,
    activo,
    fecha_creacion
FROM usuarios 
WHERE email = '240088@lasallep.mx';

-- 3. Verificar materias disponibles
PRINT '';
PRINT '3. VERIFICANDO MATERIAS PARA ARQUITECTURA 3ER SEMESTRE:';

SELECT 
    'MATERIAS DISPONIBLES' as Estado,
    COUNT(*) as Total_Materias
FROM materias 
WHERE area_estudios = 'Arquitectura' AND semestre = 3;

-- Mostrar las materias
SELECT 
    id,
    nombre,
    codigo,
    creditos,
    semestre,
    area_estudios
FROM materias 
WHERE area_estudios = 'Arquitectura' AND semestre = 3
ORDER BY nombre;

-- 4. Verificar calificaciones del usuario
PRINT '';
PRINT '4. VERIFICANDO CALIFICACIONES DEL USUARIO:';

DECLARE @usuario_id_verificacion INT;
SELECT @usuario_id_verificacion = id FROM usuarios WHERE email = '240088@lasallep.mx';

SELECT 
    'CALIFICACIONES USUARIO' as Estado,
    COUNT(*) as Total_Calificaciones
FROM calificaciones 
WHERE usuario_id = @usuario_id_verificacion;

-- 5. Si no hay calificaciones, crearlas
IF NOT EXISTS (SELECT * FROM calificaciones WHERE usuario_id = @usuario_id_verificacion)
BEGIN
    PRINT '';
    PRINT '5. NO HAY CALIFICACIONES - CREANDO CALIFICACIONES...';
    
    -- Verificar que existen las materias primero
    IF EXISTS (SELECT * FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3)
    BEGIN
        -- Insertar calificaciones para cada materia
        DECLARE @materia_id INT;
        
        -- BIOLOGIA I
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-BIO';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 85.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 78.5, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 82.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 88.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 86.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 83.5, 'calificacion_final', 100.00);
        END
        
        -- FISICA I
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-FIS';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 75.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 80.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 85.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 78.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 82.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 79.5, 'calificacion_final', 100.00);
        END
        
        -- FORMACION EN VALORES III
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-VAL';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 95.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 92.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 90.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 96.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 94.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 93.5, 'calificacion_final', 100.00);
        END
        
        -- Continuar con todas las materias...
        -- GEOMETRIA DESCRIPTIVA
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-GEO';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 80.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 85.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 78.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 87.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 83.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 82.0, 'calificacion_final', 100.00);
        END
        
        -- HISTORIA DE MEXICO II
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-HIS';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 88.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 85.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 90.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 92.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 89.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 88.5, 'calificacion_final', 100.00);
        END
        
        -- INTRODUCCION AL DIBUJO
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-DIB';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 92.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 89.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 85.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 95.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 91.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 90.5, 'calificacion_final', 100.00);
        END
        
        -- LITERATURA I
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-LIT';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 86.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 88.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 84.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 90.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 87.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 87.0, 'calificacion_final', 100.00);
        END
        
        -- MATEMATICAS III
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-MAT';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 78.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 82.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 85.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 80.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 83.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 81.5, 'calificacion_final', 100.00);
        END
        
        -- SELECTIVO ACTIVACION AL AIRE LIBRE
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ACT';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 95.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 93.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 90.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 98.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 96.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 94.5, 'calificacion_final', 100.00);
        END
        
        -- INGLES III
        SELECT @materia_id = id FROM materias WHERE codigo = 'ARQ301-ING';
        IF @materia_id IS NOT NULL
        BEGIN
            INSERT INTO calificaciones (usuario_id, materia_id, calificacion, tipo_evaluacion, porcentaje) VALUES 
            (@usuario_id_verificacion, @materia_id, 84.0, 'primer_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 87.0, 'segundo_parcial', 30.00),
            (@usuario_id_verificacion, @materia_id, 89.0, 'ordinario', 15.00),
            (@usuario_id_verificacion, @materia_id, 85.0, 'proyecto', 15.00),
            (@usuario_id_verificacion, @materia_id, 86.0, 'examenes_semanales', 10.00),
            (@usuario_id_verificacion, @materia_id, 86.0, 'calificacion_final', 100.00);
        END
        
        PRINT '✓ Calificaciones creadas para todas las materias disponibles';
    END
    ELSE
    BEGIN
        PRINT '✗ No se encontraron materias de Arquitectura 3er semestre';
        PRINT '  Ejecuta primero el script: setup-arquitectura-lasallep.sql';
    END
END
ELSE
BEGIN
    PRINT '';
    PRINT '5. ✓ YA EXISTEN CALIFICACIONES PARA EL USUARIO';
END

-- 6. Verificacion final
PRINT '';
PRINT '6. VERIFICACION FINAL:';

-- Contar registros
SELECT 'RESUMEN FINAL' as Seccion, 'Usuario' as Tipo, COUNT(*) as Cantidad
FROM usuarios WHERE email = '240088@lasallep.mx'

UNION ALL

SELECT 'RESUMEN FINAL', 'Materias Arquitectura 3er', COUNT(*)
FROM materias WHERE area_estudios = 'Arquitectura' AND semestre = 3

UNION ALL

SELECT 'RESUMEN FINAL', 'Calificaciones Usuario', COUNT(*)
FROM calificaciones c
INNER JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = '240088@lasallep.mx';

-- Test de login simulado
PRINT '';
PRINT '7. TEST DE LOGIN SIMULADO:';

DECLARE @test_email NVARCHAR(150) = '240088@lasallep.mx';
DECLARE @test_password NVARCHAR(50) = '1234';

IF EXISTS (
    SELECT * FROM usuarios 
    WHERE email = @test_email 
    AND password = @test_password
    AND activo = 1
)
BEGIN
    PRINT '✓ TEST LOGIN: EXITOSO';
    PRINT '✓ El usuario puede hacer login correctamente';
    
    -- Mostrar ID del usuario para referencia
    DECLARE @user_id INT;
    SELECT @user_id = id FROM usuarios WHERE email = @test_email;
    PRINT '✓ ID del usuario: ' + CAST(@user_id AS NVARCHAR(10));
END
ELSE
BEGIN
    PRINT '✗ TEST LOGIN: FALLIDO';
    PRINT '✗ Revisar credenciales o configuración';
END

PRINT '';
PRINT '========================================================';
PRINT 'CREDENCIALES CONFIRMADAS:';
PRINT 'Email: 240088@lasallep.mx';
PRINT 'Password: 1234';
PRINT 'Nombre: Mauro Ortiz';
PRINT 'Area: Arquitectura - 3er Semestre';
PRINT '========================================================';
PRINT 'VERIFICACION Y CORRECCION COMPLETADA';
PRINT '========================================================';
