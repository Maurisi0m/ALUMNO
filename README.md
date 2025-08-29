# CAMBIOS RECIENTES - SIGEA

## Última actualización: Agosto 2025

**Sistema completamente nuevo desde cero**

#### **Base de Datos Renovada**
- **14 categorías nuevas** disponibles:
  - **DET (Desarrollo Estudiantil)**: Fotografía, Dibujo, Mindfulness, Robótica, Guitarra, Ensamble Musical
  - **AF (Actividades Físicas)**: Atletismo, Gimnasio, Fisioconstructivismo, Básquet, Fútbol Rápido, Fútbol, Tocho, Americano
- **Control de cupos en tiempo real** con locks y transacciones
- **Procedimientos almacenados seguros** (`sp_inscribir_det_af`, `sp_dar_baja_det_af`)
- **Constraints únicos** garantizan 1 DET + 1 AF máximo por usuario

#### **Backend Modernizado**
- **Nuevo servicio**: `server/services/detAfService.ts` con validaciones robustas
- **Rutas RESTful**: `server/routes/detAf.ts` con autenticación JWT mejorada
- **8 endpoints nuevos**:
  ```
  GET    /api/detaf/categories              # Categorías disponibles
  GET    /api/detaf/stats                   # Estadísticas generales
  GET    /api/detaf/my-inscriptions         # Mis inscripciones
  GET    /api/detaf/my-status               # Mi estado DET/AF
  POST   /api/detaf/enroll                  # Inscribirse
  POST   /api/detaf/unenroll                # Darse de baja
  GET    /api/detaf/check-eligibility/:id   # Verificar elegibilidad
  GET    /api/detaf/admin/inscriptions      # Admin: inscripciones
  ```

#### **Frontend Renovado**
- **Nueva página**: `client/pages/InscripcionDetAfNew.tsx` con diseño moderno
- **Hook personalizado**: `client/hooks/use-detaf.tsx` para estado global
- **Diseño responsive** con animaciones Framer Motion
- **Tabs para DET/AF** con contadores en tiempo real
- **Estados visuales claros**: inscrito/disponible/sin cupo

#### **Problemas Solucionados**
- **Fix crítico**: Removido constraint único problemático `UQ_Usuario_DET_Activo`
- **Re-inscripciones permitidas** después de darse de baja
- **Token management unificado** evita duplicaciones
- **Transacciones atómicas** previenen overbooking
- **Manejo de errores mejorado** con auto-refresh

---

### SISTEMA DE MATERIAS Y CALIFICACIONES - 16/08/2025

**Implementación completa de gestión académica**

#### **Nuevas Funcionalidades**
- **Cálculo automático de promedios** por materia y general
- **Visualización en tiempo real** de todas las materias
- **Contador de materias aprobadas** (≥70)
- **Total de créditos** automático
- **Soporte para múltiples tipos de evaluación**:
  - Primer Parcial, Segundo Parcial, Ordinario
  - Proyecto, Exámenes Semanales, Calificación Final

#### **Componentes Implementados**
- **Frontend**: `client/pages/Materias.tsx` y `client/pages/MateriasNew.tsx`
- **Backend**: Endpoints en `server/routes/auth.ts`
- **APIs nuevas**:
  - `GET /api/auth/grades` - Obtener calificaciones
  - `GET /api/auth/grades/debug` - Debug de calificaciones

#### **Estadísticas Disponibles**
- Promedio general calculado en tiempo real
- Materias aprobadas vs total
- Suma automática de créditos
- Estado de inscripción ACTIVO/INACTIVO

---

### MEJORAS TÉCNICAS GENERALES

#### **Scripts SQL de Corrección**
- `fix-constraint-proper.sql` - Fix principal de constraints
- `add-fecha-baja-field.sql` - Añade campo fecha_baja
- `fix-detaf-constraint-corrected.sql` - Corrección completa
- `verify-detaf-fix.sql` - Verificación de fixes

#### **Seguridad Mejorada**
- **Autenticación JWT** reforzada en todos los endpoints
- **Middleware `authenticateToken`** estandarizado
- **Validación de permisos** por usuario
- **Encriptación bcrypt** para contraseñas

---

## CAMBIOS RECIENTES - 24/08/2025

### Fix de Constraints de Base de Datos DET/AF
**Problema resuelto**: Error en sistema de bajas de inscripciones DET/AF

**Cambios implementados**:
- **Database Schema Fix**: Removido constraint único problemático `UQ_Usuario_DET_Activo` que impedía re-inscripciones
- **Backend Service Improvements**: Mejorada validación y manejo de errores en `detAfService.ts`
- **Frontend Error Handling**: Añadido manejo específico de errores de constraint con auto-refresh
- **SQL Fix Scripts**: Creados scripts de corrección automática:
  - `fix-constraint-proper.sql` - Fix principal de constraints
  - `add-fecha-baja-field.sql` - Añade campo fecha_baja
  - `fix-detaf-constraint-corrected.sql` - Script de corrección completa

**Funcionalidad restaurada**:
- Usuarios pueden darse de baja de actividades DET/AF sin errores
- Re-inscripción permitida después de baja
- Historial completo de inscripciones mantenido
- Mensajes de error más informativos

**Archivos modificados**:
- `client/hooks/use-detaf.tsx` - Mejor manejo de errores HTTP
- `server/services/detAfService.ts` - Lógica mejorada de inscripción/baja
- Scripts SQL para corrección de base de datos

---

## NUEVA FUNCIONALIDAD: SISTEMA DE MATERIAS Y CALIFICACIONES

### Descripción de la Nueva Funcionalidad
Se ha implementado un **sistema completo de gestión de materias y calificaciones** que permite al estudiante:

**IMPORTANTE: USA "npm install" para instalar todos los requisitos**

-  **Visualizar todas sus materias** con información detallada
-  **Calcular promedios reales** basados en calificaciones oficiales
-  **Ver calificaciones por tipo de evaluación** (parciales, ordinarios, proyectos, etc.)
-  **Calcular promedios ponderados** por porcentaje de evaluación
-  **Acceso a datos en tiempo real** desde la base de datos

### Arquitectura de la Nueva Funcionalidad

#### Componentes Implementados

**Frontend (Client):**
- `client/pages/Materias.tsx` - Interfaz principal de calificaciones
- `client/pages/MateriasNew.tsx` - Nueva versión mejorada con funcionalidades avanzadas
- Componentes de UI actualizados con Tailwind CSS y Framer Motion

**Backend (Server):**
- `server/routes/auth.ts` - Endpoints de calificaciones y autenticación
- `server/services/userService.ts` - Lógica de negocio para cálculo de promedios

#### Endpoints de API Actualizados

**Nuevos endpoints para calificaciones:**
- `GET /api/auth/grades` - Obtener calificaciones del usuario
- `GET /api/auth/grades/debug` - Debug de calificaciones (para desarrollo)

#### Cálculo de Promedios

El sistema calcula automáticamente:

1. **Promedio por materia**: Basado en la calificación final de cada materia
2. **Promedio general**: Promedio de todas las calificaciones finales
3. **Materias aprobadas**: Contador de materias con calificación ≥ 70
4. **Total de créditos**: Suma de créditos de todas las materias

#### Tipos de Evaluación Soportados

- **Primer Parcial** - Evaluación parcial del primer periodo
- **Segundo Parcial** - Evaluación parcial del segundo periodo  
- **Ordinario** - Evaluación ordinaria final
- **Proyecto** - Evaluación de proyecto o trabajo final
- **Exámenes Semanales** - Evaluaciones semanales continuas
- **Calificación Final** - Calificación final ponderada

### Flujo de Datos

1. **Usuario accede a Materias** → Frontend solicita calificaciones
2. **Backend consulta BD** → Obtiene calificaciones reales
3. **Cálculo automático** → Promedios y estadísticas
4. **Visualización** → Datos mostrados en tiempo real

### Estadísticas Disponibles

- **Promedio General**: Calculado en tiempo real
- **Materias Aprobadas**: Contador dinámico
- **Total de Créditos**: Suma automática
- **Estado de Inscripción**: ACTIVO/INACTIVO

### Configuración de Base de Datos

**Tablas principales:**
- `usuarios` - Información de usuarios
- `materias` - Catálogo de materias
- `calificaciones` - Registro de calificaciones por tipo
- `categorias_det_af` - Categorías para inscripciones

**Scripts de inicialización disponibles en:**
- `server/scripts/init-local-db.sql`
- `server/scripts/simple-setup.sql`

### Seguridad

- **Autenticación JWT** para acceso a calificaciones
- **Verificación de usuario** antes de mostrar datos
- **Encriptación de contraseñas** con bcrypt
- **Tokens con expiración** para seguridad mejorada

### Instalaci��n y Configuración

**Requisitos:**
- Node.js 18+
- SQL Server Express
- JWT configurado

**Variables de entorno:**
```bash
SQL_SERVER=localhost
SQL_DATABASE=SIGEA_DB_LOCAL
SQL_USER=sa
SQL_PASSWORD=Pollito92.
SQL_PORT=1433
JWT_SECRET=tu_secreto_jwt
```

### Notas de Implementación

- **Calificaciones reales**: Datos obtenidos directamente de la base de datos
- **Cálculo automático**: Sin intervención manual
- **Actualización en tiempo real**: Cambios reflejados inmediatamente
- **Compatibilidad**: Funciona con cualquier área de estudios

### Próximos Pasos

- Integración con sistema de asistencias
- Modificar asistencias/calificaciones desde la página de profesores
- Reparar funcionalidad de DET/AF
- Terminar secciones en ALUMNO

---

**CAMBIOS REALIZADOS 16/8/25**

**Sistema de Materias y Calificaciones implementado completamente**
**Cálculo de promedios en tiempo real**
**Interfaz de usuario actualizada con funcionalidades avanzadas**
**Endpoints de API optimizados para mejor rendimiento**
**Documentación actualizada con nuevas funcionalidades**


# SIGEA - Sistema de Gestión Escolar Académico

## Descripción General

Este proyecto est�� diseñado para la gestión escolar, permitiendo la administración eficiente de estudiantes, docentes, cursos, calificaciones y procesos académicos en tiempo real. Todo esto con la finalidad de brindar un nuevo diseño de la web de La salle SIGEA. En este Readme.md encontrará las instrucciones para la instalación y configuración del proyecto, asi como información detallada de como modificar, agregar o eliminar funcionalidades. 


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
│   ├��─ config/              # Configuraciones
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

2. **Configuración t��pica**:
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
=======
