# SIGEA - Sistema de Gestión Escolar Académico

## Descripción General

Este proyecto está diseñado para la gestión escolar, permitiendo la administración eficiente de estudiantes, docentes, cursos, calificaciones y procesos académicos en tiempo real. Todo esto con la finalidad de brindar un nuevo diseño de la web de La salle SIGEA. En este Readme.md encontrará las instrucciones para la instalación y configuración del proyecto, asi como información detalla de como modificar, agregar o eliminar funcionalidades. 


## Arquitectura del Proyecto

### Estructura de Directorios

```
SIGEA/
├── client/                    # Frontend React
│   ├── components/           # Componentes reutilizables
│   │   └── ui/              # Componentes de UI (shadcn/ui)
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilidades y helpers
│   ├── pages/               # Páginas principales
│   ├── services/            # Servicios de API
│   └── global.css           # Estilos globales
├── server/                   # Backend Node.js
│   ├── config/              # Configuraciones
│   │   └── database.ts      # Configuración SQL Server
│   ├── routes/              # Rutas de API
│   ├── services/            # Lógica de negocio
│   └── scripts/             # Scripts SQL
├── netlify/                 # Configuración Netlify
├── public/                  # Assets públicos
├── server/                  # Build del servidor
└── shared/                  # Tipos y utilidades compartidas
```

## Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **React Router DOM** para navegación
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes de UI
- **React Hook Form** para formularios
- **Axios** para peticiones HTTP

### Backend
- **Node.js** con Express
- **TypeScript**
- **SQL Server** con mssql
- **JWT** para autenticación
- **bcryptjs** para encriptación (actualmente deshabilitado por compatibilidad)
- **Zod** para validación

### Herramientas de Desarrollo
- **Vite** como bundler
- **Vitest** para testing
- **Prettier** para formateo
- **ESLint** para linting

## Páginas del Cliente

### Páginas Principales

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Index** | `/` | Página principal con dashboard |
| **Login** | `/login` | Autenticación de usuarios |
| **Dashboard** | `/dashboard` | Panel principal del sistema |
| **GradeManagement** | `/grades` | Gestión de calificaciones |
| **TeacherClasses** | `/teacher/classes` | Clases asignadas al docente |
| **Manual** | `/manual` | Guía de usuario |
| **NotFound** | `*` | Página 404 personalizada |

### Componentes de UI

El sistema utiliza componentes de **shadcn/ui** que incluyen:
- **Formularios**: Input, Select, Checkbox, Radio buttons
- **Navegación**: Sidebar, Navigation menu, Breadcrumb
- **Tablas**: Data tables con paginación y filtros
- **Modales**: Dialog, Alert dialog, Sheet
- **Gráficos**: Charts para visualización de datos
- **Notificaciones**: Toast, Alert, Sonner

## Cómo Modificar el Proyecto

### Modificar Páginas

1. **Agregar nueva página**:
   ```bash
   # Crear archivo en client/pages/
   touch client/pages/NewPage.tsx
   ```

2. **Estructura básica de una página**:
   ```typescript
   import React from 'react';
   import { useAuth } from '@/hooks/use-auth';

   const NewPage: React.FC = () => {
     const { user } = useAuth();
     
     return (
       <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold">Nueva Página</h1>
         {/* Contenido */}
       </div>
     );
   };

   export default NewPage;
   ```

3. **Agregar ruta**:
   ```typescript
   // En el archivo de rutas principal
   import NewPage from '@/pages/NewPage';
   
   // Agregar a las rutas
   { path: '/new-page', element: <NewPage /> }
   ```

### Modificar Componentes

1. **Componentes UI** están en `client/components/ui/`
2. **Custom hooks** están en `client/hooks/`
3. **Servicios** están en `client/services/`

### Modificar Estilos

- **Tailwind CSS**: Modificar `tailwind.config.ts`
- **Estilos globales**: Modificar `client/global.css`
- **Variables CSS**: Usar CSS custom properties

## Conexión SQL Server

### Configuración de Base de Datos

#### Archivo de Configuración
```typescript
// server/config/database.ts
const config: sql.config = {
  server: process.env.SQL_SERVER || 'localhost',
  database: process.env.SQL_DATABASE || 'SIGEA_DB_LOCAL',
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || 'Pollito92.',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};
```

#### Variables de Entorno (.env)
```bash
# Database Configuration
SQL_SERVER=localhost
SQL_DATABASE=SIGEA_DB_LOCAL
SQL_USER=sa
SQL_PASSWORD=Pollito92.
SQL_PORT=1433
```

### Estructura de la Base de Datos

#### Tablas Principales
- **usuarios**: Información de usuarios del sistema
- **estudiantes**: Datos de estudiantes
- **docentes**: Información de docentes
- **cursos**: Catálogo de cursos
- **calificaciones**: Registro de calificaciones
- **asistencias**: Control de asistencia

#### Scripts SQL
Los scripts de inicialización están en:
- `server/scripts/init-local-db.sql` - Script completo de inicialización
- `server/scripts/simple-setup.sql` - Setup básico
- `server/scripts/update-db-structure.sql` - Actualizaciones de estructura

## Habilitar Puerto 1433

### Configuración Local

#### 1. Habilitar en SQL Server Configuration Manager

1. **Abrir SQL Server Configuration Manager**
   - Buscar "SQL Server Configuration Manager" en el menú inicio
   - O ejecutar: `SQLServerManager15.msc` (para SQL Server 2019)

2. **Configurar TCP/IP**:
   ```
   SQL Server Network Configuration → Protocols for SQLEXPRESS → TCP/IP
   ```
   - Click derecho → Properties
   - Tab "Protocol": Enable = Yes
   - Tab "IP Addresses":
     - IPAll → TCP Port = 1433
     - IP1 → Active = Yes, Enabled = Yes

3. **Reiniciar servicio**:
   ```
   SQL Server Services → SQL Server (SQLEXPRESS) → Restart
   ```

#### 2. Configurar Windows Firewall

```powershell
# Abrir PowerShell como administrador
New-NetFirewallRule -DisplayName "SQL Server" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow
```

#### 3. Verificar conexión

```bash
# Desde CMD
telnet localhost 1433

# O usando sqlcmd
sqlcmd -S localhost,1433 -U sa -P Pollito92. -Q "SELECT @@VERSION"
```

### Configuración Externa

#### 1. Configurar IP Externa

```typescript
// Actualizar .env
SQL_SERVER=192.168.1.100  // Tu IP local
// o
SQL_SERVER=tu-dominio.com  // Dominio externo
```

#### 2. Configurar Router

1. **Port Forwarding**:
   - Abrir puerto 1433 en el router
   - Redirigir al IP local del servidor SQL

2. **Configuración típica**:
   ```
   External Port: 1433
   Internal Port: 1433
   Internal IP: 192.168.1.XXX (IP del servidor)
   Protocol: TCP
   ```

#### 3. Seguridad Externa

```sql
-- Crear usuario específico para conexión externa
CREATE LOGIN [sigea_external] WITH PASSWORD = 'SecurePassword123!';
CREATE USER [sigea_external] FOR LOGIN [sigea_external];
-- Asignar permisos específicos
```

### Solución de Problemas de Conexión

#### Error Comunes y Soluciones

1. **"Cannot connect to server"**:
   ```bash
   # Verificar servicio
   net start MSSQLSERVER
   # o
   net start MSSQL$SQLEXPRESS
   ```

2. **"Login failed for user"**:
   ```sql
   -- Verificar usuario
   SELECT name, is_disabled FROM sys.sql_logins WHERE name = 'sa';
   -- Habilitar si está deshabilitado
   ALTER LOGIN sa ENABLE;
   ```

3. **"Server not found"**:
   - Verificar nombre del servidor
   - Probar con `localhost\SQLEXPRESS`
   - Verificar puerto en configuración

## Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- SQL Server Express
- Git

### Instalación Local

1. **Clonar repositorio**:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd SIGEA
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Configurar base de datos**:
   ```bash
   # Ejecutar script de inicialización
   npm run db:init
   ```

5. **Iniciar desarrollo**:
   ```bash
   npm run dev
   ```

### Build para Producción

```bash
# Build completo
npm run build

# Iniciar servidor de producción
npm start / npm run dev
```        

## Endpoints de API

### Autenticación
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/logout` - Cierre de sesión

### Estudiantes
- `GET /api/students` - Listar estudiantes
- `POST /api/students` - Crear estudiante
- `PUT /api/students/:id` - Actualizar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante

### Calificaciones
- `GET /api/grades` - Listar calificaciones
- `POST /api/grades` - Registrar calificación
- `PUT /api/grades/:id` - Actualizar calificación

### Profesores
- `GET /api/teachers` - Listar docentes
- `GET /api/teachers/:id/classes` - Clases del docente

## Testing

### Tests de Base de Datos
```bash
# Probar conexión
node test-db-connection.js

# Verificar estructura
node test-mssqlserver-correct.js
```

### Tests de API
```bash
# Ejecutar todos los tests
npm test

# Tests específicos
npm run test:db
npm run test:auth
```

## Solución de Problemas

### Problemas Comunes

1. **Puerto 1433 bloqueado**:
   - Verificar firewall
   - Verificar configuración de SQL Server

2. **Error de conexión a base de datos**:
   - Verificar credenciales en .env
   - Verificar que SQL Server esté ejecutándose
   - Verificar puerto y configuración TCP/IP

3. **Error de CORS**:
   - Verificar configuración en server/index.ts
   - Asegurar que el frontend apunte al backend correcto

### Logs y Debugging

- **Frontend**: Abrir DevTools (F12) → Console
- **Backend**: Verificar terminal donde se ejecuta `npm run dev`
- **SQL Server**: Verificar SQL Server Management Studio → Logs

## Soporte

Para alguna consulta:
- **Email**: dedbensec@gmail.com
- **Documentación**: Ver `GUIA-USUARIOS-SSMS-MARKMAP.md`
- **Issues**: Crear issue en el repositorio


**Proyecto desarrollado con esfuerzo y cariño por: Mauro Ortiz Juárez**
