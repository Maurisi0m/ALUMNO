# Gestión de Usuarios SIGEA - SQL Server Management Studio

## Preparación Inicial

### Abrir SSMS
- **Buscar**: SQL Server Management Studio
- **Ejecutar**: Como Administrador
- **Conectar**: localhost, sa, Pollito92.

### Seleccionar Base de Datos
- **Expandir**: Databases
- **Seleccionar**: SIGEA_DB_LOCAL
- **Click derecho**: New Query

## Crear Nuevos Usuarios

### Campos Obligatorios
- **nombre**: Nombre completo del estudiante
- **email**: matricula@lasallep.mx
- **password**: Contraseña en texto plano
- **rol**: 'estudiante' (por defecto)
- **matricula**: 2***** (6 dígitos, inicia con 2)
- **area_estudios**: Medicina | Arquitectura | Administración
- **semestre**: 1-10
- **activo**: 1 (siempre activo)

### Script Básico

#### Estudiante de Medicina
```sql
INSERT INTO usuarios 
(nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES 
('María García López', '241234@lasallep.mx', '1234', 'estudiante', '241234', 'Medicina', 5, 1);
```

#### Estudiante de Arquitectura
```sql
INSERT INTO usuarios 
(nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES 
('Carlos Ruiz Hernández', '242567@lasallep.mx', '1234', 'estudiante', '242567', 'Arquitectura', 3, 1);
```

#### Estudiante de Administración
```sql
INSERT INTO usuarios 
(nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES 
('Ana Martínez Silva', '243891@lasallep.mx', '1234', 'estudiante', '243891', 'Administración', 7, 1);
```

## Verificación

### Consultar Usuarios Creados
```sql
SELECT 
    matricula, 
    nombre, 
    email, 
    area_estudios, 
    semestre, 
    activo 
FROM usuarios 
WHERE rol = 'estudiante'
ORDER BY matricula;
```

### Verificar Login
```sql
SELECT * FROM usuarios 
WHERE email = '241234@lasallep.mx' 
AND password = '1234';
```

## Reglas de Negocio

### Formato Matrícula
- **Patrón**: 2XXXXX
- **Longitud**: 6 dígitos
- **Ejemplos**: 240088, 241234, 242567

### Áreas de Estudio Válidas
- **Medicina**: Carreras médicas y afines
- **Arquitectura**: Diseño y construcción  
- **Administración**: Negocios y gestión

### Semestres
- **Rango**: 1 al 10
- **1-2**: Primer año
- **3-4**: Segundo año
- **5-6**: Tercer año
- **7-8**: Cuarto año
- **9-10**: Quinto año

## Validaciones

### Antes de Insertar
- **Email único**: No debe existir otro usuario con el mismo email
- **Matrícula única**: No debe existir otra matrícula igual
- **Área válida**: Solo Medicina, Arquitectura o Administración
- **Semestre válido**: Entre 1 y 10

### Script de Validación
```sql
-- Verificar email único
IF EXISTS (SELECT * FROM usuarios WHERE email = 'nuevo@lasallep.mx')
BEGIN
    PRINT 'ERROR: Email ya existe'
END
ELSE
BEGIN
    -- Insertar usuario aquí
    PRINT 'Usuario creado exitosamente'
END
```

## Mantenimiento

### Actualizar Usuario
```sql
UPDATE usuarios 
SET 
    semestre = 6,
    area_estudios = 'Medicina'
WHERE matricula = '241234';
```

### Desactivar Usuario
```sql
UPDATE usuarios 
SET activo = 0 
WHERE matricula = '241234';
```

### Cambiar Contraseña
```sql
UPDATE usuarios 
SET password = 'nueva_password' 
WHERE matricula = '241234';
```

## Reportes Útiles

### Usuarios por Área
```sql
SELECT 
    area_estudios,
    COUNT(*) as total_estudiantes
FROM usuarios 
WHERE rol = 'estudiante' AND activo = 1
GROUP BY area_estudios;
```

### Usuarios por Semestre
```sql
SELECT 
    semestre,
    COUNT(*) as total_estudiantes
FROM usuarios 
WHERE rol = 'estudiante' AND activo = 1
GROUP BY semestre
ORDER BY semestre;
```

### Listado Completo
```sql
SELECT 
    matricula,
    nombre,
    area_estudios + ' - ' + CAST(semestre AS VARCHAR) as carrera_semestre,
    email
FROM usuarios 
WHERE rol = 'estudiante' AND activo = 1
ORDER BY area_estudios, semestre, nombre;
```

## Notas Importantes

### Para Desarrollo
- **Contraseñas**: En texto plano (1234)
- **Validación**: Verificar siempre antes de insertar
- **Respaldo**: Hacer backup antes de cambios masivos

### Para Producción (Futuro)
- **Contraseñas**: Usar bcrypt hashing
- **Validaciones**: Implementar triggers
- **Auditoría**: Log de cambios
- **Seguridad**: Roles y permisos específicos
