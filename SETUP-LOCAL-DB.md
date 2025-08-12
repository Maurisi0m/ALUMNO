# Configuración de Base de Datos SQL Server Local

## Requisitos Previos

Para usar la aplicación con una base de datos SQL Server local en Windows 11, necesitas:

### 1. Instalar SQL Server Express (Gratis)

1. Descarga **SQL Server Express** desde: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Selecciona "Express" y descarga
3. Durante la instalación:
   - Selecciona "Instalación personalizada"
   - Asegúrate de habilitar "SQL Server Database Engine"
   - Configura la autenticación como "Modo mixto" (Windows + SQL Server)
   - Establece una contraseña para el usuario `sa` (usa la misma que está en .env: `Pollito92.`)

### 2. Instalar SQL Server Management Studio (SSMS) - Opcional pero Recomendado

1. Descarga SSMS desde: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
2. Instala siguiendo las instrucciones

## Configuración de la Base de Datos

### Opción 1: Usando SQL Server Management Studio (SSMS)

1. Abre SSMS
2. Conecta con:

   - Server name: `localhost` o `localhost\\SQLEXPRESS`
   - Authentication: SQL Server Authentication
   - Login: `sa`
   - Password: `Pollito92.`

3. Abre el archivo `server/scripts/init-local-db.sql` y ejecútalo

### Opción 2: Usando Command Line (sqlcmd)

```bash
# Conectar y ejecutar el script
sqlcmd -S localhost -U sa -P "Pollito92." -i server/scripts/init-local-db.sql
```

## Verificación

1. Inicia la aplicación con `npm run dev`
2. Ve a http://localhost:8080
3. Prueba el endpoint de base de datos: http://localhost:8080/api/test-db
4. Deberías ver: `{"message":"Conexión a base de datos exitosa"}`

## Usuarios de Prueba

Después de ejecutar el script de inicialización, tendrás estos usuarios:

- **Administrador:**

  - Email: `admin@lasalle.edu.mx`
  - Password: `admin123`

- **Estudiante:**
  - Email: `estudiante@lasalle.edu.mx`
  - Password: `admin123`

## Configuración Actual

La aplicación está configurada para conectarse a:

- **Servidor:** `localhost`
- **Base de datos:** `SIGEA_DB_LOCAL`
- **Puerto:** `1433`
- **Usuario:** `sa`
- **Password:** `Pollito92.`

## Solución de Problemas

### Error de Conexión

- Verifica que SQL Server esté ejecutándose en Servicios de Windows
- Busca "SQL Server (SQLEXPRESS)" en Servicios
- Asegúrate de que esté iniciado

### Puerto 1433 Bloqueado

- Abre Windows Firewall
- Permite la aplicación "SQL Server"
- O crea una regla para el puerto 1433

### Autenticación

- Verifica que el modo mixto esté habilitado
- Confirma que el usuario `sa` esté habilitado
- Verifica la contraseña

## Comandos Útiles

```sql
-- Verificar conexión
SELECT @@SERVERNAME as ServerName, DB_NAME() as DatabaseName;

-- Ver tablas creadas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Ver usuarios
SELECT id, nombre, email, rol FROM usuarios;
```
