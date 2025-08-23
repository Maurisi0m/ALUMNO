# Cómo Registrar Usuarios en SQL Server Management Studio (SSMS)

## Estructura de Usuario Requerida

Cada usuario debe tener:
- **Matrícula**: Empieza con 2***** (ej: 240088, 241234, 242567)
- **Email**: matricula@lasallep.mx (ej: 240088@lasallep.mx)
- **Área de Estudios**: Medicina, Arquitectura, o Administración
- **Semestre**: 1-10
- **Contraseña**: Encriptada (se puede usar "1234" para pruebas)

## Método 1: Usando SSMS (Interfaz Gráfica)

### 1. Abrir SSMS y conectar:
- Server: `localhost` o `localhost\SQLEXPRESS`
- Authentication: SQL Server Authentication
- Login: `sa`
- Password: `Pollito92.`

### 2. Navegar a la base de datos:
- Expandir "Databases"
- Expandir "SIGEA_DB_LOCAL"
- Expandir "Tables"
- Click derecho en "dbo.usuarios"
- Seleccionar "Edit Top 200 Rows"

### 3. Agregar nuevo usuario:
Llenar una nueva fila con estos datos:

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| nombre | María González | Nombre completo |
| email | 241234@lasallep.mx | Email con matrícula |
| password | $2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu | Hash de "1234" |
| rol | estudiante | Siempre "estudiante" |
| matricula | 241234 | Solo números |
| area_estudios | Medicina | Medicina/Arquitectura/Administración |
| semestre | 5 | Número de semestre |
| activo | 1 | Siempre 1 (activo) |

## Método 2: Usando Comandos SQL

### 1. En SSMS, abrir "New Query"

### 2. Ejecutar este comando para cada usuario:

```sql
USE SIGEA_DB_LOCAL;

-- Ejemplo: Estudiante de Medicina
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES (
    'María González López',           -- Nombre completo
    '241234@lasallep.mx',            -- Email con matrícula
    '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu', -- Password: 1234
    'estudiante',                     -- Rol
    '241234',                        -- Matrícula (solo números)
    'Medicina',                      -- Área de estudios
    5,                               -- Semestre
    1                                -- Activo
);
```

### 3. Más ejemplos de usuarios:

```sql
-- Estudiante de Administración
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES ('Carlos Ruiz Pérez', '242567@lasallep.mx', '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu', 'estudiante', '242567', 'Administración', 7, 1);

-- Estudiante de Arquitectura
INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo) 
VALUES ('Ana Martínez Silva', '243891@lasallep.mx', '$2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu', 'estudiante', '243891', 'Arquitectura', 2, 1);
```

## Hash de Contraseñas Comunes

Para facilitar las pruebas, aquí tienes los hashes más comunes:

| Contraseña | Hash |
|------------|------|
| 1234 | $2a$10$N9qo8uLOickgx2ZMRxqV0eOFLgHNz3F3Y8yF1G3qN8bWtk8CzRhKu |
| admin123 | $2a$10$rH8QgZjyJzE.KnG8pVnR2O8J5Z1Xa0v8aF3ZqH.9P7B6R4Y3M1Q8e |

## Verificar Usuarios Creados

```sql
-- Ver todos los usuarios
SELECT matricula, nombre, email, area_estudios, semestre, activo FROM usuarios WHERE rol = 'estudiante';

-- Verificar login de un usuario específico
SELECT * FROM usuarios WHERE email = '240088@lasallep.mx';
```

## Áreas de Estudio Válidas

- **Medicina**
- **Arquitectura** 
- **Administración**

## Formato de Matrícula

- Debe empezar con **2**
- Seguido de 5 dígitos más
- Ejemplos: 240088, 241234, 242567, 243891

## Notas Importantes

1. **Email único**: Cada email debe ser único en la base de datos
2. **Matrícula única**: Cada matrícula debe ser única  
3. **Contraseña**: Siempre usa el hash, nunca texto plano
4. **Semestre**: Número entre 1 y 10
5. **Activo**: Siempre 1 para usuarios activos
